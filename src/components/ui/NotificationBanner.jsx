"use client";

import { useState, useEffect } from "react";

/**
 * NotificationBanner - Lightweight notification banner
 * Auto-dismisses after a timeout
 *
 * @param {Object} props
 * @param {"info"|"success"|"warning"|"error"} props.type - Banner type
 * @param {string} props.message - Notification message
 * @param {number} props.autoDismiss - Auto-dismiss timeout in ms (default: 5000, 0 = no auto-dismiss)
 * @param {Function} props.onDismiss - Callback when dismissed
 */
export function NotificationBanner({ type = "info", message, autoDismiss = 5000, onDismiss }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (autoDismiss > 0 && visible) {
      const timer = setTimeout(() => {
        setVisible(false);
        onDismiss?.();
      }, autoDismiss);
      return () => clearTimeout(timer);
    }
  }, [autoDismiss, visible, onDismiss]);

  if (!visible || !message) return null;

  const typeStyles = {
    info: "border-info/30 bg-info/5 text-info",
    success: "border-success/30 bg-success/5 text-success",
    warning: "border-warning/30 bg-warning/5 text-warning",
    error: "border-danger/30 bg-danger/5 text-danger",
  };

  const iconPaths = {
    info: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    success: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
    warning: "M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z",
    error: "M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z",
  };

  return (
    <div className={`flex items-center gap-3 rounded-lg border px-4 py-3 text-sm ${typeStyles[type]}`}>
      <svg className="h-4 w-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d={iconPaths[type]} />
      </svg>
      <span className="flex-1">{message}</span>
      <button
        type="button"
        onClick={() => { setVisible(false); onDismiss?.(); }}
        className="flex-shrink-0 rounded p-1 transition-colors hover:bg-black/5"
        aria-label="Dismiss"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
