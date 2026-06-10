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

  return (
    <Link href={`/proposals/${proposal.id}`}>
      <Card className="cursor-pointer hover:shadow-md transition-shadow">
        <CardContent className="py-4">
          <div className="space-y-3">
            {/* Title */}
            <h3 className="font-semibold text-slate-900 line-clamp-2 hover:text-blue-600">
              {proposal.title}
            </h3>

            {/* Meta Info */}
            <div className="flex flex-wrap gap-2 text-sm text-slate-600">
              <span>📚 {proposal.field}</span>
              <span>👤 {proposal.studentName}</span>
            </div>

            {/* Status & Score */}
            <div className="flex items-center justify-between">
              <ProposalStatusBadge status={proposal.status} />
              {proposal.aiScore > 0 && (
                <span className="text-sm font-medium text-blue-600">
                  AI: {proposal.aiScore.toFixed(1)}/10
                </span>
              )}
            </div>

            {/* Updated Date */}
            <p className="text-xs text-slate-500">Cập nhật: {updatedDate}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
