"use client";

import { Button } from "@/components/ui/Button";
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
      <div className="text-center py-8 text-slate-500">
        Không có đề tài cần xét duyệt
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="px-4 py-3 text-left font-semibold text-slate-700">
              Đề tài
            </th>
            <th className="px-4 py-3 text-left font-semibold text-slate-700">
              Sinh viên
            </th>
            <th className="px-4 py-3 text-left font-semibold text-slate-700">
              Lĩnh vực
            </th>
            <th className="px-4 py-3 text-left font-semibold text-slate-700">
              Trạng thái
            </th>
            <th className="px-4 py-3 text-left font-semibold text-slate-700">
              Điểm
            </th>
            <th className="px-4 py-3 text-left font-semibold text-slate-700">
              Hành động
            </th>
          </tr>
        </thead>
        <tbody>
          {proposals.map((proposal) => {
            const review = reviews[proposal.id];
            const score = review?.totalScore || "-";

            return (
              <tr
                key={proposal.id}
                className="border-b border-slate-200 hover:bg-blue-50 transition-colors"
              >
                <td className="px-4 py-3">
                  <p className="font-medium text-slate-900 line-clamp-1">
                    {proposal.title}
                  </p>
                </td>
                <td className="px-4 py-3 text-slate-700">
                  {proposal.studentName}
                </td>
                <td className="px-4 py-3 text-slate-700">{proposal.field}</td>
                <td className="px-4 py-3">
                  <ProposalStatusBadge status={proposal.status} />
                </td>
                <td className="px-4 py-3 font-semibold text-blue-600">
                  {score}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      onClick={() => onViewDetail?.(proposal.id)}
                      className="text-xs"
                    >
                      Chi tiết
                    </Button>
                    <button
                      onClick={() => onNeedsRevision?.(proposal.id)}
                      className="text-xs text-amber-600 hover:text-amber-700 font-medium"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => onRecommendApprove?.(proposal.id)}
                      className="text-xs text-green-600 hover:text-green-700 font-medium"
                    >
                      Phê
                    </button>
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
