"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DashboardCard } from "./DashboardCard";
import { ActionCard } from "./ActionCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingState } from "@/components/ui/LoadingState";
import { api } from "@/lib/api";

/**
 * SuperAdminDashboard - Platform management dashboard
 * Shows: Platform Overview, University Count, Active Subscriptions, Recent Activity
 */
export function SuperAdminDashboard({ user }) {
  const [overview, setOverview] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const [ov, logs] = await Promise.allSettled([
          api.getAdminOverview(),
          api.getAuditLogs(),
        ]);
        if (!mounted) return;
        if (ov.status === "fulfilled") setOverview(ov.value);
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-ink">Platform Dashboard</h1>
        <p className="mt-1 text-sm text-body-muted">Overview of the entire research management platform.</p>
      </div>

      {/* Quick action cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <ActionCard
          title="Manage Universities"
          description="View and manage university accounts and configurations."
          href="/admin/universities"
          ctaText="Manage"
          accent="primary"
          icon="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342"
        />

        <ActionCard
          title="Manage Subscriptions"
          description="View and manage platform subscriptions and billing."
          href="/admin/subscriptions"
          ctaText="Manage"
          accent="info"
          icon="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
        />

        <ActionCard
          title="Platform Settings"
          description="Configure platform-wide settings and policies."
          href="/admin/settings"
          ctaText="Configure"
          icon="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.213-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.729 6.729 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.213-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.12c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.213.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828c-.424-.35-.534-.954-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.213.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
        />
      </div>

      {/* Platform stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardCard title="Total Proposals" value={overview?.totalProposals || 0} subtitle="Across all universities" />
        <DashboardCard title="Active Users" value={overview?.activeUsers || "—"} subtitle="Registered users" accent="info" />
        <DashboardCard title="Universities" value={overview?.universityCount || "—"} subtitle="Active institutions" accent="success" />
        <DashboardCard title="Pending Reviews" value={overview?.pendingReviews || 0} subtitle="Awaiting action" accent="warning" />
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Platform Activity</CardTitle>
          <p className="mt-1 text-sm text-body-muted">Latest events across all universities</p>
        </CardHeader>
        <CardContent>
          {auditLogs.length === 0 ? (
            <EmptyState title="No recent activity" description="Events will appear as users interact with the platform." />
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
