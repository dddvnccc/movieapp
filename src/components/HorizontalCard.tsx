import type { Genre, TrendingMovie, TrendingTv } from "../types/fetch";
import Rating from "./Rating";
import { getGenreList, ratingBackground } from "../utils/utils";
import { IMAGE_CONFIG } from "../utils/config";
import Dot from "./Dot";

interface HorizontalCardProps {
  data: TrendingMovie | TrendingTv;
  uniqueGenre: Genre[];
}

function HorizontalCard({ data: item, uniqueGenre }: HorizontalCardProps) {
  const title = item.media_type === "movie" ? item.title : item.name;
  const releaseDate =
    item.media_type === "movie" ? item.release_date : item.first_air_date;
  const IMAGE_URL = IMAGE_CONFIG.base_url + "w300" + item.backdrop_path;
  return (
    <li
      key={item.id}
      className="min-w-[60%] xl:min-w-[20%] rounded-lg flex flex-col gap-2 group"
    >
      <div className="relative overflow-hidden border border-white/20 rounded-xl">
        <div className="absolute inset-0 bg-black/20 p-4 z-10">
          {new Date(releaseDate).getTime() <= Date.now() ? (
            <Rating
              size={14}
              rating={item.vote_average}
              background={ratingBackground(item.vote_average)}
            />
          ) : (
            "upcoming"
          )}
        </div>
        <img
          className="w-full h-full rounded-xl object-cover group-hover:scale-110 transition-all duration-500"
          src={IMAGE_URL}
        />
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="font-bold text-lg truncate">{title}</h3>
        <div className="text-sm text-neutral-300 font-light flex items-center gap-2.5">
          <span className="">{releaseDate?.split("-")[0]}</span>
          <Dot size={5} color="rgba(250,250,250,.4)" />
          <span>{getGenreList(item.genre_ids, uniqueGenre)[0]?.name}</span>
        </div>
      </div>
    </li>
  );
}

export default HorizontalCard;
