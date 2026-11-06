import { useState, useEffect, useRef } from "react";
import { useParams, Link, data } from "react-router";
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
  ShowCredit,
  ShowType,
  TrendingResponse,
} from "../../types/fetch";
import { IMAGE_CONFIG } from "../../utils/config";
import {
  ArrowBigDown,
  ArrowLeft,
  ArrowUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  User,
  X,
} from "lucide-react";
import { formatDate, generateRuntime } from "../../utils/utils";
import Credit from "../../components/Credit";

function DetailShow() {
  const [isScrolled, setIsScrolled] = useState(false);
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
    enabled: !!media_type && !!show_id,
    staleTime: Infinity,
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

  useEffect(() => {
    const castSection = document.querySelector<HTMLElement>("#cast");
    const handleScroll = () => {
      setIsScrolled(window.scrollY >= (castSection?.offsetTop ?? 0));
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  if (detailFetching) {
    return <div className="bg-black"></div>;
  }

  return (
    <div className="relative">
      {isScrolled && (
        <button
          onClick={() => scrollTo({ top: 0, behavior: "smooth" })}
          className="bg-white border-2 border-black fixed bottom-4 right-4 z-50"
        >
          <ArrowUp className="text-black size-10" />
        </button>
      )}
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
        <div className="flex items-start flex-col lg:flex-row gap-12">
          <img
            className="border border-neutral-800"
            src={IMAGE_CONFIG.base_url + "w342" + detailData?.poster_path}
          />
          <div className="w-full">
            <div className="border border-neutral-800 bg-neutral-950 p-6 py-8 mb-4 flex flex-col gap-4">
              <h3 className="uppercase font-bold text-lg text-neutral-400">
                overview
              </h3>
              <p className="leading-loose font-light text-neutral-400 line-clamp-3">
                {overview}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 w-full">
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
                    : detailData?.created_by.map((item) => item.name).join(", ")
                }
              />
            </div>
          </div>
        </div>
      </div>
      <Cast creditData={creditData} />
      <Crew creditData={creditData} />
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

const Cast = ({ creditData }: { creditData: ShowCredit | undefined }) => {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    document.body.style.overflowY = isActive ? "hidden" : "";

    return () => {
      document.body.style.overflowY = "";
    };
  }, [isActive]);

  return (
    <div id="cast" className="px-12 pt-32 pb-16 bg-black relative">
      <div
        onClick={() => setIsActive(false)}
        className={`fixed inset-0 z-50 flex items-center justify-center ${isActive ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      >
        <div className="bg-white border border-black max-h-[80vh] text-black overflow-y-auto p-8 min-w-[80vw] max-w-[80vw]">
          <div className="">
            <h2 className="uppercase font-bold text-lg">cast</h2>
            <ul className="text-black grid grid-cols-3 gap-4">
              {creditData?.cast?.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center gap-4 bg-black text-white p-4"
                >
                  <img
                    className="w-20 h-20 object-cover"
                    src={IMAGE_CONFIG.base_url + "w185" + item.profile_path}
                  />
                  <div>
                    <h3>{item.name}</h3>
                    <p>{item.character}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4 justify-between">
        <h2 className="text-3xl font-bold uppercase">Cast</h2>
        <button onClick={() => setIsActive(true)}>see all</button>
      </div>
      <ul className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-4 items-start mt-8">
        {creditData?.cast.slice(0, 10).map((item) => (
          <li
            key={item.credit_id}
            className="bg-neutral-950 border border-neutral-700 flex items-center gap-4"
          >
            <div className="w-24 h-24 border-r border-neutral-700">
              {!item.profile_path ? (
                <div className="bg-neutral-900 border h-full border-white">
                  <User className="text-neutral-600" />
                </div>
              ) : (
                <img
                  className="object-cover h-full w-full"
                  src={IMAGE_CONFIG.base_url + "w185" + item.profile_path}
                />
              )}
            </div>
            <div>
              <h3 className="font-bold">{item.name}</h3>
              <p className="font-light text-sm">{item.character}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
const Crew = ({ creditData }: { creditData: ShowCredit | undefined }) => {
  const [isActive, setIsActive] = useState(false);
  const [isSelectDepartment, setIsSelectDepartment] = useState(false);
  const [currentDepartment, setCurrentDepartment] = useState<string>("");
  const groupedCrew =
    creditData?.crew?.reduce(
      (acc, member) => {
        if (!acc[member.department]) {
          acc[member.department] = [];
        }
        acc[member.department].push(member);
        return acc;
      },
      {} as Record<string, typeof creditData.crew>,
    ) ?? {};
  useEffect(() => {
    document.body.style.overflowY = isActive ? "hidden" : "";
    return () => {
      document.body.style.overflowY = "";
    };
  }, [isActive]);
  useEffect(() => {
    if (!currentDepartment) {
      const departments = Object.keys(groupedCrew ?? {}).sort((a, b) =>
        a.localeCompare(b),
      );

      if (departments.length > 0) {
        setCurrentDepartment(departments[0]);
      }
    }
  }, [currentDepartment, groupedCrew]);

  return (
    <div id="crew" className="px-12 pt-32 pb-16 bg-black relative">
      <div
        onClick={() => setIsActive(false)}
        className={`fixed inset-0 z-50 flex items-center justify-center ${isActive ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      >
        <div className="bg-white border border-black max-h-[80vh] text-black overflow-y-auto p-8 min-w-[80vw] max-w-[80vw]">
          <div className="">
            <h2 className="uppercase font-bold text-lg">cast</h2>
            <ul className="text-black grid grid-cols-3 gap-4">
              {creditData?.cast?.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center gap-4 bg-black text-white p-4"
                >
                  <img
                    className="w-20 h-20 object-cover"
                    src={IMAGE_CONFIG.base_url + "w185" + item.profile_path}
                  />
                  <div>
                    <h3>{item.name}</h3>
                    <p>{item.character}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2>crew</h2>
            {Object.entries(groupedCrew ?? {})?.map(([job, member]) => (
              <div key={job} className="flex flex-col gap-4">
                <h3>{job}</h3>
                <ul className="flex flex-wrap gap-4 text-black">
                  {member.map((item) => (
                    <li
                      key={item.credit_id}
                      className="flex items-center shrink-0 gap-4"
                    >
                      <h3>{item.name}</h3>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4 justify-between">
        <h2 className="text-3xl font-bold uppercase">Crew</h2>
        <div className="relative min-w-72">
          <button
            onClick={() => setIsSelectDepartment(!isSelectDepartment)}
            className="flex items-center gap-4 w-full justify-between bg-white text-black p-4 py-3 font-semibold text-lg"
          >
            {currentDepartment} <ChevronDown />
          </button>
          <ul
            className={`absolute flex flex-col right-0 w-full mt-4 bg-white text-black z-50 ${isSelectDepartment ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
          >
            {Object.keys(groupedCrew ?? {})
              .sort((a, b) => a.localeCompare(b))
              .map((item) => (
                <li key={item} className="w-full">
                  <button
                    className="text-left px-4 py-2 first:pt-4 last:pb-4 w-full"
                    onClick={() => {
                      setCurrentDepartment(item);
                      setIsSelectDepartment(false);
                    }}
                  >
                    {item}
                  </button>
                </li>
              ))}
          </ul>
        </div>
      </div>
      <ul className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,350px),1fr))] gap-4 items-start mt-8">
        {groupedCrew[currentDepartment]?.map((item) => (
          <li
            key={item.credit_id}
            className="bg-neutral-950 border border-neutral-700 flex items-center"
          >
            <div className="w-24 h-24 border-r border-neutral-700 shrink-0">
              {!item.profile_path ? (
                <div className="bg-neutral-900 h-full w-full flex items-center justify-center">
                  <User className="text-neutral-600" />
                </div>
              ) : (
                <img
                  className="object-cover h-full w-full"
                  src={IMAGE_CONFIG.base_url + "w185" + item.profile_path}
                />
              )}
            </div>
            <div className="px-4">
              <h3 className="font-bold">{item.name}</h3>
              <p className="font-light text-sm">{item.job}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
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
      <h3 className="font-bold uppercase tracking-wider text-neutral-400 text-sm">
        {title}
      </h3>

      <p title={data?.toString()} className="font-bold capitalize">
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
          <li key={item.id}>
            {item.author}
            {item.author_details.rating}
          </li>
        ))}
      </ul>
    </section>
  );
};

export default DetailShow;
