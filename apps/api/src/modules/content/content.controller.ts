import { Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import * as contentService from "@/modules/content/content.service.js";
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
      status,
      type,
      platform,
      page = "1",
      limit = "20",
      sort = "createdAt",
      order = "desc",
    } = req.query as Record<string, string>;

    const result = await contentService.listContent({
      clientId,
      status,
      type,
      platform,
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      sort,
      order: order as "asc" | "desc",
    });

    sendPaginated(res, 200, result.items, {
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
    const item = await contentService.getContentById(id);
    sendSuccess(res, 200, item);
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

    const item = await contentService.createContent(
      req.body as contentService.CreateContentInput,
    );

    sendSuccess(res, 201, item);
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

    const { id } = req.params as { id: string };
    const item = await contentService.updateContent(
      id,
      req.body as contentService.UpdateContentInput,
    );

    sendSuccess(res, 200, item);
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
    await contentService.deleteContent(id);
    sendSuccess(res, 200, { message: "Item de conteúdo deletado com sucesso" });
  } catch (error) {
    next(error);
  }
}
