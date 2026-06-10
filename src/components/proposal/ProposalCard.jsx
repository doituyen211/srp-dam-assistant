"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/Card";
import { ProposalStatusBadge } from "./ProposalStatusBadge";

/**
 * ProposalCard - Card to display proposal summary
 * @param {Object} props
 * @param {Object} props.proposal
 * @param {string} props.proposal.id
 * @param {string} props.proposal.title
 * @param {string} props.proposal.field
 * @param {string} props.proposal.studentName
 * @param {string} props.proposal.status
 * @param {number} props.proposal.aiScore
 * @param {string} props.proposal.updatedAt
 */
export function ProposalCard({ proposal }) {
  const updatedDate = new Date(proposal.updatedAt).toLocaleDateString("vi-VN");
  const scoreLabel =
    proposal.aiScore > 10
      ? `${Math.round(proposal.aiScore)}/100`
      : `${proposal.aiScore?.toFixed(1)}/10`;

  return (
    <Link href={`/proposals/${proposal.id}`} className="group block h-full">
      <Card className="h-full cursor-pointer transition-all duration-150 hover:border-[#aaa] hover:shadow-card">
        <CardContent className="flex h-full flex-col gap-4 p-5">
          <div className="flex items-start justify-between gap-3">
            <h3 className="line-clamp-2 text-[15px] font-medium leading-6 text-ink transition-colors group-hover:text-deep-green">
              {proposal.title}
            </h3>
            {proposal.aiScore > 0 && (
              <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-soft-stone text-[13px] font-semibold text-deep-green">
                {Math.round(proposal.aiScore)}
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="rounded bg-soft-stone px-2 py-1 text-xs text-body-muted">
              {proposal.field}
            </span>
            <span className="rounded bg-[#f8f8f5] px-2 py-1 text-xs text-body-muted">
              {proposal.studentName}
            </span>
          </div>

          <div className="mt-auto flex items-center justify-between gap-3 border-t border-card-border pt-4">
            <ProposalStatusBadge status={proposal.status} />
            <div className="text-right">
              {proposal.aiScore > 0 && (
                <p className="font-mono text-[11px] font-medium text-action-blue">
                  AI {scoreLabel}
                </p>
              )}
              <p className="mt-1 text-xs text-muted">Cập nhật {updatedDate}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
