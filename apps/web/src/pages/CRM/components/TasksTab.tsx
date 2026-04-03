import { motion } from "framer-motion";
import { CheckSquare, Circle, Clock, AlertCircle } from "lucide-react";
import { useClientTasks } from "@/hooks/useClients.js";
import { StatusBadge } from "@/components/ui/Badge.js";
import { Avatar } from "@/components/ui/Avatar.js";
import { EmptyState } from "@/components/feedback/EmptyState.js";
import { SkeletonRow } from "@/components/feedback/Skeleton.js";
import { formatDate, PRIORITY_LABELS } from "@satomiq/shared";
import { cn } from "@/lib/cn.js";

interface TaskData {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  dueDate: string | null;
  completedAt: string | null;
  assignee: { id: string; name: string; avatarUrl: string | null } | null;
}

const PRIORITY_COLORS: Record<string, string> = {
  LOW: "text-text-tertiary",
  MEDIUM: "text-status-warning",
  HIGH: "text-status-error",
  URGENT: "text-status-error",
};

function TaskRow({ task }: { task: TaskData }): JSX.Element {
  const isDone = task.status === "DONE";
  const isOverdue =
    task.dueDate && !isDone && new Date(task.dueDate) < new Date();

  return (
    <div className="flex items-center gap-3 px-4 py-3 border-b border-border-subtle last:border-0 hover:bg-bg-tertiary/30 transition-colors group">
      <div
        className={cn(
          "flex-shrink-0 w-4 h-4",
          isDone ? "text-status-success" : "text-text-tertiary",
        )}
      >
        {isDone ? <CheckSquare className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
      </div>
      <div className="flex-1 min-w-0">
        <p
          className={cn(
            "text-sm font-medium truncate",
            isDone ? "text-text-tertiary line-through" : "text-text-primary",
          )}
        >
          {task.title}
        </p>
        {task.description && (
          <p className="text-xs text-text-tertiary truncate mt-0.5">{task.description}</p>
        )}
      </div>

      <span className={cn("text-xs flex-shrink-0", PRIORITY_COLORS[task.priority] ?? "text-text-tertiary")}>
        {PRIORITY_LABELS[task.priority] ?? task.priority}
      </span>

      <StatusBadge status={task.status} />

      {task.dueDate && (
        <div
          className={cn(
            "flex items-center gap-1 text-xs flex-shrink-0",
            isOverdue ? "text-status-error" : "text-text-tertiary",
          )}
        >
          {isOverdue ? (
            <AlertCircle className="w-3 h-3" />
          ) : (
            <Clock className="w-3 h-3" />
          )}
          {formatDate(task.dueDate)}
        </div>
      )}

      {task.assignee && (
        <Avatar
          name={task.assignee.name}
          src={task.assignee.avatarUrl}
          size="xs"
          className="flex-shrink-0"
        />
      )}
    </div>
  );
}

export function TasksTab({ clientId }: { clientId: string }): JSX.Element {
  const { data, isLoading } = useClientTasks(clientId);
  const tasks = (data?.data as TaskData[] | undefined) ?? [];

  if (isLoading) {
    return (
      <div className="card overflow-hidden">
        {Array.from({ length: 5 }, (_, i) => <SkeletonRow key={i} />)}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <EmptyState
        icon={<CheckSquare className="w-5 h-5" />}
        title="Nenhuma tarefa encontrada"
        description="As tarefas deste cliente aparecerão aqui."
      />
    );
  }

  const pending = tasks.filter((t) => t.status !== "DONE" && t.status !== "CANCELLED");
  const done = tasks.filter((t) => t.status === "DONE" || t.status === "CANCELLED");

  return (
    <div className="flex flex-col gap-3">
      {pending.length > 0 && (
        <div className="card overflow-hidden">
          <div className="px-4 py-2.5 bg-bg-tertiary/50 border-b border-border-subtle">
            <p className="text-xs font-medium text-text-secondary">
              Abertas ({pending.length})
            </p>
          </div>
          {pending.map((task, i) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <TaskRow task={task} />
            </motion.div>
          ))}
        </div>
      )}

      {done.length > 0 && (
        <div className="card overflow-hidden">
          <div className="px-4 py-2.5 bg-bg-tertiary/50 border-b border-border-subtle">
            <p className="text-xs font-medium text-text-tertiary">
              Concluídas ({done.length})
            </p>
          </div>
          {done.map((task, i) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <TaskRow task={task} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
