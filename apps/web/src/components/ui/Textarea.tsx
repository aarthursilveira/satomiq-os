import { forwardRef, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/cn.js";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  label?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, label, hint, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-xs font-medium text-text-secondary">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          className={cn(
            "w-full min-h-[100px] bg-bg-tertiary rounded border border-border-default",
            "text-text-primary text-sm placeholder:text-text-tertiary",
            "px-3 py-2.5 resize-none",
            "transition-all duration-150",
            "focus:outline-none focus:border-border-strong focus:shadow-[0_0_0_3px_rgba(37,99,235,0.12)]",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            error && "border-status-error/60",
            className,
          )}
          {...props}
        />
        {error && <p className="text-xs text-status-error">{error}</p>}
        {hint && !error && <p className="text-xs text-text-tertiary">{hint}</p>}
      </div>
    );
  },
);

Textarea.displayName = "Textarea";
