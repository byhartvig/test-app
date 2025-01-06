"use client";

import { cn } from "@/utils/cn";

export function LoadingSpinner({ className, size = "w-4 h-4" }) {
  return (
    <div
      className={cn(
        "animate-spin rounded-full border-2 border-current border-t-transparent",
        size,
        className
      )}
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}
