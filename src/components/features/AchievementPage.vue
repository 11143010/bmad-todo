<script setup lang="ts">
import { ref } from "vue";
import { useAchievementStore } from "@/stores/achievement.store";
import { storeToRefs } from "pinia";
import { useI18n } from "@/modules/i18n";

const { locale } = useI18n();
const achievementStore = useAchievementStore();
const { allAchievements, unlockedCount } = storeToRefs(achievementStore);

const isOpen = ref(false);

const toggle = () => {
  isOpen.value = !isOpen.value;
};
</script>

<template>
  <!-- Trophy Button -->
  <button
    v-if="!isOpen"
    @click="toggle"
    class="trophy-btn fixed top-4 right-[4.5rem] z-50 p-3 rounded-full shadow-xl transition-all group hover:scale-105"
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
      class="text-amber-400 group-hover:text-amber-300 transition-colors"
      :class="{ 'animate-bounce': unlockedCount > 0 }"
    >
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
    <span
      v-if="unlockedCount > 0"
      class="absolute -top-1 -right-1 w-5 h-5 text-black text-xs font-bold rounded-full flex items-center justify-center"
      style="
        background: linear-gradient(
          135deg,
          var(--nebula-cyan),
          var(--nebula-purple)
        );
      "
    >
      {{ unlockedCount }}
    </span>
  </button>

  <!-- Achievement Panel -->
  <Teleport to="body">
    <Transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        class="fixed inset-0 z-40 bg-zinc-950/95 backdrop-blur-sm"
      >
        <!-- Fixed Close Button (same position as trophy) -->
        <button
          @click="toggle"
          class="fixed top-4 right-[4.5rem] z-50 p-3 bg-zinc-800 hover:bg-zinc-700 rounded-full text-zinc-400 hover:text-white transition-all border border-zinc-700"
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
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>

        <div class="h-full overflow-y-auto">
          <div class="max-w-2xl mx-auto p-8">
            <!-- Header -->
            <div class="mb-8">
              <h1
                class="text-3xl font-black text-white flex items-center gap-3"
              >
                <span>🏆</span>
                {{ locale === "zh-TW" ? "成就殿堂" : "Achievements" }}
              </h1>
              <p class="text-zinc-500 mt-1">
                {{ unlockedCount }} / {{ allAchievements.length }}
                {{ locale === "zh-TW" ? "已解鎖" : "Unlocked" }}
              </p>
            </div>

            <!-- Progress Bar -->
            <div class="mb-8">
              <div class="h-3 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  class="h-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-500"
                  :style="{
                    width: `${(unlockedCount / allAchievements.length) * 100}%`,
                  }"
                ></div>
              </div>
            </div>

            <!-- Achievement Grid -->
            <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div
                v-for="achievement in allAchievements"
                :key="achievement.id"
                class="relative p-6 rounded-2xl border transition-all duration-300"
                :class="
                  achievement.unlocked
                    ? 'bg-gradient-to-br from-amber-500/10 to-yellow-500/5 border-amber-500/50'
                    : 'bg-zinc-900 border-zinc-800 opacity-50 grayscale'
                "
              >
                <!-- Emoji -->
                <div
                  class="text-4xl mb-3"
                  :class="{ 'animate-bounce': achievement.unlocked }"
                >
                  {{ achievement.emoji }}
                </div>

                <!-- Name -->
                <h3
                  class="font-bold text-lg"
                  :class="achievement.unlocked ? 'text-white' : 'text-zinc-500'"
                >
                  {{ achievement.name }}
                </h3>

                <!-- Description -->
                <p class="text-sm text-zinc-500 mt-1">
                  {{ achievement.description }}
                </p>

                <!-- Lock Icon -->
                <div
                  v-if="!achievement.unlocked"
                  class="absolute top-4 right-4 text-zinc-600"
                >
                  🔒
                </div>

                <!-- Unlocked Badge -->
                <div
                  v-if="achievement.unlocked"
                  class="absolute top-4 right-4 text-amber-400"
                >
                  ✓
                </div>
              </div>
            </div>

            <!-- Empty State -->
            <div
              v-if="unlockedCount === 0"
              class="text-center py-12 text-zinc-600"
            >
              <div class="text-6xl mb-4 opacity-30">🎯</div>
              <p>
                {{
                  locale === "zh-TW"
                    ? "開始完成任務來解鎖成就！"
                    : "Complete tasks to unlock achievements!"
                }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
