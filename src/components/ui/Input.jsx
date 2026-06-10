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
        <label className="text-[13px] font-medium text-ink">
          {label}
          {props.required && <span className="ml-1 text-error">*</span>}
        </label>
      )}
      <input
        className={`min-h-[42px] rounded-lg border bg-canvas px-3.5 py-2.5 text-[15px] text-ink outline-none transition-[border-color,box-shadow] placeholder:text-muted disabled:cursor-not-allowed disabled:bg-soft-stone disabled:text-muted ${
          error
            ? "border-[#f8b4b4] focus:border-error focus:ring-4 focus:ring-[#b30000]/10"
            : "border-hairline focus:border-action-blue focus:ring-4 focus:ring-action-blue/10"
        } ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-error">{error}</span>}
      {helperText && !error && (
        <span className="text-xs text-muted">{helperText}</span>
      )}
    </div>
  );
}
