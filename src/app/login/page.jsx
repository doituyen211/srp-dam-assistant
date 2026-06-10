"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Alert";
import { Badge } from "@/components/ui/Badge";

const DEMO_ACCOUNTS = [
  {
    email: "student@demo.com",
    password: "demo123",
    role: "Sinh viên",
  },
  {
    email: "reviewer@demo.com",
    password: "demo123",
    role: "Đánh giá viên",
  },
  {
    email: "admin@demo.com",
    password: "demo123",
    role: "Admin",
  },
  {
    email: "lecturer@demo.com",
    password: "demo123",
    role: "Giảng viên",
  },
];

export default function LoginPage() {
  const router = useRouter();
  const { user, login, loading, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState(null);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  // Fill demo account credentials
  const fillDemoAccount = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setLocalError(null);
  };

  // Handle login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);

    if (!email.trim() || !password.trim()) {
      setLocalError("Vui lòng nhập email và mật khẩu");
      return;
    }

    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (err) {
      setLocalError(err.message || "Đăng nhập thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-soft-stone px-5 py-10">
      <div className="w-full max-w-[440px]">
        <div className="mb-6 text-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded bg-primary px-3 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-white"
          >
            SRP D&M
          </Link>
          <h1 className="mt-5 text-2xl font-medium tracking-[-0.02em] text-ink">
            Đăng nhập hệ thống
          </h1>
          <p className="mt-2 text-sm leading-6 text-body-muted">
            AI Trợ Lý Soạn & Quản Lý Đề Tài Nghiên Cứu Sinh Viên
          </p>
        </div>

        <Card className="rounded-2xl border-hairline bg-canvas">
          <CardHeader>
            <div>
              <CardTitle>Đăng nhập</CardTitle>
              <p className="mt-1 text-sm text-body-muted">
                Dùng tài khoản demo hoặc nhập thông tin thủ công.
              </p>
            </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {(error || localError) && (
            <Alert type="error">{error || localError}</Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              required
              disabled={loading}
            />

            <Input
              label="Mật khẩu"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="demo123"
              required
              disabled={loading}
            />

            <Button
              type="submit"
              variant="primary"
              loading={loading}
              disabled={loading}
              className="w-full justify-center"
            >
              Đăng nhập
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-hairline" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-canvas px-3 font-mono uppercase tracking-[0.08em] text-muted">
                Demo accounts
              </span>
            </div>
          </div>

          <div className="rounded-lg bg-[#f8f8f5] p-4">
            <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
              Mật khẩu: demo123
            </p>
            <div className="space-y-2">
              {DEMO_ACCOUNTS.map((account) => (
                <button
                  key={account.email}
                  type="button"
                  onClick={() =>
                    fillDemoAccount(account.email, account.password)
                  }
                  disabled={loading}
                  className="w-full rounded-lg border border-transparent bg-canvas p-3 text-left transition-all hover:border-hairline hover:bg-soft-stone disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-ink">
                        {account.email}
                      </p>
                      <p className="mt-0.5 text-xs text-body-muted">
                        {account.password}
                      </p>
                    </div>
                    <Badge intent="info" className="flex-shrink-0">
                      {account.role}
                    </Badge>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-card-border bg-canvas px-4 py-3">
            <p className="text-xs leading-5 text-body-muted">
              Nhấn vào một tài khoản demo để điền nhanh. Nếu thông tin sai, hệ
              thống sẽ hiển thị: “Email hoặc mật khẩu chưa đúng.”
            </p>
          </div>
        </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-sm font-medium text-body-muted transition-colors hover:text-ink"
          >
            Quay lại trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}
