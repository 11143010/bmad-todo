<script setup lang="ts">
import { computed } from "vue";
import { useMetabolismStore } from "@/stores/metabolism.store";
import { useI18n } from "@/modules/i18n";

const { t } = useI18n();
const metabolism = useMetabolismStore();

/**
 * Get the gauge color based on load percentage
 */
const gaugeColor = computed(() => {
  if (metabolism.isOverflow) return "var(--nebula-pink)";
  if (metabolism.loadPercentage >= 80) return "var(--nebula-violet)";
  return "var(--nebula-cyan)";
});

/**
 * Calculate the stroke dash offset for the circular gauge
 */
const strokeDashoffset = computed(() => {
  const circumference = 2 * Math.PI * 90; // radius = 90
  const pct = Math.min(metabolism.loadPercentage, 100) / 100;
  return circumference * (1 - pct);
});

const circumference = 2 * Math.PI * 90;

const statusText = computed(() => {
  if (metabolism.isOverflow) return t("gauge.overload");
  if (metabolism.loadPercentage >= 80) return t("gauge.heavy");
  return t("gauge.normal");
});

/**
 * Dynamic glow intensity based on load
 */
const glowIntensity = computed(() => {
  if (metabolism.isOverflow) return "0 0 60px rgba(236, 72, 153, 0.6)";
  if (metabolism.loadPercentage >= 80)
    return "0 0 40px rgba(168, 85, 247, 0.5)";
  return "0 0 30px rgba(6, 182, 212, 0.4)";
});
</script>

<template>
  <div class="flex flex-col items-center justify-center p-6 space-y-4">
    <!-- Cosmic Circular Gauge -->
    <div class="relative w-52 h-52">
      <!-- Outer Glow Ring -->
      <div
        class="absolute inset-0 rounded-full animate-pulse-glow opacity-50"
        :style="{ boxShadow: glowIntensity }"
      ></div>

      <!-- SVG Gauge -->
      <svg class="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
        <!-- Background Circle (Track) -->
        <circle
          cx="100"
          cy="100"
          r="90"
          fill="none"
          stroke="rgba(255, 255, 255, 0.05)"
          stroke-width="8"
        />

        <!-- Orbital Decoration -->
        <circle
          cx="100"
          cy="100"
          r="80"
          fill="none"
          stroke="rgba(255, 255, 255, 0.03)"
          stroke-width="1"
          stroke-dasharray="4 4"
          class="animate-orbit"
        />

        <!-- Progress Circle (Aurora Gradient) -->
        <circle
          cx="100"
          cy="100"
          r="90"
          fill="none"
          stroke="url(#gaugeGradient)"
          stroke-width="8"
          stroke-linecap="round"
          :stroke-dasharray="circumference"
          :stroke-dashoffset="strokeDashoffset"
          class="transition-all duration-700 ease-out"
          style="filter: drop-shadow(0 0 8px currentColor)"
        />

        <!-- Gradient Definition -->
        <defs>
          <linearGradient
            id="gaugeGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stop-color="var(--nebula-cyan)" />
            <stop offset="50%" stop-color="var(--nebula-purple)" />
            <stop offset="100%" stop-color="var(--nebula-pink)" />
          </linearGradient>
        </defs>
      </svg>

      <!-- Center Content -->
      <div class="absolute inset-0 flex flex-col items-center justify-center">
        <!-- Planet/Core Visual -->
        <div
          class="w-28 h-28 rounded-full flex items-center justify-center"
          style="
            background:
              radial-gradient(
                circle at 30% 30%,
                rgba(255, 255, 255, 0.1) 0%,
                transparent 60%
              ),
              radial-gradient(
                circle,
                var(--space-light) 0%,
                var(--space-dark) 100%
              );
            box-shadow:
              inset 0 -4px 20px rgba(0, 0, 0, 0.5),
              inset 0 4px 10px rgba(255, 255, 255, 0.05);
          "
        >
          <!-- Percentage Display -->
          <div class="text-center">
            <span
              class="text-4xl font-black tabular-nums"
              :style="{ color: gaugeColor }"
            >
              {{ metabolism.loadPercentage }}
            </span>
            <span class="text-sm font-bold text-zinc-500">%</span>
          </div>
        </div>
      </div>

      <!-- Orbiting Dot -->
      <div
        class="absolute w-3 h-3 rounded-full animate-orbit"
        style="
          top: 50%;
          left: 50%;
          margin-top: -95px;
          margin-left: -6px;
          background: var(--nebula-cyan);
          box-shadow: 0 0 10px var(--nebula-cyan);
          transform-origin: 6px 95px;
          animation-duration: 15s;
        "
      ></div>
    </div>

    <!-- Status Text -->
    <div class="text-center space-y-1">
      <h3
        class="text-xl font-bold tracking-tight"
        :style="{ color: gaugeColor }"
      >
        {{ statusText }}
      </h3>
      <p class="text-sm text-zinc-400 font-mono">
        <span class="text-zinc-300">{{ metabolism.currentLoad }}</span>
        <span class="text-zinc-600"> / </span>
        <span>{{ metabolism.dailyLimit }}</span>
        <span class="text-zinc-500 ml-1">{{ t("gauge.points") }}</span>
      </p>
    </div>
  </div>
</template>

<style scoped>
@keyframes orbit {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-orbit {
  animation: orbit 20s linear infinite;
}
</style>
