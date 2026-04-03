import { Response, NextFunction } from "express";
import * as activitiesService from "@/modules/activities/activities.service.js";
import { sendSuccess, sendError, sendPaginated } from "@/shared/utils/response.js";
import type { AuthRequest } from "@/modules/auth/auth.middleware.js";

export async function list(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { clientId, page = "1", limit = "30" } = req.query as Record<string, string>;

    const result = await activitiesService.listActivities({
      clientId,
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
    });

    sendPaginated(res, 200, result.activities, {
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
    if (!req.user) {
      sendError(res, 401, "Unauthorized");
      return;
    }

    const body = req.body as {
      type: string;
      title: string;
      description?: string;
      metadata?: Record<string, unknown>;
      clientId: string;
    };

    const activity = await activitiesService.createActivity({
      ...body,
      userId: req.user.userId,
    });

    sendSuccess(res, 201, activity);
  } catch (error) {
    next(error);
  }
}
