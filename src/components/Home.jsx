import React, { useEffect, useState } from "react";
import NewsCard from "./NewsCard";
import { fetchTopHeadlines } from "../services/newsApi";
// Removed: import Navbar from "./Navbar";

const PAGE_SIZE = 6;

// UPDATED: Destructure bookmarks and handleBookmark from props
const Home = ({ theme, toggleTheme, bookmarks, handleBookmark, searchQuery, setSearchQuery }) => { 
  const [articles, setArticles] = useState([]);
  // Removed bookmarks state initialization
  const [category, setCategory] = useState("general");
  const [currentPage, setCurrentPage] = useState(1);
  // Removed searchQuery and setSearchQuery state initialization (now passed from App)

  const categories = [
    "general",
    "business",
    "technology",
    "sports",
    "entertainment",
    "health",
    "science",
  ];

  useEffect(() => {
    const loadNews = async () => {
      // Pass the search query to fetchTopHeadlines
      const data = await fetchTopHeadlines(category, searchQuery); 
      setArticles(data);
      setCurrentPage(1);
    };
    loadNews();
  }, [category, searchQuery]); 

  // Function to handle category selection and clear search
  const handleCategoryChange = (cat) => {
    setCategory(cat);
    setSearchQuery(""); // Clear search when switching category
  };

  // Removed handleBookmark function

  const totalPages = Math.ceil(articles.length / PAGE_SIZE);
  const startIdx = (currentPage - 1) * PAGE_SIZE;
  const currentArticles = articles.slice(startIdx, startIdx + PAGE_SIZE);

  return (
    // Removed the main wrapper div and Navbar from Home.jsx
    <div className="max-w-7xl mx-auto"> 

      {/* Category Buttons */}
      <div className="flex flex-wrap justify-center gap-3 px-6 py-3">
        {categories.map((cat) => (
          <button
            key={cat}
            // Use handleCategoryChange
            onClick={() => handleCategoryChange(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
              ${
                category === cat && searchQuery === "" // Highlight only if not searching
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-400 dark:hover:bg-gray-600"
              }`}
            // Disable buttons if a search query is active
            disabled={searchQuery !== ""}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
        {/* ADDED: Indicator for active search */}
        {searchQuery && (
          <div className="flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium bg-green-500 text-white shadow-lg">
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

      {/* News Articles */}
      <main className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentArticles.map((article, idx) => (
          <NewsCard
            key={idx}
            article={article}
            onBookmark={handleBookmark}
            // Check if article is in the bookmarks array passed via props
            isBookmarked={!!bookmarks.find((a) => a.url === article.url)}
          />
        ))}
      </main>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 p-6">
          {currentPage > 1 && (
            <button
              className="px-3 py-1 rounded bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-400 dark:hover:bg-gray-600 transition"
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              Prev
            </button>
          )}

          {[...Array(totalPages)].map((_, idx) => (
            <button
              key={idx}
              className={`px-3 py-1 rounded font-medium transition-all duration-200 ${
                currentPage === idx + 1
                  ? "bg-blue-600 text-white"
                  : "bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-blue-500 hover:text-white"
              }`}
              onClick={() => setCurrentPage(idx + 1)}
            >
              {idx + 1}
            </button>
          ))}

          {currentPage < totalPages && (
            <button
              className="px-3 py-1 rounded bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-400 dark:hover:bg-gray-600 transition"
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Next
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;