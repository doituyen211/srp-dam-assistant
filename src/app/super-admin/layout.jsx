"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { Button } from "@/components/ui/Button";
import { USER_ROLES } from "@/lib/constants";

const NAV_ITEMS = [
  { section: "System" },
  { label: "Dashboard", href: "/super-admin/overview", icon: "M4 6h16M4 10h16M4 14h16M4 18h16" },
  { label: "Tenants", href: "/super-admin/tenants", icon: "M19 21v-2a4 4 0 00-4-4H9a4 4 0 00-4 4v2M12 3a4 4 0 100 8 4 4 0 000-8z" },
  { label: "Invites", href: "/super-admin/invites", icon: "M15.75 8.5a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25h15A3.75 3.75 0 0015.75 16.5h-7.5A3.75 3.75 0 004.5 20.25z" },
  { section: "Platform" },
  { label: "Subscriptions", href: "/super-admin/subscriptions", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
  { label: "Settings", href: "/super-admin/settings", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" },
];

function NavIcon({ d }) {
  return <svg aria-hidden="true" className="h-4 w-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>;
}

function SuperAdminShell({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (href) => pathname === href || pathname?.startsWith(href + "/");

  const handleLogout = async () => { try { await logout(); } finally { router.push("/login"); } };

  return (
    <div className="min-h-screen bg-app-bg text-ink">
      <aside className={`fixed inset-y-0 left-0 z-50 flex w-[240px] flex-col bg-primary text-white transition-transform md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="border-b border-white/10 px-5 pb-4 pt-5">
          <div className="text-sm font-semibold text-white">SRP Platform Admin</div>
          <div className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-white/45">Super Admin Console</div>
        </div>
        <nav className="flex-1 overflow-y-auto py-3">
          {NAV_ITEMS.map((item, i) =>
            item.section ? (
              <div key={item.section} className={`px-5 pb-1.5 pt-4 font-mono text-[10px] font-medium uppercase tracking-[0.1em] text-white/30 ${i === 0 ? "pt-1" : ""}`}>{item.section}</div>
            ) : (
              <Link key={item.href} href={item.href} className={`flex items-center gap-3 border-l-2 px-5 py-2.5 text-sm transition-colors ${isActive(item.href) ? "border-white bg-white/10 font-medium text-white" : "border-transparent text-white/60 hover:bg-white/[0.06] hover:text-white"}`} onClick={() => setSidebarOpen(false)}>
                <NavIcon d={item.icon} />
                <span>{item.label}</span>
              </Link>
            )
          )}
        </nav>
        <div className="border-t border-white/10 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-xs font-semibold text-white">{user?.name?.charAt(0)?.toUpperCase() || "S"}</div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium text-white">{user?.name}</div>
              <div className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.08em] text-white/40">Super Admin</div>
            </div>
          </div>
        </div>
      </aside>

      {sidebarOpen && (
        <button type="button" aria-label="Close menu" className="fixed inset-0 z-40 bg-ink/40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="min-h-screen md:pl-[240px]">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-hairline bg-canvas px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => setSidebarOpen(!sidebarOpen)} className="flex h-9 w-9 items-center justify-center rounded text-body-muted hover:bg-subdued hover:text-ink md:hidden" aria-label="Toggle menu">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <span className="text-sm font-semibold text-ink">Platform Administration</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-body-muted sm:block">{user?.email}</span>
            <Button variant="ghost" onClick={handleLogout} disabled={loading} className="px-2.5 py-1 text-xs text-body-muted hover:text-danger">Sign out</Button>
          </div>
        </header>
        <main className="overflow-x-hidden">
          <div className="mx-auto w-full max-w-[1280px] px-4 py-6 sm:px-6 md:px-8 md:py-8 lg:px-10">{children}</div>
        </main>
      </div>
    </div>
  );
}

export default function SuperAdminLayout({ children }) {
  return (
    <ProtectedRoute allowedRoles={[USER_ROLES.SUPER_ADMIN]}>
      <SuperAdminShell>{children}</SuperAdminShell>
    </ProtectedRoute>
  );
}
