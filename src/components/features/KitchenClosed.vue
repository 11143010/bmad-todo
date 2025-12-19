<script setup lang="ts">
import { ref } from "vue";
import { useMetabolismStore } from "@/stores/metabolism.store";
import { useI18n } from "@/modules/i18n";

const { t } = useI18n();
const metabolism = useMetabolismStore();
const holdProgress = ref(0);
const isMinimized = ref(false);
let holdInterval: number | null = null;

/**
 * Start the hold-to-override timer
 */
const startHold = (): void => {
  if (holdInterval) return;
  holdInterval = setInterval(() => {
    holdProgress.value += 5;
    if (holdProgress.value >= 100) {
      completeOverride();
    }
  }, 50);
};

/**
 * Stop the hold timer and reset progress
 */
const stopHold = (): void => {
  if (holdInterval) {
    clearInterval(holdInterval);
    holdInterval = null;
  }
  holdProgress.value = 0;
};

/**
 * Complete the override action
 */
const completeOverride = (): void => {
  stopHold();
  metabolism.activateOverride();
};

/**
 * Minimize to focus mode banner
 */
const enterFocusMode = (): void => {
  isMinimized.value = true;
};
</script>

<template>
  <!-- System Overload Modal -->
  <div
    v-if="!isMinimized"
    class="fixed inset-0 z-50 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500"
    style="
      background: linear-gradient(
        180deg,
        rgba(10, 10, 20, 0.98) 0%,
        rgba(26, 10, 42, 0.95) 100%
      );
    "
  >
    <!-- Nebula Glow -->
    <div
      class="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full pointer-events-none"
      style="
        background: radial-gradient(
          circle,
          rgba(236, 72, 153, 0.2) 0%,
          transparent 70%
        );
        filter: blur(60px);
      "
    ></div>

    <!-- Warning Icon -->
    <div
      class="mb-6 text-6xl animate-pulse"
      style="filter: drop-shadow(0 0 30px rgba(236, 72, 153, 0.5))"
    >
      ⚠️
    </div>

    <h1
      class="text-4xl font-black mb-4 tracking-tighter"
      style="
        background: linear-gradient(
          135deg,
          var(--nebula-pink),
          var(--nebula-violet)
        );
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      "
    >
      {{ t("kitchen.title") }}
    </h1>

    <div class="max-w-md space-y-4 text-zinc-400 mb-12">
      <p class="text-lg">{{ t("kitchen.message") }}</p>
    </div>

    <div class="space-y-4 w-full max-w-xs">
      <!-- Focus Mode Button -->
      <button
        @click="enterFocusMode"
        class="w-full px-8 py-4 font-bold rounded-xl transition-all shadow-lg active:scale-95 flex items-center justify-center space-x-2"
        style="
          background: linear-gradient(
            135deg,
            var(--nebula-cyan),
            var(--nebula-purple)
          );
          box-shadow: 0 0 30px rgba(6, 182, 212, 0.3);
        "
      >
        <span class="text-white">{{ t("kitchen.digest") }}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="text-white"
        >
          <path d="M5 12h14" />
          <path d="m12 5 7 7-7 7" />
        </svg>
      </button>

      <!-- Override Button -->
      <div class="relative group pt-4">
        <button
          @mousedown="startHold"
          @touchstart.prevent="startHold"
          @mouseup="stopHold"
          @touchend.prevent="stopHold"
          @mouseleave="stopHold"
          class="w-full relative px-8 py-3 font-bold rounded-xl overflow-hidden transition-all active:scale-95 select-none"
          style="
            background: var(--glass-bg);
            border: 1px solid var(--glass-border);
            backdrop-filter: blur(12px);
          "
        >
          <span class="relative z-10 text-sm text-zinc-500 hover:text-zinc-300">
            {{ t("kitchen.override") }}
          </span>

          <!-- Progress Fill -->
          <div
            class="absolute inset-y-0 left-0 transition-all duration-75 ease-linear"
            style="background: rgba(236, 72, 153, 0.2)"
            :style="{ width: `${holdProgress}%` }"
          ></div>
        </button>
      </div>
    </div>
  </div>

  <!-- Minimized Focus Mode Banner -->
  <div
    v-else
    class="fixed bottom-0 inset-x-0 z-50 backdrop-blur p-4 flex justify-between items-center animate-in slide-in-from-bottom duration-300"
    style="
      background: linear-gradient(
        90deg,
        rgba(236, 72, 153, 0.15),
        rgba(139, 92, 246, 0.15)
      );
      border-top: 1px solid rgba(236, 72, 153, 0.3);
    "
  >
    <div class="flex items-center space-x-3 text-white">
      <span
        class="text-2xl"
        style="filter: drop-shadow(0 0 10px rgba(236, 72, 153, 0.5))"
      >
        🚀
      </span>
      <div>
        <h3 class="font-bold text-sm gradient-text">
          {{ t("kitchen.focusMode") }}
        </h3>
        <p class="text-xs text-zinc-400">
          {{ t("kitchen.focusMessage") }}
        </p>
      </div>
    </div>
    <button
      @click="isMinimized = false"
      class="p-2 rounded-full transition-colors"
      style="background: var(--glass-bg); border: 1px solid var(--glass-border)"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="text-zinc-400"
      >
        <path d="m18 15-6-6-6 6" />
      </svg>
    </button>
  </div>
</template>
