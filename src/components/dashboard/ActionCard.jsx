"use client";

/**
 * ActionCard - Action-oriented card with CTA for dashboard
 */
export function ActionCard({ title, description, href, ctaText = "View", accent = "primary", icon, badge, className = "" }) {
  return (
    <div className={`rounded-xl border border-hairline bg-white p-5 transition-all hover:shadow-md ${className}`}>
      <div className="flex items-start gap-4">
        {icon && (
          <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-${accent}/10`}>
            <svg className={`h-5 w-5 text-${accent}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d={icon} />
            </svg>
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-ink">{title}</h3>
            {badge && (
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium bg-${accent}/10 text-${accent}`}>
                {badge}
              </span>
            )}
          </div>
          {description && (
            <p className="mt-1 text-xs text-body-muted line-clamp-2">{description}</p>
          )}
          <a
            href={href}
            className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
          >
            {ctaText}
            <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
