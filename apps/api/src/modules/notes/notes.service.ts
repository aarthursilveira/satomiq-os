import { PrismaClient, Prisma } from "@prisma/client";
import { AppError } from "@/shared/errors/AppError.js";
import { ERROR_MESSAGES } from "@satomiq/shared";
import * as activitiesService from "@/modules/activities/activities.service.js";

const prisma = new PrismaClient();

export interface CreateNoteInput {
  content: string;
  isPinned?: boolean;
  clientId?: string;
  projectId?: string;
  authorId: string;
}

export interface UpdateNoteInput {
  content?: string;
  isPinned?: boolean;
}

export interface ListNotesParams {
  clientId?: string;
  projectId?: string;
  page?: number;
  limit?: number;
}

export async function listNotes(params: ListNotesParams) {
  const page = params.page ?? 1;
  const limit = params.limit ?? 20;
  const skip = (page - 1) * limit;

  const where: Prisma.NoteWhereInput = {};

  if (params.clientId) where.clientId = params.clientId;
  if (params.projectId) where.projectId = params.projectId;

  const [notes, total] = await prisma.$transaction([
    prisma.note.findMany({
      where,
      skip,
      take: limit,
      orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
      include: {
        author: {
          select: { id: true, name: true, avatarUrl: true },
        },
      },
    }),
    prisma.note.count({ where }),
  ]);

  return { notes, total, page, limit };
}

export async function getNoteById(id: string) {
  const note = await prisma.note.findUnique({
    where: { id },
    include: {
      author: {
        select: { id: true, name: true, avatarUrl: true },
      },
    },
  });

  if (!note) {
    throw AppError.notFound(ERROR_MESSAGES.NOTE_NOT_FOUND, "NOTE_NOT_FOUND");
  }

  return note;
}

export async function createNote(input: CreateNoteInput) {
  if (!input.clientId && !input.projectId) {
    throw AppError.badRequest("Nota deve ser vinculada a um cliente ou projeto");
  }

  const note = await prisma.note.create({
    data: {
      content: input.content,
      isPinned: input.isPinned ?? false,
      clientId: input.clientId,
      projectId: input.projectId,
      authorId: input.authorId,
    },
    include: {
      author: {
        select: { id: true, name: true, avatarUrl: true },
      },
    },
  });

  // Register activity for client notes
  if (input.clientId) {
    await activitiesService.createActivity({
      type: "NOTE_ADDED",
      title: "Nota adicionada",
      description: input.content.slice(0, 100),
      clientId: input.clientId,
      userId: input.authorId,
    });
  }

  return note;
}

export async function updateNote(id: string, input: UpdateNoteInput, userId: string) {
  const existing = await prisma.note.findUnique({ where: { id } });

  if (!existing) {
    throw AppError.notFound(ERROR_MESSAGES.NOTE_NOT_FOUND, "NOTE_NOT_FOUND");
  }

  if (existing.authorId !== userId) {
    throw AppError.forbidden("Apenas o autor pode editar esta nota");
  }

  const note = await prisma.note.update({
    where: { id },
    data: {
      ...(input.content !== undefined && { content: input.content }),
      ...(input.isPinned !== undefined && { isPinned: input.isPinned }),
    },
    include: {
      author: {
        select: { id: true, name: true, avatarUrl: true },
      },
    },
  });

  return note;
}

export async function deleteNote(id: string, userId: string) {
  const existing = await prisma.note.findUnique({ where: { id } });

  if (!existing) {
    throw AppError.notFound(ERROR_MESSAGES.NOTE_NOT_FOUND, "NOTE_NOT_FOUND");
  }

  if (existing.authorId !== userId) {
    throw AppError.forbidden("Apenas o autor pode deletar esta nota");
  }

  await prisma.note.delete({ where: { id } });
}
