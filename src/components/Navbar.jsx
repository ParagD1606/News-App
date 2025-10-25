import React, { useState } from "react";
// Import all necessary icons
import { HiSun, HiMoon, HiBookmark, HiChartBar, HiMenu, HiX, HiSearch, HiHome, HiPhotograph } from "react-icons/hi"; 

const Navbar = ({ theme, toggleTheme, searchQuery, setSearchQuery, page, setPage }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false); 

  const handleNavigation = (newPage) => {
    setPage(newPage);
    setIsMenuOpen(false);
    window.speechSynthesis.cancel();
  };

  return (
    <div className="w-full fixed top-0 z-50 bg-white/90 dark:bg-black/90 backdrop-blur-sm transition-colors duration-300 shadow-md dark:shadow-gray-900/50">
      <div className="max-w-7xl mx-auto flex justify-between items-center py-3 px-6 md:px-12">
        {/* LOGO */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleNavigation("home")}>
          <span className="text-gray-900 dark:text-white text-2xl font-bold">
            News<span className="text-blue-500">Pulse</span>
          </span>
          <span className="text-gray-500 dark:text-gray-300 text-sm hidden md:block">
            Trending Headlines Analyzer
          </span>
        </div>

        {/* Desktop Navigation Links & Theme Toggle */}
        <div className="flex gap-4 items-center">
          
          {/* DESKTOP LINKS GROUP */}
          <div className="hidden md:flex gap-6 items-center">
              
              {/* HOME Link */}
              <div 
                  onClick={() => handleNavigation("home")}
                  className={`flex items-center gap-1 cursor-pointer transition ${page === "home" ? "text-blue-600 dark:text-blue-400 font-bold" : "text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-300"}`}
              >
                  <HiHome className="w-5 h-5" />
                  <span className="hidden lg:block text-sm">Home</span>
              </div>
              
              {/* Reels Link */}
              <div 
                  onClick={() => handleNavigation("reels")}
                  className={`flex items-center gap-1 cursor-pointer transition ${page === "reels" ? "text-blue-600 dark:text-blue-400 font-bold" : "text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-300"}`}
              >
                  <HiPhotograph className="w-5 h-5" />
                  <span className="hidden lg:block text-sm">Reels</span>
              </div>
              
              {/* Analytics Link */}
              <div 
                  onClick={() => handleNavigation("analytics")}
                  className={`flex items-center gap-1 cursor-pointer transition ${page === "analytics" ? "text-blue-600 dark:text-blue-400 font-bold" : "text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-300"}`}
              >
                  <HiChartBar className="w-5 h-5" />
                  <span className="hidden lg:block text-sm">Analytics</span>
              </div>

              {/* Bookmarks link */}
              <div 
                  onClick={() => handleNavigation("bookmarks")} 
                  className={`flex items-center gap-1 cursor-pointer transition ${page === "bookmarks" ? "text-blue-600 dark:text-blue-400 font-bold" : "text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-300"}`}
              >
                  <HiBookmark className="w-5 h-5" />
                  <span className="hidden lg:block text-sm">Bookmarks</span>
              </div>
          </div>
          
          {/* Theme Toggle - Enhanced Transitions */}
          <div
            onClick={toggleTheme}
            // Ensure transitions are applied to the parent container for background/shadow changes
            className={`flex w-14 h-8 rounded-full shadow-inner p-1 cursor-pointer transition-all duration-500 ease-in-out ${
              theme === "dark" ? "bg-gray-700 justify-end" : "bg-yellow-400 justify-start"
            }`}
            title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {/* Sliding Circle/Knob */}
            <div className={`w-6 h-6 rounded-full shadow-lg flex items-center justify-center transition-all duration-500 ease-in-out ${
              theme === "dark" ? "bg-gray-900" : "bg-white"
            }`}>
              {theme === "dark" ? (
                <HiMoon className="w-4 h-4 text-blue-400" />
              ) : (
                <HiSun className="w-4 h-4 text-yellow-500" />
              )}
            </div>
          </div>
          
          {/* MOBILE HAMBURGER BUTTON (Visible on mobile only) */}
          <button
            className="p-2 rounded-full text-gray-800 dark:text-gray-200 md:hidden hover:bg-gray-200/50 dark:hover:bg-gray-700/50"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            title="Toggle Menu"
          >
            {isMenuOpen ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
          </button>

        </div>
      </div>
      
      {/* MOBILE MENU (Absolute overlay) */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 w-full md:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-xl transition-all duration-300 ease-in-out">
          <div className="flex flex-col p-4 space-y-2">
              
              {/* HOME Link for Mobile */}
              <button 
                  onClick={() => handleNavigation("home")}
                  className={`flex items-center w-full p-3 rounded-lg text-lg font-medium transition ${page === "home" ? "bg-blue-500 text-white" : "text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"}`}
              >
                  <HiHome className="w-6 h-6 mr-3" />
                  Home
              </button>
              
              {/* Reels Link for Mobile */}
              <button 
                  onClick={() => handleNavigation("reels")}
                  className={`flex items-center w-full p-3 rounded-lg text-lg font-medium transition ${page === "reels" ? "bg-blue-500 text-white" : "text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"}`}
              >
                  <HiPhotograph className="w-6 h-6 mr-3" />
                  Reels
              </button>

              {/* Analytics Link for Mobile */}
              <button 
                  onClick={() => handleNavigation("analytics")}
                  className={`flex items-center w-full p-3 rounded-lg text-lg font-medium transition ${page === "analytics" ? "bg-blue-500 text-white" : "text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"}`}
              >
                  <HiChartBar className="w-6 h-6 mr-3" />
                  Analytics
              </button>

              {/* Bookmarks link for Mobile */}
              <button 
                  onClick={() => handleNavigation("bookmarks")} 
                  className={`flex items-center w-full p-3 rounded-lg text-lg font-medium transition ${page === "bookmarks" ? "bg-blue-500 text-white" : "text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"}`}
              >
                  <HiBookmark className="w-6 h-6 mr-3" />
                  Bookmarks
              </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;