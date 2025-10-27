import axios from "axios";

const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = import.meta.env.VITE_BASE_URL;

// Supported countries (free-tier compatible)
export const SUPPORTED_COUNTRIES = [
  { code: "us", name: "United States" },
  { code: "gb", name: "United Kingdom" },
  { code: "de", name: "Germany" },
  { code: "jp", name: "Japan" },
  { code: "in", name: "India" },
];

export const fetchTopHeadlines = async (
  category = "general",
  query = "",
  country = "us"
) => {
  try {
    const res = await axios.get(`${BASE_URL}/top-headlines`, {
      params: {
        apiKey: API_KEY,
        country,
        category,
        ...(query && { q: query }),
        pageSize: 12,
      },
    });

    const articles = res.data.articles || [];

    // Fallback for other countries
    if (articles.length === 0) {
      let fallbackQuery = "";

      switch (country) {
        case "in":
          fallbackQuery = "India";
          break;
        case "gb":
          fallbackQuery = "United Kingdom";
          break;
        case "de":
          fallbackQuery = "Germany";
          break;
        case "jp":
          fallbackQuery = "Japan";
          break;
        default:
          fallbackQuery = "World";
      }

      const fallback = await axios.get(`${BASE_URL}/everything`, {
        params: {
          apiKey: API_KEY,
          q: fallbackQuery,
          sortBy: "publishedAt",
          pageSize: 20,
        },
      });

      console.warn(`Using fallback 'everything' endpoint for ${fallbackQuery}`);
      return fallback.data.articles || [];
    }

    return articles;
  } catch (err) {
    console.error("News fetch error:", err);
    return [];
  }
};
