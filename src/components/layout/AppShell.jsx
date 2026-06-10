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
    <div className="flex flex-col h-screen bg-slate-50">
      {/* Topbar */}
      <Topbar onMenuToggle={handleMenuToggle} />

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        {user && (
          <>
            <Sidebar
              user={user}
              isOpen={sidebarOpen}
              onClose={handleCloseSidebar}
            />
            {/* Mobile Overlay */}
            {sidebarOpen && (
              <div
                className="fixed inset-0 bg-black/50 z-30 md:hidden"
                onClick={handleCloseSidebar}
              />
            )}
          </>
        )}

        {/* Content Area */}
        <main className="flex-1 overflow-auto">
          <div className="mt-16 md:mt-0 p-4 md:p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
