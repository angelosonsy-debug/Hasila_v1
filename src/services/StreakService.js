/**
 * StreakService
 * -----------------------------------------------------------------------
 * Single source of truth for the daily streak, including "freezes" (a
 * small bank of missed-day forgiveness) and milestone detection.
 *
 * Why freezes matter: an all-or-nothing streak (miss one day, back to 0)
 * is a strong reason people abandon a habit entirely after the first
 * slip - the whole point of the "reward" principle in Atomic Habits is
 * that the system should feel forgiving enough to come back to, not
 * punishing enough to quit. A small forgiving buffer keeps the streak
 * (and the reason to open the app) alive through a genuinely busy day -
 * relevant here given Angelos's irregular military-service schedule.
 */
export const FREEZE_CAP = 2;
export const MILESTONES = [7, 30, 100, 365];

export function initialStreak() {
  return { count: 0, last: null, freezesAvailable: FREEZE_CAP };
}

/**
 * Pure math behind the Phase 4 "mountain path" visual (Dashboard): where
 * the hiker marker sits on a trail whose four checkpoints are the real
 * streak milestones above. Nothing fictional here - count and the exact
 * same MILESTONES array used for freeze-earning/celebrations decide
 * everything; the component just draws it.
 *
 * The checkpoints are NOT evenly spaced by day-count (365 days would
 * dwarf the first three on a linear scale) - each leg of the trail
 * represents "the stretch between two milestones" as one equal visual
 * segment, same idea as a game's level-select map.
 */
export function mountainProgress(streakCount) {
  const count = Math.max(0, streakCount || 0);
  const checkpoints = [0, ...MILESTONES];
  let idx = 0;
  while (idx < checkpoints.length - 1 && count >= checkpoints[idx + 1]) idx++;
  const atSummit = count >= MILESTONES[MILESTONES.length - 1];
  const from = checkpoints[idx];
  const to = checkpoints[idx + 1] ?? checkpoints[idx];
  const span = to - from;
  const progress = atSummit ? 1 : span > 0 ? Math.min(1, (count - from) / span) : 1;
  return {
    passedCount: Math.min(idx, MILESTONES.length), // how many checkpoints fully cleared (0..4)
    nextMilestone: atSummit ? null : MILESTONES[idx],
    daysToNext: atSummit ? 0 : Math.max(0, MILESTONES[idx] - count),
    progress, // 0..1 fraction of the current leg walked
    atSummit,
  };
}

/** Fills in freezesAvailable for streak objects saved before this feature
 * existed, without touching count/last. */
export function normalizeStreak(streak) {
  return { count: streak?.count || 0, last: streak?.last || null, freezesAvailable: streak?.freezesAvailable ?? FREEZE_CAP };
}

/**
 * Call once per day the person reviews anything (word or situation) -
 * reviewing a single item is enough to count the day, matching the
 * "two-minute rule": the barrier to keeping the streak alive should be
 * as low as physically possible.
 *
 * Returns the updated streak plus two flags the UI can react to:
 * - freezeUsed: a missed day was silently covered by a freeze
 * - milestoneHit: the exact day-count just reached (7/30/100/365) or null
 */
export function applyDailyStreakUpdate(streak, todayStr) {
  const s = normalizeStreak(streak);
  if (s.last === todayStr) {
    return { streak: s, freezeUsed: false, milestoneHit: null }; // already counted today
  }

  let newCount;
  let freezeUsed = false;
  let freezesAvailable = s.freezesAvailable;

  if (!s.last) {
    newCount = 1; // very first review ever
  } else {
    const daysSince = Math.round((new Date(todayStr) - new Date(s.last)) / 86400000);
    const missedDays = daysSince - 1; // days with no review in between
    if (missedDays <= 0) {
      newCount = s.count + 1; // reviewed yesterday, streak continues normally
    } else if (freezesAvailable >= missedDays) {
      freezesAvailable -= missedDays;
      newCount = s.count + 1;
      freezeUsed = true;
    } else {
      newCount = 1; // gap too large to cover, streak restarts
    }
  }

  let milestoneHit = null;
  if (MILESTONES.includes(newCount)) {
    milestoneHit = newCount;
    if (freezesAvailable < FREEZE_CAP) freezesAvailable += 1; // earn a freeze back as a milestone reward
  }

  return { streak: { count: newCount, last: todayStr, freezesAvailable }, freezeUsed, milestoneHit };
}
