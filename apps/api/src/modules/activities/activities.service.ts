import { prisma } from "@/shared/database/prisma.js";
import { ActivityType, Prisma } from "@prisma/client";


export interface CreateActivityInput {
  type: ActivityType | string;
  title: string;
  description?: string;
  metadata?: Record<string, unknown>;
  clientId: string;
  userId: string;
}

export interface ListActivitiesParams {
  clientId?: string;
  page?: number;
  limit?: number;
}

export async function listActivities(params: ListActivitiesParams) {
  const page = params.page ?? 1;
  const limit = params.limit ?? 30;
  const skip = (page - 1) * limit;

  const where: Prisma.ActivityWhereInput = {};
  if (params.clientId) where.clientId = params.clientId;

  const [activities, total] = await prisma.$transaction([
    prisma.activity.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { id: true, name: true, avatarUrl: true },
        },
        client: {
          select: { id: true, name: true, slug: true },
        },
      },
    }),
    prisma.activity.count({ where }),
  ]);

  return { activities, total, page, limit };
}

export async function createActivity(input: CreateActivityInput) {
  const activity = await prisma.activity.create({
    data: {
      type: input.type as ActivityType,
      title: input.title,
      description: input.description,
      metadata: input.metadata as Prisma.InputJsonValue ?? Prisma.JsonNull,
      clientId: input.clientId,
      userId: input.userId,
    },
    include: {
      user: {
        select: { id: true, name: true, avatarUrl: true },
      },
    },
  });

  return activity;
}
