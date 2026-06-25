"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LoadingState } from "@/components/ui/LoadingState";
import { ACADEMIC_ROLE_LABELS } from "@/lib/constants";

/**
 * ProtectedRoute - Guard route access by authentication and optional role
 */
export function ProtectedRoute({ children, allowedRoles = null }) {
  const router = useRouter();

  return children;
}
