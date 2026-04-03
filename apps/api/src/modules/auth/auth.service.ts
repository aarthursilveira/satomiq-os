import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "@/config/env.js";
import { AppError } from "@/shared/errors/AppError.js";
import { SECURITY, ERROR_MESSAGES } from "@satomiq/shared";
import type { AuthPayload, TokenPair, User, UserRole } from "@satomiq/shared";

const prisma = new PrismaClient();

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthResult {
  user: Omit<User, "updatedAt">;
  tokens: TokenPair;
}

function signAccessToken(payload: AuthPayload): string {
  return jwt.sign(payload, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRATION,
  } as jwt.SignOptions);
}

function signRefreshToken(payload: AuthPayload): string {
  return jwt.sign(payload, config.JWT_REFRESH_SECRET, {
    expiresIn: config.JWT_REFRESH_EXPIRATION,
  } as jwt.SignOptions);
}

function buildAuthPayload(user: {
  id: string;
  email: string;
  role: string;
}): AuthPayload {
  return {
    userId: user.id,
    email: user.email,
    role: user.role as UserRole,
  };
}

export async function registerUser(input: RegisterInput): Promise<AuthResult> {
  const existing = await prisma.user.findUnique({
    where: { email: input.email.toLowerCase() },
  });

  if (existing) {
    throw AppError.conflict(ERROR_MESSAGES.DUPLICATE_EMAIL, "DUPLICATE_EMAIL");
  }

  const passwordHash = await bcrypt.hash(
    input.password,
    SECURITY.BCRYPT_SALT_ROUNDS,
  );

  const user = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email.toLowerCase(),
      passwordHash,
      role: "ADMIN",
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      avatarUrl: true,
      createdAt: true,
    },
  });

  const payload = buildAuthPayload(user);
  const tokens: TokenPair = {
    accessToken: signAccessToken(payload),
    refreshToken: signRefreshToken(payload),
  };

  return {
    user: { ...user, updatedAt: new Date() },
    tokens,
  };
}

export async function loginUser(input: LoginInput): Promise<AuthResult> {
  const user = await prisma.user.findUnique({
    where: { email: input.email.toLowerCase() },
  });

  if (!user) {
    throw AppError.unauthorized(
      ERROR_MESSAGES.INVALID_CREDENTIALS,
      "INVALID_CREDENTIALS",
    );
  }

  const isValidPassword = await bcrypt.compare(
    input.password,
    user.passwordHash,
  );

  if (!isValidPassword) {
    throw AppError.unauthorized(
      ERROR_MESSAGES.INVALID_CREDENTIALS,
      "INVALID_CREDENTIALS",
    );
  }

  const payload = buildAuthPayload(user);
  const tokens: TokenPair = {
    accessToken: signAccessToken(payload),
    refreshToken: signRefreshToken(payload),
  };

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role as UserRole,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
    tokens,
  };
}

export async function refreshTokens(refreshToken: string): Promise<TokenPair> {
  let decoded: AuthPayload;

  try {
    decoded = jwt.verify(refreshToken, config.JWT_REFRESH_SECRET) as AuthPayload;
  } catch {
    throw AppError.unauthorized(ERROR_MESSAGES.INVALID_TOKEN, "INVALID_TOKEN");
  }

  const user = await prisma.user.findUnique({
    where: { id: decoded.userId },
  });

  if (!user) {
    throw AppError.unauthorized(ERROR_MESSAGES.USER_NOT_FOUND, "USER_NOT_FOUND");
  }

  const payload = buildAuthPayload(user);

  return {
    accessToken: signAccessToken(payload),
    refreshToken: signRefreshToken(payload),
  };
}

export async function getProfile(userId: string): Promise<User> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      avatarUrl: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw AppError.notFound(ERROR_MESSAGES.USER_NOT_FOUND, "USER_NOT_FOUND");
  }

  return { ...user, role: user.role as UserRole };
}
