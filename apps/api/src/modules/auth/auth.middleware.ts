import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "@/config/env.js";
import { AppError } from "@/shared/errors/AppError.js";
import { sendError } from "@/shared/utils/response.js";
import { ERROR_MESSAGES } from "@satomiq/shared";
import type { AuthPayload, UserRole } from "@satomiq/shared";

export interface AuthRequest extends Request {
  user?: AuthPayload;
}

export function authenticate(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    sendError(res, 401, ERROR_MESSAGES.UNAUTHORIZED);
    return;
  }

  const token = authHeader.slice(7);

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET) as AuthPayload;
    req.user = decoded;
    next();
  } catch {
    sendError(res, 401, ERROR_MESSAGES.INVALID_TOKEN);
  }
}

export function requireRole(...roles: UserRole[]) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      sendError(res, 401, ERROR_MESSAGES.UNAUTHORIZED);
      return;
    }

    if (!roles.includes(req.user.role)) {
      sendError(res, 403, ERROR_MESSAGES.FORBIDDEN);
      return;
    }

    next();
  };
}

export function optionalAuthenticate(
  req: AuthRequest,
  _res: Response,
  next: NextFunction,
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    next();
    return;
  }

  const token = authHeader.slice(7);

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET) as AuthPayload;
    req.user = decoded;
  } catch {
    // Token invalid — just proceed without user
  }

  next();
}
