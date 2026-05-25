"use client";
import { useState, useEffect } from "react";
import {
  getPlayers,
  addPlayer,
  updatePlayer,
  deletePlayer,
  getRecords,
  getRandomAvatar,
  getAllAvatars,
} from "@/lib/storage";
import CardAvatar from "@/components/ui/CardAvatar";
import { Plus, Pencil, Trash2, Phone, X, Check, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";

function PlayerModal({ player, onClose, onSave }) {
  const [name, setName] = useState(player?.name || "");
  const [mobile, setMobile] = useState(player?.mobile || "");
  const [avatar, setAvatar] = useState(player?.avatar || getRandomAvatar());
  const allAvatars = getAllAvatars();

  const handleSave = () => {
    if (!name.trim()) {
      toast.error("Player name is required!");
      return;
    }
    onSave({ name: name.trim(), mobile: mobile.trim(), avatar });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md border border-gray-200 dark:border-gray-700 animate-slide-up">
        <div className="felt-bg p-5 rounded-t-2xl border-b border-yellow-700/30">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-yellow-400">
              {player ? "✏️ Edit Player" : "➕ Add Player"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-5 space-y-4">
          {/* Avatar picker */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-600 dark:text-gray-400">
              Choose Card Avatar
            </label>
            <div className="grid grid-cols-6 gap-2">
              {allAvatars.map((av, i) => (
                <button
                  key={i}
                  onClick={() => setAvatar(av)}
                  className={`p-1 rounded-lg transition-all ${
                    avatar.rank === av.rank && avatar.suit === av.suit
                      ? "ring-2 ring-yellow-400 bg-yellow-400/10"
                      : "hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  <CardAvatar avatar={av} size="sm" />
                </button>
              ))}
            </div>
            <button
              onClick={() => setAvatar(getRandomAvatar())}
              className="mt-2 flex items-center gap-1 text-xs text-green-500 hover:text-green-400"
            >
              <RefreshCw size={12} /> Random card
            </button>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-600 dark:text-gray-400">
              Player Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter Player Name"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all"
            />
          </div>

          {/* Mobile */}
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-600 dark:text-gray-400">
              Mobile Number (optional)
            </label>
            <div className="relative">
              <Phone
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="+92 300 0000000"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all text-sm font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 py-2.5 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-green-900 font-bold transition-all text-sm flex items-center justify-center gap-2"
            >
              <Check size={16} />
              {player ? "Save Changes" : "Add Player"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PlayersPage() {
  const [players, setPlayers] = useState([]);
  const [records, setRecords] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setPlayers(getPlayers());
    setRecords(getRecords());
    setMounted(true);
  }, []);

  const handleSave = (data) => {
    try {
      if (editingPlayer) {
        updatePlayer(editingPlayer.id, data);
        toast.success(`${data.name} updated! ✅`);
      } else {
        addPlayer(data);
        toast.success(`${data.name} added! 🃏`);
      }
      setPlayers(getPlayers());
      setShowModal(false);
      setEditingPlayer(null);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = (id) => {
    const player = players.find((p) => p.id === id);
    deletePlayer(id);
    setPlayers(getPlayers());
    setRecords(getRecords());
    setConfirmDelete(null);
    toast.success(`${player?.name} removed! 🗑️`);
  };

  const sortedPlayers = [...players].sort((a, b) => b.losses - a.losses);

  if (!mounted) return null;

  return (
    <div className="page-enter space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pt-8 md:pt-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-yellow-400 font-display">
            👥 Players
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {players.length} player{players.length !== 1 ? "s" : ""} registered
          </p>
        </div>
        <button
          onClick={() => {
            setEditingPlayer(null);
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-green-900 font-bold px-4 py-2.5 rounded-xl transition-all shadow-lg text-sm"
        >
          <Plus size={16} />
          Add Player
        </button>
      </div>

      {/* Players grid */}
      {sortedPlayers.length === 0 ? (
        <div className="felt-bg rounded-2xl p-12 text-center border border-yellow-700/30">
          <p className="text-5xl mb-4">🃏</p>
          <h3 className="text-xl font-bold text-yellow-400 mb-2">No Players Yet</h3>
          <p className="text-green-300 text-sm mb-6">
            Add your first player to start tracking!
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="bg-yellow-500 hover:bg-yellow-400 text-green-900 font-bold px-8 py-3 rounded-xl transition-all"
          >
            Add First Player
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {sortedPlayers.map((player, index) => {
            const rank =
              index === 0 ? "👑" : index === 1 ? "🥈" : index === 2 ? "🥉" : null;
            const pct =
              records.length > 0
                ? ((player.losses / records.length) * 100).toFixed(1)
                : 0;

            return (
              <div
                key={player.id}
                className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-md border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-all group animate-fade-in"
              >
                {/* Card avatar + rank */}
                <div className="flex justify-between items-start mb-4">
                  <CardAvatar avatar={player.avatar} size="md" />
                  <div className="text-right">
                    {rank && (
                      <span className="text-2xl block mb-1">{rank}</span>
                    )}
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      #{index + 1}
                    </span>
                  </div>
                </div>

                {/* Name */}
                <h3 className="font-black text-lg truncate">{player.name}</h3>
                {player.mobile && (
                  <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                    <Phone size={10} /> {player.mobile}
                  </p>
                )}

                {/* Losses */}
                <div className="mt-3 flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-black text-red-400">
                      {player.losses}
                    </span>
                    <span className="text-gray-400 text-sm ml-1">losses</span>
                  </div>
                  <span className="text-xs bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 px-2 py-1 rounded-full font-semibold">
                    {pct}%
                  </span>
                </div>

                {/* Progress bar */}
                <div className="mt-2 h-1 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-red-600 to-red-400"
                    style={{
                      width: `${Math.min(pct, 100)}%`,
                      transition: "width 0.8s ease",
                    }}
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => {
                      setEditingPlayer(player);
                      setShowModal(true);
                    }}
                    className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-all text-xs font-medium"
                  >
                    <Pencil size={12} /> Edit
                  </button>
                  <button
                    onClick={() => setConfirmDelete(player.id)}
                    className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all text-xs font-medium"
                  >
                    <Trash2 size={12} /> Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modals */}
      {showModal && (
        <PlayerModal
          player={editingPlayer}
          onClose={() => {
            setShowModal(false);
            setEditingPlayer(null);
          }}
          onSave={handleSave}
        />
      )}

      {/* Confirm delete */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setConfirmDelete(null)} />
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-red-500/30 animate-slide-up">
            <h3 className="text-lg font-bold text-red-400 mb-2">⚠️ Confirm Delete</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
              This will delete the player and ALL their records. This action cannot be undone!
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all text-sm"
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
