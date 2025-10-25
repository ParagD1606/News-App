import React from "react";
import { FaTwitter, FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";

const LandingFooter = () => {
  return (
    <footer className="w-full bg-black/90 backdrop-blur-md py-16 text-gray-400">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-10">
        {/* Newsletter / Call to Action */}
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-white mb-3">Stay in the Loop</h2>
          <p className="text-gray-300 mb-4 text-sm">
            Subscribe to receive the latest headlines, trending articles, and updates directly to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-0">
            <input
              type="email"
              placeholder="Your email"
              className="px-4 py-2 rounded-l-md bg-gray-800 text-white placeholder-gray-500 outline-none w-full sm:w-auto flex-1"
            />
            <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-r-md transition duration-300">
              Subscribe
            </button>
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex-1">
          <h3 className="text-white font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-gray-400">
            <li><button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-white transition">Home</button></li>
            <li><button onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-white transition">Features</button></li>
            <li><button onClick={() => alert('Bookmarks page coming soon!')} className="hover:text-white transition">Bookmarks</button></li>
            <li><button onClick={() => alert('Analytics page coming soon!')} className="hover:text-white transition">Analytics</button></li>
          </ul>
        </div>

        {/* Social Media */}
        <div className="flex-1">
          <h3 className="text-white font-semibold mb-3">Follow Us</h3>
          <div className="flex gap-4 text-gray-400">
            <a href="#" className="hover:text-white transition"><FaTwitter size={20} /></a>
            <a href="#" className="hover:text-white transition"><FaFacebookF size={20} /></a>
            <a href="#" className="hover:text-white transition"><FaInstagram size={20} /></a>
            <a href="#" className="hover:text-white transition"><FaLinkedinIn size={20} /></a>
          </div>
        </div>
      </div>

      {/* Bottom copyright */}
      <div className="mt-12 border-t border-gray-800 pt-6 text-center text-sm text-gray-600">
        &copy; {new Date().getFullYear()} NewsPulse. All rights reserved.
      </div>
    </footer>
  );
};

export default LandingFooter;
