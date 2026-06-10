"use client";

/**
 * Badge component
 * @param {Object} props
 * @param {string} props.intent - success, warning, danger, info, muted, default
 */
export function Badge({
  intent = "default",
  className = "",
  children,
  ...props
}) {
  const intents = {
    default: "bg-slate-100 text-slate-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-amber-100 text-amber-800",
    danger: "bg-red-100 text-red-800",
    info: "bg-blue-100 text-blue-800",
    muted: "bg-slate-50 text-slate-600",
  };

  const intentClass = intents[intent] || intents.default;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${intentClass} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
