"use client";

import { Badge } from "@/components/ui/Badge";
import { STATUS_LABELS, STATUS_COLORS } from "@/lib/constants";

/**
 * ProposalStatusBadge - Display proposal status with color
 */
export function ProposalStatusBadge({ status }) {
  const label = STATUS_LABELS[status] || status;
  const color = STATUS_COLORS[status] || "default";

  const colorMap = {
    slate: "default",
    blue: "info",
    amber: "warning",
    orange: "warning",
    green: "success",
    red: "danger",
  };

  const intent = colorMap[color] || "default";

  return (
    <Badge intent={intent} className="whitespace-nowrap">
      {label}
    </Badge>
  );
}
