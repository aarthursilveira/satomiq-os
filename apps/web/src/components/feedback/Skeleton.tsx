import { HTMLAttributes } from "react";
import { cn } from "@/lib/cn.js";

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  rounded?: boolean;
  circle?: boolean;
}

export function Skeleton({ className, rounded = false, circle = false, ...rest }: SkeletonProps): JSX.Element {
  return (
    <div
      className={cn(
        "shimmer",
        circle ? "rounded-full" : rounded ? "rounded-full" : "rounded",
        className,
      )}
      aria-hidden="true"
      {...rest}
    />
  );
}

export function SkeletonCard(): JSX.Element {
  return (
    <div className="card p-5 flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <Skeleton circle className="w-10 h-10 flex-shrink-0" />
        <div className="flex-1 flex flex-col gap-2">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-3 w-1/3" />
        </div>
      </div>
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-3/4" />
      <div className="flex gap-2 mt-1">
        <Skeleton className="h-5 w-16 rounded-md" />
        <Skeleton className="h-5 w-12 rounded-md" />
      </div>
    </div>
  );
}

export function SkeletonRow(): JSX.Element {
  return (
    <div className="flex items-center gap-3 px-4 py-3 border-b border-border-subtle">
      <Skeleton circle className="w-8 h-8 flex-shrink-0" />
      <div className="flex-1 flex flex-col gap-1.5">
        <Skeleton className="h-3.5 w-1/3" />
        <Skeleton className="h-3 w-1/4" />
      </div>
      <Skeleton className="h-5 w-14 rounded-md" />
      <Skeleton className="h-3.5 w-20" />
    </div>
  );
}

export function SkeletonText({ lines = 3 }: { lines?: number }): JSX.Element {
  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton
          key={i}
          className="h-3"
          style={{ width: i === lines - 1 ? "60%" : "100%" } as React.CSSProperties}
        />
      ))}
    </div>
  );
}
