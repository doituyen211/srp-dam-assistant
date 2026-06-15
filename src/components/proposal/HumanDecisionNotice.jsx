"use client";

/**
 * HumanDecisionNotice — Visually clear notice that humans make the final decision.
 * Use this in review panels, AI feedback areas, and decision workflows.
 */
export function HumanDecisionNotice({
  variant = "default",
  className = "",
}) {
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
          <strong>Needs human review.</strong>{" "}
          AI assessment is advisory only. Final decisions are made by reviewers.
        </div>
      </div>
    );
  }

  return (
    <div
      className={`rounded border border-hairline bg-subdued px-4 py-3 ${className}`}
    >
      <div className="flex items-start gap-3">
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
        <div>
          <p className="text-sm font-medium text-ink">Human-in-the-loop</p>
          <p className="mt-1 text-sm leading-6 text-body-muted">
            AI pre-reviews are designed to assist — not replace — human
            judgment. All approvals, revisions, and rejections are made by
            qualified reviewers and administrators.
          </p>
        </div>
      </div>
    </div>
  );
}
