"use client";

import { AIResponseCard } from "./AIResponseCard";
import { useState } from "react";

/**
 * AIChat - Center column: messages area + input box
 * Input is always visible at the bottom
 */
export function AIChat({ messages, onSend, onApplyCard, isReadOnly }) {
  return (
    <div className="flex h-full min-h-0 flex-col bg-canvas">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-hairline px-5 py-3">
        <div>
          <h2 className="text-sm font-semibold text-ink">AI Workspace</h2>
          <p className="text-[11px] text-muted">
            Describe your research idea — AI will suggest directions
          </p>
        </div>
      </div>

      {/* Messages area — scrolls independently */}
      <div className="flex-1 overflow-y-auto px-5 py-4">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center max-w-sm">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                <svg
                  className="h-7 w-7 text-primary"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-ink">
                Start with an idea
              </h3>
              <p className="mt-1.5 text-sm text-muted">
                Describe your research idea and AI will help you explore
                directions, gaps, and methodologies.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg, i) => (
              <MessageBubble key={i} message={msg} onApplyCard={onApplyCard} />
            ))}
          </div>
        )}
      </div>

      {/* Input area — always visible at bottom */}
      {!isReadOnly && <ChatInput onSend={onSend} />}
    </div>
  );
}

function MessageBubble({ message, onApplyCard }) {
  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] rounded-2xl rounded-br-md bg-primary px-4 py-2.5 text-sm text-white">
          {message.content}
        </div>
      </div>
    );
  }

  // AI response — may contain cards
  if (message.cards?.length > 0) {
    return (
      <div className="space-y-3">
        {message.content && (
          <div className="flex justify-start">
            <div className="max-w-[85%] rounded-2xl rounded-bl-md bg-subdued px-4 py-2.5 text-sm text-ink">
              {message.content}
            </div>
          </div>
        )}
        {message.cards.map((card, i) => (
          <AIResponseCard key={i} card={card} onApply={onApplyCard} />
        ))}
      </div>
    );
  }

  // Plain text AI response
  return (
    <div className="flex justify-start">
      <div className="max-w-[85%] rounded-2xl rounded-bl-md bg-subdued px-4 py-2.5 text-sm text-ink">
        {message.content}
      </div>
    </div>
  );
}

function ChatInput({ onSend }) {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input.trim());
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-hairline bg-canvas px-5 py-4">
      <div className="flex items-end gap-3">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Describe your research idea..."
          rows={2}
          className="flex-1 resize-none rounded-xl border border-hairline bg-white px-4 py-3 text-sm text-ink outline-none transition-all placeholder:text-muted focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={!input.trim()}
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary text-white transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 19V5m0 0l-7 7m7-7l7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
