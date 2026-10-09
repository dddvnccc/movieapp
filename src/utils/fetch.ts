import axios from "axios";
const AUTH_KEY = import.meta.env.VITE_TMDB_AUTH_KEY;
import type {
  MediaType,
  TrendingResponse,
  Genre,
  SearchResponse,
  DetailMovie,
  DetailTv,
  ShowType,
  ShowCredit,
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
    url: `https://api.themoviedb.org/3/${media_type}/${show_id}?append_to_response=videos`,
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

export async function getShowCredit(show_type: ShowType, show_id: number):Promise<ShowCredit> {
  const options = {
    method: "GET",
    url: `https://api.themoviedb.org/3/${show_type}/${show_id}/credits`,
    params: { language: "en-US" },
    headers,
  };

  try {
    const { data } = await axios.request<ShowCredit>(options);
    console.log(data);
    return data
  } catch (error) {
    console.error(error);
    throw error
  }
}
