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
    default: "bg-soft-stone text-body-muted",
    success: "bg-pale-green text-success",
    warning: "bg-[#fff3e0] text-warning",
    danger: "bg-[#fde8e8] text-error",
    info: "bg-pale-blue text-action-blue",
    muted: "bg-[#f8f8f5] text-muted",
  };

  const intentClass = intents[intent] || intents.default;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-mono text-[11px] font-medium leading-none tracking-[0.02em] ${intentClass} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
