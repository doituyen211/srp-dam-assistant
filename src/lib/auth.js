// Session management - client-side only
const SESSION_KEY = "srp_session";

/**
 * Check if running in browser
 */
const isBrowser = () => typeof window !== "undefined";

/**
 * Save user session to localStorage
 * @param {Object} user user object
 */
export const saveSession = (user) => {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  } catch (e) {
    console.error("Failed to save session:", e);
  }
};

/**
 * Get user session from localStorage
 * @returns {Object|null} user object or null
 */
export const getSession = () => {
  if (!isBrowser()) return null;
  try {
    const session = localStorage.getItem(SESSION_KEY);
    return session ? JSON.parse(session) : null;
  } catch (e) {
    console.error("Failed to get session:", e);
    return null;
  }
};

/**
 * Clear user session from localStorage
 */
export const clearSession = () => {
  if (!isBrowser()) return;
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch (e) {
    console.error("Failed to clear session:", e);
  }
};

/**
 * Check if user is authenticated
 * @returns {boolean}
 */
export const isAuthenticated = () => {
  return getSession() !== null;
};

/**
 * Check if user has required role(s)
 * @param {Object} user user object
 * @param {string|Array} allowedRoles single role or array of roles
 * @returns {boolean}
 */
export const hasRole = (user, allowedRoles) => {
  if (!user) return false;

  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  return roles.includes(user.role);
};
