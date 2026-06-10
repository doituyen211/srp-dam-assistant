"use client";

import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ProposalStatusBadge } from "@/components/proposal/ProposalStatusBadge";

/**
 * ReviewTable - Table for reviewing proposals
 * @param {Object} props
 * @param {Array} props.proposals - Array of proposals
 * @param {Object} props.reviews - Map of reviewId -> review object
 * @param {Function} props.onViewDetail - Called with proposalId
 * @param {Function} props.onNeedsRevision - Called with proposalId
 * @param {Function} props.onRecommendApprove - Called with proposalId
 */
export function ReviewTable({
  proposals = [],
  reviews = {},
  onViewDetail,
  onNeedsRevision,
  onRecommendApprove,
}) {
  if (proposals.length === 0) {
    return (
      <EmptyState
        title="Không có đề tài cần xét duyệt"
        description="Danh sách review sẽ xuất hiện khi có đề tài được gửi lên hệ thống."
      />
    );
  }

  return (
    <div className="overflow-x-auto rounded-[10px] border border-hairline bg-canvas">
      <table className="w-full min-w-[840px] border-collapse text-sm">
        <thead className="bg-soft-stone">
          <tr>
            <th className="px-4 py-3 text-left font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-body-muted">
              Đề tài
            </th>
            <th className="px-4 py-3 text-left font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-body-muted">
              Sinh viên
            </th>
            <th className="px-4 py-3 text-left font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-body-muted">
              Lĩnh vực
            </th>
            <th className="px-4 py-3 text-left font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-body-muted">
              Trạng thái
            </th>
            <th className="px-4 py-3 text-left font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-body-muted">
              Điểm
            </th>
            <th className="px-4 py-3 text-left font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-body-muted">
              Hành động
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-hairline">
          {proposals.map((proposal) => {
            const review = reviews[proposal.id];
            const score = review?.totalScore || "-";

            return (
              <tr
                key={proposal.id}
                className="transition-colors hover:bg-[#fafafa]"
              >
                <td className="px-4 py-3">
                  <p className="line-clamp-1 font-medium text-ink">
                    {proposal.title}
                  </p>
                </td>
                <td className="px-4 py-3 text-body-muted">
                  {proposal.studentName}
                </td>
                <td className="px-4 py-3">
                  <span className="rounded bg-soft-stone px-2 py-1 text-xs text-body-muted">
                    {proposal.field}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <ProposalStatusBadge status={proposal.status} />
                </td>
                <td className="px-4 py-3 font-mono text-sm font-medium text-action-blue">
                  {score}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="ghost"
                      onClick={() => onViewDetail?.(proposal.id)}
                      className="px-3 py-2 text-xs"
                    >
                      Chi tiết
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => onNeedsRevision?.(proposal.id)}
                      className="px-3 py-2 text-xs text-warning"
                    >
                      Sửa
                    </Button>
                    <Button
                      onClick={() => onRecommendApprove?.(proposal.id)}
                      className="px-3 py-2 text-xs"
                    >
                      Phê
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
