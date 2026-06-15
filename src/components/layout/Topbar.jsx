"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import {
  USER_ROLES,
  CURRENT_TERM,
  ACADEMIC_TERMS,
  ACADEMIC_ROLE_LABELS,
  ACADEMIC_ROLE_ENGLISH,
} from "@/lib/constants";

const ROLE_BADGE_COLORS = {
  [USER_ROLES.STUDENT]: "bg-info-bg text-info border-info/20",
  [USER_ROLES.REVIEWER]: "bg-warning-bg text-warning border-warning/20",
  [USER_ROLES.ADMIN]: "bg-danger/10 text-danger border-danger/20",
  [USER_ROLES.LECTURER]: "bg-success-bg text-success border-success/20",
};

/**
 * Topbar - Academic top navigation with role, user, term, and status
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

  if (!user) return null;

  const currentTerm = ACADEMIC_TERMS.find((t) => t.id === CURRENT_TERM);
  const roleBadgeColor = ROLE_BADGE_COLORS[user.role] || "bg-subdued text-body-muted border-hairline";

  return (
    <header className="sticky top-0 z-30 h-14 border-b border-hairline bg-canvas">
      <div className="flex h-full items-center justify-between px-4 sm:px-6 md:px-8">
        {/* Left: menu toggle + branding */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMenuToggle}
            className="flex h-9 w-9 items-center justify-center rounded text-body-muted transition-colors hover:bg-subdued hover:text-ink md:hidden"
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

          <div className="hidden sm:block">
            <h1 className="text-sm font-semibold text-ink">
              SRP D&amp;M Assistant
            </h1>
            <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
              Research Proposal Platform
            </p>
          </div>
        </div>

        {/* Right: term badge + role badge + user info + logout */}
        <div className="flex items-center gap-3">
          {/* Academic term */}
          {currentTerm && (
            <div className="hidden rounded border border-hairline bg-subdued px-2.5 py-1 font-mono text-[10px] tracking-[0.04em] text-body-muted lg:block">
              {currentTerm.label}
            </div>
          )}

          {/* Role badge */}
          <div
            className={`hidden rounded border px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.06em] md:block ${roleBadgeColor}`}
          >
            {ACADEMIC_ROLE_ENGLISH[user.role] || user.role}
          </div>

          {/* User info */}
          <div className="hidden text-right sm:block">
            <p className="max-w-[180px] truncate text-sm font-medium text-ink">
              {user.name}
            </p>
            <p className="max-w-[180px] truncate text-xs text-body-muted">
              {user.email}
            </p>
          </div>

          {/* User avatar */}
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-white">
            {user.name?.charAt(0)?.toUpperCase() || "?"}
          </div>

          {/* Logout */}
          <Button
            variant="ghost"
            onClick={handleLogout}
            disabled={loading}
            className="px-2.5 py-1 text-xs text-body-muted hover:text-danger"
          >
            Đăng xuất
          </Button>
        </div>
      </div>
    </header>
  );
}
