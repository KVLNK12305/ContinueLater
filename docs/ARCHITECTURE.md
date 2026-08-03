# ContinueLater — Architecture & Engineering Specification

## 1. System Architectural Overview

ContinueLater is engineered as an offline-first Manifest V3 Chrome Extension using React 18, TypeScript, and Vite.

```
+-------------------------------------------------------------------+
|                           BROWSER TAB                             |
|  [ Content Script ] ---> PageObserver (Scroll, HTML Video, Idle)  |
+----------------------------------|--------------------------------+
                                   | chrome.runtime.sendMessage
                                   v
+-------------------------------------------------------------------+
|                    BACKGROUND SERVICE WORKER                      |
|  TabTracker  <--->  LearningStore  <--->  chrome.storage.local   |
|     |                     |                                       |
|  AlarmManager    NotificationManager                              |
|  (chrome.alarms) (chrome.notifications)                           |
+-----------------------------------|-------------------------------+
                                    | React State Hooks
                                    v
+-------------------------------------------------------------------+
|                        POPUP DASHBOARD UI                         |
|  React 18 + Material Design 3 + Glassmorphism (420x600px)         |
|  Dashboard | Timeline | Insights | Settings | AI Preview          |
+-------------------------------------------------------------------+
```

---

## 2. Parser System Architecture

Every platform parser implements the standard `LearningSource` interface:

```typescript
export interface LearningSource {
  name: SourceType;
  urlPatterns: RegExp[];
  detect(url: string): boolean;
  parse(document: Document, url: string, extraData?: Record<string, any>): ExtractedLearningData;
  getCompletionThreshold(): number;
}
```

The `Registry` uses dynamic regex lookup to match incoming URLs with 0ms overhead:
`YouTube` -> `Google Search` -> `Substack` -> `Medium` -> `GitHub` -> `Dev.to` -> `Hashnode` -> `Wikipedia` -> `Google Docs` -> `PDF` -> `Generic Fallback`.

---

## 3. Unfinished Detection Pipeline

Session unfinished evaluation triggers on 3 tab lifecycle events:
1. **Unload / Tab Close**: `window.addEventListener('beforeunload')` triggers snapshot.
2. **Idle Inactivity**: `PageObserver` detects 5+ mins of no mouse/keyboard events.
3. **Threshold Check**: If `completionPercent < threshold` (e.g. <90% for YouTube, <95% for articles), item status becomes `'unfinished'`.

---

## 4. Performance Optimizations

- **Throttled DOM Inspection**: `requestAnimationFrame` throttles scroll listener to 60fps.
- **Debounced Chrome Storage**: State updates batch every 3 seconds to avoid Chrome Storage write quotas.
- **Minimal Asset Footprint**: Zero heavy external dependencies. Bundle size is < 200 KB gzip.
