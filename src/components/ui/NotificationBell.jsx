"use client";

import { useState, useRef, useEffect } from "react";

/**
 * NotificationBell — Bell icon with unread badge + dismissable dropdown
 */
export function NotificationBell({ notifications = [], onDismiss, onClearAll, onOpen }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleToggle = () => {
    const next = !open;
    if (next && onOpen) onOpen();
    setOpen(next);
  };

  const unread = notifications.filter((n) => !n.read).length;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={handleToggle}
        className="relative flex h-8 w-8 items-center justify-center rounded text-body-muted transition-colors hover:bg-subdued hover:text-ink"
        aria-label={`Notifications${unread > 0 ? ` (${unread} unread)` : ""}`}
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
        </svg>
        {unread > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-danger px-1 text-[9px] font-bold leading-none text-white">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded border border-hairline bg-canvas shadow-card">
          <div className="border-b border-hairline px-4 py-2.5">
            <p className="text-sm font-medium text-ink">Notifications</p>
          </div>
          <div className="max-h-72 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-xs text-muted">No notifications</div>
            ) : (
              notifications.map((n) => (
                <div key={n.id} className={`flex items-start gap-3 border-b border-hairline px-4 py-3 ${!n.read ? "bg-info-bg/20" : ""}`}>
                  <div className={`mt-1 h-2 w-2 flex-shrink-0 rounded-full ${!n.read ? "bg-info" : "bg-transparent"}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-ink">{n.title}</p>
                    <p className="mt-0.5 text-[11px] text-body-muted">{n.message}</p>
                    <p className="mt-0.5 text-[10px] text-muted">
                      {n.created_at ? new Date(n.created_at).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }) : ""}
                    </p>
                  </div>
                  {onDismiss && (
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); onDismiss(n.id); }}
                      className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded text-muted hover:bg-subdued hover:text-ink"
                      aria-label="Dismiss notification"
                    >
                      <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
          {notifications.length > 0 && onClearAll && (
            <div className="border-t border-hairline px-4 py-2 text-center">
              <button type="button" onClick={onClearAll} className="text-xs text-body-muted hover:text-ink">Clear all</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
