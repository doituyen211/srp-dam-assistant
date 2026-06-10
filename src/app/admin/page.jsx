"use client";

import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { Alert } from "@/components/ui/Alert";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingState } from "@/components/ui/LoadingState";
import { api } from "@/lib/api";
import { USER_ROLES } from "@/lib/constants";
import { mockUsers } from "@/lib/mockData";

const roleLabels = {
  [USER_ROLES.STUDENT]: "Student",
  [USER_ROLES.REVIEWER]: "Reviewer",
  [USER_ROLES.ADMIN]: "Admin",
  [USER_ROLES.LECTURER]: "Lecturer",
};

const aiRequestLogs = [
  {
    id: "ai-log-001",
    action: "AI_FEEDBACK",
    target: "prop-001",
    provider: "mock",
    status: "success",
    latency: "800ms",
    timestamp: "2026-06-10T08:15:00Z",
  },
  {
    id: "ai-log-002",
    action: "LECTURER_MATCHING",
    target: "prop-002",
    provider: "mock",
    status: "success",
    latency: "420ms",
    timestamp: "2026-06-10T08:22:00Z",
  },
  {
    id: "ai-log-003",
    action: "RUBRIC_PREVIEW",
    target: "prop-003",
    provider: "mock",
    status: "skipped",
    latency: "0ms",
    timestamp: "2026-06-10T08:31:00Z",
  },
];

const systemStatuses = [
  {
    label: "Mock API enabled",
    value: "Enabled",
    intent: "success",
    description: "Tất cả dữ liệu đang chạy bằng mock frontend memory.",
  },
  {
    label: "Frontend only",
    value: "Active",
    intent: "info",
    description: "Không có backend service hoặc database thật trong phase demo.",
  },
  {
    label: "AI provider disabled/mock",
    value: "Mocked",
    intent: "warning",
    description: "Không gọi OpenAI/Claude hay provider AI thật.",
  },
];

const formatDateTime = (value) => {
  if (!value) return "Chưa cập nhật";

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
};

function AdminPageContent() {
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadAuditLogs = async () => {
      setLoading(true);
      setError("");

      try {
        const logs = await api.getAuditLogs();
        if (!mounted) return;

        setAuditLogs(Array.isArray(logs) ? logs : []);
      } catch {
        if (!mounted) return;
        setError("Không thể tải audit logs. Vui lòng thử lại sau.");
        setAuditLogs([]);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadAuditLogs();

    return () => {
      mounted = false;
    };
  }, []);

  const userOverview = useMemo(() => {
    return Object.values(USER_ROLES).map((role) => ({
      role,
      label: roleLabels[role],
      count: mockUsers.filter((user) => user.role === role).length,
    }));
  }, []);

  if (loading) {
    return <LoadingState message="Đang tải trang quản trị..." />;
  }

  return (
    <div className="space-y-6">
      <Card className="border-primary bg-primary text-white">
        <CardContent className="p-6 md:p-8">
          <p className="font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-white/45">
            Admin console
          </p>
          <h1 className="mt-3 text-2xl font-medium leading-tight tracking-[-0.02em] md:text-4xl">
            Quản trị hệ thống demo SRP DAM
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-white/65 md:text-base">
            Theo dõi vai trò người dùng, trạng thái hệ thống mock và các log
            phục vụ demo quản trị frontend-only.
          </p>
        </CardContent>
      </Card>

      <Alert type="warning" title="Cảnh báo vận hành">
        AI chỉ hỗ trợ, mọi quyết định cần người duyệt.
      </Alert>

      {error && (
        <Alert type="error" title="Không tải được dữ liệu">
          {error}
        </Alert>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {userOverview.map((item) => (
          <Card key={item.role}>
            <CardContent className="p-5">
              <p className="font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-muted">
                {item.label}
              </p>
              <p className="mt-3 text-3xl font-medium leading-none text-ink">
                {item.count}
              </p>
              <p className="mt-3 text-sm text-body-muted">
                Tài khoản mock đang cấu hình
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <CardHeader>
            <CardTitle>System status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {systemStatuses.map((item) => (
              <div
                key={item.label}
                className="rounded-lg border border-hairline bg-canvas p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-ink">
                      {item.label}
                    </p>
                    <p className="mt-1 text-sm leading-5 text-body-muted">
                      {item.description}
                    </p>
                  </div>
                  <Badge intent={item.intent}>{item.value}</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI request logs mock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto rounded-[10px] border border-hairline bg-canvas">
              <table className="w-full min-w-[640px] border-collapse text-sm">
                <thead className="bg-soft-stone">
                  <tr>
                    <th className="px-4 py-3 text-left font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-body-muted">
                      Action
                    </th>
                    <th className="px-4 py-3 text-left font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-body-muted">
                      Target
                    </th>
                    <th className="px-4 py-3 text-left font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-body-muted">
                      Provider
                    </th>
                    <th className="px-4 py-3 text-left font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-body-muted">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-body-muted">
                      Latency
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-hairline">
                  {aiRequestLogs.map((log) => (
                    <tr key={log.id} className="transition-colors hover:bg-[#fafafa]">
                      <td className="px-4 py-3 font-medium text-ink">
                        {log.action}
                      </td>
                      <td className="px-4 py-3 text-body-muted">
                        {log.target}
                      </td>
                      <td className="px-4 py-3 text-body-muted">
                        {log.provider}
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          intent={log.status === "success" ? "success" : "muted"}
                        >
                          {log.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-body-muted">
                        {log.latency}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Audit logs mock</CardTitle>
        </CardHeader>
        <CardContent>
          {auditLogs.length === 0 ? (
            <EmptyState
              icon="📋"
              title="Chưa có audit log"
              description="Các thao tác như đăng nhập, cập nhật đề tài hoặc recommend giảng viên sẽ được ghi nhận trong session demo."
            />
          ) : (
            <div className="overflow-x-auto rounded-[10px] border border-hairline bg-canvas">
              <table className="w-full min-w-[760px] border-collapse text-sm">
                <thead className="bg-soft-stone">
                  <tr>
                    <th className="px-4 py-3 text-left font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-body-muted">
                      Time
                    </th>
                    <th className="px-4 py-3 text-left font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-body-muted">
                      User
                    </th>
                    <th className="px-4 py-3 text-left font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-body-muted">
                      Action
                    </th>
                    <th className="px-4 py-3 text-left font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-body-muted">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-body-muted">
                      Details
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-hairline">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="align-top transition-colors hover:bg-[#fafafa]">
                      <td className="px-4 py-3 text-body-muted">
                        {formatDateTime(log.timestamp)}
                      </td>
                      <td className="px-4 py-3 text-body-muted">
                        {log.userName || log.userId || "System"}
                      </td>
                      <td className="px-4 py-3 font-medium text-ink">
                        {log.action}
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          intent={log.status === "success" ? "success" : "danger"}
                        >
                          {log.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-body-muted">
                        {log.details || "Không có chi tiết"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
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
