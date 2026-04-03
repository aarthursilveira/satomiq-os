import { createApp } from "@/app.js";
import { config } from "@/config/env.js";
import logger from "@/shared/utils/logger.js";
import { PrismaClient } from "@prisma/client";

const app = createApp();
const prisma = new PrismaClient();

async function startServer(): Promise<void> {
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;
    logger.info("✅ Database connected");

    const server = app.listen(config.PORT, "0.0.0.0", () => {
      logger.info(`🚀 Server running on port ${config.PORT}`);
      logger.info(`📝 Environment: ${config.NODE_ENV}`);
    });

    // Graceful shutdown
    const gracefulShutdown = async (): Promise<void> => {
      logger.info("🛑 Shutting down gracefully...");
      server.close(async () => {
        await prisma.$disconnect();
        logger.info("✅ Server stopped");
        process.exit(0);
      });
    };

    process.on("SIGTERM", gracefulShutdown);
    process.on("SIGINT", gracefulShutdown);
  } catch (error) {
    logger.error(error, "Failed to start server");
    await prisma.$disconnect();
    process.exit(1);
  }
}

startServer();
