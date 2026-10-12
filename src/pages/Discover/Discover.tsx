import React, { useState, useEffect } from "react";
import { useParams, useOutletContext } from "react-router";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getTrending, getShowList } from "../../utils/fetch";
import type {
  Genre,
  ShowType,
  TrendingMovie,
  TrendingTv,
} from "../../types/fetch";
import { IMAGE_CONFIG } from "../../utils/config";
import { getGenreList, ratingBackground } from "../../utils/utils";
import Rating from "../../components/Rating";
import { Info } from "lucide-react";

const SHOW_LIST = ["popular", "now_playing", "top_rated", "upcoming"];

function Discover() {
  const { uniqueGenre } = useOutletContext<{ uniqueGenre: Genre[] }>();
  const { media_type } = useParams<{ media_type: ShowType | undefined }>();
  const { data: trendingData } = useQuery({
    queryKey: ["trending", media_type],
    queryFn: () => getTrending(media_type),
    staleTime: Infinity,
    enabled: !!media_type,
  });

  const [currentList, setCurrentList] = useState(0);

  const { data: listData, isFetching: listFetching } = useQuery({
    queryKey: [SHOW_LIST[currentList], media_type],
    queryFn: () => {
      if (!media_type) return;
      return getShowList(media_type, SHOW_LIST[currentList]);
    },
    placeholderData: keepPreviousData,
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

  return (
    <div className="bg-black p-4 relative">
      <div className="bg-black inset-0 fixed -z-10"></div>
      <div className="absolute inset-0 overflow-hidden h-screen">
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/40 from-20% to-black"></div>
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
                <button className="flex items-center gap-4 rounded-lg px-6 py-4 bg-yellow-500/40 font-bold border border-yellow-400/60">
                  <Info />
                  Detail Show
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-32">
          <h2 className="font-bold text-2xl mb-8">Discover {media_type}</h2>
          <div className="flex items-center gap-4">
            {SHOW_LIST.map((item, i) => (
              <button
                key={item}
                style={{ color: currentList === i ? "yellow" : "white" }}
                onClick={() => setCurrentList(i)}
                className="text-lg uppercase font-semibold"
              >
                {item.split("_").join(" ")}
              </button>
            ))}
          </div>

          <ul
            key={currentList}
            className="delay-200 min-h-[900px]: showDescription grid grid-cols-5 gap-8 mt-8"
          >
            {listFetching
              ? Array.from({ length: 8 }).map((_, i) => (
                  <li key={i} className="flex flex-col gap-2">
                    <div className="aspect-video w-full rounded-lg bg-white/10 animate-pulse" />
                    <div className="h-5 w-3/4 rounded bg-white/10 animate-pulse" />
                  </li>
                ))
              : listData?.results.map((item) => (
                  <li key={item.id} className="flex flex-col gap-2 rounded-lg">
                    <div className="relative">
                      <div className="absolute left-4 top-4">
                        <Rating
                          rating={item.vote_average}
                          background={ratingBackground(item.vote_average)}
                        />
                      </div>

                      <img
                        className="w-full aspect-video object-cover rounded-lg border border-white/20"
                        src={
                          IMAGE_CONFIG.base_url + "w780" + item.backdrop_path
                        }
                        alt={"title" in item ? item.title : item.name}
                      />
                    </div>

                    <h3 className="line-clamp-1">
                      {"title" in item ? item.title : item.name}
                    </h3>
                  </li>
                ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Discover;
