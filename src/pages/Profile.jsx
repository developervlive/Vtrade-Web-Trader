import React, { useMemo, useState, useEffect } from "react";
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

// ChartLine component
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

// Card component with responsive padding
const Card = ({ title, children, right, className = "" }) => (
  <div
    className={`bg-[#1a1b2e] rounded-2xl border border-[#2d3150] shadow-xl shadow-black/30 overflow-hidden mb-6 ${className}`}
  >
    <div className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-[#2d3150] bg-gradient-to-r from-[#252841] to-[#1a1b2e]">
      <h3 className="text-white font-semibold tracking-wide text-sm md:text-base">
        {title}
      </h3>
      {right}
    </div>
    <div className="p-3 md:p-4 lg:p-6">{children}</div>
  </div>
);

// Responsive Table Component
const ResponsiveTable = ({ data, columns, onRowClick, className = "" }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (isMobile) {
    return (
      <div className={`space-y-3 ${className}`}>
        {data.map((row, index) => (
          <div
            key={row.id || index}
            className="bg-[#252841] rounded-lg border border-[#2d3150] p-4 hover:border-[#00ff9d]/30 transition-colors cursor-pointer"
            onClick={() => onRowClick?.(row)}
          >
            {columns.map((col) => (
              <div
                key={col.key}
                className="flex justify-between items-center py-2 border-b border-[#2d3150]/50 last:border-0"
              >
                <span className="text-[#6b7a99] text-sm">{col.header}:</span>
                <span className="text-white text-sm font-medium">
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="min-w-full text-sm table-auto">
        <thead>
          <tr className="bg-[#252841] text-[#6b7a99] text-left">
            {columns.map((col) => (
              <th
                key={col.key}
                className="py-3 px-4 font-medium text-xs md:text-sm"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr
              key={row.id || index}
              className="border-b border-[#2d3150] hover:bg-[#252841] cursor-pointer transition-colors"
              onClick={() => onRowClick?.(row)}
            >
              {columns.map((col) => (
                <td key={col.key} className="py-3 px-4 text-xs md:text-sm">
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default function Profile() {
  const navigate = useNavigate();

  // Mock data
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
  ];

  const watchlist = [
    { symbol: "AAPL", price: 231.44, change: -0.81 },
    { symbol: "MSFT", price: 524.41, change: 0.74 },
    { symbol: "GOOGL", price: 203.77, change: 0.9 },
    { symbol: "TSLA", price: 336.55, change: -0.83 },
    { symbol: "AMZN", price: 229.27, change: 2.1 },
  ];

  // KPIs calculations
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
  const unrealizedPnl = useMemo(
    () =>
      openPositions.reduce(
        (s, p) =>
          s + (p.side === "Buy" ? p.mark - p.avg : p.avg - p.mark) * p.qty,
        0
      ),
    [openPositions]
  );
  const totalEquity = useMemo(
    () => equityBase + realizedPnl + unrealizedPnl - fees,
    [equityBase, realizedPnl, unrealizedPnl, fees]
  );
  const winRate = useMemo(
    () =>
      tradeHistory.length
        ? Math.round(
            (tradeHistory.filter((t) => t.pnl > 0).length /
              tradeHistory.length) *
              100
          )
        : 0,
    [tradeHistory]
  );
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

  // State management
  const [tab, setTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [onlyWins, setOnlyWins] = useState(false);
  const [showTrade, setShowTrade] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  // Responsive check
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Filter trades
  const tradesFiltered = useMemo(() => {
    return tradeHistory.filter((t) => {
      const ok = `${t.id} ${t.symbol} ${t.side}`
        .toLowerCase()
        .includes(search.toLowerCase());
      const win = onlyWins ? t.pnl > 0 : true;
      return ok && win;
    });
  }, [tradeHistory, search, onlyWins]);

  // Menu icons
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

  // Table columns configuration
  const positionColumns = [
    { key: "symbol", header: "Symbol" },
    { key: "side", header: "Side" },
    { key: "qty", header: "Qty" },
    { key: "avg", header: "Avg", render: (val) => fmt(val) },
    { key: "mark", header: "Mark", render: (val) => fmt(val) },
    {
      key: "unrealized",
      header: "Unrealized",
      render: (_, row) => {
        const unreal =
          (row.side === "Buy" ? row.mark - row.avg : row.avg - row.mark) *
          row.qty;
        return chip(unreal);
      },
    },
    { key: "sl", header: "SL", render: (val) => fmt(val) },
    { key: "tp", header: "TP", render: (val) => fmt(val) },
    { key: "opened", header: "Opened" },
  ];

  const orderColumns = [
    { key: "symbol", header: "Symbol" },
    { key: "side", header: "Side" },
    { key: "qty", header: "Qty" },
    { key: "price", header: "Price", render: (val) => fmt(val) },
    { key: "placed", header: "Placed" },
    { key: "status", header: "Status" },
  ];

  const historyColumns = [
    { key: "symbol", header: "Symbol" },
    { key: "side", header: "Side" },
    { key: "qty", header: "Qty" },
    { key: "open", header: "Open", render: (val) => fmt(val) },
    { key: "close", header: "Close", render: (val) => fmt(val) },
    { key: "pnl", header: "P&L", render: (val) => chip(val) },
    { key: "fee", header: "Fee", render: (val) => fmt(val) },
    { key: "opened", header: "Opened" },
    { key: "closed", header: "Closed" },
  ];

  const fundsColumns = [
    { key: "date", header: "Date" },
    { key: "amount", header: "Amount", render: (val) => fmt(val) },
    { key: "method", header: "Method" },
    { key: "status", header: "Status" },
  ];

  return (
    <div className="min-h-screen bg-[#0e0f1a] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-[#2d3150] bg-gradient-to-r from-[#1a1b2e] to-[#252841] backdrop-blur">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
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
              className="w-8 h-8 sm:w-10 sm:h-10 object-contain bg-white rounded-full p-1"
            />
            <div>
              <div className="font-semibold tracking-wide text-sm sm:text-base">
                V Trade
              </div>
              <div className="text-xs text-[#6b7a99]">Trader Profile</div>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden sm:block text-right mr-2">
              <div className="text-xs text-[#6b7a99]">Account</div>
              <div className="text-sm font-medium">{user.accountNo}</div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 bg-[#252841] border border-[#2d3150] rounded-xl px-2 sm:px-3 py-1.5">
              <img
                src={user.avatar}
                alt="avatar"
                className="w-6 h-6 sm:w-7 sm:h-7 rounded-full"
              />
              <div className="hidden xs:block text-sm">
                <div className="font-medium text-xs sm:text-sm">
                  {user.name}
                </div>
                <div className="text-[11px] text-[#6b7a99]">
                  {user.rank} • {user.plan}
                </div>
              </div>
              <button
                onClick={() => navigate("/home")}
                className="bg-gradient-to-r from-[#00E1A1] to-[#00FF66] rounded-lg font-sans font-medium px-2 sm:px-3 py-1 text-black text-xs sm:text-sm whitespace-nowrap"
              >
                {isMobile ? "Terminal" : "Back to Terminal"}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6 flex gap-4 sm:gap-6 md:items-start">
        {/* Sidebar */}
        <aside
          className={`
            fixed md:sticky z-40 top-[56px] left-0 h-[calc(100dvh-56px)] md:h-auto w-[280px] sm:w-[300px] md:w-[260px] 
            transition-transform duration-300 ease-in-out bg-[#1a1b2e] border border-[#2d3150] rounded-2xl p-3 md:p-4 
            backdrop-blur-xl shadow-2xl shadow-black/40 overflow-y-auto md:overflow-visible
            ${
              sidebarOpen
                ? "translate-x-0"
                : "-translate-x-full md:translate-x-0"
            }
            md:top-4 md:self-start
          `}
        >
          {/* Profile quick glance */}
          <div className="mb-4 p-3 rounded-xl bg-[#252841] border border-[#2d3150]">
            <div className="flex items-center gap-3">
              <img
                src={user.avatar}
                className="w-9 h-9 rounded-lg ring-1 ring-[#00ff9d]/20"
                alt="avatar"
              />
              <div className="text-sm flex-1 min-w-0">
                <div className="font-semibold truncate">{user.name}</div>
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
          <nav className="space-y-1 mb-4">
            {MENU.map((m) => {
              const active = tab === m.key;
              return (
                <button
                  key={m.key}
                  onClick={() => {
                    setTab(m.key);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all duration-200
                    ${
                      active
                        ? "bg-[#00ff9d]/20 text-[#00ff9d] border border-[#00ff9d]/30 shadow-[inset_0_0_0_1px_rgba(0,255,157,0.3)]"
                        : "text-[#6b7a99] hover:text-white hover:bg-[#252841] border border-transparent"
                    }`}
                >
                  {m.icon(
                    active ? "w-5 h-5 text-[#00ff9d]" : "w-5 h-5 text-[#6b7a99]"
                  )}
                  <span className="truncate flex-1 text-left">{m.label}</span>
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
          <div className="p-3 rounded-xl bg-[#252841] border border-[#2d3150]">
            <div className="text-[11px] text-[#6b7a99]">Equity</div>
            <div className="text-lg font-semibold">{fmt(totalEquity)}</div>
            <div className="mt-1 text-[11px]">
              {chip(unrealizedPnl)}{" "}
              <span className="text-[#6b7a99]">Unrealized</span>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0 pb-10">
          {/* DASHBOARD TAB */}
          {tab === "overview" && (
            <>
              {/* Top Stats Row */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
                <div className="bg-[#1a1b2e] rounded-xl border border-[#2d3150] p-3 sm:p-4 shadow-lg col-span-2 lg:col-span-1">
                  <div className="text-xs text-[#6b7a99] uppercase tracking-wider">
                    Equity
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-white mt-1">
                    {fmt(totalEquity)}
                  </div>
                  <div className="mt-2 text-sm">
                    {chip(unrealizedPnl)}{" "}
                    <span className="text-[#6b7a99]">Unrealized</span>
                  </div>
                </div>
                <div className="bg-[#1a1b2e] rounded-xl border border-[#2d3150] p-3 sm:p-4 shadow-lg">
                  <div className="text-xs text-[#6b7a99] uppercase tracking-wider">
                    Realized P&L
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-white mt-1">
                    {fmt(realizedPnl)}
                  </div>
                  <div className="mt-2 text-sm">
                    {chip(realizedPnl)}{" "}
                    <span className="text-[#6b7a99]">All Time</span>
                  </div>
                </div>
                <div className="bg-[#1a1b2e] rounded-xl border border-[#2d3150] p-3 sm:p-4 shadow-lg">
                  <div className="text-xs text-[#6b7a99] uppercase tracking-wider">
                    Win Rate
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-white mt-1">
                    {winRate}%
                  </div>
                  <div className="mt-2 text-sm">
                    <span className="text-[#6b7a99]">Profit Factor:</span>{" "}
                    {profitFactor}
                  </div>
                </div>
                <div className="bg-[#1a1b2e] rounded-xl border border-[#2d3150] p-3 sm:p-4 shadow-lg">
                  <div className="text-xs text-[#6b7a99] uppercase tracking-wider">
                    Risk/Reward
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-white mt-1">
                    1:2.5
                  </div>
                  <div className="mt-2 text-sm">
                    <span className="text-[#6b7a99]">Avg Win/Loss:</span>{" "}
                    {fmt(avgWin || 0)}/{fmt(avgLoss || 0)}
                  </div>
                </div>
              </div>

              {/* Main Dashboard Grid */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
                <div className="bg-[#1a1b2e] rounded-xl border border-[#2d3150] p-4 sm:p-6 shadow-lg xl:col-span-2">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
                    <h3 className="text-lg font-semibold text-white">
                      Equity Curve
                    </h3>
                    <div className="flex gap-1 sm:gap-2 overflow-x-auto pb-2">
                      {["1D", "1W", "1M", "1Y", "ALL"].map((period) => (
                        <button
                          key={period}
                          className={`px-3 py-1 text-xs rounded-lg whitespace-nowrap ${
                            period === "1M"
                              ? "bg-[#00ff9d] text-black"
                              : "bg-[#252841] text-white"
                          }`}
                        >
                          {period}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="h-64">
                    <ChartLine data={equityCurve} height={200} />
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between gap-2 mt-4 text-sm text-[#6b7a99]">
                    <span>Start: {fmt(equityBase)}</span>
                    <span>
                      Current:{" "}
                      {fmt(equityCurve[equityCurve.length - 1]?.y || 0)}
                    </span>
                    <span>
                      Change:{" "}
                      {chip(
                        (equityCurve[equityCurve.length - 1]?.y || 0) -
                          equityBase
                      )}
                    </span>
                  </div>
                </div>

                <div className="bg-[#1a1b2e] rounded-xl border border-[#2d3150] p-4 sm:p-6 shadow-lg">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Account Summary
                  </h3>
                  <div className="space-y-3 sm:space-y-4">
                    {[
                      ["Account Type", user.rank],
                      ["Leverage", user.leverage],
                      ["Base Currency", user.baseCurrency],
                      ["Open Positions", openPositions.length],
                      ["Working Orders", workingOrders.length],
                      [
                        "Today's P&L",
                        {
                          value: fmt(realizedPnl),
                          color:
                            realizedPnl >= 0
                              ? "text-[#00ff9d]"
                              : "text-[#ff3d9e]",
                        },
                      ],
                    ].map(([label, value], index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center"
                      >
                        <span className="text-[#6b7a99] text-sm">{label}</span>
                        <span
                          className={`font-medium text-sm ${
                            typeof value === "object" ? value.color : ""
                          }`}
                        >
                          {typeof value === "object" ? value.value : value}
                        </span>
                      </div>
                    ))}
                  </div>
                  <button className="w-full mt-6 py-2 bg-gradient-to-r from-[#00E1A1] to-[#00FF66] hover:from-[#00CC8A] hover:to-[#00E659] rounded-lg font-medium transition text-sm sm:text-base">
                    Deposit Funds
                  </button>
                </div>
              </div>

              {/* Bottom Dashboard Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card title="Portfolio Allocation">
                  {allocation.length ? (
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      <div className="w-32 h-32">
                        <Pie items={allocation} size={120} />
                      </div>
                      <div className="flex-1 min-w-0 w-full">
                        {allocation.map((a, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between mb-3"
                          >
                            <div className="flex items-center min-w-0 flex-1">
                              <div
                                className="w-3 h-3 rounded-full mr-2 flex-shrink-0"
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
                              <span className="font-medium truncate">
                                {a.symbol}
                              </span>
                            </div>
                            <span className="text-white ml-2 flex-shrink-0">
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
                </Card>

                <Card
                  title="Watchlist"
                  right={
                    <button className="text-xs text-[#00b8ff] hover:text-[#00ff9d]">
                      + Add
                    </button>
                  }
                >
                  <div className="space-y-3">
                    {watchlist.map((w) => (
                      <div
                        key={w.symbol}
                        className="flex items-center justify-between p-3 hover:bg-[#252841] rounded-lg transition"
                      >
                        <div className="flex items-center min-w-0 flex-1">
                          <div className="w-8 h-8 rounded-md bg-[#1a1b2e] flex items-center justify-center mr-3 font-semibold flex-shrink-0">
                            {w.symbol[0]}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="font-medium truncate">
                              {w.symbol}
                            </div>
                            <div className="text-xs text-[#6b7a99] truncate">
                              NASDAQ
                            </div>
                          </div>
                        </div>
                        <div className="text-right ml-3 flex-shrink-0">
                          <div className="font-medium text-sm">
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
                </Card>

                <Card title="Recent Activity">
                  <div className="space-y-4">
                    {tradeHistory.slice(0, 3).map((t) => (
                      <div
                        key={t.id}
                        className="border-b border-[#2d3150] pb-3 last:border-0 last:pb-0"
                      >
                        <div className="flex justify-between items-start">
                          <div className="min-w-0 flex-1">
                            <div className="font-medium text-sm truncate">
                              {t.symbol} {t.side}
                            </div>
                            <div className="text-xs text-[#6b7a99] truncate">
                              {t.closed}
                            </div>
                          </div>
                          <div
                            className={`text-right ml-3 flex-shrink-0 ${
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
                          <span>2h 12m</span>
                        </div>
                      </div>
                    ))}
                    <button className="w-full mt-2 text-xs text-[#00b8ff] hover:text-[#00ff9d] text-center">
                      View All Activity →
                    </button>
                  </div>
                </Card>
              </div>
            </>
          )}

          {/* POSITIONS TAB */}
          {tab === "positions" && (
            <Card title="Open Positions">
              <ResponsiveTable
                data={openPositions.map((p) => ({
                  ...p,
                  unrealized:
                    (p.side === "Buy" ? p.mark - p.avg : p.avg - p.mark) *
                    p.qty,
                }))}
                columns={positionColumns}
                onRowClick={(row) =>
                  setShowTrade({ ...row, unrealized: row.unrealized })
                }
              />
            </Card>
          )}

          {/* ORDERS TAB */}
          {tab === "orders" && (
            <Card title="Working Orders">
              <ResponsiveTable data={workingOrders} columns={orderColumns} />
            </Card>
          )}

          {/* TRADE HISTORY TAB */}
          {tab === "history" && (
            <Card
              title="Trade History"
              right={
                <div className="flex gap-2 items-center">
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="px-2 py-1 rounded-md bg-[#252841] border border-[#2d3150] text-xs w-32"
                    placeholder="Search..."
                  />
                  <label className="flex items-center gap-1 text-[11px] whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={onlyWins}
                      onChange={(e) => setOnlyWins(e.target.checked)}
                      className="rounded"
                    />
                    Only Wins
                  </label>
                </div>
              }
            >
              <ResponsiveTable data={tradesFiltered} columns={historyColumns} />
            </Card>
          )}

          {/* FUNDS TAB */}
          {tab === "funds" && (
            <>
              <Card title="Deposits">
                <ResponsiveTable data={deposits} columns={fundsColumns} />
              </Card>
              <Card title="Withdrawals">
                <ResponsiveTable data={withdrawals} columns={fundsColumns} />
              </Card>
            </>
          )}

          {/* ALERTS TAB */}
          {tab === "alerts" && (
            <Card title="Alerts">
              <div className="py-8 text-center text-[#6b7a99]">
                <div className="text-lg mb-2">No alerts yet</div>
                <div className="text-sm">
                  Set up price alerts for your favorite symbols
                </div>
              </div>
            </Card>
          )}

          {/* SETTINGS TAB */}
          {tab === "settings" && (
            <Card title="Settings">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-[#6b7a99] mb-2">
                      Account Type
                    </label>
                    <select className="w-full bg-[#252841] border border-[#2d3150] rounded-lg px-3 py-2 text-sm">
                      <option>Standard</option>
                      <option>Professional</option>
                      <option>Institutional</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-[#6b7a99] mb-2">
                      Base Currency
                    </label>
                    <select className="w-full bg-[#252841] border border-[#2d3150] rounded-lg px-3 py-2 text-sm">
                      <option>USD</option>
                      <option>EUR</option>
                      <option>GBP</option>
                    </select>
                  </div>
                </div>
                <button className="bg-gradient-to-r from-[#00E1A1] to-[#00FF66] text-black font-medium py-2 px-4 rounded-lg">
                  Save Settings
                </button>
              </div>
            </Card>
          )}

          {/* WATCHLIST TAB */}
          {tab === "watch" && (
            <Card
              title="Watchlist"
              right={
                <button className="text-xs text-[#00b8ff] hover:text-[#00ff9d]">
                  + Add Symbol
                </button>
              }
            >
              <div className="space-y-3">
                {watchlist.map((w) => (
                  <div
                    key={w.symbol}
                    className="flex items-center justify-between p-3 hover:bg-[#252841] rounded-lg transition"
                  >
                    <div className="flex items-center min-w-0 flex-1">
                      <div className="w-8 h-8 rounded-md bg-[#1a1b2e] flex items-center justify-center mr-3 font-semibold flex-shrink-0">
                        {w.symbol[0]}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-medium truncate">{w.symbol}</div>
                        <div className="text-xs text-[#6b7a99] truncate">
                          NASDAQ
                        </div>
                      </div>
                    </div>
                    <div className="text-right ml-3 flex-shrink-0">
                      <div className="font-medium text-sm">
                        ${w.price.toFixed(2)}
                      </div>
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

          <footer className="pt-6 text-center text-xs text-[#6b7a99]">
            © {new Date().getFullYear()} V Trade — Professional Trading
            Dashboard
          </footer>
        </main>
      </div>

      {/* Trade Modal */}
      {showTrade && (
        <div className="fixed inset-0 z-50 bg-black/70 grid place-items-center p-3 sm:p-4">
          <div className="w-full max-w-2xl bg-[#1a1b2e] rounded-2xl border border-[#00ff9d]/30 overflow-hidden shadow-2xl shadow-black/50 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-[#2d3150] bg-[#252841] sticky top-0">
              <div className="font-semibold text-sm sm:text-base">
                Position — {showTrade.symbol} ({showTrade.side})
              </div>
              <button
                onClick={() => setShowTrade(null)}
                className="px-2 py-1 rounded-md bg-[#252841] hover:bg-[#1a1b2e] text-sm"
              >
                Close
              </button>
            </div>
            <div className="p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    <div className="font-semibold text-xs">
                      {showTrade.opened}
                    </div>
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
                <div className="flex gap-2 mt-4 flex-wrap">
                  <button className="px-3 py-1.5 rounded-lg bg-[#ff3d9e]/90 hover:bg-[#ff3d9e] text-sm flex-1 min-w-[120px]">
                    Close Now
                  </button>
                  <button className="px-3 py-1.5 rounded-lg bg-[#252841] hover:bg-[#1a1b2e] text-sm flex-1 min-w-[120px]">
                    Modify SL/TP
                  </button>
                </div>
              </div>
            </div>
            <div className="px-4 sm:px-5 pb-4 sm:pb-5">
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
