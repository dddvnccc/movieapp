import { useRef, useState, useEffect } from "react";
import { type DetailVideo } from "../../types/fetch";
import { ChevronDown } from "lucide-react";

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

export default Extras;
