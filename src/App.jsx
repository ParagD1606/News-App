import React, { useEffect, useState } from "react";
import Home from "./components/Home";
import Bookmarks from "./components/Bookmarks";
import Navbar from "./components/Navbar";
import Analytics from "./components/Analytics";
import Landing from "./components/Landing"; // NEW IMPORT
import { fetchTopHeadlines } from "./services/newsApi";

const App = () => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  // UPDATED: Default page is now "landing"
  const [page, setPage] = useState("landing"); 
  const [bookmarks, setBookmarks] = useState(() =>
    JSON.parse(localStorage.getItem("bookmarks") || "[]")
  );
  
  // MOVED STATE FROM HOME.JSX
  const [newsArticles, setNewsArticles] = useState([]);
  const [category, setCategory] = useState("general");
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
  
  // NEW FETCHING EFFECT: Handles changes to category or search query
  useEffect(() => {
    // Only fetch data if the user is not on the landing page
    if (page !== 'landing') {
        const loadNews = async () => {
          const data = await fetchTopHeadlines(category, searchQuery);
          setNewsArticles(data);
        };
        loadNews();
    }
  }, [category, searchQuery, page]); // Dependency on page added to trigger fetch on exit from landing
  
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
    if (page === "landing") { // NEW: Landing Page Route
        return <Landing setPage={setPage} theme={theme} />;
    }
    
    if (page === "home") {
      return (
        <Home 
          articles={newsArticles}
          bookmarks={bookmarks}
          handleBookmark={handleBookmark}
          category={category}
          setCategory={setCategory}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      );
    } 
    
    if (page === "bookmarks") {
      return (
        <Bookmarks 
          bookmarks={bookmarks}
          handleBookmark={handleBookmark}
          setPage={setPage}
        />
      );
    } 
    
    if (page === "analytics") { 
        return (
            <Analytics
                articles={newsArticles}
                currentCategory={category}
                searchQuery={searchQuery}
                theme={theme}
            />
        );
    }
    return null;
  };

  const showNavbar = page !== 'landing';

  return (
    <div className="relative w-full min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300 overflow-x-hidden">
      {/* Navbar only shows if not on the landing page */}
      {showNavbar && (
        <Navbar 
          theme={theme} 
          toggleTheme={toggleTheme} 
          page={page} 
          setPage={setPage} 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      )}
      
      {/* Spacer for fixed navbar only needed when navbar is visible */}
      {showNavbar && <div className="h-24"></div>} 
      
      {renderPage()}
    </div>
  );
};

export default App;