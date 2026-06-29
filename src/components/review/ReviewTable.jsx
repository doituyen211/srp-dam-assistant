"use client";

import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ProposalStatusBadge } from "@/components/proposal/ProposalStatusBadge";
import { WORKFLOW_STAGES } from "@/lib/constants";

const formatDate = (value) => {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
};

function getDaysSince(dateStr) {
  if (!dateStr) return null;
  const diff = (new Date() - new Date(dateStr)) / (1000 * 60 * 60 * 24);
  return Math.round(diff);
}

function getUrgencyLabel(days) {
  if (days === null) return null;
  if (days <= 0) return { label: "Overdue", color: "text-danger" };
  if (days <= 7) return { label: `${days}d left`, color: "text-danger" };
  if (days <= 14) return { label: `${days}d left`, color: "text-warning" };
  return null;
}

function getRiskLevel(proposal) {
  const flags = proposal.riskFlags || [];
  if (flags.length > 1) return { level: "high", label: "High", color: "text-danger bg-danger-bg" };
  if (flags.length === 1) return { level: "medium", label: "Medium", color: "text-warning bg-warning-bg" };
  const score = proposal.readinessScore || proposal.aiScore || 10;
  if (score < 5) return { level: "high", label: "High", color: "text-danger bg-danger-bg" };
  if (score < 7) return { level: "medium", label: "Medium", color: "text-warning bg-warning-bg" };
  return { level: "low", label: "Low", color: "text-success bg-success-bg" };
}

/**
 * ReviewTable — Enhanced review queue table with risk level, deadline, AI flags
 */
export function ReviewTable({
  proposals = [],
  reviews = {},
  selectedId,
  onSelectProposal,
  onNeedsRevision,
  onRecommendApprove,
  onReject,
}) {
  if (proposals.length === 0) {
    return (
      <EmptyState
        title="No proposals in review queue"
        description="When students submit proposals or proposals need revision, they will appear here."
      />
    );
  }

  return (
    <div className="overflow-x-auto rounded border border-hairline bg-canvas">
      <table className="w-full min-w-[1000px] border-collapse text-sm">
        <thead className="bg-subdued">
          <tr>
            <th className="px-4 py-3 text-left font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-muted">
              Proposal
            </th>
            <th className="px-4 py-3 text-left font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-muted">
              Student
            </th>
            <th className="px-4 py-3 text-left font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-muted">
              Status
            </th>
            <th className="px-4 py-3 text-left font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-muted">
              Readiness
            </th>
            <th className="px-4 py-3 text-left font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-muted">
              AI Risk
            </th>
            <th className="px-4 py-3 text-left font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-muted">
              Deadline
            </th>
            <th className="px-4 py-3 text-left font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-muted">
              Waited
            </th>
            <th className="px-4 py-3 text-right font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-muted">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-hairline">
          {proposals.map((proposal) => {
            const risk = getRiskLevel(proposal);
            const review = reviews[proposal.id];
            const rubricScore = review?.totalScore;
            const isSelected = selectedId === proposal.id;

            const deadlineDays = proposal.deadline
              ? Math.round(
                  (new Date(proposal.deadline) - new Date()) /
                    (1000 * 60 * 60 * 24),
                )
              : null;
            const urgency = getUrgencyLabel(deadlineDays);
            const waitedDays = getDaysSince(proposal.submittedAt || proposal.updatedAt);

            return (
              <tr
                key={proposal.id}
                className={`cursor-pointer transition-colors hover:bg-subdued/50 ${
                  isSelected ? "bg-primary/5" : ""
                }`}
                onClick={() => onSelectProposal?.(proposal.id)}
              >
                <td className="px-4 py-4">
                  <p className="max-w-xs truncate font-medium text-ink">
                    {proposal.title}
                  </p>
                  <p className="mt-0.5 text-xs text-body-muted">
                    {proposal.researchField || proposal.field}
                  </p>
                </td>
                <td className="px-4 py-4 text-body-muted">
                  {proposal.studentName}
                </td>
                <td className="px-4 py-4">
                  <ProposalStatusBadge status={proposal.status} />
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-medium text-ink">
                      {proposal.readinessScore?.toFixed(1) ||
                        proposal.aiScore?.toFixed(1) ||
                        "—"}
                    </span>
                    {rubricScore && (
                      <span className="font-mono text-xs text-muted">
                        (R: {rubricScore.toFixed(1)})
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span
                    className={`inline-flex rounded px-2 py-0.5 font-mono text-[10px] font-medium ${risk.color}`}
                  >
                    {risk.label}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <span className="text-body-muted">
                      {formatDate(proposal.deadline)}
                    </span>
                    {urgency && (
                      <span className={`font-mono text-[10px] ${urgency.color}`}>
                        {urgency.label}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className="text-body-muted">
                    {waitedDays !== null ? `${waitedDays}d` : "—"}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div
                    className="flex justify-end gap-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button
                      variant="ghost"
                      className="px-2.5 py-1.5 text-xs"
                      onClick={() => onSelectProposal?.(proposal.id)}
                    >
                      Review
                    </Button>
                    <Button
                      variant="secondary"
                      className="px-2.5 py-1.5 text-xs text-warning"
                      onClick={() => onNeedsRevision?.(proposal.id)}
                    >
                      Revise
                    </Button>
                    <Button
                      className="px-2.5 py-1.5 text-xs"
                      onClick={() => onRecommendApprove?.(proposal.id)}
                    >
                      Approve
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
