"use client";
import CardAvatar from "./CardAvatar";

const RANK_STYLES = [
  { badge: "bg-yellow-400 text-yellow-900", label: "👑" },
  { badge: "bg-gray-300 text-gray-700 dark:bg-gray-500 dark:text-gray-100", label: "🥈" },
  { badge: "bg-amber-600 text-amber-100", label: "🥉" },
];

export default function Leaderboard({ players, records }) {
  const sorted = [...players]
    .sort((a, b) => b.losses - a.losses)
    .slice(0, 10);

  if (sorted.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p className="text-4xl mb-3">🃏</p>
        <p>No players yet. Add players to see the leaderboard!</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {sorted.map((player, index) => {
        const rankStyle = RANK_STYLES[index] || {
          badge: "bg-gray-700 text-gray-300",
          label: `${index + 1}`,
        };
        const pct =
          records.length > 0
            ? ((player.losses / records.length) * 100).toFixed(1)
            : 0;
        const maxLosses = sorted[0]?.losses || 1;
        const barWidth = ((player.losses / maxLosses) * 100).toFixed(0);

        return (
          <div
            key={player.id}
            className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all border border-white/5 group"
          >
            {/* Rank */}
            <div
              className={`rank-badge ${rankStyle.badge} text-xs font-bold flex-shrink-0`}
            >
              {index < 3 ? rankStyle.label : index + 1}
            </div>

            {/* Card avatar */}
            <CardAvatar avatar={player.avatar} size="sm" />

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-sm truncate">
                  {player.name}
                </span>
                <span className="text-xs text-yellow-400 font-bold ml-2 flex-shrink-0">
                  {player.losses} L
                </span>
              </div>
              {/* Progress bar */}
              <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${barWidth}%`,
                    background:
                      index === 0
                        ? "linear-gradient(90deg, #d4af37, #f5e07a)"
                        : index === 1
                          ? "linear-gradient(90deg, #9ca3af, #d1d5db)"
                          : index === 2
                            ? "linear-gradient(90deg, #d97706, #f59e0b)"
                            : "linear-gradient(90deg, #10b981, #34d399)",
                  }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-0.5">{pct}% of games</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
