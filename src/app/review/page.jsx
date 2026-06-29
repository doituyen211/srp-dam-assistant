"use client";

import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { ReviewTable } from "@/components/review/ReviewTable";
import { ReviewQueueFilters } from "@/components/review/ReviewQueueFilters";
import { ProposalSummaryPanel } from "@/components/review/ProposalSummaryPanel";
import { ReviewDecisionPanel } from "@/components/review/ReviewDecisionPanel";
import { Alert } from "@/components/ui/Alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingState } from "@/components/ui/LoadingState";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import { PROPOSAL_STATUSES, USER_ROLES } from "@/lib/constants";

function ReviewPageContent() {
  const { user } = useAuth();
  const [queueItems, setQueueItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [fieldFilter, setFieldFilter] = useState("all");
  const [urgencyFilter, setUrgencyFilter] = useState("all");
  const [riskFilter, setRiskFilter] = useState("all");

  const [selectedId, setSelectedId] = useState(null);
  const [decisionLoading, setDecisionLoading] = useState(false);

  // Load queue
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await api.getReviewQueue();
        if (mounted) setQueueItems(Array.isArray(data) ? data : []);
      } catch {
        if (mounted) setError("Unable to load review queue.");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  const filteredQueue = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return queueItems.filter((p) => {
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
    }).sort((a, b) => new Date(b.updatedAt || b.updated_at) - new Date(a.updatedAt || a.updated_at));
  }, [queueItems, search, statusFilter, fieldFilter, urgencyFilter, riskFilter]);

  const kpi = useMemo(() => {
    const pending = queueItems.filter((p) => p.status === PROPOSAL_STATUSES.SUBMITTED || p.status === PROPOSAL_STATUSES.UNDER_REVIEW).length;
    const revisions = queueItems.filter((p) => p.status === PROPOSAL_STATUSES.NEEDS_REVISION).length;
    const approved = queueItems.filter((p) => p.status === PROPOSAL_STATUSES.APPROVED).length;
    return { pending, revisions, approved, total: queueItems.length };
  }, [queueItems]);

  const handleDecision = async (decision, comment) => {
    if (!selectedId) return;
    setDecisionLoading(true);
    setError("");
    setMessage("");
    try {
      await api.createReviewDecision(selectedId, { decision, decision_comment: comment, criteria: [] });
      setMessage(decision === "approved" ? "Proposal approved." : decision === "rejected" ? "Proposal rejected." : "Revision requested.");
      setSelectedId(null);
      // Refetch queue
      const data = await api.getReviewQueue();
      setQueueItems(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Unable to record decision.");
    } finally {
      setDecisionLoading(false);
    }
  };

  if (loading) return <LoadingState variant="review" />;

  return (
    <div className="space-y-6">
      <Card className="border-primary bg-primary text-white">
        <CardContent className="p-6 md:p-8">
          <div className="space-y-3">
            <div className="inline-flex rounded border border-white/15 bg-white/[0.06] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-white/60">Review Panel</div>
            <h1 className="text-2xl font-semibold leading-tight md:text-3xl">Research Proposal Review Queue</h1>
            <p className="max-w-3xl text-sm leading-6 text-white/65">Reviewers make the final decision. Evaluate proposals based on content and rubric criteria.</p>
          </div>
        </CardContent>
      </Card>

      {message && <Alert type="success" title="Decision Recorded" closable>{message}</Alert>}
      {error && <Alert type="error">{error}</Alert>}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Card><CardContent className="p-4"><p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted">Assigned</p><p className="mt-1 text-2xl font-semibold text-ink">{kpi.total}</p></CardContent></Card>
        <Card accent="info"><CardContent className="p-4"><p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted">Awaiting review</p><p className="mt-1 text-2xl font-semibold text-info">{kpi.pending}</p></CardContent></Card>
        <Card accent="warning"><CardContent className="p-4"><p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted">Needs revision</p><p className="mt-1 text-2xl font-semibold text-warning">{kpi.revisions}</p></CardContent></Card>
        <Card accent="success"><CardContent className="p-4"><p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted">Approved</p><p className="mt-1 text-2xl font-semibold text-success">{kpi.approved}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted">Total</p><p className="mt-1 text-2xl font-semibold text-ink">{queueItems.length}</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Filters</CardTitle></CardHeader>
        <CardContent>
          <ReviewQueueFilters
            search={search} onSearchChange={setSearch}
            statusFilter={statusFilter} onStatusChange={setStatusFilter}
            fieldFilter={fieldFilter} onFieldChange={setFieldFilter}
            urgencyFilter={urgencyFilter} onUrgencyChange={setUrgencyFilter}
            riskFilter={riskFilter} onRiskChange={setRiskFilter}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Review Queue</CardTitle></CardHeader>
        <CardContent className="p-0">
          {filteredQueue.length === 0 ? (
            <div className="p-6"><EmptyState title="No proposals match the current filters" description="Try adjusting your search or filter criteria." /></div>
          ) : (
            <ReviewTable proposals={filteredQueue} reviews={{}} selectedId={selectedId} onSelectProposal={setSelectedId} />
          )}
        </CardContent>
      </Card>

      {selectedId && (
        <div className="space-y-6">
          <Card>
            <CardHeader className="flex items-center justify-between">
              <CardTitle>Review Details</CardTitle>
              <button type="button" onClick={() => setSelectedId(null)} className="text-sm text-body-muted hover:text-ink">Close review</button>
            </CardHeader>
            <CardContent className="space-y-6">
              <ProposalSummaryPanel proposal={queueItems.find((p) => p.id === selectedId)} />
              <ReviewDecisionPanel proposal={queueItems.find((p) => p.id === selectedId)} onDecision={handleDecision} loading={decisionLoading} />
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
      <AppShell><ReviewPageContent /></AppShell>
    </ProtectedRoute>
  );
}
