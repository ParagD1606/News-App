import axios from "axios";

const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = import.meta.env.VITE_BASE_URL;

// Supported countries only
export const SUPPORTED_COUNTRIES = ["us", "in", "cn", "ru", "jp"];

// Fetch top headlines for a given category, query, and country
export const fetchTopHeadlines = async (
  category = "general",
  query = "",
  country = "us"
) => {
  try {
    if (!SUPPORTED_COUNTRIES.includes(country)) country = "us";

    const res = await axios.get(`${BASE_URL}/top-headlines`, {
      params: {
        apiKey: API_KEY,
        country,
        category,
        ...(query && { q: query }),
        pageSize: 100,
      },
    });

    return res.data.articles || [];
  } catch (err) {
    console.error("News fetch error:", err);
    return [];
  }
};
