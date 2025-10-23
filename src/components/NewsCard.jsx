import React from "react";
import { HiOutlineBookmark, HiBookmark } from "react-icons/hi";

const NewsCard = ({ article, onBookmark, isBookmarked }) => {
  return (
    <div className="bg-white bg-opacity-80 dark:bg-gray-800 dark:bg-opacity-50 backdrop-blur-md p-4 rounded-xl shadow-md flex flex-col space-y-2 transition-colors duration-300">
      <img
        src={article.urlToImage || "/fallback.jpg"}
        alt={article.title}
        className="w-full h-40 object-cover rounded-lg"
      />
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{article.title}</h3>
      <p className="text-sm text-gray-700 dark:text-gray-300">{article.description}</p>

      <div className="flex justify-between items-center mt-2">
        <a
          href={article.url}
          target="_blank"
          rel="noreferrer"
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          Read More →
        </a>

        <div onClick={() => onBookmark(article)} className="cursor-pointer" title={isBookmarked ? "Remove Bookmark" : "Add Bookmark"}>
          {isBookmarked ? (
            <HiBookmark className="w-6 h-6 text-yellow-400 hover:text-yellow-500 transition" />
          ) : (
            <HiOutlineBookmark className="w-6 h-6 text-gray-800 dark:text-white hover:text-yellow-400 transition" />
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsCard;
