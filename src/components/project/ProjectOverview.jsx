"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { ProposalStatusBadge } from "@/components/proposal/ProposalStatusBadge";

const formatDate = (value) => {
  if (!value) return "N/A";
  return new Date(value).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
};

/**
 * ProjectOverview - Basic project info
 */
export function ProjectOverview({ project }) {
  const progress = project.progress || 0;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
      <div className="space-y-6">
        <Card>
          <CardContent className="p-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <InfoField label="Status">
                <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  project.status === "completed" ? "bg-success-bg text-success" :
                  project.status === "in_progress" ? "bg-info-bg text-info" :
                  "bg-subdued text-muted"
                }`}>
                  {project.status?.replace("_", " ") || "Not Started"}
                </span>
              </InfoField>
              <InfoField label="Timeline">{project.timeline || "—"}</InfoField>
              <InfoField label="Supervisor">{project.supervisorName || project.supervisor || "—"}</InfoField>
              <InfoField label="Created">{formatDate(project.createdAt || project.created_at)}</InfoField>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader><CardTitle>Progress</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-body-muted">Completion</span>
              <span className="text-sm font-semibold text-ink">{progress}%</span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-subdued">
              <div
                className={`h-full rounded-full transition-all ${progress >= 80 ? "bg-success" : progress >= 50 ? "bg-warning" : "bg-primary"}`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function InfoField({ label, children }) {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.06em] text-muted mb-1">{label}</p>
      {children}
    </div>
  );
}
