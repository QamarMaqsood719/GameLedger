"use client";
import { useState, useEffect, useMemo } from "react";
import { getRecords, getPlayers, deleteRecord } from "@/lib/storage";
import { exportToPDF, exportToExcel, shareOnWhatsApp } from "@/lib/exports";
import CardAvatar from "@/components/ui/CardAvatar";
import {
  Search,
  Filter,
  Trash2,
  Download,
  FileSpreadsheet,
  Share2,
  SortAsc,
  SortDesc,
} from "lucide-react";
import toast from "react-hot-toast";

export default function HistoryPage() {
  const [records, setRecords] = useState([]);
  const [players, setPlayers] = useState([]);
  const [search, setSearch] = useState("");
  const [filterPlayer, setFilterPlayer] = useState("");
  const [filterMonth, setFilterMonth] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [exporting, setExporting] = useState("");

  useEffect(() => {
    setRecords(getRecords());
    setPlayers(getPlayers());
    setMounted(true);
  }, []);

  const years = useMemo(() => {
    const ys = new Set(records.map((r) => new Date(r.createdAt).getFullYear()));
    return Array.from(ys).sort((a, b) => b - a);
  }, [records]);

  const filteredRecords = useMemo(() => {
    let result = [...records];

    // Search
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((r) => {
        const p = players.find((p) => p.id === r.playerId);
        return (
          p?.name.toLowerCase().includes(q) ||
          (r.note && r.note.toLowerCase().includes(q))
        );
      });
    }

    // Filter by player
    if (filterPlayer) {
      result = result.filter((r) => r.playerId === filterPlayer);
    }

    // Filter by month
    if (filterMonth) {
      result = result.filter(
        (r) => new Date(r.createdAt).getMonth() + 1 === parseInt(filterMonth)
      );
    }

    // Filter by year
    if (filterYear) {
      result = result.filter(
        (r) => new Date(r.createdAt).getFullYear() === parseInt(filterYear)
      );
    }

    // Sort
    result.sort((a, b) => {
      const diff = new Date(b.createdAt) - new Date(a.createdAt);
      return sortOrder === "newest" ? diff : -diff;
    });

    return result;
  }, [records, players, search, filterPlayer, filterMonth, filterYear, sortOrder]);

  const handleDelete = (id) => {
    deleteRecord(id);
    setRecords(getRecords());
    setPlayers(getPlayers());
    setConfirmDelete(null);
    toast.success("Record deleted! 🗑️");
  };

  const handleExportPDF = async () => {
    if (records.length === 0) {
      toast.error("No records to export!");
      return;
    }
    setExporting("pdf");
    try {
      await exportToPDF(records, players);
      toast.success("PDF downloaded! 📄");
    } catch (e) {
      toast.error("Export failed!");
    }
    setExporting("");
  };

  const handleExportExcel = async () => {
    if (records.length === 0) {
      toast.error("No records to export!");
      return;
    }
    setExporting("xlsx");
    try {
      await exportToExcel(records, players);
      toast.success("Excel downloaded! 📊");
    } catch (e) {
      toast.error("Export failed!");
    }
    setExporting("");
  };

  const handleShare = () => {
    if (players.length === 0) {
      toast.error("No data to share!");
      return;
    }
    shareOnWhatsApp(players, records);
  };

  const clearFilters = () => {
    setSearch("");
    setFilterPlayer("");
    setFilterMonth("");
    setFilterYear("");
  };

  if (!mounted) return null;

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  return (
    <div className="page-enter space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-8 md:pt-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-yellow-400 font-display">
            📋 History
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {records.length} total records
          </p>
        </div>

        {/* Export & Share buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-green-600 hover:bg-green-500 text-white font-semibold text-sm transition-all"
          >
            <Share2 size={14} /> WhatsApp
          </button>
          <button
            onClick={handleExportPDF}
            disabled={exporting === "pdf"}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-700 hover:bg-red-600 text-white font-semibold text-sm transition-all"
          >
            <Download size={14} />
            {exporting === "pdf" ? "..." : "PDF"}
          </button>
          <button
            onClick={handleExportExcel}
            disabled={exporting === "xlsx"}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-green-700 hover:bg-green-600 text-white font-semibold text-sm transition-all"
          >
            <FileSpreadsheet size={14} />
            {exporting === "xlsx" ? "..." : "Excel"}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-gray-200 dark:border-gray-800 space-y-3">
        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search player name or note..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 text-sm transition-all"
          />
        </div>

        {/* Filters row */}
        <div className="flex flex-wrap gap-3">
          <select
            value={filterPlayer}
            onChange={(e) => setFilterPlayer(e.target.value)}
            className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 text-sm transition-all flex-1 min-w-[120px]"
          >
            <option value="">All Players</option>
            {players.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          <select
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
            className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 text-sm transition-all flex-1 min-w-[110px]"
          >
            <option value="">All Months</option>
            {months.map((m, i) => (
              <option key={i + 1} value={i + 1}>
                {m}
              </option>
            ))}
          </select>

          <select
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
            className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 text-sm transition-all flex-1 min-w-[100px]"
          >
            <option value="">All Years</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>

          <button
            onClick={() => setSortOrder(sortOrder === "newest" ? "oldest" : "newest")}
            className="flex items-center gap-1 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all text-sm"
          >
            {sortOrder === "newest" ? <SortDesc size={14} /> : <SortAsc size={14} />}
            {sortOrder === "newest" ? "Newest" : "Oldest"}
          </button>

          {(search || filterPlayer || filterMonth || filterYear) && (
            <button
              onClick={clearFilters}
              className="px-3 py-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all text-sm"
            >
              Clear
            </button>
          )}
        </div>

        <p className="text-xs text-gray-400">
          Showing {filteredRecords.length} of {records.length} records
        </p>
      </div>

      {/* Records table / list */}
      {filteredRecords.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
          <p className="text-4xl mb-3">🔍</p>
          <p className="text-gray-400">
            {records.length === 0
              ? "No records yet. Start adding game results!"
              : "No records match your filters."}
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    #
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Player
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Note
                  </th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((record, index) => {
                  const player = players.find((p) => p.id === record.playerId);
                  const date = new Date(record.createdAt);
                  return (
                    <tr
                      key={record.id}
                      className="table-row-hover border-b border-gray-50 dark:border-gray-800/50 transition-colors"
                    >
                      <td className="px-5 py-3 text-sm text-gray-400">
                        {filteredRecords.length - index}
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <CardAvatar avatar={player?.avatar} size="sm" />
                          <div>
                            <p className="font-semibold text-sm">
                              {player?.name || "Unknown"}
                            </p>
                            <p className="text-xs text-gray-400">
                              {player?.losses} total losses
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-sm text-gray-600 dark:text-gray-400">
                        {date.toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-5 py-3 text-sm text-gray-600 dark:text-gray-400">
                        {date.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="px-5 py-3 text-sm text-gray-500 dark:text-gray-500 italic max-w-[200px] truncate">
                        {record.note || "-"}
                      </td>
                      <td className="px-5 py-3 text-right">
                        <button
                          onClick={() => setConfirmDelete(record.id)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-900/20 p-1.5 rounded-lg transition-all"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile list */}
          <div className="md:hidden divide-y divide-gray-100 dark:divide-gray-800">
            {filteredRecords.map((record, index) => {
              const player = players.find((p) => p.id === record.playerId);
              const date = new Date(record.createdAt);
              return (
                <div key={record.id} className="p-4 flex items-center gap-3">
                  <span className="text-xs text-gray-400 w-6 flex-shrink-0">
                    {filteredRecords.length - index}
                  </span>
                  <CardAvatar avatar={player?.avatar} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">
                      {player?.name || "Unknown"}
                    </p>
                    <p className="text-xs text-gray-400">
                      {date.toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "short",
                      })}{" "}
                      · {date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                    {record.note && (
                      <p className="text-xs text-gray-500 italic truncate">
                        "{record.note}"
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => setConfirmDelete(record.id)}
                    className="text-red-400 hover:text-red-300 p-1.5 rounded-lg flex-shrink-0"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Confirm delete */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setConfirmDelete(null)} />
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-red-500/30 animate-slide-up">
            <h3 className="text-lg font-bold text-red-400 mb-2">⚠️ Delete Record</h3>
            <p className="text-gray-500 text-sm mb-6">
              This will delete this record and update player stats. Cannot be undone!
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-500 transition-all text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold transition-all text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
