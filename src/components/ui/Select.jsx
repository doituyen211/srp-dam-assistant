"use client";

/**
 * Select component
 * @param {Object} props
 * @param {string} props.label - Label text
 * @param {string} props.error - Error message
 * @param {string} props.helperText - Helper text
 * @param {Array} props.options - Array of {value, label}
 */
export function Select({
  label,
  error,
  helperText,
  options = [],
  className = "",
  ...props
}) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-ink" htmlFor={props.name}>
          {label}
          {props.required && <span className="ml-1 text-danger">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          id={props.name}
          className={`min-h-[44px] w-full appearance-none rounded border bg-canvas px-4 py-2.5 pr-10 text-base text-ink outline-none transition-all disabled:cursor-not-allowed disabled:bg-subdued disabled:text-muted ${
            error
              ? "border-danger/50 focus:border-danger focus:ring-4 focus:ring-danger/10"
              : "border-hairline focus:border-primary/40 focus:ring-4 focus:ring-primary/10"
          } ${className}`}
          {...props}
        >
          <option value="">-- Chọn --</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
          viewBox="0 0 16 16"
          fill="currentColor"
        >
          <path d="M4.2 6.1a.75.75 0 0 1 1.06 0L8 8.84l2.74-2.74a.75.75 0 1 1 1.06 1.06l-3.27 3.27a.75.75 0 0 1-1.06 0L4.2 7.16a.75.75 0 0 1 0-1.06Z" />
        </svg>
      </div>
      {error && <span className="text-xs text-danger">{error}</span>}
      {helperText && !error && (
        <span className="text-xs text-body-muted">{helperText}</span>
      )}
    </div>
  );
}
