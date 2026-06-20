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
import { mockUsers } from "@/lib/mockData";

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
        if (propData.status === "fulfilled")
          setProposals(Array.isArray(propData.value) ? propData.value : []);
        if (logs.status === "fulfilled")
          setAuditLogs(Array.isArray(logs.value) ? logs.value : []);
      } catch {
        if (!mounted) return;
        setError("Unable to load admin data.");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const kpiProps = useMemo(() => {
    if (!overview) return {};
    const stageCounts = overview.proposalsByStage || {};
    return {
      totalProposals: overview.totalProposals || 0,
      pendingReview:
        (stageCounts.submitted || 0) + (stageCounts.under_review || 0),
      needsRevision: stageCounts.needs_revision || 0,
      pendingSupervisor: stageCounts.approved || 0,
      overdueMilestones: overview.overdueMilestones || 0,
      lecturerCapacityRisk: overview.lecturerCapacity?.filter(
        (l) => l.currentLoad >= l.maxLoad,
      ).length || 0,
    };
  }, [overview]);

  const userOverview = useMemo(
    () =>
      Object.values(USER_ROLES).map((role) => ({
        role,
        label:
          { student: "Students", reviewer: "Reviewers", admin: "Admins", lecturer: "Lecturers" }[
            role
          ] || role,
        count: mockUsers.filter((u) => u.role === role).length,
      })),
    [],
  );

  if (loading) {
    return <LoadingState variant="dashboard" />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-primary bg-primary text-white">
        <CardContent className="p-6 md:p-8">
          <div className="space-y-3">
            <div className="inline-flex rounded border border-white/15 bg-white/[0.06] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-white/60">
              Research Office — Operations Dashboard
            </div>
            <h1 className="text-2xl font-semibold leading-tight md:text-3xl">
              Research Proposal Operations
            </h1>
            <p className="max-w-3xl text-sm leading-6 text-white/65">
              Monitor the full academic workflow pipeline — from draft
              submission through completion. AI provides operational insights;
              all assignments and decisions require human authorization.
            </p>
          </div>
        </CardContent>
      </Card>

      {error && <Alert type="error">{error}</Alert>}

      {/* KPI cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <AdminKpiCard
          label="Total Proposals"
          value={kpiProps.totalProposals}
          subtitle="All time"
        />
        <AdminKpiCard
          label="Pending Review"
          value={kpiProps.pendingReview}
          subtitle="Awaiting reviewer"
          accent="info"
        />
        <AdminKpiCard
          label="Need Revision"
          value={kpiProps.needsRevision}
          subtitle="Waiting on student"
          accent="warning"
        />
        <AdminKpiCard
          label="Pending Supervisor"
          value={kpiProps.pendingSupervisor}
          subtitle="Approved, unassigned"
          accent="info"
        />
        <AdminKpiCard
          label="Overdue Milestones"
          value={kpiProps.overdueMilestones}
          subtitle="Past deadline"
          accent="danger"
        />
        <AdminKpiCard
          label="Lecturer Risk"
          value={kpiProps.lecturerCapacityRisk}
          subtitle="At full capacity"
          accent="danger"
        />
      </div>

      {/* User overview */}
      <div className="grid gap-4 sm:grid-cols-4">
        {userOverview.map((item) => (
          <Card key={item.role}>
            <CardContent className="p-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted">
                {item.label}
              </p>
              <p className="mt-1.5 text-2xl font-semibold text-ink">
                {item.count}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Workflow Pipeline + Bottlenecks */}
      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <Card>
          <CardHeader>
            <CardTitle>Workflow Pipeline</CardTitle>
            <p className="mt-1 text-sm text-body-muted">
              Proposal count by academic workflow stage
            </p>
          </CardHeader>
          <CardContent>
            <WorkflowPipeline counts={overview?.proposalsByStage || {}} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bottlenecks &amp; Risks</CardTitle>
            <p className="mt-1 text-sm text-body-muted">
              Stages requiring administrative attention
            </p>
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
            <p className="mt-1 text-sm text-body-muted">
              Proposals requiring admin or reviewer action
            </p>
          </CardHeader>
          <CardContent>
            <PendingDecisionQueue proposals={proposals} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Lecturer Capacity</CardTitle>
            <p className="mt-1 text-sm text-body-muted">
              Supervision load and availability
            </p>
          </CardHeader>
          <CardContent>
            <LecturerCapacityTable
              lecturers={overview?.lecturerCapacity || []}
            />
          </CardContent>
        </Card>
      </div>

      {/* Configuration entry points */}
      <Card>
        <CardHeader>
          <CardTitle>Academic Configuration</CardTitle>
          <p className="mt-1 text-sm text-body-muted">
            Manage templates, rubrics, and workflow settings
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-4">
            <Link
              href="#"
              className="block rounded border border-hairline bg-canvas p-4 transition-colors hover:bg-subdued"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded bg-info-bg text-info">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="mt-3 text-sm font-medium text-ink">
                Proposal Templates
              </p>
              <p className="mt-1 text-xs text-body-muted">
                Manage section templates and guidance
              </p>
            </Link>

            <Link
              href="#"
              className="block rounded border border-hairline bg-canvas p-4 transition-colors hover:bg-subdued"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded bg-success-bg text-success">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <p className="mt-3 text-sm font-medium text-ink">
                Review Rubrics
              </p>
              <p className="mt-1 text-xs text-body-muted">
              Configure assessment criteria and scoring
              </p>
            </Link>

            <Link
              href="#"
              className="block rounded border border-hairline bg-canvas p-4 transition-colors hover:bg-subdued"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded bg-warning-bg text-warning">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </div>
              <p className="mt-3 text-sm font-medium text-ink">
                Workflow Stages
              </p>
              <p className="mt-1 text-xs text-body-muted">
                Define stage transitions and approvals
              </p>
            </Link>

            <Link
              href="#"
              className="block rounded border border-hairline bg-canvas p-4 transition-colors hover:bg-subdued"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded bg-purple/10 text-purple">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <p className="mt-3 text-sm font-medium text-ink">
                Matching Criteria
              </p>
              <p className="mt-1 text-xs text-body-muted">
                Configure supervisor matching weights
              </p>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Audit Log */}
      <Card>
        <CardHeader>
          <CardTitle>System Audit Log</CardTitle>
          <p className="mt-1 text-sm text-body-muted">
            Recent events recorded in the system
          </p>
        </CardHeader>
        <CardContent>
          {auditLogs.length === 0 ? (
            <EmptyState
              title="No audit events yet"
              description="Events will appear as users interact with the system."
            />
          ) : (
            <div className="overflow-x-auto rounded border border-hairline bg-canvas">
              <table className="w-full min-w-[640px] border-collapse text-sm">
                <thead className="bg-subdued">
                  <tr>
                    <th className="px-4 py-3 text-left font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-muted">
                      Time
                    </th>
                    <th className="px-4 py-3 text-left font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-muted">
                      User
                    </th>
                    <th className="px-4 py-3 text-left font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-muted">
                      Action
                    </th>
                    <th className="px-4 py-3 text-left font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-muted">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-muted">
                      Details
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-hairline">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-subdued/50">
                      <td className="px-4 py-3 font-mono text-xs text-body-muted">
                        {formatDateTime(log.timestamp)}
                      </td>
                      <td className="px-4 py-3 text-body-muted">
                        {log.userName || log.userId}
                      </td>
                      <td className="px-4 py-3 font-medium text-ink">
                        {log.action}
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          intent={
                            log.status === "success" ? "success" : "warning"
                          }
                        >
                          {log.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-body-muted">
                        {log.details}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Invite Team Members */}
      <InviteTeamSection />
    </div>
  );
}

function InviteTeamSection() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("reviewer");
  const [invites, setInvites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const { listInvites } = require ? {} : { listInvites: async () => [] };
    import("@/lib/tenant").then((mod) => mod.listInvites().then(setInvites).catch(() => {})).catch(() => {});
  }, []);

  const handleSend = async () => {
    if (!email.trim()) { setError("Email is required."); return; }
    setLoading(true); setError(""); setMessage("");
    try {
      const { createInvite } = await import("@/lib/tenant");
      await createInvite(null, email.trim(), role);
      setMessage(`Invite sent to ${email.trim()}.`);
      setEmail("");
      const { listInvites } = await import("@/lib/tenant");
      listInvites().then(setInvites).catch(() => {});
    } catch (err) {
      setError(err.message || "Failed to send invite.");
    } finally { setLoading(false); }
  };

  const handleCancel = async (inviteId) => {
    try {
      const { cancelInvite } = await import("@/lib/tenant");
      await cancelInvite(inviteId);
      setInvites((prev) => prev.filter((i) => i.id !== inviteId));
    } catch (err) {
      setError(err.message || "Failed to cancel.");
    }
  };

  return (
    <Card>
      <CardHeader><CardTitle>Invite Team Members</CardTitle></CardHeader>
      <CardContent className="space-y-5">
        {message && <Alert type="success" closable>{message}</Alert>}
        {error && <Alert type="error">{error}</Alert>}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@university.edu"
              disabled={loading}
              className="min-h-[44px] w-full rounded border border-hairline bg-canvas px-4 py-2.5 text-base text-ink outline-none focus:border-primary/40 focus:ring-4 focus:ring-primary/10"
            />
          </div>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            disabled={loading}
            className="min-h-[44px] rounded border border-hairline bg-canvas px-4 text-sm text-ink"
          >
            <option value="reviewer">Reviewer</option>
            <option value="lecturer">Lecturer</option>
            <option value="admin">Admin</option>
          </select>
          <Button onClick={handleSend} loading={loading} disabled={loading} className="flex-shrink-0">Send Invite</Button>
        </div>

        <div>
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.08em] text-muted">Pending Invites</p>
          {invites.length === 0 ? (
            <p className="text-sm text-muted">No pending invites.</p>
          ) : (
            <div className="space-y-2">
              {invites.map((inv) => (
                <div key={inv.id} className="flex items-center justify-between rounded border border-hairline px-4 py-3">
                  <div>
                    <p className="text-sm text-ink">{inv.email}</p>
                    <p className="text-xs text-body-muted">{inv.role} · Sent {inv.created_at ? new Date(inv.created_at).toLocaleDateString() : "recently"}</p>
                  </div>
                  <button onClick={() => handleCancel(inv.id)} className="text-xs text-danger hover:underline">Cancel</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
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
