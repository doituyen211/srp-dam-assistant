"use client";

import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";

/**
 * LecturerCapacityTable — Shows lecturer capacity and risk
 */
export function LecturerCapacityTable({ lecturers = [] }) {
  if (!lecturers.length) {
    return (
      <EmptyState
        title="No lecturers"
        description="No lecturer data available."
      />
    );
  }

  return (
    <div className="overflow-x-auto rounded border border-hairline bg-canvas">
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <thead className="bg-subdued">
          <tr>
            <th className="px-4 py-3 text-left font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-muted">Lecturer</th>
            <th className="px-4 py-3 text-left font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-muted">Department</th>
            <th className="px-4 py-3 text-left font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-muted">Capacity</th>
            <th className="px-4 py-3 text-left font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-muted">Status</th>
            <th className="px-4 py-3 text-left font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-muted">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-hairline">
          {lecturers.map((lec, index) => {
            const loadPct = lec.maxLoad ? Math.round((lec.currentLoad / lec.maxLoad) * 100) : 0;
            const isFull = loadPct >= 100;
            const isNear = loadPct >= 75;
            const uniqueKey = lec.id || `lecturer-index-${index}`;

            return (
              <tr key={uniqueKey} className="hover:bg-subdued/50">
                <td className="px-4 py-3">
                  <p className="font-medium text-ink">{lec.name}</p>
                  {lec.title && <p className="text-xs text-body-muted">{lec.title}</p>}
                </td>
                <td className="px-4 py-3 text-body-muted">{lec.department}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-1.5 w-20 overflow-hidden rounded-full bg-subdued">
                      <div
                        className={`h-full rounded-full ${isFull ? "bg-danger" : isNear ? "bg-warning" : "bg-success"}`}
                        style={{ width: `${Math.min(loadPct, 100)}%` }}
                      />
                    </div>
                    <span className="font-mono text-xs text-ink">{lec.currentLoad}/{lec.maxLoad}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <Badge intent={isFull ? "danger" : isNear ? "warning" : "success"}>
                    {isFull ? "Full" : isNear ? "Near limit" : "Available"}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs text-body-muted">
                    {isFull ? "Redistribute load" : isNear ? "Monitor" : "Available"}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
