import React from "react";

interface PaginationProps {
  page: number;
  totalPages: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}

const Pagination: React.FC<PaginationProps> = ({
  page,
  totalPages,
  setPage,
}) => {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 7) {
      // Show all pages if there are few
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      // Always show first, last, and nearby pages
      if (page <= 4) {
        pages.push(1, 2, 3, 4, 5, "...", totalPages);
      } else if (page >= totalPages - 3) {
        pages.push(
          1,
          "...",
          totalPages - 4,
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        pages.push(1, "...", page - 1, page, page + 1, "...", totalPages);
      }
    }

    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div className="home__pagination">
      {/* Page list */}
      <ul>
        {pages.map((num, idx) => (
          <li key={idx}>
            {num === "..." ? (
              <span>…</span>
            ) : (
              <button onClick={() => setPage(Number(num))}>{num}</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Pagination;
