"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

/**
 * AppShell - Main layout with sidebar and topbar
 */
export function AppShell({ children }) {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleMenuToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-app-bg text-ink">
      {user && (
        <>
          <Sidebar user={user} isOpen={sidebarOpen} onClose={handleCloseSidebar} />
          {sidebarOpen && (
            <button
              type="button"
              aria-label="Đóng menu"
              className="fixed inset-0 z-40 bg-primary/45 backdrop-blur-[1px] md:hidden"
              onClick={handleCloseSidebar}
            />
          )}
        </>
      )}

      <div className={user ? "min-h-screen md:pl-[240px]" : "min-h-screen"}>
        <Topbar onMenuToggle={handleMenuToggle} isMenuOpen={sidebarOpen} />
        <main className="min-h-[calc(100vh-56px)] overflow-x-hidden">
          <div className="w-full max-w-[1200px] px-5 py-6 md:px-8 md:py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
