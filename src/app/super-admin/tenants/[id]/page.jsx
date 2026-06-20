"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { LoadingState } from "@/components/ui/LoadingState";
import { getTenantById, updateTenant } from "@/lib/tenant";
import { TENANT_STATUSES } from "@/lib/constants";

export default function TenantDetailPage() {
  const params = useParams();
  const tenantId = params?.id;
  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({ name: "", subscription_tier: "free", status: "active" });

  useEffect(() => {
    if (!tenantId) return;
    getTenantById(tenantId).then((data) => {
      setTenant(data);
      setForm({ name: data.name || data.display_name || "", subscription_tier: data.subscription_tier || data.subscriptionTier || "free", status: data.status || "active" });
    }).catch(() => setError("Failed to load tenant.")).finally(() => setLoading(false));
  }, [tenantId]);

  const handleSave = async () => {
    setSaving(true); setError(""); setMessage("");
    try {
      await updateTenant(tenantId, form);
      setMessage("Tenant updated.");
    } catch (err) {
      setError(err.message || "Failed to update.");
    } finally { setSaving(false); }
  };

  if (loading) return <LoadingState variant="dashboard" />;

  return (
    <div className="max-w-2xl space-y-6">
      <Link href="/super-admin/tenants" className="text-sm text-body-muted hover:text-ink">← Back to tenants</Link>
      <h1 className="text-2xl font-semibold text-ink">{tenant?.name || tenant?.display_name || "Tenant"}</h1>

      {message && <Alert type="success" closable>{message}</Alert>}
      {error && <Alert type="error">{error}</Alert>}

      <div className="grid gap-6 md:grid-cols-3">
        <Card><CardContent className="p-4"><p className="font-mono text-[10px] uppercase text-muted">Domain</p><p className="mt-1 text-sm font-medium text-ink">{tenant?.domain || "—"}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="font-mono text-[10px] uppercase text-muted">Users</p><p className="mt-1 text-sm font-medium text-ink">{tenant?.user_count || tenant?.userCount || 0}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="font-mono text-[10px] uppercase text-muted">Created</p><p className="mt-1 text-sm font-medium text-ink">{tenant?.created_at ? new Date(tenant.created_at).toLocaleDateString() : "—"}</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Settings</CardTitle></CardHeader>
        <CardContent className="space-y-5">
          <Input label="Tenant name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} disabled={saving} />
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-ink">Subscription Tier</label>
            <select value={form.subscription_tier} onChange={(e) => setForm((p) => ({ ...p, subscription_tier: e.target.value }))} disabled={saving} className="min-h-[44px] w-full rounded border border-hairline bg-canvas px-4 py-2.5 text-base text-ink">
              <option value="annual">Annual</option>
              <option value="trial">Trial</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-ink">Status</label>
            <select value={form.status} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))} disabled={saving} className="min-h-[44px] w-full rounded border border-hairline bg-canvas px-4 py-2.5 text-base text-ink">
              {TENANT_STATUSES.map((s) => (<option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>))}
            </select>
          </div>
          <Button onClick={handleSave} loading={saving} disabled={saving}>Save Changes</Button>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Link href={`/super-admin/tenants/${tenantId}/domains`} className="rounded border border-hairline px-4 py-2 text-sm text-ink hover:bg-subdued">Manage Domains</Link>
        <Link href={`/super-admin/tenants/${tenantId}/units`} className="rounded border border-hairline px-4 py-2 text-sm text-ink hover:bg-subdued">Academic Units</Link>
      </div>
    </div>
  );
}
