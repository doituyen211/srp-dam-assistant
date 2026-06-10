"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { USER_ROLES } from "@/lib/constants";

const roleLabels = {
  [USER_ROLES.STUDENT]: "Student",
  [USER_ROLES.REVIEWER]: "Reviewer",
  [USER_ROLES.ADMIN]: "Admin",
  [USER_ROLES.LECTURER]: "Lecturer",
};

/**
 * Topbar - Top navigation with user info and logout
 */
export function Topbar({ onMenuToggle, isMenuOpen = false }) {
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

  const roleLabel = user ? roleLabels[user.role] || user.role : "";

  return (
    <header className="sticky top-0 z-30 h-14 border-b border-hairline bg-canvas">
      <div className="flex h-full items-center justify-between px-5 md:px-8">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onMenuToggle}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-body-muted transition-colors hover:bg-soft-stone hover:text-ink md:hidden"
            aria-label={isMenuOpen ? "Đóng menu" : "Mở menu"}
            aria-expanded={isMenuOpen}
          >
            <svg
              aria-hidden="true"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.8}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <div>
            <h1 className="text-[15px] font-medium text-ink">SRP D&M Assistant</h1>
            <p className="hidden font-mono text-[10px] uppercase tracking-[0.12em] text-muted sm:block">
              Student Research Platform
            </p>
          </div>
        </div>

        {user && (
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="max-w-[220px] truncate text-[13px] font-medium text-ink">
                {user.name}
              </p>
              <p className="max-w-[220px] truncate text-xs text-body-muted">
                {user.email}
              </p>
            </div>
            <div className="hidden rounded bg-soft-stone px-2 py-1 font-mono text-[10px] uppercase tracking-[0.08em] text-body-muted md:block">
              {roleLabel}
            </div>
            <Button
              variant="ghost"
              onClick={handleLogout}
              disabled={loading}
              className="px-3 py-2 text-[13px] text-error hover:bg-[#fff0f0] hover:text-error"
            >
              Đăng xuất
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
