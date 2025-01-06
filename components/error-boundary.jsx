"use client";

import { useEffect } from "react";
import { logger } from "@/utils/logger";

export function ErrorBoundary({ error, reset }) {
  useEffect(() => {
    // Log the error
    logger.logError(error, {
      component: "ErrorBoundary",
      action: "render",
    });
  }, [error]);

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
      <h2 className="text-lg font-semibold">Something went wrong!</h2>
      <button
        className="rounded bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
        onClick={() => reset()}
      >
        Try again
      </button>
    </div>
  );
}
