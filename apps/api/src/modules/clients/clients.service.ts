import { PrismaClient, Prisma } from "@prisma/client";
import { AppError } from "@/shared/errors/AppError.js";
import { slugify } from "@satomiq/shared";
import { ERROR_MESSAGES } from "@satomiq/shared";

const prisma = new PrismaClient();

export interface CreateClientInput {
  name: string;
  type: "PERSON" | "BRAND" | "COMPANY";
  status?: "LEAD" | "PROSPECT" | "ACTIVE" | "PAUSED" | "CHURNED" | "ARCHIVED";
  avatarUrl?: string;
  description?: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  instagram?: string;
  website?: string;
  address?: string;
  contractValue?: number;
  contractStart?: Date;
  contractEnd?: Date;
  paymentDay?: number;
  tags?: string[];
  customFields?: Record<string, unknown>;
}

export interface UpdateClientInput extends Partial<CreateClientInput> {}

export interface ListClientsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  type?: string;
  sort?: string;
  order?: "asc" | "desc";
}

async function generateUniqueSlug(name: string, excludeId?: string): Promise<string> {
  let slug = slugify(name);
  let counter = 0;

  while (true) {
    const candidate = counter === 0 ? slug : `${slug}-${counter}`;
    const existing = await prisma.client.findUnique({
      where: { slug: candidate },
    });

    if (!existing || existing.id === excludeId) {
      return candidate;
    }

    counter++;
  }
}

export async function listClients(params: ListClientsParams) {
  const page = params.page ?? 1;
  const limit = params.limit ?? 20;
  const skip = (page - 1) * limit;
  const order = params.order ?? "desc";
  const sort = params.sort ?? "createdAt";

  const where: Prisma.ClientWhereInput = {};

  if (params.search) {
    where.OR = [
      { name: { contains: params.search, mode: "insensitive" } },
      { email: { contains: params.search, mode: "insensitive" } },
      { description: { contains: params.search, mode: "insensitive" } },
    ];
  }

  if (params.status) {
    where.status = params.status as Prisma.EnumClientStatusFilter;
  }

  if (params.type) {
    where.type = params.type as Prisma.EnumClientTypeFilter;
  }

  const [clients, total] = await prisma.$transaction([
    prisma.client.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [sort]: order },
      include: {
        _count: {
          select: {
            tasks: { where: { status: { not: "DONE" } } },
            notes: true,
            contacts: true,
          },
        },
      },
    }),
    prisma.client.count({ where }),
  ]);

  return { clients, total, page, limit };
}

export async function getClientById(id: string) {
  const client = await prisma.client.findUnique({
    where: { id },
    include: {
      contacts: { orderBy: { isPrimary: "desc" } },
      _count: {
        select: {
          tasks: true,
          notes: true,
          projects: true,
          activities: true,
          contentItems: true,
        },
      },
    },
  });

  if (!client) {
    throw AppError.notFound(ERROR_MESSAGES.CLIENT_NOT_FOUND, "CLIENT_NOT_FOUND");
  }

  return client;
}

export async function createClient(input: CreateClientInput) {
  const slug = await generateUniqueSlug(input.name);

  const client = await prisma.client.create({
    data: {
      name: input.name,
      type: input.type,
      slug,
      status: input.status ?? "ACTIVE",
      avatarUrl: input.avatarUrl,
      description: input.description,
      email: input.email,
      phone: input.phone,
      whatsapp: input.whatsapp,
      instagram: input.instagram,
      website: input.website,
      address: input.address,
      contractValue: input.contractValue
        ? new Prisma.Decimal(input.contractValue)
        : null,
      contractStart: input.contractStart,
      contractEnd: input.contractEnd,
      paymentDay: input.paymentDay,
      tags: input.tags ?? [],
      customFields: input.customFields,
    },
  });

  return client;
}

export async function updateClient(id: string, input: UpdateClientInput) {
  const existing = await prisma.client.findUnique({ where: { id } });

  if (!existing) {
    throw AppError.notFound(ERROR_MESSAGES.CLIENT_NOT_FOUND, "CLIENT_NOT_FOUND");
  }

  const slug =
    input.name && input.name !== existing.name
      ? await generateUniqueSlug(input.name, id)
      : undefined;

  const client = await prisma.client.update({
    where: { id },
    data: {
      ...(input.name && { name: input.name }),
      ...(slug && { slug }),
      ...(input.type && { type: input.type }),
      ...(input.status && { status: input.status }),
      ...(input.avatarUrl !== undefined && { avatarUrl: input.avatarUrl }),
      ...(input.description !== undefined && { description: input.description }),
      ...(input.email !== undefined && { email: input.email }),
      ...(input.phone !== undefined && { phone: input.phone }),
      ...(input.whatsapp !== undefined && { whatsapp: input.whatsapp }),
      ...(input.instagram !== undefined && { instagram: input.instagram }),
      ...(input.website !== undefined && { website: input.website }),
      ...(input.address !== undefined && { address: input.address }),
      ...(input.contractValue !== undefined && {
        contractValue: input.contractValue
          ? new Prisma.Decimal(input.contractValue)
          : null,
      }),
      ...(input.contractStart !== undefined && { contractStart: input.contractStart }),
      ...(input.contractEnd !== undefined && { contractEnd: input.contractEnd }),
      ...(input.paymentDay !== undefined && { paymentDay: input.paymentDay }),
      ...(input.tags !== undefined && { tags: input.tags }),
      ...(input.customFields !== undefined && { customFields: input.customFields }),
    },
  });

  return client;
}

export async function deleteClient(id: string) {
  const existing = await prisma.client.findUnique({ where: { id } });

  if (!existing) {
    throw AppError.notFound(ERROR_MESSAGES.CLIENT_NOT_FOUND, "CLIENT_NOT_FOUND");
  }

  await prisma.client.update({
    where: { id },
    data: { status: "ARCHIVED" },
  });
}
