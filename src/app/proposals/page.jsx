"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { ProposalCard } from "@/components/proposal/ProposalCard";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { STATUS_LABELS, USER_ROLES, ACADEMIC_ROLE_LABELS } from "@/lib/constants";

const statusOptions = [
  { value: "all", label: "Tất cả trạng thái" },
  ...Object.entries(STATUS_LABELS).map(([value, label]) => ({ value, label })),
];

function ProposalsContent() {
  const user = { id: "", name: "User", role: "student" };
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  const filteredProposals = useMemo(() => {
    const proposals = [];
    const keyword = search.trim().toLowerCase();
    return proposals
      .filter((p) => {
        if (status !== "all" && p.status !== status) return false;
        if (keyword) {
          const haystack = [p.title, p.researchField, p.studentName, ...(p.keywords || [])].filter(Boolean).join(" ").toLowerCase();
          if (!haystack.includes(keyword)) return false;
        }
        return true;
      })
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  }, [search, status]);

  const hasFilters = search.trim() || status !== "all";

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">{ACADEMIC_ROLE_LABELS[user?.role] || "User"} Workspace</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-[-0.02em] text-ink md:text-3xl">Đề tài Nghiên cứu</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-body-muted">Chưa có đề tài nào. Tạo đề tài nghiên cứu đầu tiên để bắt đầu.</p>
        </div>
        <Link href="/proposals/new">
          <Button variant="primary">+ Đề tài mới</Button>
        </Link>
      </div>

      <Card>
        <CardContent className="grid gap-4 p-5 md:grid-cols-[1fr_260px]">
          <Input label="Tìm kiếm" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Tìm theo tiêu đề, lĩnh vực, từ khóa..." />
          <Select label="Trạng thái" value={status} onChange={(e) => setStatus(e.target.value || "all")} options={statusOptions} />
        </CardContent>
      </Card>

      <Card>
        <EmptyState
          title={hasFilters ? "Không tìm thấy đề tài phù hợp" : "Chưa có đề tài nào"}
          description={hasFilters ? "Thử điều chỉnh từ khóa hoặc bộ lọc." : "Tạo đề tài nghiên cứu để bắt đầu."}
          action={!hasFilters ? <Link href="/proposals/new"><Button variant="primary">Tạo Đề tài Đầu tiên</Button></Link> : null}
        />
      </Card>
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
