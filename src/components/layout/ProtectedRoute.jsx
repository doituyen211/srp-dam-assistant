"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { LoadingState } from "@/components/ui/LoadingState";
import { ACADEMIC_ROLE_LABELS } from "@/lib/constants";

/**
 * ProtectedRoute - Guard route access by authentication and optional role
 */
export function ProtectedRoute({ children, allowedRoles = null }) {
  const router = useRouter();
  const { user, loading, hasRole } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push("/login");
      return;
    }
    if (allowedRoles && !hasRole(allowedRoles)) {
      router.push("/dashboard");
    }
  }, [user, loading, allowedRoles, hasRole, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-app-bg">
        <LoadingState message="Authenticating session..." />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (allowedRoles && !hasRole(allowedRoles)) {
    const roleLabels = Array.isArray(allowedRoles)
      ? allowedRoles.map((r) => ACADEMIC_ROLE_LABELS[r] || r).join(", ")
      : ACADEMIC_ROLE_LABELS[allowedRoles] || allowedRoles;

    return (
      <div className="flex min-h-screen items-center justify-center bg-app-bg p-5">
        <div className="w-full max-w-lg rounded border border-hairline bg-canvas p-8 text-center shadow-card">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-danger-bg">
            <svg
              aria-hidden="true"
              className="h-8 w-8 text-danger"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 9v4m0 4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          </div>

          <h2 className="mb-2 text-lg font-semibold text-ink">
            Access Restricted
          </h2>
          <p className="mb-1 text-sm leading-6 text-body-muted">
            This page requires the role:
          </p>
          <p className="mb-6 text-sm font-medium text-primary">
            {roleLabels}
          </p>
          <p className="mb-6 text-sm leading-6 text-body-muted">
            Your current role (<strong>{ACADEMIC_ROLE_LABELS[user.role] || user.role}</strong>)
            does not have access to this section.
            Please contact the Research Office if you believe this is an error.
          </p>

          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center rounded bg-primary px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return children;
}
