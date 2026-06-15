"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
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
import { WorkflowTimeline } from "@/components/ui/WorkflowTimeline";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import {
  USER_ROLES,
  WORKFLOW_STAGES,
  SECTION_TYPES,
} from "@/lib/constants";
import { mockMilestones } from "@/lib/mockData";

const formatDate = (value) => {
  if (!value) return "N/A";
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
};

const formatDateTime = (value) => {
  if (!value) return "";
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
};

function SectionDisplay({ section, sectionDef }) {
  if (!section || !section.content) {
    return (
      <div className="rounded border border-dashed border-hairline bg-subdued/30 p-4 text-center">
        <p className="text-sm text-muted">This section has not been written yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-ink">
            {sectionDef?.label || section.label}
          </h2>
          {sectionDef?.description && (
            <p className="mt-0.5 text-xs text-body-muted">
              {sectionDef.description}
            </p>
          )}
        </div>
        <SectionHealthBadge health={section.health} />
      </div>

      <div className="whitespace-pre-wrap rounded border border-hairline bg-canvas p-4 font-serif text-sm leading-7 text-ink">
        {section.content}
      </div>

      {/* AI comment */}
      {section.aiComment && (
        <div className="rounded border border-info/20 bg-info-bg/30 px-3 py-2">
          <p className="font-mono text-[9px] uppercase tracking-[0.06em] text-info">
            AI Pre-review Note
          </p>
          <p className="mt-0.5 text-xs text-body-muted">{section.aiComment}</p>
        </div>
      )}

      {/* Rubric hint */}
      {section.rubricHint && (
        <div className="rounded border border-warning/20 bg-warning-bg/30 px-3 py-2">
          <p className="font-mono text-[9px] uppercase tracking-[0.06em] text-warning">
            Reviewer Consideration
          </p>
          <p className="mt-0.5 text-xs text-body-muted">{section.rubricHint}</p>
        </div>
      )}
    </div>
  );
}

function ProposalDetailContent() {
  const params = useParams();
  const proposalId = params?.id;
  const { user } = useAuth();
  const [proposal, setProposal] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [rubricReview, setRubricReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");
  const [activeSection, setActiveSection] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loadingAudit, setLoadingAudit] = useState(false);

  useEffect(() => {
    let mounted = true;
    const loadDetail = async () => {
      setLoading(true);
      setNotFound(false);
      setError("");
      try {
        const proposalData = await api.getProposalById(proposalId);
        const [feedbackResult, reviewResult] = await Promise.allSettled([
          api.getAIFeedback(proposalId),
          api.getRubricReview(proposalId),
        ]);
        if (!mounted) return;
        const feedbackData = feedbackResult.status === "fulfilled" ? feedbackResult.value : null;
        const reviewData = reviewResult.status === "fulfilled" ? reviewResult.value : null;
        setProposal(proposalData);
        setFeedback(feedbackData?.proposalId === proposalId ? feedbackData : null);
        setRubricReview(reviewData || null);
        // Set initial section
        const initialSections = proposalData?.sections || [];
        if (initialSections.length > 0) {
          setActiveSection(initialSections[0]?.id || SECTION_TYPES[0]?.id);
        } else {
          setActiveSection(SECTION_TYPES[0]?.id);
        }
        if (feedbackResult.status === "rejected" || reviewResult.status === "rejected") {
          setError("Some assessment data could not be loaded.");
        }
      } catch {
        if (!mounted) return;
        setNotFound(true);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    const loadAudit = async () => {
      if (!proposalId) return;
      setLoadingAudit(true);
      try {
        const logs = await api.getAuditLogs();
        const filtered = logs.filter((log) => log.details?.includes(proposalId));
        setAuditLogs(filtered || []);
      } catch {
        // silent
      } finally {
        setLoadingAudit(false);
      }
    };

    if (proposalId) {
      loadDetail();
      loadAudit();
    }

    return () => {
      mounted = false;
    };
  }, [proposalId]);

  const milestones = useMemo(
    () => mockMilestones.filter((m) => m.proposalId === proposalId),
    [proposalId],
  );

  const sections = useMemo(() => proposal?.sections || [], [proposal]);
  const sectionDefs = SECTION_TYPES;



  const currentSection = useMemo(
    () => sections.find((s) => s.id === activeSection),
    [sections, activeSection],
  );
  const currentSectionDef = useMemo(
    () => sectionDefs.find((s) => s.id === activeSection),
    [sectionDefs, activeSection],
  );

  const handleRunAIFeedback = async () => {
    setAiLoading(true);
    setAiError("");
    try {
      const nextFeedback = await api.runAIFeedback(proposalId);
      setFeedback(nextFeedback);
    } catch {
      setAiError("Unable to run AI pre-review. Please try again.");
    } finally {
      setAiLoading(false);
    }
  };

  if (loading) {
    return <LoadingState message="Loading proposal..." variant="default" />;
  }

  if (notFound) {
    return (
      <Card className="mx-auto max-w-2xl">
        <EmptyState
          title="Proposal not found"
          description="This proposal may have been removed or does not exist."
          action={
            <Link
              href="/proposals"
              className="inline-flex items-center justify-center rounded bg-primary px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2"
            >
              Back to proposals
            </Link>
          }
        />
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3">
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

        <Link
          href="/proposals"
          className="flex-shrink-0 rounded border border-hairline px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-subdued focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          Back
        </Link>
      </div>

      {error && <Alert type="error">{error}</Alert>}

      {/* Three-zone workspace */}
      <div className="grid gap-6 lg:grid-cols-[210px_minmax(0,1fr)_340px]">
        {/* LEFT: Section Navigation */}
        <div className="hidden lg:block">
          <div className="sticky top-20 space-y-4">
            <ProposalSectionNav
              sections={sections}
              activeSection={activeSection}
              onSectionChange={setActiveSection}
            />

            {/* Stage indicator */}
            <div className="rounded border border-hairline bg-canvas p-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted">
                Current Stage
              </p>
              <p className="mt-1 text-sm font-medium text-ink">
                {
                  WORKFLOW_STAGES.find((s) => s.status === proposal?.status)
                    ?.label
                }
              </p>
            </div>

            {/* Missing items summary */}
            {proposal?.missingItems?.length > 0 && (
              <div className="rounded border border-warning/20 bg-warning-bg p-3">
                <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-warning">
                  Items to Address
                </p>
                <ul className="mt-1.5 space-y-1">
                  {proposal.missingItems.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-1.5 text-xs text-warning/90"
                    >
                      <span className="h-1 w-1 rounded-full bg-warning" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* CENTER: Main content */}
        <div className="space-y-6 min-w-0">
          {/* Mobile section selector */}
          <div className="lg:hidden">
            <select
              value={activeSection || ""}
              onChange={(e) => setActiveSection(e.target.value)}
              className="w-full rounded border border-hairline bg-canvas px-3 py-2 text-sm text-ink"
            >
              {sectionDefs.map((sd) => (
                <option key={sd.id} value={sd.id}>
                  {sd.label}
                </option>
              ))}
            </select>
          </div>

          {/* Section content */}
          <Card key={activeSection}>
            <CardContent className="p-5 sm:p-6">
              <SectionDisplay
                section={currentSection}
                sectionDef={currentSectionDef}
              />
            </CardContent>
          </Card>

          {/* Milestones (if available) */}
          {milestones.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Milestones</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {milestones.map((ms) => (
                  <div
                    key={ms.id}
                    className="flex items-center justify-between gap-3 rounded border border-hairline p-3"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-ink">{ms.name}</p>
                      <p className="text-xs text-body-muted">
                        Due: {formatDate(ms.dueDate)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-subdued">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${ms.progress || 0}%` }}
                        />
                      </div>
                      <span className="font-mono text-xs text-body-muted">
                        {ms.progress || 0}%
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* RIGHT: AI Feedback + Rubric + Actions */}
        <aside className="space-y-6">
          {/* AI error */}
          {aiError && <Alert type="error">{aiError}</Alert>}

          {/* Run AI pre-review */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                className="w-full"
                loading={aiLoading}
                disabled={aiLoading}
                onClick={handleRunAIFeedback}
              >
                Run AI Pre-review
              </Button>
              <Link
                href={`/proposals/${proposalId}`}
                className="flex w-full items-center justify-center rounded border border-hairline px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-subdued"
              >
                Edit Proposal
              </Link>
            </CardContent>
          </Card>

          {/* AI Feedback */}
          <AIFeedbackPanel
            feedback={feedback}
            loading={aiLoading}
            isEmpty={!feedback}
          />

          {/* Rubric */}
          {rubricReview ? (
            <RubricScoreCard review={rubricReview} />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Rubric Review</CardTitle>
              </CardHeader>
              <CardContent>
                <Alert type="info" title="Not yet reviewed">
                  Rubric evaluation will appear after a reviewer assesses this
                  proposal.
                </Alert>
              </CardContent>
            </Card>
          )}

          {/* Version History */}
          <Card>
            <CardHeader>
              <CardTitle>Revision History</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingAudit ? (
                <LoadingState message="Loading history..." />
              ) : (
                <VersionHistory logs={auditLogs} />
              )}
            </CardContent>
          </Card>

          {/* Human-in-the-loop */}
          <HumanDecisionNotice />
        </aside>
      </div>
    </div>
  );
}

export default function ProposalDetailPage() {
  return (
    <ProtectedRoute>
      <AppShell>
        <ProposalDetailContent />
      </AppShell>
    </ProtectedRoute>
  );
}
