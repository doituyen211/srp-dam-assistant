"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { ProjectCard } from "@/components/project/ProjectCard";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/Input";
import { LoadingState } from "@/components/ui/LoadingState";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import { USER_ROLES } from "@/lib/constants";

function ProjectsContent() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    let mounted = true;
    api.getProjects()
      .then((data) => { if (mounted) setProjects(Array.isArray(data) ? data : []); })
      .catch(() => { if (mounted) setError("Unable to load projects."); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  const filteredProjects = useMemo(() => {
    if (!search.trim()) return projects;
    const keyword = search.toLowerCase();
    return projects.filter((p) =>
      (p.title || p.proposalTitle || "").toLowerCase().includes(keyword) ||
      (p.studentName || "").toLowerCase().includes(keyword)
    );
  }, [projects, search]);

  if (loading) return <LoadingState message="Loading projects..." />;

  return (
    <div className="space-y-6">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">Projects</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-[-0.02em] text-ink md:text-3xl">My Projects</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-body-muted">
          {projects.length === 0
            ? "No active projects yet. Projects start after proposal approval."
            : `${projects.length} project${projects.length !== 1 ? "s" : ""}`}
        </p>
      </div>

      {error && <Alert type="error">{error}</Alert>}

      <Card>
        <CardContent className="p-5">
          <Input label="Search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by title or student..." />
        </CardContent>
      </Card>

      {filteredProjects.length === 0 ? (
        <Card>
          <CardContent className="py-10">
            <EmptyState
              title={search ? "No matching projects" : "No projects yet"}
              description={search ? "Try adjusting your search." : "Projects will appear after your proposal is approved."}
            />
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}

import { useMemo } from "react";

export default function ProjectsPage() {
  return (
    <ProtectedRoute>
      <AppShell>
        <ProjectsContent />
      </AppShell>
    </ProtectedRoute>
  );
}
