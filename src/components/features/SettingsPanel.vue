<script setup lang="ts">
import { ref, computed } from "vue";
import { useSettingsStore } from "@/stores/settings.store";
import { useI18n, setLocale, type Locale } from "@/modules/i18n";

const { t, locale } = useI18n();
const settings = useSettingsStore();
const isOpen = ref(false);
const currentLocale = computed(() => locale.value);

const toggle = () => (isOpen.value = !isOpen.value);

const switchLocale = (newLocale: Locale) => {
  setLocale(newLocale);
  // Refresh page to apply translations
  window.location.reload();
};

// Quick presets with i18n support
const presets = computed(() => [
  {
    label: currentLocale.value === "zh-TW" ? "輕鬆" : "Easy",
    value: 50,
    emoji: "🌿",
  },
  {
    label: currentLocale.value === "zh-TW" ? "標準" : "Normal",
    value: 100,
    emoji: "⚡",
  },
  {
    label: currentLocale.value === "zh-TW" ? "衝刺" : "Sprint",
    value: 150,
    emoji: "🔥",
  },
  {
    label: currentLocale.value === "zh-TW" ? "極限" : "Extreme",
    value: 250,
    emoji: "💀",
  },
]);
</script>

<template>
  <div>
    <!-- Toggle Button -->
    <button
      @click="toggle"
      class="fixed top-4 right-4 z-50 p-3 rounded-full shadow-xl transition-all group hover:scale-105 top-btn"
      :class="isOpen ? 'top-btn-active' : ''"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="transition-colors"
        :class="
          isOpen
            ? 'text-cyan-400 animate-spin-slow'
            : 'text-zinc-400 group-hover:text-white'
        "
      >
        <path
          d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"
        />
        <circle cx="12" cy="12" r="3" />
      </svg>
    </button>

    <!-- Panel -->
    <Transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="opacity-0 scale-95 translate-y-4"
      enter-to-class="opacity-100 scale-100 translate-y-0"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100 scale-100 translate-y-0"
      leave-to-class="opacity-0 scale-95 translate-y-4"
    >
      <div
        v-if="isOpen"
        class="fixed top-20 right-4 p-6 bg-zinc-900/95 backdrop-blur-lg border border-zinc-700 rounded-2xl shadow-2xl w-80 text-zinc-100 z-40"
      >
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-bold text-white">
            ⚙️ {{ t("settings.title") }}
          </h2>
          <button
            @click="toggle"
            class="text-zinc-500 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        <div class="space-y-6">
          <!-- Daily Limit -->
          <div class="space-y-3">
            <label class="flex justify-between text-sm">
              <span class="text-zinc-400">{{ t("settings.dailyLimit") }}</span>
              <span class="font-mono font-bold text-green-400 text-lg">{{
                settings.dailyLimit
              }}</span>
            </label>

            <!-- Quick Presets -->
            <div class="grid grid-cols-4 gap-2">
              <button
                v-for="preset in presets"
                :key="preset.value"
                @click="settings.setDailyLimit(preset.value)"
                class="flex flex-col items-center p-2 rounded-lg border transition-all text-xs"
                :class="
                  settings.dailyLimit === preset.value
                    ? 'border-green-500 bg-green-500/10 text-green-400'
                    : 'border-zinc-700 hover:border-zinc-500 text-zinc-400'
                "
              >
                <span class="text-lg">{{ preset.emoji }}</span>
                <span>{{ preset.label }}</span>
              </button>
            </div>

            <!-- Slider -->
            <input
              type="range"
              min="20"
              max="300"
              step="10"
              :value="settings.dailyLimit"
              @input="
                (e) =>
                  settings.setDailyLimit(
                    Number((e.target as HTMLInputElement).value)
                  )
              "
              class="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-green-500"
            />
            <p class="text-xs text-zinc-600">
              {{
                currentLocale === "zh-TW"
                  ? "設定你的每日工作容量。建議從 100 開始。"
                  : "Set your daily capacity. Start with 100."
              }}
            </p>
          </div>

          <!-- Divider -->
          <div class="border-t border-zinc-800"></div>

          <!-- Toggles -->
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="text-lg">🔊</span>
                <span class="text-sm">{{ t("settings.sound") }}</span>
              </div>
              <button
                @click="settings.toggleSound()"
                class="w-14 h-7 rounded-full transition-all relative"
                :class="settings.soundEnabled ? 'bg-green-500' : 'bg-zinc-700'"
              >
                <div
                  class="w-5 h-5 rounded-full bg-white absolute top-1 transition-all shadow-md"
                  :class="settings.soundEnabled ? 'left-8' : 'left-1'"
                ></div>
              </button>
            </div>

            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="text-lg">📳</span>
                <span class="text-sm">{{ t("settings.haptics") }}</span>
              </div>
              <button
                @click="settings.toggleHaptics()"
                class="w-14 h-7 rounded-full transition-all relative"
                :class="
                  settings.hapticsEnabled ? 'bg-green-500' : 'bg-zinc-700'
                "
              >
                <div
                  class="w-5 h-5 rounded-full bg-white absolute top-1 transition-all shadow-md"
                  :class="settings.hapticsEnabled ? 'left-8' : 'left-1'"
                ></div>
              </button>
            </div>
          </div>

          <!-- Divider -->
          <div class="border-t border-zinc-800"></div>

          <!-- Language -->
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="text-lg">🌐</span>
              <span class="text-sm">語言 / Language</span>
            </div>
            <div class="flex gap-1">
              <button
                @click="switchLocale('zh-TW')"
                class="px-3 py-1 text-xs rounded transition-colors"
                :class="
                  currentLocale === 'zh-TW'
                    ? 'bg-green-500/20 text-green-400 border border-green-500'
                    : 'border border-zinc-700 text-zinc-500 hover:border-zinc-500'
                "
              >
                中文
              </button>
              <button
                @click="switchLocale('en')"
                class="px-3 py-1 text-xs rounded transition-colors"
                :class="
                  currentLocale === 'en'
                    ? 'bg-green-500/20 text-green-400 border border-green-500'
                    : 'border border-zinc-700 text-zinc-500 hover:border-zinc-500'
                "
              >
                EN
              </button>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="mt-6 pt-4 border-t border-zinc-800 space-y-2">
          <p class="text-[10px] text-zinc-600 text-center font-mono">
            BMad v1.0 // 代謝管理系統
          </p>
          <p class="text-[10px] text-zinc-700 text-center">
            按 <kbd class="bg-zinc-800 px-1 rounded">?</kbd> 查看快捷鍵
          </p>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
@keyframes spin-slow {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
.animate-spin-slow {
  animation: spin-slow 3s linear infinite;
}

/* Galaxy Theme Button */
.top-btn {
  background: var(--glass-bg);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--glass-border);
}

.top-btn:hover {
  background: var(--glass-hover);
  border-color: rgba(139, 92, 246, 0.4);
  box-shadow: 0 0 20px rgba(139, 92, 246, 0.2);
}

.top-btn-active {
  border-color: var(--nebula-cyan);
  box-shadow: 0 0 20px rgba(6, 182, 212, 0.3);
}
</style>
