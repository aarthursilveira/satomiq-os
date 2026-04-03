import { Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import * as notesService from "@/modules/notes/notes.service.js";
import { sendSuccess, sendError, sendPaginated } from "@/shared/utils/response.js";
import type { AuthRequest } from "@/modules/auth/auth.middleware.js";

export async function list(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { clientId, projectId, page = "1", limit = "20" } = req.query as Record<string, string>;

    const result = await notesService.listNotes({
      clientId,
      projectId,
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
    });

    sendPaginated(res, 200, result.notes, {
      page: result.page,
      limit: result.limit,
      total: result.total,
    });
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

    const body = req.body as {
      content: string;
      isPinned?: boolean;
      clientId?: string;
      projectId?: string;
    };

    const note = await notesService.createNote({
      ...body,
      authorId: req.user.userId,
    });

    sendSuccess(res, 201, note);
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
    const note = await notesService.updateNote(
      id,
      req.body as notesService.UpdateNoteInput,
      req.user.userId,
    );

    sendSuccess(res, 200, note);
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
    if (!req.user) {
      sendError(res, 401, "Unauthorized");
      return;
    }

    const { id } = req.params as { id: string };
    await notesService.deleteNote(id, req.user.userId);
    sendSuccess(res, 200, { message: "Nota deletada com sucesso" });
  } catch (error) {
    next(error);
  }
}
