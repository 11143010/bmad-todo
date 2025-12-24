<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useUserStore } from "@/stores/user.store";
import { useIncubator } from "@/modules/incubator/useIncubator";
import { getDB } from "@/modules/db";
import { v4 as uuidv4 } from "uuid";
import { ref } from "vue";
import IncubatorModal from "./IncubatorModal.vue";
import type { EggDocType } from "@/modules/incubator/egg.schema";

const userStore = useUserStore();
const { eggs, init: initIncubator, activeIncubationCount } = useIncubator();
const EGG_PRICE = 100;

const selectedEggId = ref<string | null>(null);
const isModalOpen = ref(false);
const sortAscending = ref(false); // false = High to Low (Default)

const sortedEggs = computed(() => {
  return [...eggs.value].sort((a, b) => {
    // 1. Status Priority (Always on): Ready > Incubating > New
    const getStatusScore = (status: string) => {
      if (status === "ready") return 3;
      if (status === "incubating") return 2;
      return 1;
    };
    const statusDiff = getStatusScore(b.status) - getStatusScore(a.status);
    if (statusDiff !== 0) return statusDiff;

    // 2. Rarity Priority
    const getRarityScore = (rarity: string = "common") => {
      switch (rarity) {
        case "divine":
          return 7;
        case "mythic":
          return 6;
        case "legendary":
          return 5;
        case "epic":
          return 4;
        case "rare":
          return 3;
        case "uncommon":
          return 2;
        default:
          return 1;
      }
    };

    // High to Low (b - a), Low to High (a - b)
    const scoreA = getRarityScore(a.rarity);
    const scoreB = getRarityScore(b.rarity);

    return sortAscending.value ? scoreA - scoreB : scoreB - scoreA;
  });
});

const selectedEgg = computed(() => {
  if (!selectedEggId.value) return null;
  return eggs.value.find((e) => e.id === selectedEggId.value) || null;
});

const openIncubator = (egg: EggDocType) => {
  selectedEggId.value = egg.id;
  isModalOpen.value = true;
};

onMounted(() => {
  initIncubator();
});

const canAfford = computed(() => userStore.energy >= EGG_PRICE);

const getEggColorClass = (rarity: string) => {
  switch (rarity) {
    case "divine":
      return "text-black drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] stroke-white stroke-[0.5]"; // Black (with white glow)
    case "mythic":
      return "text-red-500 drop-shadow-[0_0_12px_rgba(239,68,68,0.8)]"; // Red
    case "legendary":
      return "text-orange-400 drop-shadow-[0_0_10px_rgba(251,146,60,0.8)]"; // Orange
    case "epic":
      return "text-purple-500 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]"; // Purple
    case "rare":
      return "text-blue-400 drop-shadow-[0_0_6px_rgba(96,165,250,0.8)]"; // Blue
    case "uncommon":
      return "text-lime-500 drop-shadow-[0_0_4px_rgba(132,204,22,0.6)]"; // True Green
    default:
      return "text-gray-200 drop-shadow-[0_0_2px_rgba(255,255,255,0.2)]"; // White
  }
};

const buyEgg = async () => {
  if (!canAfford.value) return;

  const success = await userStore.spendEnergy(EGG_PRICE);
  if (success) {
    const roll = Math.random();
    let rarity = "common"; // White (Default 40%)

    // Cumulative Probability
    if (roll > 0.98)
      rarity = "divine"; // Black (2%)
    else if (roll > 0.95)
      rarity = "mythic"; // Red (3%)
    else if (roll > 0.9)
      rarity = "legendary"; // Orange (5%)
    else if (roll > 0.8)
      rarity = "epic"; // Purple (10%)
    else if (roll > 0.65)
      rarity = "rare"; // Blue (15%)
    else if (roll > 0.4) rarity = "uncommon"; // Green (25%)

    // Remaining 40% is common (White)

    const db = await getDB();
    await db.eggs.insert({
      id: uuidv4(),
      status: "new",
      hatchTime: 0,
      petId: "",
      rarity: rarity,
      createdAt: Date.now(),
    });
  } else {
    alert("Not enough energy!");
  }
};

const clearEggs = async () => {
  const db = await getDB();
  const allEggs = await db.eggs.find().exec();
  await db.eggs.bulkRemove(allEggs.map((doc) => doc.primary));
};
const props = defineProps<{
  minimal?: boolean;
}>();

// ... (keep existing code)
</script>

<template>
  <div
    class="egg-market rounded-2xl"
    :class="
      minimal ? '' : 'p-6 bg-black/40 backdrop-blur-md border border-white/10'
    "
  >
    <!-- Header -->
    <div v-if="!minimal" class="flex items-center justify-between mb-6">
      <h2
        class="text-3xl font-black text-white italic tracking-tighter drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]"
      >
        Egg Market
      </h2>

      <div class="flex items-center gap-3">
        <button
          @click="sortAscending = !sortAscending"
          class="w-8 h-8 rounded-full border border-white/20 bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors text-white/70 hover:text-white"
          title="Sort by Rarity"
        >
          <svg
            v-if="sortAscending"
            xmlns="http://www.w3.org/2000/svg"
            class="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="m3 16 4 4 4-4" />
            <path d="M7 20V4" />
            <path d="M11 4h4" />
            <path d="M11 8h7" />
            <path d="M11 12h10" />
          </svg>
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            class="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="m3 8 4-4 4 4" />
            <path d="M7 4v16" />
            <path d="M11 12h10" />
            <path d="M11 16h7" />
            <path d="M11 20h4" />
          </svg>
        </button>

        <div
          class="px-4 py-2 rounded-full border border-yellow-500/50 bg-black/50 text-yellow-400 font-mono font-bold flex items-center gap-2 shadow-[0_0_10px_rgba(234,179,8,0.2)]"
        >
          ⚡ {{ userStore.energy }} Energy
        </div>
      </div>
    </div>

    <!-- Inventory Display -->
    <div
      v-if="eggs.length > 0"
      class="my-4 p-4 border border-white/20 rounded-xl bg-white/5"
    >
      <div class="flex justify-between items-center mb-2">
        <h3 class="text-sm text-gray-400">My Eggs ({{ eggs.length }})</h3>
        <button
          @click="clearEggs"
          class="text-xs text-red-500 hover:text-red-400 underline"
        >
          [DEV] Reset
        </button>
      </div>

      <div class="flex gap-4 flex-wrap">
        <div
          v-for="egg in sortedEggs"
          :key="egg.id"
          class="relative w-14 h-14 rounded-full border border-white/10 flex items-center justify-center bg-black/40 cursor-pointer hover:border-purple-500 transition-colors"
          :class="{
            'ring-2 ring-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]':
              egg.status === 'incubating',
            'ring-2 ring-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)] animate-bounce':
              egg.status === 'ready',
          }"
          @click="openIncubator(egg)"
        >
          <!-- Status Icons -->
          <div
            v-if="egg.status === 'incubating'"
            class="absolute -top-1 -right-1 w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center text-[10px] border border-black z-10 animate-pulse"
          >
            ⏳
          </div>
          <div
            v-if="egg.status === 'ready'"
            class="absolute -top-1 -right-1 w-5 h-5 bg-green-600 rounded-full flex items-center justify-center text-[10px] border border-black z-10"
          >
            ✅
          </div>

          <!-- Custom SVG from GDrive -->
          <svg
            viewBox="0 0 256 256"
            class="w-10 h-10"
            :class="{
              'egg-shake': egg.status === 'new' || egg.status === 'ready',
              'animate-pulse': egg.status === 'incubating',
            }"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g transform="translate(-36.9,-58.0)">
              <g transform="matrix(0.75102,0,0,0.75102,-4.5037,-10.766)">
                <g transform="matrix(0.656,0,0,0.656,-121.4,-239.3)">
                  <!-- Base Shape (Dynamic Color) -->
                  <path
                    d="m 717.14,823.8 c 1.12,105.96 -68.16,197.1 -184.29,197.1 -116.12,0 -193.62,-60.06 -192.85,-205.67 0.75,-145.94 96.77,-306.47 184.28,-308.57 93.35,-2.31 191.19,155.92 192.86,317.14 z"
                    style="
                      fill-rule: evenodd;
                      stroke: #000000;
                      stroke-width: 5;
                      stroke-linecap: round;
                      stroke-linejoin: round;
                    "
                    :class="getEggColorClass(egg.rarity || 'common')"
                    fill="currentColor"
                  />
                  <!-- Shadow -->
                  <path
                    style="fill: black; fill-opacity: 0.25; fill-rule: evenodd"
                    d="m 651.28,624.06 c -5.83,1.31 -2.42,9.29 -0.69,13 23.63,65.18 34,137.07 21,205.98 -14.39,63.4 -60.88,120.71 -123.6,140.81 -26.22,9.1 -54.32,11.1 -81.87,11.04 -4.47,1.82 -2.54,7.71 1.76,8.21 54.16,15.3 116.15,12.4 164.2,-19 47.68,-31.7 74.44,-88.89 75.5,-145.41 2.6,-57.93 -10.88,-115.44 -31.62,-169.2 -6.37,-15.49 -12.98,-31.13 -22.55,-44.93 -0.59,-0.49 -1.39,-0.67 -2.13,-0.5 z"
                  />
                  <!-- Highlight -->
                  <path
                    style="
                      fill: #ffffff;
                      fill-opacity: 0.5;
                      fill-rule: evenodd;
                      stroke: #000000;
                      stroke-width: 2;
                      stroke-linecap: round;
                      stroke-linejoin: round;
                    "
                    d="m 492.46,621.45 c -5.68,23.03 -8.36,31.25 -26.43,34.34 -12.46,2.13 -25.01,-9.67 -20.73,-32.92 3.44,-18.64 17.62,-37.46 33.58,-40.06 17.6,-2.85 18.18,20.02 13.58,38.64 z"
                  />
                </g>
              </g>
            </g>
          </svg>
        </div>
      </div>
    </div>

    <IncubatorModal
      :egg="selectedEgg"
      :isOpen="isModalOpen"
      @close="isModalOpen = false"
    />

    <div class="market-content flex flex-col items-center gap-4 mt-8">
      <!-- Buy Button -->
      <button
        @click="buyEgg"
        :disabled="!canAfford"
        :class="[
          'w-full py-4 rounded-xl font-black text-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-lg border',
          canAfford
            ? 'bg-gradient-to-r from-zinc-900 via-purple-900 to-violet-900 border-purple-500/50 text-white shadow-[0_0_15px_rgba(168,85,247,0.2)] hover:shadow-[0_0_25px_rgba(168,85,247,0.5)] hover:border-purple-400 active:scale-[0.98]'
            : 'bg-zinc-800 text-zinc-500 border-zinc-700 cursor-not-allowed',
        ]"
      >
        Buy Egg
        <span class="text-sm font-normal opacity-80"
          >({{ EGG_PRICE }} Energy)</span
        >
      </button>

      <button
        v-if="true"
        @click="userStore.addEnergy(500)"
        class="text-xs text-zinc-600 mt-2 hover:text-white underline"
      >
        [DEV] Add 500 Energy
      </button>
    </div>
  </div>
</template>

<style scoped>
.neon-text {
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
}

.egg-shake {
  animation: egg-shake 1.5s infinite ease-in-out;
  transform-origin: bottom center;
}

@keyframes egg-shake {
  0%,
  100% {
    transform: rotate(0deg) scale(1);
  }
  25% {
    transform: rotate(-15deg) scale(1.1);
  }
  50% {
    transform: rotate(0deg) scale(1.15) translateY(-5px);
  }
  75% {
    transform: rotate(15deg) scale(1.1);
  }
}
</style>
