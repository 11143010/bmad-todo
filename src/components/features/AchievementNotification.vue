<script setup lang="ts">
import { useAchievementStore } from "@/stores/achievement.store";
import { storeToRefs } from "pinia";

const achievementStore = useAchievementStore();
const { recentUnlock, showNotification } = storeToRefs(achievementStore);
</script>

<template>
  <Transition
    enter-active-class="transition ease-out duration-500"
    enter-from-class="opacity-0 translate-y-8 scale-95"
    enter-to-class="opacity-100 translate-y-0 scale-100"
    leave-active-class="transition ease-in duration-300"
    leave-from-class="opacity-100 translate-y-0 scale-100"
    leave-to-class="opacity-0 -translate-y-4 scale-95"
  >
    <div
      v-if="showNotification && recentUnlock"
      class="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] animate-bounce"
    >
      <div
        class="bg-gradient-to-r from-amber-500 to-yellow-500 text-black px-6 py-4 rounded-2xl shadow-2xl shadow-amber-500/30 flex items-center gap-4"
        @click="achievementStore.dismissNotification"
      >
        <!-- Trophy Icon -->
        <div class="text-4xl animate-pulse">
          {{ recentUnlock.emoji }}
        </div>

        <div>
          <div class="text-xs font-bold uppercase tracking-widest opacity-70">
            成就解鎖！
          </div>
          <div class="text-xl font-black">
            {{ recentUnlock.name }}
          </div>
          <div class="text-sm opacity-80">
            {{ recentUnlock.description }}
          </div>
        </div>

        <!-- Sparkles -->
        <div class="absolute -top-2 -right-2 text-2xl animate-spin">✨</div>
        <div class="absolute -bottom-1 -left-1 text-xl animate-ping">🎉</div>
      </div>
    </div>
  </Transition>
</template>
