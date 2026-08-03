import { LearningStore } from './learning-store';

export async function migrateStorageIfNeeded(): Promise<void> {
  const items = await LearningStore.getAll();
  let modified = false;

  for (const item of items) {
    if (!item.status) {
      item.status = 'unfinished';
      modified = true;
    }
    if (!item.firstSeen) {
      item.firstSeen = Date.now();
      modified = true;
    }
    if (!item.tags) {
      item.tags = [];
      modified = true;
    }
  }

  if (modified) {
    for (const item of items) {
      await LearningStore.save(item);
    }
  }
}
