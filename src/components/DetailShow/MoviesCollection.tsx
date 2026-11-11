import React from "react";
import { IMAGE_CONFIG } from "../../utils/config";
import { type Collection } from "../../types/fetch";
import { useQuery } from "@tanstack/react-query";
import { getCollectionDetail } from "../../utils/fetch";

const MoviesCollection = ({ collection }: { collection: Collection }) => {
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

export default MoviesCollection;
