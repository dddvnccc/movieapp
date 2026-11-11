import {useState} from 'react'
import {type Season } from '../../types/fetch';
import { IMAGE_CONFIG } from '../../utils/config';

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

export default Seasons