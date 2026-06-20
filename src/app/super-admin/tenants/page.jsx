"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { LoadingState } from "@/components/ui/LoadingState";
import { listTenants } from "@/lib/tenant";

export default function TenantListPage() {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listTenants().then(setTenants).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingState variant="dashboard" />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted">Super Admin</p>
          <h1 className="mt-2 text-2xl font-semibold text-ink">Tenants</h1>
        </div>
        <Link href="/super-admin/tenants/create" className="rounded bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-light">+ Create Tenant</Link>
      </div>

      <Card>
        <CardContent className="p-0">
          {tenants.length === 0 ? (
            <div className="px-6 py-14 text-center">
              <p className="text-sm text-body-muted">No tenants yet.</p>
              <Link href="/super-admin/tenants/create" className="mt-4 inline-flex rounded bg-primary px-5 py-2.5 text-sm font-medium text-white">Create First Tenant</Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] border-collapse text-sm">
                <thead className="bg-subdued">
                  <tr>
                    <th className="px-4 py-3 text-left font-mono text-[11px] uppercase tracking-[0.08em] text-muted">Name</th>
                    <th className="px-4 py-3 text-left font-mono text-[11px] uppercase tracking-[0.08em] text-muted">Domain</th>
                    <th className="px-4 py-3 text-left font-mono text-[11px] uppercase tracking-[0.08em] text-muted">Plan</th>
                    <th className="px-4 py-3 text-left font-mono text-[11px] uppercase tracking-[0.08em] text-muted">Users</th>
                    <th className="px-4 py-3 text-left font-mono text-[11px] uppercase tracking-[0.08em] text-muted">Status</th>
                    <th className="px-4 py-3 text-left font-mono text-[11px] uppercase tracking-[0.08em] text-muted">Created</th>
                    <th className="px-4 py-3 text-right font-mono text-[11px] uppercase tracking-[0.08em] text-muted">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-hairline">
                  {tenants.map((t) => (
                    <tr key={t.id} className="hover:bg-subdued/50">
                      <td className="px-4 py-3 font-medium text-ink">{t.name || t.display_name}</td>
                      <td className="px-4 py-3 text-body-muted font-mono text-xs">{t.domain || "—"}</td>
                      <td className="px-4 py-3"><span className="rounded bg-info-bg px-2 py-0.5 text-xs font-medium text-info">{t.subscription_tier || t.subscriptionTier || "free"}</span></td>
                      <td className="px-4 py-3 text-body-muted">{t.user_count || t.userCount || 0}</td>
                      <td className="px-4 py-3"><span className={`rounded px-2 py-0.5 text-xs font-medium ${(t.status || "active") === "active" ? "bg-success-bg text-success" : "bg-danger-bg text-danger"}`}>{t.status || "active"}</span></td>
                      <td className="px-4 py-3 text-body-muted text-xs">{t.created_at ? new Date(t.created_at).toLocaleDateString() : "—"}</td>
                      <td className="px-4 py-3 text-right"><Link href={`/super-admin/tenants/${t.id}`} className="text-sm text-primary hover:underline">Manage →</Link></td>
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
