"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { onboardTenant } from "@/lib/tenant";

export default function CreateTenantPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", domain: "", admin_email: "", academic_units: "", subscription_tier: "free" });

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim() || !form.domain.trim() || !form.admin_email.trim()) {
      setError("Name, domain, and admin email are required.");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        name: form.name.trim(),
        domain: form.domain.trim().toLowerCase(),
        admin_email: form.admin_email.trim().toLowerCase(),
        academic_units: form.academic_units.split(",").map((s) => s.trim()).filter(Boolean),
        subscription_tier: form.subscription_tier,
      };
      await onboardTenant(payload);
      router.push("/super-admin/tenants");
    } catch (err) {
      setError(err.message || "Failed to create tenant.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <Link href="/super-admin/tenants" className="text-sm text-body-muted hover:text-ink">← Back to tenants</Link>
        <h1 className="mt-2 text-2xl font-semibold text-ink">Create New Tenant</h1>
        <p className="mt-1 text-sm text-body-muted">Onboard a new college or university. An admin account and invite will be created automatically.</p>
      </div>

      {error && <Alert type="error">{error}</Alert>}

      <Card>
        <CardHeader><CardTitle>Tenant Details</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input label="Tenant name" name="name" value={form.name} onChange={handleChange} placeholder="e.g. Hanoi University of Science" required disabled={loading} />
            <Input label="Domain" name="domain" value={form.domain} onChange={handleChange} placeholder="e.g. hus.edu.vn" required disabled={loading} helperText="Email domain for user registration." />
            <Input label="Admin email" type="email" name="admin_email" value={form.admin_email} onChange={handleChange} placeholder="admin@hus.edu.vn" required disabled={loading} helperText="First administrator for this tenant." />

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-ink">Subscription Tier</label>
              <select name="subscription_tier" value={form.subscription_tier} onChange={handleChange} disabled={loading} className="min-h-[44px] w-full rounded border border-hairline bg-canvas px-4 py-2.5 text-base text-ink">
                <option value="annual">Annual — $3,000/year</option>
                <option value="trial">Trial — 90 days</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-ink">Academic units</label>
              <textarea name="academic_units" value={form.academic_units} onChange={handleChange} placeholder="e.g. Faculty of IT, Faculty of Math, Faculty of Physics" rows={3} disabled={loading} className="min-h-[80px] w-full resize-y rounded border border-hairline bg-canvas px-4 py-2.5 text-base text-ink" />
              <p className="text-xs text-body-muted">Comma-separated list of faculties or schools.</p>
            </div>

            <Button type="submit" variant="primary" loading={loading} disabled={loading} className="w-full justify-center">Create Tenant</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
