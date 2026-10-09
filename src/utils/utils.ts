import { type Genre } from "../types/fetch";
export function ratingBackground(score: number) {
  return score <= 4 ? "red" : score <= 6 ? "orange" : "green";
}

export function generateRuntime(runtime: number) {
  const h = Number((runtime / 60).toFixed(0));
  const m = runtime % 60;
  if (h === 0) return `${m}m`;
  return `${h}h ${m}m`;
}

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-Gb", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function formatVoteCount(vote_count: string) {
  vote_count = String(vote_count);
  if (vote_count.length === 3) {
    return vote_count.slice(0, 1);
  } else if (vote_count.length === 4) {
    return vote_count.slice(0, 1) + "k+";
  } else if (vote_count.length === 5) {
    return vote_count.slice(0, 2) + "k+";
  }
  return vote_count;
}

export function formatCurrency(amount: number) {
  if (amount === 0) return 0;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export const getGenreList = (genreIds: number[], unique_genre: Genre[]) => {
  return unique_genre.filter((unique) => genreIds?.includes(unique.id));
};
