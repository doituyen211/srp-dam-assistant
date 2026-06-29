"use client";

/**
 * ProblemCard - Shows problem statement suggestions
 */
export function ProblemCard({ card, onAction }) {
  return (
    <div className="rounded-lg border border-danger/30 bg-danger-bg/30 p-4">
      <div className="mb-3 flex items-center gap-2">
        <div className="flex h-6 w-6 items-center justify-center rounded bg-danger/20 text-danger">
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h4 className="text-sm font-semibold text-ink">{card.title}</h4>
      </div>
      <div className="space-y-1.5">
        {card.items?.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onAction?.("select_problem", item)}
            className="flex w-full items-start gap-2 rounded border border-hairline bg-canvas px-3 py-2 text-left text-sm transition-colors hover:border-danger/40 hover:bg-danger-bg/20"
          >
            <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-danger" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-ink">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
