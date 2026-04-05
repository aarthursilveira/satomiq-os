import { prisma } from "@/shared/database/prisma.js";
import { Prisma } from "@prisma/client";
import { AppError } from "@/shared/errors/AppError.js";
import { ERROR_MESSAGES } from "@satomiq/shared";
import * as activitiesService from "@/modules/activities/activities.service.js";


export interface CreateTaskInput {
  title: string;
  description?: string;
  status?: "TODO" | "IN_PROGRESS" | "REVIEW" | "DONE" | "CANCELLED";
  priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  dueDate?: Date;
  projectId?: string;
  clientId?: string;
  assigneeId?: string;
}

export interface UpdateTaskInput extends Partial<Omit<CreateTaskInput, "projectId" | "clientId" | "assigneeId">> {
  assigneeId?: string | null;
}

export interface ListTasksParams {
  clientId?: string;
  projectId?: string;
  assigneeId?: string;
  status?: string;
  priority?: string;
  page?: number;
  limit?: number;
  sort?: string;
  order?: "asc" | "desc";
}

export async function listTasks(params: ListTasksParams) {
  const page = params.page ?? 1;
  const limit = params.limit ?? 20;
  const skip = (page - 1) * limit;
  const sort = params.sort ?? "createdAt";
  const order = params.order ?? "desc";

  const where: Prisma.TaskWhereInput = {};

  if (params.clientId) where.clientId = params.clientId;
  if (params.projectId) where.projectId = params.projectId;
  if (params.assigneeId) where.assigneeId = params.assigneeId;
  if (params.status) where.status = params.status as Prisma.EnumTaskStatusFilter;
  if (params.priority) where.priority = params.priority as Prisma.EnumPriorityFilter;

  const [tasks, total] = await prisma.$transaction([
    prisma.task.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [sort]: order },
      include: {
        assignee: { select: { id: true, name: true, avatarUrl: true } },
        client: { select: { id: true, name: true, slug: true } },
        project: { select: { id: true, name: true } },
      },
    }),
    prisma.task.count({ where }),
  ]);

  return { tasks, total, page, limit };
}

export async function getTaskById(id: string) {
  const task = await prisma.task.findUnique({
    where: { id },
    include: {
      assignee: { select: { id: true, name: true, avatarUrl: true } },
      client: { select: { id: true, name: true, slug: true } },
      project: { select: { id: true, name: true } },
    },
  });

  if (!task) {
    throw AppError.notFound(ERROR_MESSAGES.TASK_NOT_FOUND, "TASK_NOT_FOUND");
  }

  return task;
}

export async function createTask(input: CreateTaskInput, creatorId: string) {
  const task = await prisma.task.create({
    data: {
      title: input.title,
      description: input.description,
      status: input.status ?? "TODO",
      priority: input.priority ?? "MEDIUM",
      dueDate: input.dueDate,
      projectId: input.projectId,
      clientId: input.clientId,
      assigneeId: input.assigneeId,
    },
    include: {
      assignee: { select: { id: true, name: true, avatarUrl: true } },
      client: { select: { id: true, name: true, slug: true } },
      project: { select: { id: true, name: true } },
    },
  });

  if (task.clientId) {
    await activitiesService.createActivity({
      type: "TASK_COMPLETED",
      title: "Tarefa criada",
      description: task.title,
      clientId: task.clientId,
      userId: creatorId,
    });
  }

  return task;
}

export async function updateTask(
  id: string,
  input: UpdateTaskInput,
  userId: string,
) {
  const existing = await prisma.task.findUnique({ where: { id } });

  if (!existing) {
    throw AppError.notFound(ERROR_MESSAGES.TASK_NOT_FOUND, "TASK_NOT_FOUND");
  }

  const wasCompleted =
    existing.status !== "DONE" && input.status === "DONE";

  const task = await prisma.task.update({
    where: { id },
    data: {
      ...(input.title && { title: input.title }),
      ...(input.description !== undefined && { description: input.description }),
      ...(input.status && { status: input.status }),
      ...(input.priority && { priority: input.priority }),
      ...(input.dueDate !== undefined && { dueDate: input.dueDate }),
      ...(input.assigneeId !== undefined && { assigneeId: input.assigneeId }),
      ...(input.status === "DONE" && !existing.completedAt
        ? { completedAt: new Date() }
        : {}),
    },
    include: {
      assignee: { select: { id: true, name: true, avatarUrl: true } },
      client: { select: { id: true, name: true, slug: true } },
      project: { select: { id: true, name: true } },
    },
  });

  // Register activity when task is completed
  if (wasCompleted && task.clientId) {
    await activitiesService.createActivity({
      type: "TASK_COMPLETED",
      title: "Tarefa concluída",
      description: task.title,
      clientId: task.clientId,
      userId,
    });
  }

  return task;
}

export async function deleteTask(id: string) {
  const existing = await prisma.task.findUnique({ where: { id } });

  if (!existing) {
    throw AppError.notFound(ERROR_MESSAGES.TASK_NOT_FOUND, "TASK_NOT_FOUND");
  }

  await prisma.task.delete({ where: { id } });
}
