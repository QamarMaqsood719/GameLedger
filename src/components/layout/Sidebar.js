"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  PlusCircle,
  History,
  BarChart3,
  Settings,
  Menu,
  X,
  Spade,
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { Sun, Moon } from "lucide-react";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/players", label: "Players", icon: Users },
  { href: "/add-record", label: "Add Record", icon: PlusCircle },
  { href: "/history", label: "History", icon: History },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const NavContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-yellow-700/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-yellow-500 flex items-center justify-center shadow-lg">
            <span className="text-green-900 font-black text-lg">♠</span>
          </div>
          <div>
            <h1 className="font-black text-yellow-400 text-lg leading-tight font-display">
              Bhabhi
            </h1>
            <p className="text-green-300 text-xs">Thula Tracker</p>
          </div>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                ${
                  active
                    ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 shadow-md"
                    : "text-green-200 hover:bg-white/5 hover:text-yellow-300"
                }`}
            >
              <Icon
                size={18}
                className={`${active ? "text-yellow-400" : "text-green-400 group-hover:text-yellow-400"} transition-colors`}
              />
              <span className="font-medium text-sm">{label}</span>
              {active && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-yellow-400" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="p-4 border-t border-yellow-700/30">
        <button
          onClick={toggleTheme}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all text-green-200 hover:text-yellow-300"
        >
          {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          <span className="text-sm font-medium">
            {theme === "dark" ? "Light Mode" : "Dark Mode"}
          </span>
        </button>
        <div className="mt-3 text-center">
          <p className="text-green-600 text-xs">♠ ♥ ♦ ♣</p>
          <p className="text-green-700 text-xs mt-1">v1.0.0</p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle button */}
      <button
        className="fixed top-2 left-6 z-50 md:hidden bg-green-900 border border-yellow-600/40 text-yellow-400 p-2 rounded-lg shadow-lg"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Desktop sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 h-full w-64 flex-col felt-bg border-r border-yellow-700/30 shadow-2xl z-30">
        <NavContent />
      </aside>

      {/* Mobile sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full w-64 flex-col felt-bg border-r border-yellow-700/30 shadow-2xl z-50 md:hidden flex transition-transform duration-300
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <NavContent />
      </aside>
    </>
  );
}
