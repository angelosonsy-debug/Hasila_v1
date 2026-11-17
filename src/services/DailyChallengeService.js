/**
 * DailyChallengeService
 * -----------------------------------------------------------------------
 * One small, genuinely-achievable challenge per calendar day (Phase 4).
 * Picked deterministically from a fixed pool by hashing today's date
 * string - same challenge for everyone on a given day, stable across
 * reloads/re-renders, with no extra "which challenge did we assign
 * today" field to store or go stale.
 *
 * Every check reads data the app already tracks for other reasons
 * (reviewHistory, the daily-lock session-completion dates, leech
 * detection) - nothing new is invented, estimated, or silently tracked
 * just to power this. See buildChallengeContext.
 *
 * The reward for finishing it (wired in App.jsx) is deliberately
 * distinct from RewardService's per-session variable reward - bigger,
 * guaranteed once completed, and framed as a separate daily event - not
 * a reskin of the same mechanic.
 */
import { hashToUnit } from "./SchedulerService.js";
import { findLeeches } from "./StatisticsService.js";

const todayStr = () => new Date().toISOString().slice(0, 10);

const CHALLENGES = [
  {
    id: "ten_words", icon: "📚", label: "راجع 10 كلمات النهاردة",
    check: (ctx) => ctx.todayReviews >= 10,
    progress: (ctx) => Math.min(1, ctx.todayReviews / 10),
  },
  {
    id: "both_kinds", icon: "🔀", label: "راجع كلمات ومواقف في نفس اليوم",
    check: (ctx) => ctx.wordsDoneToday && ctx.situationsDoneToday,
    progress: (ctx) => ((ctx.wordsDoneToday ? 1 : 0) + (ctx.situationsDoneToday ? 1 : 0)) / 2,
  },
  {
    id: "clean_five", icon: "✅", label: "راجع 5 كلمات صح من غير أي غلط النهاردة",
    check: (ctx) => ctx.todayReviews >= 5 && ctx.todayWrong === 0,
    progress: (ctx) => (ctx.todayWrong > 0 ? 0 : Math.min(1, ctx.todayReviews / 5)),
  },
  {
    id: "leech_fix", icon: "🦠", label: "ذاكر كلمة واحدة من كلماتك العالقة النهاردة",
    check: (ctx) => ctx.leechReviewedToday,
    progress: (ctx) => (ctx.leechReviewedToday ? 1 : 0),
  },
];

/** Deterministic pick (same for everyone on a given date, changes daily).
 * Drops "leech_fix" from the pool when there are no leeches at all right
 * now - a challenge nobody could possibly progress on isn't a fair one. */
export function pickDailyChallenge(dateStr = todayStr(), hasLeeches = true) {
  const pool = hasLeeches ? CHALLENGES : CHALLENGES.filter((c) => c.id !== "leech_fix");
  const idx = Math.floor(hashToUnit(dateStr) * pool.length) % pool.length;
  return pool[idx];
}

/** Pulls together exactly the bits of real, already-tracked app state a
 * challenge check needs. */
export function buildChallengeContext(data) {
  const today = todayStr();
  let todayReviews = 0, todayWrong = 0;
  (data.words || []).forEach((w) => {
    (w.reviewHistory || []).forEach((r) => {
      if ((r.date || "").slice(0, 10) !== today) return;
      todayReviews += 1;
      if (r.quality === 0) todayWrong += 1;
    });
  });
  const leechIds = new Set(findLeeches(data.words || []).map((w) => w.id));
  const leechReviewedToday = (data.words || []).some((w) => leechIds.has(w.id) &&
    (w.reviewHistory || []).some((r) => (r.date || "").slice(0, 10) === today));
  return {
    todayReviews, todayWrong,
    wordsDoneToday: data.wordsSessionUsedDate === today,
    situationsDoneToday: data.situationsSessionUsedDate === today,
    leechReviewedToday,
  };
}

/** Today's challenge plus its live done/progress state against `data`. */
export function evaluateDailyChallenge(data) {
  const hasLeeches = findLeeches(data.words || []).length > 0;
  const challenge = pickDailyChallenge(todayStr(), hasLeeches);
  const ctx = buildChallengeContext(data);
  return { ...challenge, done: challenge.check(ctx), progress: challenge.progress(ctx) };
}
