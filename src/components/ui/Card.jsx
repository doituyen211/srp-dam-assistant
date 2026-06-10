"use client";

/**
 * Card - Container component
 */
export function Card({ className = "", children, ...props }) {
  return (
    <div
      className={`rounded-card border border-hairline bg-canvas shadow-[0_1px_0_rgb(0_0_0/0.02)] ${className}`}
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
      className={`border-b border-hairline px-6 py-4 ${className}`}
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
      className={`text-lg font-medium tracking-[-0.01em] text-ink ${className}`}
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
    <div className={`px-6 py-5 ${className}`} {...props}>
      {children}
    </div>
  );
}
