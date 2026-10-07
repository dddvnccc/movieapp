import React, { useEffect, useState, useRef } from "react";
import { IMAGE_CONFIG } from "../utils/config";
import { useQuery } from "@tanstack/react-query";
import { searchShow } from "../utils/fetch";
import { Search } from "lucide-react";
import { Film, Tv } from "lucide-react";
interface SearchModalProps {
  isActive: boolean;
  handleClose: () => void;
}
function SearchModal({ isActive, handleClose }: SearchModalProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [showTitle, setShowTitle] = useState("");
  const [debounce, setDebounce] = useState("");

  const { data: searchData } = useQuery({
    queryKey: ["search", debounce],
    queryFn: () => searchShow(debounce),
    select: (data) => ({
      ...data,
      results: data.results.filter((item) => item.media_type !== "person"),
    }),
    enabled: debounce.length > 3,
  });

  useEffect(() => {
    document.body.style.overflowY = isActive ? "hidden" : "";
    inputRef.current?.focus();
    setDebounce("");
    return () => {
      document.body.style.overflowY = "";
      inputRef.current?.blur();
    };
  }, [isActive]);

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      setDebounce(showTitle);
    }, 500);
    return () => clearTimeout(debounceTimeout);
  }, [showTitle]);

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
  };

  const handleEscape = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      handleClose();
    }
  };

  return (
    <div
      onClick={handleClose}
      onKeyDown={handleEscape}
      style={{ display: isActive ? "flex" : "none" }}
      className="fixed z-50 inset-0 bg-black/80 items-start"
    >
      <div
        className="max-w-screen-sm border bg-black border-white/20 rounded-lg mt-32 w-full mx-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <form
          onSubmit={handleSubmit}
          className="rounded-tl-lg rounded-tr-lg flex items-center gap-6 px-6 border-b border-white/20"
        >
          <Search size={20} />
          <input
            ref={inputRef}
            value={showTitle}
            onChange={(e) => setShowTitle(e.target.value)}
            className="bg-transparent py-4 outline-none flex-1 w-full tracking-wider"
            placeholder="Search movie / series"
          />
        </form>
        <div className="pl-2">
          {!debounce ? (
            <div className="p-6 pl-0">Type show title to search</div>
          ) : (
            <ul className="custom-scroll max-h-[50vh] overflow-y-auto flex flex-col">
              {searchData?.results.slice(0, 10).map((item) => (
                <li
                  key={item.id}
                  className="flex items-center gap-4 first:mt-4 last:mb-6 hover:bg-white/20 border border-transparent hover:border-white/40 rounded-lg mr-4 p-2"
                >
                  {!item.poster_path ? (
                    <div className="bg-white/20 w-12 h-14 rounded text-white/40 flex items-center justify-center">
                      {item.media_type === "movie" ? <Film /> : <Tv />}
                    </div>
                  ) : (
                    <img
                      className="w-16 h-20 object-cover rounded"
                      src={IMAGE_CONFIG.base_url + "w92" + item.poster_path}
                    />
                  )}
                  <div className="flex flex-col gap-1">
                    <h3 className="font-semibold tracking-wide line-clamp-2 text-sm">
                      {item.media_type === "tv"
                        ? item.name
                        : item.media_type === "movie"
                          ? item.title
                          : ""}
                    </h3>
                    <div className="flex items-center text-xs gap-4 font-light uppercase text-slate-300">
                      <span className="tracking-wide">
                        {item.media_type === "tv"
                          ? "tv series"
                          : item.media_type}
                      </span>
                      <span>
                        {(item.media_type === "tv"
                          ? item.first_air_date
                          : item.media_type === "movie"
                            ? item.release_date
                            : ""
                        ).split("-")[0] || "-"}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
          {(searchData?.total_results ?? 0) > 5 && <button>See all</button>}
        </div>
      </div>
    </div>
  );
}

export default SearchModal;
