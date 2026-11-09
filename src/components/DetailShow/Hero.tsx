import React from "react";
import { Link } from "react-router";
import { X, ArrowBigDown } from "lucide-react";
import { IMAGE_CONFIG } from "../../utils/config";
import { type Genre } from "../../types/fetch";

interface Hero {
  title: string;
  genres: Genre[];
  vote_average: number;
  certification: string;
  backdrop_path:string
}

function Hero({ title, genres, vote_average, certification, backdrop_path }: Hero) {
  const scrollToSection = () => {
    document
      .querySelector("#about")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  return (
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
            {certification}
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
  );
}

export default Hero;
