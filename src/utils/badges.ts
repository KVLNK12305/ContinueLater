import { Badge } from '../types/stats';

export const ALL_BADGES: Badge[] = [
  {
    id: 'articles_10',
    name: 'Avid Reader',
    description: 'Finished 10 articles or newsletters',
    icon: 'BookOpen',
    unlockedAt: null,
    category: 'articles',
    targetCount: 10
  },
  {
    id: 'articles_100',
    name: 'Scholar',
    description: 'Finished 100 articles or newsletters',
    icon: 'GraduationCap',
    unlockedAt: null,
    category: 'articles',
    targetCount: 100
  },
  {
    id: 'podcasts_50',
    name: 'Podcast Champion',
    description: 'Completed 50 podcasts or video tutorials',
    icon: 'Headphones',
    unlockedAt: null,
    category: 'podcasts',
    targetCount: 50
  },
  {
    id: 'github_10',
    name: 'Code Explorer',
    description: 'Finished reading 10 GitHub READMEs or code bases',
    icon: 'Code',
    unlockedAt: null,
    category: 'github',
    targetCount: 10
  },
  {
    id: 'streak_7',
    name: 'Consistent Learner',
    description: 'Maintained a 7-day learning streak',
    icon: 'Flame',
    unlockedAt: null,
    category: 'streak',
    targetCount: 7
  },
  {
    id: 'recovery_10',
    name: 'Flow Restorer',
    description: 'Recovered 10 unfinished learning sessions',
    icon: 'Zap',
    unlockedAt: null,
    category: 'recovery',
    targetCount: 10
  }
];
