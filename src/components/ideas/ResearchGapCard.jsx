"use client";

import { useState } from "react";

/**
 * ResearchGapCard - Shows clickable research gaps with checkboxes
 */
export function ResearchGapCard({ card, onAction }) {
  const [selected, setSelected] = useState(new Set());

  const toggleItem = (item) => {
    const next = new Set(selected);
    if (next.has(item.id)) {
      next.delete(item.id);
    } else {
      next.add(item.id);
    }
    setSelected(next);
    onAction?.("select_gap", item);
  };

  return (
    <div className="rounded-lg border border-warning/30 bg-warning-bg/30 p-4">
      <div className="mb-3 flex items-center gap-2">
        <div className="flex h-6 w-6 items-center justify-center rounded bg-warning/20 text-warning">
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <h4 className="text-sm font-semibold text-ink">{card.title}</h4>
      </div>
      <div className="space-y-1.5">
        {card.items?.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => toggleItem(item)}
            className={`flex w-full items-center gap-2 rounded border px-3 py-2 text-left text-sm transition-colors ${
              selected.has(item.id)
                ? "border-warning/40 bg-warning/10"
                : "border-hairline bg-canvas hover:border-warning/30"
            }`}
          >
            <div className={`flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border ${
              selected.has(item.id)
                ? "border-warning bg-warning text-white"
                : "border-hairline bg-canvas"
            }`}>
              {selected.has(item.id) && (
                <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <span className="text-ink">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
