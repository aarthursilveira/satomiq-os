import { Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import * as clientsService from "@/modules/clients/clients.service.js";
import { sendSuccess, sendError, sendPaginated } from "@/shared/utils/response.js";
import type { AuthRequest } from "@/modules/auth/auth.middleware.js";

export async function list(
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

    const {
      page = "1",
      limit = "20",
      search,
      status,
      type,
      sort = "createdAt",
      order = "desc",
    } = req.query as Record<string, string>;

    const result = await clientsService.listClients({
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      search,
      status,
      type,
      sort,
      order: order as "asc" | "desc",
    });

    sendPaginated(res, 200, result.clients, {
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
    const client = await clientsService.getClientById(id);
    sendSuccess(res, 200, client);
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

    const client = await clientsService.createClient(req.body as clientsService.CreateClientInput);
    sendSuccess(res, 201, client);
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
    const client = await clientsService.updateClient(id, req.body as clientsService.UpdateClientInput);
    sendSuccess(res, 200, client);
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
    await clientsService.deleteClient(id);
    sendSuccess(res, 200, { message: "Cliente arquivado com sucesso" });
  } catch (error) {
    next(error);
  }
}
