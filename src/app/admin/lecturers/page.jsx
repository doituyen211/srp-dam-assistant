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
import { api } from "@/lib/api";
import { USER_ROLES, FACULTIES, LECTURER_TITLES } from "@/lib/constants";

function LecturersPageContent() {
  const [lecturers, setLecturers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    let mounted = true;
    api.getLecturers()
      .then((data) => { if (mounted) setLecturers(Array.isArray(data) ? data : []); })
      .catch(() => { if (mounted) setError("Unable to load lecturers."); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  const filtered = lecturers.filter((l) => {
    if (!search.trim()) return true;
    const keyword = search.toLowerCase();
    return (l.name || "").toLowerCase().includes(keyword) ||
           (l.email || "").toLowerCase().includes(keyword) ||
           (l.department || "").toLowerCase().includes(keyword);
  });

  const handleDelete = async (lecturer) => {
    if (!confirm(`Delete lecturer "${lecturer.name}"?`)) return;
    try {
      await api.deleteUser(lecturer.id);
      setMessage(`Lecturer "${lecturer.name}" deleted.`);
      setLecturers((prev) => prev.filter((l) => l.id !== lecturer.id));
    } catch (err) {
      setError(err.message || "Unable to delete lecturer.");
    }
  };

  const handleCreate = async (formData) => {
    try {
      const lecturer = await api.createUser({ ...formData, role: "lecturer" });
      setMessage("Lecturer created.");
      setLecturers((prev) => [lecturer, ...prev]);
      setShowCreate(false);
    } catch (err) {
      setError(err.message || "Unable to create lecturer.");
    }
  };

  const handleUpdate = async (id, formData) => {
    try {
      const updated = await api.updateUser(id, formData);
      setMessage("Lecturer updated.");
      setLecturers((prev) => prev.map((l) => l.id === id ? { ...l, ...updated } : l));
      setEditingId(null);
    } catch (err) {
      setError(err.message || "Unable to update lecturer.");
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-primary bg-primary text-white">
        <CardContent className="p-6 md:p-8">
          <div className="space-y-3">
            <div className="inline-flex rounded border border-white/15 bg-white/[0.06] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-white/60">Administration</div>
            <h1 className="text-2xl font-semibold leading-tight md:text-3xl">Lecturer Management</h1>
            <p className="max-w-3xl text-sm leading-6 text-white/65">Manage lecturer profiles, expertise, and supervision capacity.</p>
          </div>
        </CardContent>
      </Card>

      {message && <Alert type="success" closable>{message}</Alert>}
      {error && <Alert type="error">{error}</Alert>}

      {/* Filters + Create button */}
      <Card>
        <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-end">
          <Input label="Search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, email, or department..." className="flex-1" />
          <Button variant="primary" onClick={() => setShowCreate(true)}>+ Add Lecturer</Button>
        </CardContent>
      </Card>

      {/* Create form */}
      {showCreate && (
        <CreateLecturerForm onCreate={handleCreate} onCancel={() => setShowCreate(false)} />
      )}

      {/* Edit form */}
      {editingId && (
        <EditLecturerForm
          lecturer={lecturers.find((l) => l.id === editingId)}
          onUpdate={(data) => handleUpdate(editingId, data)}
          onCancel={() => setEditingId(null)}
        />
      )}

      {/* Lecturer table */}
      {loading ? <LoadingState /> : filtered.length === 0 ? (
        <Card><CardContent className="py-10"><EmptyState title="No lecturers found" description={search ? "Try adjusting your search." : "Add the first lecturer to get started."} /></CardContent></Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] border-collapse text-sm">
                <thead className="bg-subdued">
                  <tr>
                    <th className="px-4 py-3 text-left font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-muted">Name</th>
                    <th className="px-4 py-3 text-left font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-muted">Title</th>
                    <th className="px-4 py-3 text-left font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-muted">Department</th>
                    <th className="px-4 py-3 text-left font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-muted">Capacity</th>
                    <th className="px-4 py-3 text-left font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-muted">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-hairline">
                  {filtered.map((lecturer) => (
                    <tr key={lecturer.id} className="hover:bg-subdued/50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                            {lecturer.name?.charAt(0) || "?"}
                          </div>
                          <div>
                            <p className="font-medium text-ink">{lecturer.name}</p>
                            <p className="text-xs text-body-muted">{lecturer.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-body-muted">{lecturer.title || "—"}</td>
                      <td className="px-4 py-3 text-body-muted">{lecturer.department || "—"}</td>
                      <td className="px-4 py-3 text-body-muted">
                        {lecturer.currentLoad !== undefined ? `${lecturer.currentLoad}/${lecturer.maxLoad || 3}` : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button type="button" onClick={() => setEditingId(lecturer.id)} className="text-xs text-primary hover:underline">Edit</button>
                          <button type="button" onClick={() => handleDelete(lecturer)} className="text-xs text-danger hover:underline">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function CreateLecturerForm({ onCreate, onCancel }) {
  const [form, setForm] = useState({ name: "", email: "", password: "", title: "", department: "", faculty: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) return;
    setLoading(true);
    await onCreate(form);
    setLoading(false);
  };

  return (
    <Card>
      <CardHeader><CardTitle>Add Lecturer</CardTitle></CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Full Name" name="name" value={form.name} onChange={handleChange} required />
            <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} required />
            <Input label="Password" name="password" type="password" value={form.password} onChange={handleChange} required minLength={6} />
            <Select label="Title" name="title" value={form.title} onChange={handleChange} options={LECTURER_TITLES.map((t) => ({ value: t, label: t }))} />
            <Select label="Faculty" name="faculty" value={form.faculty} onChange={handleChange} options={[{ value: "", label: "Select" }, ...FACULTIES.map((f) => ({ value: f, label: f }))]} />
            <Input label="Department" name="department" value={form.department} onChange={handleChange} />
          </div>
          <div className="flex gap-2">
            <Button type="submit" variant="primary" loading={loading}>Create</Button>
            <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function EditLecturerForm({ lecturer, onUpdate, onCancel }) {
  const [form, setForm] = useState({ title: lecturer?.title || "", department: lecturer?.department || "", faculty: lecturer?.faculty || "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onUpdate(form);
    setLoading(false);
  };

  return (
    <Card>
      <CardHeader><CardTitle>Edit: {lecturer?.name}</CardTitle></CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Select label="Title" name="title" value={form.title} onChange={handleChange} options={LECTURER_TITLES.map((t) => ({ value: t, label: t }))} />
            <Select label="Faculty" name="faculty" value={form.faculty} onChange={handleChange} options={[{ value: "", label: "Select" }, ...FACULTIES.map((f) => ({ value: f, label: f }))]} />
            <Input label="Department" name="department" value={form.department} onChange={handleChange} />
          </div>
          <div className="flex gap-2">
            <Button type="submit" variant="primary" loading={loading}>Save</Button>
            <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default function LecturersPage() {
  return (
    <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN]}>
      <AppShell>
        <LecturersPageContent />
      </AppShell>
    </ProtectedRoute>
  );
}
