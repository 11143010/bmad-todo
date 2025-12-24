<script setup lang="ts">
import { onMounted } from "vue";
import { useSettingsStore } from "@/stores/settings.store";
import { useStressStore } from "@/stores/stress.store";
import { useTaskStore } from "@/stores/task.store";
import { useAchievementStore } from "@/stores/achievement.store";
import { useTagStore } from "@/stores/tag.store";
import { useUserStore } from "@/stores/user.store";
import SettingsPanel from "@/components/features/SettingsPanel.vue";
import StomachGauge from "@/components/features/StomachGauge.vue";
import SystemOverload from "@/components/features/SystemOverload.vue";
import TaskInput from "@/components/features/TaskInput.vue";
import Plate from "@/components/features/Plate.vue";
import AnalyticsDashboard from "@/components/features/AnalyticsDashboard.vue";
import AchievementNotification from "@/components/features/AchievementNotification.vue";
import AchievementPage from "@/components/features/AchievementPage.vue";
import ShutdownButton from "@/components/features/ShutdownButton.vue";
import PWAStatus from "@/components/features/PWAStatus.vue";
import KeyboardShortcuts from "@/components/features/KeyboardShortcuts.vue";
import GamificationCenter from "@/components/features/GamificationCenter.vue";

const settings = useSettingsStore();
const stress = useStressStore();
const taskStore = useTaskStore();
const achievementStore = useAchievementStore();
const tagStore = useTagStore();
const userStore = useUserStore();
import { ref, computed } from "vue"; // Ensure computed is imported
import { useIncubator } from "@/modules/incubator/useIncubator"; // Import incubator for notification check

const currentView = ref<"work" | "play">("work");
const { eggs } = useIncubator();
const hasReadyEggs = computed(() =>
  eggs.value.some((e) => e.status === "ready")
);

onMounted(() => {
  settings.init();
  stress.init();
  taskStore.init();
  achievementStore.init();
  tagStore.init();
  userStore.init();
});
</script>

<template>
  <!-- Galaxy Background Layers -->
  <div class="galaxy-bg"></div>
  <div class="nebula-glow top-right"></div>
  <div class="nebula-glow bottom-left"></div>

  <div
    class="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center relative z-10 pb-24"
  >
    <!-- View Content -->
    <div
      class="w-full max-w-4xl p-4 sm:p-8 flex-1 flex flex-col items-center animate-fade-in"
      v-if="currentView === 'work'"
    >
      <!-- WORK VIEW -->
      <h1
        class="text-4xl font-black mb-8 tracking-tighter w-full max-w-4xl text-center sm:text-left"
      >
        <span class="gradient-text">BMad</span>
        <span class="text-green-500 text-sm align-top ml-2 animate-pulse"
          >ALPHA</span
        >
      </h1>

      <div class="flex-1 flex flex-col items-center w-full space-y-12">
        <!-- Dashboard Area -->
        <div
          class="flex flex-col md:flex-row items-center md:items-start justify-between gap-8 w-full max-w-2xl px-4"
        >
          <StomachGauge />
          <div class="w-full max-w-sm">
            <AnalyticsDashboard />
          </div>
        </div>

        <div class="flex flex-col items-center w-full max-w-2xl space-y-8">
          <TaskInput class="w-full" />
          <Plate class="w-full" />
        </div>
      </div>
    </div>

    <div
      class="w-full max-w-4xl p-4 sm:p-8 flex-1 flex flex-col items-center animate-fade-in"
      v-else-if="currentView === 'play'"
    >
      <!-- PLAY VIEW -->
      <h1
        class="text-4xl font-black mb-8 tracking-tighter w-full max-w-4xl text-center text-purple-400 italic"
      >
        GAME CENTER
      </h1>
      <GamificationCenter
        class="w-full max-w-2xl h-[calc(100vh-200px)] min-h-[500px]"
      />
    </div>

    <!-- Right App Bar (Global Navigation) -->
    <div
      v-if="!settings.isSettingsOpen"
      class="fixed right-6 top-1/2 transform -translate-y-1/2 bg-black/80 backdrop-blur-xl border border-white/20 rounded-full py-6 px-3 flex flex-col gap-8 shadow-2xl z-50"
    >
      <button
        @click="currentView = 'work'"
        class="flex flex-col items-center gap-1 transition-all duration-300 group"
        :class="
          currentView === 'work'
            ? 'text-green-400 scale-110'
            : 'text-gray-500 hover:text-gray-300'
        "
      >
        <span
          class="text-2xl p-2 rounded-full group-hover:bg-white/5 transition-colors"
          >⚡</span
        >
        <span
          class="text-[10px] font-bold uppercase tracking-widest writing-mode-vertical rotate-180 hidden"
          >Work</span
        >
      </button>

      <div class="h-px bg-white/10 w-8 self-center"></div>

      <button
        @click="currentView = 'play'"
        class="flex flex-col items-center gap-1 transition-all duration-300 relative group"
        :class="
          currentView === 'play'
            ? 'text-purple-400 scale-110'
            : 'text-gray-500 hover:text-gray-300'
        "
      >
        <span
          class="text-2xl p-2 rounded-full group-hover:bg-white/5 transition-colors"
          >🎮</span
        >
        <span
          class="text-[10px] font-bold uppercase tracking-widest writing-mode-vertical rotate-180 hidden"
          >Play</span
        >
        <!-- Notification Dot -->
        <div
          class="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full animate-pulse"
          v-if="hasReadyEggs"
        ></div>
      </button>
    </div>

    <!-- Features (Global Overlays) -->
    <SettingsPanel />
    <AchievementPage />
    <ShutdownButton />
    <AchievementNotification />
    <PWAStatus />
    <KeyboardShortcuts />

    <Transition
      enter-active-class="transition-opacity duration-300 ease-out"
      enter-from-class="opacity-0"
      leave-active-class="transition-opacity duration-200 ease-in"
      leave-to-class="opacity-0"
    >
      <SystemOverload v-if="stress.isSystemOverloaded" />
    </Transition>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
