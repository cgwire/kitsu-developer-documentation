// .vitepress/theme/composables/useABTests.js
import { ref, onMounted } from "vue";

function pickWeightedVariant(variants) {
  const total = variants.reduce((sum, v) => sum + v.weight, 0);
  let r = Math.random() * total;
  for (const v of variants) {
    if (r < v.weight) return v.name;
    r -= v.weight;
  }
  return variants[variants.length - 1].name;
}

function readCookie(name) {
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${name}=([^;]*)`)
  );
  return match ? decodeURIComponent(match[1]) : null;
}

function writeCookie(name, value, maxAgeSeconds) {
  document.cookie = `${name}=${encodeURIComponent(
    value
  )}; path=/; max-age=${maxAgeSeconds}; SameSite=Lax`;
}

/**
 * VitePress has no per-request server (pages are prerendered once at
 * build time), so there's no SSR-aware cookie API like Nuxt's useCookie.
 * All cookie reads/writes and Matomo tracking are deferred to onMounted
 * so nothing touches `document`/`window` during the static build.
 * `variant` is `null` until then, which is fine since the popup itself
 * is already wrapped in <ClientOnly>.
 */
export function useABTest(testId, variants) {
  const cookieName = `ab_${testId}`;
  const variant = ref(null);

  onMounted(() => {
    let value = readCookie(cookieName);

    if (!value) {
      value = pickWeightedVariant(variants);
      writeCookie(cookieName, value, 60 * 60 * 24 * 90); // 90 days
    }

    variant.value = value;

    if (window._paq) {
      window._paq.push(["setCustomDimension", 1, value]);
      window._paq.push(["trackEvent", "AB Test", "1", value]);
    }
  });

  return variant;
}