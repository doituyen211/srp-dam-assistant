"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { HumanInLoopBanner } from "@/components/ui/HumanInLoopBanner";

/**
 * AppShell - Main layout with sidebar and topbar
 * Academic page-frame container: content sits inside a structured bordered area
 */
export function AppShell({
  children,
  showAdvisoryBanner = false,
}) {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleMenuToggle = () => setSidebarOpen(!sidebarOpen);
  const handleCloseSidebar = () => setSidebarOpen(false);

  return (
    <div className="min-h-screen bg-app-bg text-ink">
      {/* Sidebar */}
      {user && (
        <>
          <Sidebar user={user} isOpen={sidebarOpen} onClose={handleCloseSidebar} />
          {sidebarOpen && (
            <button
              type="button"
              aria-label="Đóng menu"
              className="fixed inset-0 z-40 bg-ink/40 backdrop-blur-[1px] md:hidden"
              onClick={handleCloseSidebar}
            />
          )}
        </>
      )}

      {/* Main area */}
      <div className={user ? "min-h-screen md:pl-[256px]" : "min-h-screen"}>
        <Topbar onMenuToggle={handleMenuToggle} isMenuOpen={sidebarOpen} />

        <main className="min-h-[calc(100vh-56px)] overflow-x-hidden">
          <div className="mx-auto w-full max-w-[1280px] px-4 py-6 sm:px-6 md:px-8 md:py-8 lg:px-10">
            {/* Optional advisory banner — used on review/matching pages */}
            {showAdvisoryBanner && (
              <div className="mb-6">
                <HumanInLoopBanner variant="inline" />
              </div>
            )}

            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
