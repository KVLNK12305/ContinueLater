# ContinueLater — Learning Continuity Chrome Extension

> **Never lose your learning flow.**

[![Manifest V3](https://img.shields.io/badge/Manifest-V3-brightgreen)](https://developer.chrome.com/docs/extensions/mv3/intro/)
[![React 18](https://img.shields.io/badge/React-18.3-blue)](https://react.dev/)
[![TypeScript 5](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![Vite 5](https://img.shields.io/badge/Vite-5.4-purple)](https://vitejs.dev/)
[![Offline First](https://img.shields.io/badge/API-Zero%20Cost%20%2F%20100%25%20Offline-orange)](#zero-cost-architecture)

**ContinueLater** is a production-grade Chrome Extension designed with Google Labs aesthetics and Notion-like minimalism. People constantly begin learning — watching podcasts, researching topics, reading newsletters, browsing blogs, watching tutorials, and exploring GitHub repos — then leave. Their context disappears. 

ContinueLater automatically detects unfinished learning sessions and intelligently brings them back when and where you need them.

This is **NOT bookmarking**. It is **Learning Continuity**.

---

## Key Features

- **Automatic Unfinished Detection**: Tracks scroll depth, video timestamps, PDF page numbers, and active reading time. Automatically captures unfinished sessions when tabs close, user navigates away, or goes idle.
- **12 Platform-Specific Parsers**:
  - **YouTube**: Captures title, channel, duration, timestamp, play %, captions availability.
  - **Google Search**: Captures search query, top visited result titles, scroll progress.
  - **Substack**: Captures publication, author, headline, estimated reading time, scroll %.
  - **Medium**: Captures headline, author, scroll depth, reading time.
  - **GitHub Repos, README & Discussions**: Captures repository, opened files, stars, language, discussion threads.
  - **Dev.to & Hashnode**: Captures tech article headline, author, reading time, scroll depth.
  - **Wikipedia**: Captures article name, scroll depth, reading time.
  - **Google Docs**: Captures document title (read-only) and scroll position.
  - **PDF Documents**: Captures PDF file name, current page number, total pages, scroll percentage.
  - **Generic Web Parser**: Fallback parser for tech blogs and documentation sites.
- **Smart Reminders**: Schedule reminders for Tomorrow (same time), After Lunch (2:00 PM), This Evening (7:00 PM), Weekend (Sat 10:00 AM), Next Monday (9:00 AM), Custom Date/Time, or Never.
- **Rich Chrome Notifications**: Interactive notification buttons ("Resume", "Snooze 1hr") with custom action handlers.
- **Smart Insights & Gamification**:
  - Weekly metrics: Started, Finished, Abandoned, Recovered sessions, Total Learning Hours.
  - Streak tracking with animated flame indicators.
  - Learning XP, Level progression, and 6 Achievement Badges (Avid Reader, Scholar, Podcast Champion, Code Explorer, Consistent Learner, Flow Restorer).
- **Zero-API Calendar & Email Integration**:
  - One-click Google Calendar URL generator with prefilled title, description, and resume link.
  - One-click mailto: compose link generator with prefilled resume context.
- **Instant Fuzzy Search & Filter Chips**: Filter by Watching, Reading, Coding, Research, Newsletters, GitHub, Articles, PDFs, or search by title, author, topic, tag.
- **Keyboard Shortcut**: Press `Ctrl+Shift+L` (or `Cmd+Shift+L`) to toggle the dashboard anywhere in Chrome.
- **Google Material Design 3 Aesthetics**: Glassmorphic cards, HSL tailored color themes (Light / Dark / System), smooth micro-animations.

---

## Zero-Cost Architecture

- **100% Local & Offline**: All data stored securely in `chrome.storage.local`.
- **Zero Backend**: No servers, no Firebase, no Supabase, no external APIs.
- **Zero Paid APIs**: Calendar and Email functionality work via standard URL protocols (`https://calendar.google.com/calendar/render` and `mailto:`).

---

## Installation & Setup Guide

### Method 1: Load Unpacked Extension (Development / Testing)

1. Clone or download this repository.
2. Open Google Chrome and navigate to `chrome://extensions`.
3. Enable **Developer mode** using the toggle switch in the top-right corner.
4. Click **Load unpacked**.
5. Select the `dist` directory inside this project folder (`/home/kushal/Projects/Extension/dist`).
6. The **ContinueLater** icon will appear in your Chrome toolbar. Pin it for quick access!

### Method 2: Packaging for Chrome Web Store Distribution

1. Run the package command:
   ```bash
   pnpm run package
   ```
2. This creates `continue-later-extension.zip` containing the bundled release files ready for upload to the Chrome Web Store Developer Dashboard.

---

## Development & Testing Guide

### Prerequisites
- Node.js 18+
- `pnpm` or `npm`

### Commands
```bash
# Install dependencies
pnpm install

# Run Vitest unit test suite (100% pass)
npx vitest run

# Run TypeScript check & Vite build
npx tsc && npx vite build

# Run Vite dev server with hot module replacement
pnpm run dev
```

---

## Project Structure

```
src/
├── background/
│   ├── service-worker.ts          # Main MV3 service worker entry
│   ├── tab-tracker.ts             # Tab lifecycle monitoring
│   ├── alarm-manager.ts           # Reminder scheduling via chrome.alarms
│   └── notification-manager.ts    # Rich Chrome notifications
├── content/
│   ├── content-script.ts          # Injected progress tracker
│   ├── observer.ts                # Scroll & video MutationObserver
│   └── detector.ts                # Threshold completion detection
├── parsers/                       # 12 Platform Parsers
│   ├── types.ts                   # LearningSource contract
│   ├── youtube.ts
│   ├── google-search.ts
│   ├── substack.ts
│   ├── medium.ts
│   ├── github.ts
│   ├── devto.ts
│   ├── hashnode.ts
│   ├── wikipedia.ts
│   ├── google-docs.ts
│   ├── pdf.ts
│   ├── generic.ts
│   └── registry.ts
├── storage/
│   ├── learning-store.ts          # Storage CRUD for LearningObject
│   ├── settings-store.ts          # User preferences
│   ├── stats-store.ts             # Analytics, XP, and badges
│   └── migration.ts              # Data migrations
├── types/
│   ├── learning-object.ts         # Data model
│   ├── settings.ts
│   ├── stats.ts
│   ├── filters.ts
│   └── enums.ts
├── utils/
│   ├── calendar.ts                # Google Calendar link generator
│   ├── email.ts                   # Mailto compose link generator
│   ├── time.ts                    # Time formatting & schedule calculator
│   ├── search.ts                  # Fuzzy instant search
│   ├── badges.ts                  # Badge definitions
│   └── id.ts                      # Cross-environment UUID
├── popup/
│   ├── index.html
│   ├── main.tsx
│   ├── App.tsx
│   └── pages/
│       ├── Dashboard.tsx           # Home view
│       ├── Timeline.tsx            # Chronological history
│       ├── Insights.tsx            # Weekly stats & badges
│       ├── Settings.tsx            # Preferences & backup
│       └── AIPreview.tsx           # Future AI UI mockups
├── components/                    # 15+ MD3 UI Components
│   ├── LearningCard.tsx
│   ├── ProgressRing.tsx
│   ├── FilterBar.tsx
│   ├── SearchBar.tsx
│   ├── StreakDisplay.tsx
│   ├── BadgeGrid.tsx
│   ├── ScheduleModal.tsx
│   ├── CalendarButton.tsx
│   ├── EmailButton.tsx
│   ├── TabNav.tsx
│   ├── EmptyState.tsx
│   └── AIFeatureCard.tsx
└── styles/
    ├── tokens.css                 # MD3 tokens
    ├── global.css                 # Reset & popup dimensions
    └── animations.css             # Micro-animations
```

---

## Manifest V3 Permissions Justification

| Permission | Purpose |
|---|---|
| `tabs` | Monitor tab lifecycle (close/navigate) to detect unfinished learning sessions |
| `storage` | Store learning items, settings, and gamification stats locally |
| `alarms` | Trigger smart scheduled reminders without background polling |
| `notifications` | Display native Chrome notifications with action buttons |
| `contextMenus` | Allow right-click "Save to ContinueLater" on any page or link |
| `activeTab` | Access current tab metadata when user activates extension |
| `scripting` | Inject progress tracking scripts into active learning tabs |

---

## Future Roadmap (AI Features Preview)

- **Contextual Resume Summaries**: Local LLM summarization of where you left off.
- **Smart Learning Playlists**: Grouping related articles into timed study sessions.
- **Knowledge Graph Clustering**: Graph clustering of learning topics across YouTube & GitHub.

---

## License

MIT License. Designed with Google Labs & Notion design principles.
