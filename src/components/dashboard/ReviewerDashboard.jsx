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
 * ReviewerDashboard - Action-oriented dashboard for reviewers
 * Shows: Pending Reviews, Need Revision, Recently Reviewed, Assigned Projects
 */
export function ReviewerDashboard({ user }) {
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    api.getReviewQueue()
      .then((data) => { if (mounted) setQueue(Array.isArray(data) ? data : []); })
      .catch(() => {})
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  if (loading) return <LoadingState message="Loading dashboard..." />;

  const pendingReviews = queue.filter((p) => p.status === PROPOSAL_STATUSES.SUBMITTED || p.status === PROPOSAL_STATUSES.UNDER_REVIEW);
  const needRevision = queue.filter((p) => p.status === PROPOSAL_STATUSES.NEEDS_REVISION);
  const recentlyReviewed = queue.filter((p) => [PROPOSAL_STATUSES.APPROVED, PROPOSAL_STATUSES.REJECTED].includes(p.status)).slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-ink">Review Dashboard</h1>
        <p className="mt-1 text-sm text-body-muted">Here&apos;s what needs your attention today.</p>
      </div>

      {/* Primary action cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <ActionCard
          title="Pending Reviews"
          description={`${pendingReviews.length} proposal${pendingReviews.length !== 1 ? "s" : ""} awaiting your review.`}
          href="/review"
          ctaText="Open review queue"
          accent="warning"
          badge={pendingReviews.length > 0 ? `${pendingReviews.length} pending` : undefined}
          icon="m5 12 4 4L19 6M4.75 20.25h14.5M4.75 3.75h10.5"
        />

        {needRevision.length > 0 && (
          <ActionCard
            title="Needs Revision"
            description={`${needRevision.length} proposal${needRevision.length !== 1 ? "s" : ""} sent back for revision.`}
            href="/review"
            ctaText="View revisions"
            accent="danger"
            badge={`${needRevision.length} pending`}
            icon="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182"
            />
          )}
      </div>

      {/* Quick stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardCard title="Pending Review" value={pendingReviews.length} subtitle="Awaiting your review" accent="warning" />
        <DashboardCard title="Needs Revision" value={needRevision.length} subtitle="Sent back to students" accent="danger" />
        <DashboardCard title="Approved" value={queue.filter((p) => p.status === PROPOSAL_STATUSES.APPROVED).length} subtitle="Total approved" accent="success" />
        <DashboardCard title="Total Queue" value={queue.length} subtitle="All assigned" />
      </div>

      {/* Recently reviewed */}
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Recently Reviewed</CardTitle>
          <Link href="/review"><Button variant="secondary" className="text-xs">View Queue</Button></Link>
        </CardHeader>
        <CardContent className="p-0">
          {recentlyReviewed.length === 0 ? (
            <div className="px-6 py-10">
              <EmptyState
                title="No recent reviews"
                description="Proposals you've reviewed will appear here."
              />
            </div>
          ) : (
            <div className="divide-y divide-hairline">
              {recentlyReviewed.map((p) => (
                <Link key={p.id} href={`/proposals/${p.id}`} className="flex items-center justify-between gap-4 px-6 py-4 transition-colors hover:bg-subdued">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink">{p.title}</p>
                    <p className="mt-0.5 text-xs text-body-muted">{p.studentName} · {p.researchField || p.field}</p>
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
