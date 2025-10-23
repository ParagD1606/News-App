import React, { useEffect, useState } from "react";
import Home from "./components/Home";
import Bookmarks from "./components/Bookmarks"; // NEW IMPORT
import Navbar from "./components/Navbar"; // NEW IMPORT

const App = () => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [page, setPage] = useState("home"); // NEW STATE for simple routing
  const [bookmarks, setBookmarks] = useState(() =>
    JSON.parse(localStorage.getItem("bookmarks") || "[]")
  );

  // Theme effect (existing logic)
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);
  
  // Bookmark handler (moved from Home to App to share with Bookmarks page)
  const handleBookmark = (article) => {
    let updated;
    if (bookmarks.find((a) => a.url === article.url)) {
      updated = bookmarks.filter((a) => a.url !== article.url);
    } else {
      updated = [...bookmarks, article];
    }
    setBookmarks(updated);
    localStorage.setItem("bookmarks", JSON.stringify(updated)); // Save to localStorage
  };

  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  const renderPage = () => {
    // Pass necessary state and handlers down to components
    if (page === "home") {
      return (
        <Home 
          theme={theme} 
          toggleTheme={toggleTheme} 
          bookmarks={bookmarks}
          handleBookmark={handleBookmark}
          setPage={setPage} // Pass setPage for Navbar/routing
        />
      );
    } else if (page === "bookmarks") {
      return (
        // Bookmarks page handles its own display
        <Bookmarks 
          bookmarks={bookmarks}
          handleBookmark={handleBookmark}
          setPage={setPage}
        />
      );
    }
    return <Home theme={theme} toggleTheme={toggleTheme} />;
  };

  return (
    <div className="relative w-full min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300 overflow-x-hidden">
      <Navbar 
        theme={theme} 
        toggleTheme={toggleTheme} 
        page={page} // Pass current page state
        setPage={setPage} // Pass handler to switch pages
      />
      {/* Spacer for fixed navbar */}
      <div className="h-24"></div> 
      {renderPage()}
    </div>
  );
};

export default App;