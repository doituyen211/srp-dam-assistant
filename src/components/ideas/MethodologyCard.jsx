"use client";

/**
 * MethodologyCard - Shows methodology suggestions
 */
export function MethodologyCard({ card, onAction }) {
  return (
    <div className="rounded-lg border border-success/30 bg-success-bg/30 p-4">
      <div className="mb-3 flex items-center gap-2">
        <div className="flex h-6 w-6 items-center justify-center rounded bg-success/20 text-success">
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <h4 className="text-sm font-semibold text-ink">{card.title}</h4>
      </div>
      <div className="space-y-1.5">
        {card.items?.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onAction?.("select_methodology", item)}
            className="flex w-full items-center gap-2 rounded border border-hairline bg-canvas px-3 py-2 text-left text-sm transition-colors hover:border-success/40 hover:bg-success-bg/20"
          >
            <svg className="h-4 w-4 flex-shrink-0 text-success" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-ink">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
