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

  // Send initial parse snapshot after DOM loads
  setTimeout(() => sendProgressToBackground(false), 1000);

  // Periodic autosave from observer (every 20s of active engagement)
  observer.onAutosave(() => {
    sendProgressToBackground(false);
  });

  // Final update on page unload / navigate away
  const handleUnload = () => {
    sendProgressToBackground(true);
    observer.stop();
  };

  window.addEventListener('beforeunload', handleUnload);
  window.addEventListener('pagehide', handleUnload);
})();
