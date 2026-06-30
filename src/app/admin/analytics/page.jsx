"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingState } from "@/components/ui/LoadingState";
import { api } from "@/lib/api";
import { USER_ROLES } from "@/lib/constants";

function AnalyticsPageContent() {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    api.getAdminOverview()
      .then((data) => { if (mounted) setOverview(data); })
      .catch(() => {})
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  if (loading) return <LoadingState message="Loading analytics..." />;

  const stageCounts = overview?.proposalsByStage || overview?.proposals_by_stage || overview?.countsByStage || {};
  const totalProposals = overview?.totalProposals || 0;

  return (
    <div className="space-y-6">
      <Card className="border-primary bg-primary text-white">
        <CardContent className="p-6 md:p-8">
          <div className="space-y-3">
            <div className="inline-flex rounded border border-white/15 bg-white/[0.06] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-white/60">Administration</div>
            <h1 className="text-2xl font-semibold leading-tight md:text-3xl">Analytics</h1>
            <p className="max-w-3xl text-sm leading-6 text-white/65">Proposal statistics, reviewer performance, and faculty distribution.</p>
          </div>
        </CardContent>
      </Card>

      {/* KPI cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardCard title="Total Proposals" value={totalProposals} subtitle="All time" />
        <DashboardCard title="Completion Rate" value={totalProposals > 0 ? `${Math.round(((stageCounts.completed || 0) / totalProposals) * 100)}%` : "—"} subtitle="Approved / Total" accent="success" />
        <DashboardCard title="Avg Readiness" value={overview?.averageReadinessScore?.toFixed(1) || "—"} subtitle="AI readiness score" accent="info" />
        <DashboardCard title="Pending Reviews" value={overview?.pendingReviews || 0} subtitle="Awaiting action" accent="warning" />
      </div>

      {/* Pipeline breakdown */}
      <Card>
        <CardHeader><CardTitle>Workflow Pipeline</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(stageCounts).map(([stage, count]) => (
              <div key={stage} className="flex items-center gap-3">
                <span className="w-40 text-sm text-body-muted capitalize">{stage.replace(/_/g, " ")}</span>
                <div className="flex-1 h-4 overflow-hidden rounded-full bg-subdued">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${totalProposals > 0 ? (count / totalProposals) * 100 : 0}%` }}
                  />
                </div>
                <span className="w-12 text-right font-mono text-sm text-ink">{count}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Reviewer workload */}
      <Card>
        <CardHeader><CardTitle>Reviewer Workload</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(overview?.reviewerWorkload || overview?.reviewer_workload || {}).map(([reviewer, count]) => (
              <div key={reviewer} className="flex items-center justify-between rounded border border-hairline p-3">
                <span className="text-sm font-medium text-ink">{reviewer}</span>
                <span className="text-sm text-body-muted">{count} proposals</span>
              </div>
            ))}
            {Object.keys(overview?.reviewerWorkload || overview?.reviewer_workload || {}).length === 0 && (
              <EmptyState title="No reviewer data" description="Reviewer workload will appear after reviews are conducted." />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Lecturer capacity */}
      <Card>
        <CardHeader><CardTitle>Lecturer Capacity</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {(overview?.lecturerCapacity || overview?.lecturer_capacity || []).map((lecturer) => {
              const load = lecturer.currentLoad || lecturer.current_load || 0;
              const max = lecturer.maxLoad || lecturer.max_load || 3;
              return (
                <div key={lecturer.id} className="flex items-center gap-3 rounded border border-hairline p-3">
                  <span className="flex-1 text-sm font-medium text-ink">{lecturer.name}</span>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-20 overflow-hidden rounded-full bg-subdued">
                      <div
                        className={`h-full rounded-full ${load >= max ? "bg-danger" : load >= max * 0.75 ? "bg-warning" : "bg-success"}`}
                        style={{ width: `${(load / max) * 100}%` }}
                      />
                    </div>
                    <span className="font-mono text-xs text-muted">{load}/{max}</span>
                  </div>
                </div>
              );
            })}
            {(overview?.lecturerCapacity || overview?.lecturer_capacity || []).length === 0 && (
              <EmptyState title="No lecturer data" description="Lecturer capacity will appear when lecturers are added." />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AnalyticsPage() {
  return (
    <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN]}>
      <AppShell>
        <AnalyticsPageContent />
      </AppShell>
    </ProtectedRoute>
  );
}
