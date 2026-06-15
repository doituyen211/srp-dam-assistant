"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Alert";
import { Badge } from "@/components/ui/Badge";

const ROLES = [
  {
    id: "student",
    label: "Student",
    email: "student@demo.com",
    password: "demo123",
    badge: "Sinh viên",
    color: "bg-info-bg text-info border-info/20",
    description: "Draft proposals, receive AI pre-review, submit for evaluation, track milestone progress.",
  },
  {
    id: "reviewer",
    label: "Reviewer",
    email: "reviewer@demo.com",
    password: "demo123",
    badge: "Đánh giá viên",
    color: "bg-warning-bg text-warning border-warning/20",
    description: "Triage proposals, score using rubric criteria, request revisions, recommend approval.",
  },
  {
    id: "admin",
    label: "Admin",
    email: "admin@demo.com",
    password: "demo123",
    badge: "Quản trị",
    color: "bg-danger/10 text-danger border-danger/20",
    description: "Monitor workflow pipeline, manage supervisor matching, view audit logs, configure system.",
  },
  {
    id: "lecturer",
    label: "Lecturer",
    email: "lecturer@demo.com",
    password: "demo123",
    badge: "Giảng viên",
    color: "bg-success-bg text-success border-success/20",
    description: "Review assigned proposals, view matching suggestions, track supervision load.",
  },
];

export default function LoginPage() {
  const router = useRouter();
  const { user, login, loading, error } = useAuth();
  const [localError, setLocalError] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);

  useEffect(() => {
    if (user) router.push("/dashboard");
  }, [user, router]);

  const handleRoleLogin = async (role) => {
    setSelectedRole(role.id);
    setLocalError(null);
    try {
      await login(role.email, role.password);
      router.push("/dashboard");
    } catch (err) {
      setLocalError(err.message || "Login failed.");
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-app-bg">
      {/* Simple header */}
      <div className="border-b border-hairline bg-canvas px-5 py-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-body-muted transition-colors hover:text-ink"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5m7-7l-7 7 7 7" />
          </svg>
          Back to home
        </Link>
      </div>

      <div className="flex flex-1 items-center justify-center px-5 py-10">
        <div className="w-full max-w-3xl">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mb-4 inline-flex rounded border border-primary/20 bg-primary/5 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-primary">
              Competition Demo
            </div>
            <h1 className="text-2xl font-semibold text-ink">
              Select a role to explore
            </h1>
            <p className="mt-2 text-sm text-body-muted">
              Each account provides a different view of the platform. No password
              needed — just click a role to log in instantly.
            </p>
          </div>

          {(error || localError) && (
            <div className="mb-6 max-w-md mx-auto">
              <Alert type="error">{error || localError}</Alert>
            </div>
          )}

          {/* Role cards */}
          <div className="grid gap-4 sm:grid-cols-2">
            {ROLES.map((role) => (
              <button
                key={role.id}
                type="button"
                onClick={() => handleRoleLogin(role)}
                disabled={loading}
                className="w-full text-left transition-all duration-150 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2 disabled:opacity-50 disabled:hover:translate-y-0"
              >
                <Card className="h-full border-hairline transition-colors hover:border-primary/30">
                  <CardContent className="flex flex-col gap-4 p-5">
                    <div className="flex items-center justify-between">
                      <h2 className="text-base font-semibold text-ink">
                        {role.label}
                      </h2>
                      <Badge className={`border ${role.color}`}>
                        {role.badge}
                      </Badge>
                    </div>
                    <p className="text-xs leading-6 text-body-muted">
                      {role.description}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted">
                      <span className="rounded bg-subdued px-2 py-0.5 font-mono">
                        {role.email}
                      </span>
                      <span className="opacity-50">·</span>
                      <span className="font-mono">{role.password}</span>
                    </div>
                    <div className="mt-auto">
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-primary">
                        {loading && selectedRole === role.id
                          ? "Logging in..."
                          : "Enter as " + role.label}
                        <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </button>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-xs text-muted">
              Demo credentials are pre-configured. All data is mock data stored
              in your browser session.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
