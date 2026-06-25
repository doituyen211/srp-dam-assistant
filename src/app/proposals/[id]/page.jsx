"use client";

import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";

function ProposalDetailContent() {
  return (
    <div className="space-y-6">
      <Card className="mx-auto max-w-2xl">
        <EmptyState
          title="Không tìm thấy đề tài"
          description="Đề tài này có thể đã bị xóa hoặc không tồn tại."
          action={
            <Link href="/proposals" className="inline-flex items-center justify-center rounded bg-primary px-5 py-2.5 text-sm font-medium text-white">
              Quay lại danh sách
            </Link>
          }
        />
      </Card>
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
