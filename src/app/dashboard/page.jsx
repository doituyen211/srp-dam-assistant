"use client";

import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { PROPOSAL_STATUSES, USER_ROLES, CURRENT_TERM, ACADEMIC_TERMS, ACADEMIC_ROLE_LABELS } from "@/lib/constants";

function DashboardContent() {
  const user = { id: "", name: "User", email: "", role: "student", faculty: "", department: "" };
  const proposals = [];
  const stats = {};
  const currentTerm = ACADEMIC_TERMS.find((t) => t.id === CURRENT_TERM);

  return (
    <div className="space-y-6">
      <Card className="border-primary bg-primary text-white">
        <CardContent className="p-6 md:p-8">
          <div className="space-y-4">
            <div className="inline-flex rounded border border-white/15 bg-white/[0.06] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-white/60">
              {ACADEMIC_ROLE_LABELS[user.role]}
            </div>
            <div>
              <h1 className="text-2xl font-semibold leading-tight md:text-3xl">Xin chào, User</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-white/65">
                Bảng điều khiển Đề tài Nghiên cứu — {currentTerm?.label || "Học kỳ hiện tại"}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded border border-white/10 bg-white/[0.06] p-3">
                <div className="font-mono text-[10px] uppercase tracking-[0.08em] text-white/40">Tổng</div>
                <div className="mt-1 text-xl font-semibold">0</div>
              </div>
              <div className="rounded border border-white/10 bg-white/[0.06] p-3">
                <div className="font-mono text-[10px] uppercase tracking-[0.08em] text-white/40">Đang active</div>
                <div className="mt-1 text-xl font-semibold">0</div>
              </div>
              <div className="rounded border border-white/10 bg-white/[0.06] p-3">
                <div className="font-mono text-[10px] uppercase tracking-[0.08em] text-white/40">Cần sửa</div>
                <div className="mt-1 text-xl font-semibold">0</div>
              </div>
              <div className="rounded border border-white/10 bg-white/[0.06] p-3">
                <div className="font-mono text-[10px] uppercase tracking-[0.08em] text-white/40">Điểm TB</div>
                <div className="mt-1 text-xl font-semibold">—</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Đề tài của tôi</CardTitle>
            <p className="mt-1 text-sm text-body-muted">Chưa có đề tài nào. Bắt đầu tạo đề tài nghiên cứu đầu tiên.</p>
          </div>
          <Link href="/proposals/new">
            <Button variant="primary" className="text-xs">+ Đề tài mới</Button>
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          <div className="px-6 py-10">
            <EmptyState
              title="Bắt đầu hành trình nghiên cứu"
              description="Tạo đề tài nghiên cứu để bắt đầu. Hệ thống sẽ hướng dẫn bạn qua từng phần."
              action={
                <Link href="/proposals/new">
                  <Button variant="primary">Tạo Đề tài Đầu tiên</Button>
                </Link>
              }
            />
          </div>
        </CardContent>
      </Card>
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
