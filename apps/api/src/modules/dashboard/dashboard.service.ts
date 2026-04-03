import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export interface DashboardStats {
  clients: {
    total: number;
    active: number;
    lead: number;
    prospect: number;
    churned: number;
    newThisMonth: number;
  };
  tasks: {
    total: number;
    todo: number;
    inProgress: number;
    doneThisMonth: number;
    overdue: number;
  };
  content: {
    total: number;
    scheduled: number;
    published: number;
    draft: number;
    publishedThisMonth: number;
  };
  revenue: {
    totalContractValue: number;
    activeClients: number;
    averageContractValue: number;
  };
  recentActivities: Array<{
    id: string;
    type: string;
    title: string;
    description: string | null;
    createdAt: Date;
    client: { id: string; name: string; slug: string };
    user: { id: string; name: string; avatarUrl: string | null };
  }>;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [
    totalClients,
    activeClients,
    leadClients,
    prospectClients,
    churnedClients,
    newClientsThisMonth,
    totalTasks,
    todoTasks,
    inProgressTasks,
    doneTasksThisMonth,
    overdueTasks,
    totalContent,
    scheduledContent,
    publishedContent,
    draftContent,
    publishedThisMonth,
    revenueData,
    recentActivities,
  ] = await prisma.$transaction([
    prisma.client.count(),
    prisma.client.count({ where: { status: "ACTIVE" } }),
    prisma.client.count({ where: { status: "LEAD" } }),
    prisma.client.count({ where: { status: "PROSPECT" } }),
    prisma.client.count({ where: { status: "CHURNED" } }),
    prisma.client.count({ where: { createdAt: { gte: startOfMonth } } }),

    prisma.task.count({ where: { status: { not: "CANCELLED" } } }),
    prisma.task.count({ where: { status: "TODO" } }),
    prisma.task.count({ where: { status: "IN_PROGRESS" } }),
    prisma.task.count({
      where: { status: "DONE", completedAt: { gte: startOfMonth } },
    }),
    prisma.task.count({
      where: {
        status: { notIn: ["DONE", "CANCELLED"] },
        dueDate: { lt: now },
      },
    }),

    prisma.contentItem.count(),
    prisma.contentItem.count({ where: { status: "SCHEDULED" } }),
    prisma.contentItem.count({ where: { status: "PUBLISHED" } }),
    prisma.contentItem.count({ where: { status: "DRAFT" } }),
    prisma.contentItem.count({
      where: { status: "PUBLISHED", publishedAt: { gte: startOfMonth } },
    }),

    prisma.client.aggregate({
      where: { status: "ACTIVE", contractValue: { not: null } },
      _sum: { contractValue: true },
      _avg: { contractValue: true },
      _count: { id: true },
    }),

    prisma.activity.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: {
        client: { select: { id: true, name: true, slug: true } },
        user: { select: { id: true, name: true, avatarUrl: true } },
      },
    }),
  ]);

  return {
    clients: {
      total: totalClients,
      active: activeClients,
      lead: leadClients,
      prospect: prospectClients,
      churned: churnedClients,
      newThisMonth: newClientsThisMonth,
    },
    tasks: {
      total: totalTasks,
      todo: todoTasks,
      inProgress: inProgressTasks,
      doneThisMonth: doneTasksThisMonth,
      overdue: overdueTasks,
    },
    content: {
      total: totalContent,
      scheduled: scheduledContent,
      published: publishedContent,
      draft: draftContent,
      publishedThisMonth: publishedThisMonth,
    },
    revenue: {
      totalContractValue: revenueData._sum.contractValue
        ? Number(revenueData._sum.contractValue)
        : 0,
      activeClients: revenueData._count.id,
      averageContractValue: revenueData._avg.contractValue
        ? Number(revenueData._avg.contractValue)
        : 0,
    },
    recentActivities,
  };
}
