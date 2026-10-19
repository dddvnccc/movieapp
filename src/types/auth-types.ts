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
    show_status: string,
  ) => void;
  checkShow: (show_id: number) => boolean;
  removeShow: (show_id: number) => void;
  updateList: (show_id: number, column: string, value: string) => void;
  getShowById: (show_id: number) => List | undefined;
};

export interface List {
  id: string;
  created_at: string;
  user_id: string;
  show_id: number;
  show_name: string;
  show_poster: string | null;
  show_type: ShowType;
  status: string
}
