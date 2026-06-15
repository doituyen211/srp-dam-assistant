"use client";

/**
 * EmptyState — consistent empty state with optional action
 * @param {string}  props.title       - Empty state title
 * @param {string}  props.description - Empty state description
 * @param {ReactNode} props.action    - Action element (Button, Link)
 * @param {string}  props.icon        - SVG icon or emoji
 * @param {string}  props.variant     - 'default' | 'info' | 'warning'
 */
export function EmptyState({
  title = "No data",
  description,
  action,
  icon,
  variant = "default",
  className = "",
}) {
  const iconStyles = {
    default: "border-hairline bg-subdued text-muted",
    info: "border-info/20 bg-info-bg text-info",
    warning: "border-warning/20 bg-warning-bg text-warning",
  };

  return (
    <div
      className={`flex flex-col items-center justify-center gap-5 py-14 text-center ${className}`}
    >
      <div
        className={`flex h-12 w-12 items-center justify-center rounded border ${
          iconStyles[variant] || iconStyles.default
        }`}
      >
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
        <h3 className="mb-1.5 text-base font-semibold text-ink">{title}</h3>
        {description && (
          <p className="text-sm leading-6 text-body-muted">{description}</p>
        )}
      </div>
      {action && <div className="mt-1">{action}</div>}
    </div>
  );
}
