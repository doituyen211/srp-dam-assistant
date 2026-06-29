"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/Input";
import { LoadingState } from "@/components/ui/LoadingState";
import { api } from "@/lib/api";
import { USER_ROLES } from "@/lib/constants";

function FacultiesTab() {
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let mounted = true;
    api.getFaculties()
      .then((data) => { if (mounted) setFaculties(Array.isArray(data) ? data : []); })
      .catch(() => { if (mounted) setError("Unable to load faculty list."); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  const handleCreate = async () => {
    if (!newName.trim()) return;
    try {
      await api.createFaculty({ name: newName.trim() });
      setNewName("");
      setMessage("Faculty created.");
      const data = await api.getFaculties();
      setFaculties(Array.isArray(data) ? data : []);
    } catch (err) { setError(err.message || "Error."); }
  };

  const handleUpdate = async (id) => {
    try {
      await api.updateFaculty(id, { name: editName.trim() });
      setEditingId(null);
      setMessage("Updated.");
      const data = await api.getFaculties();
      setFaculties(Array.isArray(data) ? data : []);
    } catch (err) { setError(err.message || "Error."); }
  };

  const handleDelete = async (f) => {
    if (!confirm(`Delete faculty "${f.name}"?`)) return;
    try { await api.deleteFaculty(f.id); setMessage("Deleted."); setFaculties((prev) => prev.filter((f2) => f2.id !== f.id)); }
    catch (err) { setError(err.message || "Error."); }
  };

  return (
    <div className="space-y-4">
      {message && <Alert type="success" closable>{message}</Alert>}
      {error && <Alert type="error">{error}</Alert>}
      <div className="flex gap-2">
        <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="New faculty name..." className="flex-1" />
        <Button variant="primary" onClick={handleCreate}>Add</Button>
      </div>
      {loading ? <LoadingState /> : faculties.length === 0 ? (
        <EmptyState title="No faculties yet" description="Add the first faculty to get started." />
      ) : (
        <div className="space-y-2">
          {faculties.map((f) => (
            <div key={f.id} className="flex items-center gap-3 rounded border border-hairline bg-canvas p-3">
              {editingId === f.id ? (
                <>
                  <Input value={editName} onChange={(e) => setEditName(e.target.value)} className="flex-1" />
                  <Button variant="primary" onClick={() => handleUpdate(f.id)}>Save</Button>
                  <Button variant="ghost" onClick={() => setEditingId(null)}>Cancel</Button>
                </>
              ) : (
                <>
                  <span className="flex-1 text-sm font-medium text-ink">{f.name}</span>
                  <button type="button" onClick={() => { setEditingId(f.id); setEditName(f.name); }} className="text-xs text-primary hover:underline">Edit</button>
                  <button type="button" onClick={() => handleDelete(f)} className="text-xs text-danger hover:underline">Delete</button>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function DepartmentsTab() {
  const [departments, setDepartments] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");
  const [newFacultyId, setNewFacultyId] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let mounted = true;
    Promise.all([api.getDepartments(), api.getFaculties()])
      .then(([deps, facs]) => {
        if (mounted) {
          setDepartments(Array.isArray(deps) ? deps : []);
          setFaculties(Array.isArray(facs) ? facs : []);
        }
      })
      .catch(() => { if (mounted) setError("Unable to load data."); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  const handleCreate = async () => {
    if (!newName.trim() || !newFacultyId) return;
    try {
      await api.createDepartment({ name: newName.trim(), faculty_id: newFacultyId });
      setNewName(""); setNewFacultyId("");
      setMessage("Department created.");
      const data = await api.getDepartments();
      setDepartments(Array.isArray(data) ? data : []);
    } catch (err) { setError(err.message || "Error."); }
  };

  const handleDelete = async (d) => {
    if (!confirm(`Delete department "${d.name}"?`)) return;
    try { await api.deleteDepartment(d.id); setMessage("Deleted."); setDepartments((prev) => prev.filter((d2) => d2.id !== d.id)); }
    catch (err) { setError(err.message || "Error."); }
  };

  const getFacultyName = (id) => faculties.find((f) => f.id === id)?.name || "—";

  return (
    <div className="space-y-4">
      {message && <Alert type="success" closable>{message}</Alert>}
      {error && <Alert type="error">{error}</Alert>}
      <div className="flex gap-2">
        <select value={newFacultyId} onChange={(e) => setNewFacultyId(e.target.value)} className="rounded border border-hairline bg-canvas px-3 py-2 text-sm text-ink">
          <option value="">Select faculty</option>
          {faculties.map((f) => (<option key={f.id} value={f.id}>{f.name}</option>))}
        </select>
        <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="New department name..." className="flex-1" />
        <Button variant="primary" onClick={handleCreate}>Add</Button>
      </div>
      {loading ? <LoadingState /> : departments.length === 0 ? (
        <EmptyState title="No departments yet" description="Add the first department to get started." />
      ) : (
        <div className="space-y-2">
          {departments.map((d) => (
            <div key={d.id} className="flex items-center gap-3 rounded border border-hairline bg-canvas p-3">
              <span className="flex-1 text-sm font-medium text-ink">{d.name}</span>
              <span className="text-xs text-body-muted">{getFacultyName(d.facultyId || d.faculty_id)}</span>
              <button type="button" onClick={() => handleDelete(d)} className="text-xs text-danger hover:underline">Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function FieldsTab() {
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let mounted = true;
    api.getFieldsOfStudy()
      .then((data) => { if (mounted) setFields(Array.isArray(data) ? data : []); })
      .catch(() => { if (mounted) setError("Unable to load data."); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  const handleCreate = async () => {
    if (!newName.trim()) return;
    try {
      await api.createFieldOfStudy({ name: newName.trim() });
      setNewName("");
      setMessage("Field created.");
      const data = await api.getFieldsOfStudy();
      setFields(Array.isArray(data) ? data : []);
    } catch (err) { setError(err.message || "Error."); }
  };

  const handleDelete = async (f) => {
    if (!confirm(`Delete field "${f.name}"?`)) return;
    try { await api.deleteFieldOfStudy(f.id); setMessage("Deleted."); setFields((prev) => prev.filter((f2) => f2.id !== f.id)); }
    catch (err) { setError(err.message || "Error."); }
  };

  return (
    <div className="space-y-4">
      {message && <Alert type="success" closable>{message}</Alert>}
      {error && <Alert type="error">{error}</Alert>}
      <div className="flex gap-2">
        <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="New field name..." className="flex-1" />
        <Button variant="primary" onClick={handleCreate}>Add</Button>
      </div>
      {loading ? <LoadingState /> : fields.length === 0 ? (
        <EmptyState title="No fields yet" description="Add the first field of study." />
      ) : (
        <div className="space-y-2">
          {fields.map((f) => (
            <div key={f.id} className="flex items-center gap-3 rounded border border-hairline bg-canvas p-3">
              <span className="flex-1 text-sm font-medium text-ink">{f.name}</span>
              <button type="button" onClick={() => handleDelete(f)} className="text-xs text-danger hover:underline">Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function FacultiesPageContent() {
  const [activeTab, setActiveTab] = useState("faculties");

  const tabs = [
    { id: "faculties", label: "Faculties" },
    { id: "departments", label: "Departments" },
    { id: "fields", label: "Fields of Study" },
  ];

  return (
    <div className="space-y-6">
      <Card className="border-primary bg-primary text-white">
        <CardContent className="p-6 md:p-8">
          <div className="space-y-3">
            <div className="inline-flex rounded border border-white/15 bg-white/[0.06] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-white/60">Platform</div>
            <h1 className="text-2xl font-semibold leading-tight md:text-3xl">Manage Faculties & Departments</h1>
            <p className="max-w-3xl text-sm leading-6 text-white/65">Manage the organizational structure of the institution.</p>
          </div>
        </CardContent>
      </Card>

      <div className="border-b border-hairline">
        <nav className="flex gap-0 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-body-muted hover:border-hairline hover:text-ink"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === "faculties" && <FacultiesTab />}
      {activeTab === "departments" && <DepartmentsTab />}
      {activeTab === "fields" && <FieldsTab />}
    </div>
  );
}

export default function FacultiesPage() {
  return (
    <ProtectedRoute allowedRoles={[USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN]}>
      <AppShell>
        <FacultiesPageContent />
      </AppShell>
    </ProtectedRoute>
  );
}
