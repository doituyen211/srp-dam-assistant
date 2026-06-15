"use client";

/**
 * Input component
 * @param {Object} props
 * @param {string} props.label - Label text
 * @param {string} props.error - Error message
 * @param {string} props.helperText - Helper text
 */
export function Input({ label, error, helperText, className = "", ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-ink" htmlFor={props.name}>
          {label}
          {props.required && <span className="ml-1 text-danger">*</span>}
        </label>
      )}
      <input
        id={props.name}
        className={`min-h-[44px] rounded border bg-canvas px-4 py-2.5 text-base text-ink outline-none transition-all placeholder:text-muted disabled:cursor-not-allowed disabled:bg-subdued disabled:text-muted ${
          error
            ? "border-danger/50 focus:border-danger focus:ring-4 focus:ring-danger/10"
            : "border-hairline focus:border-primary/40 focus:ring-4 focus:ring-primary/10"
        } ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-danger">{error}</span>}
      {helperText && !error && (
        <span className="text-xs text-body-muted">{helperText}</span>
      )}
    </div>
  );
}
