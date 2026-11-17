/**
 * BillingService — Premium (lifetime, one-time purchase) via Google Play Billing.
 *
 * Product: "premium_lifetime" — a single NON_CONSUMABLE product, matching
 * the pricing model Angelo picked (buy once, unlocked forever — no
 * subscription renewal logic needed).
 *
 * Uses cordova-plugin-purchase (works under Capacitor too — it ships its
 * own Android plugin.xml that `cap sync android` installs automatically,
 * same as any other native plugin here). It wraps Google's own Billing
 * Library, so no extra account (RevenueCat, etc.) is needed — purchases
 * go straight through Play and show up in the Play Console payments
 * profile once that's set up.
 *
 * IMPORTANT — this cannot be exercised end-to-end in this sandbox: there's
 * no Android SDK here to build/run the native side, and a real purchase
 * also requires the app to be at least in an internal-testing Play
 * Console track with "premium_lifetime" created as a managed product
 * (Play Console → Monetize → Products → In-app products). Until that
 * exists, isNative() purchases will simply fail to find the product.
 * On web/preview, a confirm() dialog simulates the purchase so the UI
 * flow (paywall → "bought" state → unlocked features) can still be
 * checked here without a device.
 *
 * Entitlement persistence: the app's own settings.isPremium (in
 * localStorage, via StorageService) is the source of truth the rest of
 * the UI reads. This service's job is only to flip that flag — once from
 * a successful purchase, and again from restorePurchases() so a
 * reinstall or new device doesn't lose access (Play policy requires a
 * restore path for non-consumable products).
 */
import { Capacitor } from "@capacitor/core";

export const PREMIUM_PRODUCT_ID = "premium_lifetime";

const isNative = () => Capacitor.isNativePlatform();

let store = null;
let initPromise = null;

async function getStore() {
  if (!isNative()) return null;
  if (!initPromise) {
    initPromise = (async () => {
      const { CdvPurchase } = await import("cordova-plugin-purchase");
      store = CdvPurchase.store;
      store.register({
        id: PREMIUM_PRODUCT_ID,
        type: CdvPurchase.ProductType.NON_CONSUMABLE,
        platform: CdvPurchase.Platform.GOOGLE_PLAY,
      });
      store.error((err) => console.warn("Billing error:", err?.message || err));
      await store.initialize([CdvPurchase.Platform.GOOGLE_PLAY]);
      return store;
    })();
  }
  return initPromise;
}

/**
 * Attempts the purchase. Resolves true once Play confirms ownership
 * (the `approved` → `verify` → `finish` flow below), false if the user
 * cancelled, and throws on a real error (no network, product missing...).
 */
export async function purchasePremium() {
  if (!isNative()) {
    // Web/preview simulation only — never reachable in the published app.
    return window.confirm("[معاينة فقط] محاكاة شراء Premium بـ $3.99 — تأكيد الشراء؟");
  }
  const s = await getStore();
  if (!s) throw new Error("Billing store unavailable");
  const product = s.get(PREMIUM_PRODUCT_ID, s.defaultPlatform());
  const offer = product?.getOffer();
  if (!offer) throw new Error("Premium product not found — check it's created in Play Console and the app is on a testing track");

  return new Promise((resolve, reject) => {
    let settled = false;
    s.when().approved((transaction) => {
      transaction.verify();
    }).verified((receipt) => {
      receipt.finish();
      if (!settled) { settled = true; resolve(true); }
    }).cancelled(() => {
      if (!settled) { settled = true; resolve(false); }
    });

    offer.order().catch((err) => {
      if (!settled) { settled = true; reject(err); }
    });
  });
}

/**
 * Re-checks what Play says this Google account already owns. Used by the
 * "استرجاع المشتريات" button in Settings, and can also be called quietly
 * on app start so a reinstall/new-device user doesn't need to ask.
 * Returns true if premium_lifetime is owned.
 */
export async function restorePurchases() {
  if (!isNative()) return false; // nothing to restore on web
  const s = await getStore();
  if (!s) return false;
  await s.restorePurchases();
  const product = s.get(PREMIUM_PRODUCT_ID, s.defaultPlatform());
  return !!product?.owned;
}
