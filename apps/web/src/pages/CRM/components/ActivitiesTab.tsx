import { motion } from "framer-motion";
import {
  FileText,
  Phone,
  MessageCircle,
  Mail,
  CheckCircle,
  FolderOpen,
  DollarSign,
  PenSquare,
  GitBranch,
  Activity,
} from "lucide-react";
import { useClientActivities } from "@/hooks/useClients.js";
import { Avatar } from "@/components/ui/Avatar.js";
import { EmptyState } from "@/components/feedback/EmptyState.js";
import { Skeleton } from "@/components/feedback/Skeleton.js";
import { formatRelativeTime } from "@satomiq/shared";

interface ActivityData {
  id: string;
  type: string;
  title: string;
  description: string | null;
  createdAt: string;
  user: { id: string; name: string; avatarUrl: string | null };
}

const ACTIVITY_ICONS: Record<string, React.ReactNode> = {
  NOTE_ADDED: <FileText className="w-3.5 h-3.5" />,
  STATUS_CHANGED: <GitBranch className="w-3.5 h-3.5" />,
  MEETING: <PenSquare className="w-3.5 h-3.5" />,
  CALL: <Phone className="w-3.5 h-3.5" />,
  EMAIL_SENT: <Mail className="w-3.5 h-3.5" />,
  WHATSAPP: <MessageCircle className="w-3.5 h-3.5" />,
  PAYMENT_RECEIVED: <DollarSign className="w-3.5 h-3.5" />,
  CONTRACT_SIGNED: <CheckCircle className="w-3.5 h-3.5" />,
  TASK_COMPLETED: <CheckCircle className="w-3.5 h-3.5" />,
  PROJECT_CREATED: <FolderOpen className="w-3.5 h-3.5" />,
  CUSTOM: <Activity className="w-3.5 h-3.5" />,
};

const ACTIVITY_COLORS: Record<string, string> = {
  NOTE_ADDED: "text-blue-400 bg-blue-400/10",
  STATUS_CHANGED: "text-purple-400 bg-purple-400/10",
  MEETING: "text-yellow-400 bg-yellow-400/10",
  CALL: "text-green-400 bg-green-400/10",
  EMAIL_SENT: "text-cyan-400 bg-cyan-400/10",
  WHATSAPP: "text-emerald-400 bg-emerald-400/10",
  PAYMENT_RECEIVED: "text-status-success bg-status-success/10",
  CONTRACT_SIGNED: "text-status-success bg-status-success/10",
  TASK_COMPLETED: "text-status-success bg-status-success/10",
  PROJECT_CREATED: "text-accent-hover bg-accent-subtle",
  CUSTOM: "text-text-tertiary bg-bg-tertiary",
};

export function ActivitiesTab({ clientId }: { clientId: string }): JSX.Element {
  const { data, isLoading } = useClientActivities(clientId);

  const activities = (data?.data as ActivityData[] | undefined) ?? [];

  if (isLoading) {
    return (
      <div className="card p-5">
        <div className="relative flex flex-col gap-0">
          <div className="absolute left-5 top-5 bottom-5 w-px bg-border-subtle" />
          {Array.from({ length: 5 }, (_, i) => (
            <div key={i} className="flex items-start gap-4 pb-5 relative">
              <Skeleton circle className="w-8 h-8 flex-shrink-0 z-10" />
              <div className="flex-1 pt-1">
                <Skeleton className="h-3.5 w-1/2 mb-1.5" />
                <Skeleton className="h-3 w-3/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <EmptyState
        icon={<Activity className="w-5 h-5" />}
        title="Nenhuma atividade registrada"
        description="As atividades aparecem automaticamente quando você cria notas, completa tarefas e interage com o cliente."
      />
    );
  }

  return (
    <div className="card p-5">
      <div className="relative">
        <div className="absolute left-[15px] top-0 bottom-4 w-px bg-border-subtle" />

        <div className="flex flex-col gap-0">
          {activities.map((activity, i) => {
            const icon = ACTIVITY_ICONS[activity.type] ?? <Activity className="w-3.5 h-3.5" />;
            const colorClass = ACTIVITY_COLORS[activity.type] ?? "text-text-tertiary bg-bg-tertiary";

            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-start gap-4 pb-5 relative last:pb-0"
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 z-10 border border-border-subtle ${colorClass}`}
                >
                  {icon}
                </div>
                <div className="flex-1 min-w-0 pt-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium text-text-primary">{activity.title}</p>
                      {activity.description && (
                        <p className="text-xs text-text-secondary mt-0.5 line-clamp-2">
                          {activity.description}
                        </p>
                      )}
                    </div>
                    <span className="text-xs text-text-tertiary whitespace-nowrap flex-shrink-0">
                      {formatRelativeTime(activity.createdAt)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <Avatar name={activity.user.name} src={activity.user.avatarUrl} size="xs" />
                    <span className="text-xs text-text-tertiary">{activity.user.name}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
