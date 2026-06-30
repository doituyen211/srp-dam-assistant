"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/Card";
import { ProposalStatusBadge } from "./ProposalStatusBadge";
import { WORKFLOW_STAGES } from "@/lib/constants";

/**
 * ProposalCard - Enhanced card with readiness, stage, missing items, deadline, next action
 */
export function ProposalCard({ proposal }) {
  const updatedDate = new Date(proposal.updatedAt).toLocaleDateString("en-US");
  const deadlineDate = proposal.deadline
    ? new Date(proposal.deadline).toLocaleDateString("en-US")
    : null;

  const currentStage = WORKFLOW_STAGES.find(
    (s) => s.status === proposal.status
  );

  const readinessScore = proposal.readinessScore || proposal.aiScore || 0;
  const getScoreColor = (score) => {
    if (score >= 8) return "text-success";
    if (score >= 6) return "text-warning";
    return "text-danger";
  };
  const getScoreBg = (score) => {
    if (score >= 8) return "bg-success-bg";
    if (score >= 6) return "bg-warning-bg";
    return "bg-danger-bg";
  };

  const missingItemCount = proposal.missingItems?.length || 0;

  return (
    <Link href={`/proposals/${proposal.id}`} className="group block h-full">
      <Card className="flex h-full flex-col transition-all duration-150 hover:shadow-card-hover">
        <CardContent className="flex flex-1 flex-col gap-4 p-5">
          {/* Top row: title + readiness score circle */}
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="mb-2">
                <ProposalStatusBadge status={proposal.status} />
              </div>
              <h3 className="line-clamp-2 text-sm font-semibold leading-6 text-ink transition-colors group-hover:text-primary">
                {proposal.title}
              </h3>
            </div>

            {readinessScore > 0 && (
              <div
                className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full text-sm font-semibold ${getScoreBg(readinessScore)} ${getScoreColor(readinessScore)}`}
              >
                {Math.round(readinessScore)}
              </div>
            )}
          </div>

          {/* Tags: field + stage */}
          <div className="flex flex-wrap gap-1.5">
            <span className="rounded border border-hairline bg-subdued px-2 py-0.5 text-xs text-body-muted">
              {proposal.researchField || proposal.field}
            </span>
            {currentStage && (
              <span className="rounded border border-hairline bg-canvas px-2 py-0.5 text-xs text-muted">
                Stage {currentStage.order} / {WORKFLOW_STAGES.length}
              </span>
            )}
          </div>

          {/* Missing items warning */}
          {missingItemCount > 0 && (
            <div className="rounded border border-warning/20 bg-warning-bg px-3 py-2">
              <p className="text-xs font-medium text-warning">
                {missingItemCount} items needing attention
              </p>
              <p className="mt-0.5 text-xs text-warning/80">
                {proposal.missingItems?.slice(0, 2).join(", ")}
                {missingItemCount > 2 && ` +${missingItemCount - 2} more items`}
              </p>
            </div>
          )}

          {/* Metadata row */}
          <div className="mt-auto space-y-1.5 border-t border-card-border pt-3">
            {/* Next action */}
            {proposal.nextAction && (
              <div className="flex items-start gap-2 text-xs">
                <span className="mt-0.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                <span className="text-body-muted">{proposal.nextAction}</span>
              </div>
            )}

            {/* Deadline */}
            {deadlineDate && (
              <div className="flex items-center gap-2 text-xs text-body-muted">
                <span>Deadline: {deadlineDate}</span>
              </div>
            )}

            {/* Updated */}
            <div className="flex items-center gap-2 text-xs text-muted">
              <span>Updated: {updatedDate}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
