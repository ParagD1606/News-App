import React, { useEffect, useState } from "react";
import Home from "./components/Home";
import Bookmarks from "./components/Bookmarks";
import Navbar from "./components/Navbar";

const App = () => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [page, setPage] = useState("home"); 
  const [bookmarks, setBookmarks] = useState(() =>
    JSON.parse(localStorage.getItem("bookmarks") || "[]")
  );
  // NEW: Add search state to App.jsx
  const [searchQuery, setSearchQuery] = useState(""); 

  // Theme effect (existing logic)
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);
  
  // Bookmark handler
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

  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  const renderPage = () => {
    if (page === "home") {
      return (
        <Home 
          theme={theme} 
          toggleTheme={toggleTheme} 
          bookmarks={bookmarks}
          handleBookmark={handleBookmark}
          // NEW: Pass search props to Home
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      );
    } else if (page === "bookmarks") {
      return (
        <Bookmarks 
          bookmarks={bookmarks}
          handleBookmark={handleBookmark}
          setPage={setPage}
        />
      );
    }
    return null; // Should not happen
  };

  return (
    <div className="relative w-full min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300 overflow-x-hidden">
      <Navbar 
        theme={theme} 
        toggleTheme={toggleTheme} 
        page={page} 
        setPage={setPage} 
        // NEW: Pass search props to Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      {/* Spacer for fixed navbar */}
      <div className="h-24"></div> 
      {renderPage()}
    </div>
  );
};

export default App;