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
import { Badge } from "@/components/ui/Badge";
import { AdminKpiCard } from "@/components/admin/AdminKpiCard";
import { WorkflowPipeline } from "@/components/admin/WorkflowPipeline";
import { BottleneckTable } from "@/components/admin/BottleneckTable";
import { PendingDecisionQueue } from "@/components/admin/PendingDecisionQueue";
import { LecturerCapacityTable } from "@/components/admin/LecturerCapacityTable";
import { api } from "@/lib/api";
import { USER_ROLES } from "@/lib/constants";

const formatDateTime = (value) => {
  if (!value) return "";
  return new Intl.DateTimeFormat("en-US", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(value));
};

function AdminPageContent() {
  const [overview, setOverview] = useState(null);
  const [proposals, setProposals] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError("");
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
        if (!mounted) return;
        setError("Unable to load admin data.");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  const kpiProps = useMemo(() => {
    if (!overview) return {};
    const stageCounts = overview.proposalsByStage || overview.proposals_by_stage || overview.countsByStage || {};
    return {
      totalProposals: overview.totalProposals || overview.total_proposals || 0,
      pendingReview: (stageCounts.submitted || 0) + (stageCounts.under_review || 0) + (overview.pendingReviews || overview.pending_reviews || overview.awaitingReview || 0),
      needsRevision: stageCounts.needs_revision || 0,
      pendingSupervisor: stageCounts.approved || 0,
      overdueMilestones: overview.overdueMilestones || overview.overdue_milestones || 0,
      lecturerCapacityRisk: (overview.lecturerCapacity || overview.lecturer_capacity || []).filter((l) => (l.currentLoad || l.current_load || 0) >= (l.maxLoad || l.max_load || 3)).length,
    };
  }, [overview]);

  if (loading) return <LoadingState variant="dashboard" />;

  return (
    <div className="space-y-6">
      <Card className="border-primary bg-primary text-white">
        <CardContent className="p-6 md:p-8">
          <div className="space-y-3">
            <div className="inline-flex rounded border border-white/15 bg-white/[0.06] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-white/60">
              Research Office — Operations Dashboard
            </div>
            <h1 className="text-2xl font-semibold leading-tight md:text-3xl">Manage Research Proposals</h1>
            <p className="max-w-3xl text-sm leading-6 text-white/65">Track the entire academic workflow — from draft submission to completion.</p>
          </div>
        </CardContent>
      </Card>

      {error && <Alert type="error">{error}</Alert>}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <AdminKpiCard label="Total proposals" value={kpiProps.totalProposals} subtitle="All" />
        <AdminKpiCard label="Awaiting review" value={kpiProps.pendingReview} subtitle="Pending" accent="info" />
        <AdminKpiCard label="Needs revision" value={kpiProps.needsRevision} subtitle="Awaiting student" accent="warning" />
        <AdminKpiCard label="Pending assignment" value={kpiProps.pendingSupervisor} subtitle="Approved" accent="info" />
        <AdminKpiCard label="Overdue milestones" value={kpiProps.overdueMilestones} subtitle="Past deadline" accent="danger" />
        <AdminKpiCard label="Lecturer risk" value={kpiProps.lecturerCapacityRisk} subtitle="At full capacity" accent="danger" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <Card>
          <CardHeader>
            <CardTitle>Workflow</CardTitle>
            <p className="mt-1 text-sm text-body-muted">Number of proposals by stage</p>
          </CardHeader>
          <CardContent>
            <WorkflowPipeline counts={overview?.proposalsByStage || overview?.proposals_by_stage || overview?.countsByStage || {}} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bottlenecks & Risks</CardTitle>
            <p className="mt-1 text-sm text-body-muted">Stages requiring attention</p>
          </CardHeader>
          <CardContent>
            <BottleneckTable bottlenecks={overview?.bottlenecks || []} />
          </CardContent>
        </Card>
      </div>

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

      <Card>
        <CardHeader>
          <CardTitle>System Log</CardTitle>
          <p className="mt-1 text-sm text-body-muted">Recent events</p>
        </CardHeader>
        <CardContent>
          {auditLogs.length === 0 ? (
            <EmptyState title="No events yet" description="Events will appear as users interact with the system." />
          ) : (
            <div className="overflow-x-auto rounded border border-hairline bg-canvas">
              <table className="w-full min-w-[640px] border-collapse text-sm">
                <thead className="bg-subdued">
                  <tr>
                    <th className="px-4 py-3 text-left font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-muted">Time</th>
                    <th className="px-4 py-3 text-left font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-muted">User</th>
                    <th className="px-4 py-3 text-left font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-muted">Action</th>
                    <th className="px-4 py-3 text-left font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-muted">Status</th>
                    <th className="px-4 py-3 text-left font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-muted">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-hairline">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-subdued/50">
                      <td className="px-4 py-3 font-mono text-xs text-body-muted">{formatDateTime(log.timestamp)}</td>
                      <td className="px-4 py-3 text-body-muted">{log.userName || log.userName || log.userId || log.actorId}</td>
                      <td className="px-4 py-3 font-medium text-ink">{log.action}</td>
                      <td className="px-4 py-3">
                        <Badge intent={log.status === "success" ? "success" : "warning"}>{log.status}</Badge>
                      </td>
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

export default function AdminPage() {
  return (
    <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
      <AppShell>
        <AdminPageContent />
      </AppShell>
    </ProtectedRoute>
  );
}
