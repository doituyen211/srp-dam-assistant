"use client";

import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";

const RISK_STYLES = {
  high: "danger",
  medium: "warning",
  low: "info",
};

/**
 * BottleneckTable — Shows workflow stages that need attention
 */
export function BottleneckTable({ bottlenecks = [] }) {
  if (!bottlenecks.length) {
    return (
      <EmptyState
        title="No bottlenecks detected"
        description="All workflow stages are operating within normal parameters."
      />
    );
  }

  return (
    <div className="overflow-x-auto rounded border border-hairline bg-canvas">
      <table className="w-full min-w-[600px] border-collapse text-sm">
        <thead className="bg-subdued">
          <tr>
            <th className="px-4 py-3 text-left font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-muted">
              Bottleneck
            </th>
            <th className="px-4 py-3 text-left font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-muted">
              Count
            </th>
            <th className="px-4 py-3 text-left font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-muted">
              Risk
            </th>
            <th className="px-4 py-3 text-left font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-muted">
              Description
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-hairline">
          {bottlenecks.map((item, i) => (
            <tr key={i} className="hover:bg-subdued/50">
              <td className="px-4 py-3 font-medium text-ink">
                {item.label}
              </td>
              <td className="px-4 py-3">
                <span className="font-mono text-sm font-semibold text-ink">
                  {item.count ?? item.value}
                </span>
              </td>
              <td className="px-4 py-3">
                <Badge intent={item.intent || RISK_STYLES[item.severity] || "warning"}>
                  {item.severity || item.intent || "warning"}
                </Badge>
              </td>
              <td className="px-4 py-3 text-body-muted">
                {item.description}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
