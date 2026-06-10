"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { USER_ROLES } from "@/lib/constants";

/**
 * Sidebar - Role-based navigation
 */
export function Sidebar({ user, isOpen = true, onClose }) {
  const pathname = usePathname();

  // Define role-based navigation items
  const navItems = {
    [USER_ROLES.STUDENT]: [
      { label: "Dashboard", href: "/dashboard", icon: "📊" },
      { label: "Đề tài của tôi", href: "/proposals", icon: "📝" },
      { label: "Tạo đề tài", href: "/proposals/new", icon: "✨" },
    ],
    [USER_ROLES.REVIEWER]: [
      { label: "Dashboard", href: "/dashboard", icon: "📊" },
      { label: "Đề tài", href: "/proposals", icon: "📝" },
      { label: "Đánh giá", href: "/review", icon: "✅" },
    ],
    [USER_ROLES.ADMIN]: [
      { label: "Dashboard", href: "/dashboard", icon: "📊" },
      { label: "Đề tài", href: "/proposals", icon: "📝" },
      { label: "Đánh giá", href: "/review", icon: "✅" },
      { label: "Gợi ý GV", href: "/matching", icon: "🎓" },
      { label: "Quản trị", href: "/admin", icon: "⚙️" },
    ],
    [USER_ROLES.LECTURER]: [
      { label: "Dashboard", href: "/dashboard", icon: "📊" },
      { label: "Đề tài", href: "/proposals", icon: "📝" },
      { label: "Gợi ý GV", href: "/matching", icon: "🎓" },
    ],
  };

  const items = navItems[user?.role] || [];

  const isActive = (href) => {
    return pathname === href || pathname?.startsWith(href + "/");
  };

  return (
    <div
      className={`
        fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-slate-200 
        shadow-sm z-40 transition-transform duration-200
        md:static md:top-auto md:shadow-none md:translate-x-0
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
    >
      <nav className="p-4 space-y-1">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`
              flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm
              transition-colors duration-150 cursor-pointer block
              ${
                isActive(item.href)
                  ? "bg-blue-100 text-blue-900 font-medium"
                  : "text-slate-700 hover:bg-slate-100"
              }
            `}
            onClick={onClose}
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
