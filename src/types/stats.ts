export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: number | null;
  category: 'articles' | 'podcasts' | 'github' | 'streak' | 'recovery';
  targetCount: number;
}

export interface UserStats {
  sessionsStarted: number;
  sessionsFinished: number;
  sessionsAbandoned: number;
  sessionsRecovered: number;
  totalLearningMinutes: number;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string; // YYYY-MM-DD
  xp: number;
  level: number;
  topTopics: { topic: string; count: number }[];
  unlockedBadges: string[]; // Badge IDs
}

export const INITIAL_STATS: UserStats = {
  sessionsStarted: 0,
  sessionsFinished: 0,
  sessionsAbandoned: 0,
  sessionsRecovered: 0,
  totalLearningMinutes: 0,
  currentStreak: 0,
  longestStreak: 0,
  lastActiveDate: '',
  xp: 0,
  level: 1,
  topTopics: [],
  unlockedBadges: []
};
