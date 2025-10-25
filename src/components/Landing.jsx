import React from "react";
import Aurora from "../Usages/Aurora";

const Landing = () => {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Aurora background */}
      <div className="absolute inset-0">
        <Aurora
          colorStops={["#7cff67", "#b19eef", "#5227ff"]}
          blend={0.5}
          amplitude={1.0}
          speed={0.5}
        />
      </div>

      {/* Overlay content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white">
        <h1 className="text-5xl font-bold mb-4">Pulzion News</h1>
        <p className="text-lg mb-6">Stay updated with the latest headlines</p>
        <button className="px-6 py-3 bg-white text-black rounded-full hover:bg-gray-200 transition">
          Explore Now
        </button>
      </div>
    </div>
  );
};

export default Landing;
