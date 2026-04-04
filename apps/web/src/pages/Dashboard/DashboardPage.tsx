import { motion } from "framer-motion";
import {
  Users,
  CheckSquare,
  FileText,
  DollarSign,
  TrendingUp,
  Clock,
  AlertTriangle,
  Activity,
} from "lucide-react";
import { useDashboard } from "@/hooks/useDashboard.js";
import { Skeleton } from "@/components/feedback/Skeleton.js";
import { Avatar } from "@/components/ui/Avatar.js";
import { StatusBadge } from "@/components/ui/Badge.js";
import { formatCurrency, formatRelativeTime } from "@satomiq/shared";
import { cn } from "@/lib/cn.js";

interface DashboardStats {
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
    createdAt: string;
    client: { id: string; name: string; slug: string };
    user: { id: string; name: string; avatarUrl: string | null };
  }>;
}

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: { value: string; positive: boolean };
  accent?: boolean;
  delay?: number;
}

function KpiCard({ title, value, subtitle, icon, trend, accent, delay = 0 }: KpiCardProps): JSX.Element {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className={cn(
        "card p-5 hover:border-border-default hover:-translate-y-0.5 hover:shadow-elevated transition-all duration-200",
        accent && "border-accent-subtle bg-accent-subtle/20",
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className={cn(
            "w-9 h-9 rounded-lg flex items-center justify-center",
            accent ? "bg-accent-primary/20 text-accent-hover" : "bg-bg-tertiary text-text-tertiary",
          )}
        >
          {icon}
        </div>
        {trend && (
          <span
            className={cn(
              "text-xs font-medium px-1.5 py-0.5 rounded",
              trend.positive
                ? "text-status-success bg-status-success/10"
                : "text-status-error bg-status-error/10",
            )}
          >
            {trend.value}
          </span>
        )}
      </div>
      <p className={cn("text-2xl font-semibold tracking-tight font-display", accent ? "text-text-primary" : "text-text-primary")}>
        {value}
      </p>
      <p className="text-xs text-text-secondary mt-0.5 font-medium">{title}</p>
      {subtitle && <p className="text-xs text-text-tertiary mt-1">{subtitle}</p>}
    </motion.div>
  );
}

function ActivityFeedItem({
  activity,
  delay,
}: {
  activity: DashboardStats["recentActivities"][number];
  delay: number;
}): JSX.Element {
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2, delay }}
      className="flex items-start gap-3 py-3 border-b border-border-subtle last:border-0"
    >
      <Avatar name={activity.user.name} src={activity.user.avatarUrl} size="sm" className="mt-0.5 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-text-primary font-medium truncate">{activity.title}</p>
        <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
          <span className="text-xs text-text-tertiary truncate">{activity.client.name}</span>
          <span className="text-text-tertiary">·</span>
          <span className="text-xs text-text-tertiary">
            {formatRelativeTime(activity.createdAt)}
          </span>
        </div>
        {activity.description && (
          <p className="text-xs text-text-tertiary mt-0.5 line-clamp-1">{activity.description}</p>
        )}
      </div>
      <StatusBadge status={activity.type.replace(/_/g, " ")} className="flex-shrink-0" />
    </motion.div>
  );
}

export default function DashboardPage(): JSX.Element {
  const { data: stats, isLoading } = useDashboard();
  const s = stats as DashboardStats | undefined;

  const kpis: KpiCardProps[] = s
    ? [
        {
          title: "Clientes Ativos",
          value: s.clients.active,
          subtitle: `${s.clients.total} total · ${s.clients.newThisMonth} novos este mês`,
          icon: <Users className="w-4 h-4" />,
          accent: true,
          delay: 0,
        },
        {
          title: "MRR Total",
          value: formatCurrency(s.revenue.totalContractValue),
          subtitle: `Média: ${formatCurrency(s.revenue.averageContractValue)}/cliente`,
          icon: <DollarSign className="w-4 h-4" />,
          delay: 0.05,
        },
        {
          title: "Tarefas Abertas",
          value: s.tasks.todo + s.tasks.inProgress,
          subtitle: `${s.tasks.doneThisMonth} concluídas este mês`,
          icon: <CheckSquare className="w-4 h-4" />,
          trend: s.tasks.overdue > 0
            ? { value: `${s.tasks.overdue} atrasadas`, positive: false }
            : undefined,
          delay: 0.1,
        },
        {
          title: "Conteúdo Agendado",
          value: s.content.scheduled,
          subtitle: `${s.content.publishedThisMonth} publicados este mês`,
          icon: <FileText className="w-4 h-4" />,
          delay: 0.15,
        },
        {
          title: "Leads no Funil",
          value: s.clients.lead + s.clients.prospect,
          subtitle: `${s.clients.lead} leads · ${s.clients.prospect} prospects`,
          icon: <TrendingUp className="w-4 h-4" />,
          delay: 0.2,
        },
        {
          title: "Tarefas Atrasadas",
          value: s.tasks.overdue,
          subtitle: s.tasks.overdue > 0 ? "Requerem atenção" : "Tudo em dia!",
          icon: <AlertTriangle className="w-4 h-4" />,
          trend: s.tasks.overdue === 0 ? { value: "Em dia", positive: true } : undefined,
          delay: 0.25,
        },
      ]
    : [];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-semibold text-text-primary font-display tracking-tight">
          Dashboard
        </h1>
        <p className="text-sm text-text-tertiary mt-0.5">
          Visão geral das operações da SAtomiq
        </p>
      </motion.div>

      {/* KPI Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="card p-5">
              <Skeleton className="w-9 h-9 rounded-lg mb-3" />
              <Skeleton className="h-7 w-2/3 mb-1.5" />
              <Skeleton className="h-3 w-full" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {kpis.map((kpi, i) => (
            <KpiCard key={i} {...kpi} />
          ))}
        </div>
      )}

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Activities */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="card p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-4 h-4 text-text-tertiary" />
            <h2 className="text-sm font-semibold text-text-primary">
              Atividades Recentes
            </h2>
          </div>

          {isLoading ? (
            <div className="flex flex-col gap-0">
              {Array.from({ length: 5 }, (_, i) => (
                <div key={i} className="flex items-center gap-3 py-3 border-b border-border-subtle">
                  <Skeleton circle className="w-8 h-8" />
                  <div className="flex-1">
                    <Skeleton className="h-3.5 w-3/4 mb-1.5" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : s?.recentActivities.length ? (
            <div>
              {s.recentActivities.slice(0, 7).map((activity, i) => (
                <ActivityFeedItem key={activity.id} activity={activity} delay={0.05 * i} />
              ))}
            </div>
          ) : (
            <div className="py-8 text-center">
              <p className="text-sm text-text-tertiary">
                Nenhuma atividade registrada.
              </p>
            </div>
          )}
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.35 }}
          className="card p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-4 h-4 text-text-tertiary" />
            <h2 className="text-sm font-semibold text-text-primary">
              Status dos Clientes
            </h2>
          </div>

          {isLoading ? (
            <div className="flex flex-col gap-3">
              {Array.from({ length: 4 }, (_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <Skeleton className="h-3.5 w-24" />
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-2 w-32 rounded-full" />
                    <Skeleton className="h-3.5 w-8" />
                  </div>
                </div>
              ))}
            </div>
          ) : s ? (
            <div className="flex flex-col gap-3">
              {[
                { label: "Ativos", value: s.clients.active, color: "#22C55E" },
                { label: "Leads", value: s.clients.lead, color: "#3B82F6" },
                { label: "Prospects", value: s.clients.prospect, color: "#F59E0B" },
                { label: "Churned", value: s.clients.churned, color: "#EF4444" },
              ].map((item) => {
                const pct = s.clients.total > 0 ? Math.round((item.value / s.clients.total) * 100) : 0;
                return (
                  <div key={item.label} className="flex items-center gap-3">
                    <span className="text-xs text-text-secondary w-20 flex-shrink-0">
                      {item.label}
                    </span>
                    <div className="flex-1 h-2 bg-bg-tertiary rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                    </div>
                    <span className="text-xs font-medium text-text-primary w-8 text-right">
                      {item.value}
                    </span>
                  </div>
                );
              })}

              <div className="mt-4 pt-4 border-t border-border-subtle grid grid-cols-2 gap-3">
                <div className="bg-bg-tertiary rounded-lg p-3">
                  <p className="text-xs text-text-tertiary">Em andamento</p>
                  <p className="text-lg font-semibold text-text-primary mt-0.5">
                    {s.tasks.inProgress}
                  </p>
                  <p className="text-xs text-text-tertiary">tarefas ativas</p>
                </div>
                <div className="bg-bg-tertiary rounded-lg p-3">
                  <p className="text-xs text-text-tertiary">Conteúdo</p>
                  <p className="text-lg font-semibold text-text-primary mt-0.5">
                    {s.content.scheduled}
                  </p>
                  <p className="text-xs text-text-tertiary">itens agendados</p>
                </div>
              </div>
            </div>
          ) : null}
        </motion.div>
      </div>
    </div>
  );
}
