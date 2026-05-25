"use client";
import { useState, useEffect } from "react";
import {
  getPlayers,
  getRecords,
  getMonthlyStats,
  getPlayerMonthlyData,
} from "@/lib/storage";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";

const COLORS = [
  "#d4af37", "#ef4444", "#3b82f6", "#22c55e", "#a855f7",
  "#f97316", "#14b8a6", "#f43f5e", "#6366f1", "#84cc16",
];

const TOOLTIP_STYLE = {
  backgroundColor: "#1a1a2e",
  border: "1px solid #d4af37",
  borderRadius: "8px",
  color: "#fff",
  fontSize: "12px",
};

function ChartCard({ title, children }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-md border border-gray-200 dark:border-gray-800">
      <h3 className="text-base font-bold text-yellow-500 mb-4 font-display">{title}</h3>
      {children}
    </div>
  );
}

export default function AnalyticsPage() {
  const [players, setPlayers] = useState([]);
  const [records, setRecords] = useState([]);
  const [timeRange, setTimeRange] = useState("monthly");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setPlayers(getPlayers());
    setRecords(getRecords());
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (records.length === 0) {
    return (
      <div className="page-enter flex flex-col items-center justify-center min-h-96 space-y-4">
        <p className="text-5xl">📊</p>
        <h2 className="text-xl font-bold text-yellow-400">No Data Yet</h2>
        <p className="text-gray-400 text-sm text-center">
          Add some game records to see analytics!
        </p>
      </div>
    );
  }

  // Data prep
  const monthlyStats = getMonthlyStats(records);
  const playerMonthlyData = getPlayerMonthlyData(records, players);

  // Pie data
  const pieData = players
    .filter((p) => p.losses > 0)
    .sort((a, b) => b.losses - a.losses)
    .map((p) => ({ name: p.name, value: p.losses }));

  // Player comparison bar
  const playerBarData = [...players]
    .sort((a, b) => b.losses - a.losses)
    .map((p) => ({ name: p.name, losses: p.losses }));

  // Radar data (top 6 players)
  const radarData = players
    .sort((a, b) => b.losses - a.losses)
    .slice(0, 6)
    .map((p) => ({
      subject: p.name,
      losses: p.losses,
      fullMark: Math.max(...players.map((x) => x.losses), 1),
    }));

  // Weekly data (last 7 days)
  const weeklyData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().slice(0, 10);
    const count = records.filter((r) => r.createdAt.slice(0, 10) === dateStr).length;
    return {
      label: d.toLocaleDateString("en-US", { weekday: "short" }),
      count,
    };
  });

  return (
    <div className="page-enter space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-8 md:pt-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-yellow-400 font-display">
            📊 Analytics
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Performance insights for {records.length} games
          </p>
        </div>
        <div className="flex gap-2">
          {["weekly", "monthly"].map((r) => (
            <button
              key={r}
              onClick={() => setTimeRange(r)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all capitalize
                ${timeRange === r
                  ? "bg-yellow-500 text-green-900"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Charts grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Monthly/Weekly losses */}
        <ChartCard
          title={`📅 ${timeRange === "weekly" ? "Last 7 Days" : "Monthly"} Game Count`}
        >
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={timeRange === "weekly" ? weeklyData : monthlyStats.map(m => ({ ...m, label: m.label, count: m.count }))}
              margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="label"
                tick={{ fill: "#9ca3af", fontSize: 11 }}
              />
              <YAxis tick={{ fill: "#9ca3af", fontSize: 11 }} />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Bar dataKey="count" fill="#d4af37" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Player comparison */}
        <ChartCard title="👥 Player Losses Comparison">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={playerBarData}
              layout="vertical"
              margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" horizontal={false} />
              <XAxis type="number" tick={{ fill: "#9ca3af", fontSize: 11 }} />
              <YAxis
                dataKey="name"
                type="category"
                tick={{ fill: "#9ca3af", fontSize: 11 }}
                width={70}
              />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Bar dataKey="losses" radius={[0, 4, 4, 0]}>
                {playerBarData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Pie chart */}
        <ChartCard title="🥧 Loss Distribution">
          {pieData.length === 0 ? (
            <div className="flex items-center justify-center h-52 text-gray-400 text-sm">
              No loss data yet
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  formatter={(v) => (
                    <span style={{ color: "#9ca3af", fontSize: "11px" }}>{v}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        {/* Line chart — player monthly trend */}
        <ChartCard title="📈 Monthly Loss Trend (per player)">
          {playerMonthlyData.length < 2 ? (
            <div className="flex items-center justify-center h-52 text-gray-400 text-sm">
              Need at least 2 months of data
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart
                data={playerMonthlyData}
                margin={{ top: 5, right: 20, left: -20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="label" tick={{ fill: "#9ca3af", fontSize: 11 }} />
                <YAxis tick={{ fill: "#9ca3af", fontSize: 11 }} />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Legend
                  formatter={(v) => (
                    <span style={{ color: "#9ca3af", fontSize: "11px" }}>{v}</span>
                  )}
                />
                {players.slice(0, 6).map((p, i) => (
                  <Line
                    key={p.id}
                    type="monotone"
                    dataKey={p.name}
                    stroke={COLORS[i % COLORS.length]}
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    connectNulls={false}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        {/* Radar chart */}
        {radarData.length >= 3 && (
          <ChartCard title="🕸️ Player Performance Radar">
            <ResponsiveContainer width="100%" height={250}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#374151" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fill: "#9ca3af", fontSize: 11 }}
                />
                <PolarRadiusAxis
                  angle={30}
                  domain={[0, "auto"]}
                  tick={{ fill: "#9ca3af", fontSize: 10 }}
                />
                <Radar
                  name="Losses"
                  dataKey="losses"
                  stroke="#d4af37"
                  fill="#d4af37"
                  fillOpacity={0.3}
                />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
              </RadarChart>
            </ResponsiveContainer>
          </ChartCard>
        )}

        {/* Stats summary */}
        <ChartCard title="📋 Quick Stats">
          <div className="space-y-3">
            {[...players]
              .sort((a, b) => b.losses - a.losses)
              .slice(0, 8)
              .map((p, i) => {
                const pct =
                  records.length > 0
                    ? ((p.losses / records.length) * 100).toFixed(1)
                    : 0;
                return (
                  <div key={p.id} className="flex items-center gap-3">
                    <span
                      className="rank-badge text-xs font-bold flex-shrink-0"
                      style={{
                        background: COLORS[i % COLORS.length] + "33",
                        color: COLORS[i % COLORS.length],
                      }}
                    >
                      {i + 1}
                    </span>
                    <span className="text-sm font-medium flex-1 truncate">
                      {p.name}
                    </span>
                    <span className="text-sm font-bold" style={{ color: COLORS[i % COLORS.length] }}>
                      {p.losses}
                    </span>
                    <div className="w-20 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${pct}%`,
                          background: COLORS[i % COLORS.length],
                        }}
                      />
                    </div>
                    <span className="text-xs text-gray-400 w-10 text-right">
                      {pct}%
                    </span>
                  </div>
                );
              })}
          </div>
        </ChartCard>
      </div>
    </div>
  );
}
