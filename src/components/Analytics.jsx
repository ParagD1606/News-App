import React, { useMemo } from "react";
import { HiChartBar } from "react-icons/hi";
// Assumed Imports (REQUIRES INSTALLATION: npm install chart.js react-chartjs-2)
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

// --- STOP WORDS & UTILITIES (Keeping these functions as they were) ---

// A comprehensive list of common English words to ignore
const STOP_WORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'but', 'by', 'for', 'if', 'in',
  'into', 'is', 'it', 'no', 'not', 'of', 'on', 'or', 'such', 'that', 'the',
  'their', 'then', 'there', 'these', 'they', 'this', 'to', 'was', 'will', 'with',
  'from', 'i', 'you', 'he', 'she', 'we', 'us', 'my', 'your', 'his', 'her', 'our',
  'article', 'news', 'said', 'say', 'year', 'week', 'day', 'can', 'just', 'like',
  'get', 'new', 'time', 'also', 'one', 'two', 'has', 'would', 'could', 'which', 
  'more', 'about', 'out', 'up', 'down', 'back', 'make', 'may', 'must', 'only',
  'do', 'did', 'have', 'had', 'been', 'use', 'using', 'according', 'source', 
  'report', 'read', 'know', 'story', 'post', 'show', 'will', 'go', 'find', 'people', 
  'than', 'them', 'when', 'what', 'where', 'why', 'who', 'how', 'its', 'their', 'our', 
  'all', 'any', 'most', 'some', 'much', 'many', 'very', 'up', 'down', 'over', 'under', 
  'before', 'after', 'while', 'when', 'what', 'where', 'why', 'who', 'whom', 'whose',
  'since', 'until', 'upon', 'through', 'into', 'onto', 'off', 'off', 'between', 
  'among', 'around', 'above', 'below', 'next', 'last', 'first', 'second', 'third',
  'like', 'than', 'then', 'so', 'we', 'us', 'our', 'them', 'they', 'their'
]);

// Function to clean text and count word frequencies
const getWordFrequencies = (articles) => {
  const allText = articles
    .map(a => `${a.title} ${a.description || ''}`)
    .join(' ')
    .toLowerCase();

  const cleanedText = allText.replace(/[^a-z\s]/g, ' ');

  const words = cleanedText.split(/\s+/).filter(word => 
    word.length >= 4 && !STOP_WORDS.has(word)
  );

  const counts = words.reduce((acc, word) => {
    acc[word] = (acc[word] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(counts)
    .map(([text, value]) => ({ text, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 100);
};

// Function to calculate source distribution
const calculateSourceDistribution = (articles) => {
  const counts = articles.reduce((acc, article) => {
    const sourceName = article.source?.name || "Unknown Source";
    acc[sourceName] = (acc[sourceName] || 0) + 1;
    return acc;
  }, {});
  
  const sortedData = Object.entries(counts).sort(([, a], [, b]) => b - a);
  const topSources = sortedData.slice(0, 8);
  const otherCount = sortedData.slice(8).reduce((sum, [, count]) => sum + count, 0);

  const finalData = topSources.map(([label, value]) => ({ label, value }));
  if (otherCount > 0) {
    finalData.push({ label: 'Other Sources', value: otherCount });
  }

  return finalData;
};

const generateColors = (count) => {
  const colors = [
    '#3b82f6', '#f59e0b', '#10b981', '#ef4444', '#6366f1', 
    '#ec4899', '#84cc16', '#64748b', '#a855f7',
  ];
  return Array.from({ length: count }, (_, i) => colors[i % colors.length]);
};

// --- COMPONENT ---

const Analytics = ({ articles, currentCategory, searchQuery }) => {
  const sourceData = useMemo(() => calculateSourceDistribution(articles), [articles]);
  const wordData = useMemo(() => getWordFrequencies(articles), [articles]);
  const totalArticles = articles.length;

  const context = searchQuery 
    ? `Results for "${searchQuery}"`
    : currentCategory === "general"
    ? "Top Headlines"
    : `${currentCategory.charAt(0).toUpperCase() + currentCategory.slice(1)} News`;

  if (totalArticles === 0) {
    // ... (Empty state is fine as is)
    return (
        <div className="max-w-7xl mx-auto p-6 pt-24 min-h-screen">
          <h2 className="text-4xl font-extrabold mb-6 text-gray-900 dark:text-white">
            News Analytics
          </h2>
          <div className="text-center py-10 text-xl text-gray-700 dark:text-gray-300">
            No articles available to generate analytics.
          </div>
        </div>
      );
  }

  const pieData = {
    labels: sourceData.map(item => item.label),
    datasets: [
      {
        label: '# of Articles',
        data: sourceData.map(item => item.value),
        backgroundColor: generateColors(sourceData.length),
        borderColor: ['#ffffff'],
        borderWidth: 1,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
        labels: { color: 'rgb(156, 163, 175)' }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.parsed || 0;
            const percentage = ((value / totalArticles) * 100).toFixed(1);
            return `${label}: ${value} articles (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="max-w-7xl mx-auto p-6 pt-24 min-h-screen">
      {/* IMPROVED: Header with better styling */}
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end border-b border-blue-500/50 pb-3">
        <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3">
          <HiChartBar className="w-9 h-9 text-blue-600" />
          News Analytics Dashboard
        </h2>
        <p className="text-lg font-medium text-gray-600 dark:text-gray-400 mt-2 sm:mt-0">
            Analyzing <span className="font-bold text-blue-500">{totalArticles}</span> articles in **{context}**
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* === LEFT COLUMN: SOURCE DISTRIBUTION PIE CHART === */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl dark:shadow-gray-950/50 border border-gray-100 dark:border-gray-700">
          <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white border-b pb-2 border-gray-200 dark:border-gray-700/70">
            Source Distribution
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Breakdown of articles by news source.
          </p>
          <div className="max-w-xl mx-auto p-4 h-96 flex items-center justify-center">
              {/* Requires 'react-chartjs-2' */}
              <Pie data={pieData} options={pieOptions} />
          </div>
        </div>

        {/* === RIGHT COLUMN: WORD CLOUD (Styled List) === */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl dark:shadow-gray-950/50 border border-gray-100 dark:border-gray-700">
          <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white border-b pb-2 border-gray-200 dark:border-gray-700/70">
            Frequent Terms Word Cloud
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Top 30 keywords extracted from titles and descriptions.
          </p>
          <div className="w-full max-h-[30rem] overflow-y-auto p-2 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex flex-wrap gap-2">
                  {wordData.slice(0, 30).map((word, index) => (
                      <span 
                          key={index} 
                          // IMPROVED: Better color selection and dynamic font size for a "cloud" look
                          className="px-3 py-1 rounded-full text-white dark:text-gray-900 bg-blue-500 dark:bg-blue-300 transition hover:scale-105"
                          style={{ 
                              fontSize: `${14 + (word.value / wordData[0].value) * 20}px`,
                              opacity: `${0.5 + (word.value / wordData[0].value) * 0.5}`,
                              fontWeight: 700
                          }} 
                          title={`Count: ${word.value}`}
                      >
                          {word.text}
                      </span>
                  ))}
              </div>
              <p className="mt-4 text-xs text-gray-400 dark:text-gray-500">
                  Tip: The size reflects frequency. Install `react-wordcloud` for a visual rotation and layout.
              </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Analytics;