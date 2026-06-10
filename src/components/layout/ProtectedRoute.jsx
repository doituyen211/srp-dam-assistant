"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { hasRole } from "@/lib/auth";
import { LoadingState } from "@/components/ui/LoadingState";
import { Alert } from "@/components/ui/Alert";

/**
 * ProtectedRoute - Guard route access by authentication and optional role
 * @param {Object} props
 * @param {ReactNode} props.children - Component to render if authorized
 * @param {Array} props.allowedRoles - Optional array of allowed roles
 */
export function ProtectedRoute({ children, allowedRoles = null }) {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    // Still loading - don't do anything yet
    if (loading) return;

    // Not authenticated - redirect to login
    if (!user) {
      router.push("/login");
      return;
    }

    // Check role if specified
    if (allowedRoles && !hasRole(user, allowedRoles)) {
      // User doesn't have required role - redirect to dashboard
      router.push("/dashboard");
    }
  }, [user, loading, allowedRoles, router]);

  // Show loading while checking auth
  if (loading) {
    return <LoadingState message="Đang kiểm tra xác thực..." />;
  }

  // Not authenticated
  if (!user) {
    return null; // Will redirect in useEffect
  }

  // Role check failed
  if (allowedRoles && !hasRole(user, allowedRoles)) {
    return (
      <div className="mx-auto max-w-2xl p-5 md:p-8">
        <Alert type="error" title="Quyền hạn bị từ chối">
          Bạn không có quyền truy cập trang này. Vui lòng liên hệ quản trị viên.
        </Alert>
      </div>
    );
  }

  // All checks passed
  return children;
}
