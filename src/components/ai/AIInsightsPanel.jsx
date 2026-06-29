"use client";

import { useState } from "react";

/**
 * AIInsightsPanel - Accordion container for 3 AI tools
 * Idea Analysis | Proposal Evaluation | Supervisor Matching
 */
export function AIInsightsPanel({ proposalId, proposal }) {
  const [openSection, setOpenSection] = useState("idea_analysis");

  const sections = [
    {
      id: "idea_analysis",
      label: "Idea Analysis",
      description: "Brainstorm and develop research ideas",
      icon: (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
    },
    {
      id: "proposal_evaluation",
      label: "Proposal Evaluation",
      description: "Evaluate proposal quality against rubric criteria",
      icon: (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      id: "supervisor_matching",
      label: "Supervisor Matching",
      description: "Find suitable supervising lecturer",
      icon: (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
  ];

  const toggleSection = (sectionId) => {
    setOpenSection(openSection === sectionId ? null : sectionId);
  };

  return (
    <div className="space-y-3">
      {sections.map((section) => {
        const isOpen = openSection === section.id;
        return (
          <div key={section.id} className="rounded border border-hairline bg-canvas overflow-hidden">
            {/* Accordion header */}
            <button
              type="button"
              onClick={() => toggleSection(section.id)}
              className="flex w-full items-center gap-3 p-4 text-left transition-colors hover:bg-subdued/50"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded bg-primary/10 text-primary">
                {section.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-ink">{section.label}</p>
                <p className="text-xs text-body-muted">{section.description}</p>
              </div>
              <svg
                className={`h-5 w-5 text-muted transition-transform ${isOpen ? "rotate-180" : ""}`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Accordion content */}
            {isOpen && (
              <div className="border-t border-hairline p-4">
                {section.id === "idea_analysis" && <IdeaAnalysisContent proposalId={proposalId} />}
                {section.id === "proposal_evaluation" && <ProposalEvaluationContent proposalId={proposalId} proposal={proposal} />}
                {section.id === "supervisor_matching" && <SupervisorMatchingContent proposalId={proposalId} proposal={proposal} />}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Placeholder content for each AI tool ───

function IdeaAnalysisContent({ proposalId }) {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hello! I can help you develop research ideas. What topic are you interested in?" }
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages((prev) => [
      ...prev,
      { role: "user", content: input },
      { role: "assistant", content: "This is a sample response. AI features will be connected later." },
    ]);
    setInput("");
  };

  return (
    <div className="space-y-4">
      {/* Chat messages */}
      <div className="max-h-64 space-y-3 overflow-y-auto">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                msg.role === "user"
                  ? "bg-primary text-white"
                  : "bg-subdued text-ink"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Enter your idea..."
          className="flex-1 rounded border border-hairline bg-canvas px-3 py-2 text-sm text-ink outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
        />
        <button
          type="button"
          onClick={handleSend}
          className="rounded bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
        >
          Send
        </button>
      </div>

      {/* Suggestion cards */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {["Identify the problem", "Research objectives", "Methodology"].map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => setInput(suggestion)}
            className="whitespace-nowrap rounded-full border border-hairline bg-subdued px-3 py-1.5 text-xs text-body-muted transition-colors hover:bg-subdued/80 hover:text-ink"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
}

function ProposalEvaluationContent({ proposalId, proposal }) {
  const sections = proposal?.sections || [];
  const [expandedItem, setExpandedItem] = useState(null);

  const evaluations = [
    { label: "Novelty", key: "problem", maxScore: 10 },
    { label: "Methodology", key: "methodology", maxScore: 10 },
    { label: "Feasibility", key: "feasibility", maxScore: 10 },
    { label: "Writing Quality", key: "abstract", maxScore: 10 },
    { label: "Contribution", key: "contribution", maxScore: 10 },
    { label: "References", key: "references", maxScore: 10 },
  ];

  // Compute scores from section content (deterministic based on content length)
  const computed = evaluations.map((e) => {
    const section = sections.find((s) => s.id === e.key);
    const content = section?.content || "";
    const len = content.length;
    let score = 0;
    if (len >= 300) score = 9;
    else if (len >= 200) score = 8;
    else if (len >= 100) score = 7;
    else if (len >= 50) score = 5;
    else if (len > 0) score = 3;
    else score = 0;
    return { ...e, score, hasContent: len > 0 };
  });

  const totalScore = computed.reduce((sum, e) => sum + e.score, 0);
  const maxTotal = computed.length * 10;
  const percent = maxTotal > 0 ? Math.round((totalScore / maxTotal) * 100) : 0;

  const needsImprovement = computed.filter((e) => e.score < 7 && e.hasContent);
  const missing = computed.filter((e) => !e.hasContent);

  const getScoreColor = (score) => {
    if (score >= 8) return "text-success";
    if (score >= 6) return "text-warning";
    return "text-danger";
  };

  const getScoreBarColor = (score) => {
    if (score >= 8) return "bg-success";
    if (score >= 6) return "bg-warning";
    return "bg-danger";
  };

  return (
    <div className="space-y-4">
      {/* Overall Score */}
      <div className="rounded border border-hairline bg-canvas p-4 text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted">Overall Score</p>
        <p className="mt-1 text-3xl font-bold text-ink">{percent}<span className="text-sm text-muted">/100</span></p>
        <div className="mx-auto mt-2 h-2 w-full max-w-[200px] overflow-hidden rounded-full bg-subdued">
          <div
            className={`h-full rounded-full transition-all ${getScoreBarColor(percent / 10)}`}
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      {/* Per-criterion scores */}
      <div className="space-y-1">
        {computed.map((e) => (
          <button
            key={e.key}
            type="button"
            onClick={() => setExpandedItem(expandedItem === e.key ? null : e.key)}
            className="flex w-full items-center justify-between rounded border border-hairline px-3 py-2 text-left transition-colors hover:bg-subdued/50"
          >
            <span className="text-xs text-ink">{e.label}</span>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-medium ${getScoreColor(e.score)}`}>
                {e.score > 0 ? e.score.toFixed(1) : "—"}
              </span>
              <span className={`text-xs ${e.score >= 7 ? "text-success" : e.score > 0 ? "text-warning" : "text-muted"}`}>
                {e.score >= 7 ? "✓" : e.score > 0 ? "⚠" : "✗"}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Expanded detail */}
      {expandedItem && (
        <div className="rounded border border-primary/20 bg-primary/5 p-3">
          {(() => {
            const item = computed.find((e) => e.key === expandedItem);
            if (!item) return null;
            return (
              <div className="space-y-2">
                <p className="text-xs font-medium text-ink">{item.label}</p>
                {item.hasContent ? (
                  <>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-body-muted">Score:</span>
                      <span className={`text-sm font-semibold ${getScoreColor(item.score)}`}>{item.score.toFixed(1)}/10</span>
                    </div>
                    <p className="text-xs text-body-muted">
                      {item.score >= 7
                        ? "This section is well written. Keep developing it."
                        : "This section needs improvement. Add more details and evidence."}
                    </p>
                  </>
                ) : (
                  <p className="text-xs text-warning">This section has not been written. Please add content.</p>
                )}
              </div>
            );
          })()}
        </div>
      )}

      {/* Need Improvement */}
      {(needsImprovement.length > 0 || missing.length > 0) && (
        <div className="rounded border border-warning/20 bg-warning-bg/30 p-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-warning">Needs Improvement</p>
          <div className="mt-2 space-y-1">
            {missing.map((e) => (
              <div key={e.key} className="flex items-center gap-2 text-xs text-danger">
                <span className="h-1.5 w-1.5 rounded-full bg-danger" />
                <span>{e.label} — Not written</span>
              </div>
            ))}
            {needsImprovement.map((e) => (
              <div key={e.key} className="flex items-center gap-2 text-xs text-warning">
                <span className="h-1.5 w-1.5 rounded-full bg-warning" />
                <span>{e.label} — Needs improvement ({e.score.toFixed(1)}/10)</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No data message */}
      {computed.every((e) => !e.hasContent) && (
        <p className="text-center text-xs text-body-muted">
          No evaluation data yet. Write proposal content to receive scores.
        </p>
      )}
    </div>
  );
}

function SupervisorMatchingContent({ proposalId, proposal }) {
  return (
    <div className="space-y-4">
      <div className="text-center py-6">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-subdued">
          <svg className="h-6 w-6 text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <p className="text-sm font-medium text-ink">No suggestions yet</p>
        <p className="text-xs text-body-muted">Supervisor suggestions will appear after the proposal is approved.</p>
      </div>
    </div>
  );
}
