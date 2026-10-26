import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getDetailShow, getShowCredit, getExtra } from "../../utils/fetch";
import type {
  DetailVideo,
  ShowType,
  TrendingResponse,
} from "../../types/fetch";
import { IMAGE_CONFIG } from "../../utils/config";
import {
  ArrowBigDown,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { formatDate, generateRuntime } from "../../utils/utils";

function DetailShow() {
  const { media_type, show_id } = useParams<{
    media_type: ShowType;
    show_id: string;
  }>();

  const { data: detailData, isFetching: detailFetching } = useQuery({
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

  const { data: recommendationData } = useQuery({
    queryKey: ["recommendation", media_type, show_id],
    queryFn: () => getExtra("recommendations", media_type!, Number(show_id)),
  });
  const {
    vote_average,
    vote_count,
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

  const moviesRating = () => {
    if (isMovie) {
      const ratings = detailData.release_dates?.results ?? [];

      const filterEmptyRating = ratings
        .map((item) => ({
          ...item,
          release_dates: item.release_dates.filter(
            (item2) => item2.certification !== "",
          ),
        }))
        .filter((item) => item.release_dates.length > 0);
      const countryPrior = ["GB", "US", detailData.origin_country[0]].filter(
        Boolean,
      );
      return (
        countryPrior
          .map((item) =>
            filterEmptyRating.find((item2) => item2.iso_3166_1 === item),
          )
          .filter(Boolean)[0] ?? filterEmptyRating[0]
      );
    }
  };

  const tvRating = () => {
    if (!isMovie) {
      const ratings = detailData?.content_ratings?.results ?? [];
      const countryPrior = ["GB", "US", detailData?.origin_country[0]].filter(
        Boolean,
      );
      return (
        countryPrior
          .map((item) => ratings.find((item2) => item2.rating === item))
          .filter(Boolean)[0] ?? ratings[0]
      );
    }
  };

  const scrollToSection = () => {
    document
      .querySelector("#about")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (detailFetching) {
    return <div className="bg-black"></div>;
  }

  return (
    <div className="">
      <div className="h-screen relative group/hero">
        <div className="bg-black/30 absolute inset-0 flex justify-center flex-col gap-4 p-4 md:px-12">
          <button
            onClick={scrollToSection}
            className="absolute bottom-8 inset-x-1/2 transition-all opacity-0 duration-300 group-hover/hero:opacity-100"
          >
            <ArrowBigDown />
          </button>
          <h1
            className={`font-bold uppercase leading-none max-w-[60%] ${(title?.length ?? 0) > 30 ? "text-[2rem] lg:text-[4rem]" : "text-[4rem] lg:text-[6rem]"}`}
          >
            {title}
          </h1>
          <div className="flex items-center gap-4">
            {genres?.map((item) => (
              <span key={item.id} className="font-semibold text-lg">
                {item.name}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-6 mt-2 text-xl">
            <p className="p-3.5 bg-white text-black w-fit font-extrabold leading-none">
              {vote_average?.toFixed(1)}
            </p>
            <p className="p-3.5 bg-white text-black w-fit font-extrabold leading-none">
              {(isMovie
                ? moviesRating()?.release_dates[0].certification
                : tvRating()?.rating) ?? "No rating"}
            </p>
          </div>

          <div className="absolute bottom-8 flex items-center opacity-0 gap-8 transition-all duration-300 group-hover/hero:opacity-100 delay-75">
            <button className="border p-4 px-6 leading-none uppercase transition-all duration-200 hover:bg-white hover:text-black">
              play trailer
            </button>
            <button className="group overflow-hidden rounded-lg text-white font-semibold">
              Add to list
            </button>
          </div>
        </div>
        <img
          className="w-full h-full object-cover"
          src={IMAGE_CONFIG.base_url + "original" + backdrop_path}
        />
      </div>
      <div id="about" className="bg-black pt-32 px-12">
        <div className="flex flex-col md:flex-row items-start gap-12 mt-12">
          <img
            className="w-[200px] xl:w-[350px] rounded-lg"
            src={IMAGE_CONFIG.base_url + "w342" + poster_path}
          />
          <div className="w-full">
            <p className="text-pretty leading-loose text-neutral-400 max-w-[80%] font-light">
              {overview}
            </p>
            <div className="mt-8">
              <ShowMetadata
                title="original title"
                data={
                  isMovie
                    ? detailData?.original_title
                    : detailData?.original_name
                }
              />
              <ShowMetadata
                title="release date"
                data={formatDate(releaseDate ?? "")}
              />
              <ShowMetadata
                title={isMovie ? "duration" : "total seasons"}
                data={
                  isMovie
                    ? generateRuntime(detailData?.runtime)
                    : `${detailData?.number_of_seasons} season${(detailData?.number_of_seasons ?? 0) > 2 ? "s" : ""}`
                }
              />
              {isMovie && (
                <ShowMetadata
                  title="budget"
                  data={isMovie && detailData?.budget}
                />
              )}
              {isMovie && (
                <ShowMetadata
                  title="revenue"
                  data={isMovie && detailData?.revenue}
                />
              )}
              {!isMovie && (
                <ShowMetadata
                  title="total episodes"
                  data={
                    !isMovie && `${detailData?.number_of_episodes} episodes`
                  }
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="px-12 pt-32 bg-black">
        <h2 className="text-3xl font-bold uppercase">Cast</h2>
        <ul className="flex gap-8 items-start overflow-x-auto mt-8 hide-scrollbar">
          {creditData?.cast.slice(0, 10).map((item) => (
            <li key={item.credit_id} className="min-w-[150px]">
              <img
                className="h-[180px] rounded-lg w-full object-cover"
                src={IMAGE_CONFIG.base_url + "w185" + item.profile_path}
              />
              <h3 className="truncate">{item.name}</h3>
            </li>
          ))}
        </ul>
      </div>
      <Extras data={detailData?.videos?.results} />
      <ReccomendationSection data={recommendationData} />
    </div>
  );
}

const Extras = ({ data }: { data: DetailVideo[] | undefined }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [currentList, setCurrentList] = useState<
    "Trailer" | "Featurette" | "Clip" | "Teaser" | "Behind the Scenes"
  >("Trailer");
  const [isSelectExtra, setIsSelectExtra] = useState(false);
  const filteredData = data?.filter((item) => item.type === currentList);
  const handleClick = (item) => {
    setCurrentList(item);
    setIsSelectExtra(false);
  };
  const getQty = (
    type: "Trailer" | "Featurette" | "Clip" | "Teaser" | "Behind the Scenes",
  ) => {
    return data?.filter((item) => item.type === type).length ?? 0;
  };
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        isSelectExtra &&
        ref.current &&
        !ref.current.contains(e.target as Node)
      ) {
        setIsSelectExtra(false);
      }
    };
    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, [isSelectExtra]);

  useEffect(() => {
    setCurrentList("Trailer");
    setIsSelectExtra(false);
  }, [data]);

  return (
    <section className="px-12 pt-12 bg-black">
      <div className="flex items-center gap-4">
        <h2>Extras</h2>
        <div ref={ref} className="relative">
          <button
            className="flex items-center justify-between"
            onClick={() => setIsSelectExtra(!isSelectExtra)}
          >
            {currentList}
            <span>
              <ChevronDown />
            </span>
          </button>
          <ul
            className={`absolute flex flex-col bg-white min-w-[200px] text-black mt-4 ${isSelectExtra ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
          >
            {[
              { name: "Trailer", qty: getQty("Trailer") },
              { name: "Featurette", qty: getQty("Featurette") },
              { name: "Clip", qty: getQty("Clip") },
              { name: "Teaser", qty: getQty("Teaser") },
              { name: "Behind the Scenes", qty: getQty("Behind the Scenes") },
            ].map((item) => (
              <li key={item.name} className="w-full">
                <button
                  className="w-full text-left p-2 flex justify-between items-center"
                  onClick={() => handleClick(item.name)}
                >
                  {item.name}
                  <span>{item.qty}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <ul className="hide-scrollbar flex items-start gap-4 overflow-x-auto mt-8">
        {filteredData?.map((item) => (
          <li key={item.id} className="min-w-[350px]">
            <img
              className="w-full"
              src={`https://i.ytimg.com/vi/${item.key}/mqdefault.jpg`}
            />
            <h3 className="truncate">{item.type}</h3>
          </li>
        ))}
      </ul>
    </section>
  );
};

const ReccomendationSection = ({
  data: recommendationData,
}: {
  data: TrendingResponse | undefined;
}) => {
  const ref = useRef<HTMLUListElement>(null);
  const handleClick = (route: string) => {
    if (!ref.current) return;
    const direction = route === "next" ? 1 : -1;
    const destination =
      ref.current.scrollLeft + ref.current.offsetWidth * 0.8 * direction;
    ref.current.scrollTo({
      left: destination,
      behavior: "smooth",
    });
  };
  return (
    <section className="px-12 pt-12 bg-black">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold uppercase">you may also like</h2>
        <div className="flex items-center gap-4">
          <button onClick={() => handleClick("back")}>
            <ChevronLeft />
          </button>
          <button onClick={() => handleClick("next")}>
            <ChevronRight />
          </button>
        </div>
      </div>
      <ul
        ref={ref}
        className="flex gap-8 items-start overflow-x-auto mt-8 hide-scrollbar"
      >
        {recommendationData?.results.map((item) => (
          <li key={item.id} className="min-w-[200px]">
            <img
              src={IMAGE_CONFIG.secure_base_url + "w185" + item.poster_path}
            />
            <Link to={`/${item.media_type}/detail/${item.id}`}>
              <h3 className="truncate">
                {"title" in item ? item.title : item.name}
              </h3>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};

const ShowMetadata = ({
  title,
  data,
}: {
  title: string;
  data: string | number | undefined;
}) => {
  return (
    <div className="flex items-start justify-between border-b first:border-t border-white/20 py-4">
      <h3 className="font-semibold uppercase text-sm text-neutral-400">
        {title}
      </h3>
      <p className="font-bold text-right">{data}</p>
    </div>
  );
};

export default DetailShow;
