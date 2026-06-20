"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { AIFeedbackPanel, RubricScoreCard } from "@/components/ai";
import { AppShell } from "@/components/layout/AppShell";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { ProposalStatusBadge } from "@/components/proposal/ProposalStatusBadge";
import { ProposalSectionNav } from "@/components/proposal/ProposalSectionNav";
import { SectionHealthBadge } from "@/components/proposal/SectionHealthBadge";
import { HumanDecisionNotice } from "@/components/proposal/HumanDecisionNotice";
import { VersionHistory } from "@/components/proposal/VersionHistory";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingState } from "@/components/ui/LoadingState";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import {
  USER_ROLES,
  WORKFLOW_STAGES,
  SECTION_TYPES,
  PROPOSAL_STATUSES,
} from "@/lib/constants";

const EDITABLE_STATUSES = [
  PROPOSAL_STATUSES.DRAFT,
  PROPOSAL_STATUSES.AI_PRE_CHECK,
  PROPOSAL_STATUSES.NEEDS_REVISION,
];

const formatDate = (value) => {
  if (!value) return "N/A";
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
};

function StatusHistoryCard({ history = [] }) {
  if (!history.length) {
    return (
      <div className="text-xs text-muted">No status changes recorded yet.</div>
    );
  }
  return (
    <div className="space-y-2">
      {history.map((entry, i) => (
        <div key={entry.id || i} className="rounded border border-hairline bg-canvas p-2.5">
          <div className="flex items-center justify-between gap-2">
            <ProposalStatusBadge status={entry.to_status || entry.status} />
            <span className="font-mono text-[10px] text-muted">
              {formatDate(entry.created_at || entry.timestamp)}
            </span>
          </div>
          {(entry.from_status || entry.changed_by) && (
            <p className="mt-1 text-[11px] text-body-muted">
              {entry.from_status && `From: ${entry.from_status}`}
              {entry.changed_by && ` · by ${entry.changed_by}`}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

function SectionDisplay({ section, sectionDef, isEditing, editContent, onEditChange, onSave, onCancel, saving }) {
  if (!section && !isEditing) {
    return (
      <div className="rounded border border-dashed border-hairline bg-subdued/30 p-4 text-center">
        <p className="text-sm text-muted">This section has not been written yet.</p>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-base font-semibold text-ink">
            {sectionDef?.label}: Edit
          </h2>
        </div>
        <textarea
          value={editContent}
          onChange={(e) => onEditChange(e.target.value)}
          rows={10}
          className="w-full resize-y rounded border border-hairline bg-canvas px-4 py-3 text-base text-ink outline-none transition-all focus:border-primary/40 focus:ring-4 focus:ring-primary/10"
        />
        <div className="flex gap-2">
          <Button variant="primary" loading={saving} disabled={saving} onClick={onSave}>
            Save
          </Button>
          <Button variant="ghost" onClick={onCancel} disabled={saving}>
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-ink">
            {sectionDef?.label || section?.label}
          </h2>
        </div>
        <SectionHealthBadge health={section?.health || "missing"} />
      </div>

      <div className="whitespace-pre-wrap rounded border border-hairline bg-canvas p-4 font-serif text-sm leading-7 text-ink">
        {section?.content || ""}
      </div>

      {section?.aiComment && (
        <div className="rounded border border-info/20 bg-info-bg/30 px-3 py-2">
          <p className="font-mono text-[9px] uppercase tracking-[0.06em] text-info">AI Pre-review Note</p>
          <p className="mt-0.5 text-xs text-body-muted">{section.aiComment}</p>
        </div>
      )}
      {section?.rubricHint && (
        <div className="rounded border border-warning/20 bg-warning-bg/30 px-3 py-2">
          <p className="font-mono text-[9px] uppercase tracking-[0.06em] text-warning">Reviewer Consideration</p>
          <p className="mt-0.5 text-xs text-body-muted">{section.rubricHint}</p>
        </div>
      )}
    </div>
  );
}

function ProposalDetailContent() {
  const params = useParams();
  const router = useRouter();
  const proposalId = params?.id;
  const { user } = useAuth();
  const [proposal, setProposal] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [rubricReview, setRubricReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");
  const [activeSection, setActiveSection] = useState(null);
  const [editSectionId, setEditSectionId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [savingSection, setSavingSection] = useState(false);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loadingAudit, setLoadingAudit] = useState(false);

  const isOwner = proposal?.studentId === user?.id || proposal?.student_id === user?.id;
  const isEditableStatus = EDITABLE_STATUSES.includes(proposal?.status);
  const canEdit = isEditableStatus && (isOwner || user?.role === USER_ROLES.ADMIN || user?.role === USER_ROLES.SUPER_ADMIN);
  const canSubmit = isOwner && (proposal?.status === PROPOSAL_STATUSES.DRAFT || proposal?.status === PROPOSAL_STATUSES.NEEDS_REVISION);

  const refetchAll = async () => {
    if (!proposalId) return;
    try {
      const [p, fb, rv] = await Promise.allSettled([
        api.getProposalById(proposalId),
        api.getAIFeedback(proposalId),
        api.getRubricReview(proposalId),
      ]);
      if (p.status === "fulfilled") setProposal(p.value);
      if (fb.status === "fulfilled") setFeedback(fb.value);
      if (rv.status === "fulfilled") setRubricReview(rv.value);
    } catch {
      setError("Failed to refresh proposal data.");
    }
  };

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setNotFound(false);
      setError("");
      try {
        const proposalData = await api.getProposalById(proposalId);
        const [fb, rv] = await Promise.allSettled([
          api.getAIFeedback(proposalId),
          api.getRubricReview(proposalId),
        ]);
        if (!mounted) return;
        setProposal(proposalData);
        setFeedback(fb.status === "fulfilled" ? fb.value : null);
        setRubricReview(rv.status === "fulfilled" ? rv.value : null);
        const sects = proposalData?.sections || [];
        if (sects.length > 0) setActiveSection(sects[0]?.id || SECTION_TYPES[0]?.id);
        else setActiveSection(SECTION_TYPES[0]?.id);
      } catch {
        if (mounted) setNotFound(true);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    const loadAudit = async () => {
      if (!proposalId) return;
      setLoadingAudit(true);
      try {
        const logs = await api.getAuditLogs();
        setAuditLogs((logs || []).filter((l) => l.details?.includes(proposalId)));
      } catch {
        // silent
      } finally {
        setLoadingAudit(false);
      }
    };
    if (proposalId) { load(); loadAudit(); }
    return () => { mounted = false; };
  }, [proposalId]);

  const sections = useMemo(() => proposal?.sections || [], [proposal]);
  const sectionDefs = SECTION_TYPES;
  const currentSection = useMemo(() => sections.find((s) => s.id === activeSection), [sections, activeSection]);
  const currentSectionDef = useMemo(() => sectionDefs.find((s) => s.id === activeSection), [sectionDefs, activeSection]);

  const handleRunAIFeedback = async () => {
    setAiLoading(true);
    setAiError("");
    setMessage("");
    try {
      const nextFeedback = await api.runAIFeedback(proposalId);
      setFeedback(nextFeedback);
      setMessage("AI pre-review completed. Results are advisory only.");
    } catch {
      setAiError("Unable to run AI pre-review. Please try again.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async () => {
    setAiLoading(true);
    setAiError("");
    setMessage("");
    try {
      const updated = await api.submitProposal(proposalId);
      setProposal(updated);
      setMessage("Proposal submitted for review.");
    } catch {
      setAiError("Unable to submit proposal. Please try again.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleEditSection = (sectionId) => {
    const section = sections.find((s) => s.id === sectionId);
    setEditSectionId(sectionId);
    setEditContent(section?.content || "");
  };

  const handleSaveSection = async () => {
    if (!editSectionId) return;
    setSavingSection(true);
    try {
      await api.updateProposalSection(proposalId, editSectionId, editContent);
      setEditSectionId(null);
      setEditContent("");
      await refetchAll();
    } catch {
      setError("Failed to save section.");
    } finally {
      setSavingSection(false);
    }
  };

  const handleCancelEdit = () => {
    setEditSectionId(null);
    setEditContent("");
  };

  if (loading) return <LoadingState message="Loading proposal..." />;

  if (notFound) {
    return (
      <Card className="mx-auto max-w-2xl">
        <EmptyState
          title="Proposal not found"
          description="This proposal may have been removed or does not exist."
          action={<Link href="/proposals" className="inline-flex items-center justify-center rounded bg-primary px-5 py-2.5 text-sm font-medium text-white">Back to proposals</Link>}
        />
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted">
              {proposal?.researchField || proposal?.field || "Research"}
            </span>
            <ProposalStatusBadge status={proposal?.status} showWorkflow />
          </div>
          <h1 className="mt-2 text-xl font-semibold leading-tight text-ink md:text-2xl">
            {proposal?.title || "Untitled Proposal"}
          </h1>
          <p className="mt-1 text-sm text-body-muted">
            {proposal?.studentName} · Updated {formatDate(proposal?.updatedAt)}
            {proposal?.version && ` · v${proposal.version}`}
          </p>
        </div>
        <Link href="/proposals" className="flex-shrink-0 rounded border border-hairline px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-subdued">Back</Link>
      </div>

      {message && <Alert type="success" closable>{message}</Alert>}
      {error && <Alert type="error">{error}</Alert>}

      <div className="grid gap-6 lg:grid-cols-[210px_minmax(0,1fr)_340px]">
        {/* LEFT: nav */}
        <div className="hidden lg:block">
          <div className="sticky top-20 space-y-4">
            <ProposalSectionNav sections={sections} activeSection={activeSection} onSectionChange={setActiveSection} />
            <div className="rounded border border-hairline bg-canvas p-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted">Current Stage</p>
              <p className="mt-1 text-sm font-medium text-ink">{WORKFLOW_STAGES.find((s) => s.status === proposal?.status)?.label}</p>
            </div>
            {proposal?.missingItems?.length > 0 && (
              <div className="rounded border border-warning/20 bg-warning-bg p-3">
                <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-warning">Items to Address</p>
                <ul className="mt-1.5 space-y-1">
                  {proposal.missingItems.map((item, i) => (
                    <li key={i} className="flex items-center gap-1.5 text-xs text-warning/90"><span className="h-1 w-1 rounded-full bg-warning" />{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* CENTER: section content */}
        <div className="space-y-6 min-w-0">
          <div className="lg:hidden">
            <select value={activeSection || ""} onChange={(e) => setActiveSection(e.target.value)} className="w-full rounded border border-hairline bg-canvas px-3 py-2 text-sm text-ink">
              {sectionDefs.map((sd) => (<option key={sd.id} value={sd.id}>{sd.label}</option>))}
            </select>
          </div>

          <Card key={activeSection}>
            <CardContent className="p-5 sm:p-6">
              {editSectionId === activeSection ? (
                <SectionDisplay section={currentSection} sectionDef={currentSectionDef} isEditing editContent={editContent} onEditChange={setEditContent} onSave={handleSaveSection} onCancel={handleCancelEdit} saving={savingSection} />
              ) : (
                <>
                  <SectionDisplay section={currentSection} sectionDef={currentSectionDef} />
                  {canEdit && (
                    <div className="mt-4">
                      <Button variant="secondary" onClick={() => handleEditSection(activeSection)}>Edit Section</Button>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* RIGHT: panels */}
        <aside className="space-y-6">
          {aiError && <Alert type="error">{aiError}</Alert>}

          <Card>
            <CardHeader><CardTitle>Actions</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" loading={aiLoading} disabled={aiLoading} onClick={handleRunAIFeedback}>Run AI Pre-review</Button>
              {canSubmit && proposal?.status === PROPOSAL_STATUSES.DRAFT && (
                <Button className="w-full" variant="secondary" loading={aiLoading} disabled={aiLoading} onClick={handleSubmit}>Submit Proposal</Button>
              )}
              {canSubmit && proposal?.status === PROPOSAL_STATUSES.NEEDS_REVISION && (
                <Button className="w-full" variant="primary" loading={aiLoading} disabled={aiLoading} onClick={handleSubmit}>Resubmit Proposal</Button>
              )}
            </CardContent>
          </Card>

          <AIFeedbackPanel feedback={feedback} loading={aiLoading} isEmpty={!feedback} />

          {rubricReview ? <RubricScoreCard review={rubricReview} /> : (
            <Card><CardHeader><CardTitle>Rubric Review</CardTitle></CardHeader><CardContent><Alert type="info" title="Not yet reviewed">Rubric evaluation will appear after a reviewer assesses this proposal.</Alert></CardContent></Card>
          )}

          <Card>
            <CardHeader><CardTitle>Status History</CardTitle></CardHeader>
            <CardContent><StatusHistoryCard history={proposal?.statusHistory || proposal?.status_history || []} /></CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Revision History</CardTitle></CardHeader>
            <CardContent>{loadingAudit ? <LoadingState message="Loading history..." /> : <VersionHistory logs={auditLogs} />}</CardContent>
          </Card>

          <HumanDecisionNotice />
        </aside>
      </div>
    </div>
  );
}

export default function ProposalDetailPage() {
  return (
    <ProtectedRoute>
      <AppShell><ProposalDetailContent /></AppShell>
    </ProtectedRoute>
  );
}
