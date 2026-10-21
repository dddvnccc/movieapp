import React, { useState, useEffect } from "react";
import {
  useParams,
  useOutletContext,
  useSearchParams,
  Link,
} from "react-router";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getTrending, getShowList, getAllShow } from "../../utils/fetch";
import type {
  Genre,
  ShowType,
  TrendingMovie,
  TrendingTv,
} from "../../types/fetch";
import { IMAGE_CONFIG } from "../../utils/config";
import { getGenreList, ratingBackground } from "../../utils/utils";
import Rating from "../../components/Rating";
import { Dot, Info } from "lucide-react";
import Pagination from "../../components/Pagination";
import Portal from "../../components/Portal";
import FilterModal from "../../components/FilterModal";

const SHOW_LIST = ["popular", "now_playing", "top_rated", "upcoming", "all"];
const MAXPAGE = 10;

function ShowList() {
  const { uniqueGenre } = useOutletContext<{ uniqueGenre: Genre[] }>();
  const { media_type } = useParams<{ media_type: ShowType | undefined }>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: trendingData } = useQuery({
    queryKey: ["trending", media_type],
    queryFn: () => getTrending(media_type),
    staleTime: Infinity,
    enabled: !!media_type,
  });

  const [filter, setFilter] = useState({});
  const genre = searchParams.get("genre") ?? "";
  const country = searchParams.get("country") ?? "";
  const year = searchParams.get("year") ?? "";

  const initPage = Number(searchParams.get("page") ?? "1");
  const currentPage =
    Number.isInteger(initPage) && initPage >= 1
      ? Math.min(initPage, MAXPAGE)
      : 1;

  const currentList = searchParams.get("category") ?? "popular";

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

  const [currentIndex, setCurrentIndex] = useState(0);
  const currentData: TrendingMovie | TrendingTv | undefined = trendingData
    ? trendingData?.results[currentIndex]
    : undefined;

  useEffect(() => {
    if (!trendingData?.results) return;
    const heroTimer = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % trendingData?.results.length);
    }, 15000);

    return () => clearTimeout(heroTimer);
  }, [currentIndex, trendingData?.results]);

  useEffect(() => {
    setCurrentIndex(0);
  }, [media_type]);

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

  useEffect(() => {
    document.body.style.overflowY = isModalOpen ? "hidden" : "";

    if (isModalOpen) {
      document.body.classList.add("hide-scrollbar");
      document.body.style.paddingRight = "16px";
    } else {
      document.body.classList.remove("hide-scrollbar");
      document.body.style.paddingRight = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
      document.body.classList.remove("hide-scrollbar");
    };
  }, [isModalOpen]);

  return (
    <div className="bg-black p-4 relative">
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
      <div className="bg-black inset-0 fixed -z-10"></div>
      <div className="absolute inset-0 overflow-hidden h-screen">
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/10 from-20% to-black"></div>
        <img
          key={currentIndex || media_type}
          fetchPriority="high"
          className="showBg w-full object-cover h-full object-center"
          src={IMAGE_CONFIG.base_url + "original" + currentData?.backdrop_path}
        />
      </div>
      <div className="max-w-[90vw] mx-auto relative z-20 top-[40vh]">
        <div key={currentIndex || media_type} className="w-full">
          <div className="relative flex items-center gap-8">
            <div className="showDescription flex flex-col gap-5">
              <h1 className="text-6xl font-bold">
                {currentData && "title" in currentData
                  ? currentData.title
                  : currentData?.name}
              </h1>
              <div className="flex items-center gap-4 font-semibold text-neutral-300">
                <Rating
                  size={16}
                  rating={currentData?.vote_average ?? 0}
                  background={ratingBackground(currentData?.vote_average ?? 0)}
                />
                <span className="p-1 px-4 rounded border border-white/20 bg-white/10">
                  {
                    getGenreList(currentData?.genre_ids ?? [], uniqueGenre)?.[0]
                      ?.name
                  }
                </span>
                <span className="p-1 px-4 rounded border border-white/20 bg-white/10">
                  {
                    (currentData && "title" in currentData
                      ? currentData.release_date
                      : currentData?.first_air_date
                    )?.split("-")[0]
                  }
                </span>
              </div>
              <p className="lg:max-w-[40vw] text-lg line-clamp-2">
                {currentData?.overview}
              </p>
              <div>
                <Link
                  to={`detail/${currentData?.id}`}
                  className="flex w-fit items-center gap-4 rounded-lg px-6 py-4 bg-yellow-500/40 font-bold border border-yellow-400/60"
                >
                  <Info />
                  Detail Show
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-32">
          <h2 className="font-bold text-2xl mb-8">ShowList {media_type}</h2>
          <div className="flex items-center gap-4 justify-between">
            <div className="flex items-center gap-4">
              {SHOW_LIST.map((item) => (
                <button
                  key={item}
                  style={{ color: currentList === item ? "yellow" : "white" }}
                  onClick={() => setSearchParams({ category: item })}
                  className="text-lg uppercase font-semibold"
                >
                  {item.split("_").join(" ")}
                </button>
              ))}
            </div>
            {currentList === "all" && (
              <button onClick={() => setIsModalOpen(true)}>filter</button>
            )}
          </div>

          <ul className="grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 mt-8">
            {listFetching || allFetching
              ? Array.from({ length: 20 }).map((_, i) => (
                  <li key={i} className="flex flex-col gap-2">
                    <div className="aspect-video w-full rounded-lg bg-white/10 animate-pulse" />
                    <div className="h-5 w-3/4 rounded bg-white/10 animate-pulse" />
                  </li>
                ))
              : (currentList !== "all" ? listData : allData)?.results.map(
                  (item) => (
                    <li
                      key={item.id}
                      className="flex flex-col gap-2 rounded-lg"
                    >
                      <div className="relative">
                        <div className="absolute inset-0 justify-end items-end flex bg-black/20">
                          <span
                            style={{
                              background: "black",
                            }}
                            className="p-1.5 px-2 rounded rounded-bl-none rounded-tr-none font-bold"
                          >
                            {item.vote_average.toFixed(1)}
                          </span>
                        </div>

                        <img
                          className="w-full aspect-video object-cover rounded border border-white/20"
                          src={
                            IMAGE_CONFIG.base_url + "w300" + item.backdrop_path
                          }
                          alt={"title" in item ? item.title : item.name}
                        />
                      </div>

                      <div className="flex flex-col gap-0">
                        <Link to={`detail/${item.id}`}>
                          <h3 className="line-clamp-1 text-lg font-bold">
                            {"title" in item ? item.title : item.name}
                          </h3>
                        </Link>
                        <div className="text-sm flex items-center gap-0 text-neutral-500 font-medium">
                          <span>
                            {
                              ("title" in item
                                ? item.release_date
                                : item.first_air_date
                              ).split("-")[0]
                            }
                          </span>
                          <Dot />
                          <span>
                            {getGenreList(item.genre_ids, uniqueGenre)[0]?.name}
                          </span>
                        </div>
                      </div>
                    </li>
                  ),
                )}
          </ul>
          {((currentList !== "all"
            ? listData?.total_pages
            : allData?.total_pages) ?? 0) > 1 && (
            <Pagination
              updatePage={(page) =>
                setSearchParams((searchParams) => {
                  searchParams.set("page", String(page));
                  return searchParams;
                })
              }
              page={currentPage}
              totalPage={
                ((currentList !== "all"
                  ? listData?.total_pages
                  : allData?.total_pages) ?? 0) > MAXPAGE
                  ? MAXPAGE
                  : ((currentList !== "all"
                      ? listData?.total_pages
                      : allData?.total_pages) ?? 0)
              }
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default ShowList;
