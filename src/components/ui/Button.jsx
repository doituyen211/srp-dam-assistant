"use client";

/**
 * Button component
 * @param {Object} props
 * @param {string} props.variant - primary, secondary, ghost, danger
 * @param {boolean} props.loading - Show loading state
 * @param {boolean} props.disabled - Disable button
 * @param {ReactNode} props.children
 */
export function Button({
  variant = "primary",
  loading = false,
  disabled = false,
  className = "",
  children,
  ...props
}) {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 rounded-pill px-5 py-2.5 text-sm font-medium leading-[1.4] transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-focus-blue/30 focus:ring-offset-2 focus:ring-offset-app-bg disabled:pointer-events-none disabled:opacity-55";

  const variants = {
    primary:
      "bg-primary text-on-primary hover:-translate-y-px hover:bg-[#2d2d35] disabled:hover:translate-y-0 disabled:hover:bg-primary",
    secondary:
      "rounded-lg border border-hairline bg-transparent text-ink hover:bg-soft-stone disabled:hover:bg-transparent",
    ghost:
      "rounded-lg bg-transparent px-3 text-body-muted hover:bg-soft-stone hover:text-ink disabled:hover:bg-transparent disabled:hover:text-body-muted",
    danger:
      "rounded-lg border border-[#f8b4b4] bg-[#fff0f0] text-error hover:bg-[#ffe0e0] disabled:hover:bg-[#fff0f0]",
  };

  const variantClass = variants[variant] || variants.primary;
  const disabledAttr = disabled || loading;

  return (
    <button
      className={`${baseStyles} ${variantClass} ${className}`}
      disabled={disabledAttr}
      {...props}
    >
      {loading && (
        <span
          aria-hidden="true"
          className="h-4 w-4 animate-spin rounded-full border-2 border-current/25 border-t-current"
        />
      )}
      {children}
    </button>
  );
}
