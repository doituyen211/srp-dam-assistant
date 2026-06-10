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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center justify-center px-4 py-12">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-slate-900">SRP DAM</h1>
        <p className="text-slate-600 mt-2">AI Trợ Lý Soạn & Quản Lý Đề Tài</p>
      </div>

      {/* Login Card */}
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Đăng nhập</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Error Alert */}
          {(error || localError) && (
            <Alert type="error">{error || localError}</Alert>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Nhập email của bạn"
              required
              disabled={loading}
            />

            <Input
              label="Mật khẩu"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu"
              required
              disabled={loading}
            />

            <Button
              type="submit"
              variant="primary"
              loading={loading}
              disabled={loading}
              className="w-full"
            >
              Đăng nhập
            </Button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-white text-slate-500">hoặc</span>
            </div>
          </div>

          {/* Demo Accounts */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-slate-700 text-center">
              Tài khoản demo (click để điền nhanh)
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
                  className="w-full p-3 border border-slate-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">
                        {account.email}
                      </p>
                      <p className="text-xs text-slate-600">
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

          {/* Help Text */}
          <div className="bg-blue-50 px-4 py-3 rounded-lg border border-blue-100">
            <p className="text-xs text-blue-800">
              💡 <strong>Tip:</strong> Nhấn vào tài khoản demo để điền thông tin
              nhanh, hoặc nhập thủ công để kiểm tra (mật khẩu: demo123).
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Back Link */}
      <div className="mt-6 text-center">
        <Link
          href="/"
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          ← Quay lại trang chủ
        </Link>
      </div>
    </div>
  );
}
