import { prisma } from "@/shared/database/prisma.js";

import { AppError } from "@/shared/errors/AppError.js";


export interface CreateContactInput {
  name: string;
  role?: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  isPrimary?: boolean;
  clientId: string;
}

export interface UpdateContactInput extends Partial<Omit<CreateContactInput, "clientId">> {}

export async function listContacts(clientId: string) {
  const client = await prisma.client.findUnique({ where: { id: clientId } });
  if (!client) throw AppError.notFound("Cliente não encontrado");

  return prisma.contact.findMany({
    where: { clientId },
    orderBy: [{ isPrimary: "desc" }, { createdAt: "asc" }],
  });
}

export async function createContact(input: CreateContactInput) {
  const client = await prisma.client.findUnique({ where: { id: input.clientId } });
  if (!client) throw AppError.notFound("Cliente não encontrado");

  // If setting as primary, demote other primary contacts
  if (input.isPrimary) {
    await prisma.contact.updateMany({
      where: { clientId: input.clientId, isPrimary: true },
      data: { isPrimary: false },
    });
  }

  return prisma.contact.create({
    data: {
      name: input.name,
      role: input.role,
      email: input.email,
      phone: input.phone,
      whatsapp: input.whatsapp,
      isPrimary: input.isPrimary ?? false,
      clientId: input.clientId,
    },
  });
}

export async function updateContact(id: string, input: UpdateContactInput) {
  const existing = await prisma.contact.findUnique({ where: { id } });
  if (!existing) throw AppError.notFound("Contato não encontrado");

  // If setting as primary, demote others
  if (input.isPrimary) {
    await prisma.contact.updateMany({
      where: { clientId: existing.clientId, isPrimary: true, id: { not: id } },
      data: { isPrimary: false },
    });
  }

  return prisma.contact.update({
    where: { id },
    data: {
      ...(input.name && { name: input.name }),
      ...(input.role !== undefined && { role: input.role }),
      ...(input.email !== undefined && { email: input.email }),
      ...(input.phone !== undefined && { phone: input.phone }),
      ...(input.whatsapp !== undefined && { whatsapp: input.whatsapp }),
      ...(input.isPrimary !== undefined && { isPrimary: input.isPrimary }),
    },
  });
}

export async function deleteContact(id: string) {
  const existing = await prisma.contact.findUnique({ where: { id } });
  if (!existing) throw AppError.notFound("Contato não encontrado");

  await prisma.contact.delete({ where: { id } });
}
