import React, { useEffect, useState } from "react";
import Aurora from "../Usages/Aurora.jsx";
import NewsCard from "./NewsCard";
import Navbar from "./Navbar";
import { fetchTopHeadlines } from "../services/newsApi";

const PAGE_SIZE = 6;

const Home = ({ theme, toggleTheme }) => {
  const [articles, setArticles] = useState([]);
  const [bookmarks, setBookmarks] = useState(() =>
    JSON.parse(localStorage.getItem("bookmarks") || "[]")
  );
  const [category, setCategory] = useState("general");
  const [currentPage, setCurrentPage] = useState(1);

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
      const data = await fetchTopHeadlines(category);
      setArticles(data);
      setCurrentPage(1);
    };
    loadNews();
  }, [category]);

  const handleBookmark = (article) => {
    let updated;
    if (bookmarks.find((a) => a.url === article.url)) {
      updated = bookmarks.filter((a) => a.url !== article.url);
    } else {
      updated = [...bookmarks, article];
    }
    setBookmarks(updated);
    localStorage.setItem("bookmarks", JSON.stringify(updated));
  };

  const totalPages = Math.ceil(articles.length / PAGE_SIZE);
  const startIdx = (currentPage - 1) * PAGE_SIZE;
  const currentArticles = articles.slice(startIdx, startIdx + PAGE_SIZE);

  return (
    <div className="relative w-full min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300 overflow-x-hidden">
      

      {/* Navbar */}
      <Navbar theme={theme} toggleTheme={toggleTheme} />

      {/* Spacer for fixed navbar */}
      <div className="h-24"></div>

      {/* Category Buttons */}
      <div className="flex flex-wrap justify-center gap-3 px-6 py-3">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
              ${
                category === cat
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-400 dark:hover:bg-gray-600"
              }`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
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
