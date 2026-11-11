import { useEffect } from "react";
import { IMAGE_CONFIG } from "../../utils/config";
import { useQuery } from "@tanstack/react-query";
import type {
  Crew,
  ProviderMethod,
  ShowType,
  WatchProviderResult,
} from "../../types/fetch";
import { getDetailShow, getWatchProvider } from "../../utils/fetch";
import { formatDate, generateRuntime, formatCurrency } from "../../utils/utils";

interface About {
  show_type: ShowType;
  show_id: string;
  getCrew: (job: string) => Crew[] | undefined;
}

function About({ show_type, show_id, getCrew }: About) {
  const { data: detailData } = useQuery({
    queryKey: ["detail", show_type, show_id],
    queryFn: () => getDetailShow(show_type, Number(show_id)),
    staleTime: Infinity,
  });

  const { data: watchProviderData } = useQuery({
    queryKey: ["watch_providers", show_type, show_id],
    queryFn: () => getWatchProvider(show_type!, Number(show_id)),
    enabled: !!show_type && !!show_id,
    staleTime: Infinity,
  });

  const { poster_path, overview, origin_country, status } = detailData ?? {};
  const isMovie = detailData && "title" in detailData;
  const releaseDate = isMovie
    ? detailData.release_date
    : detailData?.first_air_date;

  const allCountryProvider = Object.values(watchProviderData?.results ?? {});
  const sortProvider = allCountryProvider.reduce(
    (acc, item) => {
      Object.entries(item).forEach(([k, v]) => {
        if (k !== "link") {
          acc[k] = Array.from(
            new Map(
              [...(acc[k] ?? []), ...(v ?? [])].map((item2) => [
                item2.provider_id,
                item2,
              ]),
            ).values(),
          );
        }
      });
      return acc;
    },
    {} as Record<string, ProviderMethod[]>,
  );

  const allProvider: ProviderMethod[] = [
    ...new Map(
      allCountryProvider
        .flatMap((item) =>
          Object.entries(item)
            .filter(([k]) => k !== "link")
            .flatMap(([, v]) => v),
        )
        .map((item) => [item.provider_id, item]),
    ).values(),
  ];
  useEffect(() => {
    console.log(allProvider);
  }, [watchProviderData]);

  return (
    <div id="about" className="bg-black pt-24 px-6 md:px-12">
      <div className="flex items-start gap-12">
        <img
          className="min-w-[30%] object-cover h-full border border-neutral-800"
          src={IMAGE_CONFIG.base_url + "w500" + poster_path}
        />
        <div className="flex flex-col gap-12 w-full">
          {overview && (
            <p className="text-lg leading-relaxed text-neutral-400 line-clamp-3">
              {overview}
            </p>
          )}
          <div className="grid grid-cols-2 gap-8 gap-y-6 w-full">
            <ShowMetadata
              title="original title"
              data={
                isMovie ? detailData.original_title : detailData?.original_name
              }
            />
            <ShowMetadata
              title="release date"
              data={formatDate(releaseDate ?? "-")}
            />
            <ShowMetadata
              title={isMovie ? "duration" : "number of seasons"}
              data={
                isMovie
                  ? generateRuntime(detailData.runtime)
                  : detailData?.number_of_seasons
              }
            />
            {isMovie && (
              <ShowMetadata
                title="budget"
                data={formatCurrency(detailData.budget)}
              />
            )}
            {isMovie && (
              <ShowMetadata
                title="revenue"
                data={formatCurrency(detailData.revenue)}
              />
            )}
            {isMovie && (getCrew("Director")?.length ?? 0) > 0 && (
              <ShowMetadata
                title="directed by"
                data={getCrew("Director")
                  ?.map((item) => item.name)
                  .join(", ")}
              />
            )}
            {!isMovie && (
              <ShowMetadata
                title="number of episodes"
                data={detailData?.number_of_episodes}
              />
            )}
            {!isMovie && (detailData?.created_by?.length ?? 0) > 0 && (
              <ShowMetadata
                title="created by"
                data={detailData?.created_by
                  ?.map((item) => item.name)
                  .join(", ")}
              />
            )}
            <ShowMetadata
              title="origin country"
              data={origin_country?.join(", ")}
            />
            <ShowMetadata title="status" data={status} />
          </div>
          <h3>available on:</h3>
          <ul className="flex gap-4 flex-wrap">
            {allProvider
              .sort((a, b) => a.display_priority - b.display_priority)
              .slice(0, 5)
              .map((item) => (
                <li key={item.provider_id}>
                  <img src={IMAGE_CONFIG.base_url + "w92" + item.logo_path} />
                </li>
              ))}
          </ul>
              {allProvider.length > 5 && <button>see more</button>}
        </div>
      </div>
    </div>
  );
}

const ShowMetadata = ({
  title,
  data,
}: {
  title: string;
  data: string | number | undefined;
}) => {
  return (
    <div className="border-t border-neutral-800 pt-6 flex flex-col gap-3 w-full">
      <h3 className="uppercase tracking-widest font-semibold text-slate-400 text-xs">
        {title}
      </h3>

      <p
        title={data?.toString()}
        className="font-bold capitalize text-xl text-neutral-200"
      >
        {data ?? "N/A"}
      </p>
    </div>
  );
};

export default About;
