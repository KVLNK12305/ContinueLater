import { TabTracker } from './tab-tracker';
import { NotificationManager } from './notification-manager';
import { LearningStore } from '../storage/learning-store';
import { SettingsStore } from '../storage/settings-store';
import { migrateStorageIfNeeded } from '../storage/migration';
import { generateId } from '../utils/id';
import { safeUrlId } from '../utils/resume';
import { getParserForUrl } from '../parsers/registry';

const tracker = new TabTracker();

async function refreshDynamicScripts() {
  const settings = await SettingsStore.get();
  if (settings.captureOnAnySite) {
    const manifest = chrome.runtime.getManifest();
    const jsFile = manifest.content_scripts?.[0]?.js?.[0];
    if (jsFile) {
      try {
        await chrome.scripting.unregisterContentScripts({ ids: ['generic-capture'] }).catch(() => {});
        await chrome.scripting.registerContentScripts([{
          id: 'generic-capture',
          js: [jsFile],
          matches: ['http://*/*', 'https://*/*'],
          runAt: 'document_idle'
        }]);
        console.log('[SW] Dynamic content script registered.');
      } catch (err) {
        console.error('[SW] Failed to register dynamic content script:', err);
      }
    }
  } else {
    try {
      await chrome.scripting.unregisterContentScripts({ ids: ['generic-capture'] }).catch(() => {});
      console.log('[SW] Dynamic content script unregistered.');
    } catch (err) {
      console.error('[SW] Failed to unregister dynamic content script:', err);
    }
  }
}

async function runStartupJobs() {
  await migrateStorageIfNeeded();
  const settings = await SettingsStore.get();
  if (settings.enableAutoArchive !== false && settings.autoArchiveDays > 0) {
    await LearningStore.archiveOldCompletedItems(settings.autoArchiveDays);
    console.log(`[SW] Auto-archived old completed items.`);
  }
  await refreshDynamicScripts();
}

// Startup jobs
chrome.runtime.onInstalled.addListener(() => {
  runStartupJobs();

  // Create context menu
  if (chrome.contextMenus) {
    chrome.contextMenus.create({
      id: 'save-continue-later',
      title: 'Save to ContinueLater',
      contexts: ['page', 'link', 'selection']
    });
  }
});

// Run startup jobs when service worker starts
runStartupJobs();

// Handle content script messages & dynamic scripts settings refresh
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'LEARNING_PROGRESS_UPDATE') {
    const tabId = sender.tab?.id || 0;
    tracker.handleProgressUpdate(tabId, message, message.isFinal);
    sendResponse({ status: 'ok' });
  } else if (message.type === 'REFRESH_DYNAMIC_SCRIPTS') {
    refreshDynamicScripts().then(() => sendResponse({ status: 'ok' }));
    return true; // Keep channel open for async response
  } else if (message.type === 'GET_SESSION_RESUME_INFO') {
    LearningStore.getByUrl(message.url).then((item) => {
      sendResponse({ item: item && item.status !== 'completed' ? item : null });
    });
    return true;
  } else if (message.type === 'CAPTURE_CURRENT_TAB') {
    chrome.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
      const activeTab = tabs[0];
      if (activeTab) {
        saveTabSafely(activeTab).then(() => {
          sendResponse({ status: 'ok', tab: activeTab });
        });
      } else {
        sendResponse({ status: 'error', message: 'No active tab found' });
      }
    });
    return true;
  }
  return true;
});

// Handle Tab close
chrome.tabs.onRemoved.addListener((tabId) => {
  tracker.handleTabRemoved(tabId);
});

// Handle Alarms (smart reminders)
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name.startsWith('reminder_')) {
    const itemId = alarm.name.replace('reminder_', '');
    LearningStore.getById(itemId).then((item) => {
      if (item && item.status !== 'completed') {
        NotificationManager.showUnfinishedNotification(item);
      }
    });
  }
});

// Handle Notification buttons
chrome.notifications.onButtonClicked.addListener((notificationId, buttonIndex) => {
  NotificationManager.handleNotificationButtonClicked(notificationId, buttonIndex);
});

chrome.notifications.onClicked.addListener((notificationId) => {
  NotificationManager.handleNotificationClicked(notificationId);
});

async function saveTabSafely(tab: chrome.tabs.Tab) {
  if (!tab.id || !tab.url) return;

  try {
    const response = await chrome.tabs.sendMessage(tab.id, { type: 'MANUAL_CAPTURE_REQUEST' }).catch(() => null);
    if (response?.status === 'ok') return;
  } catch {
    // Content script not ready or unavailable
  }

  try {
    const parser = getParserForUrl(tab.url);
    const hostname = new URL(tab.url).hostname.replace('www.', '');
    const title = tab.title || 'Learning Webpage';

    await LearningStore.save({
      id: safeUrlId(tab.url),
      type: parser.name === 'youtube' ? 'watching' : 'reading',
      title,
      subtitle: hostname,
      url: tab.url,
      thumbnail: '',
      resumePoint: { scrollPercent: 0 },
      completionPercent: 0,
      estimatedRemainingMinutes: 10,
      firstSeen: Date.now(),
      lastSeen: Date.now(),
      source: parser.name,
      tags: [hostname, 'Learning'].filter(Boolean),
      favicon: tab.favIconUrl || `https://www.google.com/s2/favicons?domain=${hostname}&sz=32`,
      readingProgress: 0,
      watchProgress: 0,
      status: 'unfinished',
      metadata: { headline: title },
      schemaVersion: 2
    });
  } catch (err) {
    console.error('[SW] Failed to save tab safely:', err);
  }
}

// Handle Context Menu click
chrome.contextMenus?.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'save-continue-later' && tab) {
    saveTabSafely(tab);
  }
});

// Handle Keyboard Shortcuts (Ctrl+Shift+L)
chrome.commands?.onCommand.addListener((command) => {
  if (command === 'open-dashboard') {
    try {
      chrome.action.openPopup().catch(() => {});
    } catch {
      // openPopup requires Chrome 99+ or user interaction
    }
  }
});
