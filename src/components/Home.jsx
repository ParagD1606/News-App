import React, { useState } from "react";
import NewsCard from "./NewsCard";
import { HiSearch, HiArrowLeft, HiArrowRight } from "react-icons/hi"; 

const PAGE_SIZE = 6;

// NEW: Exported categories list
export const categories = [
  "general",
  "business",
  "technology",
  "sports",
  "entertainment",
  "health",
  "science",
];

// Helper function to calculate which page numbers
const getPageNumbersToShow = (currentPage, totalPages) => {
  if (totalPages <= 4) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const windowSize = 2;
  let startPage = Math.max(2, currentPage); // Start at current page if > 1
  let endPage = Math.min(totalPages - 1, currentPage + windowSize - 1);
  
  // If near the end, adjust the window backward
  if (currentPage >= totalPages - 1) {
      startPage = Math.max(2, totalPages - 2);
      endPage = totalPages - 1;
  } 
  
  // If near the start, fix the window forward
  if (currentPage <= 2) {
      startPage = 2;
      endPage = Math.min(totalPages - 1, 3);
  }
  
  const pagesToShow = [];
  pagesToShow.push(1); // Always show first page
  
  if (startPage > 2) pagesToShow.push('...'); // First Ellipsis
  
  for (let i = startPage; i <= endPage; i++) {
      pagesToShow.push(i); // Core pages
  }
  
  if (endPage < totalPages - 1) pagesToShow.push('...'); // Second Ellipsis
  
  if (totalPages > 1 && !pagesToShow.includes(totalPages)) {
      pagesToShow.push(totalPages); // Always show last page
  }

  return [...new Set(pagesToShow)];
};

const Home = ({ 
    articles, 
    bookmarks, 
    handleBookmark, 
    category, 
    setCategory,
    searchQuery, 
    setSearchQuery 
}) => { 
  const [currentPage, setCurrentPage] = useState(1);
  
  // Function to handle search input change
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setCategory(""); // Clear category when searching
    setCurrentPage(1); // NEW: Reset to page 1 on search
  };

  // Function to handle category selection and clear search
  const handleCategoryChange = (cat) => {
    setCategory(cat);
    setSearchQuery(""); // Clear search when switching category
    setCurrentPage(1); // NEW: Reset to page 1 on category change
  };

  // FIX: Removed the strict image filter. 
  // All articles are used, and NewsCard will handle the fallback image.
  const filteredArticles = articles;

  const startIdx = (currentPage - 1) * PAGE_SIZE;
  const currentArticles = filteredArticles.slice(startIdx, startIdx + PAGE_SIZE);

  // Recalculate totalPages based on the (now unfiltered) list size
  const totalPagesAfterFilter = Math.ceil(filteredArticles.length / PAGE_SIZE);

  // Get the optimized array of pages to render
  const pagesToShow = getPageNumbersToShow(currentPage, totalPagesAfterFilter);


  return (
    <div className="max-w-7xl mx-auto"> 
      
      {/* IMPROVED: Combined Header/Control Area for better look and spacing */}
      <div className="px-6 py-6 sm:py-8 border-b border-gray-200 dark:border-gray-700/50 shadow-sm dark:shadow-none">

        {/* 1. Search Bar */}
        <div className="flex justify-center mb-6"> 
          <div className="relative w-full max-w-xl">
            <input
              type="text"
              placeholder="Search news articles by keyword..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full py-3 pl-12 pr-4 border-2 border-blue-500/80 dark:border-blue-600 rounded-full bg-white dark:bg-gray-800 text-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-500/30 transition shadow-lg"
            />
            <HiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-500 dark:text-blue-400" /> 
          </div>
        </div>
        
        {/* 2. Category Buttons */}
        <div className="flex flex-wrap justify-center gap-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 shadow-md
                ${
                  category === cat && searchQuery === ""
                    ? "bg-blue-600 text-white shadow-blue-500/50"
                    : "bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-400 dark:hover:bg-gray-600"
                }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
          
          {/* Indicator for active search */}
          {searchQuery && (
            <div className="flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium bg-green-500 text-white shadow-md">
              <span>Searching for: "{searchQuery}"</span>
              <button 
                onClick={() => setSearchQuery("")} 
                className="text-white font-bold text-lg leading-none"
                title="Clear Search"
              >
                &times;
              </button>
            </div>
          )}
        </div>
      </div>

      {/* News Articles */}
      <main className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentArticles.map((article, idx) => (
          <NewsCard
            key={idx}
            article={article}
            onBookmark={handleBookmark}
            isBookmarked={!!bookmarks.find((a) => a.url === article.url)}
          />
        ))}
        {/* Show message if no articles are found */}
        {filteredArticles.length === 0 && (
            <div className="col-span-full text-center py-10 text-xl text-gray-700 dark:text-gray-300">
                No articles found in this category or search.
            </div>
        )}
      </main>

      {/* PAGINATION - IMPROVED RESPONSIVENESS AND LOGIC */}
      {totalPagesAfterFilter > 1 && (
        <div className="flex justify-center items-center gap-2 p-6">
          {currentPage > 1 && (
            <button
              className="px-3 sm:px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-blue-500 hover:text-white hover:border-blue-500 transition duration-200 shadow-md"
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              <span className="hidden sm:inline">← Prev</span>
              <HiArrowLeft className="w-5 h-5 sm:hidden" /> {/* Show icon on mobile */}
            </button>
          )}

          {pagesToShow.map((pageNumber, idx) => {
            if (pageNumber === '...') {
              return (
                <span key={idx} className="px-1 sm:px-4 py-2 text-gray-500 dark:text-gray-400">
                  ...
                </span>
              );
            }
            const pageNum = parseInt(pageNumber);

            // Conditional rendering for small screens: only show current page number
            const isCurrent = currentPage === pageNum;
            const hideOnMobile = !isCurrent && pageNum !== 1 && pageNum !== totalPagesAfterFilter;

            return (
              <button
                key={idx}
                onClick={() => setCurrentPage(pageNum)}
                // Hide non-current/non-first/non-last pages on mobile (sm:hidden)
                className={`
                  px-3 sm:px-4 py-2 rounded-lg font-semibold transition-all duration-200 shadow-md 
                  ${hideOnMobile ? 'hidden sm:block' : 'inline-block'}
                  ${isCurrent
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/50" // Active style
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-700" // Inactive style
                  }
                `}
              >
                {pageNum}
              </button>
            );
          })}

          {currentPage < totalPagesAfterFilter && (
            <button
              className="px-3 sm:px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-blue-500 hover:text-white hover:border-blue-500 transition duration-200 shadow-md"
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              <span className="hidden sm:inline">Next →</span>
              <HiArrowRight className="w-5 h-5 sm:hidden" /> {/* Show icon on mobile */}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;