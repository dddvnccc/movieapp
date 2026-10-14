import axios from "axios";
const AUTH_KEY = import.meta.env.VITE_TMDB_AUTH_KEY;
import type {
  TrendingResponse,
  Genre,
  SearchResponse,
  DetailMovie,
  DetailTv,
  ShowType,
  ShowCredit,
  DetailCollection,
  Country,
} from "../types/fetch";

const headers = {
  accept: "application/json",
  Authorization: `Bearer ${AUTH_KEY}`,
};

export async function getTrending(
  type: ShowType | "all" = "all",
): Promise<TrendingResponse> {
  const options = {
    method: "GET",
    url: `https://api.themoviedb.org/3/trending/${type}/day`,
    params: { language: "en-US" },
    headers,
  };

  try {
    const { data } = await axios.request<TrendingResponse>(options);
    console.log(data);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log(error.status);
      console.error(error.response?.data);
    } else {
      console.error(error);
    }
    throw error;
  }
}

export async function getGenre(
  media_type: ShowType,
): Promise<{ genres: Genre[] }> {
  const options = {
    method: "GET",
    url: `https://api.themoviedb.org/3/genre/${media_type}/list`,
    params: { language: "en" },
    headers,
  };

  try {
    const { data } = await axios.request<{ genres: Genre[] }>(options);
    console.log(data);
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function searchShow(query: string): Promise<SearchResponse> {
  const options = {
    method: "GET",
    url: "https://api.themoviedb.org/3/search/multi",
    params: { query, include_adult: "false", language: "en-US", page: "1" },
    headers,
  };

  try {
    const { data } = await axios.request<SearchResponse>(options);
    console.log(data);
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getDetailShow(
  media_type: ShowType,
  show_id: number,
): Promise<DetailMovie | DetailTv> {
  const options = {
    method: "GET",
    url: `https://api.themoviedb.org/3/${media_type}/${show_id}?append_to_response=videos,${media_type === "movie" ? "release_dates" : "content_ratings"}`,
    params: { language: "en-US" },
    headers,
  };

  try {
    const { data } = await axios.request(options);
    console.log(data);
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getShowCredit(
  show_type: ShowType,
  show_id: number,
): Promise<ShowCredit> {
  const options = {
    method: "GET",
    url: `https://api.themoviedb.org/3/${show_type}/${show_id}/credits`,
    params: { language: "en-US" },
    headers,
  };

  try {
    const { data } = await axios.request<ShowCredit>(options);
    console.log(data);
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getExtra(
  category: "similar" | "recommendations",
  show_type: ShowType,
  show_id: number,
): Promise<TrendingResponse> {
  const options = {
    method: "GET",
    url: `https://api.themoviedb.org/3/${show_type}/${show_id}/${category}`,
    params: { language: "en-US", page: "1" },
    headers,
  };

  try {
    const { data } = await axios.request<TrendingResponse>(options);
    console.log(data);
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getCollectionDetail(
  collection_id: number,
): Promise<DetailCollection> {
  const options = {
    method: "GET",
    url: `https://api.themoviedb.org/3/collection/${collection_id}`,
    params: { language: "en-US" },
    headers,
  };

  try {
    const { data } = await axios.request<DetailCollection>(options);
    console.log(data);
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getShowList(
  show_type: ShowType,
  category: string,
  page: number | string,
): Promise<TrendingResponse> {
  const options = {
    method: "GET",
    url: `https://api.themoviedb.org/3/${show_type}/${show_type === "tv" && category === "now_playing" ? "airing_today" : show_type === "tv" && category === "upcoming" ? "on_the_air" : category}`,
    params: { language: "en-US", page, region: "us" },
    headers,
  };

  try {
    const { data } = await axios.request<TrendingResponse>(options);
    console.log(data);
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getAllShow(
  show_type: ShowType,
  page: number | string,
  genre?: string | number,
  country?: string,
  year?: string | number,
): Promise<TrendingResponse> {
  let voteCount;
  if (show_type === "movie") {
    if (genre || country || year) {
      voteCount = "2";
    } else {
      voteCount = "10";
    }
  } else if (show_type === "tv") {
    if (genre || country || year) {
      voteCount = "1";
    } else {
      voteCount = "5";
    }
  }
  const options = {
    method: "GET",
    url: `https://api.themoviedb.org/3/discover/${show_type}`,
    params: {
      include_adult: "false",
      include_video: "false",
      language: "en-US",
      page,
      [show_type === 'movie' ? 'year' : 'first_air_date_year'] : year,
      ...(country && { with_origin_country: country }),
      ...(genre && { with_genres: genre }),
      [show_type === "movie"
        ? "primary_release_date.lte"
        : "first_air_date.lte"]: new Date().toISOString().split("T")[0],
      sort_by:
        show_type === "movie"
          ? "primary_release_date.desc"
          : "first_air_date.desc",
      "vote_average.gte": "1",
      "vote_count.gte": voteCount,
    },
    headers,
  };

  try {
    const { data } = await axios.request<TrendingResponse>(options);
    console.log(data);
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getAllCountry(): Promise<Country[]> {
  const options = {
    method: "GET",
    url: "https://api.themoviedb.org/3/configuration/countries",
    params: { language: "en-US" },
    headers,
  };

  try {
    const { data } = await axios.request<Country[]>(options);
    console.log(data);
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
