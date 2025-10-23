import React from "react";
import { HiSun, HiMoon, HiBookmark, HiChartBar, HiSearch } from "react-icons/hi";

// UPDATED: Receive page and setPage props
const Navbar = ({ theme, toggleTheme, searchQuery, setSearchQuery, page, setPage }) => {
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPage("home"); // Automatically go to home page on search
  };

  return (
    <div className="w-full fixed top-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex justify-between items-center py-3 px-6 md:px-12">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setPage("home")}>
          <span className="text-gray-900 dark:text-white text-2xl font-bold">
            News<span className="text-blue-500">Pulse</span>
          </span>
          <span className="text-gray-500 dark:text-gray-300 text-sm hidden md:block">
            Trending Headlines Analyzer
          </span>
        </div>

        {/* Search Bar (Desktop) */}
        <div className="relative w-full max-w-sm mx-4 hidden md:block">
          <input
            type="text"
            placeholder="Search news articles..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full py-2 pl-10 pr-4 border border-gray-300 dark:border-gray-700 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
          <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-gray-400" />
        </div>
        {/* End Search Bar */}

        <div className="flex gap-4 items-center">
          
          {/* Mobile Search Input */}
          <div className="relative block md:hidden">
             <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-24 py-1 pl-7 pr-1 border border-gray-300 dark:border-gray-700 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 transition text-sm"
            />
            <HiSearch className="absolute left-1 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400" />
          </div>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-transparent text-yellow-400 dark:text-blue-400 transition"
            title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {theme === "dark" ? <HiSun className="w-6 h-6" /> : <HiMoon className="w-6 h-6" />}
          </button>

          <div className="flex items-center gap-1 text-gray-800 dark:text-gray-200 cursor-pointer">
            <HiChartBar className="w-5 h-5" />
            <span className="hidden sm:block">Analytics</span>
          </div>

          {/* Bookmarks link */}
          <div 
            onClick={() => setPage("bookmarks")} 
            className={`flex items-center gap-1 cursor-pointer transition ${page === "bookmarks" ? "text-blue-500 dark:text-blue-400" : "text-gray-800 dark:text-gray-200"}`}
          >
            <HiBookmark className="w-5 h-5" />
            <span className="hidden sm:block">Bookmarks</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;