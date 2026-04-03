import { ReactNode } from "react";
import { cn } from "@/lib/cn.js";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps): JSX.Element {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center py-16 px-6",
        className,
      )}
    >
      {icon && (
        <div className="w-12 h-12 rounded-xl bg-bg-tertiary flex items-center justify-center text-text-tertiary mb-4">
          {icon}
        </div>
      )}
      <h3 className="text-sm font-semibold text-text-primary mb-1">{title}</h3>
      {description && (
        <p className="text-xs text-text-tertiary max-w-xs mb-4">{description}</p>
      )}
      {action && action}
    </div>
  );
}
