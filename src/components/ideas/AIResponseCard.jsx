"use client";

import { useState } from "react";

/**
 * AIResponseCard - Expandable card with Apply button
 * Each AI response becomes an expandable card with items
 */
export function AIResponseCard({ card, onApply }) {
  const [expanded, setExpanded] = useState(true);

  if (!card) return null;

  const iconMap = {
    research_direction: { bg: "bg-info/10", text: "text-info", icon: "M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" },
    research_gap: { bg: "bg-warning/10", text: "text-warning", icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" },
    methodology: { bg: "bg-success/10", text: "text-success", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" },
    problem: { bg: "bg-danger/10", text: "text-danger", icon: "M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" },
  };

  const style = iconMap[card.type] || { bg: "bg-subdued", text: "text-muted", icon: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" };

  return (
    <div className="rounded-xl border border-hairline bg-white overflow-hidden">
      {/* Card header */}
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-subdued/30"
      >
        <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg ${style.bg}`}>
          <svg className={`h-4 w-4 ${style.text}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d={style.icon} />
          </svg>
        </div>
        <span className="flex-1 text-sm font-semibold text-ink">{card.title}</span>
        <svg
          className={`h-4 w-4 text-muted transition-transform ${expanded ? "rotate-180" : ""}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Card content — expandable */}
      {expanded && card.items?.length > 0 && (
        <div className="border-t border-hairline px-4 py-3 space-y-2">
          {card.items.map((item, i) => (
            <div
              key={item.id || i}
              className="flex items-start gap-3 rounded-lg border border-hairline bg-subdued/30 p-3"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-ink">{item.label}</p>
                {item.description && (
                  <p className="mt-0.5 text-xs text-body-muted">{item.description}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => onApply?.(card.type, item)}
                className="flex-shrink-0 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-primary/90"
              >
                Apply
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
