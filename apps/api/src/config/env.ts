export interface EnvConfig {
  NODE_ENV: "development" | "production" | "test";
  PORT: number;
  DATABASE_URL: string;
  JWT_SECRET: string;
  JWT_REFRESH_SECRET: string;
  JWT_EXPIRATION: string;
  JWT_REFRESH_EXPIRATION: string;
  CORS_ORIGIN: string;
  LOG_LEVEL: "debug" | "info" | "warn" | "error";
  RATE_LIMIT_WINDOW_MS: number;
  RATE_LIMIT_MAX_REQUESTS: number;
}

function getEnv(key: string, defaultValue?: string): string {
  const value = process.env[key];
  if (!value) {
    if (defaultValue !== undefined) {
      return defaultValue;
    }
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

function parseEnvConfig(): EnvConfig {
  const nodeEnv = getEnv("NODE_ENV", "development");
  if (!["development", "production", "test"].includes(nodeEnv)) {
    throw new Error(`Invalid NODE_ENV: ${nodeEnv}`);
  }

  const port = parseInt(getEnv("PORT", "3001"), 10);
  if (isNaN(port) || port < 1 || port > 65535) {
    throw new Error(`Invalid PORT: ${port}`);
  }

  const rateLimitWindowMs = parseInt(
    getEnv("RATE_LIMIT_WINDOW_MS", "900000"),
    10,
  );
  const rateLimitMaxRequests = parseInt(
    getEnv("RATE_LIMIT_MAX_REQUESTS", "100"),
    10,
  );

  return {
    NODE_ENV: nodeEnv as "development" | "production" | "test",
    PORT: port,
    DATABASE_URL: getEnv("DATABASE_URL"),
    JWT_SECRET: getEnv("JWT_SECRET"),
    JWT_REFRESH_SECRET: getEnv("JWT_REFRESH_SECRET"),
    JWT_EXPIRATION: getEnv("JWT_EXPIRATION", "15m"),
    JWT_REFRESH_EXPIRATION: getEnv("JWT_REFRESH_EXPIRATION", "7d"),
    CORS_ORIGIN: getEnv("CORS_ORIGIN", "http://localhost:3000"),
    LOG_LEVEL: (getEnv("LOG_LEVEL", "info") as "debug" | "info" | "warn" | "error"),
    RATE_LIMIT_WINDOW_MS: rateLimitWindowMs,
    RATE_LIMIT_MAX_REQUESTS: rateLimitMaxRequests,
  };
}

export const config = parseEnvConfig();

export default config;
