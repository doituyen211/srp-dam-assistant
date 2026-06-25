"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Alert } from "@/components/ui/Alert";
import { FACULTIES, DEPARTMENTS } from "@/lib/constants";

export default function RegisterPage() {
  const router = useRouter();
  const [localError, setLocalError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    faculty: "",
    department: "",
  });

  const facultyOptions = FACULTIES.map((f) => ({ value: f, label: f }));
  const departmentOptions = DEPARTMENTS.map((d) => ({ value: d, label: d }));

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validate = () => {
    if (!form.name.trim()) return "Họ tên là bắt buộc.";
    if (!form.email.trim()) return "Email là bắt buộc.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      return "Vui lòng nhập email hợp lệ.";
    }
    if (!form.faculty) return "Khoa là bắt buộc.";
    if (!form.department) return "Bộ môn là bắt buộc.";
    if (!form.password) return "Mật khẩu là bắt buộc.";
    if (form.password.length < 6) return "Mật khẩu phải có ít nhất 6 ký tự.";
    if (form.password !== form.confirmPassword) return "Mật khẩu không khớp.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);

    const validationError = validate();
    if (validationError) {
      setLocalError(validationError);
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
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-sm font-medium text-body-muted transition-colors hover:text-ink"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5m7-7l-7 7 7 7" />
          </svg>
          Quay lại đăng nhập
        </Link>
      </div>

      <div className="flex flex-1 items-center justify-center px-5 py-10">
        <div className="w-full max-w-lg">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-semibold text-ink">
              Tạo tài khoản nghiên cứu sinh viên
            </h1>
            <p className="mt-2 text-sm text-body-muted">
              Sử dụng email viện trợ để bắt đầu soạn và theo dõi đề tài nghiên cứu.
            </p>
          </div>

          {localError && (
            <div className="mb-6">
              <Alert type="error">{localError}</Alert>
            </div>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Đăng ký</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                <Input
                  label="Họ và tên"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="VD: Nguyen Van A"
                  required
                  disabled={loading}
                />

                <Input
                  label="Email viện trợ"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@university.edu"
                  required
                  disabled={loading}
                  helperText="Sử dụng email viện trợ."
                />

                <Select
                  label="Khoa"
                  name="faculty"
                  value={form.faculty}
                  onChange={handleChange}
                  options={facultyOptions}
                  required
                />

                <Select
                  label="Bộ môn"
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                  options={departmentOptions}
                  required
                />

                <Input
                  label="Mật khẩu"
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Ít nhất 6 ký tự"
                  required
                  disabled={loading}
                />

                <Input
                  label="Xác nhận mật khẩu"
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Nhập lại mật khẩu"
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
                  Tạo tài khoản
                </Button>
              </form>

              <div className="mt-6 space-y-4">
                <div className="rounded border border-info/20 bg-info-bg px-3 py-2.5 text-xs leading-5 text-info">
                  Đăng ký tự động dành cho sinh viên thuộc các domain viện trợ đủ điều kiện.
                </div>
                <div className="rounded border border-hairline bg-subdued px-3 py-2.5 text-xs leading-5 text-body-muted">
                  <strong>Tài khoản nhân viên:</strong> Tài khoản phản biện, giảng viên, và quản trị viên
                  được tạo bởi quản trị viên viện trợ.
                </div>

                <div className="text-center">
                  <p className="text-xs text-body-muted">
                    Đã có tài khoản?{" "}
                    <Link
                      href="/login"
                      className="text-primary hover:underline"
                    >
                      Đăng nhập
                    </Link>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
