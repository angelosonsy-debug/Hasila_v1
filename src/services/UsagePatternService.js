/**
 * UsagePatternService
 * -----------------------------------------------------------------------
 * Phase 3 "smart reminder timing": instead of a daily reminder stuck at
 * whatever hour the person picked once (default 21:00) and never
 * revisited, this watches the real local hour each finished review
 * session happens at, and - once there's an honest, clear pattern -
 * lets the UI offer to move the reminder to match it.
 *
 * Deliberately suggestion-only: nothing here ever changes
 * settings.reminderHour by itself. Silently rescheduling someone's
 * reminder without asking would be exactly the kind of manipulative
 * pattern this roadmap's own ethics note rules out (see ROADMAP.md).
 * The caller decides what "accept" and "dismiss" do.
 */

const MAX_HISTORY = 20;  // rolling window - recent habits matter more than a stale pattern from months ago
const MIN_SAMPLES = 5;   // don't call it a "pattern" off a handful of coincidences
const MIN_GAP_HOURS = 2; // only worth suggesting if it would actually move the reminder meaningfully

/** Appends the local hour-of-day a session was just finished at, capped
 * to the most recent MAX_HISTORY entries. `now` is injectable for tests. */
export function recordSessionHour(usageHours, now = new Date()) {
  const hours = Array.isArray(usageHours) ? usageHours : [];
  return [...hours, now.getHours()].slice(-MAX_HISTORY);
}

/** The most frequent hour in the history, or null if there isn't enough
 * data yet to honestly call it a pattern. Ties go to the earlier hour,
 * so the result is deterministic rather than flickering between renders. */
export function dominantHour(usageHours) {
  const hours = Array.isArray(usageHours) ? usageHours : [];
  if (hours.length < MIN_SAMPLES) return null;
  const counts = {};
  hours.forEach((h) => { counts[h] = (counts[h] || 0) + 1; });
  let best = null;
  for (const [h, c] of Object.entries(counts)) {
    const hh = Number(h);
    if (!best || c > best.count || (c === best.count && hh < best.hour)) best = { hour: hh, count: c };
  }
  return best.hour;
}

/** Circular distance between two hours on a 24h clock (so 23 and 1 are
 * "2 hours apart", not 22). */
function hourGap(a, b) {
  const d = Math.abs(a - b);
  return Math.min(d, 24 - d);
}

/**
 * Whether to offer moving the reminder right now, and to which hour.
 * Returns null when there's nothing honest to suggest: not enough
 * samples yet, the real pattern is already close to the current
 * reminder hour, or the person already said no to this exact hour
 * before (a fresh pattern pointing at a *different* hour can still
 * prompt again later - this only silences the one they dismissed).
 */
export function suggestReminderHour(usageHours, currentReminderHour, dismissedHour = null) {
  const hour = dominantHour(usageHours);
  if (hour === null) return null;
  if (hour === dismissedHour) return null;
  if (hourGap(hour, currentReminderHour) < MIN_GAP_HOURS) return null;
  return hour;
}
