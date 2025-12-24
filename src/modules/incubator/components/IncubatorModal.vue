<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from "vue";
import { useIncubator } from "../useIncubator";
import type { EggDocType } from "../egg.schema";
import { usePet } from "@/modules/collection/usePet";

const props = defineProps<{
  egg: EggDocType | null;
  isOpen: boolean;
}>();

const emit = defineEmits(["close"]);

const MAX_INCUBATION_SLOTS = 3;
const { incubateEgg, activeIncubationCount, fastForwardEgg, markReady } =
  useIncubator();
const { hatchEgg } = usePet();
const now = ref(Date.now());
const hatchedPet = ref<any>(null); // To store result
let timer: any;

const checkStatus = () => {
  if (props.egg && props.egg.status === "incubating" && props.egg.hatchTime) {
    if (now.value >= props.egg.hatchTime) {
      markReady(props.egg);
    }
  }
};

onMounted(() => {
  timer = setInterval(() => {
    now.value = Date.now();
    checkStatus();
  }, 1000);
});

onUnmounted(() => {
  clearInterval(timer);
});

const isLimitReached = computed(
  () => activeIncubationCount.value >= MAX_INCUBATION_SLOTS
);

const timeLeft = computed(() => {
  if (!props.egg || !props.egg.hatchTime) return 0;
  return Math.max(0, props.egg.hatchTime - now.value);
});

const progress = computed(() => {
  if (!props.egg || props.egg.status !== "incubating") return 0;
  const total = props.egg.incubationDuration || 300000; // Default 5m
  const elapsed = total - timeLeft.value;
  return Math.min(100, (elapsed / total) * 100);
});

const formattedTime = computed(() => {
  const seconds = Math.floor((timeLeft.value / 1000) % 60);
  const minutes = Math.floor(timeLeft.value / 1000 / 60);
  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
});

const startIncubation = async () => {
  if (props.egg && !isLimitReached.value) {
    await incubateEgg(props.egg);
  }
};

const isHatching = ref(false);

const handleHatch = async () => {
  if (props.egg && !isHatching.value) {
    isHatching.value = true;
    // Simple delay for effect
    setTimeout(async () => {
      const pet = await hatchEgg(props.egg!);
      hatchedPet.value = pet;
      isHatching.value = false;
    }, 1500); // 1.5s delay for shake/animation
  }
};

const closeAndReset = () => {
  hatchedPet.value = null;
  emit("close");
};

const getEggColorClass = (rarity: string) => {
  switch (rarity) {
    case "divine":
      return "text-black drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] stroke-white stroke-[0.5]";
    case "mythic":
      return "text-red-500 drop-shadow-[0_0_12px_rgba(239,68,68,0.8)]";
    case "legendary":
      return "text-orange-400 drop-shadow-[0_0_10px_rgba(251,146,60,0.8)]";
    case "epic":
      return "text-purple-500 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]";
    case "rare":
      return "text-blue-400 drop-shadow-[0_0_6px_rgba(96,165,250,0.8)]";
    case "uncommon":
      return "text-lime-500 drop-shadow-[0_0_4px_rgba(132,204,22,0.6)]";
    default:
      return "text-gray-200 drop-shadow-[0_0_2px_rgba(255,255,255,0.2)]";
  }
};
</script>

<template>
  <div
    v-if="isOpen && (egg || hatchedPet)"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 transition-all duration-300"
  >
    <div
      class="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md p-6 relative overflow-hidden flex flex-col items-center min-h-[400px] shadow-2xl transition-all duration-300 transform scale-100"
    >
      <!-- HATCHED RESULT VIEW -->
      <div
        v-if="hatchedPet"
        class="flex flex-col items-center gap-6 animate-fade-in w-full h-full justify-center"
      >
        <!-- Decor Blob -->
        <div
          class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-green-500/20 rounded-full blur-3xl animate-pulse"
        ></div>

        <h2 class="text-3xl font-black text-white neon-text animate-bounce-in">
          IT'S A {{ hatchedPet.type.toUpperCase() }}!
        </h2>

        <div class="text-6xl animate-pop-in">
          <!-- Placeholder Icon based on type or just a generic pet icon -->
          👾
        </div>

        <div class="text-center space-y-2 relative z-10 animate-slide-up">
          <p class="text-2xl font-bold text-[var(--neon-green)]">
            {{ hatchedPet.name }}
          </p>
          <p class="text-gray-400 capitalize">{{ hatchedPet.rarity }} Pet</p>
        </div>

        <button
          @click="closeAndReset"
          class="mt-8 px-8 py-3 bg-white text-black font-bold rounded-full hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,255,255,0.4)] hover:shadow-[0_0_30px_rgba(255,255,255,0.6)] cursor-pointer"
        >
          Awesome!
        </button>
      </div>

      <!-- INCUBATOR VIEW -->
      <div v-else class="flex flex-col items-center gap-6 z-10 relative w-full">
        <!-- Decor Blob -->
        <div
          class="absolute -top-10 -right-10 w-40 h-40 bg-purple-600/20 rounded-full blur-3xl z-[-1]"
        ></div>

        <!-- Close Button -->
        <button
          @click="$emit('close')"
          class="absolute -top-2 -right-2 text-gray-400 hover:text-white p-2 active:scale-90 transition-transform cursor-pointer"
        >
          ✕
        </button>

        <h2 class="text-2xl font-bold text-white neon-text">Incubator</h2>

        <!-- Large Egg Display -->
        <div class="w-40 h-40 flex items-center justify-center relative">
          <div
            v-if="egg?.status === 'incubating'"
            class="absolute inset-0 border-4 border-dashed border-purple-500/30 rounded-full animate-spin-slow"
          ></div>

          <svg
            viewBox="0 0 256 256"
            class="w-32 h-32 drop-shadow-2xl transition-all duration-300"
            :class="[
              egg?.status === 'incubating' || isHatching
                ? 'animate-pulse-fast scale-110'
                : 'egg-shake',
            ]"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g transform="translate(-36.9,-58.0)">
              <g transform="matrix(0.75102,0,0,0.75102,-4.5037,-10.766)">
                <g transform="matrix(0.656,0,0,0.656,-121.4,-239.3)">
                  <path
                    d="m 717.14,823.8 c 1.12,105.96 -68.16,197.1 -184.29,197.1 -116.12,0 -193.62,-60.06 -192.85,-205.67 0.75,-145.94 96.77,-306.47 184.28,-308.57 93.35,-2.31 191.19,155.92 192.86,317.14 z"
                    style="
                      fill-rule: evenodd;
                      stroke: #000000;
                      stroke-width: 5;
                      stroke-linecap: round;
                      stroke-linejoin: round;
                    "
                    :class="getEggColorClass(egg?.rarity || 'common')"
                    fill="currentColor"
                  />
                  <path
                    style="fill: black; fill-opacity: 0.25; fill-rule: evenodd"
                    d="m 651.28,624.06 c -5.83,1.31 -2.42,9.29 -0.69,13 23.63,65.18 34,137.07 21,205.98 -14.39,63.4 -60.88,120.71 -123.6,140.81 -26.22,9.1 -54.32,11.1 -81.87,11.04 -4.47,1.82 -2.54,7.71 1.76,8.21 54.16,15.3 116.15,12.4 164.2,-19 47.68,-31.7 74.44,-88.89 75.5,-145.41 2.6,-57.93 -10.88,-115.44 -31.62,-169.2 -6.37,-15.49 -12.98,-31.13 -22.55,-44.93 -0.59,-0.49 -1.39,-0.67 -2.13,-0.5 z"
                  />
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

        <!-- Info -->
        <div class="text-center" v-if="!isHatching">
          <p class="text-gray-400 text-sm uppercase tracking-widest">
            {{ egg?.rarity || "Unknown" }} Egg
          </p>
          <p v-if="egg?.status === 'new'" class="text-xs text-gray-500 mt-1">
            Ready for Incubation
          </p>
        </div>
        <div v-else class="text-center animate-pulse">
          <p class="text-purple-400 text-lg font-bold">HATCHING...</p>
        </div>

        <!-- ACTION AREA -->

        <!-- CASE 1: New Egg -->
        <div v-if="egg?.status === 'new'" class="w-full">
          <button
            @click="startIncubation"
            :disabled="isLimitReached"
            :class="[
              'w-full py-3 rounded-lg font-bold text-white transition-all active:scale-95',
              isLimitReached
                ? 'bg-gray-700 cursor-not-allowed text-gray-400'
                : 'bg-purple-600 hover:bg-purple-500 shadow-lg shadow-purple-900/50 hover:shadow-purple-500/30 cursor-pointer',
            ]"
          >
            {{
              isLimitReached
                ? `Incubators Full (${MAX_INCUBATION_SLOTS}/${MAX_INCUBATION_SLOTS})`
                : "Start Incubation"
            }}
          </button>
          <p
            v-if="isLimitReached"
            class="text-xs text-red-400 text-center mt-2"
          >
            Finish incubating other eggs first!
          </p>
        </div>

        <!-- CASE 2: Incubating -->
        <div v-if="egg?.status === 'incubating'" class="w-full space-y-2">
          <div class="flex justify-between text-sm text-purple-300">
            <span>Time Remaining</span>
            <span class="font-mono">{{ formattedTime }}</span>
          </div>
          <!-- Progress Bar -->
          <div
            class="h-4 bg-black/50 rounded-full overflow-hidden border border-purple-900/50"
          >
            <div
              class="h-full bg-gradient-to-r from-purple-600 to-pink-500 transition-all duration-1000 ease-linear"
              :style="{ width: `${progress}%` }"
            ></div>
          </div>
          <p class="text-center text-xs text-gray-500 mt-2">Incubating...</p>

          <button
            @click="fastForwardEgg(egg!)"
            class="w-full text-xs text-red-500 hover:text-red-400 font-mono mt-4 underline opacity-50 hover:opacity-100 cursor-pointer"
          >
            [DEV] FINISH NOW
          </button>
        </div>

        <!-- CASE 3: Ready -->
        <button
          v-if="egg?.status === 'ready' && !isHatching"
          @click="handleHatch"
          class="w-full py-3 bg-green-500 hover:bg-green-400 rounded-lg font-bold text-black shadow-lg shadow-green-900/50 animate-bounce active:scale-95 active:bg-green-600 transition-all cursor-pointer"
        >
          HATCH NOW!
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.neon-text {
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
}
.egg-shake {
  animation: egg-shake 3s infinite ease-in-out;
}
.animate-spin-slow {
  animation: spin 10s linear infinite;
}
.animate-pulse-slow {
  animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes egg-shake {
  0%,
  100% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(-5deg);
  }
  75% {
    transform: rotate(5deg);
  }
}
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
