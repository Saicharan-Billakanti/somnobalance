"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabase-browser";

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
    const initialize = async () => {
      const supabase = await getSupabaseBrowser();
      const loadProfile = async () => {
      const { data } = await supabase.auth.getUser();
      if (cancelled) return;
      if (!data.user) {
        setUser(null);
        setLoading(false);
        return;
      }
      const response = await fetch("/api/auth/me");
      const profile = response.ok ? await response.json() : { user: null };
      if (!cancelled) setUser(profile.user || null);
      if (!cancelled) setLoading(false);
      };

      await loadProfile();
      const { data: subscription } = supabase.auth.onAuthStateChange(() => {
        loadProfile().catch(() => undefined);
      });
      return subscription;
    };

    let subscription: { subscription: { unsubscribe: () => void } } | undefined;
    initialize().then((value) => { subscription = value; }).catch(() => {
      if (!cancelled) setLoading(false);
    });
    return () => {
      cancelled = true;
      subscription?.subscription.unsubscribe();
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
