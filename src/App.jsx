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
import { fetchTopHeadlines } from "./services/newsApi";

const AppContent = () => {
  const location = useLocation();

  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [bookmarks, setBookmarks] = useState(() =>
    JSON.parse(localStorage.getItem("bookmarks") || "[]")
  );
  const [newsArticles, setNewsArticles] = useState([]);
  const [category, setCategory] = useState("general");
  const [searchQuery, setSearchQuery] = useState("");

  // Theme effect
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Fetch US news only
  useEffect(() => {
    const loadNews = async () => {
      const data = await fetchTopHeadlines(category, searchQuery, "us");
      setNewsArticles(data);
    };
    loadNews();
  }, [category, searchQuery]);

  const handleBookmark = (article) => {
    const updated = bookmarks.find(a => a.url === article.url)
      ? bookmarks.filter(a => a.url !== article.url)
      : [...bookmarks, article];
    setBookmarks(updated);
    localStorage.setItem("bookmarks", JSON.stringify(updated));
  };

  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");
  const hideNavbarPaths = ["/", "/registration", "/login"];
  const showNavbar = !hideNavbarPaths.includes(location.pathname);

  const handleRefresh = async () => {
    const data = await fetchTopHeadlines(category, searchQuery, "us");
    setNewsArticles(data);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"}`}>
      {showNavbar && (
        <Navbar
          theme={theme}
          toggleTheme={toggleTheme}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onRefresh={handleRefresh}
        />    
      )}

      {showNavbar && <div className="h-24" />}

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
          />
        } />
        <Route path="/reels" element={<Reels articles={newsArticles} currentCategory={category} searchQuery={searchQuery} country="us" />} />
        <Route path="/bookmarks" element={<Bookmarks bookmarks={bookmarks} handleBookmark={handleBookmark} />} />
        <Route path="/analytics" element={<Analytics articles={newsArticles} currentCategory={category} searchQuery={searchQuery} theme={theme} />} />
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
