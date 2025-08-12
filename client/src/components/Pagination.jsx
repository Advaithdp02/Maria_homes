import React, { useState, useEffect } from "react";

const Pagination = ({ totalPages, onPageChange }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      onPageChange(currentPage + 1);
    }
  };

  // Determine which page numbers to show
  let visiblePages = [];
  if (isMobile) {
    const start = Math.max(1, currentPage - 1);
    const end = Math.min(totalPages, start + 2);
    for (let i = start; i <= end; i++) {
      visiblePages.push(i);
    }
  } else {
    for (let i = 1; i <= totalPages; i++) {
      visiblePages.push(i);
    }
  }

  return (
    <div className="pagination-controls">
      <button
        className="pagination-btn-prev"
        onClick={handlePrev}
        disabled={currentPage === 1}
      >
        Prev
      </button>

      {visiblePages.map((page) => (
        <button
          key={page}
          className={`pagination-btn ${currentPage === page ? "active" : ""}`}
          onClick={() => {
            setCurrentPage(page);
            onPageChange(page);
          }}
        >
          {page}
        </button>
      ))}

      <button
        className="pagination-btn-next"
        onClick={handleNext}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
