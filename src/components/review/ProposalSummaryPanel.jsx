"use client";

import { ProposalStatusBadge } from "@/components/proposal/ProposalStatusBadge";
import { WORKFLOW_STAGES } from "@/lib/constants";

const formatDate = (value) => {
  if (!value) return "N/A";
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
};

/**
 * ProposalSummaryPanel — Compact proposal metadata for review detail view
 */
export function ProposalSummaryPanel({ proposal }) {
  if (!proposal) return null;

  const stage = WORKFLOW_STAGES.find((s) => s.status === proposal.status);
  const readiness = proposal.readinessScore || proposal.aiScore || 0;

  return (
    <div className="rounded border border-hairline bg-canvas p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-semibold text-ink">
            {proposal.title || "Untitled"}
          </h3>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <ProposalStatusBadge status={proposal.status} />
            {stage && (
              <span className="text-xs text-body-muted">
                Stage {stage.order} · {stage.label}
              </span>
            )}
          </div>
        </div>

        <div className="text-right">
          <div className="text-2xl font-semibold text-primary">
            {readiness > 0 ? readiness.toFixed(1) : "—"}
          </div>
          <div className="text-xs text-body-muted">Readiness</div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.06em] text-muted">
            Student
          </div>
          <div className="mt-0.5 text-sm font-medium text-ink">
            {proposal.studentName || "N/A"}
          </div>
        </div>
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.06em] text-muted">
            Field
          </div>
          <div className="mt-0.5 text-sm font-medium text-ink">
            {proposal.researchField || proposal.field || "N/A"}
          </div>
        </div>
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.06em] text-muted">
            Submitted
          </div>
          <div className="mt-0.5 text-sm font-medium text-ink">
            {formatDate(proposal.submittedAt || proposal.createdAt)}
          </div>
        </div>
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.06em] text-muted">
            Deadline
          </div>
          <div className="mt-0.5 text-sm font-medium text-ink">
            {formatDate(proposal.deadline)}
          </div>
        </div>
      </div>

      {proposal.missingItems?.length > 0 && (
        <div className="mt-3 rounded border border-warning/20 bg-warning-bg px-3 py-2">
          <span className="text-xs font-medium text-warning">
            Items needing attention: {proposal.missingItems.join(", ")}
          </span>
        </div>
      )}
    </div>
  );
}
