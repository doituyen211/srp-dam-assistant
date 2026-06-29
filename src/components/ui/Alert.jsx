"use client";

import { useState } from "react";

/**
 * Alert component
 * @param {Object} props
 * @param {string} props.type - info, success, warning, error
 * @param {string} props.title - Alert title
 * @param {boolean} props.closable - Show close button
 */
export function Alert({
  type = "info",
  title,
  closable = false,
  className = "",
  children,
  onClose,
  ...props
}) {
  const [isOpen, setIsOpen] = useState(true);

  const types = {
    info: {
      bg: "bg-info-bg",
      border: "border-info/20",
      text: "text-info",
      icon: "M12 8.75a.75.75 0 0 1 .75.75v4a.75.75 0 0 1-1.5 0v-4a.75.75 0 0 1 .75-.75Zm.01-3a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z",
    },
    success: {
      bg: "bg-success-bg",
      border: "border-success/20",
      text: "text-success",
      icon: "m10.6 13.8 5.65-5.65-1.06-1.06-4.59 4.58-1.79-1.78-1.06 1.06 2.85 2.85Z",
    },
    warning: {
      bg: "bg-warning-bg",
      border: "border-warning/20",
      text: "text-warning",
      icon: "M12 6.5a.75.75 0 0 1 .75.75v4a.75.75 0 0 1-1.5 0v-4A.75.75 0 0 1 12 6.5Zm0 7a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z",
    },
    error: {
      bg: "bg-danger-bg",
      border: "border-danger/20",
      text: "text-danger",
      icon: "m8.47 8.47 1.06-1.06L12 9.88l2.47-2.47 1.06 1.06L13.06 11l2.47 2.47-1.06 1.06L12 12.06l-2.47 2.47-1.06-1.06L10.94 11 8.47 8.47Z",
    },
  };

  const typeConfig = types[type] || types.info;

  if (!isOpen) return null;

  const handleClose = () => {
    setIsOpen(false);
    onClose?.();
  };

  return (
    <div
      className={`flex items-start gap-3 rounded border px-4 py-3 text-sm ${typeConfig.bg} ${typeConfig.border} ${typeConfig.text} ${className}`}
      {...props}
    >
      <svg
        aria-hidden="true"
        className="mt-0.5 h-4 w-4 flex-shrink-0"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d={typeConfig.icon} />
      </svg>
      <div className="flex-1 min-w-0">
        {title && <p className="font-medium leading-5">{title}</p>}
        <div className={title ? "mt-1.5 leading-6" : "leading-6"}>
          {children}
        </div>
      </div>
      {closable && (
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close notification"
          className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded text-current/60 transition-colors hover:bg-black/5 hover:text-current focus:outline-none focus:ring-2 focus:ring-current/20"
        >
          <svg aria-hidden="true" className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="currentColor">
            <path d="M4.22 4.22a.75.75 0 0 1 1.06 0L8 6.94l2.72-2.72a.75.75 0 1 1 1.06 1.06L9.06 8l2.72 2.72a.75.75 0 1 1-1.06 1.06L8 9.06l-2.72 2.72a.75.75 0 0 1-1.06-1.06L6.94 8 4.22 5.28a.75.75 0 0 1 0-1.06Z" />
          </svg>
        </button>
      )}
    </div>
  );
}
