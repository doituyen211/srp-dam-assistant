"use client";

import { Badge } from "@/components/ui/Badge";
import { STATUS_LABELS, WORKFLOW_STAGES } from "@/lib/constants";

/**
 * ProposalStatusBadge - Display proposal status with color and workflow context
 */
export function ProposalStatusBadge({ status, showWorkflow = false }) {
  const label = STATUS_LABELS[status] || status;

  const getStageInfo = () => {
    const stage = WORKFLOW_STAGES.find((s) => s.status === status);
    if (!stage) return null;

    return {
      order: stage.order,
      nextStage: WORKFLOW_STAGES.find((s) => s.order === stage.order + 1),
    };
  };

  const stageInfo = showWorkflow ? getStageInfo() : null;

  return (
    <div className="flex items-center gap-2">
      <Badge status={status} className="whitespace-nowrap">
        {label}
      </Badge>

      {showWorkflow && stageInfo && (
        <div className="flex items-center gap-1 text-xs text-muted">
          <span>•</span>
          <span>Stage {stageInfo.order}</span>
          {stageInfo.nextStage && (
            <>
              <span>→</span>
              <span>{stageInfo.nextStage.label}</span>
            </>
          )}
        </div>
      )}
    </div>
  );
}
