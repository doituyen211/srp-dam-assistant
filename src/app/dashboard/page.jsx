"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { Alert } from "@/components/ui/Alert";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingState } from "@/components/ui/LoadingState";
import { ProposalStatusBadge } from "@/components/proposal/ProposalStatusBadge";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import { PROPOSAL_STATUSES, USER_ROLES } from "@/lib/constants";

const roleLabels = {
  [USER_ROLES.STUDENT]: "Sinh viên",
  [USER_ROLES.REVIEWER]: "Reviewer",
  [USER_ROLES.ADMIN]: "Admin",
  [USER_ROLES.LECTURER]: "Giảng viên",
};

const formatDate = (value) => {
  if (!value) return "Chưa cập nhật";

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
};

const getQuickActions = (role) => {
  if (role === USER_ROLES.STUDENT) {
    return [
      {
        title: "Tạo đề xuất mới",
        description: "Bắt đầu soạn đề tài và nhận góp ý AI.",
        href: "/proposals/new",
        label: "Tạo đề xuất",
        primary: true,
      },
      {
        title: "Đề tài của tôi",
        description: "Theo dõi trạng thái và các phản hồi mới nhất.",
        href: "/proposals",
        label: "Xem đề tài",
      },
    ];
  }

  if (role === USER_ROLES.REVIEWER || role === USER_ROLES.ADMIN) {
    return [
      {
        title: "Hàng đợi review",
        description: "Mở danh sách đề tài đang cần đánh giá.",
        href: "/review",
        label: "Tới review",
        primary: true,
      },
      {
        title: "Matching giảng viên",
        description: "Xem gợi ý phân công người hướng dẫn phù hợp.",
        href: "/matching",
        label: "Tới matching",
      },
    ];
  }

  return [
    {
      title: "Gợi ý matching",
      description: "Xem các đề tài phù hợp với chuyên môn hướng dẫn.",
      href: "/matching",
      label: "Xem matching",
      primary: true,
    },
    {
      title: "Danh sách đề tài",
      description: "Theo dõi các đề xuất đang được xử lý.",
      href: "/proposals",
      label: "Xem proposals",
    },
  ];
};

const getRoleSummary = (role, stats, proposals) => {
  const revisionCount = proposals.filter(
    (proposal) => proposal.status === PROPOSAL_STATUSES.NEEDS_REVISION,
  ).length;

  if (role === USER_ROLES.STUDENT) {
    return `Bạn có ${revisionCount} đề tài cần chỉnh sửa. Hãy ưu tiên hoàn thiện mục tiêu, phương pháp và tính khả thi trước khi gửi lại.`;
  }

  if (role === USER_ROLES.REVIEWER || role === USER_ROLES.ADMIN) {
    return `Có ${stats.underReview || 0} đề tài đang review. Các đề tài có điểm AI thấp hoặc cần chỉnh sửa nên được kiểm tra trước.`;
  }

  return `Có ${stats.totalProposals || 0} đề tài trong hệ thống. Xem matching để chọn đề tài phù hợp với chuyên môn và tải hướng dẫn hiện tại.`;
};

function DashboardContent() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadDashboard = async () => {
      setLoading(true);
      setError("");

      try {
        const [dashboardStats, proposalList] = await Promise.all([
          api.getDashboardStats(),
          api.getProposals(),
        ]);

        if (!mounted) return;

        setStats(dashboardStats || {});
        setProposals(Array.isArray(proposalList) ? proposalList : []);
      } catch {
        if (!mounted) return;
        setError("Chưa thể tải dashboard. Vui lòng thử lại sau ít phút.");
        setStats(null);
        setProposals([]);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadDashboard();

    return () => {
      mounted = false;
    };
  }, []);

  const visibleProposals = useMemo(() => {
    if (!user) return [];

    const roleScoped =
      user.role === USER_ROLES.STUDENT
        ? proposals.filter((proposal) => proposal.studentId === user.id)
        : proposals;

    return [...roleScoped]
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .slice(0, 4);
  }, [proposals, user]);

  const revisionCount = proposals.filter(
    (proposal) => proposal.status === PROPOSAL_STATUSES.NEEDS_REVISION,
  ).length;

  const statCards = [
    {
      label: "Tổng đề tài",
      value: stats?.totalProposals ?? proposals.length,
      helper: "Tất cả đề xuất trong hệ thống",
    },
    {
      label: "Đang review",
      value: stats?.underReview ?? 0,
      helper: "Đang được hội đồng xem xét",
    },
    {
      label: "Đã duyệt",
      value: stats?.approvedProposals ?? 0,
      helper: "Đủ điều kiện triển khai",
    },
    {
      label: "Cần chỉnh sửa",
      value: revisionCount,
      helper: "Cần bổ sung trước vòng tiếp theo",
    },
  ];

  const quickActions = getQuickActions(user?.role);

  if (loading) {
    return <LoadingState message="Đang tải dashboard..." />;
  }

  if (error) {
    return (
      <div className="max-w-3xl">
        <Alert type="error" title="Không tải được dữ liệu">
          {error}
        </Alert>
        <Button className="mt-4" onClick={() => window.location.reload()}>
          Tải lại
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-primary bg-primary text-white">
        <CardContent className="grid gap-6 p-6 md:grid-cols-[1.5fr_1fr] md:p-8">
          <div className="space-y-4">
            <Badge className="bg-white/10 text-white">
              {roleLabels[user?.role] || "Người dùng"}
            </Badge>
            <div>
              <h1 className="text-2xl font-medium leading-tight tracking-[-0.02em] md:text-4xl">
                Chào mừng, {user?.name || "bạn"}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/65 md:text-base">
                Dashboard tóm tắt tình hình đề tài, việc cần xử lý và các bước
                tiếp theo theo vai trò của bạn.
              </p>
            </div>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/5 p-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-white/45">
              Khoa/đơn vị
            </p>
            <p className="mt-2 text-lg font-medium">
              {user?.department || "Chưa cập nhật"}
            </p>
            <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.12em] text-white/45">
              Email
            </p>
            <p className="mt-2 break-words text-sm font-medium text-white/85">
              {user?.email || "Chưa cập nhật"}
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((item) => (
          <Card key={item.label}>
            <CardContent className="p-5">
              <p className="font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-muted">
                {item.label}
              </p>
              <p className="mt-3 text-3xl font-medium leading-none text-ink">
                {item.value}
              </p>
              <p className="mt-3 text-sm leading-5 text-body-muted">
                {item.helper}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.45fr_1fr]">
        <Card>
          <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Recent proposals</CardTitle>
              <p className="mt-1 text-sm text-body-muted">
                Các đề tài cập nhật gần đây nhất.
              </p>
            </div>
            <Link
              href="/proposals"
              className="inline-flex items-center justify-center rounded-lg border border-hairline px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-soft-stone focus:outline-none focus:ring-2 focus:ring-focus-blue/30 focus:ring-offset-2"
            >
              Xem tất cả
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            {visibleProposals.length === 0 ? (
              <EmptyState
                icon="📄"
                title="Chưa có đề tài gần đây"
                description="Khi có đề xuất mới hoặc cập nhật trạng thái, danh sách sẽ hiển thị tại đây."
                className="py-10"
              />
            ) : (
              <div className="divide-y divide-hairline">
                {visibleProposals.map((proposal) => (
                  <div
                    key={proposal.id}
                    className="grid gap-3 px-6 py-4 md:grid-cols-[1fr_auto] md:items-center"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-ink">
                        {proposal.title || "Đề tài chưa có tiêu đề"}
                      </p>
                      <p className="mt-1 text-sm text-body-muted">
                        {proposal.field || "Chưa phân loại"} ·{" "}
                        {proposal.studentName || "Chưa có sinh viên"}
                      </p>
                      <p className="mt-1 text-xs text-muted">
                        Cập nhật {formatDate(proposal.updatedAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 md:justify-end">
                      <ProposalStatusBadge status={proposal.status} />
                      <span className="font-mono text-[11px] font-medium text-action-blue">
                        AI {proposal.aiScore ?? "N/A"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-deep-green bg-deep-green text-white">
            <CardHeader className="border-white/10">
              <CardTitle className="text-white">AI assistant summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm leading-6 text-white/75">
                {getRoleSummary(user?.role, stats || {}, proposals)}
              </p>
              <div className="rounded-lg bg-white/10 p-4">
                <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-white/50">
                  Điểm AI trung bình
                </p>
                <p className="mt-2 text-3xl font-medium">
                  {stats?.averageAIScore || "N/A"}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {quickActions.map((action) => (
                <div
                  key={action.href}
                  className="rounded-lg border border-hairline bg-canvas p-4"
                >
                  <p className="font-medium text-ink">
                    {action.title}
                  </p>
                  <p className="mt-1 text-sm leading-5 text-body-muted">
                    {action.description}
                  </p>
                  <Link
                    href={action.href}
                    className={`mt-3 inline-flex w-full items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 sm:w-auto ${
                      action.primary
                        ? "bg-primary text-white hover:bg-[#2d2d35] focus:ring-focus-blue/30"
                        : "border border-hairline text-ink hover:bg-soft-stone focus:ring-focus-blue/30"
                    }`}
                  >
                    {action.label}
                  </Link>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <AppShell>
        <DashboardContent />
      </AppShell>
    </ProtectedRoute>
  );
}
