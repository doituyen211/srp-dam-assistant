"use client";

import { AppShell } from "@/components/layout/AppShell";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { HumanInLoopBanner } from "@/components/ui/HumanInLoopBanner";
import { USER_ROLES } from "@/lib/constants";

const allowedRoles = [USER_ROLES.ADMIN, USER_ROLES.REVIEWER, USER_ROLES.LECTURER];

function MatchingPageContent() {
  return (
    <div className="space-y-6">
      <Card className="border-primary bg-primary text-white">
        <CardContent className="p-6 md:p-8">
          <div className="space-y-3">
            <div className="inline-flex rounded border border-white/15 bg-white/[0.06] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-white/60">Phân công GVHD</div>
            <h1 className="text-2xl font-semibold leading-tight md:text-3xl">Phân công Giảng viên Hướng dẫn</h1>
            <p className="max-w-3xl text-sm leading-6 text-white/65">AI gợi ý các GVHD phù hợp dựa trên chuyên môn, sức chứa, và kinh nghiệm.</p>
          </div>
        </CardContent>
      </Card>

      <HumanInLoopBanner />

      <Card>
        <CardHeader><CardTitle>Chọn Đề tài</CardTitle></CardHeader>
        <CardContent>
          <EmptyState title="Chưa có đề tài nào" description="Đề tài cần được gửi trước khi bắt đầu phân công." />
        </CardContent>
      </Card>
    </div>
  );
}

export default function MatchingPage() {
  return (
    <ProtectedRoute allowedRoles={allowedRoles}>
      <AppShell>
        <MatchingPageContent />
      </AppShell>
    </ProtectedRoute>
  );
}
