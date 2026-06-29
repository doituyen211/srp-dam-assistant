"use client";

/**
 * ResearchDirectionCard - Shows clickable research directions
 */
export function ResearchDirectionCard({ card, onAction }) {
  return (
    <div className="rounded-lg border border-info/30 bg-info-bg/30 p-4">
      <div className="mb-3 flex items-center gap-2">
        <div className="flex h-6 w-6 items-center justify-center rounded bg-info/20 text-info">
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
        </div>
        <h4 className="text-sm font-semibold text-ink">{card.title}</h4>
      </div>
      <div className="space-y-1.5">
        {card.items?.map((item, i) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onAction?.("select_direction", item)}
            className="flex w-full items-center gap-2 rounded border border-hairline bg-canvas px-3 py-2 text-left text-sm transition-colors hover:border-info/40 hover:bg-info-bg/20"
          >
            <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-info/10 font-mono text-[10px] font-medium text-info">
              {i + 1}
            </span>
            <span className="text-ink">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
