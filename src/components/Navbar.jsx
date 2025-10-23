import React from "react";
import { HiSun, HiMoon, HiBookmark, HiChartBar } from "react-icons/hi";

const Navbar = ({ theme, toggleTheme }) => {
  return (
    <div className="w-full fixed top-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex justify-between items-center py-3 px-6 md:px-12">
        <div className="flex items-center gap-2">
          <span className="text-gray-900 dark:text-white text-2xl font-bold">
            News<span className="text-blue-500">Pulse</span>
          </span>
          <span className="text-gray-500 dark:text-gray-300 text-sm hidden md:block">
            Trending Headlines Analyzer
          </span>
        </div>

        <div className="flex gap-4 items-center">
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

          <div className="flex items-center gap-1 text-gray-800 dark:text-gray-200 cursor-pointer">
            <HiBookmark className="w-5 h-5" />
            <span className="hidden sm:block">Bookmarks</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
