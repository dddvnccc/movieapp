import React, { createContext, useState, useEffect } from "react";
import { supabase } from "../utils/supabase";
import type { JwtPayload } from "@supabase/supabase-js";

type AuthContextType = {
  claims: JwtPayload | undefined;
  clearClaims: () => void;
};

export const AuthContexts = createContext<AuthContextType | null>(null);

export function AuthContext({ children }: { children: React.ReactNode }) {
  const [claims, setClaims] = useState<JwtPayload | undefined>(undefined);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      supabase.auth.getClaims().then((data) => setClaims(data.data?.claims));
    });
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContexts
      value={{
        claims,
        clearClaims: function () {
          setClaims(undefined);
        },
      }}
    >
      {children}
    </AuthContexts>
  );
}
