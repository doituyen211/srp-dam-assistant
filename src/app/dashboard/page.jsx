"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingState } from "@/components/ui/LoadingState";
import { ProposalStatusBadge } from "@/components/proposal/ProposalStatusBadge";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import {
  PROPOSAL_STATUSES,
  CURRENT_TERM,
  ACADEMIC_TERMS,
  ACADEMIC_ROLE_LABELS,
  WORKFLOW_STAGES,
} from "@/lib/constants";

const formatDate = (value) => {
  if (!value) return "Not updated";
  return new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
};

function DashboardContent() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const proposalList = await api.getProposals();
        let dashboardStats = {};

        if (user?.role === "admin") {
          try { dashboardStats = await api.getAdminOverview(); } catch {}
        } else {
          dashboardStats = {
            totalProposals: Array.isArray(proposalList) ? proposalList.length : 0,
            underReview: Array.isArray(proposalList) ? proposalList.filter((p) => p.status === "under_review").length : 0,
            needsRevision: Array.isArray(proposalList) ? proposalList.filter((p) => p.status === "needs_revision").length : 0,
          };
        }

        if (!mounted) return;
        setStats(dashboardStats || {});
        setProposals(Array.isArray(proposalList) ? proposalList : []);
      } catch {
        if (!mounted) return;
        setError("Unable to load dashboard. Please try again.");
        setStats({});
        setProposals([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [user?.role]);

  if (loading) return <LoadingState variant="dashboard" />;

  if (error) {
    return (
      <div className="max-w-3xl">
        <Alert type="error" title="Unable to load data">{error}</Alert>
        <Button className="mt-4" onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  const myProposals = user?.role === "student"
    ? proposals.filter((p) => p.studentId === user.id || p.student_id === user.id)
    : proposals;

  const currentTerm = ACADEMIC_TERMS.find((t) => t.id === CURRENT_TERM);
  const activeProposal = myProposals
    .filter((p) => p.status !== PROPOSAL_STATUSES.COMPLETED && p.status !== PROPOSAL_STATUSES.REJECTED)
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))[0] || null;

  const averageReadiness = myProposals.length
    ? myProposals.reduce((sum, p) => sum + (p.readinessScore || 0), 0) / myProposals.length
    : 0;

  const revisionCount = myProposals.filter((p) => p.status === PROPOSAL_STATUSES.NEEDS_REVISION).length;

  return (
    <div className="space-y-6">
      <Card className="border-primary bg-primary text-white">
        <CardContent className="p-6 md:p-8">
          <div className="space-y-4">
            <div className="inline-flex rounded border border-white/15 bg-white/[0.06] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-white/60">
              {ACADEMIC_ROLE_LABELS[user?.role]}
            </div>
            <div>
              <h1 className="text-2xl font-semibold leading-tight md:text-3xl">
                Hello, {user?.name?.split(" ").slice(-1)[0] || "User"}
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-white/65">
                Research Proposal Dashboard — {currentTerm?.label || "Current term"}
                {user?.faculty ? ` · ${user.faculty}` : ""}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded border border-white/10 bg-white/[0.06] p-3">
                <div className="font-mono text-[10px] uppercase tracking-[0.08em] text-white/40">Total</div>
                <div className="mt-1 text-xl font-semibold">{myProposals.length}</div>
              </div>
              <div className="rounded border border-white/10 bg-white/[0.06] p-3">
                <div className="font-mono text-[10px] uppercase tracking-[0.08em] text-white/40">Active</div>
                <div className="mt-1 text-xl font-semibold">{activeProposal ? 1 : 0}</div>
              </div>
              <div className="rounded border border-white/10 bg-white/[0.06] p-3">
                <div className="font-mono text-[10px] uppercase tracking-[0.08em] text-white/40">Needs Revision</div>
                <div className="mt-1 text-xl font-semibold">{revisionCount}</div>
              </div>
              <div className="rounded border border-white/10 bg-white/[0.06] p-3">
                <div className="font-mono text-[10px] uppercase tracking-[0.08em] text-white/40">Avg. Score</div>
                <div className="mt-1 text-xl font-semibold">
                  {averageReadiness > 0 ? averageReadiness.toFixed(1) : "—"}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {activeProposal && (
        <Card accent="info">
          <CardHeader><CardTitle>Research Status</CardTitle></CardHeader>
          <CardContent>
            <div className="flex items-start gap-3 rounded border border-hairline bg-subdued p-3">
              <ProposalStatusBadge status={activeProposal.status} showWorkflow />
              <div className="text-xs leading-5 text-body-muted">
                Your proposal is at stage{" "}
                <strong className="text-ink">
                  {WORKFLOW_STAGES.find((s) => s.status === activeProposal.status)?.label}
                </strong>.
                {activeProposal.nextAction && ` Next step: ${activeProposal.nextAction}.`}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>My Proposals</CardTitle>
            <p className="mt-1 text-sm text-body-muted">
              {myProposals.length === 0
                ? "No proposals yet. Start by creating your first research proposal."
                : `${myProposals.length} proposals`}
            </p>
          </div>
          <Link href="/proposals/new">
            <Button variant="primary" className="text-xs">+ New Proposal</Button>
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          {myProposals.length === 0 ? (
            <div className="px-6 py-10">
              <EmptyState
                title="Start your research journey"
                description="Create a research proposal to get started. The system will guide you through each section."
                action={<Link href="/proposals/new"><Button variant="primary">Create First Proposal</Button></Link>}
              />
            </div>
          ) : (
            <div className="divide-y divide-hairline">
              {myProposals
                .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
                .slice(0, 5)
                .map((proposal) => (
                  <Link
                    key={proposal.id}
                    href={`/proposals/${proposal.id}`}
                    className="flex items-center justify-between gap-4 px-6 py-4 transition-colors hover:bg-subdued"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-ink">{proposal.title}</p>
                      <div className="mt-1 flex items-center gap-3">
                        <span className="text-xs text-body-muted">{proposal.researchField || proposal.field}</span>
                        {proposal.readinessScore > 0 && (
                          <span className="font-mono text-[11px] text-muted">Score: {proposal.readinessScore.toFixed(1)}</span>
                        )}
                      </div>
                    </div>
                    <ProposalStatusBadge status={proposal.status} />
                  </Link>
                ))}
              {myProposals.length > 5 && (
                <div className="px-6 py-3 text-center">
                  <Link href="/proposals" className="text-sm text-primary hover:underline">View all proposals →</Link>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <AppShell>
        <DashboardContent />
      </AppShell>
    </ProtectedRoute>
  );
}
