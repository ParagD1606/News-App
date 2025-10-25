import React, { useState, useEffect, useCallback, useRef } from "react";
import { HiPlay, HiPause, HiArrowLeft } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

// Utility to filter out unusable articles
const filterArticles = (articles) =>
  articles.filter(
    (a) => a.urlToImage && (a.description || a.content)
  );

const ICON_FADE_DURATION = 1500;

const Reels = ({ articles }) => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showIcon, setShowIcon] = useState(false);

  const filteredArticles = useRef(filterArticles(articles)).current;
  const totalArticles = filteredArticles.length;

  const articleRefs = useRef([]);
  const reelContainerRef = useRef(null);
  const iconTimeout = useRef(null);

  // --- Stop any ongoing speech ---
  const stopSpeech = useCallback(() => {
    window.speechSynthesis.cancel();
    clearTimeout(iconTimeout.current);
    setIsPlaying(false);
  }, []);

  // --- Speak an article aloud ---
  const speakArticle = useCallback(
    (index) => {
      const article = filteredArticles[index];
      if (!article) return;

      stopSpeech();
      const textToSpeak = `${article.title}. ${
        article.description || article.content || ""
      }`;
      const utterance = new SpeechSynthesisUtterance(textToSpeak);

      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);

      window.speechSynthesis.speak(utterance);
    },
    [filteredArticles, stopSpeech]
  );

  // --- Toggle play/pause on tap ---
  const togglePlayPause = useCallback(() => {
    if (iconTimeout.current) clearTimeout(iconTimeout.current);
    setShowIcon(true);

    if (isPlaying) stopSpeech();
    else speakArticle(activeIndex);

    iconTimeout.current = setTimeout(
      () => setShowIcon(false),
      ICON_FADE_DURATION
    );
  }, [isPlaying, stopSpeech, speakArticle, activeIndex]);

  // --- Scroll detection ---
  useEffect(() => {
    if (totalArticles === 0) return;
    const container = reelContainerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((e) => e.isIntersecting);
        if (visible) {
          const index = parseInt(visible.target.dataset.index, 10);
          setActiveIndex(index);
        }
      },
      { threshold: 0.75, root: container }
    );

    articleRefs.current.forEach((ref) => ref && observer.observe(ref));

    return () => {
      stopSpeech();
      observer.disconnect();
    };
  }, [totalArticles, stopSpeech]);

  // --- Auto speak current article ---
  useEffect(() => {
    if (totalArticles > 0) speakArticle(activeIndex);
    return stopSpeech;
  }, [activeIndex, totalArticles, speakArticle, stopSpeech]);

  // --- Empty state ---
  if (totalArticles === 0)
    return (
      <div className="max-w-7xl mx-auto p-6 pt-24 min-h-screen text-center">
        <p className="text-xl text-gray-700 dark:text-gray-300">
          No articles available for Reels.
        </p>
        <button
          onClick={() => navigate("/home")}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition flex items-center gap-2 mx-auto shadow-md"
        >
          <HiArrowLeft /> Go to Home Feed
        </button>
      </div>
    );

  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      {/* Scrollable container */}
      <div
        onClick={togglePlayPause}
        ref={reelContainerRef}
        className="w-full max-w-[450px] h-[calc(100vh-6rem)] overflow-y-scroll snap-y snap-mandatory 
                   shadow-2xl rounded-2xl border border-gray-300 dark:border-gray-700 
                   bg-gray-950 dark:bg-black/90 relative mt-24 scroll-smooth"
      >
        {/* Centered play/pause indicator */}
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div
            className={`p-8 rounded-full bg-black/50 backdrop-blur-md transition-all duration-300 transform ${
              showIcon
                ? "opacity-100 scale-100"
                : "opacity-0 scale-75"
            }`}
          >
            {isPlaying ? (
              <HiPause className="w-12 h-12 text-white" />
            ) : (
              <HiPlay className="w-12 h-12 text-white" />
            )}
          </div>
        </div>

        {/* Each article */}
        {filteredArticles.map((article, index) => (
          <div
            key={article.url}
            data-index={index}
            ref={(el) => (articleRefs.current[index] = el)}
            className="relative w-full h-full snap-start flex flex-col justify-end overflow-hidden"
          >
            <img
              src={article.urlToImage || "/fallback.jpg"}
              alt={article.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />

            {/* Glassmorphism overlay */}
            <div className="relative z-10 w-full p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent backdrop-blur-sm">
              <h3 className="text-xl font-extrabold text-white line-clamp-3 drop-shadow-md">
                {article.title}
              </h3>
              <p className="mt-2 text-sm text-gray-200 line-clamp-2">
                {article.description || article.content}
              </p>
            </div>
          </div>
        ))}

        {/* Scroll indicator */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2">
          {filteredArticles.map((_, i) => (
            <span
              key={i}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i === activeIndex
                  ? "bg-white scale-125"
                  : "bg-white/40 scale-100"
              }`}
            ></span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reels;
