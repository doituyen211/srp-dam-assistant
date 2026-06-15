"use client";

const STATUS_STYLES = {
  draft: "bg-subdued text-unset border-hairline",
  ai_pre_check: "bg-purple/10 text-purple border-purple/20",
  submitted: "bg-info-bg text-info border-info/20",
  under_review: "bg-warning-bg text-warning border-warning/20",
  needs_revision: "bg-warning-bg text-warning border-warning/30",
  approved: "bg-success-bg text-success border-success/20",
  rejected: "bg-danger-bg text-danger border-danger/20",
  supervisor_assigned: "bg-teal/10 text-teal border-teal/20",
  in_progress: "bg-indigo/10 text-indigo border-indigo/20",
  completed: "bg-emerald/10 text-emerald border-emerald/20",
};

const INTENT_STYLES = {
  default: "bg-subdued text-body-muted border-hairline",
  success: "bg-success-bg text-success border-success/20",
  warning: "bg-warning-bg text-warning border-warning/20",
  danger: "bg-danger-bg text-danger border-danger/20",
  info: "bg-info-bg text-info border-info/20",
  muted: "bg-subdued text-muted border-hairline",
};

/**
 * Badge component
 * @param {Object} props
 * @param {string} props.intent - default, success, warning, danger, info, muted
 * @param {string} props.status - proposal status key (overrides intent if provided)
 */
export function Badge({
  intent = "default",
  status,
  className = "",
  children,
  ...props
}) {
  const styleClass = status ? STATUS_STYLES[status] : (INTENT_STYLES[intent] || INTENT_STYLES.default);

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded border px-2.5 py-1 font-mono text-[11px] font-medium leading-none tracking-[0.02em] ${styleClass} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
