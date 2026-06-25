"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { AI_PROVIDERS, USER_ROLES } from "@/lib/constants";

function getInitialProvider() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("srp_ai_provider") || "";
}

export default function AdminSettingsPage() {
  const [provider, setProvider] = useState(getInitialProvider);
  const [message, setMessage] = useState("");

  const handleSave = () => {
    localStorage.setItem("srp_ai_provider", provider);
    setMessage("Cài đặt nhà cung cấp AI đã được lưu. Các lần AI pre-review tiếp theo sẽ sử dụng nhà cung cấp này.");
  };

  const selectedProvider = AI_PROVIDERS.find((p) => p.id === provider);

  return (
    <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
      <AppShell>
        <div className="max-w-2xl space-y-6">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted">Admin</p>
            <h1 className="mt-2 text-2xl font-semibold text-ink">Cài đặt</h1>
            <p className="mt-1 text-sm text-body-muted">Cấu hình cài đặt cấp nền tảng cho AI pre-review và các dịch vụ khác.</p>
          </div>

          {message && <Alert type="success" closable>{message}</Alert>}

          <Card>
            <CardHeader><CardTitle>Nhà cung cấp AI Pre-review</CardTitle></CardHeader>
            <CardContent className="space-y-5">
              <p className="text-sm text-body-muted">
                Chọn LLM mặc định cho AI pre-review. Cài đặt này áp dụng cho tất cả các lần AI review mới trên mọi đề tài.
                API key backend phải được cấu hình cho nhà cung cấp đã chọn.
              </p>

              <div className="space-y-3">
                {AI_PROVIDERS.map((p) => (
                  <label
                    key={p.id}
                    className={`flex items-start gap-4 rounded border p-4 cursor-pointer transition-colors ${provider === p.id ? "border-primary bg-primary/5" : "border-hairline hover:bg-subdued"}`}
                  >
                    <input
                      type="radio"
                      name="ai_provider"
                      value={p.id}
                      checked={provider === p.id}
                      onChange={(e) => setProvider(e.target.value)}
                      className="mt-1 h-4 w-4 text-primary"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-ink">{p.name}</p>
                      <p className="text-xs text-body-muted mt-0.5">{p.description}</p>
                      {p.model && <p className="text-xs text-muted mt-0.5">Model: {p.model}{p.price !== null ? ` · ~$${p.price}/1M input tokens` : ""}</p>}
                    </div>
                  </label>
                ))}
              </div>

              {selectedProvider && selectedProvider.id && (
                <div className="rounded border border-info/20 bg-info-bg px-4 py-3 text-xs text-info">
                  <strong>Lưu ý:</strong> Đảm bảo backend đã cấu hình API key cho <strong>{selectedProvider.name}</strong>.
                  Nếu key bị thiếu, hệ thống sẽ quay lại nhà cung cấp mặc định.
                </div>
              )}

              {!provider && (
                <div className="rounded border border-warning/20 bg-warning-bg px-4 py-3 text-xs text-warning">
                  Chưa chọn nhà cung cấp. Backend sẽ sử dụng nhà cung cấp mặc định.
                </div>
              )}

              <Button onClick={handleSave}>Lưu cài đặt nhà cung cấp</Button>
            </CardContent>
          </Card>
        </div>
      </AppShell>
    </ProtectedRoute>
  );
}
