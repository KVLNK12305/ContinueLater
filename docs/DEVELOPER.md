# ContinueLater — Developer Guide & Extension Packaging

## 1. Development Setup

```bash
# 1. Clone repository
git clone https://github.com/user/continue-later.git
cd continue-later

# 2. Install dependencies
pnpm install

# 3. Start development build with watch mode
pnpm run dev

# 4. Load unpacked in Chrome
# Open chrome://extensions -> Enable Developer Mode -> Load unpacked -> select 'dist'
```

---

## 2. Testing Framework

Unit tests are written using **Vitest** with **JSDOM**:

```bash
# Run test suite once
npx vitest run

# Run tests in watch mode
npx vitest
```

---

## 3. Chrome Web Store Packaging Guide

1. Ensure TypeScript compilation and production bundle build cleanly:
   ```bash
   npx tsc && npx vite build
   ```
2. Create distribution ZIP:
   ```bash
   pnpm run package
   ```
3. Upload `continue-later-extension.zip` to [Chrome Developer Dashboard](https://chrome.google.com/webstore/developer/dashboard).

---

## 4. Design Guidelines (Material Design 3 + Notion)

- All color tokens, typography scales, and radii are defined in `src/styles/tokens.css`.
- Always use predefined MD3 CSS variables (`var(--md-sys-color-primary)`, `var(--radius-md)`) rather than hardcoded hex values.
- Dark theme is default with HSL tailored indigo and purple accents. Light mode responds to system preferences or user toggle.
