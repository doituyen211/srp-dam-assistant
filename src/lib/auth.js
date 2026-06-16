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
    const user = data.user || data;
    saveLastEmail(user.email || payload.email);
    return user;
  } catch (err) {
    if (err instanceof ApiError) {
      throw new Error(err.detail?.detail || err.detail?.message || err.message);
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
    const user = data.user || data;
    saveLastEmail(user.email || email);
    return user;
  } catch (err) {
    if (err instanceof ApiError) {
      throw new Error(err.detail?.detail || err.detail?.message || err.message);
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
    return data.user || data || null;
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
 * Uses the same real POST /auth/login endpoint.
 */
export async function loginDemoRole(role) {
  return login(role.email, role.password);
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
