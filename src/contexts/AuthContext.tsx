import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { loginUser } from "@/lib/mockApi";
import type { AuthUser, UserRole } from "@/types";

interface AuthContextValue {
  user: AuthUser | null;
  login: (role: UserRole, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const STORAGE_KEY = "presenceos_auth_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return;
    try {
      setUser(JSON.parse(stored) as AuthUser);
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const login = async (role: UserRole, email: string, password: string) => {
    try {
      const nextUser = await loginUser(role, email, password);
      setUser(nextUser);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
      return true;
    } catch {
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    window.localStorage.removeItem(STORAGE_KEY);
  };

  const value = useMemo(() => ({ user, login, logout }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
