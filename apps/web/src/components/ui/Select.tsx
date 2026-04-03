import { forwardRef, SelectHTMLAttributes } from "react";
import { cn } from "@/lib/cn.js";
import { ChevronDown } from "lucide-react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
  placeholder?: string;
  error?: string;
  label?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, options, placeholder, error, label, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-xs font-medium text-text-secondary">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={inputId}
            className={cn(
              "w-full h-9 bg-bg-tertiary rounded border border-border-default",
              "text-text-primary text-sm appearance-none px-3 pr-8",
              "transition-all duration-150",
              "focus:outline-none focus:border-border-strong focus:shadow-[0_0_0_3px_rgba(37,99,235,0.12)]",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              error && "border-status-error/60",
              className,
            )}
            {...props}
          >
            {placeholder && (
              <option value="" className="bg-bg-elevated">
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-bg-elevated">
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary pointer-events-none" />
        </div>
        {error && <p className="text-xs text-status-error">{error}</p>}
      </div>
    );
  },
);

Select.displayName = "Select";
