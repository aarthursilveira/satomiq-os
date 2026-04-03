import { Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import * as tasksService from "@/modules/tasks/tasks.service.js";
import { sendSuccess, sendError, sendPaginated } from "@/shared/utils/response.js";
import type { AuthRequest } from "@/modules/auth/auth.middleware.js";

export async function list(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const {
      clientId,
      projectId,
      assigneeId,
      status,
      priority,
      page = "1",
      limit = "20",
      sort = "createdAt",
      order = "desc",
    } = req.query as Record<string, string>;

    const meId = assigneeId === "me" ? req.user?.userId : assigneeId;

    const result = await tasksService.listTasks({
      clientId,
      projectId,
      assigneeId: meId,
      status,
      priority,
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      sort,
      order: order as "asc" | "desc",
    });

    sendPaginated(res, 200, result.tasks, {
      page: result.page,
      limit: result.limit,
      total: result.total,
    });
  } catch (error) {
    next(error);
  }
}

export async function getById(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { id } = req.params as { id: string };
    const task = await tasksService.getTaskById(id);
    sendSuccess(res, 200, task);
  } catch (error) {
    next(error);
  }
}

export async function create(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      sendError(res, 400, errors.array()[0]?.msg ?? "Validation error");
      return;
    }

    if (!req.user) {
      sendError(res, 401, "Unauthorized");
      return;
    }

    const task = await tasksService.createTask(
      req.body as tasksService.CreateTaskInput,
      req.user.userId,
    );

    sendSuccess(res, 201, task);
  } catch (error) {
    next(error);
  }
}

export async function update(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      sendError(res, 400, errors.array()[0]?.msg ?? "Validation error");
      return;
    }

    if (!req.user) {
      sendError(res, 401, "Unauthorized");
      return;
    }

    const { id } = req.params as { id: string };
    const task = await tasksService.updateTask(
      id,
      req.body as tasksService.UpdateTaskInput,
      req.user.userId,
    );

    sendSuccess(res, 200, task);
  } catch (error) {
    next(error);
  }
}

export async function remove(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { id } = req.params as { id: string };
    await tasksService.deleteTask(id);
    sendSuccess(res, 200, { message: "Tarefa deletada com sucesso" });
  } catch (error) {
    next(error);
  }
}
