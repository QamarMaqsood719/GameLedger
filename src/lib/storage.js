// Storage keys
const KEYS = {
  PLAYERS: "bhabhi_players",
  RECORDS: "bhabhi_records",
  THEME: "bhabhi_theme",
};

// Player CRUD
export function getPlayers() {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEYS.PLAYERS) || "[]");
  } catch {
    return [];
  }
}

export function savePlayers(players) {
  localStorage.setItem(KEYS.PLAYERS, JSON.stringify(players));
}

export function addPlayer(player) {
  const players = getPlayers();
  const exists = players.some(
    (p) => p.name.toLowerCase() === player.name.toLowerCase()
  );
  if (exists) throw new Error("Player with this name already exists");
  const newPlayer = {
    ...player,
    id: Date.now().toString(),
    losses: 0,
    createdAt: new Date().toISOString(),
    avatar: getRandomAvatar(),
  };
  players.push(newPlayer);
  savePlayers(players);
  return newPlayer;
}

export function updatePlayer(id, updates) {
  const players = getPlayers();
  const index = players.findIndex((p) => p.id === id);
  if (index === -1) throw new Error("Player not found");
  // Check duplicate name for edit
  const dupName = players.some(
    (p) =>
      p.id !== id && p.name.toLowerCase() === (updates.name || "").toLowerCase()
  );
  if (dupName) throw new Error("Player with this name already exists");
  players[index] = { ...players[index], ...updates };
  savePlayers(players);
  return players[index];
}

export function deletePlayer(id) {
  const players = getPlayers().filter((p) => p.id !== id);
  savePlayers(players);
  // Also delete their records
  const records = getRecords().filter((r) => r.playerId !== id);
  saveRecords(records);
}

// Records CRUD
export function getRecords() {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEYS.RECORDS) || "[]");
  } catch {
    return [];
  }
}

export function saveRecords(records) {
  localStorage.setItem(KEYS.RECORDS, JSON.stringify(records));
}

export function addRecord(record) {
  const records = getRecords();
  const newRecord = {
    ...record,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  records.push(newRecord);
  saveRecords(records);

  // Update player loss count
  const players = getPlayers();
  const playerIndex = players.findIndex((p) => p.id === record.playerId);
  if (playerIndex !== -1) {
    players[playerIndex].losses = (players[playerIndex].losses || 0) + 1;
    savePlayers(players);
  }

  return newRecord;
}

export function deleteRecord(id) {
  const records = getRecords();
  const record = records.find((r) => r.id === id);
  const remaining = records.filter((r) => r.id !== id);
  saveRecords(remaining);

  // Decrement player losses
  if (record) {
    const players = getPlayers();
    const pi = players.findIndex((p) => p.id === record.playerId);
    if (pi !== -1 && players[pi].losses > 0) {
      players[pi].losses -= 1;
      savePlayers(players);
    }
  }
}

// Theme
export function getTheme() {
  if (typeof window === "undefined") return "dark";
  return localStorage.getItem(KEYS.THEME) || "dark";
}

export function saveTheme(theme) {
  localStorage.setItem(KEYS.THEME, theme);
}

// Analytics helpers
export function getStats() {
  const records = getRecords();
  const players = getPlayers();

  const totalGames = records.length;
  const totalPlayers = players.length;

  // Most losing player
  const sortedPlayers = [...players].sort((a, b) => b.losses - a.losses);
  const mostLosingPlayer = sortedPlayers[0] || null;

  // Monthly stats (last 6 months)
  const monthlyStats = getMonthlyStats(records);

  // Recent records (last 10)
  const recentRecords = [...records]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 10);

  return {
    totalGames,
    totalPlayers,
    mostLosingPlayer,
    monthlyStats,
    recentRecords,
    leaderboard: sortedPlayers,
  };
}

export function getMonthlyStats(records) {
  const months = {};
  records.forEach((r) => {
    const date = new Date(r.createdAt);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    const label = date.toLocaleString("default", {
      month: "short",
      year: "2-digit",
    });
    if (!months[key]) months[key] = { label, count: 0, key };
    months[key].count += 1;
  });

  return Object.values(months)
    .sort((a, b) => a.key.localeCompare(b.key))
    .slice(-6);
}

export function getPlayerMonthlyData(records, players) {
  const data = {};
  records.forEach((r) => {
    const date = new Date(r.createdAt);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    const label = date.toLocaleString("default", {
      month: "short",
      year: "2-digit",
    });
    if (!data[key]) data[key] = { label };
    const player = players.find((p) => p.id === r.playerId);
    if (player) {
      data[key][player.name] = (data[key][player.name] || 0) + 1;
    }
  });
  return Object.values(data).sort((a, b) =>
    a.label.localeCompare(b.label)
  );
}

// Backup / Restore
export function exportBackup() {
  return {
    players: getPlayers(),
    records: getRecords(),
    exportedAt: new Date().toISOString(),
    version: "1.0",
  };
}

export function importBackup(data) {
  if (!data.players || !data.records) throw new Error("Invalid backup file");
  savePlayers(data.players);
  saveRecords(data.records);
}

export function resetAllData() {
  localStorage.removeItem(KEYS.PLAYERS);
  localStorage.removeItem(KEYS.RECORDS);
}

// Avatar system
const CARD_AVATARS = [
  { rank: "A", suit: "♠", color: "black" },
  { rank: "K", suit: "♥", color: "red" },
  { rank: "Q", suit: "♦", color: "red" },
  { rank: "J", suit: "♣", color: "black" },
  { rank: "10", suit: "♠", color: "black" },
  { rank: "9", suit: "♥", color: "red" },
  { rank: "8", suit: "♦", color: "red" },
  { rank: "7", suit: "♣", color: "black" },
  { rank: "A", suit: "♥", color: "red" },
  { rank: "K", suit: "♠", color: "black" },
  { rank: "Q", suit: "♣", color: "black" },
  { rank: "J", suit: "♦", color: "red" },
];

export function getRandomAvatar() {
  return CARD_AVATARS[Math.floor(Math.random() * CARD_AVATARS.length)];
}

export function getAllAvatars() {
  return CARD_AVATARS;
}
