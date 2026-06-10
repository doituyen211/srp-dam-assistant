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
      bg: "bg-blue-50",
      border: "border-blue-200",
      text: "text-blue-800",
      icon: "ℹ️",
    },
    success: {
      bg: "bg-green-50",
      border: "border-green-200",
      text: "text-green-800",
      icon: "✓",
    },
    warning: {
      bg: "bg-amber-50",
      border: "border-amber-200",
      text: "text-amber-800",
      icon: "⚠",
    },
    error: {
      bg: "bg-red-50",
      border: "border-red-200",
      text: "text-red-800",
      icon: "✕",
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
      className={`flex gap-3 px-4 py-3 rounded-lg border ${typeConfig.bg} ${typeConfig.border} ${typeConfig.text} ${className}`}
      {...props}
    >
      <span className="flex-shrink-0 text-lg">{typeConfig.icon}</span>
      <div className="flex-1">
        {title && <p className="font-medium text-sm">{title}</p>}
        <p className="text-sm">{children}</p>
      </div>
      {closable && (
        <button
          onClick={handleClose}
          className="flex-shrink-0 text-lg hover:opacity-70 transition-opacity"
        >
          ✕
        </button>
      )}
    </div>
  );
}
