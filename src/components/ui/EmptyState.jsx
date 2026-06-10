"use client";

/**
 * EmptyState component
 * @param {Object} props
 * @param {string} props.title - Empty state title
 * @param {string} props.description - Empty state description
 * @param {ReactNode} props.action - Action element (Button, etc.)
 * @param {string} props.icon - Emoji or icon
 */
export function EmptyState({
  title = "Không có dữ liệu",
  description,
  action,
  icon,
  className = "",
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 py-14 text-center ${className}`}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-soft-stone text-xl text-muted ring-1 ring-hairline">
        {icon || (
          <svg
            aria-hidden="true"
            className="h-6 w-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
          >
            <path d="M6 4.75h12v14.5H6z" />
            <path d="M9 8h6M9 12h6M9 16h3" />
          </svg>
        )}
      </div>
      <div className="max-w-md">
        <h3 className="mb-1 text-lg font-medium tracking-[-0.01em] text-ink">
          {title}
        </h3>
        {description && (
          <p className="text-sm leading-6 text-body-muted">{description}</p>
        )}
      </div>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
