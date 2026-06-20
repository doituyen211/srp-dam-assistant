"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { LoadingState } from "@/components/ui/LoadingState";
import { listTenants } from "@/lib/tenant";
import { SUBSCRIPTION_TIERS } from "@/lib/constants";

export default function SuperAdminOverview() {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listTenants().then(setTenants).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingState variant="dashboard" />;

  const totalUsers = tenants.reduce((s, t) => s + (t.user_count || t.userCount || 0), 0);
  const activeTenants = tenants.filter((t) => (t.status || "active") === "active").length;
  const tierCounts = {};
  tenants.forEach((t) => {
    const tier = t.subscription_tier || t.subscriptionTier || "free";
    tierCounts[tier] = (tierCounts[tier] || 0) + 1;
  });

  return (
    <div className="space-y-6">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted">Super Admin</p>
        <h1 className="mt-2 text-2xl font-semibold text-ink">Platform Overview</h1>
        <p className="mt-1 text-sm text-body-muted">System-wide statistics and tenant management.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card><CardContent className="p-4"><p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted">Total Tenants</p><p className="mt-1.5 text-2xl font-semibold text-ink">{tenants.length}</p></CardContent></Card>
        <Card accent="success"><CardContent className="p-4"><p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted">Active</p><p className="mt-1.5 text-2xl font-semibold text-success">{activeTenants}</p></CardContent></Card>
        <Card accent="info"><CardContent className="p-4"><p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted">Total Users</p><p className="mt-1.5 text-2xl font-semibold text-ink">{totalUsers}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted">Tiers</p><p className="mt-1.5 text-sm text-ink">{Object.entries(tierCounts).map(([k, v]) => `${k}: ${v}`).join(", ")}</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader className="flex items-center justify-between">
          <div><CardTitle>All Tenants</CardTitle><p className="mt-1 text-sm text-body-muted">{tenants.length} registered tenants</p></div>
          <Link href="/super-admin/tenants/create" className="rounded bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-light">+ New Tenant</Link>
        </CardHeader>
        <CardContent className="p-0">
          {tenants.length === 0 ? (
            <div className="px-6 py-8 text-center text-sm text-body-muted">No tenants registered yet. Create your first tenant to get started.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] border-collapse text-sm">
                <thead className="bg-subdued">
                  <tr>
                    <th className="px-4 py-3 text-left font-mono text-[11px] uppercase tracking-[0.08em] text-muted">Tenant</th>
                    <th className="px-4 py-3 text-left font-mono text-[11px] uppercase tracking-[0.08em] text-muted">Domain</th>
                    <th className="px-4 py-3 text-left font-mono text-[11px] uppercase tracking-[0.08em] text-muted">Plan</th>
                    <th className="px-4 py-3 text-left font-mono text-[11px] uppercase tracking-[0.08em] text-muted">Users</th>
                    <th className="px-4 py-3 text-left font-mono text-[11px] uppercase tracking-[0.08em] text-muted">Status</th>
                    <th className="px-4 py-3 text-right font-mono text-[11px] uppercase tracking-[0.08em] text-muted">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-hairline">
                  {tenants.map((t) => (
                    <tr key={t.id} className="hover:bg-subdued/50">
                      <td className="px-4 py-3 font-medium text-ink">{t.name || t.display_name}</td>
                      <td className="px-4 py-3 text-body-muted">{t.domain || "—"}</td>
                      <td className="px-4 py-3 text-body-muted">{t.subscription_tier || t.subscriptionTier || "free"}</td>
                      <td className="px-4 py-3 text-body-muted">{t.user_count || t.userCount || 0}</td>
                      <td className="px-4 py-3"><span className={`rounded px-2 py-0.5 text-xs font-medium ${(t.status || "active") === "active" ? "bg-success-bg text-success" : "bg-danger-bg text-danger"}`}>{t.status || "active"}</span></td>
                      <td className="px-4 py-3 text-right"><Link href={`/super-admin/tenants/${t.id}`} className="text-sm text-primary hover:underline">Manage</Link></td>
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
