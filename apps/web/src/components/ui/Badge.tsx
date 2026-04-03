import { HTMLAttributes } from "react";
import { cn } from "@/lib/cn.js";

type BadgeVariant =
  | "default"
  | "success"
  | "warning"
  | "error"
  | "info"
  | "purple"
  | "outline";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  dot?: boolean;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-bg-tertiary text-text-secondary border border-border-default",
  success: "bg-status-success/10 text-status-success border border-status-success/20",
  warning: "bg-status-warning/10 text-status-warning border border-status-warning/20",
  error: "bg-status-error/10 text-status-error border border-status-error/20",
  info: "bg-status-info/10 text-status-info border border-status-info/20",
  purple: "bg-purple-500/10 text-purple-400 border border-purple-500/20",
  outline: "bg-transparent text-text-secondary border border-border-default",
};

export function Badge({
  className,
  variant = "default",
  dot = false,
  children,
  ...props
}: BadgeProps): JSX.Element {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 h-[22px] px-2 rounded-md text-[11px] font-medium leading-none",
        variantStyles[variant],
        className,
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn(
            "w-1.5 h-1.5 rounded-full flex-shrink-0",
            variant === "success" && "bg-status-success",
            variant === "warning" && "bg-status-warning",
            variant === "error" && "bg-status-error",
            variant === "info" && "bg-status-info",
            variant === "purple" && "bg-purple-400",
            ["default", "outline"].includes(variant) && "bg-text-tertiary",
          )}
        />
      )}
      {children}
    </span>
  );
}

// Status-specific badge builders
const STATUS_MAP: Record<
  string,
  { variant: BadgeVariant; label: string }
> = {
  ACTIVE: { variant: "success", label: "Ativo" },
  LEAD: { variant: "info", label: "Lead" },
  PROSPECT: { variant: "warning", label: "Prospect" },
  PAUSED: { variant: "default", label: "Pausado" },
  CHURNED: { variant: "error", label: "Churned" },
  ARCHIVED: { variant: "default", label: "Arquivado" },
  TODO: { variant: "default", label: "A Fazer" },
  IN_PROGRESS: { variant: "info", label: "Em Andamento" },
  REVIEW: { variant: "warning", label: "Revisão" },
  DONE: { variant: "success", label: "Concluído" },
  CANCELLED: { variant: "error", label: "Cancelado" },
  IDEA: { variant: "purple", label: "Ideia" },
  DRAFT: { variant: "default", label: "Rascunho" },
  IN_REVIEW: { variant: "warning", label: "Em Revisão" },
  SCHEDULED: { variant: "info", label: "Agendado" },
  PUBLISHED: { variant: "success", label: "Publicado" },
  LOW: { variant: "default", label: "Baixa" },
  MEDIUM: { variant: "warning", label: "Média" },
  HIGH: { variant: "error", label: "Alta" },
  URGENT: { variant: "error", label: "Urgente" },
};

export function StatusBadge({
  status,
  className,
}: {
  status: string;
  className?: string;
}): JSX.Element {
  const config = STATUS_MAP[status] ?? { variant: "default" as BadgeVariant, label: status };
  return (
    <Badge variant={config.variant} dot className={className}>
      {config.label}
    </Badge>
  );
}
