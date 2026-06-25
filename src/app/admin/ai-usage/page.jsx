"use client";

import { AppShell } from "@/components/layout/AppShell";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { Card, CardContent } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { USER_ROLES } from "@/lib/constants";

export default function AiUsagePage() {
  return (
    <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
      <AppShell>
        <div className="space-y-6">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted">Admin</p>
            <h1 className="mt-2 text-2xl font-semibold text-ink">Bảng điều khiển Sử dụng AI</h1>
            <p className="mt-1 text-sm text-body-muted">Theo dõi tiêu thụ token, chi phí, và sử dụng nhà cung cấp AI.</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card><CardContent className="p-4"><p className="font-mono text-[10px] uppercase text-muted">Tổng Token</p><p className="mt-1.5 text-2xl font-semibold text-ink">0</p></CardContent></Card>
            <Card accent="info"><CardContent className="p-4"><p className="font-mono text-[10px] uppercase text-muted">Tổng Chi phí</p><p className="mt-1.5 text-2xl font-semibold text-info">$0.00</p></CardContent></Card>
            <Card accent="warning"><CardContent className="p-4"><p className="font-mono text-[10px] uppercase text-muted">Độ trễ TB</p><p className="mt-1.5 text-2xl font-semibold text-warning">0ms</p></CardContent></Card>
            <Card accent="success"><CardContent className="p-4"><p className="font-mono text-[10px] uppercase text-muted">Tổng Review</p><p className="mt-1.5 text-2xl font-semibold text-success">0</p></CardContent></Card>
          </div>

          <Card>
            <CardContent>
              <EmptyState title="Chưa có dữ liệu AI" description="Dữ liệu AI pre-review sẽ xuất hiện sau khi các review được chạy." />
            </CardContent>
          </Card>
        </div>
      </AppShell>
    </ProtectedRoute>
  );
}
