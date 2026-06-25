"use client";

import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { AdminKpiCard } from "@/components/admin/AdminKpiCard";
import { USER_ROLES } from "@/lib/constants";

function AdminPageContent() {
  return (
    <div className="space-y-6">
      <Card className="border-primary bg-primary text-white">
        <CardContent className="p-6 md:p-8">
          <div className="space-y-3">
            <div className="inline-flex rounded border border-white/15 bg-white/[0.06] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-white/60">
              Văn phòng Nghiên cứu — Bảng điều khiển Vận hành
            </div>
            <h1 className="text-2xl font-semibold leading-tight md:text-3xl">Quản lý Đề tài Nghiên cứu</h1>
            <p className="max-w-3xl text-sm leading-6 text-white/65">Theo dõi toàn bộ quy trình học thuật — từ gửi nháp đến hoàn thành.</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <AdminKpiCard label="Tổng đề tài" value={0} subtitle="Tất cả" />
        <AdminKpiCard label="Chờ phản biện" value={0} subtitle="Đang chờ" accent="info" />
        <AdminKpiCard label="Cần sửa" value={0} subtitle="Đang chờ SV" accent="warning" />
        <AdminKpiCard label="Chờ phân công" value={0} subtitle="Đã duyệt" accent="info" />
        <AdminKpiCard label="Milestone quá hạn" value={0} subtitle="Quá deadline" accent="danger" />
        <AdminKpiCard label="Rủi ro GV" value={0} subtitle="Đã đầy sức chứa" accent="danger" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Nhật ký Hệ thống</CardTitle>
          <p className="mt-1 text-sm text-body-muted">Các sự kiện gần đây được ghi lại trong hệ thống</p>
        </CardHeader>
        <CardContent>
          <EmptyState title="Chưa có sự kiện nào" description="Các sự kiện sẽ xuất hiện khi người dùng tương tác với hệ thống." />
        </CardContent>
      </Card>
    </div>
  );
}

export default function AdminPage() {
  return (
    <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
      <AppShell>
        <AdminPageContent />
      </AppShell>
    </ProtectedRoute>
  );
}
