"use client";

const SUIT_COLORS = {
  "♠": "text-gray-900 dark:text-gray-100",
  "♣": "text-gray-900 dark:text-gray-100",
  "♥": "text-red-600",
  "♦": "text-red-600",
};

export default function CardAvatar({ avatar, size = "md", className = "" }) {
  if (!avatar) return null;

  const sizes = {
    sm: { card: "w-10 h-14", rank: "text-xs", suit: "text-lg" },
    md: { card: "w-14 h-20", rank: "text-sm", suit: "text-2xl" },
    lg: { card: "w-20 h-28", rank: "text-base", suit: "text-4xl" },
    xl: { card: "w-28 h-40", rank: "text-lg", suit: "text-6xl" },
  };

  const s = sizes[size] || sizes.md;
  const suitColor = SUIT_COLORS[avatar.suit] || "text-gray-900";

  return (
    <div
      className={`playing-card ${s.card} bg-white flex flex-col items-center justify-center relative overflow-hidden cursor-pointer ${className}`}
    >
      {/* Top rank */}
      <span
        className={`absolute top-1 left-1.5 ${s.rank} font-black leading-none ${suitColor}`}
      >
        {avatar.rank}
      </span>
      <span
        className={`absolute top-3.5 left-1.5 ${s.rank} leading-none ${suitColor}`}
        style={{ fontSize: "0.6em" }}
      >
        {avatar.suit}
      </span>

      {/* Center suit */}
      <span className={`${s.suit} ${suitColor} font-normal select-none`}>
        {avatar.suit}
      </span>

      {/* Bottom rank (flipped) */}
      <span
        className={`absolute bottom-1 right-1.5 ${s.rank} font-black leading-none ${suitColor} rotate-180`}
      >
        {avatar.rank}
      </span>
    </div>
  );
}

export function CardAvatarMini({ avatar }) {
  if (!avatar) return <span className="text-xl">🃏</span>;
  const suitColor =
    avatar.suit === "♥" || avatar.suit === "♦"
      ? "text-red-500"
      : "text-gray-800 dark:text-gray-200";
  return (
    <span className={`font-black text-sm ${suitColor}`}>
      {avatar.rank}
      {avatar.suit}
    </span>
  );
}
