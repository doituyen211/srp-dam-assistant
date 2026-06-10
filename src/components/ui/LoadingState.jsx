"use client";

/**
 * LoadingState component
 * @param {Object} props
 * @param {string} props.message - Loading message
 */
export function LoadingState({ message = "Đang tải...", className = "" }) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 py-12 ${className}`}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-canvas ring-1 ring-hairline">
        <span
          aria-hidden="true"
          className="h-6 w-6 animate-spin rounded-full border-2 border-ink/15 border-t-deep-green"
        />
      </div>
      <p className="text-sm font-medium text-body-muted">{message}</p>
      <div className="h-1.5 w-28 overflow-hidden rounded-full bg-soft-stone">
        <div className="h-full w-1/2 animate-pulse rounded-full bg-hairline" />
      </div>
    </div>
  );
}
