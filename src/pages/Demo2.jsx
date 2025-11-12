import React, { useState, useEffect, useRef } from "react";
import logo from "./logo.png";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  FaApple,
  FaMicrosoft,
  FaAmazon,
  FaGoogle,
  FaBitcoin,
  FaEthereum,
} from "react-icons/fa";
import { SiTesla, SiBinance } from "react-icons/si";

const FINNHUB_API_KEY = "d2e4821r01qjrul5up50d2e4821r01qjrul5up5g";
const INDIAN_STOCKS = [
  {
    symbol: "NSE:RELIANCE",
    display: "RELIANCE",
    type: "stock",
    icon: <FaAmazon />,
  }, // Replace icon with something suitable
  { symbol: "NSE:TCS", display: "TCS", type: "stock", icon: <FaMicrosoft /> },
  { symbol: "NSE:INFY", display: "INFY", type: "stock", icon: <FaGoogle /> },
  { symbol: "NSE:HDFC", display: "HDFC", type: "stock", icon: <FaApple /> },
  // Add more as needed
];

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

const tabs = ["Deals", "Orders", "History"];

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
  const [userInfo, setUserInfo] = useState(null);
  const [loadingUserInfo, setLoadingUserInfo] = useState(false);
  const [showIndianStocks, setShowIndianStocks] = useState(false);
  const [indianStockQuotes, setIndianStockQuotes] = useState(
    INDIAN_STOCKS.map((stock) => ({
      ...stock,
      bid: null,
      ask: null,
      price: null,
      change: null,
    }))
  );

  // Auth token from localStorage or user context
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const authConfig = user.token
    ? {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    : {};

  useEffect(() => {
    async function fetchUserInfo() {
      setLoadingUserInfo(true);
      try {
        const res = await axios.get(
          "http://localhost:8080/api/auth/profile",
          authConfig
        );
        if (res.data.success) {
          setUserInfo(res.data.user);
        }
      } catch (e) {
        console.error("Failed to fetch user info", e);
        // Optionally handle error, logout user etc.
      } finally {
        setLoadingUserInfo(false);
      }
    }
    fetchUserInfo();
  }, []);
  {
    /*const fetchUserInfo = useCallback(async () => {
      setLoadingUserInfo(true);
      try {
        const res = await axios.get(
          "http://localhost:8080/api/auth/profile",
          authConfig
        );
        if (res.data.success) {
          setUserInfo(res.data.user);
        }
      } catch (e) {
        console.error("Failed to fetch user info", e);
        // Optionally handle error, logout user etc.
      } finally {
        setLoadingUserInfo(false);
      }
    }, [authConfig]);

    useEffect(() => {
      fetchUserInfo();
    }, [fetchUserInfo]); */
  }
  useEffect(() => {
    let cancelled = false;

    async function updateIndianQuotes() {
      if (showIndianStocks) {
        const quotes = await fetchQuotes(INDIAN_STOCKS);
        if (!cancelled) setIndianStockQuotes(quotes || []);
      }
    }

    updateIndianQuotes();
    const timer = setInterval(updateIndianQuotes, 60000);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [showIndianStocks]);
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

  // Live data states for tabs
  const [deals, setDeals] = useState([]);
  const [orders, setOrders] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showBalance, setShowBalance] = useState(true);
  const [showRecent, setShowRecent] = useState(false);
  const [theme, setTheme] = useState("dark"); // dark mode by default
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

  // Fetch quotes for assets (existing logic unchanged)
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

  // Fetch live tab data when activeTab changes
  useEffect(() => {
    setLoading(true);

    async function fetchTabData() {
      try {
        if (activeTab === "Deals") {
          const { data } = await axios.get(
            "http://localhost:8080/api/deals",
            authConfig
          );
          if (data.success) setDeals(data.deals || []);
          else setDeals([]);
        } else if (activeTab === "Orders") {
          const { data } = await axios.get(
            "http://localhost:8080/api/orders",
            authConfig
          );
          if (data.success) setOrders(data.data || []);
          else setOrders([]);
        } else if (activeTab === "History") {
          const { data } = await axios.get(
            "http://localhost:8080/api/deals/history",
            authConfig
          );
          if (data.success) setHistory(data.deals || []);
          else setHistory([]);
        }
      } catch (err) {
        console.error("Error fetching data for tab:", activeTab, err);
        toast.error(`Failed to load ${activeTab} data`);
      } finally {
        setLoading(false);
      }
    }

    fetchTabData();
  }, [activeTab]);

  // TradingView chart widget loader (existing logic)
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
          symbol: selectedAsset.symbol,
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

  // Combines latest 5 rows from all tabs for "Recent"
  function getRecentAllData() {
    const combined = [
      ...deals.map((d) => ({ ...d, category: "Deals" })),
      ...orders.map((d) => ({ ...d, category: "Orders" })),
      ...history.map((d) => ({ ...d, category: "History" })),
    ];
    combined.sort(
      (a, b) =>
        new Date(b.executedAt || b.createdAt || b.datetime) -
        new Date(a.executedAt || a.createdAt || a.datetime)
    );
    return combined.slice(0, 5);
  }

  // Returns current tab data array
  function getTabData(tab) {
    if (tab === "Deals") return deals;
    if (tab === "Orders") return orders;
    if (tab === "History") return history;
    return [];
  }

  // Map backend fields to table columns:
  const renderRowCell = (row, col) => {
    switch (col) {
      case "Script":
        return row.symbol || row.script || "-";
      case "Ticket ID":
        return row._id || row.ticket || "-";
      case "Date/Time":
        // Prefer executedAt, fallback createdAt or datetime
        return row.executedAt
          ? new Date(row.executedAt).toLocaleString()
          : row.createdAt
          ? new Date(row.createdAt).toLocaleString()
          : row.datetime || "-";
      case "Type":
        return row.side || row.type || "-";
      case "Amount":
        return row.qty || row.amount || "-";
      case "Open Price":
        return formatPrice(
          row.openPrice || row.oprice || row.executedPrice || "-"
        );
      case "Current Price":
        return formatPrice(row.currentPrice || row.cprice || "-");
      case "Commission":
        return formatPrice(row.commission || row.fee || 0);
      case "Margin":
        return formatPrice(row.margin || 0);
      case "SL":
        return formatPrice(row.sl || "-");
      default:
        return "-";
    }
  };

  const isDark = theme === "dark";

  return (
    <div
      className={`min-h-screen font-sans flex flex-col transition-colors duration-300 ${
        isDark ? "bg-[#0e0f1a] text-gray-100" : "bg-[#f5f6fa] text-gray-900"
      }`}
    >
      {/* Top bar and other UI unchanged */}
      <div
        className={`flex items-center justify-between px-6 py-3 border-b transition-colors duration-300 ${
          isDark
            ? "bg-gradient-to-r from-[#1a1b2e] to-[#252841] border-[#2d3150]"
            : "bg-white border-gray-300 shadow-sm"
        }`}
      >
        <div className="flex items-center gap-3">
          <img
            src={logo}
            alt="Logo"
            className={`w-8 h-8 rounded-full object-cover ${
              isDark ? "bg-white" : "bg-transparent"
            }`}
          />
          <span
            className={`text-lg font-bold ${
              isDark ? "text-white" : "text-gray-800"
            }`}
          >
            Digital Brains
          </span>
          <div className="flex items-center gap-2 ml-4">
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
                  ? "bg-gradient-to-r from-[#00E1A1] to-[#00FF66]"
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

        {/* Dark/Light mode toggle + account info */}
        <div className="flex items-center gap-6 text-sm font-semibold">
          {/* Theme Toggle */}
          <button
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className={`relative w-14 h-7 rounded-full cursor-pointer transition-colors duration-300 ${
              isDark ? "bg-gray-700" : "bg-blue-500"
            }`}
          >
            {/* Circle */}
            <div
              className={`absolute top-0.5 w-6 h-6 rounded-full bg-yellow-400 shadow-md transition-transform duration-300 ${
                isDark ? "left-1" : "left-7"
              } flex items-center justify-center`}
            >
              {isDark ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 text-gray-900"
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
                  className="w-4 h-4 text-white"
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

          <span className={`${isDark ? "text-[#f5f7fc]" : "text-gray-800"}`}>
            Account: {accountDetails["Account ID"]}
          </span>

          <span
            onClick={() => navigate("/profile")}
            className={`px-3 py-1 rounded-md shadow-md text-white cursor-pointer ${
              isDark
                ? "bg-gradient-to-r from-[#00E1A1] to-[#03ee80]"
                : "bg-blue-500"
            }`}
          >
            Dashboard
          </span>
        </div>
      </div>

      {/* Balance strip */}
      {/*showBalance && (
        <div
          className={`px-6 py-3 border-b transition-colors duration-300 ${
            isDark
              ? "bg-gradient-to-r from-[#1a1b2e] to-[#252841] border-[#2d3150]"
              : "bg-white border-gray-300 shadow-sm"
          }`}
        >
          <div className="flex items-center gap-8 text-sm">
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
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
      )*/}

      {showBalance && (
        <div
          className={`px-6 py-3 border-b transition-colors duration-300 ${
            isDark
              ? "bg-gradient-to-r from-[#1a1b2e] to-[#252841] border-[#2d3150]"
              : "bg-white border-gray-300 shadow-sm"
          }`}
        >
          <div className="flex items-center gap-8 text-sm">
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
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
                {userInfo?.balance?.toFixed(2) ?? "--"}
              </span>
            </div>
            <span className={isDark ? "text-[#6b7a99]" : "text-gray-600"}>
              Free Margin :{" "}
              <b className={isDark ? "text-[#ff5b5b]" : "text-red-600"}>
                {userInfo?.freeMargin?.toFixed(2) ?? "--"}
              </b>
            </span>
            <span className={isDark ? "text-[#6b7a99]" : "text-gray-600"}>
              Total PnL :{" "}
              <b className={isDark ? "text-white" : "text-gray-900"}>0.00</b>
            </span>
            <span className={isDark ? "text-[#6b7a99]" : "text-gray-600"}>
              Equity :{" "}
              <b className={isDark ? "text-[#ff5b5b]" : "text-red-600"}>
                {userInfo?.equity?.toFixed(2) ?? "--"}
              </b>
            </span>
            <span className={isDark ? "text-[#6b7a99]" : "text-gray-600"}>
              Used Margin :{" "}
              <b className={isDark ? "text-white" : "text-gray-900"}>
                {userInfo?.marginUsed?.toFixed(2) ?? "--"}
              </b>
            </span>
            <span className={isDark ? "text-[#6b7a99]" : "text-gray-600"}>
              Credit :{" "}
              <b className={isDark ? "text-white" : "text-gray-900"}>
                {userInfo?.pendingBalance?.toFixed(2) ?? "0.00"}
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
            className={`flex items-center gap-1 px-3 py-2 mx-1 rounded-xl cursor-pointer transition-all duration-200 select-none ${
              selectedAsset.symbol === q.symbol
                ? isDark
                  ? "bg-gradient-to-r from-[#00E1A1] to-[#00FF66] text-white shadow-lg"
                  : "bg-gradient-to-r from-blue-400 to-blue-600 text-white shadow-md"
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
          className={`w-8 h-8 flex items-center justify-center rounded-xl cursor-pointer shadow-md select-none ${
            isDark
              ? "bg-gradient-to-r from-[#00E1A1] to-[#00E659] text-white"
              : "bg-blue-500 text-white"
          } ml-2`}
        >
          +
        </div>
      </div>

      {/* Main grid */}
      {/* Main grid with fixed professional height & spacing */}
      <div
        className={`px-4 py-3 grid grid-cols-12 gap-3 mb-6 transition-colors duration-300 ${
          isDark ? "" : "text-gray-900"
        }`}
        style={{
          height: "420px",
          minHeight: "420px",
          maxHeight: "420px",
          borderRadius: "18px",
          background: isDark ? "#181a26" : "#fff",
          boxShadow: isDark ? "0 6px 24px #021d2c33" : "0 2px 12px #e2e8f066",
        }}
      >
        {/* Instruments Sidebar */}
        {/* Instruments Sidebar */}
        <div
          className={`col-span-3 rounded-xl border overflow-hidden flex flex-col shadow-lg transition-colors duration-300 ${
            isDark
              ? "bg-[#1a1b2e] border-[#2d3150]"
              : "bg-white border-gray-300"
          }`}
          style={{
            height: "100%",
            minHeight: 0,
          }}
        >
          {/* Header with INSTRUMENTS and Indian Stock toggle */}
          <div
            className={`p-3 border-b flex justify-between items-center font-semibold text-sm transition-colors duration-300 ${
              isDark
                ? "bg-gradient-to-r from-[#252841] to-[#1a1b2e] border-[#2d3150] text-white"
                : "bg-gray-100 border-gray-300 text-gray-800"
            }`}
            style={{ minHeight: 46 }}
          >
            <span>INSTRUMENTS</span>

            {/* Indian Stock toggle */}
            <label
              className={`flex items-center cursor-pointer select-none text-xs font-normal ${
                isDark ? "text-gray-400" : "text-gray-700"
              }`}
              title="Toggle Indian Stock Instruments"
            >
              Indian Stock
              <input
                type="checkbox"
                checked={showIndianStocks}
                onChange={() => setShowIndianStocks((s) => !s)}
                className="ml-2 form-checkbox h-4 w-4 text-green-400 rounded-sm cursor-pointer"
              />
            </label>
          </div>

          {/* Search Input */}
          <div
            className={`px-3 py-2 border-b transition-colors duration-300 ${
              isDark
                ? "bg-[#1a1b2e] border-[#2d3150]"
                : "bg-white border-gray-300"
            }`}
            style={{ minHeight: 50 }}
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
              style={{
                fontSize: 13,
                padding: "7px 12px",
                minHeight: 32,
              }}
            />
          </div>

          {/* Instruments List Table */}
          <div
            className={`overflow-y-auto transition-colors duration-300 ${
              isDark ? "bg-[#1a1b2e]" : "bg-white"
            }`}
            style={{
              flex: 1,
              minHeight: 0,
              maxHeight: "calc(100% - 96px)",

              scrollbarWidth: "none", // Firefox
              msOverflowStyle: "none", // IE 10+
            }}
          >
            <style>{`
      div::-webkit-scrollbar {
        display: none;
      }
    `}</style>

            <table className="w-full text-xs" style={{ fontSize: 13 }}>
              <thead>
                <tr
                  className={`${
                    isDark
                      ? "bg-[#252841] text-[#a5ee88]"
                      : "bg-blue-100 text-blue-900"
                  }`}
                >
                  <th className="px-3 py-2 text-left">Symbol</th>
                  <th className="px-3 py-2 text-right">Signal</th>
                  <th className="px-3 py-2 text-right">Bid</th>
                  <th className="px-3 py-2 text-right">Ask</th>
                </tr>
              </thead>
              <tbody>
                {(showIndianStocks ? indianStockQuotes : quotes)
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
                      <td className="px-1 py-2 font-medium flex gap-2 items-center">
                        <span>{q.icon}</span> {q.display}
                      </td>
                      <td className="px-3 py-2 text-right">
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
                      <td className="px-3 py-2 text-right">
                        {q.bid !== null ? formatPrice(q.bid) : "--"}
                      </td>
                      <td className="px-3 py-2 text-right">
                        {q.ask !== null ? formatPrice(q.ask) : "--"}
                      </td>
                    </tr>
                  ))}
                {(showIndianStocks ? indianStockQuotes : quotes).filter(
                  (q) =>
                    !searchTerm ||
                    q.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    q.display.toLowerCase().includes(searchTerm.toLowerCase())
                ).length === 0 && (
                  <tr>
                    <td className="px-3 py-2 text-center" colSpan={4}>
                      No matching assets found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Central Chart */}
        <div
          className={`col-span-6 flex flex-col rounded-xl border overflow-hidden shadow-lg transition-colors duration-300 ${
            isDark
              ? "bg-[#1a1b2e] border-[#2d3150]"
              : "bg-white border-gray-300"
          }`}
          style={{
            height: "100%",
            minHeight: 0,
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
                style={{ fontSize: 13 }}
              >
                Indicators
              </button>
              <button
                className={`text-xs px-2 py-1 rounded transition ${
                  isDark
                    ? "bg-[#252841] text-[#6b7a99] hover:bg-[#2d3150] hover:text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300 hover:text-gray-900"
                }`}
                style={{ fontSize: 13 }}
              >
                Templates
              </button>
            </div>
          </div>
          <div
            ref={chartRefDesktop}
            id="tv_chart_desktop"
            style={{ flex: 1, minHeight: 0 }}
          />
        </div>

        {/* Trade Modal */}
        <div
          className={`col-span-3 rounded-xl border overflow-hidden shadow-lg transition-colors duration-300 ${
            isDark
              ? "bg-[#1a1b2e] border-[#2d3150]" //"bg-[#1a1b2e] border-[#2d3150]"
              : "bg-white border-gray-300"
          }`}
          style={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            minHeight: 0,
          }}
        >
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              minHeight: 0,
              padding: "10px 12px",
              overflowY: "auto",
              fontSize: 13,

              scrollbarWidth: "none", // Firefox
              msOverflowStyle: "none", // IE 10+
            }}
            className={`rounded-xl border shadow-lg transition-colors duration-300 ${
              isDark
                ? "bg-[#1a1b2e] border-[#2d3150]"
                : "bg-white border-blue-300"
            }`}
          >
            <style>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
            <TradeModal
              symbolObj={selectedAsset}
              quotes={quotes}
              onClose={() => {}}
              onSubmit={(side, qty) => {
                // Add new order logic here:
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
        <div className="max-w-[calc(100vw-40px)] mx-auto px-3 py-3 flex items-center justify-between space-x-4">
          <div className="flex space-x-1 flex-wrap overflow-x-auto">
            {tabs.map((t) => (
              <button
                key={t}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors duration-300 ${
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
          <div className="flex space-x-2 flex-shrink-0">
            <button
              className={`px-4 py-2 rounded-lg font-medium text-white shadow-md transition-colors duration-300 ${
                isDark
                  ? "bg-gradient-to-r from-[#f71b13] to-[#f36951] hover:opacity-90"
                  : "bg-pink-600 hover:bg-pink-700"
              }`}
              onClick={() => navigate("/profile")}
            >
              See All
            </button>
            <button
              className={`px-4 py-2 rounded-lg font-medium border-2 transition-colors duration-300 ${
                showRecent
                  ? isDark
                    ? "bg-gradient-to-r from-[#ff3d9e] to-[#ff006b] border-transparent text-white"
                    : "bg-pink-600 border-pink-600 text-white"
                  : isDark
                  ? "bg-transparent border-red-600 text-[#f5f0f2] hover:bg-gradient-to-r hover:from-[#f71b13] hover:to-[#f36951]"
                  : "bg-transparent border-pink-600 text-pink-600 hover:bg-pink-100"
              }`}
              onClick={() => setShowRecent(!showRecent)}
            >
              Recent
            </button>
          </div>
        </div>
        <div
          className={`overflow-x-auto px-3 pb-3 transition-colors duration-300 ${
            isDark ? "bg-[#1a1b2e]" : "bg-white"
          }`}
          style={{ maxHeight: "200px" }}
        >
          {loading ? (
            <div
              className={`text-center py-8 ${
                isDark ? "text-white" : "text-gray-700"
              }`}
            >
              Loading {activeTab}...
            </div>
          ) : (showRecent ? getRecentAllData() : getTabData(activeTab))
              .length === 0 ? (
            <div
              className={`text-center py-8 ${
                isDark ? "text-[#6b7a99]" : "text-gray-600"
              }`}
            >
              No{" "}
              {showRecent
                ? "recent data available"
                : activeTab.toLowerCase() + " data available"}
            </div>
          ) : (
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
                    <th className="px-3 py-2 text-left" key={col}>
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
                      {tableColumns.map((col) => (
                        <td
                          key={col}
                          className={`px-3 py-2 ${
                            col === "Script"
                              ? `font-medium ${
                                  isDark ? "text-white" : "text-gray-900"
                                }`
                              : isDark
                              ? "text-[#c7d0e1]"
                              : "text-gray-700"
                          } ${
                            col === "Type" &&
                            (row.type === "Buy" || row.side === "Buy"
                              ? isDark
                                ? "text-[#00ff9d]"
                                : "text-green-600"
                              : isDark
                              ? "text-[#ff3d9e]"
                              : "text-red-600")
                          }`}
                        >
                          {renderRowCell(row, col)}
                        </td>
                      ))}
                    </tr>
                  )
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper function to fetch quotes (existing)
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

function TradeModal({ symbolObj, quotes, isDark }) {
  const [qty, setQty] = useState(1);
  const [orderType, setOrderType] = useState("market");
  const [sl, setSl] = useState("");
  const [tp, setTp] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [marginNeeded, setMarginNeeded] = useState(0);
  const [feeEstimate, setFeeEstimate] = useState(0);
  const [balance, setBalance] = useState(0);

  const API_BASE = "http://localhost:8080/api/orders";

  const q = quotes.find((qq) => qq.symbol === symbolObj.symbol);
  const price = q?.price || 3786;
  const bid = q?.bid || price - 1;
  const ask = q?.ask || price + 1;

  // Load user balance from localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.balance) setBalance(Number(user.balance));
  }, []);

  // Calculate margin & fee
  useEffect(() => {
    const numericQty = Number(qty) || 0;
    const numericPrice = Number(price);

    const baseMargin = numericQty * numericPrice;
    const baseFee = numericQty * 0.01;
    const slRisk = sl ? Math.abs(numericPrice - Number(sl)) * numericQty : 0;

    const totalMargin = baseMargin + slRisk;
    setMarginNeeded(Number(totalMargin.toFixed(2)));
    setFeeEstimate(Number(baseFee.toFixed(2)));
  }, [qty, price, sl]);

  const handleOrder = async (side) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?.token) {
      toast.error("Please login first.");
      return;
    }

    const numericQty = Number(qty);
    if (!numericQty || numericQty <= 0) {
      toast.error("Please enter a valid quantity.");
      return;
    }

    const numericPrice = Number(price);
    const numericSL = sl ? Number(sl) : null;
    const numericTP = tp ? Number(tp) : null;

    // SL/TP validation
    if (side === "Buy") {
      if (numericSL && numericSL >= numericPrice) {
        toast.error("Stop Loss must be below price for Buy orders.");
        return;
      }
      if (numericTP && numericTP <= numericPrice) {
        toast.error("Take Profit must be above price for Buy orders.");
        return;
      }
    } else {
      // Sell
      if (numericSL && numericSL <= numericPrice) {
        toast.error("Stop Loss must be above price for Sell orders.");
        return;
      }
      if (numericTP && numericTP >= numericPrice) {
        toast.error("Take Profit must be below price for Sell orders.");
        return;
      }
    }

    const baseMargin = numericQty * numericPrice;
    const slRisk = numericSL
      ? Math.abs(numericPrice - numericSL) * numericQty
      : 0;
    const totalMargin = baseMargin + slRisk;
    const totalFee = numericQty * 0.01;

    // Check balance
    if (balance < totalMargin + totalFee) {
      toast.error("Insufficient balance.");
      return;
    }

    // Instant balance deduction
    setBalance((prev) => Number((prev - totalMargin - totalFee).toFixed(2)));
    setLoading(true);

    try {
      const payload = {
        symbol: symbolObj.symbol,
        side,
        qty: numericQty,
        orderType,
        sl: numericSL || undefined,
        tp: numericTP || undefined,
        comment,
        marketData: { bid, ask, last: numericPrice },
      };

      const { data } = await axios.post(`${API_BASE}`, payload, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      toast.success(`Order ${side} placed successfully!`);

      // Sync balance from API
      if (data?.userBalance !== undefined) {
        setBalance(data.userBalance);
        localStorage.setItem(
          "user",
          JSON.stringify({ ...user, balance: data.userBalance })
        );
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to place order");
      // Revert balance on error
      setBalance(user.balance);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        padding: 16,
        maxHeight: "80vh",
        overflowY: "auto",
      }}
      className={`rounded-xl border-2 shadow-lg transition-colors duration-300 ${
        isDark
          ? "bg-gradient-to-br from-[#101325] via-[#183a55] to-[#192b44] border-[#23c2ed]/60"
          : "bg-white border-blue-300"
      }`}
    >
      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 rounded-xl">
          <div className="text-white font-bold">Placing Order...</div>
        </div>
      )}

      {/* User Balance */}
      <div
        className={`mb-4 font-semibold ${
          isDark ? "text-[#00ff9d]" : "text-gray-800"
        }`}
      >
        Balance: ${balance.toFixed(2)}
      </div>

      <h3
        className={`text-xl font-bold mb-4 ${
          isDark ? "text-white" : "text-gray-900"
        }`}
      >
        {symbolObj.display}
      </h3>

      {/* Order Type Toggle */}
      <div
        className={`flex mb-4 rounded-lg p-1 border transition-colors duration-300 ${
          isDark
            ? "bg-[#252841] border-[#2d3150]"
            : "bg-gray-100 border-gray-300"
        }`}
      >
        {["market", "pending"].map((type) => (
          <button
            key={type}
            className={`flex-1 py-2 text-sm font-medium rounded transition-colors duration-300 ${
              orderType === type
                ? isDark
                  ? "bg-gradient-to-r from-[#00ff9d] to-[#00b8ff] text-white shadow-lg"
                  : "bg-blue-600 text-white shadow-md"
                : isDark
                ? "text-[#6b7a99] hover:text-white"
                : "text-gray-700 hover:text-gray-900"
            }`}
            onClick={() => setOrderType(type)}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
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

      {/* Margin & Fee */}
      <div
        className={`mb-4 text-sm ${
          isDark ? "text-[#00ff9d]" : "text-gray-800"
        }`}
      >
        Required Margin: ${marginNeeded} | Estimated Fee: ${feeEstimate}
      </div>

      {/* Buy/Sell Buttons */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <button
          disabled={loading}
          className={`rounded-lg p-3 font-semibold shadow-lg transition-colors duration-300 ${
            isDark
              ? "bg-gradient-to-r from-[#00ff9d] to-[#00b8ff] text-white hover:opacity-90"
              : "bg-green-600 text-white hover:bg-green-700"
          }`}
          onClick={() => handleOrder("Buy")}
        >
          Buy @ {ask.toFixed(2)}
        </button>
        <button
          disabled={loading}
          className={`rounded-lg p-3 font-semibold shadow-lg transition-colors duration-300 ${
            isDark
              ? "bg-gradient-to-r from-[#f71b13] to-[#f36951] text-white hover:opacity-90"
              : "bg-red-600 text-white hover:bg-red-700"
          }`}
          onClick={() => handleOrder("Sell")}
        >
          Sell @ {bid.toFixed(2)}
        </button>
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
