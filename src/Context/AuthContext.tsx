import React, { createContext, useState, useEffect } from "react";
import { supabase } from "../utils/supabase";
import type { JwtPayload } from "@supabase/supabase-js";
import type { AuthContextType, List } from "../types/auth-types";
import type { ShowType } from "../types/fetch";

export const AuthContexts = createContext<AuthContextType | null>(null);

export function AuthContext({ children }: { children: React.ReactNode }) {
  const [claims, setClaims] = useState<JwtPayload | undefined>(undefined);
  const [list, setList] = useState<List[] | []>([]);

  const getId = (show_id: number) => {
    return list.find(
      (item) => item.user_id === claims?.sub && item.show_id === show_id,
    )?.id;
  };

  const addList = async (
    show_id: number,
    show_name: string,
    show_poster: string | null,
    show_type: ShowType,
    show_status: string,
  ) => {
    if (!claims?.sub || list.some((item) => item.show_id === show_id)) return;

    const newList = {
      id: crypto.randomUUID(),
      created_at: new Date().toJSON(),
      user_id: claims?.sub,
      show_id,
      show_name,
      show_poster,
      show_type,
      status: show_status,
    };
    setList((prev) =>
      prev.some((item) => item.show_id === newList.show_id)
        ? prev
        : [...prev, newList],
    );
    try {
      const { error } = await supabase.from("list").insert(newList);
      if (error) console.error(error);
    } catch (error) {
      console.error(error);
    }
  };

  const updateList = async (show_id: number, column: string, value: string) => {
    setList((prev) =>
      prev.map((item) =>
        item.id === getId(show_id) ? { ...item, [column]: value } : item,
      ),
    );
    try {
      const { error } = await supabase
        .from("list")
        .update({ [column]: value })
        .eq("id", getId(show_id));
      if (error) console.log(error);
    } catch (error) {
      console.error(error);
    }
  };

  const checkShow = (show_id: number) => {
    return list.some((item) => item.show_id === show_id);
  };

  const getShowById = (show_id: number) => {
    return list.find(
      (item) => item.show_id === show_id && item.user_id === claims?.sub,
    );
  };

  const removeShow = async (show_id: number) => {
    setList((prev) => prev.filter((item) => item.show_id !== show_id));
    try {
      const { error } = await supabase
        .from("list")
        .delete()
        .eq("id", getId(show_id));
      if (error) console.error(error);
    } catch (error) {
      console.error(error);
    }
  };

  const getList = async (user_id?: string) => {
    if (!user_id) return;
    try {
      const { data, error } = await supabase
        .from("list")
        .select()
        .eq("user_id", user_id);
      if (error) {
        console.log(error);
        return;
      }
      setList(data);
      console.log(data);
    } catch (error) {
      console.error(error);
    }
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

  useEffect(() => {
    getList(claims?.sub);
  }, [claims]);

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
          show_status: string,
        ) {
          addList(show_id, show_name, show_poster, show_type, show_status);
        },
        checkShow: function (show_id: number) {
          return checkShow(show_id);
        },
        removeShow: function (show_id: number) {
          removeShow(show_id);
        },
        updateList: function (show_id: number, column: string, value: string) {
          updateList(show_id, column, value);
        },
        getShowById: function (show_id: number) {
          return getShowById(show_id);
        },
      }}
    >
      {children}
    </AuthContexts>
  );
}
