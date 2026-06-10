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
  icon = "📭",
  className = "",
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center py-12 gap-4 ${className}`}
    >
      <div className="text-6xl">{icon}</div>
      <div className="text-center max-w-md">
        <h3 className="text-lg font-semibold text-slate-900 mb-1">{title}</h3>
        {description && <p className="text-sm text-slate-500">{description}</p>}
      </div>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
