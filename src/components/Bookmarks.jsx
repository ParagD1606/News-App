import React from "react";
import NewsCard from "./NewsCard";

const Bookmarks = ({ bookmarks, handleBookmark, setPage }) => {
  return (
    <div className="max-w-7xl mx-auto p-6 pt-24 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        Your Bookmarks
      </h2>

      {bookmarks.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-xl text-gray-700 dark:text-gray-300">
            You haven't bookmarked any articles yet.
          </p>
          <button
            onClick={() => setPage("home")}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
          >
            Go to Home
          </button>
        </div>
      ) : (
        <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarks.map((article, idx) => (
            <NewsCard
              key={idx}
              article={article}
              onBookmark={handleBookmark}
              // Bookmarks are always considered bookmarked on this page
              isBookmarked={true} 
            />
          ))}
        </main>
      )}
    </div>
  );
};

export default Bookmarks;