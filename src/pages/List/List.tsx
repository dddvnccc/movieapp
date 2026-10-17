import React, { useContext, useEffect, useState } from "react";
import { IMAGE_CONFIG } from "../../utils/config";
import { AuthContexts } from "../../Context/AuthContext";
import type { ShowType } from "../../types/fetch";
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

  useEffect(() => {
    console.log(list);
  }, [list]);

  return (
    <div className="pt-32">
      <div className="max-w-[90vw] w-full mx-auto">
        <div className="flex items-center justify-between gap-4">
          <h1>List</h1>
          <div className="flex items-center gap-4">
            {["all", "movie", "tv"].map((item) => (
              <button onClick={() => setCurrentType(item)} key={item}>
                {item}
              </button>
            ))}
          </div>
        </div>
        {claims && (
          <div className="grid xl:grid-cols-6 lg:grid-cols-5 gap-4">
            {filterData.map((item) => (
              <div key={item.id} className="w-full flex flex-col gap-2">
                <img
                  className="w-full rounded-lg border border-white/10"
                  src={IMAGE_CONFIG.base_url + "w342" + item.show_poster}
                />
                <p>{item.show_type}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default List;
