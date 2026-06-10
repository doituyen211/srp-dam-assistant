"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { AIFeedbackPanel, RubricScoreCard } from "@/components/ai";
import { AppShell } from "@/components/layout/AppShell";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { ProposalStatusBadge } from "@/components/proposal/ProposalStatusBadge";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingState } from "@/components/ui/LoadingState";
import { api } from "@/lib/api";
import { mockMilestones } from "@/lib/mockData";

const milestoneLabels = {
  completed: "Hoàn thành",
  "in-progress": "Đang thực hiện",
  "not-started": "Chưa bắt đầu",
};

const milestoneStyles = {
  completed: "bg-pale-green text-success",
  "in-progress": "bg-pale-blue text-action-blue",
  "not-started": "bg-soft-stone text-body-muted",
};

const formatDate = (value) => {
  if (!value) return "Chưa cập nhật";

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
};

function DetailSection({ title, children }) {
  return (
    <section className="space-y-2 border-b border-card-border pb-5 last:border-b-0 last:pb-0">
      <h2 className="text-base font-medium text-ink">{title}</h2>
      <p className="text-sm leading-7 text-body-muted">
        {children || "Chưa có thông tin."}
      </p>
    </section>
  );
}

function Milestones({ items }) {
  if (!items.length) {
    return (
      <EmptyState
        icon="🗓️"
        title="Chưa có milestones"
        description="Các mốc tiến độ sẽ được hiển thị khi đề tài có kế hoạch triển khai."
        className="py-8"
      />
    );
  }

  return (
    <div className="space-y-4">
      {items.map((milestone) => (
        <div
          key={milestone.id}
          className="rounded-lg border border-hairline bg-canvas p-4"
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h3 className="font-medium text-ink">
                {milestone.name}
              </h3>
              <p className="mt-1 text-sm leading-5 text-body-muted">
                {milestone.description}
              </p>
            </div>
            <span
              className={`inline-flex w-fit items-center rounded-full px-2.5 py-1 font-mono text-[11px] font-medium leading-none ${
                milestoneStyles[milestone.status] || milestoneStyles["not-started"]
              }`}
            >
              {milestoneLabels[milestone.status] || milestone.status}
            </span>
          </div>

          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-xs text-muted">
              <span>Hạn: {formatDate(milestone.dueDate)}</span>
              <span>{milestone.progress || 0}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-soft-stone">
              <div
                className="h-full rounded-full bg-deep-green"
                style={{ width: `${milestone.progress || 0}%` }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyRubricCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Đánh giá theo tiêu chí</CardTitle>
      </CardHeader>
      <CardContent>
        <Alert type="info" title="Chưa có đánh giá">
          Rubric review sẽ xuất hiện sau khi hội đồng chấm đề tài.
        </Alert>
      </CardContent>
    </Card>
  );
}

function ProposalDetailContent() {
  const params = useParams();
  const proposalId = params?.id;
  const [proposal, setProposal] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [rubricReview, setRubricReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadDetail = async () => {
      setLoading(true);
      setNotFound(false);
      setError("");

      try {
        const proposalData = await api.getProposalById(proposalId);

        const [feedbackResult, reviewResult] = await Promise.allSettled([
          api.getAIFeedback(proposalId),
          api.getRubricReview(proposalId),
        ]);

        if (!mounted) return;

        const feedbackData =
          feedbackResult.status === "fulfilled" ? feedbackResult.value : null;
        const reviewData =
          reviewResult.status === "fulfilled" ? reviewResult.value : null;

        setProposal(proposalData);
        setFeedback(
          feedbackData?.proposalId === proposalId ? feedbackData : null,
        );
        setRubricReview(reviewData || null);
        if (
          feedbackResult.status === "rejected" ||
          reviewResult.status === "rejected"
        ) {
          setError(
            "Một phần dữ liệu đánh giá chưa tải được. Bạn vẫn có thể xem thông tin đề tài.",
          );
        }
      } catch {
        if (!mounted) return;
        setProposal(null);
        setFeedback(null);
        setRubricReview(null);
        setNotFound(true);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    if (proposalId) {
      loadDetail();
    }

    return () => {
      mounted = false;
    };
  }, [proposalId]);

  const milestones = useMemo(() => {
    return mockMilestones.filter(
      (milestone) => milestone.proposalId === proposalId,
    );
  }, [proposalId]);

  const handleRunAIFeedback = async () => {
    setAiLoading(true);
    setAiError("");

    try {
      const nextFeedback = await api.runAIFeedback(proposalId);
      setFeedback(nextFeedback);
    } catch {
      setAiError("Chưa thể chạy AI Feedback. Vui lòng thử lại sau ít phút.");
    } finally {
      setAiLoading(false);
    }
  };

  if (loading) {
    return <LoadingState message="Đang tải chi tiết đề tài..." />;
  }

  if (notFound) {
    return (
      <Card className="mx-auto max-w-2xl">
        <EmptyState
          icon="🔎"
          title="Không tìm thấy đề tài"
          description="Đề tài này có thể đã bị xóa hoặc không còn tồn tại trong dữ liệu demo."
          action={
            <Link
              href="/proposals"
              className="inline-flex items-center justify-center rounded-pill bg-primary px-5 py-2.5 text-sm font-medium text-white transition-all hover:-translate-y-px hover:bg-[#2d2d35] focus:outline-none focus:ring-2 focus:ring-focus-blue/30 focus:ring-offset-2"
            >
              Quay lại danh sách
            </Link>
          }
        />
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
            {proposal?.field || "Chưa phân loại"}
          </p>
          <h1 className="mt-2 text-2xl font-medium leading-tight tracking-[-0.02em] text-ink md:text-3xl">
            {proposal?.title || "Đề tài chưa có tiêu đề"}
          </h1>
          <p className="mt-2 text-sm text-body-muted">
            {proposal?.studentName || "Chưa có sinh viên"} · Cập nhật{" "}
            {formatDate(proposal?.updatedAt)}
          </p>
        </div>

        <Link
          href="/proposals"
          className="inline-flex items-center justify-center rounded-lg border border-hairline px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-soft-stone focus:outline-none focus:ring-2 focus:ring-focus-blue/30 focus:ring-offset-2"
        >
          Quay lại
        </Link>
      </div>

      {error && (
        <Alert type="error" title="Không tải đủ dữ liệu">
          {error}
        </Alert>
      )}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin đề tài</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg bg-soft-stone p-4">
                  <p className="font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-muted">
                    Lĩnh vực
                  </p>
                  <p className="mt-2 text-sm font-medium text-ink">
                    {proposal?.field || "Chưa cập nhật"}
                  </p>
                </div>
                <div className="rounded-lg bg-soft-stone p-4">
                  <p className="font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-muted">
                    Điểm AI hiện tại
                  </p>
                  <p className="mt-2 text-sm font-medium text-ink">
                    {proposal?.aiScore ? `${proposal.aiScore.toFixed(1)}/10` : "N/A"}
                  </p>
                </div>
              </div>

              <DetailSection title="Problem">
                {proposal?.problem}
              </DetailSection>
              <DetailSection title="Objectives">
                {proposal?.objectives}
              </DetailSection>
              <DetailSection title="Methodology">
                {proposal?.methodology}
              </DetailSection>
              <DetailSection title="Feasibility">
                {proposal?.feasibility}
              </DetailSection>
              {proposal?.expectedImpact && (
                <DetailSection title="Expected impact">
                  {proposal.expectedImpact}
                </DetailSection>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Milestones</CardTitle>
            </CardHeader>
            <CardContent>
              <Milestones items={milestones} />
            </CardContent>
          </Card>
        </div>

        <aside className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Trạng thái</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ProposalStatusBadge status={proposal?.status} />
              <div className="space-y-1 rounded-lg bg-soft-stone p-3 text-sm text-body-muted">
                <p>Tạo: {formatDate(proposal?.createdAt)}</p>
                <p>Cập nhật: {formatDate(proposal?.updatedAt)}</p>
              </div>
            </CardContent>
          </Card>

          {aiError && (
            <Alert type="error" title="AI Feedback lỗi">
              {aiError}
            </Alert>
          )}

          <AIFeedbackPanel
            feedback={feedback}
            loading={aiLoading}
            isEmpty={!feedback}
          />

          {rubricReview ? (
            <RubricScoreCard review={rubricReview} />
          ) : (
            <EmptyRubricCard />
          )}

          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                className="w-full"
                loading={aiLoading}
                disabled={aiLoading}
                onClick={handleRunAIFeedback}
              >
                Run AI Feedback
              </Button>
              <Link
                href="/proposals"
                className="inline-flex w-full items-center justify-center rounded-lg border border-hairline px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-soft-stone focus:outline-none focus:ring-2 focus:ring-focus-blue/30 focus:ring-offset-2"
              >
                Quay lại danh sách
              </Link>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}

export default function ProposalDetailPage() {
  return (
    <ProtectedRoute>
      <AppShell>
        <ProposalDetailContent />
      </AppShell>
    </ProtectedRoute>
  );
}
