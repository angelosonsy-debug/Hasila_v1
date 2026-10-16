package com.hasila.vocab

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.Context
import android.content.Intent
import android.widget.RemoteViews

/**
 * HasilaWidgetProvider — home-screen widget showing how many words (and
 * situations) are due for review right now.
 *
 * Data source: Android SharedPreferences, file "CapacitorStorage" (the
 * @capacitor/preferences plugin's documented default group name), keys
 * "hasila_widget_due_words" / "hasila_widget_due_situations". The JS side
 * (src/services/WidgetService.js, called from App.jsx) writes these every
 * time the due counts change while the app is open. This provider only
 * reads them — it never talks to the WebView or the plugin directly,
 * which is what makes a plain AppWidgetProvider able to read Capacitor
 * app state at all.
 *
 * Refresh cadence: Android enforces an OS-level minimum of 30 minutes for
 * updatePeriodMillis (see widget-source/res/xml/hasila_widget_info.xml) -
 * there is no supported way to push a faster passive update. The numbers
 * can be stale by up to that window, or until the launcher's own refresh
 * (e.g. after unlock). This is a known, deliberate trade-off for a simple
 * read-only info widget — not a bug.
 */
class HasilaWidgetProvider : AppWidgetProvider() {

    override fun onUpdate(context: Context, appWidgetManager: AppWidgetManager, appWidgetIds: IntArray) {
        for (appWidgetId in appWidgetIds) {
            updateWidget(context, appWidgetManager, appWidgetId)
        }
    }

    private fun updateWidget(context: Context, appWidgetManager: AppWidgetManager, appWidgetId: Int) {
        val prefs = context.getSharedPreferences("CapacitorStorage", Context.MODE_PRIVATE)
        val dueWords = prefs.getString("hasila_widget_due_words", "0")?.toIntOrNull() ?: 0
        val dueSituations = prefs.getString("hasila_widget_due_situations", "0")?.toIntOrNull() ?: 0

        val views = RemoteViews(context.packageName, R.layout.widget_hasila)

        val countText = when {
            dueWords > 0 && dueSituations > 0 -> "$dueWords كلمة و$dueSituations موقف"
            dueWords > 0 -> "$dueWords كلمة جاهزة"
            dueSituations > 0 -> "$dueSituations موقف جاهز"
            else -> "كل حاجة متراجعة ✅"
        }
        views.setTextViewText(R.id.widget_count_text, countText)

        // Tapping anywhere on the widget opens the app itself - the live,
        // always-accurate source of truth for these counts.
        val launchIntent = context.packageManager.getLaunchIntentForPackage(context.packageName)
        launchIntent?.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP)
        val pendingIntent = PendingIntent.getActivity(
            context, 0, launchIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )
        views.setOnClickPendingIntent(R.id.widget_root, pendingIntent)

        appWidgetManager.updateAppWidget(appWidgetId, views)
    }
}
