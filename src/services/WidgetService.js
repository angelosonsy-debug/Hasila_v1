/**
 * WidgetService — keeps the home-screen widget's due-word/situation
 * counts in sync with the app's own state.
 *
 * How this actually reaches the native widget: @capacitor/preferences
 * writes into Android SharedPreferences under the file/group name
 * "CapacitorStorage" (its documented default — see
 * node_modules/@capacitor/preferences/android/.../PreferencesConfiguration.java).
 * The native widget (widget-source/kotlin/HasilaWidgetProvider.kt, copied
 * into the Android project by CI — see .github/workflows/android.yml)
 * reads that exact same SharedPreferences file directly, with no plugin
 * call needed on its side. This is the standard pattern for a Capacitor
 * app + a native widget: a plain key-value bridge, not a live RPC.
 *
 * IMPORTANT limitation (documented honestly, not glossed over): Android
 * clamps AppWidgetProviderInfo.updatePeriodMillis to a 30-minute minimum
 * — there is no way to get a *lower* OS-driven refresh interval. So the
 * widget's displayed count can be up to ~30 minutes stale, or stale until
 * the next unlock/launcher refresh, whichever the OS does first. A
 * perfectly live counter would need a foreground service or push
 * notifications, neither of which fits a simple review-count widget.
 * Opening the app itself (which the widget's tap action does) always
 * shows the true live count immediately, same as today.
 *
 * On web/preview this is a silent no-op, same pattern as every other
 * native-only service in this codebase (AdMobService, BillingService).
 */
import { Capacitor } from "@capacitor/core";

const isNative = () => Capacitor.isNativePlatform();

const KEY_WORDS = "hasila_widget_due_words";
const KEY_SITUATIONS = "hasila_widget_due_situations";

/** Call whenever due counts change (word count, situation count) - cheap
 * enough to call on every render; it only actually writes on native. */
export async function syncWidgetCounts(dueWords, dueSituations) {
  if (!isNative()) return;
  try {
    const { Preferences } = await import("@capacitor/preferences");
    await Preferences.set({ key: KEY_WORDS, value: String(dueWords ?? 0) });
    await Preferences.set({ key: KEY_SITUATIONS, value: String(dueSituations ?? 0) });
  } catch (err) {
    console.warn("Widget counts sync failed:", err?.message || err);
  }
}
