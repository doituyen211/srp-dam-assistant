"use client";

import { useState } from "react";

/**
 * Alert component
 * @param {Object} props
 * @param {string} props.type - info, success, warning, error
 * @param {string} props.title - Alert title
 * @param {ReactNode} props.children - Alert content
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
      bg: "bg-pale-blue",
      border: "border-[#bee3f8]",
      text: "text-[#1a5276]",
      icon: "M12 8.75a.75.75 0 0 1 .75.75v4a.75.75 0 0 1-1.5 0v-4a.75.75 0 0 1 .75-.75Zm.01-3a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z",
    },
    success: {
      bg: "bg-pale-green",
      border: "border-[#b7e4c7]",
      text: "text-success",
      icon: "m10.6 13.8 5.65-5.65-1.06-1.06-4.59 4.58-1.79-1.78-1.06 1.06 2.85 2.85Z",
    },
    warning: {
      bg: "bg-[#fff8e1]",
      border: "border-[#ffe082]",
      text: "text-[#5d4037]",
      icon: "M12 6.5a.75.75 0 0 1 .75.75v4a.75.75 0 0 1-1.5 0v-4A.75.75 0 0 1 12 6.5Zm0 7a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z",
    },
    error: {
      bg: "bg-[#fde8e8]",
      border: "border-[#f8b4b4]",
      text: "text-error",
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
      className={`flex items-start gap-3 rounded-lg border px-4 py-3 text-sm ${typeConfig.bg} ${typeConfig.border} ${typeConfig.text} ${className}`}
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
      <div className="flex-1">
        {title && <p className="font-medium">{title}</p>}
        <p className={title ? "mt-0.5 leading-6" : "leading-6"}>{children}</p>
      </div>
      {closable && (
        <button
          type="button"
          onClick={handleClose}
          aria-label="Đóng thông báo"
          className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md text-current/70 transition-colors hover:bg-black/5 hover:text-current focus:outline-none focus:ring-2 focus:ring-current/20"
        >
          <svg aria-hidden="true" className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="currentColor">
            <path d="M4.22 4.22a.75.75 0 0 1 1.06 0L8 6.94l2.72-2.72a.75.75 0 1 1 1.06 1.06L9.06 8l2.72 2.72a.75.75 0 1 1-1.06 1.06L8 9.06l-2.72 2.72a.75.75 0 0 1-1.06-1.06L6.94 8 4.22 5.28a.75.75 0 0 1 0-1.06Z" />
          </svg>
        </button>
      )}
    </div>
  );
}
