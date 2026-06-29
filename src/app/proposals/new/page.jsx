"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { ProposalForm } from "@/components/proposal/ProposalForm";
import { AIWorkspace } from "@/components/ideas/AIWorkspace";
import { ProposalBuilder } from "@/components/ideas/ProposalBuilder";
import { parseAIResponse, generateSampleResponse } from "@/components/ideas/parseAIResponse";
import { Alert } from "@/components/ui/Alert";
import { LoadingState } from "@/components/ui/LoadingState";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import { USER_ROLES } from "@/lib/constants";

function NewProposalContent() {
  const router = useRouter();
  const { user } = useAuth();
  const [mode, setMode] = useState("idea"); // "idea" or "form"

  if (mode === "form") {
    return <FormFlow onBack={() => setMode("idea")} />;
  }

  return <IdeaFlow user={user} onSwitchToForm={() => setMode("form")} />;
}

// ─── Idea-to-Proposal Flow (3-column) ───

function IdeaFlow({ user, onSwitchToForm }) {
  const router = useRouter();
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [proposalData, setProposalData] = useState({
    title: "", researchField: "", keywords: "", abstract: "",
    problem: "", question: "", objectives: "", literature: "",
    methodology: "", feasibility: "", contribution: "", ethics: "", references: "",
  });

  const activeSession = sessions.find((s) => s.id === activeSessionId);

  // Load chat sessions from backend
  useEffect(() => {
    let mounted = true;
    api.getChatSessions()
      .then((data) => { if (mounted) setSessions(Array.isArray(data) ? data : []); })
      .catch(() => {})
      .finally(() => { if (mounted) setLoadingSessions(false); });
    return () => { mounted = false; };
  }, []);

  const handleNewSession = () => {
    const tempId = `temp-${Date.now()}`;
    const newSession = { id: tempId, title: "New conversation", messages: [], createdAt: new Date().toISOString() };
    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(tempId);
  };

  const handleSelectSession = (id) => {
    setActiveSessionId(id);
    const session = sessions.find((s) => s.id === id);
    if (session && !session.messages?.length && !id.startsWith("temp-")) {
      api.getChatMessages(id)
        .then((messages) => {
          setSessions((prev) => prev.map((s) => s.id === id ? { ...s, messages } : s));
        })
        .catch(() => {});
    }
  };

  const handleSend = async (text) => {
    setError("");

    // Auto-create session if none selected
    let sessionId = activeSessionId;
    if (!sessionId) {
      try {
        const session = await api.createChatSession(text.slice(0, 50));
        sessionId = session.id;
        setSessions((prev) => [session, ...prev]);
        setActiveSessionId(sessionId);
      } catch {
        // Fallback: create local session
        sessionId = `temp-${Date.now()}`;
        const localSession = { id: sessionId, title: text.slice(0, 50), messages: [], createdAt: new Date().toISOString() };
        setSessions((prev) => [localSession, ...prev]);
        setActiveSessionId(sessionId);
      }
    }

    // Add user message optimistically
    const userMsg = { role: "user", content: text };
    setSessions((prev) => prev.map((s) =>
      s.id === sessionId
        ? { ...s, title: s.title === "New conversation" ? text.slice(0, 50) : s.title, messages: [...(s.messages || []), userMsg] }
        : s
    ));

    try {
      // Send to backend (skip for temp sessions)
      if (!sessionId.startsWith("temp-")) {
        const response = await api.sendChatMessage(sessionId, text);
        const parsed = parseAIResponse(response);
        const aiMsg = { role: "assistant", content: "Here are suggestions based on your idea:", cards: parsed.cards };
        setSessions((prev) => prev.map((s) =>
          s.id === sessionId ? { ...s, messages: [...(s.messages || []), aiMsg] } : s
        ));
      } else {
        // Use sample response for temp sessions
        const rawResponse = generateSampleResponse(text);
        const parsed = parseAIResponse(rawResponse);
        const aiMsg = { role: "assistant", content: "Here are suggestions based on your idea:", cards: parsed.cards };
        setSessions((prev) => prev.map((s) =>
          s.id === sessionId ? { ...s, messages: [...(s.messages || []), aiMsg] } : s
        ));
      }
    } catch {
      // Fallback to sample response
      const rawResponse = generateSampleResponse(text);
      const parsed = parseAIResponse(rawResponse);
      const aiMsg = { role: "assistant", content: "Here are suggestions based on your idea:", cards: parsed.cards };
      setSessions((prev) => prev.map((s) =>
        s.id === sessionId ? { ...s, messages: [...(s.messages || []), aiMsg] } : s
      ));
    }
  };

  const handleCardAction = (action, item) => {
    setProposalData((prev) => {
      const newData = { ...prev };
      const content = item.content || item.label;
      switch (action) {
        case "select_direction":
          if (!newData.problem) newData.problem = content;
          if (!newData.title) newData.title = item.label;
          break;
        case "select_gap":
          if (!newData.problem) newData.problem = content;
          break;
        case "select_methodology":
          if (!newData.methodology) newData.methodology = content;
          break;
        case "select_problem":
          if (!newData.problem) newData.problem = content;
          break;
      }
      return newData;
    });
  };

  const handleCreateProposal = async () => {
    if (!proposalData.title?.trim()) {
      setError("Please enter a proposal title.");
      return;
    }
    setCreating(true);
    setError("");
    try {
      const keywords = typeof proposalData.keywords === "string"
        ? proposalData.keywords.split(",").map((k) => k.trim()).filter(Boolean)
        : proposalData.keywords || [];

      const proposal = await api.createProposal({
        title: proposalData.title,
        abstract: proposalData.abstract || "",
        researchField: proposalData.researchField || "",
        keywords,
        studentId: user?.id,
        studentName: user?.name,
      });

      const sectionMappings = [
        { key: "abstract", from: ["abstract"] },
        { key: "research_problem", from: ["problem"] },
        { key: "research_question", from: ["question"] },
        { key: "objectives", from: ["objectives"] },
        { key: "literature_background", from: ["literature"] },
        { key: "methodology", from: ["methodology"] },
        { key: "feasibility_timeline", from: ["feasibility"] },
        { key: "expected_contribution", from: ["contribution"] },
        { key: "ethics_risks", from: ["ethics"] },
        { key: "references", from: ["references"] },
      ];
      for (const mapping of sectionMappings) {
        const content = mapping.from.reduce((val, key) => val || proposalData[key] || "", "");
        if (content.trim()) {
          await api.updateProposalSection(proposal.id, mapping.key, content).catch(() => {});
        }
      }

      setMessage("Proposal created successfully!");
      setTimeout(() => router.push(`/proposals/${proposal.id}`), 1500);
    } catch (err) {
      setError(err.message || "Failed to create proposal.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">Idea to Proposal</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-[-0.02em] text-ink md:text-3xl">New Proposal</h1>
        </div>
        <div className="flex items-center gap-3">
          <button type="button" onClick={onSwitchToForm} className="text-sm text-primary hover:underline">
            Skip to form →
          </button>
          <Link href="/proposals" className="rounded-lg border border-hairline px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-subdued">
            Back to proposals
          </Link>
        </div>
      </div>

      {message && <Alert type="success" closable>{message}</Alert>}
      {error && <Alert type="error">{error}</Alert>}

      {/* 3-column layout */}
      <div className="h-[calc(100vh-180px)] min-h-[500px] grid grid-cols-1 gap-0 overflow-auto rounded-xl border border-hairline lg:grid-cols-[260px_1fr_340px]">
        {/* Column 1: Chat Sessions */}
        <div className="hidden lg:flex lg:flex-col min-h-0 border-r border-hairline bg-subdued/30">
          <div className="flex items-center justify-between border-b border-hairline px-4 py-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">Conversations</h3>
            <button
              type="button"
              onClick={handleNewSession}
              className="rounded-lg bg-primary px-2.5 py-1 text-xs font-medium text-white transition-colors hover:bg-primary/90"
            >
              + New
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            {loadingSessions ? (
              <div className="p-4"><LoadingState /></div>
            ) : sessions.length === 0 ? (
              <div className="p-4 text-center">
                <p className="text-xs text-muted">No conversations yet</p>
                <p className="mt-1 text-[11px] text-muted">Click &quot;+ New&quot; or just start typing</p>
              </div>
            ) : (
              <div className="space-y-1">
                {sessions.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => handleSelectSession(s.id)}
                    className={`w-full rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                      activeSessionId === s.id
                        ? "bg-primary/10 font-medium text-primary"
                        : "text-body-muted hover:bg-white/50 hover:text-ink"
                    }`}
                  >
                    <p className="truncate">{s.title || "New conversation"}</p>
                    <p className="mt-0.5 text-[11px] text-muted">
                      {s.messages?.length || 0} messages
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Column 2: AI Workspace */}
        <div className="min-h-0">
          <AIWorkspace
            messages={activeSession?.messages || []}
            onSend={handleSend}
            onCardAction={handleCardAction}
            isReadOnly={false}
          />
        </div>

        {/* Column 3: Proposal Builder */}
        <div className="min-h-0">
          <ProposalBuilder
            proposalData={proposalData}
            onUpdate={setProposalData}
            onCreate={handleCreateProposal}
            loading={creating}
            isReadOnly={false}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Form Flow (existing proposal form) ───

function FormFlow({ onBack }) {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (formData, submitMode) => {
    setLoading(true);
    setError("");
    try {
      const keywords = typeof formData.keywords === "string"
        ? formData.keywords.split(",").map((k) => k.trim()).filter(Boolean)
        : formData.keywords || [];

      const proposal = await api.createProposal({
        ...formData,
        keywords,
        studentId: user?.id,
        studentName: user?.name,
      });

      const sectionMappings = [
        { key: "abstract", from: ["abstract"] },
        { key: "research_problem", from: ["problem", "research_problem"] },
        { key: "research_question", from: ["question", "research_question"] },
        { key: "objectives", from: ["objectives"] },
        { key: "literature_background", from: ["literature", "literature_background"] },
        { key: "methodology", from: ["methodology"] },
        { key: "feasibility_timeline", from: ["feasibility", "feasibility_timeline"] },
        { key: "expected_contribution", from: ["contribution", "expected_contribution", "expectedImpact"] },
        { key: "ethics_risks", from: ["ethics", "ethics_risks"] },
        { key: "references", from: ["references"] },
      ];

      for (const mapping of sectionMappings) {
        const content = mapping.from.reduce((val, key) => val || formData[key] || "", "");
        if (content.trim()) {
          await api.updateProposalSection(proposal.id, mapping.key, content).catch(() => {});
        }
      }

      if (submitMode === "submit") {
        await api.submitProposal(proposal.id);
      }
      router.push("/proposals");
    } catch {
      setError(submitMode === "submit"
        ? "Failed to submit proposal. Please check your content and try again."
        : "Failed to save draft. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">Proposal Workspace</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-[-0.02em] text-ink md:text-3xl">New Research Proposal</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-body-muted">Complete each section carefully. Strong proposals clearly define the problem, objectives, methodology, and expected contributions.</p>
        </div>
        <button onClick={onBack} className="inline-flex items-center justify-center rounded-lg border border-hairline px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-subdued">
          ← Back to Idea Flow
        </button>
      </div>
      {error && <Alert type="error">{error}</Alert>}
      <ProposalForm onSubmit={handleSubmit} loading={loading} error={null} />
    </div>
  );
}

export default function NewProposalPage() {
  return (
    <ProtectedRoute allowedRoles={[USER_ROLES.STUDENT]}>
      <AppShell>
        <NewProposalContent />
      </AppShell>
    </ProtectedRoute>
  );
}
