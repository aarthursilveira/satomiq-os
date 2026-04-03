import { forwardRef, InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn.js";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
  error?: string;
  label?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      leftElement,
      rightElement,
      error,
      label,
      hint,
      id,
      ...props
    },
    ref,
  ) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-medium text-text-secondary"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftElement && (
            <div className="absolute left-3 flex items-center text-text-tertiary pointer-events-none">
              {leftElement}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              "w-full h-9 bg-bg-tertiary rounded border border-border-default text-text-primary text-sm",
              "placeholder:text-text-tertiary",
              "transition-all duration-150",
              "focus:outline-none focus:border-border-strong focus:shadow-[0_0_0_3px_rgba(37,99,235,0.12)]",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              leftElement ? "pl-9 pr-3" : "px-3",
              rightElement ? "pr-9" : "",
              error && "border-status-error/60 focus:border-status-error focus:shadow-[0_0_0_3px_rgba(239,68,68,0.12)]",
              className,
            )}
            {...props}
          />
          {rightElement && (
            <div className="absolute right-3 flex items-center text-text-tertiary">
              {rightElement}
            </div>
          )}
        </div>
        {error && (
          <p className="text-xs text-status-error">{error}</p>
        )}
        {hint && !error && (
          <p className="text-xs text-text-tertiary">{hint}</p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
