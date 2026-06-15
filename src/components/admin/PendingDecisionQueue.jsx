"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ProposalStatusBadge } from "@/components/proposal/ProposalStatusBadge";
import { PROPOSAL_STATUSES, STATUS_LABELS } from "@/lib/constants";

const formatDate = (value) => {
  if (!value) return "—";
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
};

const ACTION_REQUIRED_STATUSES = [
  PROPOSAL_STATUSES.SUBMITTED,
  PROPOSAL_STATUSES.UNDER_REVIEW,
  PROPOSAL_STATUSES.NEEDS_REVISION,
  PROPOSAL_STATUSES.APPROVED,
];

/**
 * PendingDecisionQueue — Shows proposals requiring admin/reviewer action
 */
export function PendingDecisionQueue({ proposals = [], onAction }) {
  const pending = proposals.filter((p) =>
    ACTION_REQUIRED_STATUSES.includes(p.status),
  );

  if (!pending.length) {
    return (
      <EmptyState
        title="No pending decisions"
        description="All proposals are up to date."
      />
    );
  }

  return (
    <div className="space-y-3">
      {pending.slice(0, 10).map((proposal) => {
        const decisionLabel =
          proposal.status === PROPOSAL_STATUSES.SUBMITTED
            ? "Assign reviewer"
            : proposal.status === PROPOSAL_STATUSES.UNDER_REVIEW
              ? "Review needed"
              : proposal.status === PROPOSAL_STATUSES.NEEDS_REVISION
                ? "Waiting on student"
                : proposal.status === PROPOSAL_STATUSES.APPROVED
                  ? "Assign supervisor"
                  : "Review";

        const urgency =
          proposal.status === PROPOSAL_STATUSES.SUBMITTED
            ? "high"
            : proposal.status === PROPOSAL_STATUSES.UNDER_REVIEW
              ? "high"
              : proposal.status === PROPOSAL_STATUSES.NEEDS_REVISION
                ? "medium"
                : "low";

        return (
          <div
            key={proposal.id}
            className="flex items-center justify-between gap-4 rounded border border-hairline bg-canvas p-3"
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span
                  className={`h-2 w-2 rounded-full ${
                    urgency === "high"
                      ? "bg-danger"
                      : urgency === "medium"
                        ? "bg-warning"
                        : "bg-success"
                  }`}
                />
                <p className="truncate text-sm font-medium text-ink">
                  {proposal.title}
                </p>
              </div>
              <div className="mt-1 flex items-center gap-3 text-xs text-body-muted">
                <span>{proposal.studentName}</span>
                <ProposalStatusBadge status={proposal.status} />
                <span>Updated {formatDate(proposal.updatedAt)}</span>
              </div>
            </div>
            <div className="flex flex-shrink-0 items-center gap-2">
              <Link
                href={`/proposals/${proposal.id}`}
                className="rounded border border-hairline px-3 py-1.5 text-xs font-medium text-ink transition-colors hover:bg-subdued"
              >
                View
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
