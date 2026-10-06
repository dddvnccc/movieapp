export type Error = {
  status_code: number;
  status_message: string;
  success: boolean;
};

export type MediaType = "movie" | "tv";

export interface Dates {
  maximum: string;
  minimum: string;
}

export interface Genre {
  id: number;
  name: string;
}

export interface TrendingResponse {
  page: number;
  results: (TrendingMovie | TrendingTv)[];
  total_pages: number;
  total_results: number;
}

export interface BaseResults {
  adult: boolean;
  backdrop_path: string | null;
  id: number;
  original_language: string;
  overview: string;
  poster_path: string | null;
  genre_ids: number[] | [];
  popularity: number;
  vote_average: number;
  vote_count: number;
}

export interface TrendingTv extends BaseResults {
  media_type: "tv";
  name: string;
  original_name: string;
  first_air_date: string;
  origin_country: string[];
}

export interface TrendingMovie extends BaseResults {
  media_type: "movie";
  title: string;
  release_date: string;
  original_title: string;
  video: boolean;
}
