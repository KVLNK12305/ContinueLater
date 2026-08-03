import { useState, useEffect } from 'react';
import { UserStats, INITIAL_STATS } from '../types/stats';
import { StatsStore } from '../storage/stats-store';

export function useStats() {
  const [stats, setStats] = useState<UserStats>(INITIAL_STATS);
  const [loading, setLoading] = useState(true);

  const refreshStats = async () => {
    const s = await StatsStore.get();
    setStats(s);
    setLoading(false);
  };

  useEffect(() => {
    refreshStats();
  }, []);

  return { stats, loading, refreshStats };
}
