import type { JwtPayload } from "@supabase/supabase-js";
import type { ShowType } from "./fetch";
export type AuthContextType = {
  claims: JwtPayload | undefined;
  clearClaims: () => void;
  list: List[];
  addList: (
    show_id: number,
    show_name: string,
    show_poster: string | null,
    show_type: ShowType,
  ) => void;
  checkShow: (show_id: number) => boolean;
  removeShow: (show_id:number) => void;
};

export interface List {
  id: string;
  created_at: string;
  user_id: string;
  show_id: number;
  show_name: string;
  show_poster: string | null;
  show_type: ShowType;
}
