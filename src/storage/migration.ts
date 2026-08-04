import { LearningStore } from './learning-store';

const SCHEMA_VERSION_KEY = 'continue_later_schema_version';

// v1 migration: Ensure item structure defaults
async function migrateToV1(): Promise<void> {
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
    if (item.schemaVersion === undefined) {
      item.schemaVersion = 1;
      modified = true;
    }
  }

  if (modified) {
    for (const item of items) {
      await LearningStore.save(item);
    }
  }
}

// v2 migration: Placeholder or future settings upgrades
async function migrateToV2(): Promise<void> {
  // Can perform settings validation or items cleanup if necessary
}

const migrations: Array<{ version: number; run: () => Promise<void> }> = [
  { version: 1, run: migrateToV1 },
  { version: 2, run: migrateToV2 }
];

export async function migrateStorageIfNeeded(): Promise<void> {
  let currentVersion = 0;

  if (typeof chrome !== 'undefined' && chrome.storage?.local) {
    currentVersion = await new Promise<number>((resolve) => {
      chrome.storage.local.get([SCHEMA_VERSION_KEY], (res) => {
        resolve(res[SCHEMA_VERSION_KEY] !== undefined ? res[SCHEMA_VERSION_KEY] : 0);
      });
    });
  } else {
    const raw = localStorage.getItem(SCHEMA_VERSION_KEY);
    currentVersion = raw ? parseInt(raw, 10) : 0;
  }

  const pendingMigrations = migrations.filter(m => m.version > currentVersion);

  for (const migration of pendingMigrations) {
    console.log(`[Migration] Applying migration to v${migration.version}...`);
    await migration.run();
    currentVersion = migration.version;

    if (typeof chrome !== 'undefined' && chrome.storage?.local) {
      await new Promise<void>((resolve) => {
        chrome.storage.local.set({ [SCHEMA_VERSION_KEY]: currentVersion }, () => resolve());
      });
    } else {
      localStorage.setItem(SCHEMA_VERSION_KEY, currentVersion.toString());
    }
  }
}
