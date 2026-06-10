"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { ProposalForm } from "@/components/proposal/ProposalForm";
import { Alert } from "@/components/ui/Alert";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import { USER_ROLES } from "@/lib/constants";

function NewProposalContent() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (formData, submitMode) => {
    setLoading(true);
    setError("");

    try {
      await api.createProposal(
        {
          ...formData,
          studentId: user?.id,
          studentName: user?.name,
        },
        submitMode === "submit",
      );

      router.push("/proposals");
    } catch {
      setError(
        submitMode === "submit"
          ? "Chưa thể gửi đề tài. Vui lòng kiểm tra thông tin và thử lại."
          : "Chưa thể lưu nháp. Vui lòng thử lại sau ít phút.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
            New proposal
          </p>
          <h1 className="mt-2 text-2xl font-medium tracking-[-0.02em] text-ink md:text-3xl">
            Tạo đề xuất mới
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-body-muted">
            Nhập thông tin cốt lõi của đề tài. Bạn có thể lưu nháp hoặc gửi
            ngay để bắt đầu quy trình xét duyệt.
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
        <Alert type="error" title="Không thể tạo đề tài">
          {error}
        </Alert>
      )}

      <ProposalForm onSubmit={handleSubmit} loading={loading} error={null} />
    </div>
  );
}

export default function NewProposalPage() {
  return (
    <ProtectedRoute allowedRoles={[USER_ROLES.STUDENT]}>
      <AppShell>
        <NewProposalContent />
      </AppShell>
    </ProtectedRoute>
  );
}
