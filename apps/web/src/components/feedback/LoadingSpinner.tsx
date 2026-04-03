import { cn } from "@/lib/cn.js";

type SpinnerSize = "sm" | "md" | "lg";

const sizeClasses: Record<SpinnerSize, string> = {
  sm: "w-4 h-4 border-[1.5px]",
  md: "w-6 h-6 border-2",
  lg: "w-8 h-8 border-2",
};

interface LoadingSpinnerProps {
  size?: SpinnerSize;
  className?: string;
}

export function LoadingSpinner({
  size = "md",
  className,
}: LoadingSpinnerProps): JSX.Element {
  return (
    <div
      className={cn(
        "inline-block rounded-full border-current border-t-transparent animate-spin",
        sizeClasses[size],
        className,
      )}
      role="status"
      aria-label="Carregando..."
    />
  );
}
