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
      {generatePage(start, end).map((item) => (
        <button
          style={{ background: page === item ? "red" : "green" }}
          onClick={() => updatePage(item)}
          key={item}
          className="size-8"
        >
          {item}
        </button>
      ))}
      , {totalPage}
    </div>
  );
}

export default Pagination;
