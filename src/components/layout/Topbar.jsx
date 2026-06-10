"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { STATUS_LABELS } from "@/lib/constants";

/**
 * Topbar - Top navigation with user info and logout
 */
export function Topbar({ onMenuToggle }) {
  const router = useRouter();
  const { user, logout, loading } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  // Map role to label
  const roleLabel = user
    ? STATUS_LABELS[user.role] ||
      user.role.charAt(0).toUpperCase() + user.role.slice(1)
    : "";

  return (
    <div className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 shadow-sm z-50">
      <div className="h-full px-4 md:px-6 flex items-center justify-between">
        {/* Left: Logo & Menu Toggle */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuToggle}
            className="md:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6 text-slate-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <h1 className="text-xl font-semibold text-slate-900 hidden md:block">
            SRP DAM
          </h1>
        </div>

        {/* Right: User Info & Logout */}
        {user && (
          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-slate-900">{user.name}</p>
              <p className="text-xs text-slate-500">{user.email}</p>
              <p className="text-xs text-blue-600 font-medium">{roleLabel}</p>
            </div>
            <Button
              variant="ghost"
              onClick={handleLogout}
              disabled={loading}
              className="text-sm"
            >
              Đăng xuất
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
