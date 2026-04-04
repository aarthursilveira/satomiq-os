import express, { Express, Request, Response, NextFunction } from "express";
import helmet from "helmet";
import cors from "cors";
import pinoHttp from "pino-http";
import rateLimit from "express-rate-limit";
import { config } from "@/config/env.js";
import logger from "@/shared/utils/logger.js";
import { AppError } from "@/shared/errors/AppError.js";
import { sendError } from "@/shared/utils/response.js";

// Import routes
import authRoutes from "@/modules/auth/auth.routes.js";
import clientsRoutes from "@/modules/clients/clients.routes.js";
import notesRoutes from "@/modules/notes/notes.routes.js";
import activitiesRoutes from "@/modules/activities/activities.routes.js";
import tasksRoutes from "@/modules/tasks/tasks.routes.js";
import pipelinesRoutes from "@/modules/pipelines/pipelines.routes.js";
import contactsRoutes from "@/modules/contacts/contacts.routes.js";
import contentRoutes from "@/modules/content/content.routes.js";
import dashboardRoutes from "@/modules/dashboard/dashboard.routes.js";

export function createApp(): Express {
  const app = express();

  // === SECURITY MIDDLEWARE ===
  app.use(helmet());
  app.use(
    cors({
      origin: config.CORS_ORIGIN.split(",").map((origin) => origin.trim()),
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization"],
    }),
  );

  // === GLOBAL RATE LIMITER ===
  app.use(
    rateLimit({
      windowMs: config.RATE_LIMIT_WINDOW_MS,
      max: config.RATE_LIMIT_MAX_REQUESTS,
      message: { success: false, error: "Too many requests. Try again later." },
      standardHeaders: true,
      legacyHeaders: false,
    }),
  );

  // === LOGGING MIDDLEWARE ===
  if (config.NODE_ENV !== "test") {
    app.use((pinoHttp as any)({ logger }));
  }

  // === BODY PARSING ===
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ limit: "10mb", extended: true }));

  // === HEALTH CHECK ===
  app.get("/health", (_req: Request, res: Response) => {
    res.status(200).json({ status: "ok", timestamp: new Date() });
  });

  // === API ROUTES ===
  app.use("/api/auth", authRoutes);
  app.use("/api/clients", clientsRoutes);

  // Nested client routes
  app.use("/api/clients/:clientId/contacts", contactsRoutes);

  app.use("/api/notes", notesRoutes);
  app.use("/api/activities", activitiesRoutes);
  app.use("/api/tasks", tasksRoutes);
  app.use("/api/pipelines", pipelinesRoutes);
  app.use("/api/content", contentRoutes);
  app.use("/api/dashboard", dashboardRoutes);

  // === 404 HANDLER ===
  app.use((_req: Request, res: Response) => {
    sendError(res, 404, "Route not found");
  });

  // === GLOBAL ERROR HANDLER ===
  app.use(
    (
      error: Error | AppError,
      req: Request,
      res: Response,
      _next: NextFunction,
    ) => {
      if (error instanceof AppError || error.name === "AppError") {
        const appError = error as AppError;
        logger.error(
          { statusCode: appError.statusCode, code: appError.code },
          appError.message,
        );
        sendError(res, appError.statusCode, appError.message);
        return;
      }

      console.error("🔴 [UNHANDLED ERROR EXCEPTION]:", error);
      logger.error(error, "Unhandled error");
      sendError(res, 500, "Internal server error");
    },
  );

  return app;
}
