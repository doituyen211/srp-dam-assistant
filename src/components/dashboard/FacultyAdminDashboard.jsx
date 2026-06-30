"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DashboardCard } from "./DashboardCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingState } from "@/components/ui/LoadingState";
import { WorkflowPipeline } from "@/components/admin/WorkflowPipeline";
import { BottleneckTable } from "@/components/admin/BottleneckTable";
import { PendingDecisionQueue } from "@/components/admin/PendingDecisionQueue";
import { LecturerCapacityTable } from "@/components/admin/LecturerCapacityTable";
import { api } from "@/lib/api";

/**
 * FacultyAdminDashboard - Operations dashboard for faculty admins
 * Shows: Workflow Pipeline, Proposal Statistics, Reviewer Workload,
 *        Lecturer Capacity, Recent Activities, AI Usage
 */
export function FacultyAdminDashboard({ user }) {
  const [overview, setOverview] = useState(null);
  const [proposals, setProposals] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const [ov, propData, logs] = await Promise.allSettled([
          api.getAdminOverview(),
          api.getProposals(),
          api.getAuditLogs(),
        ]);
        if (!mounted) return;
        if (ov.status === "fulfilled") setOverview(ov.value);
        if (propData.status === "fulfilled") setProposals(Array.isArray(propData.value) ? propData.value : []);
        if (logs.status === "fulfilled") setAuditLogs(Array.isArray(logs.value) ? logs.value : []);
      } catch {
        // silent
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  if (loading) return <LoadingState message="Loading dashboard..." />;

  const kpiProps = {
    totalProposals: overview?.totalProposals || 0,
    pendingReview: (overview?.proposalsByStage?.submitted || 0) + (overview?.proposalsByStage?.under_review || 0),
    needsRevision: overview?.proposalsByStage?.needs_revision || 0,
    pendingSupervisor: overview?.proposalsByStage?.approved || 0,
    overdueMilestones: overview?.overdueMilestones || 0,
    lecturerCapacityRisk: (overview?.lecturerCapacity || []).filter((l) => (l.currentLoad || l.current_load || 0) >= (l.maxLoad || l.max_load || 3)).length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-ink">Faculty Dashboard</h1>
        <p className="mt-1 text-sm text-body-muted">Overview of research proposals and reviewer activity.</p>
      </div>

      {/* KPI cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <DashboardCard title="Total Proposals" value={kpiProps.totalProposals} subtitle="All time" />
        <DashboardCard title="Pending Review" value={kpiProps.pendingReview} subtitle="Awaiting reviewer" accent="info" />
        <DashboardCard title="Needs Revision" value={kpiProps.needsRevision} subtitle="Waiting on student" accent="warning" />
        <DashboardCard title="Pending Supervisor" value={kpiProps.pendingSupervisor} subtitle="Approved, unassigned" accent="info" />
        <DashboardCard title="Overdue Milestones" value={kpiProps.overdueMilestones} subtitle="Past deadline" accent="danger" />
        <DashboardCard title="Lecturer Risk" value={kpiProps.lecturerCapacityRisk} subtitle="At full capacity" accent="danger" />
      </div>

      {/* Workflow Pipeline + Bottlenecks */}
      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <Card>
          <CardHeader>
            <CardTitle>Workflow Pipeline</CardTitle>
            <p className="mt-1 text-sm text-body-muted">Proposal counts by stage</p>
          </CardHeader>
          <CardContent>
            <WorkflowPipeline counts={overview?.proposalsByStage || overview?.proposals_by_stage || overview?.countsByStage || {}} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bottlenecks &amp; Risks</CardTitle>
            <p className="mt-1 text-sm text-body-muted">Stages requiring attention</p>
          </CardHeader>
          <CardContent>
            <BottleneckTable bottlenecks={overview?.bottlenecks || []} />
          </CardContent>
        </Card>
      </div>

      {/* Pending decisions + Lecturer capacity */}
      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <Card>
          <CardHeader>
            <CardTitle>Pending Decisions</CardTitle>
            <p className="mt-1 text-sm text-body-muted">Proposals requiring action</p>
          </CardHeader>
          <CardContent>
            <PendingDecisionQueue proposals={proposals} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Lecturer Capacity</CardTitle>
            <p className="mt-1 text-sm text-body-muted">Supervision load and status</p>
          </CardHeader>
          <CardContent>
            <LecturerCapacityTable lecturers={overview?.lecturerCapacity || overview?.lecturer_capacity || []} />
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
          <p className="mt-1 text-sm text-body-muted">Latest system events</p>
        </CardHeader>
        <CardContent>
          {auditLogs.length === 0 ? (
            <EmptyState title="No recent activities" description="Events will appear as users interact with the system." />
          ) : (
            <div className="overflow-x-auto rounded border border-hairline bg-canvas">
              <table className="w-full min-w-[600px] border-collapse text-sm">
                <thead className="bg-subdued">
                  <tr>
                    <th className="px-4 py-3 text-left font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-muted">Time</th>
                    <th className="px-4 py-3 text-left font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-muted">User</th>
                    <th className="px-4 py-3 text-left font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-muted">Action</th>
                    <th className="px-4 py-3 text-left font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-muted">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-hairline">
                  {auditLogs.slice(0, 10).map((log) => (
                    <tr key={log.id} className="hover:bg-subdued/50">
                      <td className="px-4 py-3 font-mono text-xs text-body-muted">{formatDateTime(log.timestamp)}</td>
                      <td className="px-4 py-3 text-body-muted">{log.userName || log.userId || log.actorId}</td>
                      <td className="px-4 py-3 font-medium text-ink">{log.action}</td>
                      <td className="px-4 py-3 text-body-muted">{log.details || log.detail}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function formatDateTime(value) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}
