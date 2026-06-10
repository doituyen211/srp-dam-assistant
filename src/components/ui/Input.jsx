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
        <label className="text-sm font-medium text-slate-700">
          {label}
          {props.required && <span className="text-red-600 ml-1">*</span>}
        </label>
      )}
      <input
        className={`px-3 py-2 border rounded-lg text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0 ${
          error
            ? "border-red-300 focus:ring-red-500"
            : "border-slate-300 focus:ring-blue-500"
        } ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-red-600">{error}</span>}
      {helperText && !error && (
        <span className="text-xs text-slate-500">{helperText}</span>
      )}
    </div>
  );
}
