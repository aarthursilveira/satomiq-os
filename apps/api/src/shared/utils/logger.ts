import pino from "pino";
import { config } from "@/config/env.js";

const isDev = config.NODE_ENV === "development";

const logger = pino({
  level: config.LOG_LEVEL,
  ...(isDev
    ? {
        transport: {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "SYS:standard",
            ignore: "pid,hostname",
          },
        },
      }
    : {}),
});

export default logger;
