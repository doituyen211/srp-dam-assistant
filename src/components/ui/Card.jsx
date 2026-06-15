"use client";

/**
 * Card - Container component with academic styling
 * @param {string} props.accent - optional status color for left border (success, warning, danger, info)
 */
export function Card({ className = "", accent, children, ...props }) {
  const accentBorder = accent
    ? {
        success: "border-l-success",
        warning: "border-l-warning",
        danger: "border-l-danger",
        info: "border-l-info",
      }[accent] || ""
    : "";

  return (
    <div
      className={`rounded-card border border-hairline bg-canvas shadow-card ${accentBorder} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * CardHeader - Header section of card
 */
export function CardHeader({ className = "", children, ...props }) {
  return (
    <div
      className={`border-b border-card-border px-5 py-4 sm:px-6 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * CardTitle - Title in card header
 */
export function CardTitle({ className = "", children, ...props }) {
  return (
    <h3
      className={`text-base font-semibold tracking-[-0.01em] text-ink ${className}`}
      {...props}
    >
      {children}
    </h3>
  );
}

/**
 * CardContent - Content section of card
 */
export function CardContent({ className = "", children, ...props }) {
  return (
    <div className={`px-5 py-5 sm:px-6 ${className}`} {...props}>
      {children}
    </div>
  );
}
