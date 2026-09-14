"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type AuthUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role?: "customer" | "affiliate" | "business" | "admin";
  isAffiliate?: boolean;
  isBusiness?: boolean;
  isAdmin?: boolean;
} | null;

type AuthContextValue = {
  user: AuthUser;
  setUser: (user: AuthUser) => void;
  loading: boolean;
};

const AuthContext = createContext<AuthContextValue | null>(null);

// Fetched client-side on mount rather than read server-side in the root
// layout — reading the session cookie there would force every page in the
// app (including statically generated product/marketing pages) to become
// dynamic, which is a real cost for a ~150ms flash we can live with.
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<AuthUser>(null);
  const [loading, setLoading] = useState(true);

  const setUser = (newUser: AuthUser) => {
    setUserState(newUser);
  };

  useEffect(() => {
    let cancelled = false;
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : { user: null }))
      .then((data) => {
        if (!cancelled) {
          if (data.user) {
            setUser(data.user);
          } else {
            setUser(null);
          }
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
