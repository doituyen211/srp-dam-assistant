"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Alert";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";

const DEMO_CREDENTIALS = [
  { role: "Student",     email: "student@example.edu",    password: "password123" },
  { role: "Reviewer",    email: "reviewer@example.edu",   password: "password123" },
  { role: "Admin",       email: "admin@example.edu",      password: "password123" },
  { role: "Lecturer",    email: "lecturer@example.edu",   password: "password123" },
];

function getRedirectPath(role) {
  switch (role) {
    case "reviewer":
      return "/review";
    case "admin":
      return "/admin";
    case "lecturer":
      return "/dashboard";
    case "student":
    default:
      return "/dashboard";
  }
}

export default function LoginPage() {
  const router = useRouter();
  const { user, login, loading, error } = useAuth();
  const [localError, setLocalError] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showDemo, setShowDemo] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      router.push(getRedirectPath(user.role));
    }
  }, [user, router]);

  // ── Email / password login ──
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLocalError(null);

    if (!email.trim() || !password.trim()) {
      setLocalError("Please enter your email and password.");
      return;
    }

    try {
      const userData = await login(email.trim(), password);
      if (userData) {
        router.push(getRedirectPath(userData.role));
      }
    } catch (err) {
      const message =
        err.message?.includes("401") || err.message?.includes("Invalid")
          ? "Invalid email or password."
          : err.message?.includes("fetch") || err.message?.includes("Failed to fetch")
            ? "Unable to connect to the server. Please check your connection and try again."
            : err.message || "Login failed. Please try again.";
      setLocalError(message);
    }
  };

  // ── Demo role login ──
  const handleDemoLogin = async (demoEmail, demoPassword) => {
    setLocalError(null);
    try {
      const userData = await login(demoEmail, demoPassword);
      if (userData) {
        router.push(getRedirectPath(userData.role));
      }
    } catch (err) {
      if (err.message?.includes("fetch") || err.message?.includes("Failed to fetch")) {
        setLocalError("Demo backend is not available. Please ensure the API server is running.");
      } else {
        setLocalError("Demo login failed. The credentials may have changed on the server.");
      }
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-app-bg">
      {/* Header */}
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
        <div className="w-full max-w-lg">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-semibold text-ink">Sign in</h1>
            <p className="mt-2 text-sm text-body-muted">
              Sign in with your institutional account.
            </p>
          </div>

          {(error || localError) && (
            <div className="mb-6">
              <Alert type="error">{error || localError}</Alert>
            </div>
          )}

          {/* ── Primary email login form ── */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Sign in with email</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleEmailLogin} className="space-y-5">
                <Input
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@university.edu"
                  required
                  disabled={loading}
                  autoComplete="email"
                />
                <Input
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  disabled={loading}
                  autoComplete="current-password"
                />
                <Button
                  type="submit"
                  variant="primary"
                  loading={loading}
                  disabled={loading}
                  className="w-full justify-center"
                >
                  Sign in
                </Button>
              </form>

              <div className="mt-5 text-center">
                <Link
                  href="/register"
                  className="text-sm text-primary hover:underline"
                >
                  Create a student account →
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* ── Demo login ── */}
          <div className="text-center">
            <button
              type="button"
              onClick={() => setShowDemo(!showDemo)}
              className="inline-flex items-center gap-1 text-xs text-muted hover:text-body-muted transition-colors"
            >
              {showDemo ? "Hide" : "Show"} demo login credentials
              <svg
                className={`h-3 w-3 transition-transform ${showDemo ? "rotate-180" : ""}`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
          </div>

          {showDemo && (
            <Card className="mt-4 border-dashed border-hairline">
              <CardContent className="p-5">
                <div className="mb-3">
                  <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted">
                    Demo role login — development only
                  </p>
                  <p className="mt-1 text-xs text-body-muted">
                    These accounts are pre-configured for development and
                    evaluation purposes. Not available in production.
                  </p>
                </div>

                <div className="space-y-2">
                  {DEMO_CREDENTIALS.map((cred) => (
                    <button
                      key={cred.role}
                      type="button"
                      onClick={() => handleDemoLogin(cred.email, cred.password)}
                      disabled={loading}
                      className="flex w-full items-center justify-between gap-3 rounded border border-hairline bg-canvas px-4 py-3 text-left transition-colors hover:bg-subdued disabled:opacity-50"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-ink">
                          {cred.role}
                        </p>
                        <p className="mt-0.5 font-mono text-xs text-muted">
                          {cred.email}
                        </p>
                      </div>
                      <Badge intent="muted" className="flex-shrink-0 font-mono">
                        {cred.password}
                      </Badge>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-xs text-muted">
              By signing in, you agree to the platform terms of use.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
