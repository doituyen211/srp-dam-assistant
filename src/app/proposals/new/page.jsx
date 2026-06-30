"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { ProposalForm } from "@/components/proposal/ProposalForm";
import { IdeaList } from "@/components/ideas/IdeaList";
import { AIChat } from "@/components/ideas/AIChat";
import { ProposalAutofill } from "@/components/ideas/ProposalAutofill";
import { parseAIResponse, generateSampleResponse } from "@/components/ideas/parseAIResponse";
import { Alert } from "@/components/ui/Alert";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import { USER_ROLES } from "@/lib/constants";

function NewProposalContent() {
  const router = useRouter();
  const { user } = useAuth();
  const [mode, setMode] = useState("idea"); // "idea" or "form"
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Idea flow state
  const [conversations, setConversations] = useState([]);
  const [activeConvId, setActiveConvId] = useState(null);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [creating, setCreating] = useState(false);
  const [proposalData, setProposalData] = useState({
    title: "", researchField: "", keywords: "", abstract: "",
    problem: "", objectives: "", methodology: "", timeline: "", outcome: "",
  });

  const activeConversation = conversations.find((c) => c.id === activeConvId);

  // Load chat sessions from backend
  useEffect(() => {
    let mounted = true;
    api.getChatSessions()
      .then((data) => { if (mounted) setConversations(Array.isArray(data) ? data : []); })
      .catch(() => {})
      .finally(() => { if (mounted) setLoadingSessions(false); });
    return () => { mounted = false; };
  }, []);

  const handleNewSession = () => {
    const tempId = `temp-${Date.now()}`;
    const newConv = { id: tempId, title: "New conversation", messages: [], createdAt: new Date().toISOString() };
    setConversations((prev) => [newConv, ...prev]);
    setActiveConvId(tempId);
  };

  const handleSelectSession = (id) => {
    setActiveConvId(id);
    const conv = conversations.find((c) => c.id === id);
    if (conv && !conv.messages?.length && !id.startsWith("temp-")) {
      api.getChatMessages(id)
        .then((msgs) => {
          setConversations((prev) => prev.map((c) => c.id === id ? { ...c, messages: msgs } : c));
        })
        .catch(() => {});
    }
  };

  const handleSend = async (text) => {
    setError("");
    let convId = activeConvId;
    if (!convId) {
      try {
        const session = await api.createChatSession(text.slice(0, 50));
        convId = session.id;
        setConversations((prev) => [session, ...prev]);
        setActiveConvId(convId);
      } catch {
        convId = `temp-${Date.now()}`;
        const local = { id: convId, title: text.slice(0, 50), messages: [], createdAt: new Date().toISOString() };
        setConversations((prev) => [local, ...prev]);
        setActiveConvId(convId);
      }
    }

    const userMsg = { role: "user", content: text };
    setConversations((prev) => prev.map((c) =>
      c.id === convId
        ? { ...c, title: c.title === "New conversation" ? text.slice(0, 50) : c.title, messages: [...(c.messages || []), userMsg] }
        : c
    ));

    try {
      let aiMsg;
      if (!convId.startsWith("temp-")) {
        const response = await api.sendChatMessage(convId, text);
        const parsed = parseAIResponse(response);
        aiMsg = { role: "assistant", content: "Here are suggestions based on your idea:", cards: parsed.cards };
      } else {
        const rawResponse = generateSampleResponse(text);
        const parsed = parseAIResponse(rawResponse);
        aiMsg = { role: "assistant", content: "Here are suggestions based on your idea:", cards: parsed.cards };
      }
      setConversations((prev) => prev.map((c) =>
        c.id === convId ? { ...c, messages: [...(c.messages || []), aiMsg] } : c
      ));
    } catch {
      const rawResponse = generateSampleResponse(text);
      const parsed = parseAIResponse(rawResponse);
      const aiMsg = { role: "assistant", content: "Here are suggestions based on your idea:", cards: parsed.cards };
      setConversations((prev) => prev.map((c) =>
        c.id === convId ? { ...c, messages: [...(c.messages || []), aiMsg] } : c
      ));
    }
  };

  const handleApplyCard = (cardType, item) => {
    const content = item.content || item.label;
    setProposalData((prev) => {
      const newData = { ...prev };
      switch (cardType) {
        case "research_direction":
          if (!newData.problem) newData.problem = content;
          if (!newData.title) newData.title = item.label;
          break;
        case "research_gap":
          if (!newData.problem) newData.problem = content;
          break;
        case "methodology":
          if (!newData.methodology) newData.methodology = content;
          break;
        case "problem":
          if (!newData.problem) newData.problem = content;
          break;
      }
      return newData;
    });
  };

  const handleCreateFromIdea = async () => {
    if (!proposalData.title?.trim()) {
      setError("Please enter a proposal title.");
      return;
    }
    setCreating(true);
    setError("");
    setMessage("");
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
        { key: "expected_contribution", from: ["contribution", "outcome"] },
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

  const handleFormSubmit = async (formData, submitMode) => {
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
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">Idea to Proposal</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-[-0.02em] text-ink md:text-3xl">New Proposal</h1>
        </div>
        <div className="flex items-center gap-3">
          {mode === "idea" ? (
            <button type="button" onClick={() => setMode("form")} className="text-sm text-primary hover:underline">
              Skip to form →
            </button>
          ) : (
            <button type="button" onClick={() => setMode("idea")} className="text-sm text-primary hover:underline">
              ← Back to Idea flow
            </button>
          )}
          <Link href="/proposals" className="rounded-lg border border-hairline px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-subdued">
            Back to proposals
          </Link>
        </div>
      </div>

      {message && <Alert type="success" closable>{message}</Alert>}
      {error && <Alert type="error">{error}</Alert>}

      {/* Content area */}
      {mode === "idea" ? (
        /* 3-column Idea layout */
        <div className="h-[calc(100vh-180px)] min-h-[500px] grid grid-cols-1 gap-0 overflow-auto rounded-xl border border-hairline lg:grid-cols-[260px_1fr_340px]">
          <div className="min-h-0">
            <IdeaList
              conversations={conversations}
              activeId={activeConvId}
              onSelect={handleSelectSession}
              onNew={handleNewSession}
            />
          </div>
          <div className="min-h-0">
            <AIChat
              messages={activeConversation?.messages || []}
              onSend={handleSend}
              onApplyCard={handleApplyCard}
              isReadOnly={false}
            />
          </div>
          <div className="min-h-0">
            <ProposalAutofill
              data={proposalData}
              onUpdate={setProposalData}
              onCreate={handleCreateFromIdea}
              loading={creating}
            />
          </div>
        </div>
      ) : (
        /* ProposalForm */
        <ProposalForm onSubmit={handleFormSubmit} loading={loading} error={null} />
      )}
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
