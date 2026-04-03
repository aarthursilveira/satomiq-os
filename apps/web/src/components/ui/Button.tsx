import { forwardRef, ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn.js";
import { LoadingSpinner } from "@/components/feedback/LoadingSpinner.js";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "outline";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-accent-primary text-white hover:bg-accent-hover shadow-accent-glow border border-transparent",
  secondary:
    "bg-bg-tertiary text-text-primary hover:bg-bg-elevated border border-border-default",
  ghost:
    "bg-transparent text-text-secondary hover:text-text-primary hover:bg-bg-tertiary border border-transparent",
  danger:
    "bg-status-error/10 text-status-error hover:bg-status-error/20 border border-status-error/20",
  outline:
    "bg-transparent text-text-primary border border-border-default hover:border-border-strong hover:bg-bg-tertiary",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-xs gap-1.5",
  md: "h-9 px-4 text-sm gap-2",
  lg: "h-10 px-5 text-sm gap-2",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "secondary",
      size = "md",
      loading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-medium rounded transition-all duration-150",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-1 focus-visible:ring-offset-bg-primary",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          variantStyles[variant],
          sizeStyles[size],
          className,
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <LoadingSpinner size="sm" className="text-current" />
        ) : (
          leftIcon
        )}
        {children}
        {!loading && rightIcon}
      </button>
    );
  },
);

Button.displayName = "Button";
