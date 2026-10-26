import { useState, useEffect } from "react";
import type { Genre } from "../types/fetch";
import { getGenreList, ratingBackground } from "../utils/utils";
import { getTrending } from "../utils/fetch";
import { IMAGE_CONFIG } from "../utils/config";
import { useQuery } from "@tanstack/react-query";
import { Link, useOutletContext } from "react-router";

const MAX_DATA = 12;

function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { uniqueGenre } = useOutletContext<{ uniqueGenre: Genre[] }>();
  const { data: trendingAll } = useQuery({
    queryKey: ["trending", "all"],
    queryFn: () => getTrending("all"),
    staleTime: Infinity,
  });
  const currentData = trendingAll?.results[currentIndex];
  const { id, backdrop_path, genre_ids, vote_average, overview, media_type } =
    currentData || {};
  const title =
    currentData?.media_type === "tv" ? currentData?.name : currentData?.title;
  const releaseDate =
    currentData?.media_type === "tv"
      ? currentData.first_air_date
      : currentData?.release_date;
  const BG_URL = IMAGE_CONFIG.base_url + "w1280" + backdrop_path;

  useEffect(() => {
    if (!trendingAll) return;
    const indexTimer = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % MAX_DATA);
    }, 10000);

    return () => {
      clearTimeout(indexTimer);
    };
  }, [currentIndex, trendingAll]);

  const updateIndex = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <section className="relative bg-black">
      <div className="absolute inset-0 overflow-hidden flex flex-col z-0">
        <div className="absolute bg-black/40 inset-0 z-10"></div>
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

      <div className="px-12 min-h-screen w-full flex items-center relative">
        <HeroNavigation currentIndex={currentIndex} updateIndex={updateIndex} />
        <div className="">
          <div
            key={currentIndex}
            className="flex flex-col flex-1 gap-2 showDescription"
          >
            <Link
              className="border-r-blue-300 group/link flex flex-col gap-1"
              to={`/${media_type}/detail/${id}`}
            >
              <h1
                className={`font-bold group/link uppercase flex items-center gap-6 gap-y-2 flex-wrap leading-none max-w-[15ch] ${(title?.length ?? 0) > 30 ? "text-[2rem] lg:text-[4rem]" : "text-[4rem] lg:text-[6rem]"}`}
              >
                {title}
              </h1>
            </Link>
            <div className="flex items-center gap-4 mt-4 font-semibold text-lg">
              <p>{releaseDate?.split("-")[0]}</p>
              <span className="">
                {getGenreList(genre_ids ?? [], uniqueGenre)[0]?.name}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const HeroNavigation = ({
  updateIndex,
  currentIndex,
}: {
  updateIndex: (index: number) => void;
  currentIndex: number;
}) => {
  return (
    <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 items-center gap-4">
      {Array.from({ length: MAX_DATA }).map((_, i) => (
        <button
          onClick={() => updateIndex(i)}
          key={i}
          className={`h-3 rounded-full transition-all duration-300 ${currentIndex === i ? "bg-red-600 w-16" : "bg-white w-3"}`}
        ></button>
      ))}
    </div>
  );
};

export default Hero;
