"use client";

import { Card, CardContent } from "@/components/ui/Card";

/**
 * AdminKpiCard — KPI card for admin dashboard
 */
export function AdminKpiCard({
  label,
  value,
  subtitle,
  accent,
  className = "",
}) {
  return (
    <Card accent={accent} className={className}>
      <CardContent className="p-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted">
          {label}
        </p>
        <p className="mt-1.5 text-2xl font-semibold text-ink">{value}</p>
        {subtitle && (
          <p className="mt-1 text-xs text-body-muted">{subtitle}</p>
        )}
      </CardContent>
    </Card>
  );
}
