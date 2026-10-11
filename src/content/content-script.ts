import { getParserForUrl } from '../parsers/registry';
import { PageObserver } from './observer';
import { generateId } from '../utils/id';

(function initContinueLaterContentScript() {
  let currentUrl = window.location.href;
  let parser = getParserForUrl(currentUrl);
  let sessionId = generateId();
  let startTime = Date.now();
  let observer = new PageObserver();

  // Floating Continuity HUD Pill
  function showContinuityPill(percent: number, isPrompt = false, onConfirm?: () => void) {
    const existing = document.getElementById('continue-later-hud-pill');
    if (existing) existing.remove();

    const pill = document.createElement('div');
    pill.id = 'continue-later-hud-pill';
    pill.style.cssText = `
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 2147483647;
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 16px;
      background: #1e2128;
      color: #eef0f4;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif;
      font-size: 12px;
      font-weight: 600;
      border-radius: 9999px;
      border: 1px solid rgba(162, 155, 254, 0.4);
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 0 12px rgba(108, 92, 231, 0.25);
      cursor: default;
      user-select: none;
      opacity: 0;
      transform: translateY(10px);
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    `;

    const iconSpan = document.createElement('span');
    iconSpan.textContent = '📍';
    iconSpan.style.fontSize = '14px';

    const textSpan = document.createElement('span');
    textSpan.textContent = isPrompt ? `Resume from ${percent}%?` : `Resumed at ${percent}%`;

    pill.appendChild(iconSpan);
    pill.appendChild(textSpan);

    if (isPrompt && onConfirm) {
      const resumeBtn = document.createElement('button');
      resumeBtn.textContent = 'Resume';
      resumeBtn.style.cssText = `
        background: #6c5ce7;
        color: #ffffff;
        border: none;
        border-radius: 9999px;
        padding: 3px 10px;
        font-size: 11px;
        font-weight: 700;
        cursor: pointer;
        transition: opacity 0.2s;
      `;
      resumeBtn.onmouseenter = () => { resumeBtn.style.opacity = '0.9'; };
      resumeBtn.onmouseleave = () => { resumeBtn.style.opacity = '1'; };
      resumeBtn.onclick = (e) => {
        e.stopPropagation();
        onConfirm();
        pill.remove();
      };
      pill.appendChild(resumeBtn);
    } else {
      const topBtn = document.createElement('button');
      topBtn.textContent = 'Top';
      topBtn.style.cssText = `
        background: rgba(255, 255, 255, 0.1);
        color: #a29bfe;
        border: none;
        border-radius: 9999px;
        padding: 2px 8px;
        font-size: 11px;
        cursor: pointer;
      `;
      topBtn.onclick = (e) => {
        e.stopPropagation();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        pill.remove();
      };
      pill.appendChild(topBtn);
    }

    const closeBtn = document.createElement('button');
    closeBtn.textContent = '✕';
    closeBtn.style.cssText = `
      background: none;
      border: none;
      color: rgba(255, 255, 255, 0.5);
      cursor: pointer;
      font-size: 11px;
      padding: 0 4px;
    `;
    closeBtn.onclick = (e) => {
      e.stopPropagation();
      pill.remove();
    };
    pill.appendChild(closeBtn);

    document.body.appendChild(pill);

    // Trigger animate-in
    requestAnimationFrame(() => {
      pill.style.opacity = '1';
      pill.style.transform = 'translateY(0)';
    });

    // Auto dismiss after 5 seconds if not a prompt
    if (!isPrompt) {
      setTimeout(() => {
        if (pill.parentNode) {
          pill.style.opacity = '0';
          pill.style.transform = 'translateY(10px)';
          setTimeout(() => pill.remove(), 300);
        }
      }, 4500);
    }
  }

  // Smooth scroll restoration helper
  function restoreScrollPosition(percent: number) {
    if (percent <= 0 || percent > 100) return;

    const performScroll = () => {
      const docEl = document.documentElement;
      const body = document.body;
      const scrollHeight = Math.max(docEl.scrollHeight, body.scrollHeight) - window.innerHeight;
      if (scrollHeight > 0) {
        const targetTop = (scrollHeight * percent) / 100;
        window.scrollTo({ top: targetTop, behavior: 'smooth' });
        showContinuityPill(percent);
      }
    };

    // Attempt scroll after initial layout
    setTimeout(performScroll, 350);
    // Secondary attempt if content/images loaded asynchronously
    setTimeout(performScroll, 1200);
  }

  // Check for resume parameters on load
  function checkForResumeTrigger() {
    try {
      // 1. Check URL hash (e.g. #cl-resume=45)
      const hashMatch = window.location.hash.match(/#cl-resume=(\d+)/);
      if (hashMatch) {
        const percent = parseInt(hashMatch[1], 10);
        if (percent > 0) {
          restoreScrollPosition(percent);
          // Clean hash from URL without reloading
          if (history.replaceState) {
            const cleanHash = window.location.hash.replace(/#cl-resume=\d+/, '');
            history.replaceState(null, '', window.location.pathname + window.location.search + cleanHash);
          }
          return;
        }
      }

      // 2. If no hash, query background for existing unfinished session
      if (typeof chrome !== 'undefined' && chrome.runtime?.sendMessage) {
        chrome.runtime.sendMessage({
          type: 'GET_SESSION_RESUME_INFO',
          url: currentUrl
        }, (res) => {
          if (res?.item?.resumePoint?.scrollPercent && res.item.resumePoint.scrollPercent >= 5) {
            const pct = res.item.resumePoint.scrollPercent;
            // Show prompt to user
            showContinuityPill(pct, true, () => {
              restoreScrollPosition(pct);
            });
          }
        });
      }
    } catch {
      // Ignore errors in sandboxed environments
    }
  }

  function sendProgressToBackground(isFinal = false, isManual = false) {
    try {
      const state = observer.getState();
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      const extracted = parser.parse(document, currentUrl, {
        scrollPercent: state.scrollPercent,
        currentTime: state.currentTime,
        duration: state.duration,
        pageNumber: state.pageNumber,
        totalPages: state.totalPages,
        timeSpent
      });

      if (typeof chrome !== 'undefined' && chrome.runtime?.sendMessage) {
        chrome.runtime.sendMessage({
          type: 'LEARNING_PROGRESS_UPDATE',
          sessionId,
          isFinal,
          isManual,
          timeSpent,
          data: extracted,
          isIdle: state.isIdle
        }).catch(() => {
          // Extension context reloaded or closed
        });
      }
      return extracted;
    } catch (e) {
      // Ignore background communication errors on teardown
      return null;
    }
  }

  function startSession() {
    parser = getParserForUrl(currentUrl);
    sessionId = generateId();
    startTime = Date.now();
    observer = new PageObserver();
    observer.start();

    // Send initial snapshot after DOM parses
    setTimeout(() => sendProgressToBackground(false), 1200);

    // Periodic autosave from observer
    observer.onAutosave(() => {
      sendProgressToBackground(false);
    });

    // Check if user came to resume this session
    checkForResumeTrigger();
  }

  function teardownSession(isFinal = true) {
    sendProgressToBackground(isFinal);
    observer.stop();
  }

  // Handle SPA URL change (e.g. YouTube next video, GitHub tab change, Substack)
  function handleUrlChange() {
    if (window.location.href !== currentUrl) {
      teardownSession(true);
      currentUrl = window.location.href;
      startSession();
    }
  }

  // SPA navigation observation
  window.addEventListener('popstate', handleUrlChange);

  try {
    const origPushState = history.pushState;
    history.pushState = function (...args) {
      origPushState.apply(this, args);
      setTimeout(handleUrlChange, 150);
    };

    const origReplaceState = history.replaceState;
    history.replaceState = function (...args) {
      origReplaceState.apply(this, args);
      setTimeout(handleUrlChange, 150);
    };
  } catch {
    // In restricted sandbox environments where history prototype cannot be hooked,
    // setInterval fallback below ensures SPA navigation is still tracked.
  }

  setInterval(handleUrlChange, 2000);

  // Listen to manual capture requests from Popup or Context Menu
  if (typeof chrome !== 'undefined' && chrome.runtime?.onMessage) {
    chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
      if (msg.type === 'MANUAL_CAPTURE_REQUEST') {
        const extracted = sendProgressToBackground(false, true);
        sendResponse({ status: 'ok', data: extracted });
        showContinuityPill(extracted?.completionPercent || 0);
        return true;
      }
    });
  }

  // Final update on page unload / navigate away
  const handleUnload = () => {
    teardownSession(true);
  };

  window.addEventListener('beforeunload', handleUnload);
  window.addEventListener('pagehide', handleUnload);

  // Kick off initial session
  startSession();
})();
