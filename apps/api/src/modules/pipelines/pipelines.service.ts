import { prisma } from "@/shared/database/prisma.js";
import { Prisma } from "@prisma/client";
import { AppError } from "@/shared/errors/AppError.js";


export async function listPipelines() {
  return prisma.pipeline.findMany({
    orderBy: [{ isDefault: "desc" }, { createdAt: "asc" }],
    include: {
      stages: {
        orderBy: { order: "asc" },
        include: {
          _count: { select: { entries: true } },
        },
      },
    },
  });
}

export async function getPipelineById(id: string) {
  const pipeline = await prisma.pipeline.findUnique({
    where: { id },
    include: {
      stages: {
        orderBy: { order: "asc" },
        include: {
          entries: {
            include: {
              client: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                  avatarUrl: true,
                  status: true,
                  type: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!pipeline) {
    throw AppError.notFound("Pipeline não encontrado");
  }

  return pipeline;
}

export async function createPipeline(data: {
  name: string;
  isDefault?: boolean;
  stages?: Array<{ name: string; color: string; order: number }>;
}) {
  return prisma.pipeline.create({
    data: {
      name: data.name,
      isDefault: data.isDefault ?? false,
      stages: data.stages
        ? { create: data.stages }
        : undefined,
    },
    include: {
      stages: { orderBy: { order: "asc" } },
    },
  });
}

export async function addStage(pipelineId: string, data: {
  name: string;
  color: string;
  order?: number;
}) {
  const pipeline = await prisma.pipeline.findUnique({ where: { id: pipelineId } });
  if (!pipeline) throw AppError.notFound("Pipeline não encontrado");

  const maxOrder = await prisma.pipelineStage.aggregate({
    where: { pipelineId },
    _max: { order: true },
  });

  return prisma.pipelineStage.create({
    data: {
      name: data.name,
      color: data.color,
      order: data.order ?? (maxOrder._max.order ?? -1) + 1,
      pipelineId,
    },
  });
}

export async function getPipelineEntries(pipelineId: string) {
  const pipeline = await prisma.pipeline.findUnique({
    where: { id: pipelineId },
    include: {
      stages: {
        orderBy: { order: "asc" },
        include: {
          entries: {
            orderBy: { enteredAt: "desc" },
            include: {
              client: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                  avatarUrl: true,
                  status: true,
                  type: true,
                  contractValue: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!pipeline) {
    throw AppError.notFound("Pipeline não encontrado");
  }

  return pipeline;
}

export async function moveEntry(entryId: string, targetStageId: string) {
  const entry = await prisma.pipelineEntry.findUnique({
    where: { id: entryId },
    include: { stage: { include: { pipeline: true } } },
  });

  if (!entry) throw AppError.notFound("Entry não encontrada");

  const targetStage = await prisma.pipelineStage.findUnique({
    where: { id: targetStageId },
  });

  if (!targetStage) throw AppError.notFound("Stage não encontrada");

  if (entry.stage.pipelineId !== targetStage.pipelineId) {
    throw AppError.badRequest("Stages pertencem a pipelines diferentes");
  }

  return prisma.pipelineEntry.update({
    where: { id: entryId },
    data: { stageId: targetStageId },
    include: {
      client: {
        select: {
          id: true,
          name: true,
          slug: true,
          avatarUrl: true,
        },
      },
      stage: true,
    },
  });
}

export async function createEntry(data: {
  clientId: string;
  stageId: string;
  value?: number;
  notes?: string;
}) {
  const stage = await prisma.pipelineStage.findUnique({ where: { id: data.stageId } });
  if (!stage) throw AppError.notFound("Stage não encontrada");

  const client = await prisma.client.findUnique({ where: { id: data.clientId } });
  if (!client) throw AppError.notFound("Cliente não encontrado");

  return prisma.pipelineEntry.create({
    data: {
      clientId: data.clientId,
      stageId: data.stageId,
      value: data.value ? new Prisma.Decimal(data.value) : null,
      notes: data.notes,
    },
    include: {
      client: {
        select: {
          id: true,
          name: true,
          slug: true,
          avatarUrl: true,
        },
      },
      stage: true,
    },
  });
}

export async function deleteEntry(entryId: string) {
  const entry = await prisma.pipelineEntry.findUnique({ where: { id: entryId } });
  if (!entry) throw AppError.notFound("Entry não encontrada");

  await prisma.pipelineEntry.delete({ where: { id: entryId } });
}
