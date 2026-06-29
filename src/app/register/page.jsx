"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Alert } from "@/components/ui/Alert";
import { FACULTIES, DEPARTMENTS } from "@/lib/constants";
import { api } from "@/lib/api";

function getRedirectPath(role) {
  switch (role) {
    case "super_admin": return "/admin/users";
    case "reviewer": return "/review";
    case "admin":    return "/admin";
    case "lecturer": return "/dashboard";
    case "student":
    default:         return "/dashboard";
  }
}

export default function RegisterPage() {
  const router = useRouter();
  const { user, register, loading, error } = useAuth();
  const [localError, setLocalError] = useState(null);
  const [faculties, setFaculties] = useState(FACULTIES);
  const [departments, setDepartments] = useState(DEPARTMENTS);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    faculty: "",
    department: "",
  });

  useEffect(() => {
    if (user) router.push(getRedirectPath(user.role));
  }, [user, router]);

  useEffect(() => {
    api.getFaculties()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setFaculties(data.map((f) => f.name || f));
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (form.faculty) {
      api.getDepartments()
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) {
            setDepartments(data.map((d) => d.name || d));
          }
        })
        .catch(() => {});
    }
  }, [form.faculty]);

  const facultyOptions = faculties.map((f) => ({ value: typeof f === "string" ? f : f.name, label: typeof f === "string" ? f : f.name }));
  const departmentOptions = departments.map((d) => ({ value: typeof d === "string" ? d : d.name, label: typeof d === "string" ? d : d.name }));

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validate = () => {
    if (!form.name.trim()) return "Full name is required.";
    if (!form.email.trim()) return "Email is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      return "Please enter a valid email address.";
    }
    if (!form.faculty) return "Faculty is required.";
    if (!form.department) return "Department is required.";
    if (!form.password) return "Password is required.";
    if (form.password.length < 6) return "Password must be at least 6 characters.";
    if (form.password !== form.confirmPassword) return "Passwords do not match.";
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

    const payload = {
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      password: form.password,
      faculty: form.faculty || undefined,
      department: form.department || undefined,
      role: "student",
    };

    try {
      const userData = await register(payload);
      if (userData) {
        router.push("/dashboard");
      } else {
        router.push("/login");
      }
    } catch (err) {
      const status = err.status || err.message;
      const msg =
        status === 404
          ? "Registration service not found. Check API URL configuration."
          : status === 422
            ? "Please check your input. Some fields may be invalid or missing."
            : status === 409
              ? "An account with this email already exists."
              : String(status).includes("fetch") || String(status).includes("Failed to fetch")
                ? "Unable to connect to server. Check your connection and try again."
                : err.message || "Registration failed. Please try again.";
      setLocalError(msg);
    }
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
          Back to sign in
        </Link>
      </div>

      <div className="flex flex-1 items-center justify-center px-5 py-10">
        <div className="w-full max-w-lg">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-semibold text-ink">
              Create student research account
            </h1>
            <p className="mt-2 text-sm text-body-muted">
              Use your institutional email to start drafting and tracking research proposals.
            </p>
          </div>

          {(error || localError) && (
            <div className="mb-6">
              <Alert type="error">{error || localError}</Alert>
            </div>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Register</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                <Input
                  label="Full name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. John Smith"
                  required
                  disabled={loading}
                />

                <Input
                  label="Institutional email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@university.edu"
                  required
                  disabled={loading}
                  helperText="Use your institutional email."
                />

                <Select
                  label="Faculty"
                  name="faculty"
                  value={form.faculty}
                  onChange={handleChange}
                  options={facultyOptions}
                  required
                />

                <Select
                  label="Department"
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                  options={departmentOptions}
                  required
                />

                <Input
                  label="Password"
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="At least 6 characters"
                  required
                  disabled={loading}
                />

                <Input
                  label="Confirm password"
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter password"
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
                  Create account
                </Button>
              </form>

              <div className="mt-6 space-y-4">
                <div className="rounded border border-info/20 bg-info-bg px-3 py-2.5 text-xs leading-5 text-info">
                  Automatic registration for students with eligible institutional email domains.
                </div>
                <div className="rounded border border-hairline bg-subdued px-3 py-2.5 text-xs leading-5 text-body-muted">
                  <strong>Staff accounts:</strong> Reviewer, lecturer, and administrator accounts are
                  created by institutional administrators.
                </div>

                <div className="text-center">
                  <p className="text-xs text-body-muted">
                    Already have an account?{" "}
                    <Link
                      href="/login"
                      className="text-primary hover:underline"
                    >
                      Sign in
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
