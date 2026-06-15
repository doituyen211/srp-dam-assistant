"use client";

import { SECTION_HEALTH_LABELS } from "@/lib/constants";

const HEALTH_STYLES = {
  strong: "bg-success-bg text-success border-success/20",
  needs_evidence: "bg-warning-bg text-warning border-warning/20",
  weak: "bg-danger-bg text-danger border-danger/20",
  missing: "bg-subdued text-muted border-hairline",
};

/**
 * SectionHealthBadge — Shows health status of a proposal section
 */
export function SectionHealthBadge({ health, className = "" }) {
  const style = HEALTH_STYLES[health] || HEALTH_STYLES.missing;
  const label = SECTION_HEALTH_LABELS[health] || health;
  return (
    <span
      className={`inline-flex items-center rounded border px-2 py-0.5 font-mono text-[10px] font-medium leading-none tracking-[0.02em] ${style} ${className}`}
    >
      {label}
    </span>
  );
}
