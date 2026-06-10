"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { ProposalCard } from "@/components/proposal/ProposalCard";
import { Alert } from "@/components/ui/Alert";
import { Card, CardContent } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/Input";
import { LoadingState } from "@/components/ui/LoadingState";
import { Select } from "@/components/ui/Select";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import { PROPOSAL_STATUSES, STATUS_LABELS, USER_ROLES } from "@/lib/constants";

const statusOptions = [
  { value: "all", label: "Tất cả trạng thái" },
  ...Object.values(PROPOSAL_STATUSES).map((status) => ({
    value: status,
    label: STATUS_LABELS[status] || status,
  })),
];

function ProposalsContent() {
  const { user } = useAuth();
  const [proposals, setProposals] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadProposals = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await api.getProposals();
        if (!mounted) return;
        setProposals(Array.isArray(data) ? data : []);
      } catch {
        if (!mounted) return;
        setError("Không thể tải danh sách đề tài. Vui lòng thử lại sau.");
        setProposals([]);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadProposals();

    return () => {
      mounted = false;
    };
  }, []);

  const roleScopedProposals = useMemo(() => {
    if (user?.role !== USER_ROLES.STUDENT) return proposals;

    return proposals.filter((proposal) => proposal.studentId === user.id);
  }, [proposals, user]);

  const filteredProposals = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return roleScopedProposals
      .filter((proposal) => {
        const matchesStatus = status === "all" || proposal.status === status;
        const haystack = [
          proposal.title,
          proposal.field,
          proposal.studentName,
          proposal.problem,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return matchesStatus && (!keyword || haystack.includes(keyword));
      })
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  }, [roleScopedProposals, search, status]);

  const hasFilters = search.trim() || status !== "all";
  const isStudent = user?.role === USER_ROLES.STUDENT;

  if (loading) {
    return <LoadingState message="Đang tải danh sách đề tài..." />;
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-950 md:text-3xl">
            Đề tài nghiên cứu
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Tìm kiếm, lọc trạng thái và mở nhanh từng đề xuất để theo dõi quá
            trình xử lý.
          </p>
        </div>

        {isStudent && (
          <Link
            href="/proposals/new"
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Tạo đề xuất mới
          </Link>
        )}
      </div>

      {error && (
        <Alert type="error" title="Không tải được dữ liệu">
          {error}
        </Alert>
      )}

      <Card>
        <CardContent className="grid gap-4 md:grid-cols-[1fr_240px]">
          <Input
            label="Tìm kiếm"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Tìm theo tiêu đề, lĩnh vực, sinh viên..."
          />
          <Select
            label="Trạng thái"
            value={status}
            onChange={(event) => setStatus(event.target.value || "all")}
            options={statusOptions}
          />
        </CardContent>
      </Card>

      {filteredProposals.length === 0 ? (
        <Card>
          <EmptyState
            icon="📄"
            title={
              hasFilters
                ? "Không tìm thấy đề tài phù hợp"
                : "Chưa có đề tài nào"
            }
            description={
              hasFilters
                ? "Thử đổi từ khóa tìm kiếm hoặc chọn trạng thái khác."
                : "Khi có đề xuất mới, danh sách sẽ hiển thị tại đây."
            }
            action={
              isStudent && !hasFilters ? (
                <Link
                  href="/proposals/new"
                  className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Tạo đề xuất mới
                </Link>
              ) : null
            }
          />
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredProposals.map((proposal) => (
            <ProposalCard key={proposal.id} proposal={proposal} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProposalsPage() {
  return (
    <ProtectedRoute>
      <AppShell>
        <ProposalsContent />
      </AppShell>
    </ProtectedRoute>
  );
}
