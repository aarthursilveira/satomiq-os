import { prisma } from "@/shared/database/prisma.js";
import { Prisma } from "@prisma/client";
import { AppError } from "@/shared/errors/AppError.js";


export interface CreateContentInput {
  title: string;
  description?: string;
  type: "POST" | "STORY" | "REEL" | "CAROUSEL" | "VIDEO" | "BLOG" | "EMAIL_CAMPAIGN";
  platform: string[];
  status?: "IDEA" | "DRAFT" | "IN_REVIEW" | "SCHEDULED" | "PUBLISHED" | "ARCHIVED";
  scheduledAt?: Date;
  publishedAt?: Date;
  mediaUrls?: string[];
  clientId: string;
}

export interface UpdateContentInput extends Partial<Omit<CreateContentInput, "clientId">> {}

export interface ListContentParams {
  clientId?: string;
  status?: string;
  type?: string;
  platform?: string;
  page?: number;
  limit?: number;
  sort?: string;
  order?: "asc" | "desc";
}

export async function listContent(params: ListContentParams) {
  const page = params.page ?? 1;
  const limit = params.limit ?? 20;
  const skip = (page - 1) * limit;
  const sort = params.sort ?? "createdAt";
  const order = params.order ?? "desc";

  const where: Prisma.ContentItemWhereInput = {};

  if (params.clientId) where.clientId = params.clientId;
  if (params.status) where.status = params.status as Prisma.EnumContentStatusFilter;
  if (params.type) where.type = params.type as Prisma.EnumContentTypeFilter;
  if (params.platform) {
    where.platform = { has: params.platform };
  }

  const [items, total] = await prisma.$transaction([
    prisma.contentItem.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [sort]: order },
      include: {
        client: { select: { id: true, name: true, slug: true } },
      },
    }),
    prisma.contentItem.count({ where }),
  ]);

  return { items, total, page, limit };
}

export async function getContentById(id: string) {
  const item = await prisma.contentItem.findUnique({
    where: { id },
    include: {
      client: { select: { id: true, name: true, slug: true } },
    },
  });

  if (!item) throw AppError.notFound("Item de conteúdo não encontrado");

  return item;
}

export async function createContent(input: CreateContentInput) {
  const client = await prisma.client.findUnique({ where: { id: input.clientId } });
  if (!client) throw AppError.notFound("Cliente não encontrado");

  return prisma.contentItem.create({
    data: {
      title: input.title,
      description: input.description,
      type: input.type,
      platform: input.platform,
      status: input.status ?? "IDEA",
      scheduledAt: input.scheduledAt,
      publishedAt: input.publishedAt,
      mediaUrls: input.mediaUrls ?? [],
      clientId: input.clientId,
    },
    include: {
      client: { select: { id: true, name: true, slug: true } },
    },
  });
}

export async function updateContent(id: string, input: UpdateContentInput) {
  const existing = await prisma.contentItem.findUnique({ where: { id } });
  if (!existing) throw AppError.notFound("Item de conteúdo não encontrado");

  return prisma.contentItem.update({
    where: { id },
    data: {
      ...(input.title && { title: input.title }),
      ...(input.description !== undefined && { description: input.description }),
      ...(input.type && { type: input.type }),
      ...(input.platform && { platform: input.platform }),
      ...(input.status && { status: input.status }),
      ...(input.scheduledAt !== undefined && { scheduledAt: input.scheduledAt }),
      ...(input.publishedAt !== undefined && { publishedAt: input.publishedAt }),
      ...(input.mediaUrls && { mediaUrls: input.mediaUrls }),
    },
    include: {
      client: { select: { id: true, name: true, slug: true } },
    },
  });
}

export async function deleteContent(id: string) {
  const existing = await prisma.contentItem.findUnique({ where: { id } });
  if (!existing) throw AppError.notFound("Item de conteúdo não encontrado");

  await prisma.contentItem.delete({ where: { id } });
}
