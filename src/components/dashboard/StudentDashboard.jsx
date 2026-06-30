"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DashboardCard } from "./DashboardCard";
import { ActionCard } from "./ActionCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingState } from "@/components/ui/LoadingState";
import { ProposalStatusBadge } from "@/components/proposal/ProposalStatusBadge";
import { api } from "@/lib/api";
import { PROPOSAL_STATUSES } from "@/lib/constants";

/**
 * StudentDashboard - Action-oriented dashboard for students
 * Shows: Current Idea, Draft Proposal, Proposal Status, Assigned Supervisor,
 *        Current Project, Upcoming Milestone, Recent AI Feedback, Next Action
 */
export function StudentDashboard({ user }) {
  const [proposals, setProposals] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const [proposalData, projectData] = await Promise.allSettled([
          api.getProposals(),
          api.getProjects ? api.getProjects() : Promise.resolve([]),
        ]);
        if (!mounted) return;
        if (proposalData.status === "fulfilled") {
          const list = Array.isArray(proposalData.value) ? proposalData.value : [];
          setProposals(list.filter((p) => p.studentId === user?.id || p.student_id === user?.id));
        }
        if (projectData.status === "fulfilled") {
          setProjects(Array.isArray(projectData.value) ? projectData.value : []);
        }
      } catch {
        // silent
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [user?.id]);

  if (loading) return <LoadingState message="Loading dashboard..." />;

  // Derive actionable data
  const draftProposal = proposals.find((p) => p.status === PROPOSAL_STATUSES.DRAFT);
  const activeProposal = proposals.find((p) =>
    [PROPOSAL_STATUSES.SUBMITTED, PROPOSAL_STATUSES.UNDER_REVIEW, PROPOSAL_STATUSES.NEEDS_REVISION].includes(p.status)
  );
  const currentProject = projects.find((p) => p.status === "in_progress");
  const recentProposal = proposals.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))[0];

  return (
    <div className="space-y-6">
      {/* Welcome header */}
      <div>
        <h1 className="text-2xl font-semibold text-ink">Welcome back, {user?.name?.split(" ")[0] || "Student"}</h1>
        <p className="mt-1 text-sm text-body-muted">Here&apos;s what you should do today.</p>
      </div>

      {/* Primary action cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {!draftProposal && !activeProposal && (
          <ActionCard
            title="Start with an Idea"
            description="Describe your research idea and AI will help you develop it into a proposal."
            href="/ideas"
            ctaText="Start idea"
            accent="primary"
            icon="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
          />
        )}

        {draftProposal && (
          <ActionCard
            title="Continue Draft Proposal"
            description={`"${draftProposal.title?.slice(0, 50) || "Untitled"}" — last updated ${formatDate(draftProposal.updatedAt)}`}
            href={`/proposals/${draftProposal.id}`}
            ctaText="Continue editing"
            accent="info"
            badge="Draft"
            icon="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          />
        )}

        {activeProposal && (
          <ActionCard
            title="Proposal Status"
            description={`"${activeProposal.title?.slice(0, 50) || "Untitled"}" — ${STATUS_LABELS[activeProposal.status] || activeProposal.status}`}
            href={`/proposals/${activeProposal.id}`}
            ctaText="View proposal"
            accent="warning"
            badge={STATUS_LABELS[activeProposal.status]}
            icon="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        )}

        {activeProposal?.assignedLecturer && (
          <DashboardCard
            title="Assigned Supervisor"
            value={activeProposal.assignedLecturerName || "Assigned"}
            subtitle="Your research supervisor"
            accent="success"
          />
        )}

        {currentProject && (
          <ActionCard
            title="Current Project"
            description={`Working on: ${currentProject.title?.slice(0, 50) || "Project"}`}
            href={`/projects/${currentProject.id}`}
            ctaText="View project"
            accent="success"
            icon="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"
          />
        )}
      </div>

      {/* Quick stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardCard title="Total Proposals" value={proposals.length} subtitle="All time" />
        <DashboardCard
          title="Active"
          value={proposals.filter((p) => ![PROPOSAL_STATUSES.COMPLETED, PROPOSAL_STATUSES.REJECTED].includes(p.status)).length}
          subtitle="In progress"
          accent="info"
        />
        <DashboardCard title="Projects" value={projects.length} subtitle="Active projects" accent="success" />
        <DashboardCard title="Avg Score" value={recentProposal?.readinessScore?.toFixed(1) || "—"} subtitle="Latest readiness" />
      </div>

      {/* Recent proposals */}
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>My Proposals</CardTitle>
          <Link href="/proposals"><Button variant="secondary" className="text-xs">View All</Button></Link>
        </CardHeader>
        <CardContent className="p-0">
          {proposals.length === 0 ? (
            <div className="px-6 py-10">
              <EmptyState
                title="No proposals yet"
                description="Start by creating your first research proposal."
                action={<Link href="/ideas"><Button variant="primary">Start with an Idea</Button></Link>}
              />
            </div>
          ) : (
            <div className="divide-y divide-hairline">
              {proposals.slice(0, 5).map((p) => (
                <Link key={p.id} href={`/proposals/${p.id}`} className="flex items-center justify-between gap-4 px-6 py-4 transition-colors hover:bg-subdued">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink">{p.title}</p>
                    <p className="mt-0.5 text-xs text-body-muted">{p.researchField || p.field} · Updated {formatDate(p.updatedAt)}</p>
                  </div>
                  <ProposalStatusBadge status={p.status} />
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

const STATUS_LABELS = {
  draft: "Draft",
  submitted: "Submitted",
  under_review: "Under Review",
  needs_revision: "Needs Revision",
  approved: "Approved",
  rejected: "Rejected",
};

function formatDate(value) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
