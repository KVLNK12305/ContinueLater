# ContinueLater 🚀

> A cross-browser extension (Chrome & Firefox) built to explore Manifest V3, track unfinished rabbit holes, and never lose your place when learning online.

[![Manifest V3](https://img.shields.io/badge/Manifest-V3-brightgreen)](https://developer.chrome.com/docs/extensions/mv3/intro/)
[![Firefox & Chrome](https://img.shields.io/badge/Browsers-Chrome%20%7C%20Firefox-orange)](https://addons.mozilla.org)
[![React 18](https://img.shields.io/badge/React-18.2-blue)](https://react.dev/)
[![TypeScript 5](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![Vite 5](https://img.shields.io/badge/Vite-5.1-purple)](https://vitejs.dev/)
[![Offline First](https://img.shields.io/badge/Storage-100%25%20Offline-orange)](#-privacy--local-first)

---

### 💡 Why I built this

Like many people who love learning on the internet, I constantly find myself with 20+ tabs open — deep-dive YouTube tutorials, long Substack essays, GitHub repositories, and tech documentation. 

More often than not, something interrupts the session: a tab gets closed, I have to step away, or I just lose track of where I was. Traditional bookmarks always ended up becoming an endless "read later" graveyard, and browser history was just too cluttered to find specific spots.

I built **ContinueLater** as a fun personal project to learn something new and solve my own daily habit problem. Instead of saving links manually, it quietly remembers where you were in an article or video so you can jump right back into the flow when you're ready.

---

### ✨ What it does

- 🎯 **Picks up where you left off**: Automatically senses scroll progress, video timestamps, or PDF pages when you navigate away or close a learning tab.
- 🌐 **Platform-aware parsers**: Includes custom extractors for sites I regularly use to learn — YouTube, GitHub, Substack, Medium, Dev.to, Hashnode, Wikipedia, Google Docs, and PDFs (with a generic fallback for other blogs).
- ⏰ **Gentle reminders**: Set quick nudges (*"Tomorrow"*, *"After Lunch"*, *"This Evening"*) with native Chrome notifications so good intentions don't get forgotten.
- 📅 **Zero-backend calendar & email links**: Quick one-click export to Google Calendar or email using URL schemes (`calendar.google.com` and `mailto:`), with no external server or API tokens needed.
- 🔥 **Playful stats & streaks**: A fun insights tab with streaks, XP, and badges to keep learning motivating.
- ⚡ **Instant search (`Ctrl+Shift+L` / `Cmd+Shift+L`)**: A fast popup dashboard to search and filter through saved learning sessions anytime.

---

### 🧠 What I learned building this

This project was a great hands-on way to explore several technologies and patterns:

1. **Manifest V3 & Chrome Extension Lifecycle**: Navigating the transition to background service workers, event-driven alarms (`chrome.alarms`), and content scripts.
2. **DOM Progress Tracking**: Experimenting with `MutationObserver`, video playback events, and scroll thresholds across diverse web page structures.
3. **Local-First & Offline Architecture**: Managing extension state and CRUD operations solely using `chrome.storage.local` — keeping it private, fast, and free of backend costs.
4. **Modern Extension Tooling**: Setting up Vite with `@crxjs/vite-plugin`, React, TypeScript, and Vitest for a smooth development and testing workflow.

---

### 🔒 Privacy & Local-First

- **100% Offline**: All sessions, settings, and stats live directly in your browser's `chrome.storage.local`.
- **No Trackers, No Servers**: No analytics, external telemetry, database accounts, or paid API keys.

---

### 🛠️ Trying it out locally

If you'd like to test it out or tinker with the code:

#### Prerequisites
- Node.js 18+
- `pnpm` or `npm`

#### 1. Setup & Build
```bash
# Clone the repository
git clone https://github.com/your-username/ContinueLater.git
cd ContinueLater

# Install dependencies
pnpm install

# Build the extension
pnpm run build
```

#### 2. Load into Chrome
1. Open Google Chrome and go to `chrome://extensions/`.
2. Turn on **Developer mode** (top-right corner).
3. Click **Load unpacked**.
4. Select the `dist/` directory generated in this repository.
5. Pin **ContinueLater** to your extensions toolbar!

#### 3. Load into Firefox
1. Open Firefox and go to `about:debugging#/runtime/this-firefox`.
2. Click **Load Temporary Add-on...**.
3. Select the `dist/manifest.json` file.
4. The add-on is now loaded and available in your Firefox toolbar!

---

### 💻 Useful Commands

```bash
# Start Vite dev server with hot reload
pnpm run dev

# Run Vitest test suite
pnpm test

# Type check & build for Chrome & Firefox
pnpm run build

# Validate Firefox Add-on with Mozilla addons-linter
pnpm run lint:addon

# Bundle into a distributable zip
pnpm run package
```

---

### 📂 Project Structure

```
src/
├── background/                    # Service worker, alarms & notifications
│   ├── service-worker.ts
│   ├── tab-tracker.ts
│   ├── alarm-manager.ts
│   └── notification-manager.ts
├── content/                       # Content scripts for tracking progress
│   ├── content-script.ts
│   ├── observer.ts
│   └── detector.ts
├── parsers/                       # Platform-specific metadata extractors
│   ├── youtube.ts
│   ├── github.ts
│   ├── substack.ts
│   ├── medium.ts
│   ├── devto.ts
│   ├── wikipedia.ts
│   ├── pdf.ts
│   └── generic.ts
├── storage/                       # Chrome local storage handlers
│   ├── learning-store.ts
│   ├── settings-store.ts
│   └── stats-store.ts
├── popup/                         # React UI dashboard
│   ├── pages/                     # Dashboard, Timeline, Insights, Settings
│   └── App.tsx
└── components/                    # Reusable UI elements (cards, rings, modals)
```

---

### 🔮 Ideas to explore next

Some fun experiments I'd like to try next as I keep learning:
- Experimenting with local, on-device AI (Chrome built-in AI / Prompt API) for automatic session recaps.
- Grouping related research tabs into focused study playlists.
- Smarter topic tagging based on page content.

---

### 📄 License

MIT. Built for learning and shared for fun!
