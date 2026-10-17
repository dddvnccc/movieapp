import React, { createContext, useState, useEffect } from "react";
import { supabase } from "../utils/supabase";
import type { JwtPayload } from "@supabase/supabase-js";
import type { AuthContextType, List } from "../types/auth-types";
import type { ShowType } from "../types/fetch";

export const AuthContexts = createContext<AuthContextType | null>(null);

export function AuthContext({ children }: { children: React.ReactNode }) {
  const [claims, setClaims] = useState<JwtPayload | undefined>(undefined);
  const [list, setList] = useState<List[] | []>([]);

  const addList = (
    show_id: number,
    show_name: string,
    show_poster: string | null,
    show_type: ShowType,
  ) => {
    if (!claims) return;
    const newList = {
      id: crypto.randomUUID(),
      created_at: String(Date.now()),
      user_id: claims?.sub,
      show_id,
      show_name,
      show_poster,
      show_type,
    };
    setList((prev) => [...prev, newList]);
  };

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
        list,
        addList: function (
          show_id: number,
          show_name: string,
          show_poster: string | null,
          show_type: ShowType,
        ) {
          addList(show_id, show_name, show_poster, show_type);
        },
      }}
    >
      {children}
    </AuthContexts>
  );
}
