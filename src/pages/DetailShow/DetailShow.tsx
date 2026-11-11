import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getDetailShow, getShowCredit, getExtra } from "../../utils/fetch";
import type { ShowType } from "../../types/fetch";
import { ArrowUp } from "lucide-react";

import Hero from "../../components/DetailShow/Hero";
import About from "../../components/DetailShow/About";
import MoviesCollection from "../../components/DetailShow/MoviesCollection";
import Cast from "../../components/DetailShow/Cast";
import Crew from "../../components/DetailShow/Crew";
import Recommended from "../../components/DetailShow/Recommended";
import Seasons from "../../components/DetailShow/Seasons";
import Extras from "../../components/DetailShow/Extras";
import Review from "../../components/DetailShow/Review";

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
    backdrop_path,
    genres,
  } = detailData ?? {};
  const isMovie = detailData && "title" in detailData;
  const title = isMovie ? detailData?.title : detailData?.name;

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

  const getCrew = (job: string) => {
    return creditData?.crew.filter((item) => item.job === job);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY >= window.innerHeight);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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
      <Hero
        title={title ?? ""}
        genres={genres ?? []}
        vote_average={Number(vote_average?.toFixed(1)) ?? 0}
        certification={
          (isMovie
            ? moviesRating()?.release_dates[0].certification
            : tvRating()?.rating) ?? "No rating"
        }
        backdrop_path={backdrop_path ?? ""}
      />
      <About
        show_id={show_id!}
        show_type={media_type!}
        getCrew={(job) => getCrew(job)}
      />
      <Cast creditData={creditData} />
      <Crew creditData={creditData} />
      {isMovie && detailData.belongs_to_collection && (
        <MoviesCollection collection={detailData.belongs_to_collection} />
      )}
      {!isMovie && (detailData?.seasons.length ?? 0) > 1 && (
        <Seasons data={detailData?.seasons ?? []} />
      )}
      <Extras data={detailData?.videos?.results} />
      <Recommended data={recommendationData} />
      <Review media_type={media_type!} show_id={detailData?.id!} />
    </div>
  );
}

export default DetailShow;
