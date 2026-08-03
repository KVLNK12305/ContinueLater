import { UserStats, INITIAL_STATS } from '../types/stats';
import { ALL_BADGES } from '../utils/badges.ts';

const STATS_KEY = 'continue_later_stats';

export class StatsStore {
  static async get(): Promise<UserStats> {
    if (typeof chrome !== 'undefined' && chrome.storage?.local) {
      return new Promise((resolve) => {
        chrome.storage.local.get([STATS_KEY], (res) => {
          resolve(res[STATS_KEY] ? { ...INITIAL_STATS, ...res[STATS_KEY] } : INITIAL_STATS);
        });
      });
    }
    const raw = localStorage.getItem(STATS_KEY);
    return raw ? { ...INITIAL_STATS, ...JSON.parse(raw) } : INITIAL_STATS;
  }

  static async save(stats: UserStats): Promise<UserStats> {
    if (typeof chrome !== 'undefined' && chrome.storage?.local) {
      await new Promise<void>((resolve) => {
        chrome.storage.local.set({ [STATS_KEY]: stats }, () => resolve());
      });
    } else {
      localStorage.setItem(STATS_KEY, JSON.stringify(stats));
    }
    return stats;
  }

  static async recordActivity(action: 'start' | 'finish' | 'abandon' | 'recover', minutesSpent = 0, topic = ''): Promise<UserStats> {
    const stats = await this.get();
    const today = new Date().toISOString().split('T')[0];

    // Streak logic
    if (stats.lastActiveDate !== today) {
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      if (stats.lastActiveDate === yesterday) {
        stats.currentStreak += 1;
      } else if (stats.lastActiveDate !== today) {
        stats.currentStreak = 1;
      }
      stats.lastActiveDate = today;
      if (stats.currentStreak > stats.longestStreak) {
        stats.longestStreak = stats.currentStreak;
      }
    }

    if (action === 'start') stats.sessionsStarted += 1;
    if (action === 'finish') {
      stats.sessionsFinished += 1;
      stats.xp += 50;
    }
    if (action === 'abandon') stats.sessionsAbandoned += 1;
    if (action === 'recover') {
      stats.sessionsRecovered += 1;
      stats.xp += 75; // Extra XP for recovering unfinished learning!
    }

    stats.totalLearningMinutes += minutesSpent;
    stats.xp += Math.round(minutesSpent * 2);

    // Calculate level (100 XP per level)
    stats.level = Math.floor(stats.xp / 200) + 1;

    // Topics frequency
    if (topic) {
      const existing = stats.topTopics.find((t) => t.topic.toLowerCase() === topic.toLowerCase());
      if (existing) {
        existing.count += 1;
      } else {
        stats.topTopics.push({ topic, count: 1 });
      }
      stats.topTopics.sort((a, b) => b.count - a.count);
    }

    // Check Badge Unlocks
    const newBadges: string[] = [];
    for (const badge of ALL_BADGES) {
      if (!stats.unlockedBadges.includes(badge.id)) {
        if (
          (badge.category === 'articles' && stats.sessionsFinished >= badge.targetCount) ||
          (badge.category === 'podcasts' && stats.sessionsFinished >= badge.targetCount) ||
          (badge.category === 'github' && stats.sessionsFinished >= badge.targetCount) ||
          (badge.category === 'streak' && stats.currentStreak >= badge.targetCount) ||
          (badge.category === 'recovery' && stats.sessionsRecovered >= badge.targetCount)
        ) {
          stats.unlockedBadges.push(badge.id);
          newBadges.push(badge.name);
        }
      }
    }

    await this.save(stats);
    return stats;
  }
}
