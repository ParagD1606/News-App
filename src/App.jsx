import React, { useEffect, useState } from "react";
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
import { SUPPORTED_COUNTRIES, fetchTopHeadlines } from "./services/newsApi";

const AppContent = () => {
  const location = useLocation();


  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [bookmarks, setBookmarks] = useState(JSON.parse(localStorage.getItem("bookmarks") || "[]"));
  const [newsArticles, setNewsArticles] = useState([]);
  const [category, setCategory] = useState("general");
  const [searchQuery, setSearchQuery] = useState(""); 
  const [country, setCountry] = useState(SUPPORTED_COUNTRIES[0]); // default: US

  useEffect(() => {
    if (theme === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const contentPages = ['/home', '/reels', '/analytics'];
    if (contentPages.includes(location.pathname) || location.pathname === '/') { 
        const loadNews = async () => {
          const data = await fetchTopHeadlines(category, searchQuery, country);
          setNewsArticles(data);
        };
        loadNews();
    }
  }, [category, searchQuery, country, location.pathname]); 

  const handleBookmark = (article) => {
    const updated = bookmarks.find((a) => a.url === article.url)
      ? bookmarks.filter((a) => a.url !== article.url)
      : [...bookmarks, article];
    setBookmarks(updated);
    localStorage.setItem("bookmarks", JSON.stringify(updated));
  };

  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  const hideNavbarPaths = ['/', '/registration', '/login'];
  const showNavbar = !hideNavbarPaths.includes(location.pathname);
  const isLandingPage = location.pathname === '/';
  const themeClasses = !isLandingPage
    ? "bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100" 
    : "bg-black"; 

  return (
    <div className={`relative w-full min-h-screen transition-colors duration-300 overflow-x-hidden ${themeClasses}`}>
      
      {showNavbar && (
        <Navbar 
          theme={theme} 
          toggleTheme={toggleTheme} 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          country={country}
          setCountry={setCountry}
        />
      )}
      
      {showNavbar && <div className="h-24"></div>} 
      
      <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/home" element={
              <Home 
                articles={newsArticles}
                bookmarks={bookmarks}
                handleBookmark={handleBookmark}
                category={category}
                setCategory={setCategory}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                country={country}
              />
          } />
          <Route path="/reels" element={
              <Reels
                  articles={newsArticles}
                  currentCategory={category}
                  searchQuery={searchQuery}
                  country={country}
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
          <Route path="/profile" element={<Profile bookmarks={bookmarks} />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </div>
  );
};

const App = () => (
    <BrowserRouter>
        <AppContent />
    </BrowserRouter>
);

export default App;
