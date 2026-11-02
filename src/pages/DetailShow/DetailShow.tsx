import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import {
  getDetailShow,
  getShowCredit,
  getExtra,
  getCollectionDetail,
  getReview,
} from "../../utils/fetch";
import type {
  Collection,
  DetailVideo,
  Season,
  ShowType,
  TrendingResponse,
} from "../../types/fetch";
import { IMAGE_CONFIG } from "../../utils/config";
import {
  ArrowBigDown,
  ArrowLeft,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  User,
  X,
} from "lucide-react";
import { formatDate, generateRuntime } from "../../utils/utils";
import Credit from "../../components/Credit";

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
        <Link to={"/"} className="absolute z-50 right-12 top-12 border p-2">
          <X size={30} />
        </Link>
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
      <div id="about" className="bg-black pt-24 px-6 md:px-12">
        <div className="flex items-start gap-12">
          <img
            className="border border-neutral-800"
            src={IMAGE_CONFIG.base_url + "w342" + detailData?.poster_path}
          />
          <div className="w-full">
            <div className="grid grid-cols-2 gap-4 w-full">
              <ShowMetadata
                title="original title"
                data={
                  isMovie
                    ? detailData.original_title
                    : detailData?.original_name
                }
              />
              <ShowMetadata
                title="release date"
                data={formatDate(
                  isMovie
                    ? detailData.release_date
                    : (detailData?.first_air_date ?? ""),
                )}
              />
              <ShowMetadata
                title={isMovie ? "duration" : "number of seasons"}
                data={
                  isMovie
                    ? generateRuntime(detailData.runtime)
                    : `${detailData?.number_of_seasons} season${(detailData?.number_of_seasons ?? 0) > 2 ? "s" : ""}`
                }
              />
              {isMovie && (
                <ShowMetadata title="budget" data={detailData.budget} />
              )}
              {isMovie && (
                <ShowMetadata title="revenue" data={detailData.revenue} />
              )}
              {!isMovie && (
                <ShowMetadata
                  title="number of episodes"
                  data={detailData?.number_of_episodes + " episodes"}
                />
              )}
              <ShowMetadata
                title="origin country"
                data={detailData?.origin_country.join(", ")}
              />
              <ShowMetadata title="status" data={detailData?.status} />
              <ShowMetadata
                title={isMovie ? "directed by" : "created by"}
                data={
                  isMovie
                    ? creditData?.crew
                        .filter((item) => item.job === "Director")
                        .map((item) => item.name)
                        .join(", ")
                    : detailData?.created_by.map(item => item.name).join(', ')
                }
              />
            </div>
          </div>
        </div>
      </div>
      <div className="px-12 pt-32 pb-16 bg-black">
        <div className="flex items-center gap-4 justify-between">
          <h2 className="text-3xl font-bold uppercase">Cast & Crew</h2>
          <button>see all</button>
        </div>
        <ul className="flex gap-8 items-start overflow-x-auto mt-8 hide-scrollbar">
          {creditData?.cast.slice(0, 5).map((item) => (
            <Credit data={item} key={item.credit_id} />
          ))}
          {Array.from(
            new Map(creditData?.crew.map((item) => [item.job, item])).values(),
          )
            .slice(0, 5)
            .map((item) => (
              <Credit data={item} key={item.credit_id} />
            ))}
        </ul>
      </div>
      {isMovie && detailData.belongs_to_collection && (
        <Collection collection={detailData.belongs_to_collection} />
      )}
      {!isMovie && (detailData?.seasons.length ?? 0) > 1 && (
        <Seasons data={detailData?.seasons ?? []} />
      )}
      <Extras data={detailData?.videos?.results} />
      <ReccomendationSection data={recommendationData} />
      <Review media_type={media_type!} show_id={detailData?.id!} />
    </div>
  );
}

const Collection = ({ collection }: { collection: Collection }) => {
  const { data: collectionData } = useQuery({
    queryKey: ["collection", collection.id],
    queryFn: () => getCollectionDetail(collection.id),
  });
  return (
    <section className="relative bg-black">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-black/40"></div>
        <img
          className="w-full h-full object-cover"
          src={IMAGE_CONFIG.base_url + "w1280" + collectionData?.backdrop_path}
        />
      </div>
      <div className="relative z-10 px-12 py-16">
        <h3 className="font-bold text-3xl">Discover {collectionData?.name}</h3>
        <p className="leading-relaxed mt-4 text-lg xl:max-w-[60%]">
          {collectionData?.overview}
        </p>
        <ul className="flex items-start gap-4 overflow-x-auto mt-12 hide-scrollbar">
          {collectionData?.parts.map((item) => (
            <li className="min-w-[300px]" key={item.id}>
              <img src={IMAGE_CONFIG.base_url + "w342" + item.poster_path} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

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
          <li key={item.id} className="min-w-[450px]">
            <img
              className="w-full border border-neutral-600"
              src={`https://i.ytimg.com/vi/${item.key}/mqdefault.jpg`}
            />
            <h3 className="truncate">{item.name}</h3>
          </li>
        ))}
      </ul>
    </section>
  );
};

const Seasons = ({ data }: { data: Season[] }) => {
  const [currentIndex, setcurrentIndex] = useState(data.length - 1);
  const currentSeason = data[currentIndex];

  const handleClick = (route: string) => {
    if (
      (currentIndex === 0 && route === "prev") ||
      (currentIndex === data.length - 1 && route === "next")
    )
      return;
    setcurrentIndex((prev) => (route === "next" ? prev + 1 : prev - 1));
  };
  return (
    <section className="relative py-12 bg-black">
      <div className="relative flex items-center gap-12 p-8 bg-neutral-900 text-black">
        <span className="absolute right-12 text-black top-12">
          Current Season
        </span>
        <img
          className="min-h-[450px] max-w-[342px] object-cover"
          src={IMAGE_CONFIG.base_url + "w342" + currentSeason.poster_path}
        />
        <div className="absolute flex bottom-12 right-12">
          <button
            disabled={currentIndex === 0}
            onClick={() => handleClick("prev")}
          >
            left
          </button>
          <button
            disabled={currentIndex === data.length - 1}
            onClick={() => handleClick("next")}
          >
            right
          </button>
        </div>
        <div>
          <span>{currentSeason.season_number}</span>
          <h3 className="text-3xl font-bold">{currentSeason?.name}</h3>
          <p className="text-lg line-clamp-3">
            {currentSeason?.overview ?? "-"}
          </p>
          <p>{currentSeason?.episode_count} episodes</p>
          {currentSeason?.air_date}
        </div>
      </div>
    </section>
  );
};

const ReccomendationSection = ({
  data: recommendationData,
}: {
  data: TrendingResponse | undefined;
}) => {
  const ref = useRef<HTMLUListElement>(null);
  const [isStart, setIsStart] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const handleClick = (route: string) => {
    if (!ref.current) return;
    console.log(ref.current);
    const direction = route === "next" ? 1 : -1;
    const destination =
      ref.current.scrollLeft + ref.current.offsetWidth * 0.8 * direction;
    ref.current.scrollTo({
      left: destination,
      behavior: "smooth",
    });
  };

  const handleScroll = (e: React.UIEvent<HTMLUListElement>) => {
    const { scrollLeft, scrollWidth, offsetWidth } = e.currentTarget;
    setIsStart(scrollLeft <= 1);
    setIsEnd(scrollLeft >= scrollWidth - offsetWidth - 1);
  };

  useEffect(() => {
    setIsStart(true);
    setIsEnd(false);
  }, [recommendationData]);

  return (
    <section className="px-12 pt-12 bg-black">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold uppercase">you may also like</h2>
        <div className="flex items-center gap-4">
          <button
            className="disabled:text-neutral-500 text-white"
            disabled={isStart}
            onClick={() => handleClick("back")}
          >
            <ChevronLeft />
          </button>
          <button
            className="disabled:text-neutral-500 text-white"
            disabled={isEnd}
            onClick={() => handleClick("next")}
          >
            <ChevronRight />
          </button>
        </div>
      </div>
      <ul
        onScroll={handleScroll}
        ref={ref}
        className="flex gap-4 items-start overflow-x-auto py-8 hide-scrollbar"
      >
        {recommendationData?.results.map((item) => (
          <li key={item.id} className="w-[200px] shrink-0">
            <img
              className="w-full h-[300px] object-cover"
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
    <div className="bg-neutral-950 border border-neutral-800 p-6 flex flex-col gap-4 w-full">
      <h3 className="font-bold uppercase tracking-wider text-neutral-400">
        {title}
      </h3>

      <p title={data?.toString()} className="font-bold capitalize text-lg">
        {data ?? "N/A"}
      </p>
    </div>
  );
};

const Review = ({
  media_type,
  show_id,
}: {
  media_type: ShowType;
  show_id: number;
}) => {
  const { data } = useQuery({
    queryKey: ["review", media_type, show_id],
    queryFn: () => getReview(media_type, show_id),
  });
  return (
    <section className="">
      <h3>review</h3>
      <ul>
        {data?.results.map((item) => (
          <li>
            {item.author}
            {item.author_details.rating}
          </li>
        ))}
      </ul>
    </section>
  );
};

export default DetailShow;
