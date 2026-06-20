"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { LoadingState } from "@/components/ui/LoadingState";
import { getTenantDomains, addTenantDomain, deleteTenantDomain } from "@/lib/tenant";

export default function TenantDomainsPage() {
  const params = useParams();
  const tenantId = params?.id;
  const [domains, setDomains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newDomain, setNewDomain] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const load = () => getTenantDomains().then(setDomains).catch(() => {}).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const handleAdd = async () => {
    if (!newDomain.trim()) return;
    setError(""); setMessage("");
    try { await addTenantDomain(tenantId, newDomain.trim()); setNewDomain(""); setMessage("Domain added."); load(); }
    catch (err) { setError(err.message || "Failed."); }
  };

  const handleDelete = async (domainId) => {
    try { await deleteTenantDomain(tenantId, domainId); setMessage("Domain removed."); load(); }
    catch (err) { setError(err.message || "Failed."); }
  };

  if (loading) return <LoadingState />;
  return (
    <div className="max-w-2xl space-y-6">
      <Link href={`/super-admin/tenants/${tenantId}`} className="text-sm text-body-muted hover:text-ink">← Back to tenant</Link>
      <h1 className="text-2xl font-semibold text-ink">Manage Domains</h1>
      {message && <Alert type="success" closable>{message}</Alert>}
      {error && <Alert type="error">{error}</Alert>}
      <Card>
        <CardHeader><CardTitle>Add Domain</CardTitle></CardHeader>
        <CardContent className="flex gap-3">
          <Input value={newDomain} onChange={(e) => setNewDomain(e.target.value)} placeholder="e.g. hus.edu.vn" />
          <Button onClick={handleAdd} className="flex-shrink-0">Add</Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Registered Domains</CardTitle></CardHeader>
        <CardContent>{domains.length === 0 ? <p className="text-sm text-muted">No domains registered.</p> : (
          <div className="space-y-2">{domains.map((d) => (
            <div key={d.id} className="flex items-center justify-between rounded border border-hairline px-4 py-3">
              <span className="text-sm text-ink">{d.domain}</span>
              <button onClick={() => handleDelete(d.id)} className="text-xs text-danger hover:underline">Remove</button>
            </div>
          ))}</div>
        )}</CardContent>
      </Card>
    </div>
  );
}
