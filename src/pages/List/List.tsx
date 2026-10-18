import React, { useContext, useEffect, useState } from "react";
import { IMAGE_CONFIG } from "../../utils/config";
import { AuthContexts } from "../../Context/AuthContext";
import type { ShowType } from "../../types/fetch";

const BUTTON_LIST: (ShowType | "all")[] = ["all", "movie", "tv"];
function List() {
  const [currentType, setCurrentType] = useState<"all" | ShowType>("all");
  const context = useContext(AuthContexts);
  if (!context) {
    throw new Error("error");
  }
  const { list, claims } = context;
  const filterData =
    currentType === "all"
      ? list
      : currentType === "movie"
        ? list.filter((item) => item.show_type === "movie")
        : list.filter((item) => item.show_type === "tv");

  return (
    <div className="pt-32">
      <div className="max-w-[90vw] w-full mx-auto">
        <div className="flex items-center justify-between gap-4">
          <h1>List</h1>
          <div className="flex items-center gap-4">
            {BUTTON_LIST.map((item) => (
              <button onClick={() => setCurrentType(item)} key={item}>
                {item}
              </button>
            ))}
          </div>
        </div>
        {claims && (
          <div className="grid grid-cols-3 xl:grid-cols-6 lg:grid-cols-5 gap-4">
            {filterData.map((item) => (
              <div key={item.id} className="w-full h-full flex flex-col gap-2">
                <img
                  className="w-full rounded-lg border h-full border-white/10"
                  src={IMAGE_CONFIG.base_url + "w342" + item.show_poster}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default List;
