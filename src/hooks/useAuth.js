"use client";

import { useState, useCallback } from "react";
import { api } from "@/lib/api";
import { saveSession, getSession, clearSession } from "@/lib/auth";
import { captureClientError } from "@/lib/sentry";

/**
 * useAuth - Authentication hook
 * Manages user session and auth operations
 */
export const useAuth = () => {
  const [user, setUser] = useState(() => getSession());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Login user with email and password
   */
  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      const userData = await api.login(email, password);
      saveSession(userData);
      setUser(userData);
      return userData;
    } catch (err) {
      const errorMessage =
        err.message === "Email hoặc mật khẩu không đúng"
          ? "Email hoặc mật khẩu chưa đúng."
          : "Đăng nhập thất bại. Vui lòng thử lại.";

      setError(errorMessage);
      captureClientError(err, { context: "login_failed" });
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Logout user
   */
  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await api.logout();
      clearSession();
      setUser(null);
      setError(null);
    } catch (err) {
      captureClientError(err, { context: "logout_failed" });
      // Still clear session even if API call fails
      clearSession();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Refresh current user from session
   */
  const refreshUser = useCallback(async () => {
    try {
      const currentUser = await api.getCurrentUser();
      if (currentUser) {
        saveSession(currentUser);
        setUser(currentUser);
      } else {
        clearSession();
        setUser(null);
      }
    } catch (err) {
      captureClientError(err, { context: "refresh_user_failed" });
    }
  }, []);

  /**
   * Check if user is authenticated
   */
  const isAuthenticated = useCallback(() => {
    return user !== null;
  }, [user]);

  return {
    user,
    loading,
    error,
    login,
    logout,
    refreshUser,
    isAuthenticated,
  };
};
