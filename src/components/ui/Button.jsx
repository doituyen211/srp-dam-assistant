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
    "inline-flex items-center justify-center gap-2 rounded px-4 py-2.5 text-sm font-medium leading-[1.3] transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2 focus:ring-offset-app-bg disabled:pointer-events-none disabled:opacity-50";

  const variants = {
    primary:
      "bg-primary text-white hover:bg-primary-light active:bg-primary-dark",
    secondary:
      "border border-hairline bg-canvas text-ink hover:bg-subdued active:bg-hairline",
    ghost:
      "bg-transparent text-body-muted hover:text-ink hover:bg-subdued active:bg-hairline",
    danger:
      "bg-danger-bg text-danger border border-danger/20 hover:bg-danger hover:text-white active:bg-danger",
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
