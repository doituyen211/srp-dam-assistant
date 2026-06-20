// ───────── Auth API — httpOnly cookie JWT ─────────
// All requests use credentials: "include" so the browser sends httpOnly cookies.
// No tokens are stored in LocalStorage or JavaScript memory.
import { apiFetch, ApiError } from "./httpClient";

// ─── Safe localStorage (UI preferences only, never tokens) ───
const LAST_EMAIL_KEY = "srp_last_email";

export function getLastEmail() {
  if (typeof window === "undefined") return "";
  try {
    return localStorage.getItem(LAST_EMAIL_KEY) || "";
  } catch {
    return "";
  }
}

function saveLastEmail(email) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LAST_EMAIL_KEY, email);
  } catch {
    // Storage full or unavailable — silently ignore
  }
}

// ─── User response normalizer ───

/**
 * Normalize a user response from the backend.
 * Supports both { user: {...} } and flat { id, email, ... } shapes.
 * Does NOT expose tokens, passwords, or internal fields.
 *
 * @param {*} data - Raw response body from /auth/login, /auth/register, or /auth/me
 * @returns {Object|null} Safe user profile or null
 */
export function normalizeUserResponse(data) {
  if (!data) return null;
  const raw = data.user || data;
  if (!raw || !raw.id) return null;

  // Return only safe fields
  return {
    id: raw.id,
    tenant_id: raw.tenant_id || null,
    email: raw.email,
    name: raw.name,
    role: raw.role,
    faculty: raw.faculty || null,
    department: raw.department || null,
    title: raw.title || null,
    is_active: raw.is_active ?? true,
    is_verified: raw.is_verified ?? false,
    memberships: raw.memberships || [],
  };
}

// ─── Demo credentials map ───

const DEMO_CREDENTIALS = {
  student:  { email: "student@example.edu",  password: "password123" },
  reviewer: { email: "reviewer@example.edu", password: "password123" },
  admin:    { email: "admin@example.edu",    password: "password123" },
  lecturer: { email: "lecturer@example.edu", password: "password123" },
};

// ─── Auth API functions ───

/**
 * Register a new user account.
 * Backend sets httpOnly access + refresh cookies on success.
 */
export async function register(payload) {
  try {
    const res = await apiFetch("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    const user = normalizeUserResponse(data);
    if (user) saveLastEmail(user.email || payload.email);
    return user;
  } catch (err) {
    if (err instanceof ApiError) {
      const msg = err.data?.detail || err.data?.message || err.message;
      const wrapped = new Error(msg);
      wrapped.status = err.status;
      throw wrapped;
    }
    throw err;
  }
}

/**
 * Login with email and password.
 * Backend sets httpOnly access + refresh cookies on success.
 */
export async function login(email, password) {
  try {
    const res = await apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    const user = normalizeUserResponse(data);
    if (user) saveLastEmail(user.email || email);
    return user;
  } catch (err) {
    if (err instanceof ApiError) {
      const msg = err.data?.detail || err.data?.message || err.message;
      const wrapped = new Error(msg);
      wrapped.status = err.status;
      throw wrapped;
    }
    throw err;
  }
}

/**
 * Get current user from session cookie.
 * Returns user object or null (no session / expired).
 */
export async function getMe() {
  try {
    const res = await apiFetch("/auth/me");
    const data = await res.json();
    return normalizeUserResponse(data);
  } catch {
    return null;
  }
}

/**
 * Explicitly refresh the session.
 * httpClient already does this automatically on 401,
 * but this is useful for manual refresh (e.g. before critical operations).
 */
export async function refreshSession() {
  try {
    const res = await apiFetch("/auth/refresh", { method: "POST" });
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * Logout — clears httpOnly cookies on the backend.
 * Always succeeds from the frontend perspective.
 */
export async function logout() {
  try {
    await apiFetch("/auth/logout", { method: "POST" });
  } catch {
    // Swallow — clear local state regardless of network outcome
  }
}

/**
 * Dev-only: login with a predefined demo role.
 * Maps role name to demo credentials.
 *
 * @param {string} role - "student" | "reviewer" | "admin" | "lecturer"
 */
export async function loginDemoRole(role) {
  const creds = DEMO_CREDENTIALS[role];
  if (!creds) throw new Error(`Unknown demo role: ${role}`);
  return login(creds.email, creds.password);
}

/**
 * Accept an invite using a token.
 * Creates membership + sets httpOnly cookies.
 */
export async function acceptInvite(token) {
  try {
    const res = await apiFetch("/auth/accept-invite", {
      method: "POST",
      body: JSON.stringify({ token }),
    });
    const data = await res.json();
    return normalizeUserResponse(data);
  } catch (err) {
    if (err instanceof ApiError) {
      const msg = err.data?.detail || err.data?.message || err.message;
      const wrapped = new Error(msg);
      wrapped.status = err.status;
      throw wrapped;
    }
    throw err;
  }
}

// ─── Role check ───

/**
 * Check if user has one of the allowed roles.
 * @param {Object|null}  user
 * @param {string|string[]} allowedRoles
 * @returns {boolean}
 */
export const hasRole = (user, allowedRoles) => {
  if (!user) return false;
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  return roles.includes(user.role);
};
