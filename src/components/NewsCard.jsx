import React from "react";
import { HiOutlineBookmark, HiBookmark } from "react-icons/hi";

const NewsCard = ({ article, onBookmark, isBookmarked }) => {
  return (
    // UPDATED: Added shadow-lg, shadow-blue-500/10, hover:shadow-xl, 
    // and dark:border for better contrast and effect.
    <div className="bg-white dark:bg-gray-800 p-5 rounded-xl 
                    shadow-lg shadow-gray-300/50 dark:shadow-gray-900/50 
                    border border-gray-200 dark:border-gray-700
                    flex flex-col space-y-3 transition-all duration-300 
                    hover:shadow-xl hover:shadow-blue-500/20 dark:hover:shadow-blue-800/20">
      <img
        src={article.urlToImage || "/fallback.jpg"}
        alt={article.title}
        className="w-full h-44 object-cover rounded-lg" // Increased height slightly
      />
      <h3 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-2">
        {article.title}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 flex-grow">
        {article.description || "No description available for this article."}
      </p>

      <div className="flex justify-between items-center pt-2 border-t border-gray-100 dark:border-gray-700/50">
        <a
          href={article.url}
          target="_blank"
          rel="noreferrer"
          className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline transition"
        >
          Read Full Article →
        </a>

        <div onClick={() => onBookmark(article)} className="cursor-pointer p-1" title={isBookmarked ? "Remove Bookmark" : "Add Bookmark"}>
          {isBookmarked ? (
            // Use a stronger color for the active bookmark icon
            <HiBookmark className="w-7 h-7 text-yellow-500 hover:text-yellow-400 transition transform hover:scale-110" />
          ) : (
            <HiOutlineBookmark className="w-7 h-7 text-gray-500 dark:text-gray-300 hover:text-yellow-500 transition transform hover:scale-110" />
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsCard;