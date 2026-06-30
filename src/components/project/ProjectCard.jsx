"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

const STATUS_COLORS = {
  not_started: "bg-subdued text-muted",
  in_progress: "bg-info-bg text-info",
  completed: "bg-success-bg text-success",
};

/**
 * ProjectCard - Card for project list
 */
export function ProjectCard({ project }) {
  const statusColor = STATUS_COLORS[project.status] || "bg-subdued text-muted";
  const progress = project.progress || 0;

  return (
    <Link href={`/projects/${project.id}`} className="group block h-full">
      <Card className="h-full transition-all hover:shadow-md">
        <CardContent className="flex flex-col gap-3 p-5">
          <div className="flex items-start justify-between gap-3">
            <h3 className="line-clamp-2 text-sm font-semibold text-ink group-hover:text-primary">
              {project.title || project.proposalTitle || "Untitled Project"}
            </h3>
            <span className={`flex-shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${statusColor}`}>
              {project.status?.replace("_", " ") || "Not Started"}
            </span>
          </div>

          {project.studentName && (
            <p className="text-xs text-body-muted">{project.studentName}</p>
          )}

          {/* Progress bar */}
          <div>
            <div className="flex items-center justify-between text-[11px] text-muted mb-1">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-subdued">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="mt-auto border-t border-hairline pt-3 text-xs text-muted">
            Updated {new Date(project.updatedAt || project.updated_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
