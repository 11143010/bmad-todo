<script setup lang="ts">
import { ref } from "vue";
import { useMetabolismStore } from "@/stores/metabolism.store";
import { useI18n } from "@/modules/i18n";

const { t, locale } = useI18n();
const metabolism = useMetabolismStore();
const holdProgress = ref(0);
const isMinimized = ref(false);
let holdInterval: number | null = null;

const startHold = () => {
  if (holdInterval) return;
  holdInterval = setInterval(() => {
    holdProgress.value += 5;
    if (holdProgress.value >= 100) {
      completeOverride();
    }
  }, 50);
};

const stopHold = () => {
  if (holdInterval) {
    clearInterval(holdInterval);
    holdInterval = null;
  }
  holdProgress.value = 0;
};

const completeOverride = () => {
  stopHold();
  metabolism.activateOverride();
};

const enterDigestionMode = () => {
  isMinimized.value = true;
};
</script>

<template>
  <div
    v-if="!isMinimized"
    class="fixed inset-0 z-50 bg-zinc-950/95 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500"
  >
    <!-- Icon -->
    <div class="mb-6 text-6xl animate-pulse">⛔️</div>

    <h1 class="text-4xl font-black text-white mb-4 tracking-tighter">
      {{ t("kitchen.title") }}
    </h1>

    <div class="max-w-md space-y-4 text-zinc-400 mb-12">
      <p class="text-lg">{{ t("kitchen.message") }}</p>
    </div>

    <div class="space-y-4 w-full max-w-xs">
      <!-- Digestion Mode Button -->
      <button
        @click="enterDigestionMode"
        class="w-full px-8 py-4 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-green-500/20 active:scale-95 flex items-center justify-center space-x-2"
      >
        <span>{{
          locale === "zh-TW"
            ? "開始消化 (完成任務)"
            : "Start Digesting (Complete Tasks)"
        }}</span>
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
          class="w-full relative px-8 py-3 bg-zinc-900 border border-zinc-800 text-zinc-500 font-bold rounded-xl overflow-hidden transition-all active:scale-95 select-none hover:text-zinc-300"
        >
          <span class="relative z-10 text-sm">{{
            locale === "zh-TW"
              ? "我必須吃更多 (長按強制)"
              : "I need more (Hold to force)"
          }}</span>

          <!-- Progress Fill -->
          <div
            class="absolute inset-y-0 left-0 bg-red-600/20 transition-all duration-75 ease-linear"
            :style="{ width: `${holdProgress}%` }"
          ></div>
        </button>
      </div>
    </div>
  </div>

  <!-- Minimized Banner -->
  <div
    v-else
    class="fixed bottom-0 inset-x-0 z-50 bg-red-900/90 backdrop-blur border-t border-red-700 p-4 flex justify-between items-center animate-in slide-in-from-bottom duration-300"
  >
    <div class="flex items-center space-x-3 text-white">
      <span class="text-2xl">⛔️</span>
      <div>
        <h3 class="font-bold text-sm">
          {{ locale === "zh-TW" ? "消化模式" : "Digestion Mode" }}
        </h3>
        <p class="text-xs text-red-200">
          {{
            locale === "zh-TW"
              ? "無法新增任務，請專注完成現有項目。"
              : "Cannot add tasks. Focus on completing existing ones."
          }}
        </p>
      </div>
    </div>
    <button
      @click="isMinimized = false"
      class="p-2 hover:bg-black/20 rounded-full transition-colors text-white/70 hover:text-white"
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
      >
        <path d="m18 15-6-6-6 6" />
      </svg>
    </button>
  </div>
</template>
