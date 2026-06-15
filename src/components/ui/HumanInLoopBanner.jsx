"use client";

/**
 * HumanInLoopBanner — Reusable visual pattern that communicates
 * "AI provides advisory support only. Final decisions are made by authorized humans."
 *
 * Inspired by DESIGN.md's principle: "Human-in-the-loop must be visible in the UI."
 *
 * @param {Object} props
 * @param {string} props.variant - "banner" (full width), "inline" (compact), "badge" (small tag)
 * @param {string} props.className - Additional classes
 */
export function HumanInLoopBanner({
  variant = "banner",
  className = "",
}) {
  if (variant === "badge") {
    return (
      <span className={`human-in-loop-marker text-[10px] ${className}`}>
        <span className="font-medium">AI advisory</span>
        <span className="opacity-60">•</span>
        <span className="opacity-70">Human decides</span>
      </span>
    );
  }

  if (variant === "inline") {
    return (
      <div
        className={`flex items-start gap-2 rounded border border-hairline bg-subdued px-3 py-2 text-xs leading-5 text-body-muted ${className}`}
      >
        <svg
          aria-hidden="true"
          className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
        <div>
          <strong>AI advisory only.</strong>{" "}
          Final decisions are made by authorized humans.
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex items-start gap-3 rounded border border-hairline bg-subdued px-4 py-3 text-sm leading-6 text-body-muted ${className}`}
    >
      <svg
        aria-hidden="true"
        className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
      <div className="space-y-1">
        <p className="font-medium text-ink">Human-in-the-loop</p>
        <p>
          AI provides advisory support and suggestions only. All final
          decisions — including approvals, rejections, and supervisor
          assignments — are made by authorized human reviewers and
          administrators.
        </p>
      </div>
    </div>
  );
}
