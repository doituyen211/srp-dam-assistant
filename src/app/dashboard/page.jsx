"use client";

import { AppShell } from "@/components/layout/AppShell";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { StudentDashboard } from "@/components/dashboard/StudentDashboard";
import { ReviewerDashboard } from "@/components/dashboard/ReviewerDashboard";
import { FacultyAdminDashboard } from "@/components/dashboard/FacultyAdminDashboard";
import { SuperAdminDashboard } from "@/components/dashboard/SuperAdminDashboard";
import { useAuth } from "@/hooks/useAuth";
import { USER_ROLES } from "@/lib/constants";

function DashboardContent() {
  const { user } = useAuth();

  switch (user?.role) {
    case USER_ROLES.STUDENT:
      return <StudentDashboard user={user} />;
    case USER_ROLES.REVIEWER:
      return <ReviewerDashboard user={user} />;
    case USER_ROLES.ADMIN:
      return <FacultyAdminDashboard user={user} />;
    case USER_ROLES.SUPER_ADMIN:
      return <SuperAdminDashboard user={user} />;
    case USER_ROLES.LECTURER:
      // Lecturers see the faculty admin dashboard for now
      return <FacultyAdminDashboard user={user} />;
    default:
      return <StudentDashboard user={user} />;
  }
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <AppShell>
        <DashboardContent />
      </AppShell>
    </ProtectedRoute>
  );
}
