"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { LoadingState } from "@/components/ui/LoadingState";
import { api } from "@/lib/api";

function formatLimit(val) {
  if (val === -1) return "∞ Unlimited";
  return val.toLocaleString();
}

function EmptyRow({ onSave, onCancel }) {
  const [name, setName] = useState("");
  const [users, setUsers] = useState("");
  const [props, setProps] = useState("");
  const [setup, setSetup] = useState("");
  const [annual, setAnnual] = useState("");

  return (
    <tr className="bg-info-bg/20">
      <td className="px-4 py-2"><input value={name} onChange={(e) => setName(e.target.value)} placeholder="Plan name" className="w-full rounded border border-hairline px-2 py-1 text-sm" /></td>
      <td className="px-4 py-2"><input type="number" value={users} onChange={(e) => setUsers(e.target.value)} placeholder="e.g. 500" className="w-24 rounded border border-hairline px-2 py-1 text-sm" /></td>
      <td className="px-4 py-2"><input type="number" value={props} onChange={(e) => setProps(e.target.value)} placeholder="e.g. 100" className="w-24 rounded border border-hairline px-2 py-1 text-sm" /></td>
      <td className="px-4 py-2"><input type="number" value={setup} onChange={(e) => setSetup(e.target.value)} placeholder="e.g. 2000" className="w-24 rounded border border-hairline px-2 py-1 text-sm" /></td>
      <td className="px-4 py-2"><input type="number" value={annual} onChange={(e) => setAnnual(e.target.value)} placeholder="e.g. 1500" className="w-24 rounded border border-hairline px-2 py-1 text-sm" /></td>
      <td className="px-4 py-2">
        <Button variant="primary" className="text-xs px-3 py-1" onClick={() => onSave({ name, max_users: Number(users), max_proposals: Number(props), setup_fee: Number(setup), annual_license: Number(annual) })}>Save</Button>
        <button onClick={onCancel} className="ml-2 text-xs text-body-muted hover:text-ink">Cancel</button>
      </td>
    </tr>
  );
}

function EditableRow({ plan, onSave }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(plan.name);
  const [users, setUsers] = useState(String(plan.max_users));
  const [props, setProps] = useState(String(plan.max_proposals));
  const [setup, setSetup] = useState(String(plan.setup_fee));
  const [annual, setAnnual] = useState(String(plan.annual_license));

  if (!editing) {
    return (
      <tr className="hover:bg-subdued/50 border-b border-hairline">
        <td className="px-4 py-3 font-medium text-ink">{plan.name}</td>
        <td className="px-4 py-3 text-sm text-body-muted">{formatLimit(plan.max_users)}</td>
        <td className="px-4 py-3 text-sm text-body-muted">{formatLimit(plan.max_proposals)}</td>
        <td className="px-4 py-3 text-sm text-body-muted">${plan.setup_fee.toLocaleString()}</td>
        <td className="px-4 py-3 text-sm text-body-muted">${plan.annual_license.toLocaleString()}/yr</td>
        <td className="px-4 py-3">{plan.featured ? <span className="text-xs text-success font-medium">Featured</span> : <span className="text-xs text-muted">—</span>}</td>
        <td className="px-4 py-3">
          <button onClick={() => setEditing(true)} className="text-xs text-primary hover:underline mr-3">Edit</button>
        </td>
      </tr>
    );
  }

  return (
    <tr className="bg-subdued/50 border-b border-hairline">
      <td className="px-4 py-2"><input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded border border-hairline px-2 py-1 text-sm" /></td>
      <td className="px-4 py-2"><input type="number" value={users} onChange={(e) => setUsers(e.target.value)} className="w-24 rounded border border-hairline px-2 py-1 text-sm" /></td>
      <td className="px-4 py-2"><input type="number" value={props} onChange={(e) => setProps(e.target.value)} className="w-24 rounded border border-hairline px-2 py-1 text-sm" /></td>
      <td className="px-4 py-2"><input type="number" value={setup} onChange={(e) => setSetup(e.target.value)} className="w-24 rounded border border-hairline px-2 py-1 text-sm" /></td>
      <td className="px-4 py-2"><input type="number" value={annual} onChange={(e) => setAnnual(e.target.value)} className="w-24 rounded border border-hairline px-2 py-1 text-sm" /></td>
      <td className="px-4 py-2">
        <Button variant="primary" className="text-xs px-3 py-1" onClick={() => { onSave(plan.id, { name, max_users: Number(users), max_proposals: Number(props), setup_fee: Number(setup), annual_license: Number(annual) }); setEditing(false); }}>Save</Button>
        <button onClick={() => setEditing(false)} className="ml-2 text-xs text-body-muted hover:text-ink">Cancel</button>
      </td>
    </tr>
  );
}

export default function AdminSubscriptionsPage() {
  const [plans, setPlans] = useState([]);
  const [llm, setLlm] = useState({ byok_price: 0, platform_price: 0.50 });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [adding, setAdding] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadPlans = () => api.getPricingPlans().then(setPlans).catch(() => {}).finally(() => setLoading(false));
  const loadLlm = () => api.getLlmPricing().then(setLlm).catch(() => {});

  useEffect(() => { loadPlans(); loadLlm(); }, []);

  const handleUpdate = async (id, payload) => {
    setSaving(true); setError(""); setMessage("");
    try { await api.updatePricingPlan(id, payload); setMessage("Plan updated."); loadPlans(); }
    catch (err) { setError(err.message || "Failed."); } finally { setSaving(false); }
  };

  const handleCreate = async (payload) => {
    if (!payload.name) { setError("Plan name is required."); return; }
    setSaving(true); setError(""); setMessage("");
    try { await api.createPricingPlan(payload); setMessage("Plan created."); setAdding(false); loadPlans(); }
    catch (err) { setError(err.message || "Failed."); } finally { setSaving(false); }
  };

  const handleDelete = async (planId) => {
    const remaining = plans.filter((p) => p.id !== planId);
    if (remaining.length === 0) { setError("Cannot delete the last plan. At least one plan must exist."); return; }
    if (!confirm("Are you sure you want to delete this plan? It will be soft-deleted.")) return;
    setSaving(true); setError(""); setMessage("");
    try { await api.deletePricingPlan(planId); setMessage("Plan deleted."); loadPlans(); }
    catch (err) { setError(err.message || "Failed."); } finally { setSaving(false); }
  };

  const handleSaveLlm = async () => {
    setSaving(true); setError(""); setMessage("");
    try { await api.updateLlmPricing(llm); setMessage("LLM pricing saved."); }
    catch (err) { setError(err.message || "Failed."); } finally { setSaving(false); }
  };

  if (loading) return <LoadingState variant="dashboard" />;

  return (
    <div className="max-w-5xl space-y-6">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted">Super Admin</p>
        <h1 className="mt-2 text-2xl font-semibold text-ink">Pricing Configuration</h1>
        <p className="mt-1 text-sm text-body-muted">Manage pricing plans and LLM API options. Changes reflect immediately on the public /pricing page.</p>
      </div>

      {message && <Alert type="success" closable>{message}</Alert>}
      {error && <Alert type="error">{error}</Alert>}

      <Card>
        <CardHeader className="flex items-center justify-between">
          <div><CardTitle>Pricing Plans</CardTitle><p className="mt-1 text-sm text-body-muted">{plans.length} plan(s) active</p></div>
          <Button variant="secondary" className="text-xs" onClick={() => setAdding(true)} disabled={adding}>+ Add Plan</Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] border-collapse text-sm">
              <thead className="bg-subdued">
                <tr>
                  <th className="px-4 py-3 text-left font-mono text-[11px] uppercase tracking-[0.08em] text-muted">Name</th>
                  <th className="px-4 py-3 text-left font-mono text-[11px] uppercase tracking-[0.08em] text-muted">Max Users</th>
                  <th className="px-4 py-3 text-left font-mono text-[11px] uppercase tracking-[0.08em] text-muted">Max Proposals</th>
                  <th className="px-4 py-3 text-left font-mono text-[11px] uppercase tracking-[0.08em] text-muted">Setup Fee</th>
                  <th className="px-4 py-3 text-left font-mono text-[11px] uppercase tracking-[0.08em] text-muted">Annual License</th>
                  <th className="px-4 py-3 text-left font-mono text-[11px] uppercase tracking-[0.08em] text-muted">Featured</th>
                  <th className="px-4 py-3 text-right font-mono text-[11px] uppercase tracking-[0.08em] text-muted">Actions</th>
                </tr>
              </thead>
              <tbody>
                {plans.map((plan) => (
                  <EditableRow key={plan.id} plan={plan} onSave={handleUpdate} />
                ))}
                {adding && <EmptyRow onSave={handleCreate} onCancel={() => setAdding(false)} />}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>LLM API Pricing</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-ink">Bring Your Own Key ($ per 1K requests)</label>
              <input type="number" step="0.01" value={llm.byok_price} onChange={(e) => setLlm((p) => ({ ...p, byok_price: Number(e.target.value) }))} className="min-h-[44px] w-full rounded border border-hairline bg-canvas px-4 py-2.5 text-base text-ink" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-ink">Platform-managed ($ per 1K requests)</label>
              <input type="number" step="0.01" value={llm.platform_price} onChange={(e) => setLlm((p) => ({ ...p, platform_price: Number(e.target.value) }))} className="min-h-[44px] w-full rounded border border-hairline bg-canvas px-4 py-2.5 text-base text-ink" />
            </div>
          </div>
          <Button onClick={handleSaveLlm} loading={saving} disabled={saving}>Save LLM Pricing</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Preview</CardTitle></CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {plans.map((plan) => (
              <div key={plan.id} className={`rounded border p-4 ${plan.featured ? "border-primary" : "border-hairline"}`}>
                <p className="text-sm font-semibold text-ink">{plan.name}</p>
                <p className="text-2xl font-semibold text-ink mt-1">${plan.annual_license.toLocaleString()}<span className="text-sm font-normal text-body-muted">/yr</span></p>
                <p className="text-xs text-body-muted mt-1">+${plan.setup_fee.toLocaleString()} setup</p>
                <ul className="mt-3 space-y-1 text-xs text-body-muted">
                  <li>• {formatLimit(plan.max_users)}</li>
                  <li>• {formatLimit(plan.max_proposals)} proposals</li>
                </ul>
                {plan.featured && <span className="mt-2 inline-flex rounded bg-primary px-2 py-0.5 text-[10px] font-medium text-white">Popular</span>}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
