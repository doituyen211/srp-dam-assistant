"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { HumanInLoopBanner } from "@/components/ui/HumanInLoopBanner";
import { PROPOSAL_STATUSES, USER_ROLES } from "@/lib/constants";

function ReviewPageContent() {
  const [queueItems] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter] = useState("all");
  const [fieldFilter] = useState("all");
  const [urgencyFilter] = useState("all");
  const [riskFilter] = useState("all");
  const [selectedId] = useState(null);

  return (
    <div className="space-y-6">
      <Card className="border-primary bg-primary text-white">
        <CardContent className="p-6 md:p-8">
          <div className="space-y-3">
            <div className="inline-flex rounded border border-white/15 bg-white/[0.06] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-white/60">Bảng Phản biện</div>
            <h1 className="text-2xl font-semibold leading-tight md:text-3xl">Hàng chờ Phản biện Đề tài</h1>
            <p className="max-w-3xl text-sm leading-6 text-white/65">Phản biện là người ra quyết định cuối cùng. Sử dụng AI pre-review chỉ để tham khảo.</p>
          </div>
        </CardContent>
      </Card>

      <HumanInLoopBanner />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Card><CardContent className="p-4"><p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted">Đã phân công</p><p className="mt-1 text-2xl font-semibold text-ink">0</p></CardContent></Card>
        <Card accent="info"><CardContent className="p-4"><p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted">Chờ phản biện</p><p className="mt-1 text-2xl font-semibold text-info">0</p></CardContent></Card>
        <Card accent="warning"><CardContent className="p-4"><p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted">Cần sửa</p><p className="mt-1 text-2xl font-semibold text-warning">0</p></CardContent></Card>
        <Card accent="success"><CardContent className="p-4"><p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted">Đã phê duyệt</p><p className="mt-1 text-2xl font-semibold text-success">0</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted">Tổng</p><p className="mt-1 text-2xl font-semibold text-ink">0</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Hàng chờ Phản biện</CardTitle></CardHeader>
        <CardContent className="p-0">
          <div className="p-6">
            <EmptyState title="Chưa có đề tài nào trong hàng chờ" description="Các đề tài sẽ xuất hiện khi được gửi phản biện." />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ReviewPage() {
  return (
    <ProtectedRoute allowedRoles={[USER_ROLES.REVIEWER, USER_ROLES.ADMIN]}>
      <AppShell><ReviewPageContent /></AppShell>
    </ProtectedRoute>
  );
}
