import React from "react";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getDetailShow, getShowCredit } from "../../utils/fetch";
import type { ShowType } from "../../types/fetch";
import { IMAGE_CONFIG } from "../../utils/config";
import { formatDate, generateRuntime } from "../../utils/utils";
import {
  ArrowBigDown,
  Plus,
  Star,
  User,
  UserCircle,
  UserCircle2,
} from "lucide-react";

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
          <h1 className="text-[4rem] lg:text-[6rem] font-bold uppercase leading-none max-w-[60%]">
            {title}
          </h1>
          <p className="font-bold">{releaseDate?.split("-")[0]}</p>

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
          src={IMAGE_CONFIG.base_url + "w1280" + backdrop_path}
        />
      </div>
      <div id="about" className="bg-black pt-32 px-12">
        <h2 className="text-3xl font-bold uppercase">About</h2>
        <div className="flex items-start gap-12 mt-8">
          <img
            className="w-[250px] rounded-lg"
            src={IMAGE_CONFIG.base_url + "w342" + poster_path}
          />
          <div className="grid grid-cols-2 gap-4">
            <p className="text-pretty leading-relaxed">{overview}</p>
            <div className="">
              <div className="flex items-start gap-4">
                <p className="uppercase font-semibold">release date</p>
                <p className="font-bold">{releaseDate}</p>
              </div>
              <div className="flex items-start gap-2">
                <p>duration</p>
                <p>{isMovie && detailData?.runtime}</p>
              </div>
              {isMovie && (
                <div className="flex items-start gap-2">
                  <p>budget</p>
                  <p>{isMovie && detailData?.budget}</p>
                </div>
              )}
              {isMovie && (
                <div className="flex items-start gap-2">
                  <p>revenue</p>
                  <p>{isMovie && detailData?.revenue}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="px-12 pt-12 bg-black">
        <h2 className="text-3xl font-bold uppercase">Cast</h2>
        <ul className="flex gap-8 items-start overflow-x-auto mt-8">
          {creditData?.cast.slice(0, 10).map((item) => (
            <li key={item.cast_id} className="min-w-[150px]">
              <img className="h-[200px] rounded-lg w-full object-cover" src={IMAGE_CONFIG.base_url + "w185" + item.profile_path} />
              <h3 className="truncate">{item.name}</h3>
            </li>
          ))}
        </ul>
      </div>

      <div className="px-12 pt-12 bg-black">
          <h2 className="text-3xl font-bold uppercase">you may also like</h2>
              <ul className="flex gap-8 items-start overflow-x-auto mt-8">
                {}
          </ul>
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
