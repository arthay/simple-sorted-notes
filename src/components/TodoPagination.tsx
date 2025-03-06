
import React from 'react';

interface TodoPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const TodoPagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange 
}: TodoPaginationProps) => {
  if (totalPages <= 1) return null;

  const pageNumbers = [];
  
  // Create an array of page numbers to display
  if (totalPages <= 5) {
    // If 5 or fewer pages, show all
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
  } else {
    // Always show first page
    pageNumbers.push(1);
    
    // Calculate middle pages to show
    if (currentPage <= 3) {
      // If near the start, show first 5 pages
      pageNumbers.push(2, 3, 4);
    } else if (currentPage >= totalPages - 2) {
      // If near the end, show last 5 pages
      pageNumbers.push(totalPages - 3, totalPages - 2, totalPages - 1);
    } else {
      // Show current page and surrounding pages
      pageNumbers.push(currentPage - 1, currentPage, currentPage + 1);
    }
    
    // Always show last page
    if (!pageNumbers.includes(totalPages)) {
      if (!pageNumbers.includes(totalPages - 1)) {
        pageNumbers.push("...");
      }
      pageNumbers.push(totalPages);
    }
    
    // Add ellipsis after first page if needed
    if (pageNumbers[1] !== 2 && pageNumbers[1] !== "...") {
      pageNumbers.splice(1, 0, "...");
    }
  }

  return (
    <div className="flex justify-center items-center space-x-2 mt-6 animate-fade-in">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-3 py-1.5 rounded-md text-sm font-medium ${
          currentPage === 1
            ? 'text-gray-400 cursor-not-allowed'
            : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors'
        }`}
        aria-label="Previous page"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
      </button>
      
      {pageNumbers.map((page, index) => (
        <button
          key={index}
          onClick={() => typeof page === 'number' && onPageChange(page)}
          disabled={page === "..."}
          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
            currentPage === page
              ? 'bg-primary text-primary-foreground'
              : page === "..."
              ? 'text-gray-500 cursor-default'
              : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
          }`}
        >
          {page}
        </button>
      ))}
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-3 py-1.5 rounded-md text-sm font-medium ${
          currentPage === totalPages
            ? 'text-gray-400 cursor-not-allowed'
            : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors'
        }`}
        aria-label="Next page"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
      </button>
    </div>
  );
};

export default TodoPagination;
