"use client";

/**
 * DashboardCard - Reusable card for dashboard metrics
 */
export function DashboardCard({ title, value, subtitle, accent, icon, className = "" }) {
  return (
    <div className={`rounded-xl border border-hairline bg-white p-5 transition-shadow hover:shadow-md ${className}`}>
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted">
            {title}
          </p>
          <p className="mt-1.5 text-2xl font-semibold text-ink">
            {value}
          </p>
          {subtitle && (
            <p className="mt-0.5 text-xs text-body-muted">{subtitle}</p>
          )}
        </div>
        {icon && (
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-subdued">
            <svg className="h-5 w-5 text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d={icon} />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}
