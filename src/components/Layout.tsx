import { Outlet } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getGenre } from "../utils/fetch";
import Navbar from "./Navbar";
export const Layout = () => {
  const { data: movieGenre } = useQuery({
    queryKey: ["genre", "movie"],
    queryFn: () => getGenre("movie"),
    staleTime: Infinity,
  });
  const { data: tvGenre } = useQuery({
    queryKey: ["genre", "tv"],
    queryFn: () => getGenre("tv"),
    staleTime: Infinity,
  });

  const allGenre = [...(movieGenre?.genres ?? []), ...(tvGenre?.genres ?? [])];
  const uniqueGenre = Array.from(
    new Map(allGenre.map((item) => [item.id, item])).values(),
  );

  return (
    <div
      style={{background: 'red'}}
    >
      <Navbar />
      <main>
        <Outlet context={{ uniqueGenre }} />
      </main>
    </div>
  );
};

export default Layout;
