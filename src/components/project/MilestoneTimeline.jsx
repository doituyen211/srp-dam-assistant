"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";

const formatDate = (value) => {
  if (!value) return "N/A";
  return new Date(value).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
};

const STATUS_STYLES = {
  completed: { icon: "✓", color: "text-success", bg: "bg-success" },
  in_progress: { icon: "⏳", color: "text-info", bg: "bg-info" },
  overdue: { icon: "✗", color: "text-danger", bg: "bg-danger" },
  not_started: { icon: "○", color: "text-muted", bg: "bg-muted" },
};

/**
 * MilestoneTimeline - Vertical timeline of project milestones
 */
export function MilestoneTimeline({ milestones = [] }) {
  if (milestones.length === 0) {
    return (
      <Card>
        <CardContent className="py-8">
          <EmptyState title="No milestones yet" description="Milestones will appear when the project starts." />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader><CardTitle>Milestones</CardTitle></CardHeader>
      <CardContent>
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-hairline" />

          <div className="space-y-6">
            {milestones.map((milestone, i) => {
              const style = STATUS_STYLES[milestone.status] || STATUS_STYLES.not_started;
              return (
                <div key={milestone.id || i} className="relative flex gap-4">
                  {/* Status dot */}
                  <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 border-white text-xs ${style.bg} z-10`}>
                    <span className={style.color}>{style.icon}</span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 rounded-lg border border-hairline bg-canvas p-4">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-sm font-semibold text-ink">{milestone.title || milestone.name}</h3>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                        milestone.status === "completed" ? "bg-success-bg text-success" :
                        milestone.status === "in_progress" ? "bg-info-bg text-info" :
                        milestone.status === "overdue" ? "bg-danger-bg text-danger" :
                        "bg-subdued text-muted"
                      }`}>
                        {milestone.status?.replace("_", " ") || "Pending"}
                      </span>
                    </div>
                    {milestone.description && (
                      <p className="mt-1 text-xs text-body-muted">{milestone.description}</p>
                    )}
                    <div className="mt-2 flex items-center gap-4 text-xs text-muted">
                      {milestone.dueDate && <span>Due: {formatDate(milestone.dueDate)}</span>}
                      {milestone.progress !== undefined && <span>Progress: {milestone.progress}%</span>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
