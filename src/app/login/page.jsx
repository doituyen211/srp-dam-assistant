"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Alert";
import { Input } from "@/components/ui/Input";

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

export default function LoginPage() {
  const router = useRouter();
  const { user, login, loading, error } = useAuth();
  const [localError, setLocalError] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (user) router.push(getRedirectPath(user.role));
  }, [user, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);
    if (!email.trim() || !password.trim()) {
      setLocalError("Please enter your email and password.");
      return;
    }
    try {
      const userData = await login(email.trim(), password);
      if (userData) router.push(getRedirectPath(userData.role));
    } catch (err) {
      const status = err.status || err.message;
      const msg =
        status === 404 ? "Authentication service not found. Check API URL configuration."
        : status === 422 ? "Please check your input and try again."
        : status === 401 || status === 403 || String(status).includes("401") ? "Invalid email or password."
        : String(status).includes("fetch") || String(status).includes("Failed to fetch")
          ? "Unable to connect to server. Check your connection and try again."
          : err.message || "Login failed. Please try again.";
      setLocalError(msg);
    }
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
              <CardTitle>Sign in to Research Office</CardTitle>
              <p className="mt-1 text-sm text-body-muted">Access the research proposal management workspace.</p>
            </CardHeader>
            <CardContent>
              {(error || localError) && (
                <div className="mb-5">
                  <Alert type="error">{error || localError}</Alert>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@university.edu" required disabled={loading} autoComplete="email" />
                <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password" required disabled={loading} autoComplete="current-password" />
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted italic">Forgot password? Coming soon</span>
                </div>
                <Button type="submit" variant="primary" loading={loading} disabled={loading} className="w-full justify-center">
                  Sign in
                </Button>
              </form>

              <div className="mt-5 text-center">
                <Link href="/register" className="text-sm text-primary hover:underline">Create student account →</Link>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6 text-center">
            <p className="text-xs text-muted">By signing in, you agree to the terms of use.</p>
          </div>

          {/* Demo Accounts */}
          <div className="mt-6 rounded-lg border border-hairline bg-canvas p-4">
            <p className="mb-3 text-xs font-semibold text-ink">Demo Accounts</p>
            <p className="mb-2 text-xs text-body-muted">All passwords: <code className="rounded bg-subdued px-1.5 py-0.5 font-mono text-[11px]">password123</code></p>
            <div className="space-y-1.5">
              {[
                { email: "an.nguyen@university.edu", role: "Student" },
                { email: "bich.tran@university.edu", role: "Reviewer" },
                { email: "cuong.le@university.edu", role: "Admin" },
                { email: "duc.pham@university.edu", role: "Lecturer" },
                { email: "admin@platform.com", role: "Super Admin" },
              ].map((account) => (
                <button
                  key={account.email}
                  type="button"
                  onClick={() => { setEmail(account.email); setPassword("password123"); }}
                  className="flex w-full items-center justify-between rounded px-3 py-1.5 text-left text-xs transition-colors hover:bg-subdued"
                >
                  <span className="font-mono text-body-muted">{account.email}</span>
                  <span className="rounded bg-subdued px-2 py-0.5 text-[10px] font-medium text-muted">{account.role}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
