import { useRef, useState, useEffect } from "react";
import { type TrendingResponse } from "../../types/fetch";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { IMAGE_CONFIG } from "../../utils/config";
import { Link } from "react-router";

const Recommended = ({
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

export default Recommended;
