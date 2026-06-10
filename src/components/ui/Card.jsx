"use client";

/**
 * Card - Container component
 */
export function Card({ className = "", children, ...props }) {
  return (
    <div
      className={`bg-white rounded-lg border border-slate-200 shadow-sm ${className}`}
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
      className={`px-6 py-4 border-b border-slate-100 ${className}`}
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
      className={`text-lg font-semibold text-slate-900 ${className}`}
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
    <div className={`px-6 py-4 ${className}`} {...props}>
      {children}
    </div>
  );
}
