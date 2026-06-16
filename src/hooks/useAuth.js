"use client";

import { useState, useCallback, useEffect } from "react";
import {
  login as authLogin,
  register as authRegister,
  getMe,
  logout as authLogout,
  hasRole as checkRole,
} from "@/lib/auth";

/**
 * useAuth — Authentication hook backed by httpOnly cookie JWT.
 *
 * On mount:
 *   Calls GET /auth/me to restore session from httpOnly cookie.
 *   If the cookie is valid, user is set.
 *   If 401 / expired, user stays null.
 *   loading stops in both cases.
 *
 * Session persists across browser refreshes because the cookie
 * is sent automatically with credentials: "include".
 *
 * No JWT tokens are stored in LocalStorage or JavaScript.
 */
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ── Session restore on mount ──
  useEffect(() => {
    let mounted = true;

    const restore = async () => {
      try {
        const currentUser = await getMe();
        if (mounted) {
          setUser(currentUser);
        }
      } catch {
        if (mounted) setUser(null);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    restore();

    return () => {
      mounted = false;
    };
  }, []);

  // ── Login ──
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

  // ── Register ──
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

  // ── Logout ──
  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await authLogout();
    } catch {
      // Swallow — clear local state
    } finally {
      setUser(null);
      setError(null);
      setLoading(false);
    }
  }, []);

  // ── Manual user re-fetch ──
  const refetchUser = useCallback(async () => {
    try {
      const currentUser = await getMe();
      setUser(currentUser);
      return currentUser;
    } catch {
      setUser(null);
      return null;
    }
  }, []);

  // ── Helpers ──
  const isAuthenticated = useCallback(() => user !== null, [user]);
  const hasRole = useCallback(
    (roles) => checkRole(user, roles),
    [user],
  );

  return {
    user,
    loading,
    error,
    isAuthenticated,
    login,
    register,
    logout,
    refetchUser,
    hasRole,
  };
};
