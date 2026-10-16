/**
 * RewardService — the "variable reward" after a finished review session.
 *
 * Why variable and not fixed: a reward that's the same every time (always
 * +1 freeze, always the same message) stops registering after a few
 * sessions - the brain habituates to a predictable payoff fast. A reward
 * whose *size* varies, shown right after the action that earned it, is
 * what keeps a habit loop interesting (the mechanism behind why slot
 * machines and infinite-scroll feeds are so sticky — used here for a
 * genuinely earned, pro-social payoff instead: finishing a real review
 * session, not an arbitrary action).
 *
 * Three possible outcomes, each session:
 * - "freeze": a bonus streak freeze (only offered if the person isn't
 *   already at the freeze cap — a freeze they can't use isn't a reward)
 * - "sticker": a purely cosmetic congratulations + random emoji
 * - null: no bonus this time — the silence is what makes the sometimes
 *   real reward feel earned rather than guaranteed
 *
 * This never touches grading/scheduling and never gates anything behind
 * payment — it's a dopamine-timing detail on top of a review session the
 * person already finished on their own.
 */
const STICKER_EMOJIS = ["🌟", "🏆", "🎯", "🚀", "💪", "✨", "🦉", "📈"];
const STICKER_LABELS = [
  "أداء ممتاز النهاردة!",
  "استمرارك ده هو اللي بيعمل الفرق!",
  "كل كلمة بتفرق، كمّل كده!",
  "تركيز حلو في الجلسة دي 👏",
];

export function rollSessionReward(freezesAvailable, freezeCap) {
  const roll = Math.random();
  if (roll < 0.22 && (freezesAvailable ?? 0) < freezeCap) {
    return { type: "freeze", emoji: "🧊", label: "تجميدة إضافية لسلسلتك! 🎁" };
  }
  if (roll < 0.55) {
    const emoji = STICKER_EMOJIS[Math.floor(Math.random() * STICKER_EMOJIS.length)];
    const label = STICKER_LABELS[Math.floor(Math.random() * STICKER_LABELS.length)];
    return { type: "sticker", emoji, label };
  }
  return null;
}
