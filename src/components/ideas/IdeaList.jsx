"use client";

/**
 * IdeaList - Left column: conversation list with + New button
 */
export function IdeaList({ conversations, activeId, onSelect, onNew }) {
  return (
    <div className="flex h-full flex-col border-r border-hairline bg-subdued/30">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-hairline px-4 py-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">Conversations</h3>
        <button
          type="button"
          onClick={onNew}
          className="rounded-lg bg-primary px-2.5 py-1 text-xs font-medium text-white transition-colors hover:bg-primary/90"
        >
          + New
        </button>
      </div>

      {/* Conversation list */}
      <div className="flex-1 overflow-y-auto p-2">
        {conversations.length === 0 ? (
          <div className="flex h-full items-center justify-center p-4">
            <div className="text-center">
              <p className="text-xs text-muted">No conversations yet</p>
              <p className="mt-1 text-[11px] text-muted">Click &quot;+ New&quot; or just start typing</p>
            </div>
          </div>
        ) : (
          <div className="space-y-1">
            {conversations.map((conv) => (
              <button
                key={conv.id}
                type="button"
                onClick={() => onSelect(conv.id)}
                className={`w-full rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                  activeId === conv.id
                    ? "bg-primary/10 font-medium text-primary"
                    : "text-body-muted hover:bg-white/50 hover:text-ink"
                }`}
              >
                <p className="truncate">{conv.title || "New conversation"}</p>
                <p className="mt-0.5 text-[11px] text-muted">
                  {conv.messages?.length || 0} messages
                </p>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
