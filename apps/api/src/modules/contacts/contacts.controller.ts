import { Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import * as contactsService from "@/modules/contacts/contacts.service.js";
import { sendSuccess, sendError } from "@/shared/utils/response.js";
import type { AuthRequest } from "@/modules/auth/auth.middleware.js";

export async function listByClient(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { clientId } = req.params as { clientId: string };
    const contacts = await contactsService.listContacts(clientId);
    sendSuccess(res, 200, contacts);
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

    const { clientId } = req.params as { clientId: string };
    const contact = await contactsService.createContact({
      ...(req.body as Omit<contactsService.CreateContactInput, "clientId">),
      clientId,
    });

    sendSuccess(res, 201, contact);
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
    const contact = await contactsService.updateContact(
      id,
      req.body as contactsService.UpdateContactInput,
    );

    sendSuccess(res, 200, contact);
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
    await contactsService.deleteContact(id);
    sendSuccess(res, 200, { message: "Contato deletado com sucesso" });
  } catch (error) {
    next(error);
  }
}
