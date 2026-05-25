# ♠ Bhabhi Thula Tracker

A modern, fully-featured web app to digitally track your friends' Bhabhi Thula card game losses, stats, and analytics.

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Run development server
npm run dev

# 3. Open in browser
http://localhost:3000
```

## 📁 Project Structure

```
bhabhi-thula/
├── src/
│   ├── app/
│   │   ├── layout.js          # Root layout with sidebar + providers
│   │   ├── page.js            # Dashboard
│   │   ├── globals.css        # Global styles + Tailwind
│   │   ├── players/page.js    # Player management
│   │   ├── add-record/page.js # Add game record
│   │   ├── history/page.js    # Records history + filters
│   │   ├── analytics/page.js  # Charts & analytics
│   │   └── settings/page.js   # Settings & data management
│   ├── components/
│   │   ├── layout/
│   │   │   └── Sidebar.js     # Navigation sidebar
│   │   └── ui/
│   │       ├── CardAvatar.js  # Playing card avatar component
│   │       ├── StatCard.js    # Statistics card component
│   │       └── Leaderboard.js # Leaderboard component
│   ├── context/
│   │   └── ThemeContext.js    # Dark/light theme provider
│   └── lib/
│       ├── storage.js         # LocalStorage CRUD utilities
│       └── exports.js         # PDF, Excel & WhatsApp share
├── next.config.js
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

## ✨ Features

- **Dashboard** — Stats, leaderboard, recent records, monthly bar chart
- **Players** — Add/edit/delete players with card avatars, prevent duplicates
- **Add Record** — Select losing player with visual card grid, date/time, notes
- **History** — Search, filter by player/month/year, sort, delete records
- **Analytics** — Bar, line, pie, radar charts with Recharts
- **Settings** — Theme toggle, JSON backup/restore, reset all data
- **Export** — PDF (jsPDF) and Excel (xlsx) download
- **WhatsApp Share** — Funny auto-generated share messages

## 🛠 Tech Stack

| Tech | Version |
|------|---------|
| Next.js | 15.1.0 (App Router) |
| React | 18.3.1 |
| Tailwind CSS | 3.4.17 |
| Recharts | 2.13.3 |
| jsPDF | 2.5.2 |
| xlsx | 0.18.5 |
| react-hot-toast | 2.4.1 |
| lucide-react | 0.469.0 |

## 💾 Data Storage

All data is stored in **LocalStorage** — no backend, no database, no internet required.

- `bhabhi_players` — Player profiles
- `bhabhi_records` — Game loss records
- `bhabhi_theme` — Theme preference
