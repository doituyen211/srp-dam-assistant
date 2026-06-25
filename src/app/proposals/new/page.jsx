"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { ProposalForm } from "@/components/proposal/ProposalForm";
import { Alert } from "@/components/ui/Alert";
import { USER_ROLES } from "@/lib/constants";

function NewProposalContent() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (formData, submitMode) => {
    setLoading(true);
    setError("");

    setTimeout(() => {
      setLoading(false);
      router.push("/proposals");
    }, 500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
            Workspace Đề tài
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-[-0.02em] text-ink md:text-3xl">
            Đề tài Nghiên cứu Mới
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-body-muted">
            Hoàn thành từng phần một cách cẩn thận. Đề tài tốt cần xác định rõ ràng vấn đề,
            mục tiêu, phương pháp, và đóng góp dự kiến.
          </p>
        </div>

        <Link
          href="/proposals"
          className="inline-flex items-center justify-center rounded border border-hairline px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-subdued focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2"
        >
          Quay lại danh sách
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
