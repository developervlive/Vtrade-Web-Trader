import React, { useState, useEffect, useRef } from "react";
import logoBlack from "./Logo-vtrade-black.png";
import logoWhite from "./Logo-VTrade-White.png";
import { useNavigate } from "react-router-dom";
import {
  FaApple,
  FaMicrosoft,
  FaAmazon,
  FaGoogle,
  FaBitcoin,
  FaEthereum,
  FaBars,
} from "react-icons/fa";
import { SiTesla, SiBinance } from "react-icons/si";

const FINNHUB_API_KEY = "d2e4821r01qjrul5up50d2e4821r01qjrul5up5g";

const ASSETS = [
  { symbol: "AAPL", display: "AAPL", type: "stock", icon: <FaApple /> },
  { symbol: "TSLA", display: "TSLA", type: "stock", icon: <SiTesla /> },
  { symbol: "AMZN", display: "AMZN", type: "stock", icon: <FaAmazon /> },
  { symbol: "MSFT", display: "MSFT", type: "stock", icon: <FaMicrosoft /> },
  { symbol: "GOOGL", display: "GOOGL", type: "stock", icon: <FaGoogle /> },
  {
    symbol: "BINANCE:BTCUSDT",
    display: "BTC/USD",
    type: "crypto",
    icon: <FaBitcoin />,
  },
  {
    symbol: "BINANCE:ETHUSDT",
    display: "ETH/USD",
    type: "crypto",
    icon: <FaEthereum />,
  },
  {
    symbol: "BINANCE",
    display: "Binance",
    type: "crypto",
    icon: <SiBinance />,
  },
];

const tabs = ["Deals", "Orders", "History", "Net Deals", "News", "Alerts"];

const tableColumns = [
  "Script",
  "Ticket ID",
  "Date/Time",
  "Type",
  "Amount",
  "Open Price",
  "Current Price",
  "Commission",
  "Margin",
  "SL",
];

const ordersData = [
  {
    script: "AAPL",
    ticket: "99871",
    datetime: "2025-08-14 12:31",
    type: "Buy",
    amount: "15",
    oprice: "$164.30",
    cprice: "$168.13",
    commission: "$3.00",
    margin: "$1200",
    sl: "$159",
  },
  {
    script: "TSLA",
    ticket: "99872",
    datetime: "2025-08-14 10:03",
    type: "Sell",
    amount: "5",
    oprice: "$705.50",
    cprice: "$710.11",
    commission: "$2.10",
    margin: "$1000",
    sl: "$698",
  },
];

const dealsData = [
  {
    script: "GOOGL",
    ticket: "97005",
    datetime: "2025-08-13 13:40",
    type: "Buy",
    amount: "8",
    oprice: "$2725.12",
    cprice: "$2731.55",
    commission: "$4.00",
    margin: "$2200",
    sl: "$2720",
  },
];

const historyData = [
  {
    script: "AMZN",
    ticket: "90007",
    datetime: "2025-08-10 15:03",
    type: "Sell",
    amount: "3",
    oprice: "$3400.00",
    cprice: "$3442.10",
    commission: "$1.80",
    margin: "$1350",
    sl: "$3382",
  },
];

const netDealsData = [
  {
    script: "AAPL",
    ticket: "99871",
    datetime: "2025-08-14 12:31",
    type: "Buy",
    amount: "15",
    oprice: "$164.30",
    cprice: "$168.13",
    commission: "$3.00",
    margin: "$1200",
    sl: "$159",
    netPnl: "+$57.45",
  },
];

const newsData = [
  {
    script: "Market News",
    ticket: "N001",
    datetime: "2025-08-14 14:00",
    type: "Update",
    amount: "-",
    oprice: "-",
    cprice: "-",
    commission: "-",
    margin: "-",
    sl: "-",
  },
];

const alertsData = [
  {
    script: "TSLA",
    ticket: "A001",
    datetime: "2025-08-14 13:45",
    type: "Alert",
    amount: "-",
    oprice: "-",
    cprice: "-",
    commission: "-",
    margin: "-",
    sl: "-",
  },
];

function getTabData(tab) {
  switch (tab) {
    case "Deals":
      return dealsData;
    case "Orders":
      return ordersData;
    case "History":
      return historyData;
    case "Net Deals":
      return netDealsData;
    case "News":
      return newsData;
    case "Alerts":
      return alertsData;
    default:
      return [];
  }
}

function getRecentAllData() {
  const combined = [
    ...dealsData.map((d) => ({ ...d, category: "Deals" })),
    ...ordersData.map((d) => ({ ...d, category: "Orders" })),
    ...historyData.map((d) => ({ ...d, category: "History" })),
    ...netDealsData.map((d) => ({ ...d, category: "Net Deals" })),
  ];
  combined.sort((a, b) => new Date(b.datetime) - new Date(a.datetime));
  return combined.slice(0, 5);
}

async function fetchFinnhubQuote(symbol) {
  try {
    const response = await fetch(
      `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`
    );
    const data = await response.json();
    if (data.c) {
      return {
        bid: data.p ? data.p : data.c * 0.999,
        ask: data.p ? data.p : data.c * 1.001,
        price: data.c,
        change: data.dp || 0,
      };
    }
  } catch (err) {
    console.error(`Error fetching ${symbol}:`, err);
  }
  return null;
}

async function fetchQuotes(assetList) {
  const results = [];
  for (const asset of assetList) {
    let quoteData = null;
    try {
      quoteData = await fetchFinnhubQuote(asset.symbol);
      if (quoteData) {
        results.push({
          ...asset,
          bid: quoteData.bid,
          ask: quoteData.ask,
          price: quoteData.price,
          change: Math.abs(quoteData.change).toFixed(2),
          changeDirection: quoteData.change >= 0 ? "up" : "down",
        });
      } else {
        results.push({
          ...asset,
          bid: 0,
          ask: 0,
          price: 0,
          change: "0.00",
          changeDirection: "up",
        });
      }
    } catch (err) {
      console.error(`Error processing ${asset.symbol}:`, err);
      results.push({
        ...asset,
        bid: null,
        ask: null,
        price: null,
        change: null,
      });
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  return results;
}

function getChartSymbol(asset) {
  if (asset.type === "stock") return asset.symbol;
  if (asset.type === "crypto")
    return `BINANCE:${asset.symbol.replace("BINANCE:", "")}`;
  if (asset.type === "forex") return asset.symbol.replace("OANDA:", "FX:");
  return asset.symbol;
}

const formatPrice = (price) => {
  if (price === null || price === undefined) return "--";
  const num = parseFloat(price);
  if (isNaN(num)) return "--";
  if (num > 1000) {
    return num.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
  if (num < 10) {
    return num.toFixed(5);
  }
  return num.toFixed(2);
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [quotes, setQuotes] = useState(
    ASSETS.map((a) => ({
      ...a,
      bid: null,
      ask: null,
      price: null,
      change: null,
    }))
  );
  const [selectedAsset, setSelectedAsset] = useState(ASSETS[0]);
  const [activeTab, setActiveTab] = useState("Orders");
  const [orders, setOrders] = useState([]);
  const [showBalance, setShowBalance] = useState(true);
  const [showRecent, setShowRecent] = useState(false);
  const [theme, setTheme] = useState("dark");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const chartRefDesktop = useRef(null);

  const accountDetails = {
    Balance: "-3,678.00",
    "Free Margin": "-3,678.00",
    "Used Margin": "0.00",
    "Asset Value": "0.00",
    "Margin Level": "0%",
    "Account ID": "8951957740",
    Credit: "0.00",
  };

  // Logout functionality
  const handleLogout = () => {
    // For now, just navigate to login page
    // Later we'll integrate API logout
    navigate("/");
  };

  useEffect(() => {
    let cancelled = false;
    async function updateQuotes() {
      const newQuotes = await fetchQuotes(ASSETS);
      if (!cancelled) setQuotes(newQuotes || []);
    }
    updateQuotes();
    const timer = setInterval(updateQuotes, 60000);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    const container = document.getElementById("tv_chart_desktop");
    if (!container) return;
    container.innerHTML = "";
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;
    script.onload = () => {
      if (window.TradingView) {
        new window.TradingView.widget({
          autosize: true,
          symbol: getChartSymbol(selectedAsset),
          interval: "15",
          timezone: "Etc/UTC",
          theme: theme,
          style: "1",
          locale: "en",
          container_id: "tv_chart_desktop",
        });
      }
    };
    container.appendChild(script);
  }, [selectedAsset, theme]);

  const handleAssetClick = (asset) => setSelectedAsset(asset);

  const isDark = theme === "dark";

  return (
    <div
      className={`min-h-screen font-sans flex flex-col transition-colors duration-300 ${
        isDark ? "bg-[#0e0f1a] text-gray-100" : "bg-[#f5f6fa] text-gray-900"
      }`}
    >
      {/* Top bar */}
      <div
        className={`flex items-center justify-between px-4 md:px-6 py-3 border-b transition-colors duration-300 ${
          isDark
            ? "bg-gradient-to-r from-[#1a1b2e] to-[#252841] border-[#2d3150]"
            : "bg-white border-gray-300 shadow-sm"
        }`}
      >
        <div className="flex items-center gap-3">
          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <FaBars className={isDark ? "text-white" : "text-gray-800"} />
          </button>

          {/* Logo - using logo-white for dark mode and logo-dark for light mode */}
          <img
            src={isDark ? logoWhite : logoBlack}
            alt="V Trade Logo"
            className="w-8 h-8 md:w-10 md:h-10 object-contain"
          />
          {/* <span
            className={`text-lg font-bold ${
              isDark ? "text-white" : "text-gray-800"
            }`}
          >
            V Trade
          </span> */}

          {/* Balance toggle - hidden on mobile */}
          <div className="hidden md:flex items-center gap-2 ml-4">
            <span
              className={`text-sm ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {showBalance ? "Hide Balance" : "Show Balance"}
            </span>
            <button
              onClick={() => setShowBalance((s) => !s)}
              className={`relative w-14 h-7 rounded-full transition ${
                showBalance
                  ? "bg-[#FF6000]"
                  : isDark
                  ? "bg-[#2a3040]"
                  : "bg-gray-300"
              }`}
            >
              <span
                className={`absolute top-0.5 ${
                  showBalance ? "left-7" : "left-1"
                } w-6 h-6 rounded-full transition shadow-md ${
                  isDark ? "bg-white" : "bg-gray-100"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div
            className={`absolute top-16 left-0 right-0 z-50 p-4 border-b transition-colors duration-300 md:hidden ${
              isDark
                ? "bg-[#1a1b2e] border-[#2d3150]"
                : "bg-white border-gray-300"
            }`}
          >
            <div className="flex flex-col space-y-3">
              <div className="flex items-center justify-between">
                <span className={isDark ? "text-[#6b7a99]" : "text-gray-600"}>
                  Show Balance
                </span>
                <button
                  onClick={() => setShowBalance((s) => !s)}
                  className={`relative w-14 h-7 rounded-full transition ${
                    showBalance
                      ? "bg-[#FF6000]"
                      : isDark
                      ? "bg-[#2a3040]"
                      : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 ${
                      showBalance ? "left-7" : "left-1"
                    } w-6 h-6 rounded-full transition shadow-md ${
                      isDark ? "bg-white" : "bg-gray-100"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Dark/Light mode toggle + account info */}
        <div className="flex items-center gap-4 md:gap-6 text-sm font-semibold">
          {/* Theme Toggle */}
          <button
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className={`relative w-12 h-6 md:w-14 md:h-7 rounded-full cursor-pointer transition-colors duration-300 ${
              isDark ? "bg-gray-700" : "bg-blue-500"
            }`}
          >
            <div
              className={`absolute top-0.5 w-5 h-5 md:w-6 md:h-6 rounded-full bg-yellow-400 shadow-md transition-transform duration-300 ${
                isDark ? "left-1" : "left-6 md:left-7"
              } flex items-center justify-center`}
            >
              {isDark ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-3 h-3 md:w-4 md:h-4 text-gray-900"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m8.485-8.485h-1M4.515 12.515h-1m15.364 4.95l-.707-.707M6.343 6.343l-.707-.707M18.364 18.364l-.707-.707M6.343 17.657l-.707-.707"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-3 h-3 md:w-4 md:h-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
                  />
                </svg>
              )}
            </div>
          </button>

          <span
            className={`hidden sm:inline ${
              isDark ? "text-[#f5f7fc]" : "text-gray-800"
            }`}
          >
            Account: {accountDetails["Account ID"]}
          </span>

          {/* Logout Button - Replaced Dashboard button */}
          <button
            onClick={handleLogout}
            className={`px-3 py-1 rounded-md shadow-md text-white cursor-pointer text-sm md:text-base bg-[#FF6000] hover:bg-[#FF6000]/90 transition-colors duration-300`}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Balance strip */}
      {showBalance && (
        <div
          className={`px-4 md:px-6 py-3 border-b transition-colors duration-300 overflow-x-auto ${
            isDark
              ? "bg-gradient-to-r from-[#1a1b2e] to-[#252841] border-[#2d3150]"
              : "bg-white border-gray-300 shadow-sm"
          }`}
        >
          <div className="flex items-center gap-4 md:gap-8 text-sm min-w-max">
            <div className="flex items-center gap-2">
              <div
                className={`w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center text-xs ${
                  isDark
                    ? "bg-[#252d3d] text-[#6b7a99]"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                💳
              </div>
              <span className={isDark ? "text-[#6b7a99]" : "text-gray-600"}>
                Balance :
              </span>
              <span className={isDark ? "text-[#ff5b5b]" : "text-red-600"}>
                {accountDetails.Balance}
              </span>
            </div>
            <span className={isDark ? "text-[#6b7a99]" : "text-gray-600"}>
              Free Margin :{" "}
              <b className={isDark ? "text-[#ff5b5b]" : "text-red-600"}>
                {accountDetails["Free Margin"]}
              </b>
            </span>
            <span className={isDark ? "text-[#6b7a99]" : "text-gray-600"}>
              Total PnL :{" "}
              <b className={isDark ? "text-white" : "text-gray-900"}>0.00</b>
            </span>
            <span className={isDark ? "text-[#6b7a99]" : "text-gray-600"}>
              Equity :{" "}
              <b className={isDark ? "text-[#ff5b5b]" : "text-red-600"}>
                {accountDetails["Balance"]}
              </b>
            </span>
            <span className={isDark ? "text-[#6b7a99]" : "text-gray-600"}>
              Used Margin :{" "}
              <b className={isDark ? "text-white" : "text-gray-900"}>
                {accountDetails["Used Margin"]}
              </b>
            </span>
            <span className={isDark ? "text-[#6b7a99]" : "text-gray-600"}>
              Credit :{" "}
              <b className={isDark ? "text-white" : "text-gray-900"}>
                {accountDetails["Credit"]}
              </b>
            </span>
          </div>
        </div>
      )}

      {/* Asset Selection Bar */}
      <div
        className={`flex flex-nowrap items-center overflow-x-auto gap-2 px-2 py-2 border-b transition-colors duration-300 scrollbar-hide ${
          isDark ? "bg-[#1a1b2e] border-[#2d3150]" : "bg-white border-gray-300"
        }`}
      >
        {quotes.map((q) => (
          <div
            key={q.symbol}
            onClick={() => handleAssetClick(q)}
            style={{ minWidth: "64px" }}
            className={`flex items-center gap-1 px-3 py-2 mx-1 rounded-xl cursor-pointer transition-all duration-200 select-none flex-shrink-0 ${
              selectedAsset.symbol === q.symbol
                ? isDark
                  ? "bg-[#FF6000] text-white shadow-lg"
                  : "bg-[#FF6000] text-white shadow-md"
                : isDark
                ? "bg-[#252841] text-[#b8c2d8] hover:bg-[#2d3150] hover:text-white"
                : "bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-blue-900"
            }`}
          >
            <span className="text-xl">{q.icon}</span>
            <span className="font-bold text-sm">{q.display}</span>
          </div>
        ))}
        <div
          className={`w-8 h-8 flex items-center justify-center rounded-xl cursor-pointer shadow-md select-none flex-shrink-0 ${
            isDark ? "bg-[#FF6000] text-white" : "bg-[#FF6000] text-white"
          } ml-2`}
        >
          +
        </div>
      </div>

      {/* Main grid - Responsive layout */}
      <div className="flex-1 px-2 md:px-4 py-2 md:py-3 grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-3 mb-4 md:mb-6">
        {/* Mobile Trading View - Only show on mobile */}
        <div className="md:hidden block w-full h-64 mb-4">
          <div
            className={`rounded-xl border overflow-hidden shadow-lg transition-colors duration-300 h-full ${
              isDark
                ? "bg-[#1a1b2e] border-[#2d3150]"
                : "bg-white border-gray-300"
            }`}
          >
            <div
              className={`p-3 border-b flex justify-between items-center transition-colors duration-300 ${
                isDark
                  ? "bg-gradient-to-r from-[#252841] to-[#1a1b2e] border-[#2d3150] text-white"
                  : "bg-gray-100 border-gray-300 text-gray-800"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="font-semibold">{selectedAsset.symbol}</span>
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    isDark
                      ? "bg-[#1a1b2e] text-[#6b7a99]"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  15m
                </span>
              </div>
            </div>
            <div
              id="tv_chart_mobile"
              style={{ height: "calc(100% - 50px)", width: "100%" }}
            />
          </div>
        </div>

        {/* Instruments Sidebar - Full width on mobile, 3 cols on desktop */}
        <div
          className={`col-span-1 md:col-span-3 rounded-xl border overflow-hidden flex flex-col shadow-lg transition-colors duration-300 ${
            isDark
              ? "bg-[#1a1b2e] border-[#2d3150]"
              : "bg-white border-gray-300"
          }`}
          style={{
            height: "400px",
            maxHeight: "400px",
          }}
        >
          <div
            className={`p-3 border-b flex justify-between font-semibold text-sm transition-colors duration-300 ${
              isDark
                ? "bg-gradient-to-r from-[#252841] to-[#1a1b2e] border-[#2d3150] text-white"
                : "bg-gray-100 border-gray-300 text-gray-800"
            }`}
          >
            INSTRUMENTS
          </div>
          <div
            className={`px-3 py-2 border-b transition-colors duration-300 ${
              isDark
                ? "bg-[#1a1b2e] border-[#2d3150]"
                : "bg-white border-gray-300"
            }`}
          >
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full rounded-lg border px-3 py-2 text-xs transition-colors duration-300 placeholder-gray-400 focus:outline-none focus:ring-1 ${
                isDark
                  ? "bg-[#252841] border-[#2d3150] text-white focus:ring-[#00b8ff]"
                  : "bg-gray-100 border-gray-300 text-gray-900 focus:ring-blue-500"
              }`}
              placeholder="Search"
            />
          </div>
          <div
            className="overflow-y-auto flex-1"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            <table className="w-full text-xs">
              <thead>
                <tr
                  className={`${
                    isDark
                      ? "bg-[#252841] text-[#a5ee88]"
                      : "bg-blue-100 text-blue-900"
                  }`}
                >
                  <th className="px-2 py-2 text-left">Symbol</th>
                  <th className="px-2 py-2 text-right">Signal</th>
                  <th className="px-2 py-2 text-right">Bid</th>
                  <th className="px-2 py-2 text-right">Ask</th>
                </tr>
              </thead>
              <tbody>
                {(quotes || [])
                  .filter(
                    (q) =>
                      !searchTerm ||
                      q.symbol
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                      q.display.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((q, idx, arr) => (
                    <tr
                      key={q.symbol}
                      onClick={() => handleAssetClick(q)}
                      className={`cursor-pointer select-none transition-colors duration-300 ${
                        selectedAsset.symbol === q.symbol
                          ? isDark
                            ? "bg-[#2d3150] text-white"
                            : "bg-blue-100 text-blue-900"
                          : isDark
                          ? "text-[#c7d0e1] hover:bg-[#252841]"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                      style={{
                        borderBottom:
                          idx === arr.length - 1 ? "none" : "1px solid",
                        borderColor: isDark ? "#2d3150" : "#e0e0e0",
                      }}
                    >
                      <td className="px-2 py-2 font-medium flex gap-2 items-center">
                        <span className="text-lg">{q.icon}</span>
                        <span className="hidden sm:inline">{q.display}</span>
                        <span className="sm:hidden text-xs">{q.display}</span>
                      </td>
                      <td className="px-2 py-2 text-right">
                        {q.change ? (
                          <span
                            className={`${
                              q.changeDirection === "up"
                                ? isDark
                                  ? "text-[#00ff9d]"
                                  : "text-green-600"
                                : isDark
                                ? "text-red-400"
                                : "text-red-600"
                            }`}
                          >
                            {q.changeDirection === "up" ? "↑" : "↓"}{" "}
                            {Math.abs(q.change)}%
                          </span>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="px-2 py-2 text-right">
                        {q.bid !== null ? formatPrice(q.bid) : "--"}
                      </td>
                      <td className="px-2 py-2 text-right">
                        {q.ask !== null ? formatPrice(q.ask) : "--"}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Central Chart - Hidden on mobile, 6 cols on desktop */}
        <div
          className={`hidden md:flex md:col-span-6 flex-col rounded-xl border overflow-hidden shadow-lg transition-colors duration-300 ${
            isDark
              ? "bg-[#1a1b2e] border-[#2d3150]"
              : "bg-white border-gray-300"
          }`}
          style={{
            height: "400px",
            maxHeight: "400px",
          }}
        >
          <div
            className={`p-3 border-b flex justify-between items-center transition-colors duration-300 ${
              isDark
                ? "bg-gradient-to-r from-[#252841] to-[#1a1b2e] border-[#2d3150] text-white"
                : "bg-gray-100 border-gray-300 text-gray-800"
            }`}
            style={{ minHeight: 46 }}
          >
            <div className="flex items-center gap-2">
              <span className="font-semibold">{selectedAsset.symbol}</span>
              <span
                className={`text-xs px-2 py-1 rounded ${
                  isDark
                    ? "bg-[#1a1b2e] text-[#6b7a99]"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                15m
              </span>
            </div>
            <div className="flex gap-2">
              <button
                className={`text-xs px-2 py-1 rounded transition ${
                  isDark
                    ? "bg-[#252841] text-[#6b7a99] hover:bg-[#2d3150] hover:text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300 hover:text-gray-900"
                }`}
              >
                Indicators
              </button>
              <button
                className={`text-xs px-2 py-1 rounded transition ${
                  isDark
                    ? "bg-[#252841] text-[#6b7a99] hover:bg-[#2d3150] hover:text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300 hover:text-gray-900"
                }`}
              >
                Templates
              </button>
            </div>
          </div>
          <div
            ref={chartRefDesktop}
            id="tv_chart_desktop"
            style={{
              flex: 1,
              minHeight: 0,
              overflow: "hidden",
            }}
          />
        </div>

        {/* Trade Modal - Full width on mobile, 3 cols on desktop */}
        <div
          className={`col-span-1 md:col-span-3 rounded-xl border overflow-hidden shadow-lg transition-colors duration-300 ${
            isDark
              ? "bg-[#1a1b2e] border-[#2d3150]"
              : "bg-white border-gray-300"
          }`}
          style={{
            height: "400px",
            maxHeight: "400px",
          }}
        >
          <div
            style={{
              height: "100%",
              padding: "12px",
              overflowY: "auto",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
            className={`rounded-xl border shadow-lg transition-colors duration-300 ${
              isDark
                ? "bg-[#1a1b2e] border-[#2d3150]"
                : "bg-white border-blue-300"
            }`}
          >
            <TradeModal
              symbolObj={selectedAsset}
              quotes={quotes}
              onClose={() => {}}
              onSubmit={(side, qty) => {
                const q = quotes.find((x) => x.symbol === selectedAsset.symbol);
                setOrders([
                  {
                    id: Date.now().toString(),
                    script: selectedAsset.symbol,
                    datetime: new Date().toLocaleString(),
                    side,
                    amount: qty,
                    openPrice: q?.price ? q.price.toFixed(2) : "--",
                    currentPrice: q?.price ? q.price.toFixed(2) : "--",
                  },
                  ...orders,
                ]);
              }}
              isDark={isDark}
            />
          </div>
        </div>
      </div>

      {/* Bottom Tabs/Table */}
      <div
        className={`relative z-10 w-full border-t shadow-lg transition-colors duration-300 ${
          isDark ? "bg-[#1a1b2e] border-[#2d3150]" : "bg-white border-gray-300"
        }`}
      >
        <div className="w-full mx-auto px-2 md:px-3 py-2 md:py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
          <div className="flex space-x-1 overflow-x-auto w-full sm:w-auto">
            {tabs.map((t) => (
              <button
                key={t}
                className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors duration-300 whitespace-nowrap ${
                  activeTab === t
                    ? isDark
                      ? "border-[#00b8ff] text-white"
                      : "border-blue-600 text-blue-800"
                    : isDark
                    ? "border-transparent text-[#6b7a99] hover:text-white"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
                onClick={() => setActiveTab(t)}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="flex space-x-2 flex-shrink-0 self-end sm:self-auto">
            <button
              className={`px-3 py-2 rounded-lg font-medium text-white shadow-md transition-colors duration-300 text-sm ${
                isDark
                  ? "bg-[#FF6000] hover:bg-[#FF6000]/90"
                  : "bg-[#FF6000] hover:bg-[#FF6000]/90"
              }`}
              onClick={() => navigate("/profile")}
            >
              See All
            </button>
            <button
              className={`px-3 py-2 rounded-lg font-medium border-2 transition-colors duration-300 text-sm ${
                showRecent
                  ? isDark
                    ? "bg-[#FF6000] border-transparent text-white"
                    : "bg-[#FF6000] border-[#FF6000] text-white"
                  : isDark
                  ? "bg-transparent border-red-600 text-[#f5f0f2] hover:bg-[#FF6000]"
                  : "bg-transparent border-pink-600 text-pink-600 hover:bg-pink-100"
              }`}
              onClick={() => setShowRecent(!showRecent)}
            >
              Recent
            </button>
          </div>
        </div>
        <div
          className={`overflow-x-auto px-2 md:px-3 pb-2 md:pb-3 transition-colors duration-300 ${
            isDark ? "bg-[#1a1b2e]" : "bg-white"
          }`}
        >
          <div className="min-w-full" style={{ minWidth: "800px" }}>
            <table className="min-w-full text-xs">
              <thead>
                <tr
                  className={`transition-colors duration-300 ${
                    isDark
                      ? "text-[#6b7a99] bg-[#252841]"
                      : "text-gray-600 bg-gray-100"
                  }`}
                >
                  {tableColumns.map((col) => (
                    <th className="px-2 py-2 text-left" key={col}>
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(showRecent ? getRecentAllData() : getTabData(activeTab)).map(
                  (row, idx) => (
                    <tr
                      key={idx}
                      className={`border-b transition-colors duration-300 hover:cursor-pointer ${
                        isDark
                          ? "border-[#2d3150] hover:bg-[#252841]"
                          : "border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <td
                        className={`px-2 py-2 font-medium ${
                          isDark ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {row.script}
                      </td>
                      <td
                        className={`px-2 py-2 ${
                          isDark ? "text-[#c7d0e1]" : "text-gray-700"
                        }`}
                      >
                        {row.ticket}
                      </td>
                      <td
                        className={`px-2 py-2 ${
                          isDark ? "text-[#c7d0e1]" : "text-gray-700"
                        }`}
                      >
                        {row.datetime}
                      </td>
                      <td
                        className={`px-2 py-2 font-medium ${
                          row.type === "Buy"
                            ? isDark
                              ? "text-green-600"
                              : "text-green-600"
                            : isDark
                            ? "text-red-600"
                            : "text-red-600"
                        }`}
                      >
                        {row.type}
                      </td>
                      <td
                        className={`px-2 py-2 ${
                          isDark ? "text-[#c7d0e1]" : "text-gray-700"
                        }`}
                      >
                        {row.amount}
                      </td>
                      <td
                        className={`px-2 py-2 ${
                          isDark ? "text-[#c7d0e1]" : "text-gray-700"
                        }`}
                      >
                        {row.oprice}
                      </td>
                      <td
                        className={`px-2 py-2 ${
                          isDark ? "text-[#c7d0e1]" : "text-gray-700"
                        }`}
                      >
                        {row.cprice}
                      </td>
                      <td
                        className={`px-2 py-2 ${
                          isDark ? "text-[#c7d0e1]" : "text-gray-700"
                        }`}
                      >
                        {row.commission}
                      </td>
                      <td
                        className={`px-2 py-2 ${
                          isDark ? "text-[#c7d0e1]" : "text-gray-700"
                        }`}
                      >
                        {row.margin}
                      </td>
                      <td
                        className={`px-2 py-2 ${
                          isDark ? "text-[#c7d0e1]" : "text-gray-700"
                        }`}
                      >
                        {row.sl}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Initialize Mobile Chart */}
      {typeof window !== "undefined" && window.innerWidth < 768 && (
        <MobileChartInitializer selectedAsset={selectedAsset} theme={theme} />
      )}
    </div>
  );
}

// Mobile Chart Initializer Component
function MobileChartInitializer({ selectedAsset, theme }) {
  useEffect(() => {
    const container = document.getElementById("tv_chart_mobile");
    if (!container) return;

    container.innerHTML = "";
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;
    script.onload = () => {
      if (window.TradingView) {
        new window.TradingView.widget({
          autosize: true,
          symbol: getChartSymbol(selectedAsset),
          interval: "15",
          timezone: "Etc/UTC",
          theme: theme,
          style: "1",
          locale: "en",
          container_id: "tv_chart_mobile",
        });
      }
    };
    container.appendChild(script);
  }, [selectedAsset, theme]);

  return null;
}

// TradeModal component remains exactly the same
function TradeModal({ symbolObj, quotes, onClose, onSubmit, isDark }) {
  const [qty, setQty] = React.useState(1);
  const [orderType, setOrderType] = React.useState("market");
  const [sl, setSl] = React.useState("");
  const [tp, setTp] = React.useState("");
  const [comment, setComment] = React.useState("");
  const q = quotes.find((qq) => qq.symbol === symbolObj.symbol);
  const price = q?.price || 3786;
  const bid = price - 1;
  const ask = price + 1;

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        padding: "16px",
        overflowY: "auto",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
      className={`rounded-xl border-2 shadow-lg transition-colors duration-300 ${
        isDark
          ? "bg-gradient-to-br from-[#101325] via-[#183a55] to-[#192b44] border-[#23c2ed]/60"
          : "bg-white border-blue-300"
      }`}
    >
      <div className="flex justify-between items-center mb-4">
        <h3
          className={`text-xl font-bold ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          {symbolObj.display}
        </h3>
      </div>

      {/* Order Type Toggle */}
      <div
        className={`flex mb-4 rounded-lg p-1 border transition-colors duration-300 ${
          isDark
            ? "bg-[#252841] border-[#2d3150]"
            : "bg-gray-100 border-gray-300"
        }`}
      >
        <button
          className={`flex-1 py-2 text-sm font-medium rounded transition-colors duration-300 ${
            orderType === "market"
              ? isDark
                ? "bg-[#FF6000] text-white shadow-lg"
                : "bg-[#FF6000] text-white shadow-md"
              : isDark
              ? "text-[#6b7a99] hover:text-white"
              : "text-gray-700 hover:text-gray-900"
          }`}
          onClick={() => setOrderType("market")}
        >
          Market
        </button>
        <button
          className={`flex-1 py-2 text-sm font-medium rounded transition-colors duration-300 ${
            orderType === "pending"
              ? isDark
                ? "bg-[#FF6000] text-white shadow-lg"
                : "bg-[#FF6000] text-white shadow-md"
              : isDark
              ? "text-[#6b7a99] hover:text-white"
              : "text-gray-700 hover:text-gray-900"
          }`}
          onClick={() => setOrderType("pending")}
        >
          Pending
        </button>
      </div>

      {/* Volume Input */}
      <div className="mb-4">
        <label
          className={`block text-sm mb-1 ${
            isDark ? "text-[#6b7a99]" : "text-gray-700"
          }`}
        >
          Volume (lots)
        </label>
        <input
          type="number"
          min={0.01}
          step={0.01}
          value={qty}
          onChange={(e) => setQty(e.target.value)}
          className={`w-full rounded-lg px-3 py-2 focus:outline-none focus:ring-2 transition-colors duration-300 ${
            isDark
              ? "bg-[#252841] border border-[#2d3150] text-white focus:ring-[#00b8ff]"
              : "bg-gray-100 border border-gray-300 text-gray-900 focus:ring-blue-500"
          }`}
        />
      </div>

      {/* Buy/Sell Buttons */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div
          className={`rounded-lg p-3 border transition-colors duration-300 ${
            isDark
              ? "bg-gradient-to-br from-[#25234a] to-[#ff4766]/30 border-[#ff0000]/50"
              : "bg-red-100 border-red-300"
          }`}
        >
          <div
            className={`text-xs mb-1 transition-colors duration-300 ${
              isDark ? "text-[#ff3d9e]" : "text-red-700"
            }`}
          >
            Sell at
          </div>
          <div
            className={`text-xl font-bold mb-2 transition-colors duration-300 ${
              isDark ? "text-[#ff5b5b]" : "text-red-800"
            }`}
          >
            {bid.toFixed(2)}
          </div>
          <div
            className={`text-xs mb-2 transition-colors duration-300 ${
              isDark ? "text-[#6b7a99]" : "text-gray-600"
            }`}
          >
            Required margin: $7.57
          </div>
          <button
            className={`w-full rounded-lg py-2 font-semibold shadow-lg transition-colors duration-300 ${
              isDark
                ? "bg-red-600 text-white hover:bg-red-700"
                : "bg-red-600 text-white hover:bg-red-700"
            }`}
            onClick={() => onSubmit("Sell", qty)}
          >
            Sell
          </button>
        </div>
        <div
          className={`rounded-lg p-3 border transition-colors duration-300 ${
            isDark
              ? "bg-gradient-to-br from-[#11423a] to-[#25cb60]/30 border-[#00ff9d]/50"
              : "bg-green-100 border-green-300"
          }`}
        >
          <div
            className={`text-xs mb-1 transition-colors duration-300 ${
              isDark ? "text-[#00ff9d]" : "text-green-700"
            }`}
          >
            Buy at
          </div>
          <div
            className={`text-xl font-bold mb-2 transition-colors duration-300 ${
              isDark ? "text-[#00ff9d]" : "text-green-800"
            }`}
          >
            {ask.toFixed(2)}
          </div>
          <div
            className={`text-xs mb-2 transition-colors duration-300 ${
              isDark ? "text-[#6b7a99]" : "text-gray-600"
            }`}
          >
            Required margin: $0.20
          </div>
          <button
            className={`w-full rounded-lg py-2 font-semibold shadow-lg transition-colors duration-300 ${
              isDark
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-green-600 text-white hover:bg-green-700"
            }`}
            onClick={() => onSubmit("Buy", qty)}
          >
            Buy
          </button>
        </div>
      </div>

      {/* SL/TP Inputs */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label
            className={`block text-sm mb-1 ${
              isDark ? "text-[#6b7a99]" : "text-gray-700"
            }`}
          >
            Stop Loss
          </label>
          <input
            type="number"
            value={sl}
            onChange={(e) => setSl(e.target.value)}
            placeholder="0.00"
            className={`w-full rounded-lg px-3 py-2 focus:outline-none focus:ring-2 transition-colors duration-300 ${
              isDark
                ? "bg-[#252841] border border-[#2d3150] text-white focus:ring-red-500"
                : "bg-gray-100 border border-gray-300 text-gray-900 focus:ring-red-500"
            }`}
          />
        </div>
        <div>
          <label
            className={`block text-sm mb-1 ${
              isDark ? "text-[#6b7a99]" : "text-gray-700"
            }`}
          >
            Take Profit
          </label>
          <input
            type="number"
            value={tp}
            onChange={(e) => setTp(e.target.value)}
            placeholder="0.00"
            className={`w-full rounded-lg px-3 py-2 focus:outline-none focus:ring-2 transition-colors duration-300 ${
              isDark
                ? "bg-[#252841] border border-[#2d3150] text-white focus:ring-[#00b8ff]"
                : "bg-gray-100 border border-gray-300 text-gray-900 focus:ring-blue-500"
            }`}
          />
        </div>
      </div>

      {/* Comment */}
      <div>
        <label
          className={`block text-sm mb-1 ${
            isDark ? "text-[#6b7a99]" : "text-gray-700"
          }`}
        >
          Comment
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={2}
          placeholder="Optional comment"
          className={`w-full rounded-lg px-3 py-2 focus:outline-none focus:ring-2 transition-colors duration-300 ${
            isDark
              ? "bg-[#252841] border border-[#2d3150] text-white focus:ring-blue-500"
              : "bg-gray-100 border border-gray-300 text-gray-900 focus:ring-blue-500"
          }`}
        />
      </div>
    </div>
  );
}
