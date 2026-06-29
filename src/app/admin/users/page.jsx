"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { LoadingState } from "@/components/ui/LoadingState";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import { USER_ROLES, ACADEMIC_ROLE_LABELS, FACULTIES, DEPARTMENTS } from "@/lib/constants";

const ROLE_OPTIONS = [
  { value: "all", label: "All roles" },
  { value: USER_ROLES.STUDENT, label: "Student" },
  { value: USER_ROLES.REVIEWER, label: "Reviewer" },
  { value: USER_ROLES.ADMIN, label: "Admin" },
  { value: USER_ROLES.LECTURER, label: "Lecturer" },
];

const ROLE_BADGE_COLORS = {
  super_admin: "bg-danger/10 text-danger",
  admin: "bg-danger/10 text-danger",
  reviewer: "bg-warning-bg text-warning",
  lecturer: "bg-success-bg text-success",
  student: "bg-info-bg text-info",
};

function UserTable({ users, onEdit, onDelete, currentUserId }) {
  if (users.length === 0) {
    return <EmptyState title="No users yet" description="Create the first account to get started." />;
  }

  return (
    <div className="overflow-x-auto rounded border border-hairline bg-canvas">
      <table className="w-full min-w-[700px] border-collapse text-sm">
        <thead className="bg-subdued">
          <tr>
            <th className="px-4 py-3 text-left font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-muted">Full name</th>
            <th className="px-4 py-3 text-left font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-muted">Email</th>
            <th className="px-4 py-3 text-left font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-muted">Role</th>
            <th className="px-4 py-3 text-left font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-muted">Faculty</th>
            <th className="px-4 py-3 text-left font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-muted">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-hairline">
          {users.map((u) => (
            <tr key={u.id} className="hover:bg-subdued/50">
              <td className="px-4 py-3 font-medium text-ink">{u.name}</td>
              <td className="px-4 py-3 text-body-muted">{u.email}</td>
              <td className="px-4 py-3">
                <span className={`rounded px-2 py-0.5 text-xs font-medium ${ROLE_BADGE_COLORS[u.role] || "bg-subdued text-muted"}`}>
                  {ACADEMIC_ROLE_LABELS[u.role] || u.role}
                </span>
              </td>
              <td className="px-4 py-3 text-body-muted">{u.faculty || "—"}</td>
              <td className="px-4 py-3">
                {u.id !== currentUserId && (
                  <div className="flex gap-2">
                    <button type="button" onClick={() => onEdit(u)} className="text-xs text-primary hover:underline">Edit</button>
                    <button type="button" onClick={() => onDelete(u)} className="text-xs text-danger hover:underline">Delete</button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CreateUserForm({ onSuccess, onCancel, isSuperAdmin }) {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "student", faculty: "", department: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const roleOptions = isSuperAdmin
    ? ROLE_OPTIONS.filter((r) => r.value !== "all")
    : ROLE_OPTIONS.filter((r) => ["student", "reviewer", "lecturer"].includes(r.value));

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      setError("Please fill in all required fields.");
      return;
    }
    setLoading(true);
    try {
      await api.createUser(form);
      onSuccess();
    } catch (err) {
      setError(err.message || "Unable to create account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader><CardTitle>Create new account</CardTitle></CardHeader>
      <CardContent>
        {error && <Alert type="error" className="mb-4">{error}</Alert>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Full name" name="name" value={form.name} onChange={handleChange} required />
          <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} required />
          <Input label="Password" name="password" type="password" value={form.password} onChange={handleChange} required minLength={6} />
          <Select label="Role" name="role" value={form.role} onChange={handleChange} options={roleOptions} />
          <Select label="Faculty" name="faculty" value={form.faculty} onChange={handleChange} options={[{ value: "", label: "Select faculty" }, ...FACULTIES.map((f) => ({ value: f, label: f }))]} />
          <Select label="Department" name="department" value={form.department} onChange={handleChange} options={[{ value: "", label: "Select department" }, ...DEPARTMENTS.map((d) => ({ value: d, label: d }))]} />
          <div className="flex gap-2">
            <Button type="submit" variant="primary" loading={loading}>Create account</Button>
            <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function UsersPageContent() {
  const { user, isSuperAdmin } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  useEffect(() => {
    let mounted = true;
    const loadUsers = async () => {
      try {
        const filters = {};
        if (roleFilter !== "all") filters.role = roleFilter;
        if (search.trim()) filters.search = search.trim();
        const data = await api.getUsers(filters);
        if (mounted) setUsers(Array.isArray(data) ? data : []);
      } catch {
        if (mounted) setError("Unable to load user list.");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    loadUsers();
    return () => { mounted = false; };
  }, [roleFilter, search]);

  const handleDelete = async (u) => {
    if (!confirm(`Delete account "${u.name}"?`)) return;
    try {
      await api.deleteUser(u.id);
      setMessage(`Deleted account "${u.name}".`);
      setUsers((prev) => prev.filter((u2) => u2.id !== u.id));
    } catch (err) {
      setError(err.message || "Unable to delete account.");
    }
  };

  const handleEdit = (u) => { setEditingUser(u); setShowCreate(false); };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      await api.updateUser(editingUser.id, { role: editingUser.role, faculty: editingUser.faculty, department: editingUser.department });
      setMessage("Account updated.");
      setEditingUser(null);
      setUsers((prev) => prev.map((u) => u.id === editingUser.id ? { ...u, ...editingUser } : u));
    } catch (err) {
      setError(err.message || "Unable to update.");
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-primary bg-primary text-white">
        <CardContent className="p-6 md:p-8">
          <div className="space-y-3">
            <div className="inline-flex rounded border border-white/15 bg-white/[0.06] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-white/60">Administration</div>
            <h1 className="text-2xl font-semibold leading-tight md:text-3xl">User Management</h1>
            <p className="max-w-3xl text-sm leading-6 text-white/65">Manage user accounts in the system.</p>
          </div>
        </CardContent>
      </Card>

      {message && <Alert type="success" closable>{message}</Alert>}
      {error && <Alert type="error">{error}</Alert>}

      <Card>
        <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-end">
          <Input label="Search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Name or email..." className="flex-1" />
          <Select label="Role" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} options={ROLE_OPTIONS} className="w-48" />
          <Button variant="primary" onClick={() => { setShowCreate(true); setEditingUser(null); }}>+ Create account</Button>
        </CardContent>
      </Card>

      {showCreate && (
        <CreateUserForm
          isSuperAdmin={isSuperAdmin}
          onSuccess={() => { setShowCreate(false); setMessage("Account created."); setLoading(true); }}
          onCancel={() => setShowCreate(false)}
        />
      )}

      {editingUser && (
        <Card>
          <CardHeader><CardTitle>Edit: {editingUser.name}</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateUser} className="space-y-4">
              <Select label="Role" value={editingUser.role} onChange={(e) => setEditingUser((prev) => ({ ...prev, role: e.target.value }))} options={ROLE_OPTIONS.filter((r) => r.value !== "all")} />
              <Select label="Faculty" value={editingUser.faculty || ""} onChange={(e) => setEditingUser((prev) => ({ ...prev, faculty: e.target.value }))} options={[{ value: "", label: "Select faculty" }, ...FACULTIES.map((f) => ({ value: f, label: f }))]} />
              <Select label="Department" value={editingUser.department || ""} onChange={(e) => setEditingUser((prev) => ({ ...prev, department: e.target.value }))} options={[{ value: "", label: "Select department" }, ...DEPARTMENTS.map((d) => ({ value: d, label: d }))]} />
              <div className="flex gap-2">
                <Button type="submit" variant="primary">Save changes</Button>
                <Button type="button" variant="ghost" onClick={() => setEditingUser(null)}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {loading ? <LoadingState /> : (
        <UserTable users={users} onEdit={handleEdit} onDelete={handleDelete} currentUserId={user?.id} />
      )}
    </div>
  );
}

export default function UsersPage() {
  return (
    <ProtectedRoute allowedRoles={[USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN]}>
      <AppShell>
        <UsersPageContent />
      </AppShell>
    </ProtectedRoute>
  );
}
