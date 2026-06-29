"use client";

import { AppShell } from "@/components/layout/AppShell";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { USER_ROLES } from "@/lib/constants";

export default function AdminSettingsPage() {
  return (
    <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
      <AppShell>
        <div className="max-w-2xl space-y-6">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted">Admin</p>
            <h1 className="mt-2 text-2xl font-semibold text-ink">Settings</h1>
            <p className="mt-1 text-sm text-body-muted">Platform-level settings configuration.</p>
          </div>

          <Card>
            <CardHeader><CardTitle>General Settings</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm text-body-muted">No settings yet. Options will be added as needed.</p>
            </CardContent>
          </Card>
        </div>
      </AppShell>
    </ProtectedRoute>
  );
}
