<template>
  <!--
    ClientOnly is required here: VitePress prerenders on the server,
    where `document` doesn't exist and Teleport-to-body has no target.
    This whole block is skipped during SSG and only mounts in the browser.
  -->
  <ClientOnly>
    <Teleport v-if="variant === 'variant_b'" to="body">
      <Transition name="modal">
        <div
          v-if="visible"
          class="overlay"
          @click.self="close"
        >
          <div class="popup">
            <button class="close-btn" @click="close">×</button>

            <div class="content">
              <div class="left">
                <div class="badge">{{ badgeText }}</div>

                <h2>Before you go...</h2>

                <p>
                  Ready to level up your production workflow? Create your
                  free account and get access to the latest features from
                  CGWire's Kitsu.
                </p>

                <a
                  class="navbar-item signup"
                  :href="signupUrl"
                >
                  Signup
                </a>
              </div>

              <div class="right">
                <div class="illustration">
                  <img src="/logo-kitsu.svg" width="100px"/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </ClientOnly>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref, computed } from "vue";
import { useData } from "vitepress";
import { useABTest } from "./composables/useABTests.js";

// VitePress's built-in reactive site data (replaces $i18n.locale)
const { lang } = useData();

const variant = useABTest("exit_intent_popup_test", [
  { name: "control", weight: 50 },
  { name: "variant_b", weight: 50 },
]);

const visible = ref(false);

// Swap in vitepress-plugin-i18n's t() here if you have one installed;
// otherwise this is a plain fallback string.
const badgeText = "Free Trial";

const signupUrl = computed(
  () => `https://account.cg-wire.com/signup?locale=${lang.value}`
);

function showPopup() {
  const alreadySeen = sessionStorage.getItem("exit-popup");

  if (!alreadySeen) {
    visible.value = true;
    sessionStorage.setItem("exit-popup", true);
  }
}

function close() {
  visible.value = false;
}

function handleMouseLeave(e) {
  if (e.clientY <= 0 && !visible.value) {
    showPopup();
  }
}

onMounted(() => {
  document.addEventListener("mouseleave", handleMouseLeave);
});

onBeforeUnmount(() => {
  document.removeEventListener("mouseleave", handleMouseLeave);
});
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(7, 11, 19, 0.82);
  backdrop-filter: blur(6px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.popup {
  width: min(720px, 92vw);
  background: #fff;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  position: relative;
}

.content {
  display: flex;
}

.left {
  flex: 1;
  padding: 42px;
  background: white;
}

.right {
  width: 220px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #2ecc71, #27ae60);
}

.illustration {
  font-size: 72px;
  color: white;
}

.badge {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 999px;
  background: rgba(46, 204, 113, 0.12);
  color: #1f8f4a;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 18px;
}

h2 {
  color: #1f2937;
  font-size: 34px;
  margin-bottom: 12px;
}

p {
  color: #6b7280;
  line-height: 1.6;
  margin-bottom: 24px;
}

.signup {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 14px 24px;
  border-radius: 12px;
  background: #2ecc71;
  color: white;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s ease;
}

.signup:hover {
  background: #27ae60;
  transform: translateY(-1px);
}

.close-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 50%;
  background: #f3f4f6;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: #e5e7eb;
  color: #111827;
}

.modal-enter-active,
.modal-leave-active {
  transition: all 0.25s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .popup,
.modal-leave-to .popup {
  transform: scale(0.95);
}
</style>