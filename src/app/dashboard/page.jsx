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
import { HumanInLoopBanner } from "@/components/ui/HumanInLoopBanner";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import {
  PROPOSAL_STATUSES,
  USER_ROLES,
  CURRENT_TERM,
  ACADEMIC_TERMS,
  ACADEMIC_ROLE_LABELS,
  WORKFLOW_STAGES,
} from "@/lib/constants";
import { mockLecturers, mockMilestones, mockMatchingSuggestions } from "@/lib/mockData";

const formatDate = (value) => {
  if (!value) return "Chưa cập nhật";
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
};

function StudentDashboard({ user, stats, proposals }) {
  const myProposals = useMemo(
    () => proposals.filter((p) => p.studentId === user.id),
    [proposals, user],
  );

  const activeProposal = useMemo(
    () =>
      myProposals
        .filter(
          (p) =>
            p.status !== PROPOSAL_STATUSES.COMPLETED &&
            p.status !== PROPOSAL_STATUSES.REJECTED,
        )
        .sort(
          (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt),
        )[0] || null,
    [myProposals],
  );

  const nearestDeadline = useMemo(() => {
    const withDeadline = myProposals.filter((p) => p.deadline);
    if (!withDeadline.length) return null;
    return withDeadline.sort(
      (a, b) => new Date(a.deadline) - new Date(b.deadline),
    )[0];
  }, [myProposals]);

  const averageReadiness = useMemo(() => {
    if (!myProposals.length) return 0;
    return (
      myProposals.reduce(
        (sum, p) => sum + (p.readinessScore || p.aiScore || 0),
        0,
      ) / myProposals.length
    );
  }, [myProposals]);

  const revisionCount = myProposals.filter(
    (p) => p.status === PROPOSAL_STATUSES.NEEDS_REVISION,
  ).length;

  const currentTerm = ACADEMIC_TERMS.find((t) => t.id === CURRENT_TERM);

  const getActionForProposal = (proposal) => {
    switch (proposal.status) {
      case PROPOSAL_STATUSES.DRAFT:
      case PROPOSAL_STATUSES.AI_PRE_CHECK:
        return {
          label: "Continue Draft",
          href: `/proposals/${proposal.id}`,
          primary: true,
        };
      case PROPOSAL_STATUSES.UNDER_REVIEW:
        return {
          label: "View Feedback",
          href: `/proposals/${proposal.id}`,
          primary: false,
        };
      case PROPOSAL_STATUSES.NEEDS_REVISION:
        return {
          label: "Submit Revision",
          href: `/proposals/${proposal.id}`,
          primary: true,
        };
      case PROPOSAL_STATUSES.APPROVED:
        return {
          label: "View Decision",
          href: `/proposals/${proposal.id}`,
          primary: false,
        };
      case PROPOSAL_STATUSES.SUPERVISOR_ASSIGNED:
      case PROPOSAL_STATUSES.IN_PROGRESS:
        return {
          label: "Track Milestones",
          href: `/proposals/${proposal.id}`,
          primary: false,
        };
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero / Summary Panel */}
      <Card className="border-primary bg-primary text-white">
        <CardContent className="p-6 md:p-8">
          <div className="grid gap-6 md:grid-cols-[1.5fr_1fr]">
            <div className="space-y-4">
              <div className="inline-flex rounded border border-white/15 bg-white/[0.06] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-white/60">
                {ACADEMIC_ROLE_LABELS[user.role]}
              </div>
              <div>
                <h1 className="text-2xl font-semibold leading-tight md:text-3xl">
                  Welcome, {user.name?.split(" ").slice(-1)[0] || "Student"}
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-white/65">
                  Research Proposal Dashboard —{" "}
                  {currentTerm?.label || "Current Term"}
                  {user.faculty ? ` · ${user.faculty}` : ""}
                </p>
              </div>

              {/* Quick stats grid */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded border border-white/10 bg-white/[0.06] p-3">
                  <div className="font-mono text-[10px] uppercase tracking-[0.08em] text-white/40">
                    Total
                  </div>
                  <div className="mt-1 text-xl font-semibold">
                    {myProposals.length}
                  </div>
                </div>
                <div className="rounded border border-white/10 bg-white/[0.06] p-3">
                  <div className="font-mono text-[10px] uppercase tracking-[0.08em] text-white/40">
                    Active
                  </div>
                  <div className="mt-1 text-xl font-semibold">
                    {activeProposal ? 1 : 0}
                  </div>
                </div>
                <div className="rounded border border-white/10 bg-white/[0.06] p-3">
                  <div className="font-mono text-[10px] uppercase tracking-[0.08em] text-white/40">
                    Revisions
                  </div>
                  <div className="mt-1 text-xl font-semibold">
                    {revisionCount}
                  </div>
                </div>
                <div className="rounded border border-white/10 bg-white/[0.06] p-3">
                  <div className="font-mono text-[10px] uppercase tracking-[0.08em] text-white/40">
                    Avg Score
                  </div>
                  <div className="mt-1 text-xl font-semibold">
                    {averageReadiness > 0
                      ? averageReadiness.toFixed(1)
                      : "—"}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {nearestDeadline && (
                <div className="rounded border border-white/10 bg-white/[0.06] p-4">
                  <div className="font-mono text-[10px] uppercase tracking-[0.08em] text-white/40">
                    Nearest Deadline
                  </div>
                  <div className="mt-1 text-sm font-medium text-white/90">
                    {nearestDeadline.title}
                  </div>
                  <div className="mt-0.5 text-xs text-white/50">
                    {formatDate(nearestDeadline.deadline)}
                  </div>
                </div>
              )}

              {activeProposal && (
                <div className="rounded border border-white/10 bg-white/[0.06] p-4">
                  <div className="font-mono text-[10px] uppercase tracking-[0.08em] text-white/40">
                    Next Action
                  </div>
                  <div className="mt-1 text-sm font-medium text-white/90">
                    {activeProposal.nextAction || "Awaiting review"}
                  </div>
                  <Link
                    href={`/proposals/${activeProposal.id}`}
                    className="mt-2 inline-flex items-center gap-1 text-xs text-white/60 underline underline-offset-2 transition-colors hover:text-white"
                  >
                    Open proposal →
                  </Link>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Research Readiness Panel */}
      {activeProposal && (
        <Card accent="info">
          <CardHeader>
            <CardTitle>Research Readiness</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-[1fr_1fr]">
              <div className="space-y-4">
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium text-ink">
                      Readiness Score
                    </span>
                    <span className="font-mono text-lg font-semibold text-primary">
                      {activeProposal.readinessScore?.toFixed(1) || "N/A"}
                      <span className="text-sm text-body-muted">/10</span>
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-subdued">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{
                        width: `${((activeProposal.readinessScore || 0) / 10) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded border border-hairline bg-subdued p-3">
                  <ProposalStatusBadge
                    status={activeProposal.status}
                    showWorkflow
                  />
                  <div className="text-xs leading-5 text-body-muted">
                    Your proposal is currently in the{" "}
                    <strong className="text-ink">
                      {
                        WORKFLOW_STAGES.find(
                          (s) => s.status === activeProposal.status,
                        )?.label
                      }
                    </strong>{" "}
                    stage.
                    {activeProposal.nextAction &&
                      ` Next step: ${activeProposal.nextAction}.`}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {/* Missing items */}
                {activeProposal.missingItems?.length > 0 && (
                  <div className="rounded border border-warning/20 bg-warning-bg p-3">
                    <div className="font-mono text-[10px] uppercase tracking-[0.08em] text-warning">
                      Items to address
                    </div>
                    <ul className="mt-1 space-y-1">
                      {activeProposal.missingItems.map((item, i) => (
                        <li
                          key={i}
                          className="flex items-center gap-2 text-xs text-warning/90"
                        >
                          <span className="h-1 w-1 rounded-full bg-warning" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Risk flags */}
                {activeProposal.riskFlags?.length > 0 && (
                  <div className="rounded border border-danger/20 bg-danger-bg p-3">
                    <div className="font-mono text-[10px] uppercase tracking-[0.08em] text-danger">
                      Risk Flags
                    </div>
                    <ul className="mt-1 space-y-1">
                      {activeProposal.riskFlags.map((flag, i) => (
                        <li
                          key={i}
                          className="flex items-center gap-2 text-xs text-danger/90"
                        >
                          <span className="h-1 w-1 rounded-full bg-danger" />
                          {flag}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Advisory */}
                <HumanInLoopBanner variant="inline" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Cards */}
      {activeProposal && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            href={`/proposals/${activeProposal.id}`}
            className="block"
          >
            <Card className="h-full transition-colors hover:border-primary/30">
              <CardContent className="flex flex-col gap-3 p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded bg-info-bg text-info">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-ink">Edit Proposal</h3>
                  <p className="mt-1 text-xs text-body-muted">
                    Update your research proposal content and structure.
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link
            href={`/proposals/${activeProposal.id}`}
            className="block"
          >
            <Card className="h-full transition-colors hover:border-primary/30">
              <CardContent className="flex flex-col gap-3 p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded bg-success-bg text-success">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-ink">AI Pre-check</h3>
                  <p className="mt-1 text-xs text-body-muted">
                    Run AI analysis to assess proposal quality and completeness.
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link
            href={`/proposals/${activeProposal.id}`}
            className="block"
          >
            <Card className="h-full transition-colors hover:border-primary/30">
              <CardContent className="flex flex-col gap-3 p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded bg-warning-bg text-warning">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-ink">Feedback</h3>
                  <p className="mt-1 text-xs text-body-muted">
                    View AI and reviewer feedback on your proposal.
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link
            href={`/proposals/${activeProposal.id}`}
            className="block"
          >
            <Card className="h-full transition-colors hover:border-primary/30">
              <CardContent className="flex flex-col gap-3 p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded bg-purple/10 text-purple">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-ink">Timeline</h3>
                  <p className="mt-1 text-xs text-body-muted">
                    Track milestones, deadlines, and project progress.
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      )}

      {/* Recent proposals list */}
      <Card>
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>My Proposals</CardTitle>
            <p className="mt-1 text-sm text-body-muted">
              {myProposals.length === 0
                ? "Start by creating your first research proposal."
                : `${myProposals.length} proposal${myProposals.length > 1 ? "s" : ""} — ${activeProposal ? "1 active" : "0 active"}`}
            </p>
          </div>
          <Link href="/proposals/new">
            <Button variant="primary" className="text-xs">
              + New Proposal
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          {myProposals.length === 0 ? (
            <div className="px-6 py-10">
              <EmptyState
                title="Begin your research journey"
                description="Create a research proposal to get started. The system will guide you through each section with AI-assisted suggestions."
                action={
                  <Link href="/proposals/new">
                    <Button variant="primary">Create Your First Proposal</Button>
                  </Link>
                }
              />
            </div>
          ) : (
            <div className="divide-y divide-hairline">
              {myProposals
                .sort(
                  (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt),
                )
                .slice(0, 5)
                .map((proposal) => (
                  <Link
                    key={proposal.id}
                    href={`/proposals/${proposal.id}`}
                    className="flex items-center justify-between gap-4 px-6 py-4 transition-colors hover:bg-subdued"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-ink">
                        {proposal.title}
                      </p>
                      <div className="mt-1 flex items-center gap-3">
                        <span className="text-xs text-body-muted">
                          {proposal.researchField || proposal.field}
                        </span>
                        {proposal.readinessScore > 0 && (
                          <span className="font-mono text-[11px] text-muted">
                            Score: {proposal.readinessScore.toFixed(1)}
                          </span>
                        )}
                      </div>
                    </div>
                    <ProposalStatusBadge status={proposal.status} />
                  </Link>
                ))}
              {myProposals.length > 5 && (
                <div className="px-6 py-3 text-center">
                  <Link
                    href="/proposals"
                    className="text-sm text-primary hover:underline"
                  >
                    View all proposals →
                  </Link>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function ReviewerDashboard({ user, stats, proposals }) {
  const reviewQueue = proposals.filter(
    (p) =>
      p.status === PROPOSAL_STATUSES.SUBMITTED ||
      p.status === PROPOSAL_STATUSES.UNDER_REVIEW,
  );
  const revisionQueue = proposals.filter(
    (p) => p.status === PROPOSAL_STATUSES.NEEDS_REVISION,
  );

  return (
    <div className="space-y-6">
      <Card className="border-primary bg-primary text-white">
        <CardContent className="p-6 md:p-8">
          <div className="space-y-4">
            <div className="inline-flex rounded border border-white/15 bg-white/[0.06] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-white/60">
              {ACADEMIC_ROLE_LABELS[user.role]}
            </div>
            <h1 className="text-2xl font-semibold leading-tight md:text-3xl">
              Review Panel
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-white/65">
              {reviewQueue.length > 0
                ? `${reviewQueue.length} proposal${reviewQueue.length > 1 ? "s" : ""} awaiting your review.`
                : "No proposals currently in the review queue."}
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-muted">
              Pending Review
            </p>
            <p className="mt-2 text-3xl font-semibold text-ink">
              {reviewQueue.length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-muted">
              Revisions Needed
            </p>
            <p className="mt-2 text-3xl font-semibold text-ink">
              {revisionQueue.length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-muted">
              Completed
            </p>
            <p className="mt-2 text-3xl font-semibold text-ink">
              {stats?.approvedProposals || 0}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-3">
        <Link href="/review">
          <Button variant="primary">Open Review Queue</Button>
        </Link>
        <Link href="/proposals">
          <Button variant="secondary">Browse Proposals</Button>
        </Link>
      </div>
    </div>
  );
}

function AdminDashboard({ user, stats, proposals }) {
  const counts = {};
  Object.values(PROPOSAL_STATUSES).forEach((s) => {
    counts[s] = proposals.filter((p) => p.status === s).length;
  });

  const fullLoadLecturers = mockLecturers.filter(
    (l) => l.currentLoad >= l.maxLoad,
  ).length;

  return (
    <div className="space-y-6">
      <Card className="border-primary bg-primary text-white">
        <CardContent className="p-6 md:p-8">
          <div className="space-y-4">
            <div className="inline-flex rounded border border-white/15 bg-white/[0.06] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-white/60">
              {ACADEMIC_ROLE_LABELS[user.role]}
            </div>
            <h1 className="text-2xl font-semibold leading-tight md:text-3xl">
              Operations Dashboard
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-white/65">
              {stats?.totalProposals || 0} proposals in the system ·{" "}
              {fullLoadLecturers > 0
                ? `${fullLoadLecturers} lecturer${fullLoadLecturers > 1 ? "s" : ""} at full capacity`
                : "Lecturer capacity available"}
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-5">
            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-muted">
              Total
            </p>
            <p className="mt-2 text-3xl font-semibold text-ink">
              {stats?.totalProposals || 0}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-muted">
              Under Review
            </p>
            <p className="mt-2 text-3xl font-semibold text-ink">
              {counts.under_review || 0}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-muted">
              Approved
            </p>
            <p className="mt-2 text-3xl font-semibold text-ink">
              {counts.approved || 0}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-muted">
              Lecturers
            </p>
            <p className="mt-2 text-3xl font-semibold text-ink">
              {mockLecturers.length}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-3">
        <Link href="/admin">
          <Button variant="primary">System Admin</Button>
        </Link>
        <Link href="/matching">
          <Button variant="secondary">Supervisor Matching</Button>
        </Link>
      </div>
    </div>
  );
}

function LecturerDashboard({ user, stats, proposals }) {
  const lecturerProfile = mockLecturers.find((l) => l.id === user.id);
  const currentLoad = lecturerProfile?.currentLoad || 0;
  const maxLoad = lecturerProfile?.maxLoad || 3;
  const loadPct = Math.round((currentLoad / maxLoad) * 100);

  const myProposals = proposals.filter(
    (p) => p.assignedLecturer === user.id,
  );

  const suggestedProposals = proposals.filter(
    (p) =>
      p.status === PROPOSAL_STATUSES.APPROVED ||
      p.status === PROPOSAL_STATUSES.SUPERVISOR_ASSIGNED,
  );

  const upcomingMilestones = mockMilestones
    .filter((m) => {
      const proposal = proposals.find((p) => p.id === m.proposalId);
      return proposal && proposal.assignedLecturer === user.id && m.status !== "completed";
    })
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 3);

  const formatDate = (value) => {
    if (!value) return "—";
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(value));
  };

  const loadStatus =
    loadPct >= 100
      ? { label: "Full capacity", color: "text-danger bg-danger-bg border-danger/30" }
      : loadPct >= 75
        ? { label: "Near capacity", color: "text-warning bg-warning-bg border-warning/30" }
        : { label: "Available", color: "text-success bg-success-bg border-success/30" };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-primary bg-primary text-white">
        <CardContent className="p-6 md:p-8">
          <div className="space-y-3">
            <div className="inline-flex rounded border border-white/15 bg-white/[0.06] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-white/60">
              {ACADEMIC_ROLE_LABELS[user.role]}
            </div>
            <h1 className="text-2xl font-semibold leading-tight md:text-3xl">
              Supervision Dashboard
            </h1>
            <p className="max-w-3xl text-sm leading-6 text-white/65">
              {myProposals.length > 0
                ? `${myProposals.length} assigned proposal${myProposals.length > 1 ? "s" : ""} · ${suggestedProposals.length} suggested match${suggestedProposals.length !== 1 ? "es" : ""} · Load: ${currentLoad}/${maxLoad}`
                : `No proposals currently assigned. ${suggestedProposals.length} suggested match${suggestedProposals.length !== 1 ? "es" : ""} available.`}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardContent className="p-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted">
              Assigned
            </p>
            <p className="mt-1.5 text-2xl font-semibold text-ink">
              {myProposals.length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted">
              Suggested
            </p>
            <p className="mt-1.5 text-2xl font-semibold text-ink">
              {suggestedProposals.length}
            </p>
          </CardContent>
        </Card>
        <Card accent={loadPct >= 100 ? "danger" : loadPct >= 75 ? "warning" : undefined}>
          <CardContent className="p-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted">
              Supervision Load
            </p>
            <p className="mt-1.5 text-2xl font-semibold text-ink">
              {currentLoad}
              <span className="text-base text-body-muted">/{maxLoad}</span>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted">
              Upcoming Milestones
            </p>
            <p className="mt-1.5 text-2xl font-semibold text-ink">
              {upcomingMilestones.length}
            </p>
          </CardContent>
        </Card>
        <Card accent={loadPct >= 100 ? "danger" : loadPct >= 75 ? "warning" : "success"}>
          <CardContent className="p-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted">
              Capacity Status
            </p>
            <span
              className={`mt-1.5 inline-flex items-center rounded border px-2.5 py-1 font-mono text-xs font-medium ${loadStatus.color}`}
            >
              {loadStatus.label}
            </span>
          </CardContent>
        </Card>
      </div>

      {/* Capacity panel */}
      {lecturerProfile && (
        <Card accent={loadPct >= 100 ? "danger" : loadPct >= 75 ? "warning" : "success"}>
          <CardHeader>
            <CardTitle>Your Capacity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-[1fr_1fr]">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-ink">
                    Supervision Load
                  </span>
                  <span className="font-mono text-sm font-medium text-ink">
                    {currentLoad}/{maxLoad}
                  </span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-subdued">
                  <div
                    className={`h-full rounded-full transition-all ${
                      loadPct >= 100 ? "bg-danger" : loadPct >= 75 ? "bg-warning" : "bg-success"
                    }`}
                    style={{ width: `${Math.min(loadPct, 100)}%` }}
                  />
                </div>
                {lecturerProfile.activeProjects?.length > 0 && (
                  <div className="rounded border border-hairline bg-subdued/50 p-3">
                    <p className="font-mono text-[10px] uppercase tracking-[0.06em] text-muted">
                      Active Projects
                    </p>
                    <ul className="mt-1 space-y-0.5">
                      {lecturerProfile.activeProjects.map((proj, i) => (
                        <li key={i} className="text-xs text-body-muted">
                          • {proj}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <div className="space-y-3">
                <div className="rounded border border-hairline bg-subdued/50 p-3">
                  <p className="font-mono text-[10px] uppercase tracking-[0.06em] text-muted">
                    Availability Note
                  </p>
                  <p className="mt-1 text-sm text-ink">
                    {loadPct >= 100
                      ? "You have reached your maximum supervision capacity. Please coordinate with the Research Office before accepting new assignments."
                      : loadPct >= 75
                        ? "You are approaching full capacity. Consider prioritizing existing commitments before accepting new proposals."
                        : `You have capacity for ${maxLoad - currentLoad} more student${maxLoad - currentLoad !== 1 ? "s" : ""}. New assignments can be accepted.`}
                  </p>
                </div>
                {loadPct >= 75 && (
                  <div className="rounded border border-warning/20 bg-warning-bg p-3">
                    <p className="font-mono text-[10px] uppercase tracking-[0.06em] text-warning">
                      Capacity Risk
                    </p>
                    <p className="mt-0.5 text-xs text-warning/90">
                      {loadPct >= 100
                        ? "High workload: your supervision capacity is fully utilized."
                        : "Medium workload: monitor your capacity as new assignments are considered."}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Assigned proposals */}
      <Card>
        <CardHeader className="flex items-center justify-between">
          <div>
            <CardTitle>Your Assigned Proposals</CardTitle>
            <p className="mt-1 text-sm text-body-muted">
              Proposals where you are listed as the supervisor
            </p>
          </div>
          <Link href="/proposals">
            <Button variant="secondary" className="text-xs">
              View All
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          {myProposals.length === 0 ? (
            <div className="px-6 py-8">
              <EmptyState
                title="No assigned proposals"
                description="When proposals are assigned to you, they will appear here. Check your suggested matches to find suitable proposals."
                action={
                  <Link href="/matching">
                    <Button variant="primary">View Matching Suggestions</Button>
                  </Link>
                }
              />
            </div>
          ) : (
            <div className="divide-y divide-hairline">
              {myProposals.map((proposal) => {
                const ms = mockMilestones
                  .filter((m) => m.proposalId === proposal.id && m.status !== "completed")
                  .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))[0];
                return (
                  <Link
                    key={proposal.id}
                    href={`/proposals/${proposal.id}`}
                    className="flex items-center justify-between gap-4 px-6 py-4 transition-colors hover:bg-subdued"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-ink">
                        {proposal.title}
                      </p>
                      <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-body-muted">
                        <span>{proposal.studentName}</span>
                        <span>{proposal.researchField || proposal.field}</span>
                        <ProposalStatusBadge status={proposal.status} />
                        <span>Updated {formatDate(proposal.updatedAt)}</span>
                      </div>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      {ms && (
                        <div className="text-xs text-body-muted">
                          <span className="font-medium text-ink">{ms.name}</span>
                          <br />
                          Due {formatDate(ms.dueDate)}
                        </div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Suggested matches */}
      <Card>
        <CardHeader className="flex items-center justify-between">
          <div>
            <CardTitle>Suggested Matches</CardTitle>
            <p className="mt-1 text-sm text-body-muted">
              Proposals that match your expertise and are awaiting supervisor assignment
            </p>
          </div>
          <Link href="/matching">
            <Button variant="secondary" className="text-xs">
              View All Matches
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          {suggestedProposals.length === 0 ? (
            <div className="px-6 py-8">
              <EmptyState
                title="No suggested matches"
                description="Proposals that need a supervisor will appear here when they match your expertise."
              />
            </div>
          ) : (
            <div className="divide-y divide-hairline">
              {suggestedProposals.slice(0, 5).map((proposal) => {
                const matchScore = mockMatchingSuggestions
                  ?.find((m) => m.proposalId === proposal.id)
                  ?.suggestedLecturers?.find((s) => s.lecturerId === user.id)
                  ?.matchScore || null;

                return (
                  <div
                    key={proposal.id}
                    className="flex items-center justify-between gap-4 px-6 py-4 transition-colors hover:bg-subdued"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-medium text-ink">
                          {proposal.title}
                        </p>
                        {matchScore && (
                          <span className="rounded bg-success-bg px-1.5 py-0.5 font-mono text-[10px] font-medium text-success">
                            Match: {matchScore.toFixed(1)}
                          </span>
                        )}
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-body-muted">
                        <span>{proposal.studentName}</span>
                        <span>{proposal.researchField || proposal.field}</span>
                        <ProposalStatusBadge status={proposal.status} />
                      </div>
                      <div className="mt-2 flex gap-2">
                        <Link
                          href={`/proposals/${proposal.id}`}
                          className="inline-flex items-center rounded border border-hairline px-2.5 py-1 text-xs font-medium text-ink transition-colors hover:bg-subdued"
                        >
                          View Proposal
                        </Link>
                        <Link
                          href={`/matching`}
                          className="inline-flex items-center rounded border border-hairline px-2.5 py-1 text-xs font-medium text-ink transition-colors hover:bg-subdued"
                        >
                          Mark Interest
                        </Link>
                      </div>
                    </div>
                    <div className="flex-shrink-0 text-right text-xs text-body-muted">
                      {matchScore !== null && (
                        <>
                          <div>
                            Capacity impact:{" "}
                            <span
                              className={
                                loadPct >= 75 ? "text-warning" : "text-success"
                              }
                            >
                              {currentLoad + 1}/{maxLoad}
                            </span>
                          </div>
                          {loadPct >= 75 && (
                            <div className="mt-0.5 text-warning">
                              Near capacity
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upcoming milestones */}
      {upcomingMilestones.length > 0 && (
        <Card accent="info">
          <CardHeader>
            <CardTitle>Upcoming Milestones</CardTitle>
            <p className="mt-1 text-sm text-body-muted">
              Your next supervision milestones
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingMilestones.map((ms) => {
              const proposal = proposals.find((p) => p.id === ms.proposalId);
              return (
                <div
                  key={ms.id}
                  className="flex items-center justify-between rounded border border-hairline p-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-ink">{ms.name}</p>
                    <p className="text-xs text-body-muted">
                      {proposal?.title} · {proposal?.studentName}
                    </p>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <div className="font-mono text-xs text-ink">
                      {formatDate(ms.dueDate)}
                    </div>
                    <div className="h-1.5 w-20 overflow-hidden rounded-full bg-subdued">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${ms.progress || 0}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <Link href="/matching">
          <Button variant="primary">View Supervisor Matching</Button>
        </Link>
        <Link href="/proposals">
          <Button variant="secondary">Browse All Proposals</Button>
        </Link>
      </div>
    </div>
  );
}

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
        const [dashboardStats, proposalList] = await Promise.all([
          api.getDashboardStats(),
          api.getProposals(),
        ]);
        if (!mounted) return;
        setStats(dashboardStats || {});
        setProposals(Array.isArray(proposalList) ? proposalList : []);
      } catch {
        if (!mounted) return;
        setError("Unable to load dashboard. Please try again.");
        setStats(null);
        setProposals([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return <LoadingState variant="dashboard" />;
  }

  if (error) {
    return (
      <div className="max-w-3xl">
        <Alert type="error" title="Unable to load data">
          {error}
        </Alert>
        <Button className="mt-4" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

  const dashboardByRole = {
    [USER_ROLES.STUDENT]: (
      <StudentDashboard
        user={user}
        stats={stats}
        proposals={proposals}
      />
    ),
    [USER_ROLES.REVIEWER]: (
      <ReviewerDashboard
        user={user}
        stats={stats}
        proposals={proposals}
      />
    ),
    [USER_ROLES.ADMIN]: (
      <AdminDashboard
        user={user}
        stats={stats}
        proposals={proposals}
      />
    ),
    [USER_ROLES.LECTURER]: (
      <LecturerDashboard
        user={user}
        stats={stats}
        proposals={proposals}
      />
    ),
  };

  return (
    dashboardByRole[user?.role] || (
      <div className="space-y-6">
        <Card className="border-primary bg-primary text-white">
          <CardContent className="p-6 md:p-8">
            <div className="space-y-4">
              <h1 className="text-2xl font-semibold leading-tight md:text-3xl">
                Welcome, {user?.name || "User"}
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-white/65">
                Research proposal management platform.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
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
