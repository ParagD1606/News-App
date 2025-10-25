import React, { useRef } from "react";
import Aurora from "../Usages/Aurora";
import LandingFooter from "./LandingFooter";
import { HiChartBar, HiBookmark, HiHome, HiVolumeUp, HiArrowDown } from "react-icons/hi";

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-gray-700/30 shadow-xl hover:shadow-2xl transition duration-500 transform hover:scale-105 cursor-default">
    <div className="text-blue-400 mb-4 text-3xl">{icon}</div>
    <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
    <p className="text-gray-300 text-sm">{description}</p>
  </div>
);

const Landing = ({ setPage }) => {
  const featuresRef = useRef(null);
  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative w-full min-h-screen overflow-x-hidden bg-black">
      
      {/* Hero Section */}
      <div className="relative w-full h-screen overflow-hidden flex flex-col justify-center items-center text-center">
        <div className="absolute inset-0">
          <Aurora
            colorStops={["#5227ff", "#00bcd4", "#7cff67"]}
            blend={0.5}
            amplitude={1.0}
            speed={0.5}
          />
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center px-6">
          <h1 className="text-6xl md:text-8xl font-extrabold mb-4 leading-tight tracking-tight text-white drop-shadow-[0_0_20px_rgba(82,39,255,0.7)]">
            News<span className="text-blue-400">Pulse</span>
          </h1>
          <p className="text-xl md:text-2xl mb-10 font-light text-gray-200 max-w-3xl drop-shadow-[0_0_10px_rgba(0,0,0,0.5)]">
            Your personalized source for trending headlines, instant audio reels, and in-depth analytics.
          </p>

          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <button
              onClick={() => setPage("home")}
              className="px-8 py-3 bg-blue-500 text-white text-lg font-semibold rounded-full
                         hover:bg-blue-600 transition duration-300 transform hover:scale-105 shadow-xl shadow-blue-500/50"
            >
              Get Started
            </button>

            <button
              onClick={scrollToFeatures}
              className="px-8 py-3 bg-transparent border-2 border-white text-white text-lg font-semibold rounded-full
                         hover:bg-white hover:text-black transition duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center"
            >
              Features <HiArrowDown className="ml-2 w-5 h-5 animate-bounce" />
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div ref={featuresRef} className="w-full bg-gray-900 py-20 px-6 sm:px-12">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl font-extrabold text-white text-center mb-16 border-b-4 border-blue-500/50 pb-4 inline-block mx-auto">
            Key Features
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<HiHome />}
              title="Dynamic Home Feed & Search"
              description="Explore top headlines, filter by category (General, Tech, Sports, etc.), or search instantly by keyword."
            />
            <FeatureCard
              icon={<HiVolumeUp />}
              title="AI-Powered Reels"
              description="Swipe through articles in a 'Reels' format and listen to summaries instantly using Text-to-Speech."
            />
            <FeatureCard
              icon={<HiChartBar />}
              title="Insightful Analytics"
              description="Visual breakdown of sources, trending keywords, and insights across your current news selection."
            />
            <FeatureCard
              icon={<HiBookmark />}
              title="Personalized Bookmarking"
              description="Save articles with a single tap and manage your curated reading list easily in the Bookmarks section."
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <LandingFooter />
    </div>
  );
};

export default Landing;
