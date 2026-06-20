"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import {
  login as authLogin,
  loginDemoRole as authLoginDemoRole,
  register as authRegister,
  getMe,
  refreshSession,
  logout as authLogout,
  hasRole as checkRole,
} from "@/lib/auth";

// 1. Tạo Context
const AuthContext = createContext();

// 2. Tạo Provider bọc toàn bộ ứng dụng
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ── Session restore on mount (Chỉ chạy 1 lần duy nhất) ──
  useEffect(() => {
    let mounted = true;

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

    return () => {
      mounted = false;
    };
  }, []);

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

  const loginDemo = useCallback(async (roleName) => {
    setLoading(true);
    setError(null);
    try {
      const userData = await authLoginDemoRole(roleName);
      setUser(userData);
      return userData;
    } catch (err) {
      const message = err.message || "Demo login failed";
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
    try {
      await authLogout();
    } catch {
    } finally {
      setUser(null);
      setError(null);
      setLoading(false);
    }
  }, []);

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

  const refresh = useCallback(async () => {
    try {
      return await refreshSession();
    } catch {
      return false;
    }
  }, []);

  const isAuthenticated = useCallback(() => user !== null, [user]);
  const hasRole = useCallback((roles) => checkRole(user, roles), [user]);
  const isSuperAdmin = user?.role === "super_admin";
  const isAdmin = user?.role === "admin" || user?.role === "super_admin";
  const isStudent = user?.role === "student";
  const isReviewer = user?.role === "reviewer";
  const isLecturer = user?.role === "lecturer";

  // Đẩy tất cả state và hàm xuống Context
  const value = {
    user,
    loading,
    error,
    isAuthenticated,
    login,
    loginDemo,
    register,
    logout,
    refetchUser,
    refresh,
    hasRole,
    isSuperAdmin,
    isAdmin,
    isStudent,
    isReviewer,
    isLecturer,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 3. Export hook để các Component con sử dụng
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
