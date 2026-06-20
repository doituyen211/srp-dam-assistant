// ───────── Tenant API — httpOnly cookie auth ─────────
// All requests use credentials: "include" via apiFetch.
import { apiFetch, ApiError } from "./httpClient";

/**
 * Get current tenant information.
 */
export async function getCurrentTenant() {
  try {
    const res = await apiFetch("/tenants/current");
    return await res.json();
  } catch {
    return null;
  }
}

/**
 * Get tenant domain allowlist.
 */
export async function getTenantDomains() {
  try {
    const res = await apiFetch("/tenants/current/domains");
    return await res.json();
  } catch {
    return [];
  }
}

/**
 * Get academic units for the current tenant.
 */
export async function getAcademicUnits() {
  try {
    const res = await apiFetch("/tenants/current/academic-units");
    return await res.json();
  } catch {
    return [];
  }
}

/**
 * Get all users in the current tenant (admin only).
 */
export async function getTenantUsers() {
  try {
    const res = await apiFetch("/tenant/users");
    return await res.json();
  } catch (err) {
    if (err instanceof ApiError && err.status === 403) {
      throw new Error("Only administrators can view tenant users.");
    }
    throw err;
  }
}

/**
 * Get memberships for the current user.
 */
export async function getMyMemberships() {
  try {
    const res = await apiFetch("/tenant/users/me/memberships");
    return await res.json();
  } catch {
    return [];
  }
}

// ─── Super Admin: Tenant Management ───

/**
 * List all tenants (super_admin only).
 */
export async function listTenants() {
  const res = await apiFetch("/tenants");
  const data = await res.json();
  return Array.isArray(data) ? data : data?.tenants || data?.items || [];
}

/**
 * Onboard a new tenant (super_admin only).
 * Creates tenant + domain + academic units + admin user.
 */
export async function onboardTenant(payload) {
  const res = await apiFetch("/tenants/onboard", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return res.json();
}

/**
 * Update a tenant (super_admin only).
 */
export async function updateTenant(tenantId, payload) {
  const res = await apiFetch(`/tenants/${tenantId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
  return res.json();
}

/**
 * Get tenant by ID (super_admin only).
 */
export async function getTenantById(tenantId) {
  const res = await apiFetch(`/tenants/${tenantId}`);
  return res.json();
}

/**
 * Add a domain to a tenant (super_admin only).
 */
export async function addTenantDomain(tenantId, domain) {
  const res = await apiFetch(`/tenants/${tenantId}/domains`, {
    method: "POST",
    body: JSON.stringify({ domain }),
  });
  return res.json();
}

/**
 * Delete a tenant domain (super_admin only).
 */
export async function deleteTenantDomain(tenantId, domainId) {
  await apiFetch(`/tenants/${tenantId}/domains/${domainId}`, { method: "DELETE" });
}

/**
 * Add an academic unit to a tenant (super_admin only).
 */
export async function addAcademicUnit(tenantId, unit) {
  const res = await apiFetch(`/tenants/${tenantId}/academic-units`, {
    method: "POST",
    body: JSON.stringify(unit),
  });
  return res.json();
}

/**
 * Delete an academic unit (super_admin only).
 */
export async function deleteAcademicUnit(tenantId, unitId) {
  await apiFetch(`/tenants/${tenantId}/academic-units/${unitId}`, { method: "DELETE" });
}

// ─── Invites ───

/**
 * Create an invite for a tenant (admin/super_admin).
 */
export async function createInvite(tenantId, email, role) {
  const res = await apiFetch(`/tenant/invites`, {
    method: "POST",
    body: JSON.stringify({ tenant_id: tenantId, email, role }),
  });
  return res.json();
}

/**
 * List invites for a tenant.
 */
export async function listInvites(tenantId) {
  const res = await apiFetch(`/tenant/invites${tenantId ? `?tenant_id=${tenantId}` : ""}`);
  const data = await res.json();
  return Array.isArray(data) ? data : data?.invites || data?.items || [];
}

/**
 * Cancel an invite.
 */
export async function cancelInvite(inviteId) {
  await apiFetch(`/tenant/invites/${inviteId}`, { method: "DELETE" });
}

// ─── Tenant Settings ───

/**
 * Update current tenant plan (tenant_admin).
 */
export async function updateTenantPlan(payload) {
  const res = await apiFetch("/tenants/current/plan", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
  return res.json();
}

/**
 * Update LLM settings for current tenant (tenant_admin).
 * Supports bring-your-own-key mode.
 */
export async function updateTenantLlmSettings(payload) {
  const res = await apiFetch("/tenants/current/llm-settings", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
  return res.json();
}

/**
 * Verify a tenant domain (admin). Checks cross-tenant ownership.
 */
export async function verifyTenantDomain(domainId) {
  const res = await apiFetch(`/tenants/current/domains/${domainId}/verify`, {
    method: "POST",
  });
  return res.json();
}

// ─── Tenant User Management ───

/**
 * Create a membership for a user (tenant_admin).
 */
export async function createUserMembership(userId, payload) {
  const res = await apiFetch(`/tenant/users/${userId}/memberships`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return res.json();
}

/**
 * Activate or disable a user (tenant_admin).
 */
export async function updateUserStatus(userId, payload) {
  const res = await apiFetch(`/tenant/users/${userId}/status`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
  return res.json();
}
