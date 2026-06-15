"use client";

import { WORKFLOW_STAGES, STATUS_LABELS } from "@/lib/constants";

const STAGE_COLORS = {
  draft: "bg-subdued text-unset",
  ai_pre_check: "bg-purple/10 text-purple",
  submitted: "bg-info-bg text-info",
  under_review: "bg-warning-bg text-warning",
  needs_revision: "bg-warning-bg text-warning",
  approved: "bg-success-bg text-success",
  rejected: "bg-danger-bg text-danger",
  supervisor_assigned: "bg-teal/10 text-teal",
  in_progress: "bg-indigo/10 text-indigo",
  completed: "bg-emerald/10 text-emerald",
};

/**
 * WorkflowPipeline — Visual pipeline showing proposal counts by stage
 */
export function WorkflowPipeline({ counts = {} }) {
  return (
    <div className="space-y-3">
      {WORKFLOW_STAGES.map((stage, i) => {
        const count = counts[stage.status] || 0;
        const color = STAGE_COLORS[stage.status] || "bg-subdued text-muted";
        const isLast = i === WORKFLOW_STAGES.length - 1;

        return (
          <div key={stage.status} className="flex items-center gap-3">
            {/* Connection line */}
            {!isLast && (
              <div className="flex h-8 w-6 flex-col items-center">
                <div className={`h-3 w-3 rounded-full ${color.split(" ")[0]}`} />
                <div className="flex-1 w-0.5 bg-hairline" />
              </div>
            )}
            {isLast && (
              <div className="flex h-8 w-6 items-center">
                <div className={`h-3 w-3 rounded-full ${color.split(" ")[0]}`} />
              </div>
            )}

            {/* Stage info */}
            <div className="flex flex-1 items-center justify-between rounded border border-hairline bg-canvas px-3 py-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-ink">
                  {stage.label}
                </span>
                <span className={`rounded px-1.5 py-0.5 font-mono text-[10px] font-medium ${color}`}>
                  {count}
                </span>
              </div>
              <span className="font-mono text-[10px] text-muted">
                Stage {stage.order}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
