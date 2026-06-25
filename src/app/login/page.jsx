"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Alert";
import { Input } from "@/components/ui/Input";

function getRedirectPath(role) {
  switch (role) {
    case "reviewer": return "/review";
    case "admin":    return "/admin";
    case "lecturer": return "/dashboard";
    case "student":
    default:         return "/dashboard";
  }
}

export default function LoginPage() {
  const router = useRouter();
  const [localError, setLocalError] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);
    if (!email.trim() || !password.trim()) {
      setLocalError("Vui lòng nhập email và mật khẩu.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push("/dashboard");
    }, 500);
  };

  return (
    <div className="flex min-h-screen flex-col bg-app-bg">
      <div className="border-b border-hairline bg-canvas px-5 py-3">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-body-muted transition-colors hover:text-ink">
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5m7-7l-7 7 7 7" />
          </svg>
          Back to home
        </Link>
      </div>

      <div className="flex flex-1 items-center justify-center px-5 py-10">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader>
              <CardTitle>Đăng nhập vào Research Office</CardTitle>
              <p className="mt-1 text-sm text-body-muted">Truy cập workspace quản lý đề tài nghiên cứu.</p>
            </CardHeader>
            <CardContent>
              {localError && (
                <div className="mb-5">
                  <Alert type="error">{localError}</Alert>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@university.edu" required disabled={loading} autoComplete="email" />
                <Input label="Mật khẩu" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nhập mật khẩu" required disabled={loading} autoComplete="current-password" />
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted italic">Quên mật khẩu? Sắp ra mắt</span>
                </div>
                <Button type="submit" variant="primary" loading={loading} disabled={loading} className="w-full justify-center">
                  Đăng nhập
                </Button>
              </form>

              <div className="mt-5 text-center">
                <Link href="/register" className="text-sm text-primary hover:underline">Tạo tài khoản sinh viên →</Link>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6 text-center">
            <p className="text-xs text-muted">Bằng việc đăng nhập, bạn đồng ý với điều khoản sử dụng.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
