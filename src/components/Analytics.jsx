import React, { useMemo } from "react";
import { HiChartBar } from "react-icons/hi";
import { Pie, Bar, Line } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement, TimeScale, Title } from "chart.js";
import 'chartjs-adapter-date-fns';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  TimeScale,
  Title
);

// ================== STOP WORDS ==================
const STOP_WORDS = new Set([
  "a","an","and","are","as","at","be","but","by","for","if","in","into","is","it","no",
  "not","of","on","or","such","that","the","their","then","there","these","they","this",
  "to","was","will","with","from","i","you","he","she","we","us","my","your","his","her",
  "our","article","news","said","say","year","week","day","can","just","like","get","new",
  "time","also","one","two","has","would","could","which","more","about","out","up","down",
  "back","make","may","must","only","do","did","have","had","been","use","using","according",
  "source","report","read","know","story","post","show","will","go","find","people","than",
  "them","when","what","where","why","who","how","its","their","our","all","any","most",
  "some","much","many","very","up","down","over","under","before","after","while","when",
  "what","where","why","who","whom","whose","since","until","upon","through","into","onto",
  "off","between","among","around","above","below","next","last","first","second","third",
  "like","than","then","so","we","us","our","them","they","their"
]);

// ================== HELPERS ==================
const getWordFrequencies = (articles) => {
  const text = articles.map(a => `${a.title} ${a.description || ""}`).join(" ").toLowerCase();
  const cleaned = text.replace(/[^a-z\s]/g, " ");
  const words = cleaned.split(/\s+/).filter(w => w.length >= 4 && !STOP_WORDS.has(w));

  const counts = words.reduce((acc, w) => {
    acc[w] = (acc[w] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(counts)
    .map(([text, value]) => ({ text, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 100);
};

const calculateSourceDistribution = (articles) => {
  const counts = articles.reduce((acc, a) => {
    const source = a.source?.name || "Unknown";
    acc[source] = (acc[source] || 0) + 1;
    return acc;
  }, {});

  const sorted = Object.entries(counts).sort(([, a], [, b]) => b - a);
  const top = sorted.slice(0, 8);
  const others = sorted.slice(8).reduce((sum, [, c]) => sum + c, 0);

  const final = top.map(([label, value]) => ({ label, value }));
  if (others > 0) final.push({ label: "Other Sources", value: others });

  return final;
};

const calculateCategoryDistribution = (articles) => {
  const counts = articles.reduce((acc, a) => {
    const category = a.category || "General";
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});

  const sorted = Object.entries(counts).sort(([, a], [, b]) => b - a);
  return sorted.map(([label, value]) => ({ label, value }));
};

const calculateTimeSeries = (articles) => {
  const counts = {};
  const now = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(now.getDate() - i);
    const key = d.toISOString().slice(0,10);
    counts[key] = 0;
  }

  articles.forEach(a => {
    const date = new Date(a.publishedAt).toISOString().slice(0,10);
    if (counts[date] !== undefined) counts[date]++;
  });

  return Object.entries(counts).map(([date, value]) => ({ date, value })).reverse();
};

const generateColors = (count) => {
  const colors = [
    "#3b82f6", "#f59e0b", "#10b981", "#ef4444", "#6366f1", 
    "#ec4899", "#84cc16", "#64748b", "#a855f7",
  ];
  return Array.from({ length: count }, (_, i) => colors[i % colors.length]);
};

// ================== MAIN COMPONENT ==================
const Analytics = ({ articles, currentCategory, searchQuery }) => {
  const sourceData = useMemo(() => calculateSourceDistribution(articles), [articles]);
  const wordData = useMemo(() => getWordFrequencies(articles), [articles]);
  const categoryData = useMemo(() => calculateCategoryDistribution(articles), [articles]);
  const timeData = useMemo(() => calculateTimeSeries(articles), [articles]);
  const totalArticles = articles.length;

  const context = searchQuery 
    ? `Results for "${searchQuery}"`
    : currentCategory === "general"
    ? "Top Headlines"
    : `${currentCategory.charAt(0).toUpperCase() + currentCategory.slice(1)} News`;

  if (totalArticles === 0) {
    return (
      <div className="max-w-7xl mx-auto p-6 pt-24 min-h-screen flex flex-col justify-center items-center text-center">
        <h2 className="text-4xl font-extrabold mb-4 text-gray-900 dark:text-white">News Analytics</h2>
        <p className="text-lg text-gray-600 dark:text-gray-400">No articles available to generate analytics.</p>
      </div>
    );
  }

  const pieData = {
    labels: sourceData.map(d => d.label),
    datasets: [
      {
        label: "# of Articles",
        data: sourceData.map(d => d.value),
        backgroundColor: generateColors(sourceData.length),
        borderColor: "#fff",
        borderWidth: 2,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "right",
        labels: { color: "rgb(156,163,175)", font: { size: 14 } },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.parsed || 0;
            const percent = ((value / totalArticles) * 100).toFixed(1);
            return `${context.label}: ${value} articles (${percent}%)`;
          },
        },
      },
    },
  };

  const barData = {
    labels: categoryData.map(d => d.label),
    datasets: [
      {
        label: "# of Articles",
        data: categoryData.map(d => d.value),
        backgroundColor: generateColors(categoryData.length),
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => `${context.label}: ${context.parsed.y} articles`,
        },
      },
    },
    scales: {
      x: { ticks: { color: "rgb(156,163,175)" } },
      y: { ticks: { color: "rgb(156,163,175)" }, beginAtZero: true },
    },
  };

  const lineData = {
    labels: timeData.map(d => d.date),
    datasets: [
      {
        label: "# of Articles",
        data: timeData.map(d => d.value),
        fill: false,
        borderColor: "#3b82f6",
        backgroundColor: "#3b82f6",
        tension: 0.3,
        pointRadius: 5,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    plugins: { legend: { labels: { color: "rgb(156,163,175)" } } },
    scales: {
      x: { ticks: { color: "rgb(156,163,175)" } },
      y: { ticks: { color: "rgb(156,163,175)" }, beginAtZero: true },
    },
  };

  return (
    <div className="max-w-7xl mx-auto p-6 pt-24 min-h-screen space-y-10">
      {/* HEADER */}
      <div className="mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-end border-b border-blue-500/30 pb-4">
        <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3">
          <HiChartBar className="w-9 h-9 text-blue-600" />
          News Analytics Dashboard
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 mt-3 sm:mt-0">
          Analyzing <span className="font-bold text-blue-500">{totalArticles}</span> articles in <span className="font-semibold text-blue-400">“{context}”</span>
        </p>
      </div>

      {/* GRID CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* PIE CHART */}
        <div className="bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 p-6 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 transition transform hover:scale-[1.01]">
          <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white border-b pb-2 border-gray-200 dark:border-gray-700">Source Distribution</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Breakdown of articles by source.</p>
          <div className="flex justify-center items-center h-96">
            <Pie data={pieData} options={pieOptions} />
          </div>
        </div>

        {/* CATEGORY BAR CHART */}
        <div className="bg-gradient-to-b from-white to-blue-50 dark:from-gray-800 dark:to-gray-900 p-6 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 transition transform hover:scale-[1.01]">
          <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white border-b pb-2 border-gray-200 dark:border-gray-700">Articles by Category</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Number of articles per category.</p>
          <div className="flex justify-center items-center h-96">
            <Bar data={barData} options={barOptions} />
          </div>
        </div>
      </div>

      {/* WORD CLOUD */}
      <div className="bg-gradient-to-b from-white to-blue-50 dark:from-gray-800 dark:to-gray-900 p-6 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 transition transform hover:scale-[1.01]">
        <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white border-b pb-2 border-gray-200 dark:border-gray-700">Frequent Terms Word Cloud</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Top 30 recurring keywords in titles & descriptions.</p>
        <div className="w-full max-h-[28rem] overflow-y-auto p-3 rounded-lg bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap gap-3">
            {wordData.slice(0, 30).map((word, index) => (
              <span
                key={index}
                className="px-3 py-1 rounded-full text-white bg-gradient-to-r from-blue-500 to-indigo-500 dark:from-blue-400 dark:to-purple-400 transition-all duration-300 hover:scale-110 cursor-default"
                style={{
                  fontSize: `${14 + (word.value / wordData[0].value) * 20}px`,
                  opacity: `${0.6 + (word.value / wordData[0].value) * 0.4}`,
                  fontWeight: 700,
                }}
                title={`Count: ${word.value}`}
              >
                {word.text}
              </span>
            ))}
          </div>
          <p className="mt-4 text-xs text-gray-400 dark:text-gray-500 italic text-center">
            Tip: Word size & opacity represent frequency.
          </p>
        </div>
      </div>

      {/* TIME SERIES LINE CHART */}
      <div className="bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 p-6 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 transition transform hover:scale-[1.01]">
        <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white border-b pb-2 border-gray-200 dark:border-gray-700">Articles Over Last 7 Days</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Daily article count trend.</p>
        <div className="flex justify-center items-center h-96">
          <Line data={lineData} options={lineOptions} />
        </div>
      </div>
    </div>
  );
};

export default Analytics;
