import React, { useEffect, useState } from "react";
// 1. Import React Router components
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
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

// New component to wrap the router logic and allow hook usage
const AppContent = () => {
  // 2. Use useLocation hook to get current path (replaces 'page' state)
  const location = useLocation(); 
  
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  
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
  
  // 3. Updated Fetching Effect: Logic depends only on Category/Search/Location path
  useEffect(() => {
    // Only fetch data if the user is on a content-based page
    const contentPages = ['/home', '/reels', '/analytics'];
    if (contentPages.includes(location.pathname) || location.pathname === '/') { 
        const loadNews = async () => {
          const data = await fetchTopHeadlines(category, searchQuery);
          setNewsArticles(data);
        };
        loadNews();
    }
    // 'page' is removed from dependency array
  }, [category, searchQuery, location.pathname]); 
  
  // Bookmark handler remains the same
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

  // 4. Determine Navbar visibility based on URL path
  const hideNavbarPaths = ['/', '/registration', '/login'];
  const showNavbar = !hideNavbarPaths.includes(location.pathname);
  
  // Conditional classes for the main wrapper
  const isLandingPage = location.pathname === '/';
  const themeClasses = !isLandingPage
    ? "bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100" 
    : "bg-black"; 

  return (
    <div className={`relative w-full min-h-screen transition-colors duration-300 overflow-x-hidden ${themeClasses}`}>
      
      {/* Navbar only shows if not on excluded paths */}
      {showNavbar && (
        <Navbar 
          theme={theme} 
          toggleTheme={toggleTheme} 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          // 'page' and 'setPage' are removed from props
        />
      )}
      
      {/* Spacer for fixed navbar only needed when navbar is visible */}
      {showNavbar && <div className="h-24"></div>} 
      
      {/* 5. Use Routes/Route for page rendering */}
      <Routes>
          {/* Landing page is the default route */}
          <Route path="/" element={<Landing />} />
          
          {/* Main App Routes */}
          <Route path="/home" element={
              <Home 
                articles={newsArticles}
                bookmarks={bookmarks}
                handleBookmark={handleBookmark}
                category={category}
                setCategory={setCategory}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
          } />
          <Route path="/reels" element={
              <Reels
                  articles={newsArticles}
                  currentCategory={category}
                  searchQuery={searchQuery}
              />
          } />
          <Route path="/bookmarks" element={
              <Bookmarks 
                bookmarks={bookmarks}
                handleBookmark={handleBookmark}
              />
          } />
          <Route path="/analytics" element={
              <Analytics
                  articles={newsArticles}
                  currentCategory={category}
                  searchQuery={searchQuery}
                  theme={theme}
              />
          } />
          <Route path="/profile" element={
              <Profile bookmarks={bookmarks} />
          } />
          
          {/* Auth Routes */}
          <Route path="/registration" element={<Registration />} />
          <Route path="/login" element={<Login />} />
          
          {/* Fallback/Catch-all: Redirect to Home if path is unknown */}
          <Route path="*" element={<Navigate to="/home" replace />} />

      </Routes>
    </div>
  );
};

// Outer component to hold BrowserRouter
const App = () => (
    <BrowserRouter>
        <AppContent />
    </BrowserRouter>
);

export default App;