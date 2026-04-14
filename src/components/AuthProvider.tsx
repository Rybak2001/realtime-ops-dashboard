"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";

interface AuthUser { id: string; email: string; name: string; role: string; }
interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<string | null>;
  register: (email: string, password: string, name: string) => Promise<string | null>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try { const res = await fetch("/api/auth/me"); setUser(await res.json()); }
    catch { setUser(null); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchUser(); }, [fetchUser]);

  async function login(email: string, password: string) {
    const res = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
    if (!res.ok) { const e = await res.json(); return e.error || "Error"; }
    setUser((await res.json()).user); return null;
  }

  async function register(email: string, password: string, name: string) {
    const res = await fetch("/api/auth/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password, name }) });
    if (!res.ok) { const e = await res.json(); return e.error || "Error"; }
    setUser((await res.json()).user); return null;
  }

  async function logout() { await fetch("/api/auth/logout", { method: "POST" }); setUser(null); }

  return <AuthContext.Provider value={{ user, loading, login, register, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be within AuthProvider");
  return ctx;
}
