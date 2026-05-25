"use client";
import { useState, useEffect } from "react";
import { MdCelebration } from "react-icons/md";
import {
  resetAllData,
  exportBackup,
  importBackup,
  getPlayers,
  getRecords,
} from "@/lib/storage";
import { useTheme } from "@/context/ThemeContext";
import toast from "react-hot-toast";
// icons
import { Sun, Moon, Download, Upload, Trash2, RotateCcw, Shield } from "lucide-react";
import { FaTrash } from "react-icons/fa";  
import { FaMoon, FaSun  } from "react-icons/fa"; 
import { IoSettingsSharp } from "react-icons/io5";
import { HiChartBar } from "react-icons/hi";   
import { MdPalette } from "react-icons/md"; 

function SettingRow({ icon, title, desc, children }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100
     dark:border-gray-800">
      <div className="flex items-start gap-3">
        <span className="text-xl mt-0.5">{icon}</span>
        <div>
          <p className="font-semibold text-sm">{title}</p>
          <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
        </div>
      </div>
      <div className="ml-4 flex-shrink-0">{children}</div>
    </div>
  );
}

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const [confirmReset, setConfirmReset] = useState(false);
  const [stats, setStats] = useState({ players: 0, records: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setStats({
      players: getPlayers().length,
      records: getRecords().length,
    });
    setMounted(true);
  }, []);

  const handleExportBackup = () => {
    const data = exportBackup();
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bhabhi-thula-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Backup exported! 💾");
  };

  const handleImportBackup = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        importBackup(data);
        setStats({
          players: getPlayers().length,
          records: getRecords().length,
        });
        toast.success(`Restored! ${data.players.length} players & ${data.records.length} records ${<MdCelebration />}`);
      } catch (err) {
        toast.error("Invalid backup file!");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleReset = () => {
    resetAllData();
    setStats({ players: 0, records: 0 });
    setConfirmReset(false);
    toast.success(`All data cleared! 🗑️`);
  };

  if (!mounted) return null;

  return (
    <div className="page-enter max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="pt-8 md:pt-0">
        <h1 className="text-2xl md:text-3xl flex gap-3 items-center font-black text-yellow-400 font-display">
          <IoSettingsSharp /> Settings
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Manage your app preferences and data
        </p>
      </div>

      {/* Data summary card */}
      <div className="felt-bg rounded-2xl p-5 border border-yellow-700/30 shadow-lg">
        <h2 className="text-sm font-bold flex gap-2 items-center text-yellow-400 mb-4 uppercase tracking-wider">
          <HiChartBar /> Your Data
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/5 rounded-xl p-4 text-center">
            <p className="text-3xl font-black text-white">{stats.players}</p>
            <p className="text-green-300 text-sm mt-1">Players</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4 text-center">
            <p className="text-3xl font-black text-white">{stats.records}</p>
            <p className="text-green-300 text-sm mt-1">Records</p>
          </div>
        </div>
      </div>

      {/* Appearance */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-md border border-gray-200 dark:border-gray-800 space-y-3">
        <h2 className="text-sm font-bold text-gray-500 flex gap-2 items-center dark:text-gray-400 uppercase tracking-wider mb-3">
          <MdPalette /> Appearance
        </h2>

        <SettingRow
          icon={theme === "dark" ? <FaMoon /> : <FaSun />}
          title="Theme"
          desc={`Currently using ${theme} mode`}
        >
          <button
            onClick={toggleTheme}
            className={`relative w-14 h-7 rounded-full transition-all duration-300 focus:outline-none
              ${theme === "dark" ? "bg-yellow-500" : "bg-gray-300"}`}
          >
            <span
              className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-md transition-all duration-300
                ${theme === "dark" ? "left-8" : "left-1"}`}
            />
          </button>
        </SettingRow>
      </div>

      {/* Data management */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-md border border-gray-200 dark:border-gray-800 space-y-3">
        <h2 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
          💾 Data Management
        </h2>

        <SettingRow
          icon="📤"
          title="Export Backup"
          desc="Download all data as JSON file"
        >
          <button
            onClick={handleExportBackup}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all"
          >
            <Download size={14} /> Export
          </button>
        </SettingRow>

        <SettingRow
          icon="📥"
          title="Import Backup"
          desc="Restore data from a backup file"
        >
          <label className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-700 hover:bg-green-600 text-white font-semibold text-sm transition-all cursor-pointer">
            <Upload size={14} /> Import
            <input
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleImportBackup}
            />
          </label>
        </SettingRow>

        <SettingRow
          icon = {<FaTrash />}
          title="Reset All Data"
          desc="Delete all players and records permanently"
        >
          <button
            onClick={() => setConfirmReset(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-700 hover:bg-red-600 text-white font-semibold text-sm transition-all"
          >
            <Trash2 size={14} /> Reset
          </button>
        </SettingRow>
      </div>

      {/* About */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-md border border-gray-200 dark:border-gray-800">
        <h2 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
          ℹ️ About
        </h2>
        <div className="text-center py-4">
          <div className="text-5xl mb-3">♠️</div>
          <h3 className="text-xl font-black text-yellow-400 font-display">
            Bhabhi Thula Tracker
          </h3>
          <p className="text-gray-400 text-sm mt-1">Version 1.0.0</p>
          <p className="text-gray-500 text-xs mt-2 max-w-xs mx-auto">
            Track your card game losses with friends! All data stored locally in your browser.
          </p>
          <div className="flex items-center justify-center gap-2 mt-4 text-gray-500 text-xs">
            <Shield size={12} />
            <span>All data stays on your device. No internet required.</span>
          </div>
        </div>
      </div>

      {/* Confirm reset modal */}
      {confirmReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setConfirmReset(false)} />
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-red-500/30 animate-slide-up">
            <div className="text-center mb-4">
              <span className="text-5xl">⚠️</span>
            </div>
            <h3 className="text-lg font-bold text-red-400 mb-2 text-center">
              Reset All Data?
            </h3>
            <p className="text-gray-500 text-sm text-center mb-6">
              This will permanently delete ALL players ({stats.players}) and ALL records ({stats.records}). This CANNOT be undone!
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmReset(false)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold transition-all text-sm"
              >
                Yes, Delete All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
