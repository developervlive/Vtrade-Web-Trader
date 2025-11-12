import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "./Logo-vtrade.png";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

// Helper formatting
const fmt = (n) => `$${Number(n).toFixed(2)}`;
const chip = (v) =>
  v >= 0 ? (
    <span className="px-2 py-0.5 rounded-full text-xs bg-[#00ff9d]/20 text-[#00ff9d]">
      +{Number(v).toFixed(2)}
    </span>
  ) : (
    <span className="px-2 py-0.5 rounded-full text-xs bg-[#ff3d9e]/20 text-[#ff3d9e]">
      {Number(v).toFixed(2)}
    </span>
  );

// ChartLine component (updated colors)
function ChartLine({ data, height = 200 }) {
  const formattedData = data.map((point, i) => ({
    ...point,
    label: i === 0 ? "Start" : i === data.length - 1 ? "Current" : `T${i}`,
  }));
  return (
    <div className="w-full h-[200px] bg-[#1a1b2e] rounded-xl border border-[#2d3150] shadow-lg p-2 transition-all">
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={formattedData}>
          <defs>
            <linearGradient id="eqColor" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00ff9d" stopOpacity={0.6} />
              <stop offset="85%" stopColor="#1a1b2e" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="label"
            axisLine={false}
            tick={{ fill: "#6b7a99", fontSize: 12 }}
            tickLine={false}
          />
          <YAxis
            axisLine={false}
            tick={{ fill: "#6b7a99", fontSize: 12 }}
            width={75}
            tickFormatter={(v) => `$${v.toFixed(0)}`}
            tickLine={false}
          />
          <CartesianGrid stroke="#2d3150" strokeDasharray="3 3" />
          <Tooltip
            contentStyle={{
              background: "#1a1b2e",
              borderRadius: "10px",
              border: "1px solid #2d3150",
              color: "#fff",
            }}
            labelClassName="text-[#00ff9d]"
            formatter={(v) => [`$${v.toFixed(2)}`, "Equity"]}
            labelFormatter={(label) => `${label}`}
          />
          <Area
            type="monotone"
            dataKey="y"
            stroke="#00ff9d"
            strokeWidth={3}
            fill="url(#eqColor)"
            dot={{ r: 5, fill: "#00ff9d", stroke: "#6b7a99", strokeWidth: 2 }}
            activeDot={{ r: 7 }}
            isAnimationActive={true}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

// Pie chart for allocation
const Pie = ({ items, size = 150 }) => {
  const total = items.reduce((s, i) => s + i.pct, 0) || 1;
  let acc = 0;
  const colors = [
    "#00b8ff",
    "#00ff9d",
    "#3b82f6",
    "#f59e0b",
    "#ff3d9e",
    "#f97316",
    "#60a5fa",
  ];
  return (
    <svg width={size} height={size} viewBox="0 0 42 42" className="mx-auto">
      {items.map((it, idx) => {
        const pct = it.pct / total;
        const start = acc;
        acc += pct;
        const startAngle = start * 2 * Math.PI;
        const endAngle = acc * 2 * Math.PI;
        const large = endAngle - startAngle > Math.PI ? 1 : 0;
        const x1 = 21 + 21 * Math.cos(startAngle);
        const y1 = 21 + 21 * Math.sin(startAngle);
        const x2 = 21 + 21 * Math.cos(endAngle);
        const y2 = 21 + 21 * Math.sin(endAngle);
        const d = `M21,21 L${x1},${y1} A21,21 0 ${large} 1 ${x2},${y2} z`;
        return (
          <path
            key={idx}
            d={d}
            fill={colors[idx % colors.length]}
            opacity="0.95"
          />
        );
      })}
    </svg>
  );
};

const Card = ({ title, children, right }) => (
  <div className="bg-[#1a1b2e] rounded-2xl border border-[#2d3150] shadow-xl shadow-black/30 overflow-hidden mb-6">
    <div className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-[#2d3150] bg-gradient-to-r from-[#252841] to-[#1a1b2e]">
      <h3 className="text-white font-semibold tracking-wide">{title}</h3>
      {right}
    </div>
    <div className="p-4 md:p-6">{children}</div>
  </div>
);

export default function Profile() {
  const navigate = useNavigate();
  // Data (use your mock/sample data as in previous code)
  const user = {
    id: "2143019683",
    name: "Asif Shah",
    rank: "Pro",
    email: "AsifShah@vtrade.com",
    phone: "+971-55-123-4567",
    country: "AE",
    avatar:
      "https://api.dicebear.com/7.x/identicon/svg?seed=Vtrade&backgroundType=gradientLinear",
    accountNo: "MC-LTD-8951957740",
    joined: "2023-06-12",
    baseCurrency: "USD",
    kyc: "Verified",
    leverage: "1:50",
    plan: "Prime",
  };
  const deposits = [
    {
      id: "d1",
      date: "2025-07-02 10:12",
      amount: 1500,
      method: "Card",
      status: "Success",
    },
    {
      id: "d2",
      date: "2025-07-15 14:33",
      amount: 1000,
      method: "UPI",
      status: "Success",
    },
    {
      id: "d3",
      date: "2025-08-01 09:20",
      amount: 1200,
      method: "Bank",
      status: "Pending",
    },
  ];
  const withdrawals = [
    {
      id: "w1",
      date: "2025-08-06 17:20",
      amount: 650,
      method: "Bank",
      status: "Processing",
    },
  ];
  const openPositions = [
    {
      id: "P-10021",
      symbol: "AAPL",
      side: "Buy",
      qty: 12,
      avg: 228.4,
      mark: 231.44,
      sl: 224.5,
      tp: 238.0,
      opened: "2025-08-13 09:55",
      fee: 1.2,
    },
    {
      id: "P-10022",
      symbol: "MSFT",
      side: "Sell",
      qty: 8,
      avg: 526.1,
      mark: 524.41,
      sl: 534.0,
      tp: 515.0,
      opened: "2025-08-13 10:32",
      fee: 1.1,
    },
    {
      id: "P-10023",
      symbol: "TSLA",
      side: "Buy",
      qty: 4,
      avg: 332.2,
      mark: 336.55,
      sl: 318.0,
      tp: 349.0,
      opened: "2025-08-13 11:18",
      fee: 0.9,
    },
  ];
  const workingOrders = [
    {
      id: "O-30011",
      symbol: "AMZN",
      side: "Buy Limit",
      qty: 2,
      price: 227.8,
      placed: "2025-08-13 12:30",
      status: "Working",
    },
    {
      id: "O-30012",
      symbol: "GOOGL",
      side: "Sell Stop",
      qty: 5,
      price: 199.9,
      placed: "2025-08-13 12:44",
      status: "Working",
    },
  ];
  const tradeHistory = [
    {
      id: "T-90001",
      symbol: "NVDA",
      side: "Buy",
      qty: 3,
      open: 124.2,
      close: 127.9,
      pnl: 11.1,
      fee: 0.6,
      opened: "2025-08-12 13:10",
      closed: "2025-08-12 15:22",
    },
    {
      id: "T-90002",
      symbol: "AAPL",
      side: "Sell",
      qty: 5,
      open: 229.7,
      close: 231.1,
      pnl: -7.0,
      fee: 0.7,
      opened: "2025-08-12 16:05",
      closed: "2025-08-12 16:55",
    },
    {
      id: "T-90003",
      symbol: "TSLA",
      side: "Buy",
      qty: 2,
      open: 329.0,
      close: 336.1,
      pnl: 14.2,
      fee: 0.5,
      opened: "2025-08-13 10:00",
      closed: "2025-08-13 11:40",
    },
    {
      id: "T-90004",
      symbol: "MSFT",
      side: "Sell",
      qty: 6,
      open: 523.1,
      close: 521.2,
      pnl: 11.4,
      fee: 0.8,
      opened: "2025-08-13 12:00",
      closed: "2025-08-13 12:50",
    },
    {
      id: "T-90005",
      symbol: "AMZN",
      side: "Buy",
      qty: 2,
      open: 226.5,
      close: 225.5,
      pnl: -2.0,
      fee: 0.4,
      opened: "2025-08-13 13:10",
      closed: "2025-08-13 13:44",
    },
  ];
  const watchlist = [
    { symbol: "AAPL", price: 231.44, change: -0.81 },
    { symbol: "MSFT", price: 524.41, change: 0.74 },
    { symbol: "GOOGL", price: 203.77, change: 0.9 },
    { symbol: "TSLA", price: 336.55, change: -0.83 },
    { symbol: "AMZN", price: 229.27, change: 2.1 },
  ];
  // KPIs
  const equityBase = 5000;
  const realizedPnl = useMemo(
    () => tradeHistory.reduce((s, t) => s + t.pnl, 0),
    [tradeHistory]
  );
  const fees = useMemo(
    () =>
      tradeHistory.reduce((s, t) => s + t.fee, 0) +
      openPositions.reduce((s, p) => s + p.fee, 0),
    [tradeHistory, openPositions]
  );
  const unrealizedPnl = useMemo(() => {
    return openPositions.reduce((s, p) => {
      const diff = (p.side === "Buy" ? p.mark - p.avg : p.avg - p.mark) * p.qty;
      return s + diff;
    }, 0);
  }, [openPositions]);
  const totalEquity = useMemo(
    () => equityBase + realizedPnl + unrealizedPnl - fees,
    [equityBase, realizedPnl, unrealizedPnl, fees]
  );
  const winRate = useMemo(() => {
    const wins = tradeHistory.filter((t) => t.pnl > 0).length;
    return tradeHistory.length
      ? Math.round((wins / tradeHistory.length) * 100)
      : 0;
  }, [tradeHistory]);
  const grossProfit = tradeHistory
    .filter((t) => t.pnl > 0)
    .reduce((s, t) => s + t.pnl, 0);
  const grossLoss = Math.abs(
    tradeHistory.filter((t) => t.pnl < 0).reduce((s, t) => s + t.pnl, 0)
  );
  const avgWin =
    tradeHistory.filter((t) => t.pnl > 0).reduce((s, t) => s + t.pnl, 0) /
    Math.max(1, tradeHistory.filter((t) => t.pnl > 0).length);
  const avgLoss = Math.abs(
    tradeHistory.filter((t) => t.pnl < 0).reduce((s, t) => s + t.pnl, 0) /
      Math.max(1, tradeHistory.filter((t) => t.pnl < 0).length)
  );
  const profitFactor = grossLoss ? (grossProfit / grossLoss).toFixed(2) : "∞";
  const equityCurve = useMemo(() => {
    let e = equityBase;
    const points = [{ x: 0, y: e }];
    tradeHistory.forEach((t, i) => {
      e += t.pnl - t.fee;
      points.push({ x: i + 1, y: e });
    });
    points.push({ x: points.length, y: e + unrealizedPnl });
    return points;
  }, [tradeHistory, equityBase, unrealizedPnl]);
  const allocation = useMemo(() => {
    const map = {};
    openPositions.forEach((p) => {
      const notion = p.avg * p.qty;
      map[p.symbol] = (map[p.symbol] || 0) + notion;
    });
    const total = Object.values(map).reduce((s, v) => s + v, 0) || 1;
    return Object.entries(map).map(([k, v]) => ({
      symbol: k,
      pct: (v / total) * 100,
    }));
  }, [openPositions]);
  // Controls
  const [tab, setTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [onlyWins, setOnlyWins] = useState(false);
  const [showTrade, setShowTrade] = useState(null);
  const tradesFiltered = useMemo(() => {
    return tradeHistory.filter((t) => {
      const ok = `${t.id} ${t.symbol} ${t.side}`
        .toLowerCase()
        .includes(search.toLowerCase());
      const win = onlyWins ? t.pnl > 0 : true;
      return ok && win;
    });
  }, [tradeHistory, search, onlyWins]);
  // Sidebar icons
  const Icon = {
    dashboard: (cls = "w-5 h-5") => (
      <svg className={cls} viewBox="0 0 24 24" fill="none">
        <path
          d="M3 3h8v8H3V3zm10 0h8v5h-8V3zM3 13h5v8H3v-8zm7 4h11v4H10v-4z"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>
    ),
    positions: (cls = "w-5 h-5") => (
      <svg className={cls} viewBox="0 0 24 24" fill="none">
        <path
          d="M4 6h16M4 12h16M4 18h16"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    ),
    orders: (cls = "w-5 h-5") => (
      <svg className={cls} viewBox="0 0 24 24" fill="none">
        <path
          d="M6 3h12l2 4H4l2-4zM4 7h16v14H4V7z"
          stroke="currentColor"
          strokeWidth="1.4"
        />
      </svg>
    ),
    history: (cls = "w-5 h-5") => (
      <svg className={cls} viewBox="0 0 24 24" fill="none">
        <path
          d="M12 8v5l4 2M3 12a9 9 0 1 0 3-6.7"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    ),
    funds: (cls = "w-5 h-5") => (
      <svg className={cls} viewBox="0 0 24 24" fill="none">
        <path
          d="M3 7h18v10H3V7zM7 7V5h10v2"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>
    ),
    alerts: (cls = "w-5 h-5") => (
      <svg className={cls} viewBox="0 0 24 24" fill="none">
        <path
          d="M12 3a6 6 0 0 0-6 6v3L4 15v1h16v-1l-2-3V9a6 6 0 0 0-6-6zM10 19a2 2 0 0 0 4 0"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>
    ),
    settings: (cls = "w-5 h-5") => (
      <svg className={cls} viewBox="0 0 24 24" fill="none">
        <path
          d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM4 12h2m12 0h2M12 4v2m0 12v2m-7.07-7.07l1.41 1.41m9.32-9.32l1.41 1.41m0 10.6l-1.41 1.41M6.34 6.34L4.93 7.75"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
    ),
    watch: (cls = "w-5 h-5") => (
      <svg className={cls} viewBox="0 0 24 24" fill="none">
        <path
          d="M21 7H3m18 10H3m3-5h12"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  };
  const MENU = [
    { key: "overview", label: "Dashboard", icon: Icon.dashboard },
    { key: "positions", label: "Positions", icon: Icon.positions },
    { key: "orders", label: "Orders", icon: Icon.orders },
    { key: "history", label: "Trade History", icon: Icon.history },
    { key: "funds", label: "Funds", icon: Icon.funds },
    { key: "alerts", label: "Alerts", icon: Icon.alerts },
    { key: "settings", label: "Settings", icon: Icon.settings },
    { key: "watch", label: "Watchlist", icon: Icon.watch },
  ];

  return (
    <div className="min-h-screen bg-[#0e0f1a] text-white">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-[#2d3150] bg-gradient-to-r from-[#1a1b2e] to-[#252841] backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden rounded-lg p-2 bg-[#252841] border border-[#2d3150]"
              onClick={() => setSidebarOpen((v) => !v)}
              aria-label="Toggle sidebar"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                <path
                  d="M4 6h16M4 12h16M4 18h16"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </button>
            <img
              src={logo}
              alt="V Trade Logo"
              className="w-10 h-10 object-contain bg-white rounded-full p-1"
            />
            <div>
              <div className="font-semibold tracking-wide">V Trade</div>
              <div className="text-xs text-[#6b7a99]">Trader Profile</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right mr-2">
              <div className="text-xs text-[#6b7a99]">Account</div>
              <div className="text-sm font-medium">{user.accountNo}</div>
            </div>
            <div className="flex items-center gap-3 bg-[#252841] border border-[#2d3150] rounded-xl px-3 py-1.5">
              <img
                src={user.avatar}
                alt="avatar"
                className="w-7 h-7 rounded-full"
              />
              <div className="text-sm">
                <div className="font-medium">{user.name}</div>
                <div className="text-[11px] text-[#6b7a99]">
                  {user.rank} • {user.plan}
                </div>
              </div>
              <button
                onClick={() => navigate("/home")}
                className="bg-gradient-to-r from-[#00E1A1] to-[#00FF66] rounded-lg font-sans font-medium px-2 py-1 text-black"
              >
                Back to Terminal
              </button>
            </div>
          </div>
        </div>
      </header>
      {/* Main */}
      <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6">
        {/* Sidebar */}
        <aside
          className={`fixed md:static z-20 top-[56px] left-0 h-[calc(100dvh-56px)] md:h-auto w-[240px] md:w-[260px] transition-transform
            ${
              sidebarOpen
                ? "translate-x-0"
                : "-translate-x-full md:translate-x-0"
            }`}
        >
          <div className="h-full md:h-auto bg-[#1a1b2e] border border-[#2d3150] rounded-2xl p-3 md:p-4 backdrop-blur-xl shadow-2xl shadow-black/40">
            {/* Profile quick glance */}
            <div className="mb-3 p-3 rounded-xl bg-[#252841] border border-[#2d3150]">
              <div className="flex items-center gap-3">
                <img
                  src={user.avatar}
                  className="w-9 h-9 rounded-lg ring-1 ring-[#00ff9d]/20"
                  alt="avatar"
                />
                <div className="text-sm">
                  <div className="font-semibold">{user.name}</div>
                  <div className="text-[11px] text-[#6b7a99]">
                    KYC: <span className="text-[#00ff9d]">{user.kyc}</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                <div className="bg-[#1a1b2e] rounded-lg px-2 py-1 border border-[#2d3150]">
                  Leverage{" "}
                  <span className="block text-white font-semibold">
                    {user.leverage}
                  </span>
                </div>
                <div className="bg-[#1a1b2e] rounded-lg px-2 py-1 border border-[#2d3150]">
                  Currency{" "}
                  <span className="block text-white font-semibold">
                    {user.baseCurrency}
                  </span>
                </div>
              </div>
            </div>
            {/* Menu */}
            <nav className="space-y-1">
              {MENU.map((m) => {
                const active = tab === m.key;
                return (
                  <button
                    key={m.key}
                    onClick={() => {
                      setTab(m.key);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition
                      ${
                        active
                          ? "bg-[#00ff9d]/20 text-[#00ff9d] border border-[#00ff9d]/30 shadow-[inset_0_0_0_1px_rgba(0,255,157,0.3)]"
                          : "text-[#6b7a99] hover:text-white hover:bg-[#252841] border border-transparent"
                      }`}
                  >
                    {m.icon(
                      "w-5 h-5 " +
                        (active ? "text-[#00ff9d]" : "text-[#6b7a99]")
                    )}
                    <span className="truncate">{m.label}</span>
                    {m.key === "overview" && (
                      <span className="ml-auto text-[11px] px-2 py-0.5 rounded-full bg-[#00ff9d]/10 text-[#00ff9d]">
                        Live
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
            {/* Equity mini widget */}
            <div className="mt-3 p-3 rounded-xl bg-[#252841] border border-[#2d3150]">
              <div className="text-[11px] text-[#6b7a99]">Equity</div>
              <div className="text-lg font-semibold">{fmt(totalEquity)}</div>
              <div className="mt-1 text-[11px]">
                {chip(unrealizedPnl)}{" "}
                <span className="text-[#6b7a99]">Unrealized</span>
              </div>
            </div>
          </div>
        </aside>
        {/* Main content */}
        <main className="flex-1 pb-10">
          {/* DASHBOARD TAB (MAIN OVERVIEW) */}
          {tab === "overview" && (
            <>
              {/* Top Stats Row */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-[#1a1b2e] rounded-xl border border-[#2d3150] p-4 shadow-lg">
                  <div className="text-xs text-[#6b7a99] uppercase tracking-wider">
                    Equity
                  </div>
                  <div className="text-2xl font-bold text-white mt-1">
                    {fmt(totalEquity)}
                  </div>
                  <div className="mt-2 text-sm">
                    {chip(unrealizedPnl)}{" "}
                    <span className="text-[#6b7a99]">Unrealized</span>
                  </div>
                </div>
                <div className="bg-[#1a1b2e] rounded-xl border border-[#2d3150] p-4 shadow-lg">
                  <div className="text-xs text-[#6b7a99] uppercase tracking-wider">
                    Realized P&L
                  </div>
                  <div className="text-2xl font-bold text-white mt-1">
                    {fmt(realizedPnl)}
                  </div>
                  <div className="mt-2 text-sm">
                    {chip(realizedPnl)}{" "}
                    <span className="text-[#6b7a99]">All Time</span>
                  </div>
                </div>
                <div className="bg-[#1a1b2e] rounded-xl border border-[#2d3150] p-4 shadow-lg">
                  <div className="text-xs text-[#6b7a99] uppercase tracking-wider">
                    Win Rate
                  </div>
                  <div className="text-2xl font-bold text-white mt-1">
                    {winRate}%
                  </div>
                  <div className="mt-2 text-sm">
                    <span className="text-[#6b7a99]">Profit Factor:</span>{" "}
                    {profitFactor}
                  </div>
                </div>
                <div className="bg-[#1a1b2e] rounded-xl border border-[#2d3150] p-4 shadow-lg">
                  <div className="text-xs text-[#6b7a99] uppercase tracking-wider">
                    Risk/Reward
                  </div>
                  <div className="text-2xl font-bold text-white mt-1">
                    1:2.5
                  </div>
                  <div className="mt-2 text-sm">
                    <span className="text-[#6b7a99]">Avg Win/Loss:</span>{" "}
                    {fmt(avgWin || 0)}/{fmt(avgLoss || 0)}
                  </div>
                </div>
              </div>
              {/* Main Dashboard Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <div className="bg-[#1a1b2e] rounded-xl border border-[#2d3150] p-6 shadow-lg lg:col-span-2">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-white">
                      Equity Curve
                    </h3>
                    <div className="flex gap-2">
                      <button className="px-3 py-1 text-xs bg-[#252841] rounded-lg">
                        1D
                      </button>
                      <button className="px-3 py-1 text-xs bg-[#252841] rounded-lg">
                        1W
                      </button>
                      <button className="px-3 py-1 text-xs bg-[#00ff9d] rounded-lg">
                        1M
                      </button>
                      <button className="px-3 py-1 text-xs bg-[#252841] rounded-lg">
                        1Y
                      </button>
                      <button className="px-3 py-1 text-xs bg-[#252841] rounded-lg">
                        ALL
                      </button>
                    </div>
                  </div>
                  <div className="h-64">
                    <ChartLine data={equityCurve} height={200} />
                  </div>
                  <div className="flex justify-between mt-4 text-sm text-[#6b7a99]">
                    <span>Start: {fmt(equityBase)}</span>
                    <span>
                      Current: {fmt(equityCurve[equityCurve.length - 1].y)}
                    </span>
                    <span>
                      Change:{" "}
                      {chip(equityCurve[equityCurve.length - 1].y - equityBase)}
                    </span>
                  </div>
                </div>
                <div className="bg-[#1a1b2e] rounded-xl border border-[#2d3150] p-6 shadow-lg">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Account Summary
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-[#6b7a99]">Account Type</span>
                      <span className="font-medium">{user.rank}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#6b7a99]">Leverage</span>
                      <span className="font-medium">{user.leverage}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#6b7a99]">Base Currency</span>
                      <span className="font-medium">{user.baseCurrency}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#6b7a99]">Open Positions</span>
                      <span className="font-medium">
                        {openPositions.length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#6b7a99]">Working Orders</span>
                      <span className="font-medium">
                        {workingOrders.length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#6b7a99]">Today&apos;s P&L</span>
                      <span
                        className={
                          realizedPnl >= 0 ? "text-[#00ff9d]" : "text-[#ff3d9e]"
                        }
                      >
                        {fmt(realizedPnl)}
                      </span>
                    </div>
                  </div>
                  <button className="w-full mt-6 py-2 bg-gradient-to-r from-[#00E1A1] to-[#00FF66] hover:from-[#00CC8A] hover:to-[#00E659] rounded-lg font-medium transition">
                    Deposit Funds
                  </button>
                </div>
              </div>
              {/* Bottom Dashboard Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <div className="bg-[#1a1b2e] rounded-xl border border-[#2d3150] p-6 shadow-lg">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Portfolio Allocation
                  </h3>
                  {allocation.length ? (
                    <div className="flex items-center">
                      <div className="w-32 h-32 mr-4">
                        <Pie items={allocation} size={120} />
                      </div>
                      <div className="flex-1">
                        {allocation.map((a, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between mb-2"
                          >
                            <div className="flex items-center">
                              <div
                                className="w-3 h-3 rounded-full mr-2"
                                style={{
                                  backgroundColor: [
                                    "#00b8ff",
                                    "#00ff9d",
                                    "#3b82f6",
                                    "#f59e0b",
                                    "#ff3d9e",
                                  ][i % 5],
                                }}
                              />
                              <span className="font-medium">{a.symbol}</span>
                            </div>
                            <span className="text-white">
                              {a.pct.toFixed(1)}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-[#6b7a99]">
                      No open positions
                    </div>
                  )}
                </div>
                <div className="bg-[#1a1b2e] rounded-xl border border-[#2d3150] p-6 shadow-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-white">
                      Watchlist
                    </h3>
                    <button className="text-xs text-[#00b8ff] hover:text-[#00ff9d]">
                      + Add Symbol
                    </button>
                  </div>
                  <div className="space-y-3">
                    {watchlist.map((w) => (
                      <div
                        key={w.symbol}
                        className="flex items-center justify-between p-3 hover:bg-[#252841] rounded-lg transition"
                      >
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-md bg-[#1a1b2e] flex items-center justify-center mr-3 font-semibold">
                            {w.symbol[0]}
                          </div>
                          <div>
                            <div className="font-medium">{w.symbol}</div>
                            <div className="text-xs text-[#6b7a99]">NASDAQ</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">
                            ${w.price.toFixed(2)}
                          </div>
                          <div
                            className={`text-xs ${
                              w.change >= 0
                                ? "text-[#00ff9d]"
                                : "text-[#ff3d9e]"
                            }`}
                          >
                            {w.change >= 0 ? "+" : ""}
                            {w.change.toFixed(2)}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-[#1a1b2e] rounded-xl border border-[#2d3150] p-6 shadow-lg">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Recent Activity
                  </h3>
                  <div className="space-y-4">
                    {tradeHistory.slice(0, 3).map((t) => (
                      <div
                        key={t.id}
                        className="border-b border-[#2d3150] pb-3 last:border-0"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium">
                              {t.symbol} {t.side}
                            </div>
                            <div className="text-xs text-[#6b7a99]">
                              {t.closed}
                            </div>
                          </div>
                          <div
                            className={`text-right ${
                              t.pnl >= 0 ? "text-[#00ff9d]" : "text-[#ff3d9e]"
                            }`}
                          >
                            {t.pnl >= 0 ? "+" : ""}
                            {fmt(t.pnl)}
                          </div>
                        </div>
                        <div className="flex justify-between text-xs mt-1 text-[#6b7a99]">
                          <span>Qty: {t.qty}</span>
                          <span>Fee: {fmt(t.fee)}</span>
                          <span>Duration: 2h 12m</span>
                        </div>
                      </div>
                    ))}
                    <button className="w-full mt-2 text-xs text-[#00b8ff] hover:text-[#00ff9d] text-center">
                      View All Activity →
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
          {/* POSITIONS TAB */}
          {tab === "positions" && (
            <Card title="Open Positions">
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm table-auto">
                  <thead>
                    <tr className="bg-[#252841] text-[#6b7a99] text-left">
                      <th className="py-2 px-4 font-medium">Symbol</th>
                      <th className="py-2 px-4 font-medium">Side</th>
                      <th className="py-2 px-4 font-medium">Qty</th>
                      <th className="py-2 px-4 font-medium">Avg</th>
                      <th className="py-2 px-4 font-medium">Mark</th>
                      <th className="py-2 px-4 font-medium">Unrealized</th>
                      <th className="py-2 px-4 font-medium">SL</th>
                      <th className="py-2 px-4 font-medium">TP</th>
                      <th className="py-2 px-4 font-medium">Opened</th>
                    </tr>
                  </thead>
                  <tbody>
                    {openPositions.map((p) => {
                      const unreal =
                        (p.side === "Buy" ? p.mark - p.avg : p.avg - p.mark) *
                        p.qty;
                      return (
                        <tr
                          key={p.id}
                          className="border-b border-[#2d3150] hover:bg-[#252841] cursor-pointer"
                          onClick={() =>
                            setShowTrade({ ...p, unrealized: unreal })
                          }
                        >
                          <td className="py-2 px-4">{p.symbol}</td>
                          <td className="py-2 px-4">{p.side}</td>
                          <td className="py-2 px-4">{p.qty}</td>
                          <td className="py-2 px-4">{fmt(p.avg)}</td>
                          <td className="py-2 px-4">{fmt(p.mark)}</td>
                          <td className="py-2 px-4">{chip(unreal)}</td>
                          <td className="py-2 px-4">{fmt(p.sl)}</td>
                          <td className="py-2 px-4">{fmt(p.tp)}</td>
                          <td className="py-2 px-4">{p.opened}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
          {/* ORDERS TAB */}
          {tab === "orders" && (
            <Card title="Working Orders">
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm table-auto">
                  <thead>
                    <tr className="bg-[#252841] text-[#6b7a99] text-left">
                      <th className="py-2 px-4 font-medium">Symbol</th>
                      <th className="py-2 px-4 font-medium">Side</th>
                      <th className="py-2 px-4 font-medium">Qty</th>
                      <th className="py-2 px-4 font-medium">Price</th>
                      <th className="py-2 px-4 font-medium">Placed</th>
                      <th className="py-2 px-4 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {workingOrders.map((o) => (
                      <tr
                        key={o.id}
                        className="border-b border-[#2d3150] hover:bg-[#252841]"
                      >
                        <td className="py-2 px-4">{o.symbol}</td>
                        <td className="py-2 px-4">{o.side}</td>
                        <td className="py-2 px-4">{o.qty}</td>
                        <td className="py-2 px-4">{fmt(o.price)}</td>
                        <td className="py-2 px-4">{o.placed}</td>
                        <td className="py-2 px-4">{o.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
          {/* TRADE HISTORY TAB */}
          {tab === "history" && (
            <Card
              title="Trade History"
              right={
                <div className="flex gap-2">
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="px-2 py-1 rounded-md bg-[#252841] border border-[#2d3150] text-xs"
                    placeholder="Search..."
                  />
                  <label className="flex items-center gap-1 text-[11px]">
                    <input
                      type="checkbox"
                      checked={onlyWins}
                      onChange={(e) => setOnlyWins(e.target.checked)}
                    />{" "}
                    Only Wins
                  </label>
                </div>
              }
            >
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm table-auto">
                  <thead>
                    <tr className="bg-[#252841] text-[#6b7a99] text-left">
                      <th className="py-2 px-4 font-medium">Symbol</th>
                      <th className="py-2 px-4 font-medium">Side</th>
                      <th className="py-2 px-4 font-medium">Qty</th>
                      <th className="py-2 px-4 font-medium">Open</th>
                      <th className="py-2 px-4 font-medium">Close</th>
                      <th className="py-2 px-4 font-medium">P&L</th>
                      <th className="py-2 px-4 font-medium">Fee</th>
                      <th className="py-2 px-4 font-medium">Opened</th>
                      <th className="py-2 px-4 font-medium">Closed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tradesFiltered.map((t) => (
                      <tr
                        key={t.id}
                        className="border-b border-[#2d3150] hover:bg-[#252841]"
                      >
                        <td className="py-2 px-4">{t.symbol}</td>
                        <td className="py-2 px-4">{t.side}</td>
                        <td className="py-2 px-4">{t.qty}</td>
                        <td className="py-2 px-4">{fmt(t.open)}</td>
                        <td className="py-2 px-4">{fmt(t.close)}</td>
                        <td className="py-2 px-4">{chip(t.pnl)}</td>
                        <td className="py-2 px-4">{fmt(t.fee)}</td>
                        <td className="py-2 px-4">{t.opened}</td>
                        <td className="py-2 px-4">{t.closed}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
          {/* FUNDS TAB */}
          {tab === "funds" && (
            <>
              <Card title="Deposits">
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm table-auto">
                    <thead>
                      <tr className="bg-[#252841] text-[#6b7a99] text-left">
                        <th className="py-2 px-4 font-medium">Date</th>
                        <th className="py-2 px-4 font-medium">Amount</th>
                        <th className="py-2 px-4 font-medium">Method</th>
                        <th className="py-2 px-4 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {deposits.map((d) => (
                        <tr
                          key={d.id}
                          className="border-b border-[#2d3150] hover:bg-[#252841]"
                        >
                          <td className="py-2 px-4">{d.date}</td>
                          <td className="py-2 px-4">{fmt(d.amount)}</td>
                          <td className="py-2 px-4">{d.method}</td>
                          <td className="py-2 px-4">{d.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
              <Card title="Withdrawals">
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm table-auto">
                    <thead>
                      <tr className="bg-[#252841] text-[#6b7a99] text-left">
                        <th className="py-2 px-4 font-medium">Date</th>
                        <th className="py-2 px-4 font-medium">Amount</th>
                        <th className="py-2 px-4 font-medium">Method</th>
                        <th className="py-2 px-4 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {withdrawals.map((w) => (
                        <tr
                          key={w.id}
                          className="border-b border-[#2d3150] hover:bg-[#252841]"
                        >
                          <td className="py-2 px-4">{w.date}</td>
                          <td className="py-2 px-4">{fmt(w.amount)}</td>
                          <td className="py-2 px-4">{w.method}</td>
                          <td className="py-2 px-4">{w.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </>
          )}
          {/* ALERTS */}
          {tab === "alerts" && (
            <Card title="Alerts">
              <div className="py-8 text-[#6b7a99]">No alerts yet.</div>
            </Card>
          )}
          {/* SETTINGS */}
          {tab === "settings" && (
            <Card title="Settings">
              <div className="py-8 text-[#6b7a99]">User settings go here.</div>
            </Card>
          )}
          {/* WATCHLIST */}
          {tab === "watch" && (
            <Card title="Watchlist">
              <div className="space-y-3">
                {watchlist.map((w) => (
                  <div
                    key={w.symbol}
                    className="flex items-center justify-between p-3 hover:bg-[#252841] rounded-lg transition"
                  >
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-md bg-[#1a1b2e] flex items-center justify-center mr-3 font-semibold">
                        {w.symbol[0]}
                      </div>
                      <div>
                        <div className="font-medium">{w.symbol}</div>
                        <div className="text-xs text-[#6b7a99]">NASDAQ</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">${w.price.toFixed(2)}</div>
                      <div
                        className={`text-xs ${
                          w.change >= 0 ? "text-[#00ff9d]" : "text-[#ff3d9e]"
                        }`}
                      >
                        {w.change >= 0 ? "+" : ""}
                        {w.change.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
          <footer className="pt-4 text-center text-xs text-[#6b7a99]">
            © {new Date().getFullYear()} V Trade — Professional Trading
            Dashboard
          </footer>
        </main>
      </div>
      {/* Trade Modal */}
      {showTrade && (
        <div className="fixed inset-0 z-40 bg-black/70 grid place-items-center p-4">
          <div className="w-full max-w-xl bg-[#1a1b2e] rounded-2xl border border-[#00ff9d]/30 overflow-hidden shadow-2xl shadow-black/50">
            <div className="flex items-center justify-between px-5 py-3 border-b border-[#2d3150] bg-[#252841]">
              <div className="font-semibold">
                Position — {showTrade.symbol} ({showTrade.side})
              </div>
              <button
                onClick={() => setShowTrade(null)}
                className="px-2 py-1 rounded-md bg-[#252841] hover:bg-[#1a1b2e] text-sm"
              >
                Close
              </button>
            </div>
            <div className="p-5 grid sm:grid-cols-2 gap-4">
              <div className="bg-[#252841] rounded-xl p-4 border border-[#2d3150]">
                <div className="text-xs text-[#6b7a99]">Unrealized P&L</div>
                <div className="text-2xl font-semibold mt-1">
                  {chip(showTrade.unrealized)}
                </div>
                <div className="grid grid-cols-2 gap-3 mt-4 text-sm">
                  <div>
                    <div className="text-[#6b7a99]">Qty</div>
                    <div className="font-semibold">{showTrade.qty}</div>
                  </div>
                  <div>
                    <div className="text-[#6b7a99]">Opened</div>
                    <div className="font-semibold">{showTrade.opened}</div>
                  </div>
                  <div>
                    <div className="text-[#6b7a99]">Avg</div>
                    <div className="font-semibold">{fmt(showTrade.avg)}</div>
                  </div>
                  <div>
                    <div className="text-[#6b7a99]">Mark</div>
                    <div className="font-semibold">{fmt(showTrade.mark)}</div>
                  </div>
                </div>
              </div>
              <div className="bg-[#252841] rounded-xl p-4 border border-[#2d3150]">
                <div className="text-xs text-[#6b7a99]">Risk Controls</div>
                <div className="mt-2 text-sm grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-[#6b7a99]">Stop Loss</div>
                    <div className="font-semibold">{fmt(showTrade.sl)}</div>
                  </div>
                  <div>
                    <div className="text-[#6b7a99]">Take Profit</div>
                    <div className="font-semibold">{fmt(showTrade.tp)}</div>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <button className="px-3 py-1.5 rounded-lg bg-[#ff3d9e]/90 hover:bg-[#ff3d9e] text-sm">
                    Close Now
                  </button>
                  <button className="px-3 py-1.5 rounded-lg bg-[#252841] hover:bg-[#1a1b2e] text-sm">
                    Modify SL/TP
                  </button>
                </div>
              </div>
            </div>
            <div className="px-5 pb-5">
              <div className="text-xs text-[#6b7a99] mb-2">P&L Preview</div>
              <ChartLine
                data={[
                  { x: 0, y: 0 },
                  { x: 1, y: showTrade.unrealized * 0.4 },
                  { x: 2, y: showTrade.unrealized * 0.8 },
                  { x: 3, y: showTrade.unrealized },
                ]}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
