import { Response } from "express";
import { ApiResponse, PaginationParams } from "@satomiq/shared";

export function sendSuccess<T>(
  res: Response,
  statusCode: number,
  data: T,
  meta?: Record<string, unknown>,
): Response {
  const response: ApiResponse<T> = {
    success: true,
    data,
    meta,
  };
  return res.status(statusCode).json(response);
}

export function sendError(
  res: Response,
  statusCode: number,
  error: string,
): Response {
  const response = {
    success: false,
    error,
  };
  return res.status(statusCode).json(response);
}

export function sendPaginated<T>(
  res: Response,
  statusCode: number,
  data: T[],
  pagination: {
    page: number;
    limit: number;
    total: number;
  },
): Response {
  const totalPages = Math.ceil(pagination.total / pagination.limit);
  const response: ApiResponse<T[]> = {
    success: true,
    data,
    meta: {
      page: pagination.page,
      limit: pagination.limit,
      total: pagination.total,
      totalPages,
    },
  };
  return res.status(statusCode).json(response);
}
