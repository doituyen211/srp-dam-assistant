"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { ProposalStatusBadge } from "@/components/proposal/ProposalStatusBadge";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingState } from "@/components/ui/LoadingState";
import { api } from "@/lib/api";
import { PROPOSAL_STATUSES, USER_ROLES } from "@/lib/constants";

const reviewableStatuses = [
  PROPOSAL_STATUSES.SUBMITTED,
  PROPOSAL_STATUSES.UNDER_REVIEW,
  PROPOSAL_STATUSES.NEEDS_REVISION,
  PROPOSAL_STATUSES.APPROVED,
];

const formatDate = (value) => {
  if (!value) return "Chưa cập nhật";

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
};

function RubricPreview({ review }) {
  if (!review) {
    return (
      <div className="text-sm text-muted">
        Chưa có rubric
      </div>
    );
  }

  const topCriteria = (review.criteria || []).slice(0, 2);

  return (
    <div className="min-w-40 space-y-2">
      <div className="font-mono text-sm font-medium text-action-blue">
        {review.totalScore?.toFixed(1) || "N/A"}/10
      </div>
      <div className="space-y-1">
        {topCriteria.map((criterion) => (
          <div
            key={criterion.name}
            className="flex items-center justify-between gap-3 text-xs text-muted"
          >
            <span className="truncate">{criterion.name}</span>
            <span className="font-medium text-ink">
              {criterion.score}/{criterion.maxScore}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReviewRows({
  proposals,
  reviewsByProposal,
  pendingAction,
  onNeedsRevision,
  onRecommendApprove,
}) {
  return (
    <div className="overflow-x-auto rounded-[10px] border border-hairline bg-canvas">
      <table className="w-full min-w-[920px] border-collapse text-sm">
        <thead className="bg-soft-stone">
          <tr>
            <th className="px-4 py-3 text-left font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-body-muted">
              Đề tài
            </th>
            <th className="px-4 py-3 text-left font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-body-muted">
              Sinh viên
            </th>
            <th className="px-4 py-3 text-left font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-body-muted">
              Rubric preview
            </th>
            <th className="px-4 py-3 text-left font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-body-muted">
              Status
            </th>
            <th className="px-4 py-3 text-right font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-body-muted">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-hairline">
          {proposals.map((proposal) => {
            const pendingNeedsRevision =
              pendingAction === `${proposal.id}:revision`;
            const pendingApprove = pendingAction === `${proposal.id}:approve`;
            const isPending = pendingNeedsRevision || pendingApprove;

            return (
              <tr key={proposal.id} className="align-top transition-colors hover:bg-[#fafafa]">
                <td className="px-4 py-4">
                  <p className="max-w-md font-medium text-ink">
                    {proposal.title || "Đề tài chưa có tiêu đề"}
                  </p>
                  <p className="mt-1 text-xs text-body-muted">
                    {proposal.field || "Chưa phân loại"} · Cập nhật{" "}
                    {formatDate(proposal.updatedAt)}
                  </p>
                </td>
                <td className="px-4 py-4 text-body-muted">
                  {proposal.studentName || "Chưa cập nhật"}
                </td>
                <td className="px-4 py-4">
                  <RubricPreview review={reviewsByProposal[proposal.id]} />
                </td>
                <td className="px-4 py-4">
                  <ProposalStatusBadge status={proposal.status} />
                </td>
                <td className="px-4 py-4">
                  <div className="flex flex-wrap justify-end gap-2">
                    <Link
                      href={`/proposals/${proposal.id}`}
                      className="inline-flex items-center justify-center rounded-lg border border-hairline px-3 py-2 text-xs font-medium text-ink transition-colors hover:bg-soft-stone focus:outline-none focus:ring-2 focus:ring-focus-blue/30 focus:ring-offset-2"
                    >
                      View detail
                    </Link>
                    <Button
                      variant="secondary"
                      className="px-3 py-2 text-xs"
                      loading={pendingNeedsRevision}
                      disabled={isPending}
                      onClick={() => onNeedsRevision(proposal.id)}
                    >
                      Mark needs revision
                    </Button>
                    <Button
                      className="px-3 py-2 text-xs"
                      loading={pendingApprove}
                      disabled={isPending}
                      onClick={() => onRecommendApprove(proposal.id)}
                    >
                      Recommend approve
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

function ReviewPageContent() {
  const [proposals, setProposals] = useState([]);
  const [reviewsByProposal, setReviewsByProposal] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [pendingAction, setPendingAction] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadReviewData = async () => {
      setLoading(true);
      setError("");
      setMessage("");

      try {
        const proposalData = await api.getProposals();
        const proposalsList = Array.isArray(proposalData) ? proposalData : [];

        const reviewResults = await Promise.allSettled(
          proposalsList.map((proposal) => api.getRubricReview(proposal.id)),
        );

        if (!mounted) return;

        const nextReviews = {};
        reviewResults.forEach((result, index) => {
          if (result.status === "fulfilled" && result.value) {
            nextReviews[proposalsList[index].id] = result.value;
          }
        });

        setProposals(proposalsList);
        setReviewsByProposal(nextReviews);

        if (reviewResults.some((result) => result.status === "rejected")) {
          setError(
            "Một phần rubric chưa tải được. Bạn vẫn có thể thao tác với danh sách đề tài.",
          );
        }
      } catch {
        if (!mounted) return;
        setError("Không thể tải dữ liệu review. Vui lòng thử lại sau.");
        setProposals([]);
        setReviewsByProposal({});
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadReviewData();

    return () => {
      mounted = false;
    };
  }, []);

  const reviewQueue = useMemo(() => {
    return proposals
      .filter((proposal) => reviewableStatuses.includes(proposal.status))
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  }, [proposals]);

  const handleStatusUpdate = async (proposalId, nextStatus, actionType) => {
    setPendingAction(`${proposalId}:${actionType}`);
    setError("");
    setMessage("");

    try {
      const updatedProposal = await api.updateProposal(proposalId, {
        status: nextStatus,
      });

      setProposals((current) =>
        current.map((proposal) =>
          proposal.id === proposalId ? updatedProposal : proposal,
        ),
      );

      setMessage(
        nextStatus === PROPOSAL_STATUSES.APPROVED
          ? "Đã ghi nhận khuyến nghị phê duyệt cho đề tài."
          : "Đã chuyển đề tài sang trạng thái cần chỉnh sửa.",
      );
    } catch {
      setError("Chưa thể cập nhật trạng thái đề tài. Vui lòng thử lại.");
    } finally {
      setPendingAction("");
    }
  };

  if (loading) {
    return <LoadingState message="Đang tải reviewer dashboard..." />;
  }

  return (
    <div className="space-y-6">
      <Card className="border-primary bg-primary text-white">
        <CardContent className="p-6 md:p-8">
          <p className="font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-white/45">
            Reviewer dashboard
          </p>
          <h1 className="mt-3 text-2xl font-medium leading-tight tracking-[-0.02em] md:text-4xl">
            Quyết định cuối cùng nằm ở reviewer
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-white/65 md:text-base">
            Dùng rubric, phản hồi AI và nội dung chi tiết để đưa ra khuyến nghị:
            yêu cầu chỉnh sửa hoặc phê duyệt đề tài cho vòng tiếp theo.
          </p>
        </CardContent>
      </Card>

      {message && (
        <Alert type="success" title="Cập nhật thành công" closable>
          {message}
        </Alert>
      )}

      {error && (
        <Alert type="error" title="Có lỗi xảy ra">
          {error}
        </Alert>
      )}

      <Card>
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Danh sách đề tài cần review</CardTitle>
            <p className="mt-1 text-sm text-body-muted">
              {reviewQueue.length} đề tài đang ở trạng thái reviewer cần theo
              dõi.
            </p>
          </div>
        </CardHeader>
        <CardContent>
          {reviewQueue.length === 0 ? (
            <EmptyState
              icon="✅"
              title="Không có đề tài cần review"
              description="Khi sinh viên gửi đề tài hoặc có đề tài cần chỉnh sửa, danh sách sẽ xuất hiện tại đây."
            />
          ) : (
            <ReviewRows
              proposals={reviewQueue}
              reviewsByProposal={reviewsByProposal}
              pendingAction={pendingAction}
              onNeedsRevision={(proposalId) =>
                handleStatusUpdate(
                  proposalId,
                  PROPOSAL_STATUSES.NEEDS_REVISION,
                  "revision",
                )
              }
              onRecommendApprove={(proposalId) =>
                handleStatusUpdate(
                  proposalId,
                  PROPOSAL_STATUSES.APPROVED,
                  "approve",
                )
              }
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function ReviewPage() {
  return (
    <ProtectedRoute allowedRoles={[USER_ROLES.REVIEWER, USER_ROLES.ADMIN]}>
      <AppShell>
        <ReviewPageContent />
      </AppShell>
    </ProtectedRoute>
  );
}
