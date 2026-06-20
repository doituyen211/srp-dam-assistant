"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { LoadingState } from "@/components/ui/LoadingState";
import { getAcademicUnits, addAcademicUnit, deleteAcademicUnit } from "@/lib/tenant";

export default function TenantUnitsPage() {
  const params = useParams();
  const tenantId = params?.id;
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const load = () => getAcademicUnits().then(setUnits).catch(() => {}).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const handleAdd = async () => {
    if (!newName.trim()) return;
    setError(""); setMessage("");
    try { await addAcademicUnit(tenantId, { name: newName.trim() }); setNewName(""); setMessage("Unit added."); load(); }
    catch (err) { setError(err.message || "Failed."); }
  };

  const handleDelete = async (unitId) => {
    try { await deleteAcademicUnit(tenantId, unitId); setMessage("Unit removed."); load(); }
    catch (err) { setError(err.message || "Failed."); }
  };

  if (loading) return <LoadingState />;
  return (
    <div className="max-w-2xl space-y-6">
      <Link href={`/super-admin/tenants/${tenantId}`} className="text-sm text-body-muted hover:text-ink">← Back to tenant</Link>
      <h1 className="text-2xl font-semibold text-ink">Academic Units</h1>
      {message && <Alert type="success" closable>{message}</Alert>}
      {error && <Alert type="error">{error}</Alert>}
      <Card>
        <CardHeader><CardTitle>Add Unit</CardTitle></CardHeader>
        <CardContent className="flex gap-3">
          <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g. Faculty of Information Technology" />
          <Button onClick={handleAdd} className="flex-shrink-0">Add</Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Academic Units</CardTitle></CardHeader>
        <CardContent>{units.length === 0 ? <p className="text-sm text-muted">No units defined.</p> : (
          <div className="space-y-2">{units.map((u) => (
            <div key={u.id} className="flex items-center justify-between rounded border border-hairline px-4 py-3">
              <span className="text-sm text-ink">{u.name}</span>
              <button onClick={() => handleDelete(u.id)} className="text-xs text-danger hover:underline">Remove</button>
            </div>
          ))}</div>
        )}</CardContent>
      </Card>
    </div>
  );
}
