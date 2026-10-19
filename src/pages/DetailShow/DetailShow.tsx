import React, { useContext, useEffect, useRef, useState } from "react";
import { IMAGE_CONFIG } from "../../utils/config";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router";
import type { ShowType, Collection } from "../../types/fetch";
import {
  getDetailShow,
  getShowCredit,
  getExtra,
  getCollectionDetail,
} from "../../utils/fetch";
import {
  Check,
  ChevronDown,
  Film,
  Plus,
  Star,
  ThumbsDown,
  ThumbsUp,
  Tv,
} from "lucide-react";
import {
  generateRuntime,
  formatDate,
  formatVoteCount,
  ratingBackground,
  formatCurrency,
} from "../../utils/utils";
import Credit from "../../components/Credit";
import { AuthContexts } from "../../Context/AuthContext";

function DetailShow() {
  const context = useContext(AuthContexts);
  if (!context) {
    throw new Error("error");
  }

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

  const isMovie = detailData && "title" in detailData;
  const isTv = detailData && "name" in detailData;

  const collection: Collection | undefined =
    isMovie && detailData?.belongs_to_collection
      ? detailData.belongs_to_collection
      : undefined;

  const { data: collectionData } = useQuery({
    queryKey: ["collection", collection?.id],
    queryFn: () => getCollectionDetail(collection?.id ?? 0),
    enabled: !!collection,
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
    queryFn: () => getExtra("recommendations", media_type, Number(show_id)),
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

  const movieCertification = () => {
    if (!isMovie || !detailData.release_dates) return;
    const filterEmpty = isMovie
      ? detailData?.release_dates?.results
          ?.map((item) => ({
            ...item,
            release_dates: item.release_dates.filter(
              (item2) => item2.certification !== "",
            ),
          }))
          .filter((item) => item.release_dates.length > 0)
      : [];

    return (
      filterEmpty?.find(
        (item) =>
          item.iso_3166_1 === "US" ||
          item.iso_3166_1 === "GB" ||
          item.iso_3166_1 === detailData?.origin_country[0],
      ) ?? filterEmpty?.[0]
    );
  };

  const tvCertification = () => {
    if (!isTv || !detailData.content_ratings) return;
    return (
      detailData?.content_ratings?.results?.find(
        (item) =>
          item.iso_3166_1 === "US" ||
          item.iso_3166_1 === "GB" ||
          item.iso_3166_1 === detailData?.origin_country[0],
      ) ?? detailData?.content_ratings?.results?.[0]
    );
  };

  if (detailFetching) {
    return <div className="h-screen bg-black"></div>;
  }

  return (
    <div>
      <img
        src={IMAGE_CONFIG.base_url + "w1280" + backdrop_path}
        className="fixed inset-0 h-full object-cover w-full"
      />
      <div className="relative bg-black/70 backdrop-blur-2xl">
        <div className="absolute inset-0 bg-black h-screen">
          <div className="absolute inset-0 bg-gradient-to-b from-30% from-black/40 to-black to-80%"></div>

          {!backdrop_path ? (
            <div className="bg-black h-full flex items-center justify-center">
              {media_type === "movie" ? <Film /> : <Tv />}
            </div>
          ) : (
            <img
              className="w-full h-full object-cover object-center"
              srcSet={`
              ${IMAGE_CONFIG.base_url + "w780" + backdrop_path} 780w,
              ${IMAGE_CONFIG.base_url + "w1280" + backdrop_path} 1280w,
              ${IMAGE_CONFIG.base_url + "original" + backdrop_path} 1440w`}
              src={IMAGE_CONFIG.base_url + "original" + backdrop_path}
              fetchPriority="high"
              sizes="100vw"
              alt=""
            />
          )}
          <div className="h-[250px] bg-gradient-to-b from-black to-transparent z-10 top-full inset-x-0 absolute"></div>
        </div>
        <div className="relative z-20">
          <div className="max-w-[95vw] xl:max-w-[90vw] w-full mx-auto min-h-screen flex flex-col justify-end pt-32 lg:pt-0 md:pb-16">
            <div className="flex md:flex-row justify-between md:items-end flex-col-reverse">
              <div className="flex flex-col gap-4 flex-1">
                <div>
                  <h1 className="text-5xl xl:text-6xl font-extrabold mb-2">
                    {title}
                  </h1>
                  <p className="font-medium text-yellow-500/80">{tagline}</p>
                </div>
                <div className="mt-1 text-xs md:text-sm flex items-center gap-4 flex-wrap">
                  <div
                    style={{ background: ratingBackground(vote_average || 0) }}
                    className="font-bold flex items-center gap-2 p-1 px-4 rounded text-base"
                  >
                    <Star className="fill-current" size={14} />
                    {vote_average?.toFixed(1)}
                  </div>
                  <span className="px-4 p-2 rounded bg-red-500 text-xs font-bold">
                    {isMovie
                      ? (movieCertification()?.release_dates[0].certification ??
                        "No Rating")
                      : (tvCertification()?.rating ?? "No Rating")}
                  </span>
                  <div className="flex items-center flex-wrap gap-2">
                    {genres?.map((item) => (
                      <span
                        key={item.id}
                        className="p-1.5 px-2.5 bg-zinc-800/60 border border-white/20 text-white rounded"
                      >
                        {item.name}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-sm md:text-base md:max-w-[60vw] lg:max-w-[40vw] line-clamp-2 font-medium leading-relaxed text-neutral-400">
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
                <div className="flex my-4 items-center gap-4 flex-wrap">
                  <WatchlistButton
                    media_type={media_type}
                    show_id={detailData?.id ?? 0}
                    title={
                      isMovie ? detailData.title : (detailData?.name ?? "")
                    }
                    poster={detailData?.poster_path ?? ""}
                  />
                  <button className="p-4 bg-white/40 rounded gap-4 flex items-center font-semibold capitalize">
                    <ThumbsUp />
                    like
                  </button>
                  <button className="p-4 bg-white/40 rounded gap-4 font-semibold capitalize flex items-center">
                    <ThumbsDown />
                    dislike
                  </button>
                  <a href={homepage} target="_blank" rel="noopener noreferrer">
                    HomePage
                  </a>
                </div>
              </div>
              <div className="min-w-[250px] w-fit md:w-[15vw] border border-white/20 shadow-xl shadow-white/10 rounded-lg">
                <img
                  className="rounded-lg w-full"
                  src={IMAGE_CONFIG.base_url + "w342" + detailData?.poster_path}
                />
              </div>
            </div>
            <div className="mt-8">
              <div className="flex flex-col justify-start lg:flex-row lg:justify-between gap-4 p-6 lg:p-6 border border-gray-400/30 bg-white/10 backdrop-blur-xl rounded-lg flex-wrap">
                <div className="grid lg:grid-cols-4 lg:flex items-start lg:items-end gap-4 md:gap-16 md:gap-y-8 grid-cols-2 md:grid-cols-3 w-full ">
                  <Information
                    title="release date"
                    content={formatDate(releaseDate ?? "")}
                  />
                  <Information title="original title" content={originalTitle} />
                  <Information title="status" content={status} />

                  <Information
                    title={isMovie ? "runtime" : "total seasons"}
                    content={
                      isMovie
                        ? generateRuntime(detailData?.runtime)
                        : `${detailData?.number_of_seasons} season${(detailData?.number_of_seasons ?? 0) > 2 ? "s" : ""}`
                    }
                  />
                  {isTv && (
                    <Information
                      title="total episodes"
                      content={detailData.number_of_episodes + " episodes"}
                    />
                  )}
                  {isMovie && (
                    <Information
                      title="budget"
                      content={formatCurrency(detailData.budget)}
                    />
                  )}

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
        </div>
        <div className="max-w-[95vw] xl:max-w-[90vw] w-full mx-auto py-8 relative z-10">
          <div className="">
            <h2 className="font-bold text-2xl mb-4">Video</h2>
            <ul className="grid grid-cols-[repeat(auto-fit,_minmax(250px,400px))] gap-4">
              {mediaList.reverse().map((item) => (
                <li
                  key={item.id}
                  className="flex flex-col gap-2 relative rounded-lg border border-white/20 w-full h-[250px]"
                >
                  <span className="absolute top-4 right-4 bg-blue-500/40 font-medium tracking-wide capitalize px-3 rounded-full p-1 text-white text-xs">
                    {item.type}
                  </span>
                  <img
                    className="rounded-lg w-full h-full object-cover"
                    src={`https://img.youtube.com/vi/${item.key}/hqdefault.jpg`}
                  />
                </li>
              ))}
            </ul>
          </div>
          <section className="border border-white/20 rounded-xl mt-24">
            <h2 className="font-bold text-2xl p-8">Cast & Crew</h2>
            <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] border-t items-start border-white/20 ">
              <div className="p-8 lg:border-r border-b lg:border-b-0 border-white/20 h-full">
                <h3 className="font-semibold text-lg mb-4">Starring</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {creditData?.cast.slice(0, 10).map((item) => (
                    <Credit key={item.credit_id} data={item} />
                  ))}
                </ul>
              </div>
              <div className="p-8 h-full">
                <h3 className="font-semibold text-lg mb-4">Crew</h3>

                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {crewFilter.slice(0, 10).map((item) => (
                    <Credit key={item.credit_id} data={item} />
                  ))}
                </ul>
              </div>
            </div>
          </section>
          {isMovie && collection && (
            <div
              style={{
                backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,.3), black), url(${IMAGE_CONFIG.base_url + "original" + collection?.backdrop_path})`,
              }}
              className="bg-cover p-8 rounded-lg mt-12 border border-white/20 flex flex-col gap-8"
            >
              <img
                className="w-[250px]"
                src={
                  IMAGE_CONFIG.base_url + "original" + collection?.poster_path
                }
              />
              <ul className="hide-scrollbar flex items-start gap-8 overflow-x-auto">
                {collectionData?.parts
                  .sort(
                    (item1, item2) =>
                      Number(new Date(item2.release_date)) -
                      Number(new Date(item1.release_date)),
                  )
                  .map((item) => (
                    <li key={item.id} className="min-w-[200px] max-w-[200px]">
                      <img
                        src={
                          IMAGE_CONFIG.base_url + "original" + item.poster_path
                        }
                      />
                      {item.title}
                    </li>
                  ))}
              </ul>
            </div>
          )}
          {isTv && detailData.seasons.length > 0 && (
            <div className="mt-12 p-8 border border-white/20 rounded-lg bg-black/40">
              <h2 className="font-bold text-xl mb-6">Season List</h2>
              <ul className="hide-scrollbar flex gap-6 overflow-x-auto">
                {detailData.seasons.map((item) => (
                  <li className="min-w-[250px] max-w-[250px]" key={item.id}>
                    <img
                      src={IMAGE_CONFIG.base_url + "w342" + item.poster_path}
                    />
                    {item.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <section className="mt-28">
            <h2 className="font-bold text-2xl mb-8">You may also like :</h2>
            <ul className="hide-scrollbar flex items-start gap-4 overflow-x-auto">
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
                    title={"title" in item ? item.title : item.name}
                    className="group-hover:text-yellow-500 transition-all duration-300"
                    to={`/${item.media_type}/detail/${item.id}`}
                  >
                    <p className="truncate font-semibold text-lg">
                      {"title" in item ? item.title : item.name}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
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
      <span className="font-medium uppercase line-clamp-1 text-neutral-400 text-xs tracking-widest">
        {title}
      </span>
      <p className="font-bold capitalize">{content}</p>
    </div>
  );
};

const WatchlistButton = ({
  show_id,
  media_type,
  title,
  poster,
}: {
  show_id: number;
  media_type: ShowType;
  title: string;
  poster: string;
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const context = useContext(AuthContexts);
  if (!context) {
    throw new Error("error");
  }

  const [isOpen, setIsOpen] = useState(false);
  const { addList, checkShow, removeShow, updateList, getShowById } = context;
  const Icon = checkShow(show_id) ? Check : ChevronDown;
  const showStatus = getShowById(show_id)?.status;
  const handleAddList = (col: string, val: string) => {
    if (checkShow(show_id)) {
      updateList(show_id, col, val);
      return;
    }
    addList(show_id, title, poster, media_type, val);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (isOpen && ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    window.addEventListener("click", handleOutsideClick);

    return () => {
      window.removeEventListener("click", handleOutsideClick);
    };
  }, [isOpen]);

  return (
    <div ref={ref} className="relative">
      <div
        style={{
          opacity: isOpen ? "1" : "0",
          pointerEvents: isOpen ? "auto" : "none",
        }}
        className="absolute bg-gray-900 border border-white/10 rounded top-full h-auto mt-4 z-20 inset-x-0 transition-all duration-300 min-w-[250px]"
      >
        <div className="text-sm font-medium flex flex-col p-2">
          <ul className="flex flex-col gap-2 border-b border-white/10 pb-2">
            {["plan to watch", "completed", "watching", "dropped"].map(
              (item) => (
                <li key={item} className="leading-none w-full">
                  <button
                    onClick={() => handleAddList("status", item)}
                    className={`text-start p-4 py-3 capitalize hover:bg-white/20 rounded-md w-full ${showStatus === item ? "bg-white/20" : "bg-none"}`}
                  >
                    {item}
                  </button>
                </li>
              ),
            )}
          </ul>
          <button
            onClick={() => removeShow(show_id)}
            className="p-4 py-3 capitalize hover:bg-red-500/20 rounded-md w-full text-start mt-2"
          >
            remove this
          </button>
        </div>
      </div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 p-4 px-6 rounded bg-[--main-color] text-[--main-black] font-bold capitalize transition-all duration-300`}
      >
        <Icon strokeWidth={3} className="size-6" />
        <span className="translate-y-[0.5px]">
          {checkShow(show_id)
            ? getShowById(Number(show_id))?.status
            : "add to list"}
        </span>
      </button>
    </div>
  );
};

export default DetailShow;
