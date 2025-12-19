<script setup lang="ts">
import { onMounted } from "vue";
import { useSettingsStore } from "@/stores/settings.store";
import { useStressStore } from "@/stores/stress.store";
import { useTaskStore } from "@/stores/task.store";
import { useAchievementStore } from "@/stores/achievement.store";
import { useTagStore } from "@/stores/tag.store";
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

const settings = useSettingsStore();
const stress = useStressStore();
const taskStore = useTaskStore();
const achievementStore = useAchievementStore();
const tagStore = useTagStore();

onMounted(() => {
  settings.init();
  stress.init();
  taskStore.init();
  achievementStore.init();
  tagStore.init();
});
</script>

<template>
  <!-- Galaxy Background Layers -->
  <div class="galaxy-bg"></div>
  <div class="nebula-glow top-right"></div>
  <div class="nebula-glow bottom-left"></div>

  <div
    class="min-h-screen bg-zinc-950 text-zinc-100 p-8 flex flex-col items-center relative z-10"
  >
    <h1 class="text-4xl font-black mb-8 tracking-tighter w-full max-w-4xl">
      <span class="gradient-text">BMad</span>
      <span class="text-green-500 text-sm align-top ml-2 animate-pulse"
        >ALPHA</span
      >
    </h1>

    <div
      class="flex-1 flex flex-col items-center w-full max-w-4xl space-y-12 pb-20"
    >
      <!-- Dashboard Area -->
      <div
        class="flex flex-col md:flex-row items-center md:items-start justify-between gap-8 w-full max-w-2xl px-4"
      >
        <!-- The Stomach -->
        <StomachGauge />

        <!-- Analytics -->
        <div class="w-full max-w-sm">
          <AnalyticsDashboard />
        </div>
      </div>

      <div class="flex flex-col items-center w-full max-w-2xl space-y-8">
        <!-- Input -->
        <TaskInput class="w-full" />

        <!-- The Plate -->
        <Plate class="w-full" />
      </div>
    </div>

    <!-- Features -->
    <SettingsPanel />

    <!-- Achievement Page (Trophy Button) -->
    <AchievementPage />

    <!-- Shutdown Button (Power Button) -->
    <ShutdownButton />

    <!-- Achievement Notification -->
    <AchievementNotification />

    <!-- PWA Status (offline/online) -->
    <PWAStatus />

    <!-- Keyboard Shortcuts Handler -->
    <KeyboardShortcuts />

    <!-- Overlays -->
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
