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
  ideas: <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />,
  projects: <path d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />,
  profile: <path d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />,
  universities: <path d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342" />,
  subscriptions: <path d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />,
  analytics: <path d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125v-6.75zM16.5 5.375c0-.621.504-1.125 1.125-1.125h2.25C20.496 4.25 21 4.754 21 5.375v13.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125v-6.75z" />,
  lecturers: <path d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />,
  matching: <path d="M8 8.25a4 4 0 1 1 8 0c0 2.75-4 7-4 7s-4-4.25-4-7Zm4 1.25a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5ZM5.75 20.25h12.5" />,
  admin: <path d="M12 3.75 19.25 7v5.25c0 4.25-2.9 6.85-7.25 8-4.35-1.15-7.25-3.75-7.25-8V7L12 3.75Zm0 5.25v5M12 16.75v.01" />,
  users: <path d="M15.75 8.5a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.25h15A3.75 3.75 0 0 0 15.75 16.5h-7.5A3.75 3.75 0 0 0 4.5 20.25Z" />,
  settings: <path d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.213-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.729 6.729 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.213-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.12c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.213.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828c-.424-.35-.534-.954-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.213.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />,
  milestones: <path d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />,
  reports: <path d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />,
  deliverables: <path d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 006 3.75h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H18A2.25 2.25 0 0120.25 9v.776" />,
  history: <path d="M12 6v6l4 2M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z" />,
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

// ─── Navigation definitions (per spec) ───
const NAV_ITEMS = {
  [USER_ROLES.STUDENT]: [
    { section: "Research" },
    { label: "Dashboard", href: "/dashboard", icon: "dashboard" },
    { label: "Proposals", href: "/proposals", icon: "proposals" },
    { label: "Projects", href: "/projects", icon: "projects" },
    { section: "Account" },
    { label: "Profile", href: "/profile", icon: "profile" },
  ],
  [USER_ROLES.REVIEWER]: [
    { section: "Review" },
    { label: "Dashboard", href: "/dashboard", icon: "dashboard" },
    { label: "Review Queue", href: "/review", icon: "review_queue" },
    { label: "Projects", href: "/projects", icon: "projects" },
  ],
  [USER_ROLES.ADMIN]: [
    { section: "Management" },
    { label: "Dashboard", href: "/dashboard", icon: "dashboard" },
    { label: "Proposals", href: "/proposals", icon: "proposals" },
    { label: "Review Queue", href: "/review", icon: "review_queue" },
    { label: "Projects", href: "/projects", icon: "projects" },
    { section: "Administration" },
    { label: "Lecturers", href: "/admin/lecturers", icon: "lecturers" },
    { label: "Analytics", href: "/admin/analytics", icon: "analytics" },
  ],
  [USER_ROLES.SUPER_ADMIN]: [
    { section: "Platform" },
    { label: "Dashboard", href: "/dashboard", icon: "dashboard" },
    { label: "Universities", href: "/admin/universities", icon: "universities" },
    { label: "Subscriptions", href: "/admin/subscriptions", icon: "subscriptions" },
    { section: "Settings" },
    { label: "Platform Settings", href: "/admin/settings", icon: "settings" },
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
