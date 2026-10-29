import { useState, useEffect } from "react";
import {
  useParams,
  useOutletContext,
  useSearchParams,
  Link,
} from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getShowList, getAllShow } from "../../utils/fetch";
import type {
  Genre,
  ShowType,
  TrendingMovie,
  TrendingTv,
} from "../../types/fetch";
import { IMAGE_CONFIG } from "../../utils/config";
import { getGenreList } from "../../utils/utils";
import Pagination from "../../components/Pagination";
import Portal from "../../components/Portal";
import FilterModal from "../../components/FilterModal";
import { Film } from "lucide-react";

const SHOW_LIST = ["popular", "now_playing", "top_rated", "upcoming", "all"];
const MAXPAGE = 10;

function ShowList() {
  const { uniqueGenre } = useOutletContext<{ uniqueGenre: Genre[] }>();
  const { media_type } = useParams<{ media_type: ShowType | undefined }>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [filter, setFilter] = useState({});
  const genre = searchParams.get("genre") ?? "";
  const country = searchParams.get("country") ?? "";
  const year = searchParams.get("year") ?? "";
  const initPage = Number(searchParams.get("page") ?? "1");
  const currentPage =
    Number.isInteger(initPage) && initPage >= 1
      ? Math.min(initPage, MAXPAGE)
      : 1;
  const currentList = searchParams.get("list") ?? "popular";
  const { data: listData, isFetching: listFetching } = useQuery({
    queryKey: [currentList, media_type, currentPage],
    queryFn: () => {
      if (!media_type) return;
      return getShowList(media_type, currentList, currentPage);
    },
    staleTime: Infinity,
    enabled: currentList !== "all",
  });
  const { data: allData, isFetching: allFetching } = useQuery({
    queryKey: ["all", media_type, currentPage, genre, country, year],
    queryFn: () => {
      if (!media_type) return;
      return getAllShow(media_type, currentPage, genre, country, year);
    },
    staleTime: Infinity,
    enabled: currentList === "all",
  });

  const currentData = currentList === "all" ? allData : listData;

  useEffect(() => {
    const pageParam = searchParams.get("page");
    if (!pageParam) return;
    if (pageParam !== String(currentPage)) {
      setSearchParams(
        (params) => {
          params.set("page", String(currentPage));
          return params;
        },
        { replace: true },
      );
    }
  }, [initPage, currentPage, setSearchParams]);

  return (
    <div className="bg-black relative">
      <Portal>
        <FilterModal
          handleClose={() => setIsModalOpen(false)}
          isModalOpen={isModalOpen}
          showType={media_type}
          setFilter={setFilter}
          filter={filter}
          setSearchParams={setSearchParams}
          searchParams={searchParams}
        />
      </Portal>
      <section className="relative bg-black pt-32 px-4 xl:px-12 min-h-screen">
        <h1 className="text-[3rem] xl:text-[5rem] font-extrabold uppercase">
          {media_type === "tv" ? "tv series" : "movies"}
        </h1>
        <div className="mt-2 flex items-center">
          {SHOW_LIST.map((item) => (
            <button
              onClick={() =>
                setSearchParams((prev) => {
                  prev.set("list", item);
                  return prev;
                })
              }
              className={`uppercase px-6 py-2 font-semibold ${currentList.split(" ").join("_") === item ? "bg-white text-black" : "bg-transparent text-white"}`}
              key={item}
            >
              {item.split("_").join(" ")}
            </button>
          ))}
        </div>
        <ul className="grid grid-cols-1 xl:grid-cols-4 gap-4 mt-6">
          {listFetching
            ? Array.from({ length: 20 }).map((_, i) => (
                <li
                  className="border border-white/20 w-full h-[200px]"
                  key={i}
                ></li>
              ))
            : currentData?.results.map((item) => (
                <li
                  className="relative group/card border border-white/20 min-h-[150px]"
                  key={item.id}
                >
                  <Link to={`detail/${item.id}`}>
                    <div className="absolute inset-0 p-4 bg-black/30 hover:bg-black/40 transition-all duration-300 flex flex-col justify-end border-4 border-transparent group-hover/card:border-white gap-0.5">
                      <h3 className="font-bold line-clamp-2 text-xl">
                        {"title" in item ? item.title : item.name}
                      </h3>
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <span>
                          {
                            ("title" in item
                              ? item.release_date
                              : item.first_air_date
                            ).split("-")[0]
                          }
                        </span>
                        <span>
                          {getGenreList(item.genre_ids, uniqueGenre)[0]?.name}
                        </span>
                      </div>
                    </div>
                    {!item.backdrop_path ? (
                      <div className="bg-black flex items-center justify-center h-full">
                        <Film />
                      </div>
                    ) : (
                      <img
                        className="w-full"
                        src={
                          IMAGE_CONFIG.secure_base_url +
                          "w300" +
                          item.backdrop_path
                        }
                      />
                    )}
                  </Link>
                </li>
              ))}
        </ul>
        <div className="mt-8">
          <Pagination
            page={currentPage}
            totalPage={
              (currentData?.total_pages ?? 0) > 10
                ? MAXPAGE
                : currentData?.total_pages ?? 0
            }
            updatePage={(item) =>
              setSearchParams((prev) => {
                prev.set("page", String(item));
                return prev;
              })
            }
          />
        </div>
      </section>
    </div>
  );
}

export default ShowList;
