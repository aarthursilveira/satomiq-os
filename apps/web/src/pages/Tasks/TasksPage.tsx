import { useState } from "react";
import { motion } from "framer-motion";
import { CheckSquare, Circle, Clock, AlertCircle, Plus, Filter, Loader2 } from "lucide-react";
import { useTasks, useUpdateTask } from "@/hooks/useTasks.js";
import { Button } from "@/components/ui/Button.js";
import { Select } from "@/components/ui/Select.js";
import { StatusBadge } from "@/components/ui/Badge.js";
import { Avatar } from "@/components/ui/Avatar.js";
import { EmptyState } from "@/components/feedback/EmptyState.js";
import { SkeletonRow } from "@/components/feedback/Skeleton.js";
import { formatDate, PRIORITY_LABELS } from "@satomiq/shared";
import { cn } from "@/lib/cn.js";
import { CreateTaskModal } from "./components/CreateTaskModal.js";

interface TaskData {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  dueDate: string | null;
  completedAt: string | null;
  assignee: { id: string; name: string; avatarUrl: string | null } | null;
  client: { id: string; name: string; slug: string } | null;
}

const STATUS_OPTIONS = [
  { value: "", label: "Todos os status" },
  { value: "TODO", label: "A fazer" },
  { value: "IN_PROGRESS", label: "Em andamento" },
  { value: "REVIEW", label: "Em revisão" },
  { value: "DONE", label: "Concluída" },
  { value: "CANCELLED", label: "Cancelada" },
];

const PRIORITY_OPTIONS = [
  { value: "", label: "Todas as prioridades" },
  { value: "LOW", label: "Baixa" },
  { value: "MEDIUM", label: "Média" },
  { value: "HIGH", label: "Alta" },
  { value: "URGENT", label: "Urgente" },
];

const PRIORITY_TEXT_CLASSES: Record<string, string> = {
  LOW: "text-text-tertiary",
  MEDIUM: "text-status-warning",
  HIGH: "text-status-error",
  URGENT: "text-status-error",
};

function TaskRow({ task }: { task: TaskData }): JSX.Element {
  const isDone = task.status === "DONE";
  const isOverdue = task.dueDate && !isDone && new Date(task.dueDate) < new Date();
  const { mutate: updateTask, isPending } = useUpdateTask(task.id);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateTask({ status: isDone ? "TODO" : "DONE" });
  };

  return (
    <div className="flex items-center gap-3 px-4 py-3 border-b border-border-subtle last:border-0 hover:bg-bg-tertiary/30 transition-colors group">
      <div 
        className={cn(
          "flex-shrink-0 w-4 h-4 cursor-pointer transition-all hover:scale-110", 
          isDone ? "text-status-success" : "text-text-tertiary",
          isPending && "opacity-50 cursor-wait rotate-180"
        )}
        onClick={handleToggle}
      >
        {isPending ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : isDone ? (
          <CheckSquare className="w-4 h-4" />
        ) : (
          <Circle className="w-4 h-4" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className={cn("text-sm font-medium truncate", isDone ? "text-text-tertiary line-through" : "text-text-primary")}>
          {task.title}
        </p>
        {task.client && (
          <p className="text-xs text-text-tertiary truncate mt-0.5">{task.client.name}</p>
        )}
      </div>

      <span className={cn("text-xs flex-shrink-0 hidden sm:block", PRIORITY_TEXT_CLASSES[task.priority] ?? "text-text-tertiary")}>
        {PRIORITY_LABELS[task.priority] ?? task.priority}
      </span>

      <StatusBadge status={task.status} />

      {task.dueDate && (
        <div className={cn("flex items-center gap-1 text-xs flex-shrink-0 hidden md:flex", isOverdue ? "text-status-error" : "text-text-tertiary")}>
          {isOverdue ? <AlertCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
          {formatDate(task.dueDate)}
        </div>
      )}

      {task.assignee && (
        <Avatar name={task.assignee.name} src={task.assignee.avatarUrl} size="xs" className="flex-shrink-0" />
      )}
    </div>
  );
}

export default function TasksPage(): JSX.Element {
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { data, isLoading, isError, refetch } = useTasks({
    status: status || undefined,
    priority: priority || undefined,
    limit: 100,
  });

  const tasks = (data?.data as TaskData[] | undefined) ?? [];
  const pending = tasks.filter((t) => t.status !== "DONE" && t.status !== "CANCELLED");
  const done = tasks.filter((t) => t.status === "DONE" || t.status === "CANCELLED");

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-6"
      >
        <div>
          <h1 className="text-xl font-semibold text-text-primary">Tarefas</h1>
          <p className="text-sm text-text-tertiary mt-0.5">Todas as tarefas do sistema</p>
        </div>
        <Button 
          variant="primary" 
          size="sm" 
          leftIcon={<Plus className="w-3.5 h-3.5" />}
          onClick={() => setIsCreateModalOpen(true)}
        >
          Nova Tarefa
        </Button>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="flex flex-wrap items-center gap-3 mb-5"
      >
        <Filter className="w-3.5 h-3.5 text-text-tertiary flex-shrink-0" />
        <Select
          options={STATUS_OPTIONS}
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full sm:w-44"
          placeholder=""
        />
        <Select
          options={PRIORITY_OPTIONS}
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="w-full sm:w-44"
          placeholder=""
        />
        {(status || priority) && (
          <button
            onClick={() => { setStatus(""); setPriority(""); }}
            className="text-xs text-text-tertiary hover:text-text-secondary transition-colors"
          >
            Limpar filtros
          </button>
        )}
      </motion.div>

      {/* Content */}
      {isLoading ? (
        <div className="card overflow-hidden">
          {Array.from({ length: 8 }, (_, i) => <SkeletonRow key={i} />)}
        </div>
      ) : isError ? (
        <EmptyState
          icon={<AlertCircle className="w-8 h-8 text-status-error" />}
          title="Erro ao carregar tarefas"
          description="Não foi possível carregar as tarefas no momento."
          action={<Button variant="secondary" size="sm" onClick={() => refetch()}>Tentar novamente</Button>}
        />
      ) : tasks.length === 0 ? (
        <EmptyState
          icon={<CheckSquare className="w-5 h-5" />}
          title="Nenhuma tarefa encontrada"
          description={status || priority ? "Tente remover os filtros." : "Crie sua primeira tarefa para começar."}
          action={
            !status && !priority && (
              <Button 
                variant="primary" 
                size="sm" 
                leftIcon={<Plus className="w-3.5 h-3.5" />}
                onClick={() => setIsCreateModalOpen(true)}
              >
                Nova Tarefa
              </Button>
            )
          }
        />
      ) : (
        <div className="flex flex-col gap-4">
          {pending.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="card overflow-hidden"
            >
              <div className="px-4 py-2.5 bg-bg-tertiary/50 border-b border-border-subtle">
                <p className="text-xs font-medium text-text-secondary">Abertas ({pending.length})</p>
              </div>
              {pending.map((task, i) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <TaskRow task={task} />
                </motion.div>
              ))}
            </motion.div>
          )}

          {done.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="card overflow-hidden"
            >
              <div className="px-4 py-2.5 bg-bg-tertiary/50 border-b border-border-subtle">
                <p className="text-xs font-medium text-text-tertiary">Concluídas ({done.length})</p>
              </div>
              {done.map((task, i) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <TaskRow task={task} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      )}

      <CreateTaskModal 
        open={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
      />
    </div>
  );
}
