"use client";

import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { AIFeedbackPanel, RubricScoreCard } from "@/components/ai";
import { ReviewTable } from "@/components/review/ReviewTable";
import { ReviewQueueFilters } from "@/components/review/ReviewQueueFilters";
import { ProposalSummaryPanel } from "@/components/review/ProposalSummaryPanel";
import { ReviewDecisionPanel } from "@/components/review/ReviewDecisionPanel";
import { Alert } from "@/components/ui/Alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingState } from "@/components/ui/LoadingState";
import { HumanInLoopBanner } from "@/components/ui/HumanInLoopBanner";
import { api } from "@/lib/api";
import { PROPOSAL_STATUSES, USER_ROLES } from "@/lib/constants";

const formatDate = (value) => {
  if (!value) return "N/A";
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
};

function ReviewPageContent() {
  const [allProposals, setAllProposals] = useState([]);
  const [reviewsByProposal, setReviewsByProposal] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [fieldFilter, setFieldFilter] = useState("all");
  const [urgencyFilter, setUrgencyFilter] = useState("all");
  const [riskFilter, setRiskFilter] = useState("all");

  // Selected proposal for inline detail
  const [selectedId, setSelectedId] = useState(null);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [selectedReview, setSelectedReview] = useState(null);


  // Decision
  const [decisionLoading, setDecisionLoading] = useState(false);
  const [actionPending, setActionPending] = useState("");

  // Load proposals
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await api.getProposals();
        if (!mounted) return;
        const list = Array.isArray(data) ? data : [];
        setAllProposals(list);

        const reviewResults = await Promise.allSettled(
          list.map((p) => api.getRubricReview(p.id)),
        );
        const nextReviews = {};
        reviewResults.forEach((r, i) => {
          if (r.status === "fulfilled" && r.value) {
            nextReviews[list[i].id] = r.value;
          }
        });
        setReviewsByProposal(nextReviews);
        if (reviewResults.some((r) => r.status === "rejected")) {
          setError("Some rubric data could not be loaded.");
        }
      } catch {
        if (!mounted) return;
        setError("Unable to load review data.");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  // Load detail when a proposal is selected
  useEffect(() => {
    if (!selectedId) return;
    let mounted = true;
    const load = async () => {
      try {
        const [fbResult, rvResult] = await Promise.allSettled([
          api.getAIFeedback(selectedId),
          api.getRubricReview(selectedId),
        ]);
        if (!mounted) return;
        setSelectedFeedback(fbResult.status === "fulfilled" ? fbResult.value : null);
        setSelectedReview(rvResult.status === "fulfilled" ? rvResult.value : null);
      } catch {
        if (!mounted) return;
        setSelectedFeedback(null);
        setSelectedReview(null);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [selectedId]);

  // Filtered review queue
  const reviewQueue = useMemo(() => {
    const reviewable = [
      PROPOSAL_STATUSES.SUBMITTED,
      PROPOSAL_STATUSES.UNDER_REVIEW,
      PROPOSAL_STATUSES.NEEDS_REVISION,
      PROPOSAL_STATUSES.APPROVED,
    ];
    const keyword = search.trim().toLowerCase();
    return allProposals
      .filter((p) => reviewable.includes(p.status))
      .filter((p) => {
        if (statusFilter !== "all" && p.status !== statusFilter) return false;
        if (fieldFilter !== "all" && (p.researchField || p.field) !== fieldFilter) return false;
        if (urgencyFilter === "urgent" && p.deadline) {
          const days = (new Date(p.deadline) - new Date()) / (1000 * 60 * 60 * 24);
          if (days > 7) return false;
        }
        if (urgencyFilter === "soon" && p.deadline) {
          const days = (new Date(p.deadline) - new Date()) / (1000 * 60 * 60 * 24);
          if (days < 7 || days > 30) return false;
        }
        if (urgencyFilter === "normal" && p.deadline) {
          const days = (new Date(p.deadline) - new Date()) / (1000 * 60 * 60 * 24);
          if (days <= 30) return false;
        }
        if (riskFilter !== "all") {
          const flags = p.riskFlags || [];
          const score = p.readinessScore || p.aiScore || 10;
          const risk = flags.length > 1 || score < 5 ? "high" : flags.length === 1 || score < 7 ? "medium" : "low";
          if (risk !== riskFilter) return false;
        }
        if (keyword) {
          const haystack = [p.title, p.studentName, p.researchField, p.field, ...(p.keywords || [])]
            .filter(Boolean).join(" ").toLowerCase();
          if (!haystack.includes(keyword)) return false;
        }
        return true;
      })
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  }, [allProposals, search, statusFilter, fieldFilter, urgencyFilter, riskFilter]);

  // KPI calculations
  const kpi = useMemo(() => {
    const pending = reviewQueue.filter(
      (p) => p.status === PROPOSAL_STATUSES.SUBMITTED || p.status === PROPOSAL_STATUSES.UNDER_REVIEW,
    ).length;
    const revisions = reviewQueue.filter(
      (p) => p.status === PROPOSAL_STATUSES.NEEDS_REVISION,
    ).length;
    const approved = reviewQueue.filter(
      (p) => p.status === PROPOSAL_STATUSES.APPROVED,
    ).length;
    const totalAssigned = allProposals.length;
    const avgWait =
      totalAssigned > 0
        ? Math.round(
            allProposals.reduce((sum, p) => {
              const date = p.submittedAt || p.createdAt;
              return date ? sum + (new Date() - new Date(date)) / (1000 * 60 * 60 * 24) : sum;
            }, 0) / allProposals.length,
          )
        : 0;
    return { pending, revisions, approved, totalAssigned, avgWait };
  }, [reviewQueue, allProposals]);

  // Update proposal status
  const handleStatusUpdate = async (proposalId, nextStatus, actionType) => {
    setActionPending(`${proposalId}:${actionType}`);
    setError("");
    setMessage("");
    try {
      const updated = await api.updateProposal(proposalId, {
        status: nextStatus,
      });
      setAllProposals((prev) =>
        prev.map((p) => (p.id === proposalId ? updated : p)),
      );
      const labels = {
        approved: "Approval recorded.",
        needs_revision: "Marked as needs revision.",
        rejected: "Proposal rejected.",
      };
      setMessage(labels[nextStatus] || "Status updated.");
      setSelectedId(null);
    } catch {
      setError("Unable to update proposal status.");
    } finally {
      setActionPending("");
    }
  };

  const handleDecision = async (decision, comment) => {
    if (!selectedId) return;
    setDecisionLoading(true);
    setError("");
    setMessage("");
    try {
      const updated = await api.updateProposal(selectedId, {
        status: decision,
        reviewerComment: comment,
      });
      setAllProposals((prev) =>
        prev.map((p) => (p.id === selectedId ? updated : p)),
      );
      const labels = {
        approved: "Approval recommended. The student will be notified.",
        needs_revision: "Revision requested. Comments forwarded to student.",
        rejected: "Proposal rejected. The student will be notified.",
      };
      setMessage(labels[decision] || "Decision recorded.");
      setSelectedId(null);
    } catch {
      setError("Unable to record decision.");
    } finally {
      setDecisionLoading(false);
    }
  };

  const selectedProposal = allProposals.find((p) => p.id === selectedId);

  if (loading) {
    return <LoadingState variant="review" />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-primary bg-primary text-white">
        <CardContent className="p-6 md:p-8">
          <div className="space-y-3">
            <div className="inline-flex rounded border border-white/15 bg-white/[0.06] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-white/60">
              Reviewer Panel
            </div>
            <h1 className="text-2xl font-semibold leading-tight md:text-3xl">
              Proposal Review Queue
            </h1>
            <p className="max-w-3xl text-sm leading-6 text-white/65">
              Reviewers are the accountable decision makers. Use AI pre-reviews
              as reference only — your judgment determines the outcome.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Advisory banner */}
      <HumanInLoopBanner />

      {message && (
        <Alert type="success" title="Decision Recorded" closable>
          {message}
        </Alert>
      )}
      {error && <Alert type="error">{error}</Alert>}

      {/* KPI cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardContent className="p-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted">
              Assigned
            </p>
            <p className="mt-1 text-2xl font-semibold text-ink">{kpi.totalAssigned}</p>
          </CardContent>
        </Card>
        <Card accent="info">
          <CardContent className="p-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted">
              Pending Review
            </p>
            <p className="mt-1 text-2xl font-semibold text-info">{kpi.pending}</p>
          </CardContent>
        </Card>
        <Card accent="warning">
          <CardContent className="p-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted">
              Revisions
            </p>
            <p className="mt-1 text-2xl font-semibold text-warning">{kpi.revisions}</p>
          </CardContent>
        </Card>
        <Card accent="success">
          <CardContent className="p-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted">
              Approved
            </p>
            <p className="mt-1 text-2xl font-semibold text-success">{kpi.approved}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted">
              Avg Wait
            </p>
            <p className="mt-1 text-2xl font-semibold text-ink">{kpi.avgWait}d</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <ReviewQueueFilters
            search={search}
            onSearchChange={setSearch}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            fieldFilter={fieldFilter}
            onFieldChange={setFieldFilter}
            urgencyFilter={urgencyFilter}
            onUrgencyChange={setUrgencyFilter}
            riskFilter={riskFilter}
            onRiskChange={setRiskFilter}
          />
        </CardContent>
      </Card>

      {/* Queue table */}
      <Card>
        <CardHeader className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Review Queue</CardTitle>
            <p className="mt-1 text-sm text-body-muted">
              {reviewQueue.length} proposal{reviewQueue.length !== 1 ? "s" : ""}{" "}
              match{reviewQueue.length !== 1 ? "" : "es"} current filters.
              Click a row to review in detail.
            </p>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {reviewQueue.length === 0 ? (
            <div className="p-6">
              <EmptyState
                title="No proposals match current filters"
                description="Try adjusting your search or filter criteria."
              />
            </div>
          ) : (
            <ReviewTable
              proposals={reviewQueue}
              reviews={reviewsByProposal}
              selectedId={selectedId}
              onSelectProposal={setSelectedId}
              onNeedsRevision={(id) =>
                handleStatusUpdate(id, PROPOSAL_STATUSES.NEEDS_REVISION, "revision")
              }
              onRecommendApprove={(id) =>
                handleStatusUpdate(id, PROPOSAL_STATUSES.APPROVED, "approve")
              }
              onReject={(id) =>
                handleStatusUpdate(id, PROPOSAL_STATUSES.REJECTED, "reject")
              }
            />
          )}
        </CardContent>
      </Card>

      {/* Inline review detail */}
      {selectedProposal && (
        <div className="space-y-6">
          <Card>
            <CardHeader className="flex items-center justify-between">
              <CardTitle>Review Detail</CardTitle>
              <button
                type="button"
                onClick={() => setSelectedId(null)}
                className="text-sm text-body-muted transition-colors hover:text-ink"
              >
                Close review
              </button>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Proposal summary */}
              <ProposalSummaryPanel proposal={selectedProposal} />

              <div className="grid gap-6 lg:grid-cols-2">
                  {/* Left: AI Pre-review + Rubric */}
                  <div className="space-y-6">
                    <AIFeedbackPanel
                      feedback={selectedFeedback}
                      loading={false}
                      isEmpty={!selectedFeedback}
                    />
                    {selectedReview && <RubricScoreCard review={selectedReview} />}
                  </div>

                  {/* Right: Decision panel */}
                  <div className="space-y-6">
                    <ReviewDecisionPanel
                      proposal={selectedProposal}
                      onDecision={handleDecision}
                      loading={decisionLoading}
                    />
                  </div>
                </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

export default function ReviewPage() {
  return (
    <ProtectedRoute allowedRoles={[USER_ROLES.REVIEWER, USER_ROLES.ADMIN]}>
      <AppShell>
        <ReviewPageContent />
      </AppShell>
    </ProtectedRoute>
  );
}
