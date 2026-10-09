export type Error = {
  status_code: number;
  status_message: string;
  success: boolean;
};

export type ShowType = "movie" | "tv";
export type MediaType = ShowType | "person";

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

export interface SearchResponse {
  page: number;
  results: (TrendingMovie | TrendingTv | Person)[];
  total_pages: number;
  total_results: number;
}

export interface PersonResponse {
  page: number;
  results: Person[];
  total_pages: number;
  total_results: number;
}

export interface Person {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string;
  known_for: KnownFor[];
  media_type?: "person";
}

export interface KnownFor {
  adult: boolean;
  backdrop_path: string;
  id: number;
  title: string;
  original_language: string;
  original_title: string;
  overview: string;
  poster_path: string;
  media_type: string;
  genre_ids: number[];
  popularity: number;
  release_date: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export interface DetailShow {
  adult: boolean;
  backdrop_path: string | null;
  genres: Genre[];
  id: number;
  origin_country: string[];
  homepage: string;
  original_language: string;
  overview: string | null;
  popularity: number;
  poster_path: string;
  production_companies: ProductionCompany[];
  production_countries: ProductionCountry[];
  tagline: string | null;
  status: string;
  vote_average: number;
  vote_count: number;
  spoken_languages: SpokenLanguage[];
  videos: VideosResult | null;
}

interface VideosResult {
  results: DetailVideo[];
}
export interface DetailMovie extends DetailShow {
  belongs_to_collection: Collection[];
  budget: number;
  imdb_id: string;
  original_title: string;
  release_date: string;
  revenue: number;
  runtime: number;
  title: string;
  video: boolean;
}

export interface DetailTv extends DetailShow {
  created_by: CreatedBy[];
  episode_run_time: number[];
  first_air_date: string;
  in_production: boolean;
  languages: string[];
  last_air_date: string;
  last_episode_to_air: LastEpisode[];
  name: string;
  next_episode_to_air: NextEpisodeToAir | null;
  networks: Network[];
  number_of_episodes: number;
  number_of_seasons: number;
  original_name: string;
  seasons: Season[];
  type: string;
}

export interface Season {
  air_date: string;
  episode_count: number;
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  season_number: number;
  vote_average: number;
}

export interface Network {
  id: number;
  logo_path: string;
  name: string;
  origin_country: string;
}

export interface LastEpisode {
  id: number;
  name: string;
  overview: string;
  vote_average: number;
  vote_count: number;
  air_date: string;
  episode_number: number;
  production_code: string;
  runtime: number;
  season_number: number;
  show_id: number;
  still_path: string;
}

export interface CreatedBy {
  id: number;
  credit_id: string;
  name: string;
  gender: number;
  profile_path: string;
}

export interface SpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

export interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}

export interface ProductionCompany {
  id: number;
  logo_path: string;
  name: string;
  origin_country: string;
}

export interface Collection {
  id: number;
  name: string;
  poster_path: string;
  backdrop_path: string;
}

export interface NextEpisodeToAir {
  air_date: string;
  episode_number: number;
  episode_type: string;
  id: number;
  name: string;
  overview: string;
  production_code: string;
  runtime: number | null;
  season_number: number;
  show_id: number;
  still_path: string;
  vote_average: number;
  vote_count: number;
}

export interface DetailVideo {
  id: string;
  iso_639_1: string;
  iso_3166_1: string;
  key: string;
  name: string;
  official: boolean;
  published_at: string;
  site: string;
  size: number;
  type: string;
}

export interface ShowCredit {
id
:number
cast: Cast[]
crew: Crew[]
}

export interface Cast {
adult
:boolean
gender
:number
id
:number
known_for_department
:string
name
:string
original_name
:string
popularity
:number
profile_path
:string
cast_id
:number
character
:string
credit_id
:string
order
:number

}

export interface Crew {
adult
:boolean

gender
:number
id
:number
known_for_department
:string
name
:string
original_name
:string
popularity
:number
profile_path
:string
credit_id
:string
department
:string
job
:string
}