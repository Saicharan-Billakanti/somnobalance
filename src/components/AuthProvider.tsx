"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

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

  const authRevision = useRef(0);

  const setUser = useCallback((newUser: AuthUser) => {
    // Ignore session checks started before an explicit login or logout.
    authRevision.current++;
    setUserState(newUser);
    setLoading(false);
  }, []);

  useEffect(() => {
    let cancelled = false;
    let requestId = 0;
    let retry: ReturnType<typeof setTimeout> | undefined;
    const refresh = async () => {
      clearTimeout(retry);
      const revision = authRevision.current;
      const id = ++requestId;
      const isCurrent = () => !cancelled && id === requestId && revision === authRevision.current;
      try {
        const response = await fetch("/api/auth/me", {
          cache: "no-store",
          credentials: "same-origin",
          signal: AbortSignal.timeout(10000),
        });
        if (!response.ok) throw new Error("Session check failed");
        const profile = await response.json();
        if (!Object.hasOwn(profile, "user")) throw new Error("Invalid session response");
        if (isCurrent()) {
          setUserState(profile.user || null);
          setLoading(false);
        }
      } catch {
        // A network/server failure does not mean the user signed out.
        if (isCurrent()) retry = setTimeout(refresh, 5000);
      }
    };
    const onVisible = () => {
      if (document.visibilityState === "visible") void refresh();
    };
    void refresh();
    window.addEventListener("focus", onVisible);
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      cancelled = true;
      clearTimeout(retry);
      window.removeEventListener("focus", onVisible);
      document.removeEventListener("visibilitychange", onVisible);
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
