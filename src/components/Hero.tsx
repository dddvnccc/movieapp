import { useState, useEffect } from "react";
import type { Genre } from "../types/fetch";
import { getGenreList, ratingBackground } from "../utils/utils";
import { getTrending } from "../utils/fetch";
import { IMAGE_CONFIG } from "../utils/config";
import { useQuery } from "@tanstack/react-query";
import { data, useOutletContext } from "react-router";
import { Info } from "lucide-react";
import Rating from "./Rating";
import HorizontalCard from "./HorizontalCard";
import HorizontalContainer from "./HorizontalContainer";

const MAX_DATA = 8;

function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { uniqueGenre } = useOutletContext<{ uniqueGenre: Genre[] }>();
  const { data: trendingAll } = useQuery({
    queryKey: ["trending", "all"],
    queryFn: () => getTrending("all"),
    staleTime: Infinity,
  });
  const { data: trendingMovie } = useQuery({
    queryKey: ["trending", "movie"],
    queryFn: () => getTrending("movie"),
    staleTime: Infinity,
  });
  const currentData = trendingAll?.results[currentIndex];
  const { backdrop_path, genre_ids, vote_average, overview, media_type } =
    currentData || {};
  const title =
    currentData?.media_type === "tv" ? currentData?.name : currentData?.title;
  const releaseDate =
    currentData?.media_type === "tv"
      ? currentData.first_air_date
      : currentData?.release_date;
  const BG_URL = IMAGE_CONFIG.base_url + "w1280" + backdrop_path;

  const firstGenre = getGenreList(genre_ids ?? [], uniqueGenre)[0];

  useEffect(() => {
    if (!trendingAll) return
    const indexTimer = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % MAX_DATA);
    }, 10000);

    return () => {
      clearTimeout(indexTimer);
    };
  }, [currentIndex, trendingAll]);

  return (
    <section className="h-screen relative bg-black">
      <div className="absolute inset-0 overflow-hidden flex flex-col">
        <div className="bg-gradient-to-b from-black/40 to-black absolute inset-0 z-10"></div>
        {!backdrop_path ? (
          <div className="bg-black w-full h-full flex-1"></div>
        ) : (
          <img
            key={currentIndex}
            className="showBg w-full h-full object-cover"
            src={BG_URL}
            alt={`backdrop image ${title}`}
          />
        )}
      </div>
      <div className="relative z-10 max-w-[90vw] w-full mx-auto">
        <div className="flex items-end min-h-[70vh] justify-between">
          <div
            key={currentIndex}
            className="flex flex-col flex-1 gap-4 showDescription"
          >
            <span className="text-xs font-bold uppercase p-2 px-3 rounded bg-sky-800/20 border border-sky-800/40 text-neutral-200 tracking-widest w-fit">
              {media_type === "tv" ? "TV Series" : "movie"}
            </span>
            <h1 className="font-bold text-3xl xl:text-6xl xl:max-w-[70%]">
              {title}
            </h1>
            <div className="flex items-center gap-4 text-neutral-300 flex-wrap">
              <Rating
                rating={vote_average || 0}
                background={ratingBackground(vote_average || 0)}
              />
              <span className="flex items-center font-semibold gap-2 p-1 bg-black/40 rounded border border-white/40 px-4">
                {releaseDate?.split("-")[0]}
              </span>
              <span className="bg-black/20 border border-white/40 font-medium p-1 px-4 rounded text-white/70">
                {firstGenre?.name}
              </span>
            </div>
            <p className="xl:max-w-[40vw] line-clamp-2 font-medium leading-relaxed text-neutral-400">
              {overview}
            </p>
            <div>
              <button className="flex items-center gap-2 px-5 py-4 capitalize text-[--main-black] font-bold bg-[--main-color] rounded">
                <Info size={20} strokeWidth={3} />
                detail show
              </button>
            </div>
          </div>
          <div className="">
            <div className="flex items-center gap-4">
              {Array.from({ length: MAX_DATA }).map((_, i) => (
                <button
                  onClick={() => setCurrentIndex(i)}
                  key={i}
                  style={{
                    width: currentIndex === i ? 72 : 10,
                    height: 10,
                    background:
                      currentIndex === i
                        ? "var(--main-color)"
                        : "rgba(250,250,250,.5)",
                  }}
                  className="bg-white rounded-full transition-all duration-300"
                ></button>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-32">
          <section className="flex flex-col gap-4">
            <h2 className="font-bold text-2xl">Trending movies</h2>
            <HorizontalContainer>
              {trendingMovie?.results.map((item) => (
                <HorizontalCard
                  key={item.id}
                  uniqueGenre={uniqueGenre}
                  data={item}
                />
              ))}
            </HorizontalContainer>
          </section>
        </div>
      </div>
    </section>
  );
}

export default Hero;
