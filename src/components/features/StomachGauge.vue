<script setup lang="ts">
import { computed } from "vue";
import { useMetabolismStore } from "@/stores/metabolism.store";
import { useI18n } from "@/modules/i18n";

const { t } = useI18n();
const metabolism = useMetabolismStore();

// Dynamic Color Logic
const gaugeColor = computed(() => {
  if (metabolism.isOverflow) return "#ef4444"; // Red-500
  if (metabolism.loadPercentage >= 80) return "#f59e0b"; // Amber-500
  return "#4ade80"; // Green-400
});

// SVG Path for the thermometer/gauge liquid
const fillHeight = computed(() => {
  const pct = Math.min(metabolism.loadPercentage, 100);
  return `${pct}%`;
});

const statusText = computed(() => {
  if (metabolism.isOverflow) return t("gauge.overload");
  if (metabolism.loadPercentage >= 80) return t("gauge.heavy");
  return t("gauge.normal");
});
</script>

<template>
  <div class="flex flex-col items-center justify-center p-6 space-y-4">
    <!-- The Gauge Visual -->
    <div
      class="relative w-32 h-64 bg-zinc-900 rounded-full border-4 border-zinc-700 overflow-hidden shadow-inner"
    >
      <!-- Background tick marks -->
      <div
        class="absolute inset-x-0 bottom-0 h-full w-full opacity-20"
        style="
          background-image: linear-gradient(
            to bottom,
            transparent 50%,
            #71717a 50%
          );
          background-size: 100% 20px;
        "
      ></div>

      <!-- The Liquid -->
      <div
        class="absolute bottom-0 inset-x-0 transition-all duration-700 ease-out flex items-start justify-center"
        :style="{ height: fillHeight, backgroundColor: gaugeColor }"
        :class="{ 'animate-pulse': metabolism.isOverflow }"
      >
        <!-- Bubbles / Texture -->
        <div class="w-full h-2 bg-white/20"></div>
      </div>

      <!-- Percentage Text Overlay -->
      <div
        class="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <span
          class="text-3xl font-black drop-shadow-md tabular-nums"
          :class="metabolism.isOverflow ? 'text-white' : 'text-zinc-100'"
        >
          {{ metabolism.loadPercentage
          }}<span class="text-base font-bold text-zinc-400">%</span>
        </span>
      </div>
    </div>

    <!-- Status Text -->
    <div class="text-center space-y-1">
      <h3
        class="text-xl font-bold tracking-tight"
        :style="{ color: gaugeColor }"
      >
        {{ statusText }}
      </h3>
      <p class="text-sm text-zinc-500 font-mono">
        {{ metabolism.currentLoad }} / {{ metabolism.dailyLimit }}
        {{ t("gauge.points") }}
      </p>
    </div>
  </div>
</template>
