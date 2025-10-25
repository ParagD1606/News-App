import React, { useState } from "react";
import { HiSun, HiMoon, HiBookmark, HiChartBar, HiMenu, HiX, HiHome, HiPhotograph, HiUserCircle } from "react-icons/hi"; 
// 1. Import useNavigate and useLocation
import { useNavigate, useLocation } from "react-router-dom"; 

// 'page' and 'setPage' are removed from props
const Navbar = ({ theme, toggleTheme, searchQuery, setSearchQuery }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false); 
  // 2. Initialize hooks
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path) => {
    navigate(path); // Use React Router's navigate function
    setIsMenuOpen(false);
    window.speechSynthesis.cancel();
  };

  const navItems = [
    { name: "Home", path: "/home", icon: HiHome },
    { name: "Reels", path: "/reels", icon: HiPhotograph },
    { name: "Analytics", path: "/analytics", icon: HiChartBar },
    { name: "Bookmarks", path: "/bookmarks", icon: HiBookmark },
    { name: "Profile", path: "/profile", icon: HiUserCircle },
  ];

  const getLinkClasses = (path) => 
    `flex items-center gap-1 cursor-pointer transition ${
      location.pathname === path ? "text-blue-600 dark:text-blue-400 font-bold" : "text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-300"
    }`;

  const getMobileButtonClasses = (path) =>
    `flex items-center w-full p-3 rounded-lg text-lg font-medium transition ${
      location.pathname === path ? "bg-blue-500 text-white" : "text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
    }`;


  return (
    <div className="w-full fixed top-0 z-50 bg-white/90 dark:bg-black/90 backdrop-blur-sm transition-colors duration-300 shadow-md dark:shadow-gray-900/50">
      <div className="max-w-7xl mx-auto flex justify-between items-center py-3 px-6 md:px-12">
        {/* LOGO - Navigate to Home */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleNavigation("/home")}>
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
              
              {navItems.map((item) => (
                  <div 
                    key={item.name}
                    onClick={() => handleNavigation(item.path)}
                    className={getLinkClasses(item.path)}
                  >
                      <item.icon className="w-5 h-5" />
                      <span className="hidden lg:block text-sm">{item.name}</span>
                  </div>
              ))}
              
          </div>
          
          {/* Theme Toggle - Enhanced Transitions */}
          <div
            onClick={toggleTheme}
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
              
              {navItems.map((item) => (
                  <button 
                    key={item.name}
                    onClick={() => handleNavigation(item.path)}
                    className={getMobileButtonClasses(item.path)}
                  >
                      <item.icon className="w-6 h-6 mr-3" />
                      {item.name}
                  </button>
              ))}
              
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;