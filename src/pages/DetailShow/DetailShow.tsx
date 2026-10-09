import React from "react";
import { IMAGE_CONFIG } from "../../utils/config";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import type { ShowType } from "../../types/fetch";
import { getDetailShow, getShowCredit } from "../../utils/fetch";
import { Plus, Star, ThumbsDown, ThumbsUp } from "lucide-react";
import {
  generateRuntime,
  formatDate,
  formatVoteCount,
  ratingBackground,
  formatCurrency,
} from "../../utils/utils";

function DetailShow() {
  const { media_type, show_id } = useParams<{
    media_type: ShowType;
    show_id: string;
  }>();
  const { data: detailData, isFetching: detailFetching } = useQuery({
    queryKey: ["detail", media_type, show_id],
    queryFn: () => {
      if (!media_type || !show_id) return null;
      return getDetailShow(media_type, Number(show_id));
    },
    staleTime: Infinity,
  });

  const { data: creditData } = useQuery({
    queryKey: ["credit", media_type, show_id],
    queryFn: () => {
      if (!media_type || !show_id) return null;
      return getShowCredit(media_type, Number(show_id));
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
  } = detailData || {};
  const isMovie = detailData && "title" in detailData;
  const isTv = detailData && "name" in detailData;
  const title = isMovie ? detailData?.title : detailData?.name;
  const releaseDate = isMovie
    ? detailData?.release_date
    : detailData?.first_air_date;
  const originalTitle = isMovie
    ? detailData?.original_title
    : detailData?.original_name;

  if (detailFetching) {
    return <div className="h-screen bg-black"></div>;
  }

  return (
    <div className="relative bg-black/90">
      <div className="absolute inset-0 z-0 h-screen">
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black to-100%"></div>
        <img
          className="w-full h-full object-cover object-center"
          src={IMAGE_CONFIG.base_url + "w1280" + backdrop_path}
          loading="lazy"
        />
        <div className="h-[200px] bg-gradient-to-b from-black to-transparent z-10 top-full inset-x-0 absolute"></div>
      </div>
      <div className="relative z-10">
        <div className="max-w-[90vw] w-full mx-auto min-h-screen flex flex-col justify-end pt-32 pb-12">
          <div className="flex gap-8 sm:flex-row justify-between items-end flex-col">
            <div className="flex flex-col gap-4">
              <div>
                <h1 className="text-4xl xl:text-5xl font-extrabold mb-2">
                  {title}
                </h1>
                <p className="font-semibold text-slate-400 italic">{tagline}</p>
              </div>
              <div className="mt-1 text-xs lg:text-sm flex items-center gap-4 flex-wrap">
                <div
                  style={{ background: ratingBackground(vote_average || 0) }}
                  className="font-bold flex items-center gap-1 text-lg p-1 px-4 rounded"
                >
                  <Star size={15} />
                  {vote_average?.toFixed(1)}
                  <span className="font-medium text-sm">
                    ({formatVoteCount(String(vote_count))})
                  </span>
                </div>
                <div className="flex items-center flex-wrap gap-4">
                  {genres?.map((item) => (
                    <span
                      key={item.id}
                      className="p-2 px-4 bg-white/20 border border-white/30 text-white rounded-lg font-medium"
                    >
                      {item.name}
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-sm md:text-base md:max-w-[40vw] line-clamp-2 font-medium leading-relaxed text-neutral-400">
                {overview}
              </p>
              <div className="flex items-center gap-4 flex-wrap">
                <button className="flex items-center gap-2 text-lg p-4 px-6 rounded bg-yellow-500/40 border border-yellow-500/60 font-bold capitalize">
                  <Plus strokeWidth={3} className="size-6" />
                  watchlist
                </button>
                <button className="p-4 bg-white/40 rounded gap-2 flex items-center">
                  <ThumbsUp />
                  like
                </button>
                <button className="p-4 bg-white/40 rounded gap-2 flex items-center">
                  <ThumbsDown />
                  dislike
                </button>
                <a href={homepage} target="_blank" rel="noopener noreferrer">
                  HomePage
                </a>
              </div>
            </div>
            {(
              detailData?.videos?.results.filter(
                (item) => item.official === true,
              ) ?? []
            ).length > 0 && (
              <div className="border border-white/40 rounded-xl flex flex-col gap-2 p-2.5 bg-white/20">
                <img
                  className="w-[350px] rounded-lg"
                  src={`https://img.youtube.com/vi/${
                    detailData?.videos?.results.filter(
                      (item) =>
                        item.official === true && item.type === "Trailer",
                    )[0]?.key
                  }/maxresdefault.jpg`}
                />
                <a
                  href={`https://youtu.be/${
                    detailData?.videos?.results.filter(
                      (item) =>
                        item.official === true && item.type === "Trailer",
                    )[0]?.key
                  }`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold capitalize"
                >
                  watch trailer
                </a>
              </div>
            )}
          </div>
          <div className="mt-8">
            <div className="rounded-2xl grid grid-cols-2 md:flex items-start gap-4 md:gap-8 p-8 border border-gray-400/30 bg-white/5 backdrop-blur-xl flex-wrap">
              <Information
                title="release date"
                content={formatDate(releaseDate ?? "")}
              />
              <SideLine />
              <Information title="original title" content={originalTitle} />
              <SideLine />
              <Information title="status" content={status} />
              <SideLine />

              <Information
                title={isMovie ? "runtime" : "total seasons"}
                content={
                  isMovie
                    ? generateRuntime(detailData?.runtime)
                    : `${detailData?.number_of_seasons} season${(detailData?.number_of_seasons ?? 0) > 2 ? "s" : ""}`
                }
              />
              <SideLine />
              <Information title="original title" content={originalTitle} />

              {isMovie && (
                <Information
                  title="budget"
                  content={formatCurrency(detailData.budget)}
                />
              )}
              <SideLine />

              {isMovie && (
                <Information
                  title="revenue"
                  content={formatCurrency(detailData.revenue)}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-[90vw] w-full mx-auto py-8 relative z-10">
        <section className="border border-white/20 rounded-3xl">
          <h2 className="font-bold text-2xl p-8">Cast</h2>
          <ul className="grid grid-cols-2 gap-4 p-8 border-white/20 border-t">
            {creditData?.cast.map((item) => (
              <li key={item.id} className="flex items-center gap-4">
                <img
                  className="w-16 aspect-square object-cover rounded-full object-center"
                  src={IMAGE_CONFIG.base_url + "w154" + item.profile_path}
                />
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-neutral-400">{item.character}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

const Information = ({
  title,
  content,
}: {
  title: string;
  content: string | number | undefined;
}) => {
  return (
    <div className="flex flex-col gap-2">
      <span className="font-medium uppercase text-neutral-400 text-xs tracking-widest">
        {title}
      </span>
      <p className="font-bold">{content}</p>
    </div>
  );
};

const SideLine = () => {
  return <div className="hidden w-0.5 bg-white/10 md:flex h-8"></div>;
};

export default DetailShow;
