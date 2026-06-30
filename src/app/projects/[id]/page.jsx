"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { ProjectTabs } from "@/components/project/ProjectTabs";
import { ProjectOverview } from "@/components/project/ProjectOverview";
import { ProjectMembers } from "@/components/project/ProjectMembers";
import { MilestoneTimeline } from "@/components/project/MilestoneTimeline";
import { ProjectReports } from "@/components/project/ProjectReports";
import { DeliverablesGrid } from "@/components/project/DeliverablesGrid";
import { Alert } from "@/components/ui/Alert";
import { Card, CardContent } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingState } from "@/components/ui/LoadingState";
import { api } from "@/lib/api";

function ProjectDetailContent() {
  const params = useParams();
  const projectId = params?.id;
  const [project, setProject] = useState(null);
  const [members, setMembers] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [reports, setReports] = useState([]);
  const [deliverables, setDeliverables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setNotFound(false);
      try {
        const [proj, mems, ms, reps, dels] = await Promise.allSettled([
          api.getProjectById(projectId),
          api.getProjectMembers(projectId),
          api.getProjectMilestones(projectId),
          api.getProjectReports(projectId),
          api.getProjectDeliverables(projectId),
        ]);
        if (!mounted) return;
        if (proj.status === "fulfilled") setProject(proj.value);
        else { setNotFound(true); return; }
        if (mems.status === "fulfilled") setMembers(Array.isArray(mems.value) ? mems.value : []);
        if (ms.status === "fulfilled") setMilestones(Array.isArray(ms.value) ? ms.value : []);
        if (reps.status === "fulfilled") setReports(Array.isArray(reps.value) ? reps.value : []);
        if (dels.status === "fulfilled") setDeliverables(Array.isArray(dels.value) ? dels.value : []);
      } catch {
        if (mounted) setNotFound(true);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    if (projectId) load();
    return () => { mounted = false; };
  }, [projectId]);

  if (loading) return <LoadingState message="Loading project..." />;

  if (notFound) {
    return (
      <Card className="mx-auto max-w-2xl">
        <EmptyState
          title="Project not found"
          description="This project may not exist or you may not have access."
          action={<Link href="/projects" className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white">Back to projects</Link>}
        />
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <h1 className="text-xl font-semibold leading-tight text-ink md:text-2xl">
            {project?.title || project?.proposalTitle || "Untitled Project"}
          </h1>
          <p className="mt-1 text-sm text-body-muted">
            {project?.studentName} · {project?.researchField || project?.field || "Research"}
          </p>
        </div>
        <Link href="/projects" className="flex-shrink-0 rounded-lg border border-hairline px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-subdued">Back</Link>
      </div>

      {/* Tabs */}
      <ProjectTabs activeTab={activeTab} onTabChange={setActiveTab}>
        {activeTab === "overview" && (
          <ProjectOverview project={project} />
        )}
        {activeTab === "members" && (
          <ProjectMembers members={members} />
        )}
        {activeTab === "milestones" && (
          <MilestoneTimeline milestones={milestones} />
        )}
        {activeTab === "reports" && (
          <ProjectReports reports={reports} />
        )}
        {activeTab === "deliverables" && (
          <DeliverablesGrid deliverables={deliverables} />
        )}
      </ProjectTabs>
    </div>
  );
}

export default function ProjectDetailPage() {
  return (
    <ProtectedRoute>
      <AppShell><ProjectDetailContent /></AppShell>
    </ProtectedRoute>
  );
}
