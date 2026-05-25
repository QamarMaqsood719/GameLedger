"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { getStats, getPlayers, getRecords } from "@/lib/storage";
import StatCard from "@/components/ui/StatCard";
import Leaderboard from "@/components/ui/Leaderboard";
import CardAvatar from "@/components/ui/CardAvatar";
import { PlusCircle, TrendingUp, Calendar } from "lucide-react";

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [players, setPlayers] = useState([]);
  const [records, setRecords] = useState([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const p = getPlayers();
    const r = getRecords();
    setPlayers(p);
    setRecords(r);
    setStats(getStats());
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-yellow-400 text-4xl animate-bounce-subtle">♠</div>
      </div>
    );
  }

  // Monthly stats for mini chart
  const thisMonth = new Date().toLocaleString("default", {
    month: "long",
    year: "numeric",
  });
  const thisMonthRecords = records.filter((r) => {
    const d = new Date(r.createdAt);
    return (
      d.getMonth() === new Date().getMonth() &&
      d.getFullYear() === new Date().getFullYear()
    );
  }).length;

  return (
    <div className="page-enter space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pt-8 md:pt-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-yellow-400 font-display">
            ♠ Dashboard
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <Link
          href="/add-record"
          className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-green-900 font-bold px-4 py-2.5 rounded-xl transition-all shadow-lg text-sm"
        >
          <PlusCircle size={16} />
          Add Record
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon="🃏"
          label="Total Games"
          value={records.length}
          gradient="bg-gradient-to-br from-green-800 to-green-900 text-white"
          iconBg="bg-white/15"
        />
        <StatCard
          icon="👥"
          label="Total Players"
          value={players.length}
          gradient="bg-gradient-to-br from-blue-800 to-blue-900 text-white"
          iconBg="bg-white/15"
        />
        <StatCard
          icon="😭"
          label="Top Loser"
          value={stats?.mostLosingPlayer?.losses || 0}
          subtitle={stats?.mostLosingPlayer?.name || "No player yet"}
          gradient="bg-gradient-to-br from-red-800 to-red-900 text-white"
          iconBg="bg-white/15"
        />
        <StatCard
          icon="📅"
          label="This Month"
          value={thisMonthRecords}
          subtitle={thisMonth}
          gradient="bg-gradient-to-br from-purple-800 to-purple-900 text-white"
          iconBg="bg-white/15"
        />
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Leaderboard */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-md border border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-yellow-500 font-display flex items-center gap-2">
              🏆 Hall of Shame
            </h2>
            <Link
              href="/players"
              className="text-xs text-green-500 hover:text-green-400 transition-colors"
            >
              View all →
            </Link>
          </div>
          <Leaderboard players={players} records={records} />
        </div>

        {/* Recent Records */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-md border border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-yellow-500 font-display flex items-center gap-2">
              ⚡ Recent
            </h2>
            <Link
              href="/history"
              className="text-xs text-green-500 hover:text-green-400 transition-colors"
            >
              View all →
            </Link>
          </div>

          {stats?.recentRecords?.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <p className="text-3xl mb-2">🎴</p>
              <p className="text-sm">No records yet</p>
              <Link
                href="/add-record"
                className="text-yellow-400 text-sm hover:underline mt-2 block"
              >
                Add first record →
              </Link>
            </div>
          ) : (
            <div className="space-y-2.5">
              {stats?.recentRecords?.slice(0, 8).map((record) => {
                const player = players.find((p) => p.id === record.playerId);
                return (
                  <div
                    key={record.id}
                    className="flex items-center gap-3 p-2.5 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700"
                  >
                    <CardAvatar avatar={player?.avatar} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">
                        {player?.name || "Unknown"}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(record.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <span className="text-red-400 text-xs font-bold bg-red-900/20 px-2 py-0.5 rounded-full flex-shrink-0">
                      LOST
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Monthly summary */}
      {stats?.monthlyStats && stats.monthlyStats.length > 0 && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-md border border-gray-200 dark:border-gray-800">
          <h2 className="text-lg font-bold text-yellow-500 font-display flex items-center gap-2 mb-4">
            <TrendingUp size={18} /> Monthly Summary
          </h2>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {stats.monthlyStats.map((m) => {
              const maxCount = Math.max(...stats.monthlyStats.map((x) => x.count), 1);
              const barH = Math.max(20, (m.count / maxCount) * 80);
              return (
                <div
                  key={m.key}
                  className="flex flex-col items-center gap-1 flex-shrink-0 min-w-[60px]"
                >
                  <span className="text-xs font-bold text-yellow-400">{m.count}</span>
                  <div
                    className="w-10 bg-gradient-to-t from-green-700 to-green-400 rounded-t-md transition-all"
                    style={{ height: `${barH}px` }}
                  />
                  <span className="text-xs text-gray-400 text-center">{m.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Quick links when no data */}
      {players.length === 0 && (
        <div className="felt-bg rounded-2xl p-8 text-center border border-yellow-700/30">
          <p className="text-5xl mb-3">🃏</p>
          <h3 className="text-xl font-bold text-yellow-400 mb-2">
            Welcome to Bhabhi Thula Tracker!
          </h3>
          <p className="text-green-300 text-sm mb-6">
            Start by adding your players, then record who loses each game.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/players"
              className="bg-yellow-500 hover:bg-yellow-400 text-green-900 font-bold px-6 py-3 rounded-xl transition-all"
            >
              👥 Add Players
            </Link>
            <Link
              href="/add-record"
              className="bg-white/10 hover:bg-white/20 text-white font-bold px-6 py-3 rounded-xl transition-all border border-white/20"
            >
              📝 Add Record
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
