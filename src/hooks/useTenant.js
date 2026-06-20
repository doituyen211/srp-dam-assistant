"use client";

import { useState, useEffect } from "react";
import { getCurrentTenant } from "@/lib/tenant";
import { useAuth } from "./useAuth";

/**
 * useTenant — Loads and provides current tenant context.
 *
 * Fetches /tenants/current when the user is authenticated.
 * Tenant data is optional-safe — UI will not crash if the API fails.
 */
export const useTenant = () => {
  const { user, isAuthenticated } = useAuth();
  const [tenant, setTenant] = useState(null);
  const [error, setError] = useState(null);
  const authenticated = isAuthenticated();

  useEffect(() => {
    if (!authenticated) return;

    let mounted = true;

    getCurrentTenant()
      .then((data) => {
        if (mounted) setTenant(data);
      })
      .catch((err) => {
        if (mounted) setError(err.message || "Failed to load tenant");
      });

    return () => {
      mounted = false;
    };
  }, [user?.tenant_id, authenticated]);

  const tenantName = tenant?.display_name || tenant?.name || null;

  return {
    tenant,
    tenantName,
    loading: authenticated && !tenant && !error,
    error,
  };
};
