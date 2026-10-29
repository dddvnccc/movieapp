import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  totalPage: number;
  updatePage: (page: number) => void;
}

const generatePage = (start: number, end: number) => {
  const result = [];
  for (let i = start; i <= end; i++) {
    result.push(i);
  }
  return result;
};

function Pagination({ page, totalPage, updatePage }: PaginationProps) {
  const start = Math.max(1, page - 2);
  const end = Math.min(totalPage, page + 2);
  return (
    <div className="flex items-center gap-4">
      <button
        disabled={page === 1}
        onClick={() => updatePage(page - 1)}
        className={`size-12 font-semibold text-lg disabled:cursor-not-allowed disabled:opacity-50 bg-white text-black flex items-center justify-center`}
      >
        <ChevronLeft />
      </button>
      {generatePage(start, end).map((item) => (
        <button
          onClick={() => updatePage(item)}
          key={item}
          className={`size-12 font-semibold border text-lg ${page === item ? "bg-black text-white border-white/20" : "bg-white text-black border-transparent"}`}
        >
          {item}
        </button>
      ))}
      <button
        onClick={() => updatePage(page + 1)}
        className={`size-12 font-semibold text-lg bg-white text-black flex items-center justify-center`}
      >
        <ChevronRight />
      </button>
    </div>
  );
}

export default Pagination;
