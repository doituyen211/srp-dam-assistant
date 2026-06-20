"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold text-ink">Platform Settings</h1>
      <p className="text-sm text-body-muted">System-wide configuration. These settings apply to all tenants.</p>

      {saved && <Alert type="success">Settings saved.</Alert>}

      <Card>
        <CardHeader><CardTitle>General</CardTitle></CardHeader>
        <CardContent className="space-y-5">
          <Input label="Platform name" defaultValue="SRP D&amp;M Assistant" placeholder="Platform name" />
          <Input label="Support email" defaultValue="support@researchplatform.edu" type="email" />
          <Input label="API base URL" defaultValue={process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api/v1"} disabled />
          <Button onClick={handleSave}>Save Settings</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Default Limits</CardTitle></CardHeader>
        <CardContent className="space-y-5">
          <Input label="Default max proposals per tenant" defaultValue="5" type="number" />
          <Input label="Default max users per tenant" defaultValue="10" type="number" />
          <Input label="Trial period (days)" defaultValue="14" type="number" />
          <Button onClick={handleSave}>Save Settings</Button>
        </CardContent>
      </Card>
    </div>
  );
}
