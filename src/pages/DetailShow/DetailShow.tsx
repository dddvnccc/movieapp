import React from "react";
import { IMAGE_CONFIG } from "../../utils/config";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import type { ShowType } from "../../types/fetch";
import { getDetailShow } from "../../utils/fetch";
import { Plus } from "lucide-react";
import {
  generateRuntime,
  formatDate,
  formatVoteCount,
} from "../../utils/utils";

function DetailShow() {
  const { media_type, show_id } = useParams<{
    media_type: ShowType;
    show_id: string;
  }>();
  const { data: detailData } = useQuery({
    queryKey: ["detail", media_type, show_id],
    queryFn: () => {
      if (!media_type || !show_id) return null;
      return getDetailShow(media_type, Number(show_id));
    },
  });

  const {
    overview,
    genres,
    tagline,
    backdrop_path,
    vote_average,
    vote_count,
    homepage,
    status,
    origin_country,
  } = detailData || {};
  const isMovie = detailData && "title" in detailData;
  const isTv = detailData && "name" in detailData;
  const title = isMovie ? detailData?.title : detailData?.name;
  const runtime = isMovie
    ? generateRuntime(detailData?.runtime ?? 0)
    : `${detailData?.number_of_seasons} season${(detailData?.number_of_seasons || 0) > 2 ? "s" : ""}`;
  const releaseDate = isMovie
    ? detailData?.release_date
    : detailData?.first_air_date;
  const originalTitle = isMovie
    ? detailData?.original_title
    : detailData?.original_name;

  return (
    <div className="relative">
      <div className="absolute min-h-screen max-h-screen inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black"></div>
        <img
          className="w-full h-full object-cover"
          src={IMAGE_CONFIG.base_url + "w1280" + backdrop_path}
        />
        <div className="absolute top-auto bg-gradient-to-b from-black to-black/60 h-[150px] inset-x-0"></div>
      </div>
      <div className="absolute inset-x-0 mx-auto z-10 flex flex-col max-w-[90vw] w-full top-[20vh] lg:top-[50vh]">
        <div className="flex flex-col gap-4">
          <h1 className="text-4xl xl:text-6xl font-bold tracking-wide">
            {title}
          </h1>
          <p className="font-medium italic text-neutral-400 tracking-wider">
            {tagline}
          </p>
          <div className="flex items-center gap-4 text-sm flex-wrap">
            <span className="p-1 flex items-center border border-green-500/60 gap-1 bg-green-500/40 rounded px-2 text-base font-semibold">
              <span className="font-extrabold mr-2">TMDB</span>
              <span>{vote_average?.toFixed(1)}</span>
              <span className="font-light text-sm text-neutral-300">
                ({formatVoteCount(String(vote_count))})
              </span>
            </span>
            <span>{runtime}</span>
            <span>{origin_country}</span>
            <div className="flex items-center gap-2">
              {genres?.map((item) => (
                <span
                  key={item.id}
                  className="bg-white/20 border text-sm border-white/40 rounded p-2 py-1"
                >
                  {item.name}
                </span>
              ))}
            </div>
          </div>
          <p className="line-clamp-2 xl:max-w-[50vw] leading-normal font-medium">
            {overview}
          </p>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 bg-yellow-300/40 border border-yellow-300/60 font-semibold capitalize px-6 rounded p-4">
              <Plus /> watchlist
            </button>
            <a href={homepage} target="_blank" rel="noopener noreferrer">
              Link
            </a>
          </div>
        </div>
        <div className="w-full mt-12 border border-white/20 rounded-2xl p-6 bg-black/10">
          <div className="flex items-center flex-wrap gap-12">
            <div className="flex flex-col gap-2">
              <p className="font-medium tracking-widest text-xs text-neutral-500 uppercase">
                Release Date
              </p>
              <span className="font-semibold text-sm max-w-[250px] truncate">
                {formatDate(releaseDate ?? "-")}
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <p className="font-medium tracking-widest text-xs text-neutral-500 uppercase">
                original title
              </p>
              <span className="font-semibold text-sm max-w-[250px] truncate">
                {originalTitle}
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <p className="font-semibold tracking-widest text-xs text-neutral-500 uppercase">
                status
              </p>
              <span className="font-semibold text-sm max-w-[250px] truncate">
                {status}
              </span>
            </div>
            {isMovie && (
              <div className="flex flex-col gap-2">
                <p className="font-medium tracking-widest text-xs text-neutral-500 uppercase">
                  budget
                </p>
                <span className="font-semibold text-sm max-w-[250px] truncate">
                  {detailData.budget}
                </span>
              </div>
            )}
            {isMovie && (
              <div className="flex flex-col gap-2">
                <p className="font-medium tracking-widest text-xs text-neutral-500 uppercase">
                  revenue
                </p>
                <span className="font-semibold text-sm max-w-[250px] truncate">
                  {detailData.revenue}
                </span>
              </div>
            )}

            {isTv && (
              <div className="flex flex-col gap-2">
                <p className="font-medium tracking-widest text-xs text-neutral-500 uppercase">
                  total episodes
                </p>
                <span className="font-semibold text-sm max-w-[250px] truncate">
                  {detailData.number_of_episodes} episodes
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="bg-black/60 -mt-[3px]">asdsa</div>
    </div>
  );
}

export default DetailShow;
