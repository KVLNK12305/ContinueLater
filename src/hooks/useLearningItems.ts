import { useState, useEffect, useCallback } from 'react';
import { LearningObject } from '../types/learning-object';
import { LearningStore } from '../storage/learning-store';
import { StatsStore } from '../storage/stats-store';
import { buildResumeUrl } from '../utils/resume';

export function useLearningItems() {
  const [items, setItems] = useState<LearningObject[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshItems = useCallback(async () => {
    setLoading(true);
    try {
      const data = await LearningStore.getAll();
      setItems(data.filter((item) => item.status !== 'archived'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshItems();

    // Listen to storage changes for live UI updates
    const handleStorageChange = () => refreshItems();
    if (typeof chrome !== 'undefined' && chrome.storage?.onChanged) {
      chrome.storage.onChanged.addListener(handleStorageChange);
      return () => chrome.storage.onChanged.removeListener(handleStorageChange);
    }
  }, [refreshItems]);

  const resumeItem = useCallback(async (item: LearningObject) => {
    const resumeUrl = buildResumeUrl(item);
    if (typeof chrome !== 'undefined' && chrome.tabs) {
      chrome.tabs.create({ url: resumeUrl });
    } else {
      window.open(resumeUrl, '_blank');
    }
    await StatsStore.recordActivity('recover', 0, item.tags?.[0] || '');
    await LearningStore.updateStatus(item.id, 'active');
    await refreshItems();
  }, [refreshItems]);

  const deleteItem = useCallback(async (id: string) => {
    await LearningStore.delete(id);
    await refreshItems();
  }, [refreshItems]);

  const markCompleted = useCallback(async (item: LearningObject) => {
    await LearningStore.updateStatus(item.id, 'completed');
    await StatsStore.recordActivity('finish', item.estimatedRemainingMinutes || 5, item.tags?.[0] || '');
    await refreshItems();
  }, [refreshItems]);

  const captureCurrentTab = useCallback(async (): Promise<boolean> => {
    if (typeof chrome !== 'undefined' && chrome.runtime?.sendMessage) {
      return new Promise((resolve) => {
        chrome.runtime.sendMessage({ type: 'CAPTURE_CURRENT_TAB' }, async (res) => {
          await refreshItems();
          resolve(res?.status === 'ok');
        });
      });
    }
    return false;
  }, [refreshItems]);

  return {
    items,
    loading,
    refreshItems,
    resumeItem,
    deleteItem,
    markCompleted,
    captureCurrentTab
  };
}
