import { Response, NextFunction } from "express";
import * as dashboardService from "@/modules/dashboard/dashboard.service.js";
import { sendSuccess } from "@/shared/utils/response.js";
import type { AuthRequest } from "@/modules/auth/auth.middleware.js";

export async function getStats(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const stats = await dashboardService.getDashboardStats();
    sendSuccess(res, 200, stats);
  } catch (error) {
    next(error);
  }
}
