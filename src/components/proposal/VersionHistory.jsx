"use client";

import { Badge } from "@/components/ui/Badge";

/**
 * VersionHistory — Compact version history list for proposal detail
 */
export function VersionHistory({ logs = [], limit = 5, className = "" }) {
  if (!logs.length) {
    return (
      <div className={`text-xs text-muted ${className}`}>
        No revision history yet.
      </div>
    );
  }

  const displayLogs = logs.slice(0, limit);

  return (
    <div className={`space-y-2 ${className}`}>
      {displayLogs.map((log) => (
        <div
          key={log.id}
          className="flex items-start justify-between gap-2 rounded border border-hairline bg-canvas p-2.5"
        >
          <div className="min-w-0 flex-1">
            <div className="text-xs font-medium text-ink">{log.action}</div>
            <div className="mt-0.5 truncate text-[11px] text-body-muted">
              {log.details}
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <Badge
              intent={log.status === "success" ? "success" : "warning"}
              className="text-[9px]"
            >
              {log.status}
            </Badge>
            <span className="font-mono text-[9px] text-muted">
              {log.timestamp
                ? new Date(log.timestamp).toLocaleDateString("en-US", {
                    day: "2-digit",
                    month: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : ""}
            </span>
          </div>
        </div>
      ))}
      {logs.length > limit && (
        <div className="text-center">
          <span className="text-[11px] text-muted">
            +{logs.length - limit} more entries
          </span>
        </div>
      )}
    </div>
  );
}
