"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getPlayers, addRecord } from "@/lib/storage";
import CardAvatar from "@/components/ui/CardAvatar";
import { Save, ChevronDown } from "lucide-react";
import toast from "react-hot-toast";

export default function AddRecordPage() {
  const router = useRouter();
  const [players, setPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [note, setNote] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [time, setTime] = useState(
    new Date().toTimeString().slice(0, 5)
  );
  const [saving, setSaving] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setPlayers(getPlayers());
    setMounted(true);
  }, []);

  const handleSubmit = async () => {
    if (!selectedPlayer) {
      toast.error("Please select the losing player!");
      return;
    }

    setSaving(true);
    try {
      // Build createdAt from date + time
      const createdAt = new Date(`${date}T${time}:00`).toISOString();
      addRecord({
        playerId: selectedPlayer.id,
        playerName: selectedPlayer.name,
        note: note.trim(),
        date,
        time,
        createdAt,
      });
      toast.success(`${selectedPlayer.name} recorded as loser! 😈`);
      setTimeout(() => router.push("/history"), 1000);
    } catch (err) {
      toast.error(err.message);
      setSaving(false);
    }
  };

  const FUNNY_NOTES = [
    "Thula again! 😂",
    "Bhabhi penalty! 👑",
    "Pure unlucky! 🍀",
    "Skill issue! 🤡",
    "Next time for sure! 🙏",
    "That was personal! 🔥",
    "Bro got humbled! 🙃",
    "Couldn't escape! 😭",
    "Classic move! 🃏",
    // "GG no re! 🎮",
    "Game said sit down! 💀",
    "Too slow, hero! 🐌",
    "Almost legendary... almost! 🥲",
    "Emotional damage! 😭",
    "Luck went offline! 📡",
    "Mission failed successfully! 😂",
  ];

  if (!mounted) return null;

  return (
    <div className="page-enter max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="pt-8 md:pt-0">
        <h1 className="text-2xl md:text-3xl font-black text-yellow-400 font-display">
          📝 Add Record
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Who got the Bhabhi this time?
        </p>
      </div>

      {/* Main card */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md border border-gray-200 dark:border-gray-800 overflow-hidden">
        {/* Felt header */}
        <div className="felt-bg p-5 border-b border-yellow-700/30">
          <p className="text-green-200 text-sm text-center">
            ♠ Select the loser of this round ♥
          </p>
        </div>

        <div className="p-5 space-y-6">
          {/* Player selection */}
          <div>
            <label className="block text-sm font-semibold mb-3 text-gray-600 dark:text-gray-400">
              👤 Select Losing Player *
            </label>
            {players.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl">
                <p className="text-gray-400 text-sm">No players added yet!</p>
                <a href="/players" className="text-yellow-400 text-sm hover:underline mt-1 block">
                  → Go add players first
                </a>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {players.map((player) => (
                  <button
                    key={player.id}
                    onClick={() =>
                      setSelectedPlayer(
                        selectedPlayer?.id === player.id ? null : player
                      )
                    }
                    className={`p-3 rounded-xl border-2 transition-all text-left relative
                      ${
                        selectedPlayer?.id === player.id
                          ? "border-yellow-400 bg-yellow-400/10 shadow-md"
                          : "border-gray-200 dark:border-gray-700 hover:border-yellow-400/50 bg-gray-50 dark:bg-gray-800"
                      }`}
                  >
                    {selectedPlayer?.id === player.id && (
                      <span className="absolute -top-2 -right-2 bg-yellow-400 text-green-900 text-xs font-black w-5 h-5 rounded-full flex items-center justify-center">
                        ✓
                      </span>
                    )}
                    <CardAvatar avatar={player.avatar} size="sm" />
                    <p className="font-bold text-sm mt-2 truncate">{player.name}</p>
                    <p className="text-xs text-gray-400">{player.losses} losses</p>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-600 dark:text-gray-400">
                📅 Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-600 dark:text-gray-400">
                🕐 Time
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all text-sm"
              />
            </div>
          </div>

          {/* Note */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-600 dark:text-gray-400">
              📝 Note (optional)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a funny note..."
              rows={2}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all text-sm resize-none"
            />
            {/* Funny note suggestions */}
            <div className="flex flex-wrap gap-2 mt-2">
              {FUNNY_NOTES.map((fn) => (
                <button
                  key={fn}
                  onClick={() => setNote(fn)}
                  className="text-xs px-2.5 py-1 bg-gray-100 dark:bg-gray-800 hover:bg-yellow-100 dark:hover:bg-yellow-900/20 border border-gray-200 dark:border-gray-700 rounded-full text-gray-600 dark:text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-400 transition-all"
                >
                  {fn}
                </button>
              ))}
            </div>
          </div>

          {/* Preview */}
          {selectedPlayer && (
            <div className="bg-green-900/20 border border-green-600/30 rounded-xl p-4 animate-fade-in">
              <p className="text-sm text-green-400 font-semibold mb-2">📋 Record Preview:</p>
              <div className="flex items-center gap-3">
                <CardAvatar avatar={selectedPlayer.avatar} size="sm" />
                <div>
                  <p className="font-bold">{selectedPlayer.name}</p>
                  <p className="text-sm text-gray-400">
                    {new Date(`${date}T${time}`).toLocaleString("en-US", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                  {note && <p className="text-xs text-gray-500 italic">"{note}"</p>}
                </div>
              </div>
            </div>
          )}

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={saving || !selectedPlayer}
            className={`w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all
              ${
                selectedPlayer
                  ? "bg-yellow-500 hover:bg-yellow-400 text-green-900 shadow-lg"
                  : "bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
              }`}
          >
            <Save size={16} />
            {saving ? "Saving..." : "Save Record"}
          </button>
        </div>
      </div>
    </div>
  );
}
