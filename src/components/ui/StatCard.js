"use client";

export default function StatCard({ icon, label, value, subtitle, gradient, iconBg }) {
  return (
    <div
      className={`stat-card rounded-2xl p-5 shadow-lg border border-white/10 relative overflow-hidden
        ${gradient || "bg-white dark:bg-gray-800"}`}
    >
      {/* Background decoration */}
      <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-white/5" />
      <div className="absolute -right-2 -bottom-4 w-16 h-16 rounded-full bg-white/5" />

      <div className="relative z-10 flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider opacity-70 mb-1">
            {label}
          </p>
          <p className="text-3xl font-black mb-1">{value}</p>
          {subtitle && (
            <p className="text-xs opacity-60 truncate max-w-[140px]">{subtitle}</p>
          )}
        </div>
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-md flex-shrink-0
            ${iconBg || "bg-white/10"}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
