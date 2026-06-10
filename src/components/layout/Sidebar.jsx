"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { USER_ROLES } from "@/lib/constants";

const navIcons = {
  dashboard: (
    <path d="M4.75 13.25h5v6h-5v-6Zm9.5-8.5h5v14.5h-5V4.75ZM4.75 4.75h5v5h-5v-5Z" />
  ),
  proposals: (
    <path d="M6.75 3.75h8.5L19.25 8v12.25H6.75V3.75Zm8 0V8.5h4.5M9 12h7M9 15.5h7M9 19h4" />
  ),
  new: <path d="M12 5v14M5 12h14" />,
  review: (
    <path d="m5 12 4 4L19 6M4.75 20.25h14.5M4.75 3.75h10.5" />
  ),
  matching: (
    <path d="M8 8.25a4 4 0 1 1 8 0c0 2.75-4 7-4 7s-4-4.25-4-7Zm4 1.25a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5ZM5.75 20.25h12.5" />
  ),
  admin: (
    <path d="M12 3.75 19.25 7v5.25c0 4.25-2.9 6.85-7.25 8-4.35-1.15-7.25-3.75-7.25-8V7L12 3.75Zm0 5.25v5M12 16.75v.01" />
  ),
};

function NavIcon({ name }) {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4 flex-shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {navIcons[name]}
    </svg>
  );
}

const roleLabels = {
  [USER_ROLES.STUDENT]: "Student",
  [USER_ROLES.REVIEWER]: "Reviewer",
  [USER_ROLES.ADMIN]: "Admin",
  [USER_ROLES.LECTURER]: "Lecturer",
};

/**
 * Sidebar - Role-based navigation
 */
export function Sidebar({ user, isOpen = true, onClose }) {
  const pathname = usePathname();

  // Define role-based navigation items
  const navItems = {
    [USER_ROLES.STUDENT]: [
      { label: "Dashboard", href: "/dashboard", icon: "dashboard" },
      { label: "Đề tài của tôi", href: "/proposals", icon: "proposals" },
      { label: "Tạo đề tài", href: "/proposals/new", icon: "new" },
    ],
    [USER_ROLES.REVIEWER]: [
      { label: "Dashboard", href: "/dashboard", icon: "dashboard" },
      { label: "Đề tài", href: "/proposals", icon: "proposals" },
      { label: "Đánh giá", href: "/review", icon: "review" },
    ],
    [USER_ROLES.ADMIN]: [
      { label: "Dashboard", href: "/dashboard", icon: "dashboard" },
      { label: "Đề tài", href: "/proposals", icon: "proposals" },
      { label: "Đánh giá", href: "/review", icon: "review" },
      { label: "Gợi ý GV", href: "/matching", icon: "matching" },
      { label: "Quản trị", href: "/admin", icon: "admin" },
    ],
    [USER_ROLES.LECTURER]: [
      { label: "Dashboard", href: "/dashboard", icon: "dashboard" },
      { label: "Đề tài", href: "/proposals", icon: "proposals" },
      { label: "Gợi ý GV", href: "/matching", icon: "matching" },
    ],
  };

  const items = navItems[user?.role] || [];

  const isActive = (href) => {
    return pathname === href || pathname?.startsWith(href + "/");
  };

  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-50 flex w-[240px] flex-col bg-primary text-white
        transition-transform duration-200 ease-out
        md:translate-x-0
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
    >
      <div className="border-b border-white/10 px-5 pb-4 pt-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-[13px] font-semibold tracking-[0.04em] text-white">
              SRP D&M
            </div>
            <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.12em] text-white/45">
              Research Platform
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-white/60 transition-colors hover:bg-white/10 hover:text-white md:hidden"
            aria-label="Đóng menu"
          >
            <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 16 16" fill="currentColor">
              <path d="M4.22 4.22a.75.75 0 0 1 1.06 0L8 6.94l2.72-2.72a.75.75 0 1 1 1.06 1.06L9.06 8l2.72 2.72a.75.75 0 1 1-1.06 1.06L8 9.06l-2.72 2.72a.75.75 0 0 1-1.06-1.06L6.94 8 4.22 5.28a.75.75 0 0 1 0-1.06Z" />
            </svg>
          </button>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <div className="px-5 pb-2 pt-3 font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-white/35">
          Navigation
        </div>
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`
              flex items-center gap-2.5 border-l-2 px-5 py-2 text-sm transition-colors duration-150
              ${
                isActive(item.href)
                  ? "border-white bg-white/10 font-medium text-white"
                  : "border-transparent text-white/65 hover:bg-white/[0.06] hover:text-white"
              }
            `}
            onClick={onClose}
          >
            <NavIcon name={item.icon} />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="border-t border-white/10 px-5 py-4">
        <div className="truncate text-[13px] font-medium text-white">{user.name}</div>
        <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.12em] text-white/40">
          {roleLabels[user.role] || user.role}
        </div>
      </div>
    </aside>
  );
}
