"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { USER_ROLES, CURRENT_TERM, ACADEMIC_TERMS } from "@/lib/constants";

// ───────── SVG Icons ─────────
const icons = {
  dashboard: <path d="M4.75 13.25h5v6h-5v-6Zm9.5-8.5h5v14.5h-5V4.75ZM4.75 4.75h5v5h-5v-5Z" />,
  proposals: <path d="M6.75 3.75h8.5L19.25 8v12.25H6.75V3.75Zm8 0V8.5h4.5M9 12h7M9 15.5h7M9 19h4" />,
  new_proposal: <path d="M12 5v14M5 12h14" />,
  review_queue: <path d="m5 12 4 4L19 6M4.75 20.25h14.5M4.75 3.75h10.5" />,
  matching: <path d="M8 8.25a4 4 0 1 1 8 0c0 2.75-4 7-4 7s-4-4.25-4-7Zm4 1.25a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5ZM5.75 20.25h12.5" />,
  admin: <path d="M12 3.75 19.25 7v5.25c0 4.25-2.9 6.85-7.25 8-4.35-1.15-7.25-3.75-7.25-8V7L12 3.75Zm0 5.25v5M12 16.75v.01" />,
  users: <path d="M15.75 8.5a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.25h15A3.75 3.75 0 0 0 15.75 16.5h-7.5A3.75 3.75 0 0 0 4.5 20.25Z" />,
  audit: <path d="M9 3.75H5.25A1.5 1.5 0 0 0 3.75 5.25v13.5a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5V5.25a1.5 1.5 0 0 0-1.5-1.5H15M9 3.75V1.5m0 2.25v2.25M15 5.25h2.25M15 9h2.25M15 12.75h2.25M5.25 15.75h13.5" />,
  settings: <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />,
  milestones: <path d="M9 12h6M9 16h3M12 8V2M12 8l3.5-3.5M12 8 8.5 4.5M4 12a8 8 0 1 1 16 0 8 8 0 0 1-16 0Z" />,
  supervision: <path d="M12 4.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7ZM5.5 19.5c0-3.5 2.5-6.5 6.5-6.5s6.5 3 6.5 6.5" />,
  rubric: <path d="M9 3.75H5.25A1.5 1.5 0 0 0 3.75 5.25v13.5a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5V5.25a1.5 1.5 0 0 0-1.5-1.5H15M9 3.75V1.5m0 2.25v2.25M15 5.25h2.25M15 9h2.25M15 12.75h2.25M5.25 15.75h13.5" />,
  history: <path d="M12 6v6l4 2M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z" />,
  decisions: <path d="M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />,
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
      {icons[name]}
    </svg>
  );
}

// ─── Navigation definitions (academic role-based) ───
const NAV_ITEMS = {
  [USER_ROLES.SUPER_ADMIN]: [
    { section: "Platform" },
    { label: "Dashboard", href: "/admin", icon: "dashboard" },
    { label: "Users", href: "/admin/users", icon: "users" },
    { label: "Faculties", href: "/admin/faculties", icon: "audit" },
    { section: "School" },
    { label: "All Proposals", href: "/proposals", icon: "proposals" },
    { label: "Settings", href: "/admin/settings", icon: "settings" },
  ],
  [USER_ROLES.STUDENT]: [
    { section: "Research Workspace" },
    { label: "Dashboard", href: "/dashboard", icon: "dashboard" },
    { label: "My Proposals", href: "/proposals", icon: "proposals" },
    { label: "New Proposal", href: "/proposals/new", icon: "new_proposal" },
  ],
  [USER_ROLES.REVIEWER]: [
    { section: "Review Panel" },
    { label: "Review Queue", href: "/review", icon: "review_queue" },
    { label: "All Proposals", href: "/proposals", icon: "proposals" },
    { label: "Dashboard", href: "/dashboard", icon: "dashboard" },
  ],
  [USER_ROLES.ADMIN]: [
    { section: "Operations" },
    { label: "Dashboard", href: "/dashboard", icon: "dashboard" },
    { label: "All Proposals", href: "/proposals", icon: "proposals" },
    { section: "Administration" },
    { label: "Users", href: "/admin/users", icon: "users" },
    { label: "System", href: "/admin", icon: "admin" },
    { label: "Settings", href: "/admin/settings", icon: "settings" },
  ],
  [USER_ROLES.LECTURER]: [
    { section: "Supervision" },
    { label: "Dashboard", href: "/dashboard", icon: "dashboard" },
    { label: "Proposals", href: "/proposals", icon: "proposals" },
  ],
};

/**
 * Sidebar - Academic role-based navigation
 */
export function Sidebar({ user, isOpen = true, onClose }) {
  const pathname = usePathname();

  const isActive = (href) => {
    return pathname === href || pathname?.startsWith(href + "/");
  };

  const currentTerm = ACADEMIC_TERMS.find((t) => t.id === CURRENT_TERM);
  const items = NAV_ITEMS[user?.role] || [];

  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-50 flex w-[256px] flex-col bg-primary text-white
        transition-transform duration-200 ease-out
        md:translate-x-0
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
    >
      {/* Brand header */}
      <div className="border-b border-white/10 px-5 pb-4 pt-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-sm font-semibold tracking-[0.04em] text-white">
              SRP D&amp;M Assistant
            </div>
            <div className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-white/45">
              Research Proposal Platform
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded text-white/60 transition-colors hover:bg-white/10 hover:text-white md:hidden"
            aria-label="Close menu"
          >
            <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 16 16" fill="currentColor">
              <path d="M4.22 4.22a.75.75 0 0 1 1.06 0L8 6.94l2.72-2.72a.75.75 0 1 1 1.06 1.06L9.06 8l2.72 2.72a.75.75 0 1 1-1.06 1.06L8 9.06l-2.72 2.72a.75.75 0 0 1-1.06-1.06L6.94 8 4.22 5.28a.75.75 0 0 1 0-1.06Z" />
            </svg>
          </button>
        </div>

        {/* Academic term badge */}
        {currentTerm && (
          <div className="mt-3 rounded border border-white/15 bg-white/[0.06] px-3 py-2">
            <div className="font-mono text-[10px] uppercase tracking-[0.08em] text-white/35">
              Academic Term
            </div>
            <div className="mt-0.5 text-xs font-medium text-white/80">
              {currentTerm.label}
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3">
        {items.map((item, index) => {
          if (item.section) {
            return (
              <div
                key={item.section}
                className={`px-5 pb-1.5 pt-4 font-mono text-[10px] font-medium uppercase tracking-[0.1em] text-white/30 ${
                  index === 0 ? "pt-1" : ""
                }`}
              >
                {item.section}
              </div>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 border-l-2 px-5 py-2.5 text-sm transition-colors duration-150
                ${
                  isActive(item.href)
                    ? "border-white bg-white/10 font-medium text-white"
                    : "border-transparent text-white/60 hover:bg-white/[0.06] hover:text-white"
                }
              `}
              onClick={onClose}
            >
              <NavIcon name={item.icon} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer — user identity */}
      <div className="border-t border-white/10 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-xs font-semibold text-white">
            {user.name?.charAt(0)?.toUpperCase() || "?"}
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-medium text-white">
              {user.name}
            </div>
            <div className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.08em] text-white/40">
              {user.role}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
