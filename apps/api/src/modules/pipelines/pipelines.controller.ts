import { Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import * as pipelinesService from "@/modules/pipelines/pipelines.service.js";
import { sendSuccess, sendError } from "@/shared/utils/response.js";
import type { AuthRequest } from "@/modules/auth/auth.middleware.js";

export async function list(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const pipelines = await pipelinesService.listPipelines();
    sendSuccess(res, 200, pipelines);
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
    const pipeline = await pipelinesService.getPipelineById(id);
    sendSuccess(res, 200, pipeline);
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

    const pipeline = await pipelinesService.createPipeline(
      req.body as {
        name: string;
        isDefault?: boolean;
        stages?: Array<{ name: string; color: string; order: number }>;
      },
    );

    sendSuccess(res, 201, pipeline);
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
    const pipeline = await pipelinesService.updatePipeline(
      id,
      req.body as { name?: string; description?: string; color?: string; isDefault?: boolean },
    );

    sendSuccess(res, 200, pipeline);
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
    await pipelinesService.deletePipeline(id);
    sendSuccess(res, 200, { message: "Pipeline removido com sucesso" });
  } catch (error) {
    next(error);
  }
}

export async function createStage(
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
    const stage = await pipelinesService.addStage(
      id,
      req.body as { name: string; color: string; order?: number },
    );

    sendSuccess(res, 201, stage);
  } catch (error) {
    next(error);
  }
}

export async function updateStage(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { stageId } = req.params as { stageId: string };
    const stage = await pipelinesService.updateStage(
      stageId,
      req.body as { name?: string; color?: string; order?: number },
    );

    sendSuccess(res, 200, stage);
  } catch (error) {
    next(error);
  }
}

export async function deleteStage(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { stageId } = req.params as { stageId: string };
    await pipelinesService.deleteStage(stageId);
    sendSuccess(res, 200, { message: "Stage removida com sucesso" });
  } catch (error) {
    next(error);
  }
}

export async function getEntries(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { id } = req.params as { id: string };
    const pipeline = await pipelinesService.getPipelineEntries(id);
    sendSuccess(res, 200, pipeline);
  } catch (error) {
    next(error);
  }
}

export async function moveEntry(
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

    const { entryId } = req.params as { entryId: string };
    const { stageId } = req.body as { stageId: string };

    const entry = await pipelinesService.moveEntry(entryId, stageId);
    sendSuccess(res, 200, entry);
  } catch (error) {
    next(error);
  }
}

export async function createEntry(
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

    const entry = await pipelinesService.createEntry(
      req.body as {
        clientId: string;
        stageId: string;
        value?: number;
        notes?: string;
      },
    );

    sendSuccess(res, 201, entry);
  } catch (error) {
    next(error);
  }
}

export async function deleteEntry(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { entryId } = req.params as { entryId: string };
    await pipelinesService.deleteEntry(entryId);
    sendSuccess(res, 200, { message: "Entry removida com sucesso" });
  } catch (error) {
    next(error);
  }
}
