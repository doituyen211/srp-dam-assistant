"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { AIFeedbackPanel, RubricScoreCard } from "@/components/ai";
import { AppShell } from "@/components/layout/AppShell";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { ProposalStatusBadge } from "@/components/proposal/ProposalStatusBadge";
import { ProposalTabs } from "@/components/proposal/ProposalTabs";
import { ProposalSectionNav } from "@/components/proposal/ProposalSectionNav";
import { SectionHealthBadge } from "@/components/proposal/SectionHealthBadge";
import { SupervisorMatchingPanel } from "@/components/proposal/SupervisorMatchingPanel";
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
  PROPOSAL_STATUSES.NEEDS_REVISION,
];

const formatDate = (value) => {
  if (!value) return "N/A";
  return new Date(value).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
};

// ─── Overview Tab ───

function OverviewTab({ proposal }) {
  if (!proposal) return null;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
      {/* Main content */}
      <div className="space-y-6">
        <Card>
          <CardContent className="p-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <InfoField label="Status">
                <ProposalStatusBadge status={proposal.status} />
              </InfoField>
              <InfoField label="Version">v{proposal.version || 1}</InfoField>
              <InfoField label="Research Field">{proposal.researchField || proposal.field || "—"}</InfoField>
              <InfoField label="Last Updated">{formatDate(proposal.updatedAt)}</InfoField>
              <InfoField label="Student">{proposal.studentName || "—"}</InfoField>
              <InfoField label="Created">{formatDate(proposal.createdAt)}</InfoField>
            </div>
            {proposal.abstract && (
              <div className="mt-4">
                <InfoField label="Abstract">
                  <p className="text-sm leading-6 text-ink whitespace-pre-wrap">{proposal.abstract}</p>
                </InfoField>
              </div>
            )}
            {proposal.keywords?.length > 0 && (
              <div className="mt-4">
                <InfoField label="Keywords">
                  <div className="flex flex-wrap gap-1.5">
                    {proposal.keywords.map((kw) => (
                      <span key={kw} className="rounded-full border border-hairline bg-subdued px-2.5 py-0.5 text-xs text-body-muted">{kw}</span>
                    ))}
                  </div>
                </InfoField>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        <Card>
          <CardHeader><CardTitle>Workflow</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-body-muted">Current Stage:</span>
              <span className="text-sm font-medium text-ink">
                {WORKFLOW_STAGES.find((s) => s.status === proposal.status)?.label}
              </span>
            </div>
            {proposal.deadline && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-body-muted">Deadline:</span>
                <span className="text-sm font-medium text-ink">{formatDate(proposal.deadline)}</span>
              </div>
            )}
            {proposal.assignedReviewer && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-body-muted">Reviewer:</span>
                <span className="text-sm font-medium text-ink">{proposal.assignedReviewer}</span>
              </div>
            )}
            {(proposal.assignedLecturer || proposal.assignedLecturerId) && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-body-muted">Supervisor:</span>
                <span className="text-sm font-medium text-ink">{proposal.assignedLecturerName || proposal.assignedLecturer}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {proposal.missingItems?.length > 0 && (
          <Card>
            <CardHeader><CardTitle>Missing Items</CardTitle></CardHeader>
            <CardContent>
              <ul className="space-y-1.5">
                {proposal.missingItems.map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs text-warning">
                    <span className="h-1.5 w-1.5 rounded-full bg-warning" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function InfoField({ label, children }) {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.06em] text-muted mb-1">{label}</p>
      {children}
    </div>
  );
}

// ─── Sections Tab ───

function SectionsTab({ sections, sectionDefs, activeSection, setActiveSection, editSectionId, editContent, setEditContent, currentSection, currentSectionDef, canEdit, handleEditSection, handleSaveSection, handleCancelEdit, savingSection }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[210px_minmax(0,1fr)]">
      {/* Left: section nav */}
      <div className="hidden lg:block">
        <div className="sticky top-20">
          <ProposalSectionNav
            sections={sections}
            activeSection={activeSection}
            onSectionChange={setActiveSection}
            excludeIds={["title", "abstract"]}
          />
        </div>
      </div>

      {/* Right: section content */}
      <div className="space-y-6 min-w-0">
        <div className="lg:hidden">
          <select value={activeSection || ""} onChange={(e) => setActiveSection(e.target.value)} className="w-full rounded-lg border border-hairline bg-canvas px-3 py-2 text-sm text-ink">
            {sectionDefs.filter((s) => s.id !== "title" && s.id !== "abstract").map((sd) => (
              <option key={sd.id} value={sd.id}>{sd.label}</option>
            ))}
          </select>
        </div>

        <Card key={activeSection}>
          <CardContent className="p-5 sm:p-6">
            {editSectionId === activeSection ? (
              <EditSection
                section={currentSection}
                sectionDef={currentSectionDef}
                content={editContent}
                onChange={setEditContent}
                onSave={handleSaveSection}
                onCancel={handleCancelEdit}
                saving={savingSection}
              />
            ) : (
              <>
                <DisplaySection section={currentSection} sectionDef={currentSectionDef} />
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
    </div>
  );
}

function DisplaySection({ section, sectionDef }) {
  if (!section) {
    return (
      <div className="rounded-lg border border-dashed border-hairline bg-subdued/30 p-6 text-center">
        <p className="text-sm text-muted">This section has not been written yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-ink">{sectionDef?.label || section?.label}</h2>
        <SectionHealthBadge health={section?.health || "missing"} />
      </div>
      <div className="whitespace-pre-wrap rounded-lg border border-hairline bg-canvas p-4 font-serif text-sm leading-7 text-ink">
        {section?.content || ""}
      </div>
      {section?.aiComment && (
        <div className="rounded-lg border border-info/20 bg-info/5 px-3 py-2">
          <p className="font-mono text-[9px] uppercase tracking-[0.06em] text-info">AI Comment</p>
          <p className="mt-0.5 text-xs text-body-muted">{section.aiComment}</p>
        </div>
      )}
      {section?.rubricHint && (
        <div className="rounded-lg border border-warning/20 bg-warning/5 px-3 py-2">
          <p className="font-mono text-[9px] uppercase tracking-[0.06em] text-warning">Rubric Hint</p>
          <p className="mt-0.5 text-xs text-body-muted">{section.rubricHint}</p>
        </div>
      )}
    </div>
  );
}

function EditSection({ section, sectionDef, content, onChange, onSave, onCancel, saving }) {
  return (
    <div className="space-y-3">
      <h2 className="text-base font-semibold text-ink">{sectionDef?.label}: Edit</h2>
      <textarea
        value={content}
        onChange={(e) => onChange(e.target.value)}
        rows={10}
        className="w-full resize-y rounded-lg border border-hairline bg-canvas px-4 py-3 text-base text-ink outline-none transition-all focus:border-primary/40 focus:ring-4 focus:ring-primary/10"
      />
      <div className="flex gap-2">
        <Button variant="primary" loading={saving} disabled={saving} onClick={onSave}>Save</Button>
        <Button variant="ghost" onClick={onCancel} disabled={saving}>Cancel</Button>
      </div>
    </div>
  );
}

// ─── AI Evaluation Tab ───

function AIEvaluationTab({ feedback, loading }) {
  if (loading) return <LoadingState message="Loading AI evaluation..." />;

  if (!feedback) {
    return (
      <Card>
        <CardContent className="py-8">
          <EmptyState
            title="No AI evaluation yet"
            description="Run AI evaluation to get scores and recommendations for this proposal."
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <AIFeedbackPanel feedback={feedback} loading={false} isEmpty={!feedback} />
    </div>
  );
}

// ─── History Tab ───

function HistoryTab({ proposal, auditLogs, user }) {
  const history = proposal?.statusHistory || proposal?.status_history || [];

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
      {/* Status History */}
      <Card>
        <CardHeader><CardTitle>Status History</CardTitle></CardHeader>
        <CardContent>
          {history.length === 0 ? (
            <p className="text-sm text-muted">No status changes yet.</p>
          ) : (
            <div className="space-y-2">
              {history.map((entry, i) => (
                <div key={entry.id || i} className="rounded-lg border border-hairline bg-canvas p-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <ProposalStatusBadge status={entry.to_status || entry.status} />
                    <span className="font-mono text-[10px] text-muted">{formatDate(entry.created_at || entry.timestamp)}</span>
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
          )}
        </CardContent>
      </Card>

      {/* AI Review History */}
      <Card>
        <CardHeader><CardTitle>AI Review History</CardTitle></CardHeader>
        <CardContent>
          {proposal?.latestAiReview || proposal?.latest_ai_review ? (
            <div className="rounded-lg border border-hairline bg-canvas p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-ink">Latest AI Review</span>
                <span className="font-mono text-xs text-muted">{formatDate(proposal.latestAiReview?.timestamp || proposal.latest_ai_review?.timestamp)}</span>
              </div>
              <p className="mt-1 text-xs text-body-muted">
                Score: {proposal.latestAiReview?.score || proposal.latest_ai_review?.score || "—"}
              </p>
            </div>
          ) : (
            <p className="text-sm text-muted">No AI reviews yet.</p>
          )}
        </CardContent>
      </Card>

      {/* Version History (admin only) */}
      {user?.role === "admin" && auditLogs.length > 0 && (
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Revision History</CardTitle></CardHeader>
          <CardContent>
            <VersionHistory logs={auditLogs} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// ─── Main Component ───

function ProposalDetailContent() {
  const params = useParams();
  const router = useRouter();
  const proposalId = params?.id;
  const { user } = useAuth();

  const [proposal, setProposal] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [activeSection, setActiveSection] = useState(null);
  const [editSectionId, setEditSectionId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [savingSection, setSavingSection] = useState(false);

  const isOwner = proposal?.studentId === user?.id || proposal?.student_id === user?.id;
  const isEditableStatus = EDITABLE_STATUSES.includes(proposal?.status);
  const canEdit = isEditableStatus && (isOwner || user?.role === USER_ROLES.ADMIN);
  const canSubmit = isOwner && (proposal?.status === PROPOSAL_STATUSES.DRAFT || proposal?.status === PROPOSAL_STATUSES.NEEDS_REVISION);
  const isAdmin = user?.role === USER_ROLES.ADMIN || user?.role === USER_ROLES.SUPER_ADMIN;

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setNotFound(false);
      setError("");
      try {
        const proposalData = await api.getProposalById(proposalId);
        if (!mounted) return;
        setProposal(proposalData);

        // AI feedback
        api.getAIFeedback(proposalId).then((fb) => { if (mounted) setFeedback(fb); }).catch(() => {});

        // Audit logs (admin only)
        if (isAdmin) {
          api.getAuditLogs().then((logs) => {
            if (mounted) setAuditLogs((logs || []).filter((l) => l.details?.includes(proposalId) || l.entityId === proposalId));
          }).catch(() => {});
        }

        const sects = proposalData?.sections || [];
        if (sects.length > 0) setActiveSection(sects[0]?.id || SECTION_TYPES[0]?.id);
        else setActiveSection(SECTION_TYPES[0]?.id);
      } catch {
        if (mounted) setNotFound(true);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    if (proposalId) load();
    return () => { mounted = false; };
  }, [proposalId, isAdmin]);

  const sections = useMemo(() => proposal?.sections || [], [proposal]);
  const sectionDefs = SECTION_TYPES;
  const currentSection = useMemo(() => sections.find((s) => s.id === activeSection), [sections, activeSection]);
  const currentSectionDef = useMemo(() => sectionDefs.find((s) => s.id === activeSection), [sectionDefs, activeSection]);

  const handleSubmit = async () => {
    setSubmitLoading(true);
    setMessage("");
    setError("");
    try {
      const updated = await api.submitProposal(proposalId);
      setProposal(updated);
      setMessage("Proposal submitted for review.");
    } catch {
      setError("Unable to submit proposal. Please try again.");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Confirm deleting this proposal? This action cannot be undone.")) return;
    try {
      await api.deleteProposal(proposalId);
      router.push("/proposals");
    } catch (err) {
      setError(err.message || "Unable to delete proposal.");
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
      const updated = await api.getProposalById(proposalId);
      setProposal(updated);
      setMessage("Section saved.");
    } catch {
      setError("Unable to save section.");
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
          description="This proposal may have been deleted or does not exist."
          action={<Link href="/proposals" className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white">Back to list</Link>}
        />
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
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
        <Link href="/proposals" className="flex-shrink-0 rounded-lg border border-hairline px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-subdued">Back</Link>
      </div>

      {message && <Alert type="success" closable>{message}</Alert>}
      {error && <Alert type="error">{error}</Alert>}

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3">
        {canSubmit && (
          <Button loading={submitLoading} disabled={submitLoading} onClick={handleSubmit}>
            {proposal?.status === PROPOSAL_STATUSES.DRAFT ? "Submit Proposal" : "Resubmit Proposal"}
          </Button>
        )}
        {proposal?.status === "draft" && (isOwner || isAdmin) && (
          <Button variant="danger" onClick={handleDelete}>Delete Proposal</Button>
        )}
      </div>

      {/* Tabs */}
      <ProposalTabs activeTab={activeTab} onTabChange={setActiveTab}>
        {activeTab === "overview" && (
          <OverviewTab proposal={proposal} />
        )}

        {activeTab === "sections" && (
          <SectionsTab
            sections={sections}
            sectionDefs={sectionDefs}
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            editSectionId={editSectionId}
            editContent={editContent}
            setEditContent={setEditContent}
            currentSection={currentSection}
            currentSectionDef={currentSectionDef}
            canEdit={canEdit}
            handleEditSection={handleEditSection}
            handleSaveSection={handleSaveSection}
            handleCancelEdit={handleCancelEdit}
            savingSection={savingSection}
          />
        )}

        {activeTab === "ai_evaluation" && (
          <AIEvaluationTab feedback={feedback} loading={false} />
        )}

        {activeTab === "supervisor_matching" && (
          <SupervisorMatchingPanel
            proposalId={proposalId}
            proposal={proposal}
            isAdmin={isAdmin}
          />
        )}

        {activeTab === "history" && (
          <HistoryTab proposal={proposal} auditLogs={auditLogs} user={user} />
        )}
      </ProposalTabs>
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
