"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import { FACULTIES, DEPARTMENTS, CURRENT_TERM, ACADEMIC_TERMS, ACADEMIC_ROLE_LABELS } from "@/lib/constants";

function ProfileContent() {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    name: user?.name || "",
    faculty: user?.faculty || "",
    department: user?.department || "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    setLoading(true);
    setError("");
    setMessage("");
    try {
      await api.updateMe(form);
      setMessage("Profile updated successfully.");
      setEditing(false);
      // Refresh user data
      const updated = await api.getMe();
      if (updated) {
        // Force page refresh to pick up new user data
        window.location.reload();
      }
    } catch (err) {
      setError(err.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const currentTerm = ACADEMIC_TERMS.find((t) => t.id === CURRENT_TERM);

  return (
    <div className="max-w-2xl space-y-6">
      {/* Header */}
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted">Account</p>
        <h1 className="mt-2 text-2xl font-semibold text-ink">Profile</h1>
        <p className="mt-1 text-sm text-body-muted">View and manage your account information.</p>
      </div>

      {message && <Alert type="success" closable>{message}</Alert>}
      {error && <Alert type="error">{error}</Alert>}

      {/* User card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-semibold text-white">
              {user?.name?.charAt(0)?.toUpperCase() || "?"}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-ink">{user?.name}</h2>
              <p className="text-sm text-body-muted">{user?.email}</p>
              <span className={`mt-1 inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                user?.role === "admin" || user?.role === "super_admin"
                  ? "bg-danger/10 text-danger"
                  : user?.role === "reviewer"
                    ? "bg-warning-bg text-warning"
                    : user?.role === "lecturer"
                      ? "bg-success-bg text-success"
                      : "bg-info-bg text-info"
              }`}>
                {ACADEMIC_ROLE_LABELS[user?.role] || user?.role}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Personal Information</CardTitle>
          {!editing && (
            <Button variant="secondary" onClick={() => setEditing(true)}>Edit</Button>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-ink">Name</label>
              {editing ? (
                <Input name="name" value={form.name} onChange={handleChange} />
              ) : (
                <p className="text-sm text-ink">{user?.name || "—"}</p>
              )}
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-ink">Email</label>
              <p className="text-sm text-body-muted">{user?.email || "—"}</p>
              <p className="text-[11px] text-muted">Email cannot be changed</p>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-ink">Role</label>
              <p className="text-sm text-body-muted">{ACADEMIC_ROLE_LABELS[user?.role] || user?.role}</p>
              <p className="text-[11px] text-muted">Role is assigned by administrators</p>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-ink">Faculty</label>
              {editing ? (
                <Select name="faculty" value={form.faculty} onChange={handleChange} options={[{ value: "", label: "Select faculty" }, ...FACULTIES.map((f) => ({ value: f, label: f }))]} />
              ) : (
                <p className="text-sm text-ink">{user?.faculty || "—"}</p>
              )}
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-ink">Department</label>
              {editing ? (
                <Select name="department" value={form.department} onChange={handleChange} options={[{ value: "", label: "Select department" }, ...DEPARTMENTS.map((d) => ({ value: d, label: d }))]} />
              ) : (
                <p className="text-sm text-ink">{user?.department || "—"}</p>
              )}
            </div>
          </div>

          {editing && (
            <div className="flex gap-2 pt-2">
              <Button variant="primary" loading={loading} onClick={handleSave}>Save Changes</Button>
              <Button variant="ghost" onClick={() => { setEditing(false); setForm({ name: user?.name || "", faculty: user?.faculty || "", department: user?.department || "" }); }}>Cancel</Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Account Info */}
      <Card>
        <CardHeader><CardTitle>Account Information</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-body-muted">User ID</span>
            <span className="font-mono text-sm text-ink">{user?.id || "—"}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-body-muted">Academic Term</span>
            <span className="text-sm text-ink">{currentTerm?.label || "—"}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <AppShell>
        <ProfileContent />
      </AppShell>
    </ProtectedRoute>
  );
}
