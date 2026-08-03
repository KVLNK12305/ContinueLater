import { getParserForUrl } from '../parsers/registry';
import { PageObserver } from './observer';
import { generateId } from '../utils/id';

(function initContentScript() {
  const currentUrl = window.location.href;
  const parser = getParserForUrl(currentUrl);

  // Generate or retrieve session ID for this tab session
  const sessionId = generateId();
  const startTime = Date.now();

  const observer = new PageObserver();
  observer.start();

  function sendProgressToBackground(isFinal = false) {
    try {
      const state = observer.getState();
      const extracted = parser.parse(document, currentUrl, {
        scrollPercent: state.scrollPercent,
        currentTime: state.currentTime,
        duration: state.duration,
        pageNumber: state.pageNumber,
        totalPages: state.totalPages,
        timeSpent: Math.round((Date.now() - startTime) / 1000)
      });

      if (typeof chrome !== 'undefined' && chrome.runtime?.sendMessage) {
        chrome.runtime.sendMessage({
          type: 'LEARNING_PROGRESS_UPDATE',
          sessionId,
          isFinal,
          data: extracted,
          isIdle: state.isIdle
        }).catch(() => {
          // Extension context reloaded or closed
        });
      }
    } catch (e) {
      // Ignore background communication errors on teardown
    }
  }

  // Throttle updates: send every 3 seconds
  let updateInterval: any = setInterval(() => {
    sendProgressToBackground(false);
  }, 3000);

  // Send initial parse snapshot after DOM loads
  setTimeout(() => sendProgressToBackground(false), 1000);

  // Final update on page unload / navigate away
  const handleUnload = () => {
    if (updateInterval) clearInterval(updateInterval);
    sendProgressToBackground(true);
    observer.stop();
  };

  window.addEventListener('beforeunload', handleUnload);
  window.addEventListener('pagehide', handleUnload);
})();
