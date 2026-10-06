import type { Genre } from "../../types/fetch";
import { useQuery } from "@tanstack/react-query";
import { getTrending } from "../../utils/fetch";
import { useOutletContext } from "react-router";
import HorizontalContainer from "../../components/HorizontalContainer";
import Hero from "../../components/Hero";
import HorizontalCard from "../../components/HorizontalCard";
function Home() {
  const { uniqueGenre } = useOutletContext<{ uniqueGenre: Genre[] }>();
  const { data: trendingTv } = useQuery({
    queryKey: ["trending", "tv"],
    queryFn: () => getTrending("tv"),
    staleTime: Infinity,
  });
  return (
    <div>
      <Hero />
      <div className="bg-gradient-to-b from-black to-black/95 pt-32 flex flex-col gap-4">
        <section className="flex flex-col gap-4 max-w-[90vw] w-full mx-auto mt-16">
          <h2 className="font-bold text-2xl">Trending TV Series</h2>
          <HorizontalContainer>
            {trendingTv?.results.map((item) => (
              <HorizontalCard
                data={item}
                key={item.id}
                uniqueGenre={uniqueGenre}
              />
            ))}
          </HorizontalContainer>
        </section>
      </div>
    </div>
  );
}

export default Home;
