import React, { useEffect, useState } from "react";
import Home from "./components/Home";
import Bookmarks from "./components/Bookmarks";
import Navbar from "./components/Navbar";
import Analytics from "./components/Analytics";
import Landing from "./components/Landing"; 
import Reels from "./components/Reels"; 
import Registration from "./components/Registration"; 
import Login from "./components/Login"; 
import Profile from "./components/Profile"; 
import { fetchTopHeadlines } from "./services/newsApi";

const App = () => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [page, setPage] = useState("landing"); 
  const [bookmarks, setBookmarks] = useState(() =>
    JSON.parse(localStorage.getItem("bookmarks") || "[]")
  );
  
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
    // Only fetch data if the user is on a content-based page
    if (page === 'home' || page === 'reels' || page === 'analytics') { 
        const loadNews = async () => {
          const data = await fetchTopHeadlines(category, searchQuery);
          setNewsArticles(data);
        };
        loadNews();
    }
  }, [category, searchQuery, page]); 
  
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
    if (page === "landing") { 
        // NOTE: theme prop is no longer needed on Landing since it manages its own background
        return <Landing setPage={setPage} />; 
    }
    
    if (page === "registration") {
        return <Registration setPage={setPage} />;
    }
    
    if (page === "login") {
        return <Login setPage={setPage} />;
    }
    
    if (page === "profile") { 
        // Pass bookmarks array for dynamic count
        return <Profile setPage={setPage} bookmarks={bookmarks} />;
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
    
    if (page === "reels") { 
        return (
            <Reels
                articles={newsArticles}
                setPage={setPage}
                currentCategory={category}
                searchQuery={searchQuery}
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

  // Hide Navbar on landing, registration, and login pages
  const showNavbar = page !== 'landing' && page !== 'registration' && page !== 'login'; 
  
  // Conditional classes for the main wrapper
  const themeClasses = page !== 'landing' 
    ? "bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100" // Apply theme colors
    : "bg-black"; // Use a single, non-theme-dependent background for landing page wrapper

  return (
    <div className={`relative w-full min-h-screen transition-colors duration-300 overflow-x-hidden ${themeClasses}`}>
      {/* Navbar only shows if authentication/landing pages are not visible */}
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