import axios from "axios";
const AUTH_KEY = import.meta.env.VITE_TMDB_AUTH_KEY;
import type {
  MediaType,
  ShowListsType,
  DetailMovie,
  DetailTv,
  Credit,
} from "./types";

import type { TrendingResponse, Genre } from "../types/fetch";

const headers = {
  accept: "application/json",
  Authorization: `Bearer ${AUTH_KEY}`,
};

export async function getTrending(
  type: MediaType | "all" = "all",
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
  media_type: MediaType,
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

export async function getShowLists(
  media_type: MediaType,
  list_type: ShowListsType,
  page: number,
): Promise<ResponseData> {
  let endpoint: string;
  if (list_type === "now_playing") {
    endpoint = media_type === "movie" ? "now_playing" : "airing_today";
  } else if (list_type === "upcoming") {
    endpoint = media_type === "movie" ? "upcoming" : "on_the_air";
  } else {
    endpoint = list_type;
  }
  const options = {
    method: "GET",
    url: `https://api.themoviedb.org/3/${media_type}/${endpoint}`,
    params: { language: "en-US", page, region: "us" },
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${AUTH_KEY}`,
    },
  };

  try {
    const { data } = await axios.request<ResponseData>(options);
    console.log(data);
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getShow(
  media_type: MediaType,
  page: number,
): Promise<ResponseData> {
  const options = {
    method: "GET",
    url: `https://api.themoviedb.org/3/discover/${media_type}`,
    params: {
      include_adult: "false",
      include_video: "false",
      language: "en-US",
      page,
      sort_by: "popularity.desc",
    },
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${AUTH_KEY}`,
    },
  };

  try {
    const { data } = await axios.request<ResponseData>(options);
    console.log(data);
    return data;
  } catch (error) {
    console.error(error);
    throw new Error("asdas");
  }
}

export async function discoverShow(
  media_type: MediaType,
): Promise<ResponseData> {
  const options = {
    method: "GET",
    url: `https://api.themoviedb.org/3/discover/${media_type}`,
    params: {
      include_adult: "false",
      include_video: "false",
      language: "en-US",
      page: "1",
      sort_by: "popularity.desc",
    },
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${AUTH_KEY}`,
    },
  };

  try {
    const { data } = await axios.request<ResponseData>(options);
    console.log(data);
    return data;
  } catch (error) {
    console.error(error);
    throw new Error("error");
  }
}

export async function getDetailShow(
  media_type: MediaType,
  show_id: number,
): Promise<DetailMovie | DetailTv> {
  const options = {
    method: "GET",
    url: `https://api.themoviedb.org/3/${media_type}/${show_id}`,
    params: { language: "en-US" },
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${AUTH_KEY}`,
    },
  };

  try {
    const { data } = await axios.request<DetailMovie | DetailTv>(options);
    console.log(data);
    return data;
  } catch (error) {
    console.error(error);
    throw new Error("sdd");
  }
}

export async function getCredit(
  media_type: MediaType,
  show_id: number,
): Promise<Credit> {
  const options = {
    method: "GET",
    url: `https://api.themoviedb.org/3/${media_type}/${show_id}/credits`,
    params: { language: "en-US" },
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${AUTH_KEY}`,
    },
  };

  try {
    const { data } = await axios.request<Credit>(options);
    console.log(data);
    return data;
  } catch (error) {
    console.error(error);
    throw new Error("Error");
  }
}

export async function getRecommendation(
  media_type: MediaType,
  show_id: number,
): Promise<ResponseData> {
  const options = {
    method: "GET",
    url: `https://api.themoviedb.org/3/${media_type}/${show_id}/recommendations`,
    params: { language: "en-US", page: "1" },
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${AUTH_KEY}`,
    },
  };

  try {
    const { data } = await axios.request<ResponseData>(options);
    console.log(data);
    return data;
  } catch (error) {
    console.error(error);
    throw new Error("");
  }
}
