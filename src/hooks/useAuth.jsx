"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  login as authLogin,
  register as authRegister,
  getMe,
  logout as authLogout,
} from "@/lib/api";
import { hasRole as checkRole } from "@/lib/constants";

const AuthContext = createContext();

const PUBLIC_ROUTES = ["/", "/login", "/register"];

function getRedirectPath(role) {
  switch (role) {
    case "super_admin": return "/admin/users";
    case "reviewer": return "/review";
    case "admin": return "/admin";
    case "lecturer": return "/dashboard";
    case "student":
    default: return "/dashboard";
  }
}

function isPublicRoute(pathname) {
  return PUBLIC_ROUTES.includes(pathname) ||
    PUBLIC_ROUTES.some((r) => pathname.startsWith(r + "/") && r !== "/");
}

export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Session restore on mount
  useEffect(() => {
    let mounted = true;
    const publicPage = isPublicRoute(pathname);

    if (publicPage) {
      // On public pages: check if already logged in, redirect if so
      const checkExistingSession = async () => {
        try {
          const currentUser = await getMe();
          if (mounted && currentUser) {
            setUser(currentUser);
            router.push(getRedirectPath(currentUser.role));
            return;
          }
        } catch {
          // Not logged in — stay on public page
        }
        if (mounted) setLoading(false);
      };
      checkExistingSession();
      return () => { mounted = false; };
    }

    // On protected pages: restore session
    const restore = async () => {
      try {
        const currentUser = await getMe();
        if (mounted) setUser(currentUser);
      } catch {
        if (mounted) setUser(null);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    restore();
    return () => { mounted = false; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const userData = await authLogin(email, password);
      setUser(userData);
      return userData;
    } catch (err) {
      const message = err.message || "Login failed";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const userData = await authRegister(payload);
      setUser(userData);
      return userData;
    } catch (err) {
      const message = err.message || "Registration failed";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    try { await authLogout(); }
    catch { /* swallow */ }
    finally { setUser(null); setError(null); setLoading(false); }
  }, []);

  const isAuthenticated = useCallback(() => user !== null, [user]);
  const hasRole = useCallback((roles) => checkRole(user, roles), [user]);
  const isSuperAdmin = user?.role === "super_admin";
  const isAdmin = user?.role === "admin" || user?.role === "super_admin";
  const isStudent = user?.role === "student";
  const isReviewer = user?.role === "reviewer";
  const isLecturer = user?.role === "lecturer";

  const value = {
    user,
    loading,
    error,
    isAuthenticated,
    login,
    register,
    logout,
    hasRole,
    isSuperAdmin,
    isAdmin,
    isStudent,
    isReviewer,
    isLecturer,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
