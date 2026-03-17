# NeoZ — Personalized News, No Login Required

NeoZ is a modern news aggregation platform that pulls from 40+ trusted RSS sources worldwide and learns what you care about — without ever asking you to sign up.

Built with Next.js 16, deployed on Vercel, and designed to be fast, clean, and genuinely useful.

---

Live at: [neoz.vercel.app](https://neoz.vercel.app)

---

## What It Does

- Aggregates articles across 11 categories: Technology, AI, Science, Business, Sports, World, Pakistan, South Asia, and more
- Learns your interests automatically as you like or bookmark articles
- Personalizes your feed server-side via cookie-based interest tracking — no account needed
- Live local weather widget powered by Open-Meteo — no API key, no tracking
- Full-text search across all articles
- Dark/Light mode with system preference detection
- Mobile-first responsive design with bottom navigation

---

## Tech Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 16 (React 19) |
| Styling | Tailwind CSS 4 + custom design system |
| Components | Custom shadcn-inspired UI |
| Fonts | Syne (headings) + Outfit (body) |
| RSS Parsing | rss-parser |
| Weather | Open-Meteo API (free, no key) |
| Deployment | Vercel (Serverless) |

---

## Project Structure

```
src/
├── app/
│   ├── api/            # News, search, trending, weather endpoints
│   ├── article/[id]/   # Article detail pages
│   ├── category/[slug] # Category pages
│   ├── dashboard/      # User preferences
│   └── search/         # Search UI
├── components/
│   ├── layout/         # Header, Footer, Navigation
│   ├── news/           # Article cards, grids, hero
│   └── ui/             # Reusable UI components
└── lib/
    └── rss/            # Fetching, caching, normalization
```

---

## Personalization Engine

NeoZ scores your interests based on every interaction:

| Signal | Weight |
|---|---|
| Article category match | +50 pts |
| Article tags | +20 pts |
| Title keywords | +15 pts |
| Source | +10 pts |

Interests are stored in a `neoz_interests` cookie (365-day expiry, comma-separated). The API reads this on every request to serve a personalized feed without a database or user account.

---

## Weather Widget

NeoZ displays current local weather at the top of the homepage using the browser's native geolocation API and Open-Meteo — completely free, no API key required, no third-party tracking. The widget is silently hidden if the user denies location permission.

---

## API Endpoints

| Endpoint | Description |
|---|---|
| `/api/news` | Main personalized feed |
| `/api/news/[category]` | Category-specific feed |
| `/api/search` | Full-text search |
| `/api/trending` | Trending topics |
| `/api/weather` | Local weather via Open-Meteo |

---

## RSS System

- Parallel fetching in batches of 10 feeds
- 8-second per-feed timeout
- Deduplication by URL and title
- Content normalization (500-word truncation)
- 10-minute cache refresh interval

---

## News Sources

Sources span major global publishers across categories:

- **Technology:** The Verge, Ars Technica, Wired, MIT Tech Review, Hacker News
- **AI:** OpenAI, Google AI, NVIDIA AI, Towards Data Science, AI News
- **Science:** Nature, Science Daily, Space.com
- **Business:** Financial Times, CNBC, The Economist, Fortune
- **Sports:** Cricbuzz, Sky Sports, BBC Sport
- **World:** BBC News, Al Jazeera, Reuters, NY Times
- **Pakistan:** Dawn, The News International, ARY News

---

## SEO

- Dynamic Open Graph + Twitter Card metadata per page
- JSON-LD structured data (WebSite, Organization, SearchAction)
- Auto-generated sitemap with hourly category updates
- Server-side rendering for full crawlability

---

## Deployment

Live at: [neoz.vercel.app](https://neoz.vercel.app)

Deployed on Vercel with automatic Git-based deployments and edge caching.

---

## Roadmap

- [ ] User accounts with cross-device cloud sync
- [ ] PWA + offline reading support
- [ ] Push notifications for breaking news
- [ ] Email newsletter and news digest
- [ ] Readability mode
- [ ] Multi-language support

---

## License

MIT
