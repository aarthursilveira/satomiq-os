import { cn } from "@/lib/cn.js";
import { generateInitials, generateColorFromName } from "@satomiq/shared";

type AvatarSize = "xs" | "sm" | "md" | "lg";

const sizeStyles: Record<AvatarSize, string> = {
  xs: "w-6 h-6 text-[10px]",
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-12 h-12 text-base",
};

interface AvatarProps {
  name: string;
  src?: string | null;
  size?: AvatarSize;
  className?: string;
}

export function Avatar({
  name,
  src,
  size = "md",
  className,
}: AvatarProps): JSX.Element {
  const initials = generateInitials(name);
  const bgColor = generateColorFromName(name);

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={cn(
          "rounded-full object-cover flex-shrink-0",
          sizeStyles[size],
          className,
        )}
      />
    );
  }

  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center font-semibold flex-shrink-0 select-none",
        sizeStyles[size],
        className,
      )}
      style={{ backgroundColor: bgColor + "33", color: bgColor }}
      title={name}
    >
      {initials}
    </div>
  );
}
