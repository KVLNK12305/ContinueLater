import { TabTracker } from './tab-tracker';
import { NotificationManager } from './notification-manager';
import { LearningStore } from '../storage/learning-store';
import { SettingsStore } from '../storage/settings-store';
import { migrateStorageIfNeeded } from '../storage/migration';
import { generateId } from '../utils/id';
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

// Handle Context Menu click
chrome.contextMenus?.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'save-continue-later' && tab?.url) {
    const parser = getParserForUrl(tab.url);
    const mockData = parser.parse(document as any, tab.url, { scrollPercent: 10 });
    
    LearningStore.save({
      id: generateId(),
      type: mockData.type,
      title: tab.title || mockData.title,
      subtitle: mockData.subtitle,
      url: tab.url,
      thumbnail: mockData.thumbnail,
      resumePoint: { scrollPercent: 10 },
      completionPercent: 10,
      estimatedRemainingMinutes: mockData.estimatedRemainingMinutes,
      firstSeen: Date.now(),
      lastSeen: Date.now(),
      source: mockData.source,
      tags: mockData.tags,
      favicon: tab.favIconUrl || mockData.favicon,
      readingProgress: 10,
      watchProgress: 0,
      status: 'unfinished',
      metadata: mockData.metadata,
      schemaVersion: 2
    });
  }
});

// Handle Keyboard Shortcuts (Ctrl+Shift+L)
chrome.commands?.onCommand.addListener((command) => {
  if (command === 'open-dashboard') {
    chrome.action.openPopup();
  }
});
