import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import * as authService from "@/modules/auth/auth.service.js";
import { sendSuccess, sendError } from "@/shared/utils/response.js";
import type { AuthRequest } from "@/modules/auth/auth.middleware.js";

export async function register(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      sendError(res, 400, errors.array()[0]?.msg ?? "Validation error");
      return;
    }

    const { name, email, password } = req.body as {
      name: string;
      email: string;
      password: string;
    };

    const result = await authService.registerUser({ name, email, password });

    sendSuccess(res, 201, result);
  } catch (error) {
    next(error);
  }
}

export async function login(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      sendError(res, 400, errors.array()[0]?.msg ?? "Validation error");
      return;
    }

    const { email, password } = req.body as {
      email: string;
      password: string;
    };

    const result = await authService.loginUser({ email, password });

    sendSuccess(res, 200, result);
  } catch (error) {
    next(error);
  }
}

export async function refresh(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      sendError(res, 400, errors.array()[0]?.msg ?? "Validation error");
      return;
    }

    const { refreshToken } = req.body as { refreshToken: string };
    const tokens = await authService.refreshTokens(refreshToken);

    sendSuccess(res, 200, tokens);
  } catch (error) {
    next(error);
  }
}

export async function profile(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.user) {
      sendError(res, 401, "Unauthorized");
      return;
    }

    const user = await authService.getProfile(req.user.userId);
    sendSuccess(res, 200, user);
  } catch (error) {
    next(error);
  }
}
