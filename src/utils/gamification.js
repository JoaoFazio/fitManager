export const LEAGUES = [
  { name: 'Bronze', min: 0, max: 500, icon: '🥉', color: 'text-orange-700', barColor: 'bg-orange-600' },
  { name: 'Prata', min: 500, max: 1000, icon: '🥈', color: 'text-slate-400', barColor: 'bg-slate-400' },
  { name: 'Ouro', min: 1000, max: 2000, icon: '🥇', color: 'text-yellow-500', barColor: 'bg-yellow-500' },
  { name: 'Platina', min: 2000, max: 3500, icon: '💠', color: 'text-cyan-500', barColor: 'bg-cyan-500' },
  { name: 'Diamante', min: 3500, max: Infinity, icon: '💎', color: 'text-blue-600', barColor: 'bg-blue-600' }
];

export const getLeagueInfo = (points) => {
  const currentLeagueIndex = LEAGUES.findIndex(l => points >= l.min && points < l.max);
  const currentLeague = LEAGUES[currentLeagueIndex !== -1 ? currentLeagueIndex : LEAGUES.length - 1];
  const nextLeague = LEAGUES[currentLeagueIndex + 1];

  if (!nextLeague) {
    return {
      current: currentLeague,
      next: null,
      progress: 100,
      remaining: 0
    };
  }

  const range = nextLeague.min - currentLeague.min;
  const progressInLeague = points - currentLeague.min;
  const progressPercentage = Math.min(100, Math.max(0, (progressInLeague / range) * 100));

  return {
    current: currentLeague,
    next: nextLeague,
    progress: progressPercentage,
    remaining: nextLeague.min - points
  };
};

export const calculateNewStreak = (lastWorkoutDate, currentStreak = 0) => {
  if (!lastWorkoutDate) return 1; // First workout ever

  const now = new Date();
  const last = new Date(lastWorkoutDate);
  
  // Reset hours to compare dates only
  now.setHours(0, 0, 0, 0);
  last.setHours(0, 0, 0, 0);

  const diffTime = Math.abs(now - last);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // 1. Same day: Streak doesn't change
  if (diffDays === 0) return currentStreak;

  // 2. Consecutive day: Streak + 1
  if (diffDays === 1) return currentStreak + 1;

  // 3. 48h Tolerance (Skipped 1 day): Streak + 1
  if (diffDays === 2) return currentStreak + 1;

  // 4. Weekend Protection
  // If last workout was Friday (5) or Saturday (6) and today is Monday (1)
  const lastDay = last.getDay();
  const todayDay = now.getDay();
  
  // Friday -> Monday (3 days gap)
  if (lastDay === 5 && todayDay === 1 && diffDays <= 3) return currentStreak + 1;
  
  // Saturday -> Monday (2 days gap)
  if (lastDay === 6 && todayDay === 1 && diffDays <= 2) return currentStreak + 1;

  // 5. Broken Streak: Reset to 1
  return 1;
};

export const calculateXP = (streak) => {
  const baseXP = 100;
  // Bonus: +10 XP per streak day, capped at 50 XP
  const streakBonus = Math.min(50, (streak - 1) * 10);
  
  return {
    total: baseXP + streakBonus,
    base: baseXP,
    bonus: streakBonus
  };
};

export const INACTIVITY_WARNING_DAYS = 4;
export const INACTIVITY_PENALTY_DAYS = 7;
export const PENALTY_XP = 100;

export const getInactivityStatus = (lastWorkoutDate) => {
  if (!lastWorkoutDate) return { daysInactive: 0, isDanger: false, shouldPenalize: false };

  const now = new Date();
  const last = new Date(lastWorkoutDate);
  
  // Reset hours
  now.setHours(0, 0, 0, 0);
  last.setHours(0, 0, 0, 0);

  const diffTime = Math.abs(now - last);
  const daysInactive = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return {
    daysInactive,
    isDanger: daysInactive >= INACTIVITY_WARNING_DAYS,
    shouldPenalize: daysInactive >= INACTIVITY_PENALTY_DAYS
  };
};
