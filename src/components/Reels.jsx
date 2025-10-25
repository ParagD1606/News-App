import React, { useState, useEffect, useCallback, useRef } from "react";
import { HiPlay, HiPause } from "react-icons/hi"; 
import { HiArrowLeft } from "react-icons/hi"; // Re-added HiArrowLeft for empty state

const filterArticles = (articles) => 
  articles.filter(article => article.urlToImage && (article.description || article.content));

// Delay duration for the play/pause icon to fade out
const ICON_FADE_DURATION = 1500; 

const Reels = ({ articles, setPage }) => {
  // --- STATE and REFS ---
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showIcon, setShowIcon] = useState(false);
  
  const filteredArticles = useRef(filterArticles(articles)).current;
  const totalArticles = filteredArticles.length;
  
  const articleRefs = useRef([]); 
  const reelContainerRef = useRef(null); 
  const iconTimeout = useRef(null); 
  
  // --- Text-to-Speech Control Functions (RETAINED) ---
  const stopSpeech = useCallback(() => {
    window.speechSynthesis.cancel();
    clearTimeout(iconTimeout.current);
    setIsPlaying(false);
  }, []);

  const speakArticle = useCallback((index) => {
    const article = filteredArticles[index];
    if (!article) return;
    
    stopSpeech(); 
    
    const textToSpeak = `${article.title}. ${article.description || article.content || ""}`;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    
    utterance.onstart = () => setIsPlaying(true);
    
    utterance.onend = () => {
        setIsPlaying(false);
    };

    window.speechSynthesis.speak(utterance);
  }, [filteredArticles, stopSpeech]); 

  // --- TAP-TO-TOGGLE Logic (Applied to the scrolling container) ---
  const togglePlayPause = useCallback(() => {
    // Clear any pending icon fade-out
    if (iconTimeout.current) {
        clearTimeout(iconTimeout.current);
    }
    
    setShowIcon(true);

    if (isPlaying) {
      stopSpeech();
    } else {
      speakArticle(activeIndex);
    }

    // Set timeout to hide icon after delay
    iconTimeout.current = setTimeout(() => {
        setShowIcon(false);
    }, ICON_FADE_DURATION);
    
  }, [isPlaying, stopSpeech, speakArticle, activeIndex]);
  

  // --- Intersection Observer Logic (RETAINED) ---
  useEffect(() => {
    if (totalArticles === 0) return;

    const container = reelContainerRef.current;
    if (!container) return;
    
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && entry.intersectionRatio >= 0.9) { 
                    const index = parseInt(entry.target.dataset.index, 10);
                    setActiveIndex(index);
                }
            });
        },
        { 
            threshold: 0.9, 
            root: container,
        }
    );

    articleRefs.current.forEach(ref => {
        if (ref) observer.observe(ref);
    });

    // Cleanup
    return () => {
        stopSpeech();
        observer.disconnect(); 
    };
  }, [totalArticles, stopSpeech]); 
  
  // --- Auto-Play Logic (RETAINED) ---
  useEffect(() => {
    if (totalArticles === 0 || !filteredArticles[activeIndex]) return;
    
    speakArticle(activeIndex); 
    
    return stopSpeech;
  }, [activeIndex, filteredArticles, totalArticles, speakArticle, stopSpeech]); 

  // --- Placeholder for Empty State ---
  if (totalArticles === 0) {
    return (
      <div className="max-w-7xl mx-auto p-6 pt-24 min-h-screen text-center">
        <p className="text-xl text-gray-700 dark:text-gray-300">
          No suitable articles with images found for Reels.
        </p>
        {/* Fallback button included for accessibility in empty state */}
        <button
            onClick={() => setPage("home")}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition flex items-center gap-2 mx-auto shadow-md hover:shadow-lg"
          >
            Go to Home Feed
        </button>
      </div>
    );
  }
  
  return (
    // Main wrapper centers content, filling screen space below the Navbar
    <div className="w-full min-h-screen flex flex-col items-center bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      
      {/* MAIN REEL CONTAINER: Scrollable card area */}
      <div 
        // NEW: onClick handler is here. This allows native scrolling.
        onClick={togglePlayPause}
        className="w-full max-w-[450px] 
                   h-[calc(100vh-6rem)] 
                   overflow-y-scroll snap-y snap-mandatory 
                   shadow-2xl rounded-xl border border-gray-300 dark:border-gray-700
                   bg-gray-950 dark:bg-black/90 relative mt-24" 
        ref={reelContainerRef}
      >
          
          {/* Play/Pause Icon Feedback - Absolute and centered in the viewport */}
          <div 
              // Fixed to the VIEWPORT, but only displays over the reel container visually
              className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none" 
          >
              <div 
                  className={`p-6 rounded-full bg-black/50 transition-opacity duration-300 pointer-events-auto ${
                      showIcon ? 'opacity-100' : 'opacity-0'
                  }`}
              >
                  {isPlaying ? (
                      <HiPause className="w-12 h-12 text-white" />
                  ) : (
                      <HiPlay className="w-12 h-12 text-white" />
                  )}
              </div>
          </div>
          
          {filteredArticles.map((article, index) => (
            <div 
              key={article.url}
              data-index={index}
              className="relative w-full h-full snap-start overflow-hidden flex flex-col justify-end"
              ref={el => articleRefs.current[index] = el}
            >
              {/* Background Image */}
              <img
                src={article.urlToImage || "/fallback.jpg"}
                alt={article.title}
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* Minimal Overlay for a clean look */}
              <div className="relative z-10 w-full p-6 bg-gradient-to-t from-black/80 via-black/20 to-transparent">
                  <h3 className="text-xl font-extrabold text-white line-clamp-3">
                      {article.title}
                  </h3>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Reels;