import React, { useEffect, useState } from "react";
import type { ShowType } from "../types/fetch";
import { getAllCountry, getGenre } from "../utils/fetch";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown } from "lucide-react";

interface FilterModalProps {
  handleClose: () => void;
  isModalOpen: boolean;
  showType: ShowType | undefined;
  setFilter: React.Dispatch<
    React.SetStateAction<Record<string, string | number>>
  >;
  filter: Record<string, string | number>;
  setSearchParams: (
    updater: (params: URLSearchParams) => URLSearchParams,
  ) => void;
  searchParams?: URLSearchParams;
}

function FilterModal({
  handleClose,
  isModalOpen,
  showType,
  setFilter,
  setSearchParams,
  filter,
  searchParams,
}: FilterModalProps) {
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [countryVal, setCountryVal] = useState("");
  const { data: genreData } = useQuery({
    queryKey: ["genre", showType],
    queryFn: () => getGenre(showType!),
    staleTime: Infinity,
  });

  const { data: countryData } = useQuery({
    queryKey: ["country"],
    queryFn: getAllCountry,
    staleTime: Infinity,
  });

  const handleClick = (key: string, val: string | number) => {
    setFilter((prev) => ({ ...prev, [key]: val }));
  };

  const generateYear = () => {
    const end = new Date().getFullYear();
    const start = 2000;
    const result = [];
    for (let i = start; i <= end; i++) {
      result.push(i);
    }
    return result;
  };

  useEffect(() => {
    isModalOpen &&
      setFilter({
        year: String(searchParams?.get("year") ?? ""),
        genre: String(searchParams?.get("genre") ?? ""),
        country: String(searchParams?.get("country") ?? ""),
      });
  }, [isModalOpen]);

  return (
    <div
      onClick={handleClose}
      style={{
        opacity: isModalOpen ? "1" : "0",
        pointerEvents: isModalOpen ? "auto" : "none",
      }}
      className="fixed inset-0 flex justify-end bg-black/90 z-50 transition-all duration-300"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          opacity: isModalOpen ? "1" : "0",
          pointerEvents: isModalOpen ? "auto" : "none",
          transform: `translateX(${isModalOpen ? "0" : "1rem"})`,
          visibility: isModalOpen ? "visible" : "hidden",
        }}
        className="delay-100 bg-black border-l border-white/20 transition-all duration-400 p-8 px-12 w-2/5 overflow-y-auto"
      >
        <h2 className="font-bold text-3xl">Filter</h2>
        <div className="flex flex-col gap-8 mt-12">
          <section>
            <h3 className="font-semibold text-xl">Genre</h3>
            <ul className="flex items-center gap-3 flex-wrap">
              <li>
                <button
                  style={{
                    background:
                      filter && filter.genre === ""
                        ? "rgba(250,250,250,.8)"
                        : "rgba(250,250,250,0)",
                  }}
                  onClick={() => handleClick("genre", "")}
                  className="p-2 px-3 border border-white/20"
                >
                  All Genre
                </button>
              </li>

              {genreData?.genres.map((item) => (
                <li key={item.id}>
                  <button
                    style={{
                      background:
                        String(filter.genre) === String(item.id)
                          ? "rgba(250,250,250,.8)"
                          : "rgba(250,250,250,0)",
                    }}
                    onClick={() => handleClick("genre", item.id)}
                    className="p-2 px-3 border border-white/20"
                  >
                    {item.name}
                  </button>
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h4 className="font-semibold text-xl">country</h4>
            <button
              onClick={() => setIsCountryOpen(!isCountryOpen)}
              className="p-4 px-6 uppercase bg-white flex items-center gap-4 border-b border-black justify-between font-semibold text-black w-full"
            >
              <span>
                {countryData?.find((item) => item.iso_3166_1 === filter.country)
                  ?.english_name ?? "All Country"}
              </span>
              <ChevronDown strokeWidth={3} />
            </button>
            <div
              style={{ maxHeight: isCountryOpen ? "300px" : "0" }}
              className="transition-all duration-300 bg-white text-black overflow-hidden"
            >
              <input
                value={countryVal}
                onChange={(e) => setCountryVal(e.target.value)}
                type="text"
                placeholder="country name"
                className="w-full p-2 px-6"
              />
              <ul className="scroll-smooth flex flex-col items-start overflow-y-auto max-h-[300px]">
                <li className="">
                  <button
                    style={{
                      background:
                        filter.country === ""
                          ? "rgba(250,250,250,.8)"
                          : "rgba(250,250,250,.2)",
                    }}
                    onClick={() => handleClick("country", "")}
                    className="p-2 px-6 w-full font-semibold"
                  >
                    All Country
                  </button>
                </li>
                {(!countryVal
                  ? countryData
                  : countryData?.filter((item) =>
                      item.english_name
                        .toLocaleLowerCase()
                        .startsWith(countryVal.toLocaleLowerCase()),
                    )
                )?.map((item) => (
                  <li className="w-full" key={item.iso_3166_1}>
                    <button
                      style={{
                        background:
                          filter.country === item.iso_3166_1
                            ? "rgba(250,250,250,.8)"
                            : "rgba(250,250,250,.6)",
                      }}
                      onClick={() => {
                        handleClick("country", item.iso_3166_1);
                        setIsCountryOpen(false);
                      }}
                      className="p-2 w-full px-6 font-semibold text-left"
                    >
                      {item.english_name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </section>
          <section className="">
            <h4 className="font-bold text-xl">Year</h4>
            <ul className="grid grid-cols-[repeat(auto-fill,_minmax(100px,_1fr))] gap-2">
              <li className="w-full">
                <button
                  style={{
                    background: String(filter.year) === "" ? "red" : "green",
                  }}
                  onClick={() => handleClick("year", "")}
                  className="p-2 w-full px-4 border border-white/20"
                >
                  All year
                </button>
              </li>
              {generateYear()
                .reverse()
                .map((item) => (
                  <li className="w-full" key={item}>
                    <button
                      style={{
                        background:
                          String(filter.year) === String(item)
                            ? "red"
                            : "green",
                      }}
                      onClick={() => handleClick("year", String(item))}
                      className="p-2 w-full px-4 border border-white/20"
                    >
                      {item}
                    </button>
                  </li>
                ))}
            </ul>
          </section>
          <div className="mt-auto absolute bottom-8 flex items-start gap-4">
            <button
              className=""
              onClick={() => {
                setSearchParams((params) => {
                  for (const [key, value] of Object.entries(filter)) {
                    if (!value) {
                      params.delete(key);
                      continue;
                    }
                    params.set(key, String(value));
                  }
                  params.set("page", "1");
                  return params;
                });
                handleClose();
              }}
            >
              save
            </button>
            <button
              onClick={() => {
                setFilter({});
                setSearchParams(() => new URLSearchParams());
              }}
            >
              clear filter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FilterModal;
