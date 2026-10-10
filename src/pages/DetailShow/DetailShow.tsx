import React, { useEffect } from "react";
import { IMAGE_CONFIG } from "../../utils/config";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router";
import type { ShowType } from "../../types/fetch";
import {
  getDetailShow,
  getShowCredit,
  getRecommendation,
} from "../../utils/fetch";
import { Plus, Star, ThumbsDown, ThumbsUp } from "lucide-react";
import {
  generateRuntime,
  formatDate,
  formatVoteCount,
  ratingBackground,
  formatCurrency,
} from "../../utils/utils";
import Credit from "../../components/Credit";

function DetailShow() {
  const { media_type, show_id } = useParams<{
    media_type: ShowType;
    show_id: string;
  }>();
  if (!media_type || !show_id) return null;
  const { data: detailData, isFetching: detailFetching } = useQuery({
    queryKey: ["detail", media_type, show_id],
    queryFn: () => getDetailShow(media_type, Number(show_id)),
    staleTime: Infinity,
  });

  const { data: creditData } = useQuery({
    queryKey: ["credit", media_type, show_id],
    queryFn: () => {
      return getShowCredit(media_type, Number(show_id));
    },
    staleTime: Infinity,
  });

  const { data: recommendationData } = useQuery({
    queryKey: ["recommendation", media_type, show_id],
    queryFn: () => getRecommendation(media_type, Number(show_id)),
    staleTime: Infinity,
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

  const mediaList = Array.from(
    new Map(
      detailData?.videos?.results.map((item) => [item.type, item]),
    ).values(),
  );

  const movieDirector =
    creditData?.crew.filter((item) => item.job === "Director") ?? [];

  const crewFilter = Array.from(
    new Map(creditData?.crew.map((item) => [item.job, item])).values(),
  );

  if (detailFetching) {
    return <div className="h-screen bg-black"></div>;
  }

  return (
    <div>
      <img
        src={IMAGE_CONFIG.base_url + "w1280" + backdrop_path}
        className="fixed inset-0 h-full object-cover w-full"
      />
      <div className="relative bg-black/80 backdrop-blur-xl">
        <div className="absolute inset-0 z-0 h-screen">
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black to-100%"></div>
          <img
            className="w-full h-full object-cover object-center"
            srcSet={`
              ${IMAGE_CONFIG.base_url + "w780" + backdrop_path} 780w,
              ${IMAGE_CONFIG.base_url + "w1280" + backdrop_path} 1280w,
              ${IMAGE_CONFIG.base_url + "original" + backdrop_path} 1440w`}
            src={IMAGE_CONFIG.base_url + "original" + backdrop_path}
            loading="lazy"
          />
          <div className="h-[250px] bg-gradient-to-b from-black to-transparent z-10 top-full inset-x-0 absolute"></div>
        </div>
        <div className="relative z-10">
          <div className="max-w-[90vw] w-full mx-auto min-h-screen flex flex-col justify-end pt-32 pb-12">
            <div className="flex gap-8 sm:flex-row justify-between items-end flex-col">
              <div className="flex flex-col gap-4">
                <div>
                  <h1 className="text-4xl xl:text-5xl font-extrabold mb-2">
                    {title}
                  </h1>
                  <p className="font-semibold text-slate-400 italic">
                    {tagline}
                  </p>
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
                {isTv && detailData.created_by.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="font-bold">Created By :</span>
                    <span className="font-semibold">
                      {detailData.created_by
                        .map((item) => item.name)
                        .join(", ")}
                      .
                    </span>
                  </div>
                )}
                {isMovie && movieDirector?.length > 0 && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold">Directed By :</span>
                    <span className="font-semibold flex">
                      {movieDirector.map((item) => item.name).join(", ")}.
                    </span>
                  </div>
                )}
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
                  (item) => item.type === "Trailer",
                ) ?? []
              ).length > 0 && (
                <div className="border border-white/40 rounded-xl flex flex-col gap-2 p-2.5 bg-white/20">
                  <img
                    className="w-[350px] rounded-lg"
                    src={`https://img.youtube.com/vi/${
                      detailData?.videos?.results.filter(
                        (item) => item.type === "Trailer",
                      )[0]?.key
                    }/maxresdefault.jpg`}
                  />
                  <a
                    href={`https://youtu.be/${
                      detailData?.videos?.results.filter(
                        (item) => item.type === "Trailer",
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

                <Information
                  title={isMovie ? "runtime" : "total seasons"}
                  content={
                    isMovie
                      ? generateRuntime(detailData?.runtime)
                      : `${detailData?.number_of_seasons} season${(detailData?.number_of_seasons ?? 0) > 2 ? "s" : ""}`
                  }
                />
                <SideLine />
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
          <div className="mt-8">
            <h2 className="font-bold text-2xl mb-4">Video</h2>
            <ul className="grid grid-cols-3 gap-4">
              {mediaList.reverse().map((item) => (
                <li
                  key={item.id}
                  className="min-w-[300px] flex flex-col gap-2 relative max-w-[300px] w-full rounded-lg"
                >
                  <span className="absolute top-4 right-4 bg-white/80 border-2 font-semibold border-black p-1 px-4 text-black rounded">
                    {item.type}
                  </span>
                  <img
                    className="rounded-lg"
                    src={`https://img.youtube.com/vi/${item.key}/hqdefault.jpg`}
                  />
                </li>
              ))}
            </ul>
          </div>
          <section className="border border-white/20 rounded-xl mt-8">
            <h2 className="font-bold text-2xl p-8">Cast & Crew</h2>
            <div>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 p-8 border-white/20 border-t">
                {creditData?.cast.slice(0, 10).map((item) => (
                  <Credit key={item.credit_id} data={item} />
                ))}
              </ul>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 p-8 border-white/20 border-t">
                {crewFilter.slice(0, 10).map((item) => (
                  <Credit key={item.credit_id} data={item} />
                ))}
              </ul>
            </div>
          </section>
          <section className="mt-8">
            <h2 className="font-bold text-2xl mb-4">You may also like :</h2>
            <ul className="horizontal-container flex items-start gap-4 overflow-x-auto">
              {recommendationData?.results.map((item) => (
                <li
                  key={item.id}
                  className="group flex flex-col gap-2 w-full min-w-[200px] h-full max-w-[200px]"
                >
                  <img
                    src={IMAGE_CONFIG.base_url + "w185" + item.poster_path}
                    className="w-full h-full object-cover rounded-lg border border-white/20"
                  />
                  <Link
                    className="group-hover:text-yellow-500 transition-all duration-300"
                    to={`/discover/${item.media_type}/detail/${item.id}`}
                  >
                    <p className="truncate font-semibold text-lg">
                      {"title" in item ? item.title : item.name}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
          <div className="flex items-center gap-4 bg-white/40 flex-wrap justify-center">
            {detailData?.production_companies
              .filter((item) => item.logo_path !== null)
              .map((item) => (
                <img
                  className="max-h-[80px] max-w-[300px] h-full object-cover"
                  key={item.id}
                  src={IMAGE_CONFIG.base_url + "original" + item.logo_path}
                />
              ))}
          </div>
        </div>
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
