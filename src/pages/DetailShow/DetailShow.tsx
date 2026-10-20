import React from "react";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getDetailShow, getShowCredit } from "../../utils/fetch";
import type { ShowType } from "../../types/fetch";
import { IMAGE_CONFIG } from "../../utils/config";
import { formatDate, generateRuntime } from "../../utils/utils";

function DetailShow() {
  const { media_type, show_id } = useParams<{
    media_type: ShowType;
    show_id: string;
  }>();

  const { data: detailData } = useQuery({
    queryKey: ["detail", media_type, show_id],
    queryFn: () => getDetailShow(media_type!, Number(show_id)),
    enabled: !!media_type && !!show_id,
    staleTime: Infinity,
  });

  const { data: creditData } = useQuery({
    queryKey: ["credit", media_type, show_id],
    queryFn: () => getShowCredit(media_type!, Number(show_id)),
    enabled: !!media_type && !!show_id,
    staleTime: Infinity,
  });
  const {
    backdrop_path,
    poster_path,
    tagline,
    overview,
    genres,
    status,
    homepage,
    origin_country,
  } = detailData ?? {};
  const isMovie = detailData && "title" in detailData;
  const title = isMovie ? detailData?.title : detailData?.name;
  const releaseDate = isMovie
    ? detailData.release_date
    : detailData?.first_air_date;

  return (
    <div className="p-8">
      <div className="fixed -z-10 inset-0 ">
        <div className="absolute bg-black/80 backdrop-blur-md inset-0"></div>
        <img
          className="w-full"
          src={IMAGE_CONFIG.base_url + "w1280" + backdrop_path}
        />
      </div>
      <div className="max-w-screen-xl w-full mx-auto mt-12 md:mt-32">
        <div className="flex flex-col sm:flex-row gap-10 items-start">
          <img
            className="rounded-md h-full w-auto border border-white/20"
            src={IMAGE_CONFIG.base_url + "w342" + poster_path}
          />
          <div className="flex flex-col gap-5 w-full">
            <div className="flex gap-4 items-center uppercase text-sm font-semibold">
              <span className="">
                {media_type === "movie" ? media_type : "tv series"}
              </span>
              <span className="">
                <img
                  className="w-4 h-auto"
                  src={`https://flagcdn.com/16x12/${origin_country?.[0]?.toLocaleLowerCase()}.png`}
                  title={origin_country?.[0]}
                />
              </span>
              <span>{status}</span>
            </div>
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl md:text-5xl font-bold">{title}</h1>
              {tagline && (
                <q className="text-yellow-200/70 text-sm md:text-base">
                  {tagline}
                </q>
              )}
            </div>
            {(genres?.length ?? 0) > 0 && (
              <div className="flex gap-2 items-center flex-wrap">
                {genres?.map((item) => (
                  <span
                    className="p-1.5 text-xs px-4 border border-white/20 bg-black rounded-lg font-medium text-slate-400"
                    key={item.id}
                  >
                    {item.name}
                  </span>
                ))}
              </div>
            )}
            <p className="leading-relaxed line-clamp-3">{overview}</p>
            <div className="flex flex-col gap-2">
              <button className="bg-yellow-300 p-3 px-6 text-black rounded-lg font-bold capitalize">
                add to list
              </button>
              <a
                className="bg-slate-600 p-3 rounded-lg text-center"
                href={homepage}
                target="_blank"
                rel="noopener noreferrer"
              >
                official site
              </a>
            </div>
          </div>
        </div>
        <div className="mt-12">
          <h2 className="text-2xl font-bold">About</h2>
          <div className="mt-4 rounded-xl bg-white/5 flex flex-wrap gap-4 p-6 px-8 w-full">
            <AboutInfo
              title="release date"
              data={formatDate(releaseDate ?? "")}
            />
            <AboutInfo
              title="original title"
              data={
                isMovie ? detailData.original_title : detailData?.original_name
              }
            />
            <AboutInfo
              title={media_type === "movie" ? "duration" : "number of seasons"}
              data={
                isMovie
                  ? generateRuntime(detailData.runtime)
                  : `${detailData?.number_of_seasons} season${(detailData?.number_of_seasons ?? 0) > 2 ? "s" : ""}`
              }
            />
            {isMovie && detailData?.budget !== 0 && (
              <AboutInfo title="budget" data={isMovie && detailData.budget} />
            )}
            {isMovie && detailData?.revenue !== 0 && (
              <AboutInfo title="revenue" data={isMovie && detailData.revenue} />
            )}
          </div>
        </div>
        <div className="mt-12">
          <h2 className="font-bold text-2xl mb-4">Cast</h2>
          <ul className="flex items-start gap-8 overflow-x-auto hide-scrollbar">
            {creditData?.cast.slice(0, 10).map((item) => (
              <li
                key={item.cast_id}
                className="min-w-[150px] flex flex-col gap-2"
              >
                <img
                  className="rounded-lg w-full h-[160px] object-cover"
                  src={IMAGE_CONFIG.base_url + "w185" + item.profile_path}
                />
                <div>
                  <h3 className="truncate">{item.name}</h3>
                  <p>{item.character}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-12">
          <h2 className="font-bold text-2xl mb-4">Crew</h2>
          <ul className="flex items-start gap-8 overflow-x-auto hide-scrollbar">
            {Array.from(
              new Map(
                creditData?.crew.map((item) => [item.job, item]),
              ).values(),
            )
              .slice(0, 10)
              .map((item) => (
                <li
                  key={item.credit_id}
                  className="min-w-[150px] flex flex-col gap-2"
                >
                  <img
                    className="rounded-lg w-full h-[160px] object-cover"
                    src={IMAGE_CONFIG.base_url + "w185" + item.profile_path}
                  />
                  <div>
                    <h3 className="truncate">{item.name}</h3>
                    <p className="truncate">{item.job}</p>
                  </div>
                </li>
              ))}
          </ul>
        </div>
        <div className="mt-12">
          <h2 className="font-bold text-2xl mb-4">videos</h2>
          <ul className="flex items-start gap-8 overflow-x-auto hide-scrollbar">
            {detailData?.videos?.results.map((item) => (
              <li className="min-w-[350px]" key={item.id}>
                <img src={`https://i.ytimg.com/vi/${item.key}/mqdefault.jpg`} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

const AboutInfo = ({
  data,
  title,
}: {
  data: string | number | undefined;
  title: string;
}) => {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="uppercase font-medium text-sm">{title}</h3>
      <p className="font-bold">{data}</p>
    </div>
  );
};

export default DetailShow;
