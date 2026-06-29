"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { ProposalStatusBadge } from "@/components/proposal/ProposalStatusBadge";
import { ProposalSectionNav } from "@/components/proposal/ProposalSectionNav";
import { ProposalTabs } from "@/components/proposal/ProposalTabs";
import { ProposalReadiness } from "@/components/proposal/ProposalReadiness";
import { SectionHealthBadge } from "@/components/proposal/SectionHealthBadge";
import { VersionHistory } from "@/components/proposal/VersionHistory";
import { AIInsightsPanel } from "@/components/ai";
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
  return new Intl.DateTimeFormat("en-US", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(value));
};

function StatusHistoryCard({ history = [] }) {
  if (!history.length) {
    return <div className="text-xs text-muted">No status changes yet.</div>;
  }
  return (
    <div className="space-y-2">
      {history.map((entry, i) => (
        <div key={entry.id || i} className="rounded border border-hairline bg-canvas p-2.5">
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
        <h2 className="text-base font-semibold text-ink">{sectionDef?.label}: Edit</h2>
        <textarea
          value={editContent}
          onChange={(e) => onEditChange(e.target.value)}
          rows={10}
          className="w-full resize-y rounded border border-hairline bg-canvas px-4 py-3 text-base text-ink outline-none transition-all focus:border-primary/40 focus:ring-4 focus:ring-primary/10"
        />
        <div className="flex gap-2">
          <Button variant="primary" loading={saving} disabled={saving} onClick={onSave}>Save</Button>
          <Button variant="ghost" onClick={onCancel} disabled={saving}>Cancel</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-ink">{sectionDef?.label || section?.label}</h2>
        <SectionHealthBadge health={section?.health || "missing"} />
      </div>
      <div className="whitespace-pre-wrap rounded border border-hairline bg-canvas p-4 font-serif text-sm leading-7 text-ink">
        {section?.content || ""}
      </div>
    </div>
  );
}

// ─── Tab Content Components ───

function OverviewTab({ proposal, milestones, auditLogs, user, onSubmit, submitLoading, onDelete }) {
  const history = proposal?.statusHistory || proposal?.status_history || [];
  const isOwner = proposal?.studentId === user?.id || proposal?.student_id === user?.id;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
      {/* Main content */}
      <div className="space-y-6">
        {/* Summary card */}
        <Card>
          <CardContent className="p-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.06em] text-muted">Title</p>
                <p className="mt-0.5 text-sm font-medium text-ink">{proposal?.title}</p>
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.06em] text-muted">Status</p>
                <div className="mt-0.5"><ProposalStatusBadge status={proposal?.status} /></div>
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.06em] text-muted">Field</p>
                <p className="mt-0.5 text-sm text-ink">{proposal?.researchField || proposal?.field}</p>
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.06em] text-muted">Version</p>
                <p className="mt-0.5 text-sm text-ink">v{proposal?.version || 1}</p>
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.06em] text-muted">Student</p>
                <p className="mt-0.5 text-sm text-ink">{proposal?.studentName}</p>
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.06em] text-muted">Updated</p>
                <p className="mt-0.5 text-sm text-ink">{formatDate(proposal?.updatedAt)}</p>
              </div>
            </div>
            {proposal?.keywords?.length > 0 && (
              <div className="mt-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.06em] text-muted">Keywords</p>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {proposal.keywords.map((kw) => (
                    <span key={kw} className="rounded border border-hairline bg-subdued px-2 py-0.5 text-xs text-body-muted">{kw}</span>
                  ))}
                </div>
              </div>
            )}
            {proposal?.abstract && (
              <div className="mt-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.06em] text-muted">Abstract</p>
                <p className="mt-1 text-sm leading-6 text-ink whitespace-pre-wrap">{proposal.abstract}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Status history */}
        <Card>
          <CardHeader><CardTitle>Status History</CardTitle></CardHeader>
          <CardContent><StatusHistoryCard history={history} /></CardContent>
        </Card>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        <ProposalReadiness proposal={proposal} onSubmit={onSubmit} loading={submitLoading} />

        {milestones.length > 0 && (
          <Card>
            <CardHeader><CardTitle>Milestone</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {milestones.slice(0, 5).map((ms) => (
                <div key={ms.id} className="flex items-center justify-between gap-3 rounded border border-hairline p-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-ink">{ms.title || ms.name}</p>
                    {ms.dueDate && <p className="text-xs text-body-muted">Deadline: {new Date(ms.dueDate).toLocaleDateString("en-US")}</p>}
                  </div>
                  <span className={`rounded px-2 py-0.5 text-xs font-medium ${ms.status === "completed" ? "bg-success-bg text-success" : ms.status === "in_progress" ? "bg-info-bg text-info" : ms.status === "overdue" ? "bg-danger-bg text-danger" : "bg-subdued text-muted"}`}>
                    {ms.status === "completed" ? "Done" : ms.status === "in_progress" ? "In progress" : ms.status === "overdue" ? "Overdue" : ms.status || "Pending"}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {user?.role === "admin" && auditLogs.length > 0 && (
          <Card>
            <CardHeader><CardTitle>Revision History</CardTitle></CardHeader>
            <CardContent><VersionHistory logs={auditLogs} /></CardContent>
          </Card>
        )}

        {onDelete && proposal?.status === "draft" && (isOwner || user?.role === "admin" || user?.role === "super_admin") && (
          <Card>
            <CardHeader><CardTitle>Actions</CardTitle></CardHeader>
            <CardContent>
              <Button variant="danger" className="w-full" onClick={onDelete}>Delete proposal</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function EditorTab({ sections, sectionDefs, activeSection, setActiveSection, editSectionId, editContent, setEditContent, currentSection, currentSectionDef, canEdit, handleEditSection, handleSaveSection, handleCancelEdit, savingSection, proposal }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[210px_minmax(0,1fr)]">
      {/* Left: section nav */}
      <div className="hidden lg:block">
        <div className="sticky top-20 space-y-4">
          <ProposalSectionNav sections={sections} activeSection={activeSection} onSectionChange={setActiveSection} excludeIds={["title", "abstract"]} />
          <div className="rounded border border-hairline bg-canvas p-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted">Current stage</p>
            <p className="mt-1 text-sm font-medium text-ink">{WORKFLOW_STAGES.find((s) => s.status === proposal?.status)?.label}</p>
          </div>
          {proposal?.missingItems?.length > 0 && (
            <div className="rounded border border-warning/20 bg-warning-bg p-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-warning">Items needing attention</p>
              <ul className="mt-1.5 space-y-1">
                {proposal.missingItems.map((item, i) => (
                  <li key={i} className="flex items-center gap-1.5 text-xs text-warning/90"><span className="h-1 w-1 rounded-full bg-warning" />{item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Right: section content */}
      <div className="space-y-6 min-w-0">
        <div className="lg:hidden">
          <select value={activeSection || ""} onChange={(e) => setActiveSection(e.target.value)} className="w-full rounded border border-hairline bg-canvas px-3 py-2 text-sm text-ink">
            {sectionDefs.filter((s) => s.id !== "title" && s.id !== "abstract").map((sd) => (<option key={sd.id} value={sd.id}>{sd.label}</option>))}
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
                    <Button variant="secondary" onClick={() => handleEditSection(activeSection)}>Edit section</Button>
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

function AIInsightsTab({ proposalId, proposal }) {
  return <AIInsightsPanel proposalId={proposalId} proposal={proposal} />;
}

function HistoryTab({ proposal, auditLogs, user }) {
  const history = proposal?.statusHistory || proposal?.status_history || [];
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle>Status History</CardTitle></CardHeader>
        <CardContent><StatusHistoryCard history={history} /></CardContent>
      </Card>

      {user?.role === "admin" && (
        <Card>
          <CardHeader><CardTitle>Revision History</CardTitle></CardHeader>
          <CardContent>
            {auditLogs.length === 0 ? (
              <p className="text-sm text-muted">No revision history yet.</p>
            ) : (
              <VersionHistory logs={auditLogs} />
            )}
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
  const [milestones, setMilestones] = useState([]);
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

        api.getProposalMilestones(proposalId).then((ms) => { if (mounted) setMilestones(ms); }).catch(() => {});

        if (user?.role === "admin") {
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
  }, [proposalId, user?.role]);

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
      setMessage("Proposal has been submitted for review.");
    } catch {
      setError("Unable to submit proposal. Please try again.");
    } finally {
      setSubmitLoading(false);
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

  const handleDelete = async () => {
    if (!confirm("Confirm deleting this proposal? This action cannot be undone.")) return;
    try {
      await api.deleteProposal(proposalId);
      router.push("/proposals");
    } catch (err) {
      setError(err.message || "Unable to delete proposal.");
    }
  };

  if (loading) return <LoadingState message="Loading proposal..." />;

  if (notFound) {
    return (
      <Card className="mx-auto max-w-2xl">
        <EmptyState
          title="Proposal not found"
          description="This proposal may have been deleted or does not exist."
          action={<Link href="/proposals" className="inline-flex items-center justify-center rounded bg-primary px-5 py-2.5 text-sm font-medium text-white">Back to list</Link>}
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
          <h1 className="mt-2 text-xl font-semibold leading-tight text-ink md:text-2xl">{proposal?.title || "Untitled proposal"}</h1>
          <p className="mt-1 text-sm text-body-muted">
            {proposal?.studentName} · Updated {formatDate(proposal?.updatedAt)}
            {proposal?.version && ` · v${proposal.version}`}
          </p>
        </div>
        <Link href="/proposals" className="flex-shrink-0 rounded border border-hairline px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-subdued">Back</Link>
      </div>

      {message && <Alert type="success" closable>{message}</Alert>}
      {error && <Alert type="error">{error}</Alert>}

      {/* Tabs */}
      <ProposalTabs activeTab={activeTab} onTabChange={setActiveTab}>
        {activeTab === "overview" && (
          <OverviewTab
            proposal={proposal}
            milestones={milestones}
            auditLogs={auditLogs}
            user={user}
            onSubmit={handleSubmit}
            submitLoading={submitLoading}
            onDelete={handleDelete}
          />
        )}

        {activeTab === "editor" && (
          <EditorTab
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
            proposal={proposal}
          />
        )}

        {activeTab === "ai_insights" && (
          <AIInsightsTab proposalId={proposalId} proposal={proposal} />
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
