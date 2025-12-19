<script setup lang="ts">
import { computed } from "vue";
import { useStressStore } from "@/stores/stress.store";
import { useI18n } from "@/modules/i18n";

const { t } = useI18n();
const stress = useStressStore();

/**
 * Planet evolution stage based on stress level
 * 0-40%: Peaceful (calm blue planet)
 * 40-70%: Developing (city lights appear)
 * 70-90%: Industrialized (warming, orange tones)
 * 90-100%: Critical (red, shaking)
 * >100%: Explosion!
 */
const planetStage = computed(() => {
  if (stress.isOverflow) return "exploding";
  if (stress.loadPercentage >= 90) return "critical";
  if (stress.loadPercentage >= 70) return "industrial";
  if (stress.loadPercentage >= 40) return "developing";
  return "peaceful";
});

/**
 * Planet base color based on stage
 */
const planetColors = computed(() => {
  switch (planetStage.value) {
    case "exploding":
      return {
        primary: "#ff4444",
        secondary: "#ff8800",
        glow: "rgba(255, 68, 68, 0.8)",
        atmosphere: "rgba(255, 100, 50, 0.4)",
      };
    case "critical":
      return {
        primary: "#ff6b35",
        secondary: "#ff8855",
        glow: "rgba(255, 107, 53, 0.6)",
        atmosphere: "rgba(255, 140, 50, 0.3)",
      };
    case "industrial":
      return {
        primary: "#f5a623",
        secondary: "#f7c94c",
        glow: "rgba(245, 166, 35, 0.4)",
        atmosphere: "rgba(255, 200, 100, 0.2)",
      };
    case "developing":
      return {
        primary: "#4ecdc4",
        secondary: "#45b7aa",
        glow: "rgba(78, 205, 196, 0.3)",
        atmosphere: "rgba(100, 200, 255, 0.2)",
      };
    default:
      return {
        primary: "#06b6d4",
        secondary: "#0ea5e9",
        glow: "rgba(6, 182, 212, 0.3)",
        atmosphere: "rgba(100, 150, 255, 0.15)",
      };
  }
});

/**
 * Animation classes based on stage
 */
const animationClass = computed(() => {
  switch (planetStage.value) {
    case "exploding":
      return "animate-explode";
    case "critical":
      return "animate-shake";
    case "industrial":
      return "animate-pulse-slow";
    default:
      return "";
  }
});

/**
 * City lights opacity (increases with development)
 */
const cityLightsOpacity = computed(() => {
  if (stress.loadPercentage < 40) return 0;
  if (stress.loadPercentage < 70) return 0.3;
  if (stress.loadPercentage < 90) return 0.6;
  return 0.9;
});

const statusText = computed(() => {
  if (stress.isOverflow) return t("gauge.overload");
  if (stress.loadPercentage >= 80) return t("gauge.heavy");
  return t("gauge.normal");
});
</script>

<template>
  <div class="flex flex-col items-center justify-center p-6 space-y-4">
    <!-- Planet Container -->
    <div class="relative w-52 h-52" :class="animationClass">
      <!-- Atmosphere Glow -->
      <div
        class="absolute inset-0 rounded-full transition-all duration-700"
        :style="{
          background: `radial-gradient(circle, ${planetColors.atmosphere} 0%, transparent 70%)`,
          transform: 'scale(1.3)',
          filter: 'blur(20px)',
        }"
      ></div>

      <!-- Outer Glow Ring -->
      <div
        class="absolute inset-0 rounded-full transition-all duration-500"
        :style="{
          boxShadow: `0 0 40px ${planetColors.glow}, 0 0 80px ${planetColors.glow}`,
        }"
      ></div>

      <!-- Planet Body -->
      <div
        class="absolute inset-4 rounded-full overflow-hidden transition-all duration-700"
        :style="{
          background: `
            radial-gradient(circle at 30% 25%, rgba(255,255,255,0.3) 0%, transparent 40%),
            radial-gradient(circle at 70% 70%, rgba(0,0,0,0.4) 0%, transparent 50%),
            linear-gradient(135deg, ${planetColors.primary} 0%, ${planetColors.secondary} 100%)
          `,
          boxShadow: `
            inset -8px -8px 30px rgba(0,0,0,0.5),
            inset 4px 4px 20px rgba(255,255,255,0.1)
          `,
        }"
      >
        <!-- Surface Texture / Continents -->
        <div
          class="absolute inset-0 opacity-40"
          style="
            background:
              radial-gradient(
                circle at 25% 35%,
                rgba(255, 255, 255, 0.4) 0%,
                transparent 20%
              ),
              radial-gradient(
                circle at 60% 30%,
                rgba(255, 255, 255, 0.3) 0%,
                transparent 15%
              ),
              radial-gradient(
                circle at 45% 65%,
                rgba(255, 255, 255, 0.35) 0%,
                transparent 18%
              ),
              radial-gradient(
                circle at 70% 60%,
                rgba(255, 255, 255, 0.25) 0%,
                transparent 12%
              );
          "
        ></div>

        <!-- City Lights (Night Side) -->
        <div
          class="absolute inset-0 transition-opacity duration-700"
          :style="{ opacity: cityLightsOpacity }"
        >
          <div
            class="absolute w-1 h-1 rounded-full bg-yellow-300 animate-twinkle"
            style="top: 35%; left: 25%; animation-delay: 0s"
          ></div>
          <div
            class="absolute w-1.5 h-1.5 rounded-full bg-orange-300 animate-twinkle"
            style="top: 45%; left: 30%; animation-delay: 0.5s"
          ></div>
          <div
            class="absolute w-1 h-1 rounded-full bg-yellow-200 animate-twinkle"
            style="top: 55%; left: 35%; animation-delay: 1s"
          ></div>
          <div
            class="absolute w-2 h-2 rounded-full bg-orange-400 animate-twinkle"
            style="top: 40%; left: 40%; animation-delay: 0.3s"
          ></div>
          <div
            class="absolute w-1 h-1 rounded-full bg-yellow-300 animate-twinkle"
            style="top: 60%; left: 45%; animation-delay: 0.8s"
          ></div>
          <div
            class="absolute w-1.5 h-1.5 rounded-full bg-red-400 animate-twinkle"
            style="top: 50%; left: 50%; animation-delay: 0.2s"
          ></div>
        </div>

        <!-- Fire/Explosion Effects (Critical/Exploding) -->
        <div
          v-if="planetStage === 'critical' || planetStage === 'exploding'"
          class="absolute inset-0"
        >
          <!-- Magma Cracks -->
          <div
            class="absolute inset-0 opacity-60"
            style="
              background: repeating-linear-gradient(
                45deg,
                transparent,
                transparent 10px,
                rgba(255, 100, 0, 0.3) 10px,
                rgba(255, 100, 0, 0.3) 12px
              );
            "
          ></div>
          <!-- Fire Spots -->
          <div
            class="absolute w-3 h-3 rounded-full bg-orange-500 animate-pulse"
            style="top: 30%; left: 60%; filter: blur(2px)"
          ></div>
          <div
            class="absolute w-2 h-2 rounded-full bg-red-500 animate-pulse"
            style="top: 50%; left: 70%; filter: blur(1px)"
          ></div>
          <div
            class="absolute w-4 h-4 rounded-full bg-yellow-500 animate-pulse"
            style="top: 65%; left: 55%; filter: blur(3px)"
          ></div>
        </div>

        <!-- Explosion Particles -->
        <div v-if="planetStage === 'exploding'" class="absolute inset-0">
          <div
            class="absolute w-2 h-2 bg-orange-400 rounded-full animate-explosion-particle"
            style="top: 50%; left: 50%; --angle: 0deg"
          ></div>
          <div
            class="absolute w-2 h-2 bg-red-500 rounded-full animate-explosion-particle"
            style="top: 50%; left: 50%; --angle: 45deg"
          ></div>
          <div
            class="absolute w-3 h-3 bg-yellow-400 rounded-full animate-explosion-particle"
            style="top: 50%; left: 50%; --angle: 90deg"
          ></div>
          <div
            class="absolute w-2 h-2 bg-orange-500 rounded-full animate-explosion-particle"
            style="top: 50%; left: 50%; --angle: 135deg"
          ></div>
          <div
            class="absolute w-2 h-2 bg-red-400 rounded-full animate-explosion-particle"
            style="top: 50%; left: 50%; --angle: 180deg"
          ></div>
          <div
            class="absolute w-3 h-3 bg-yellow-500 rounded-full animate-explosion-particle"
            style="top: 50%; left: 50%; --angle: 225deg"
          ></div>
          <div
            class="absolute w-2 h-2 bg-orange-400 rounded-full animate-explosion-particle"
            style="top: 50%; left: 50%; --angle: 270deg"
          ></div>
          <div
            class="absolute w-2 h-2 bg-red-500 rounded-full animate-explosion-particle"
            style="top: 50%; left: 50%; --angle: 315deg"
          ></div>
        </div>

        <!-- Percentage Display -->
        <div class="absolute inset-0 flex items-center justify-center">
          <div
            class="text-center"
            style="text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5)"
          >
            <span
              class="text-4xl font-black tabular-nums text-white"
              :class="{ 'animate-pulse': planetStage === 'exploding' }"
            >
              {{ stress.loadPercentage }}
            </span>
            <span class="text-sm font-bold text-white/70">%</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Status Text -->
    <div class="text-center space-y-1">
      <h3
        class="text-xl font-bold tracking-tight transition-colors duration-500"
        :style="{ color: planetColors.primary }"
      >
        {{ statusText }}
      </h3>
      <p class="text-sm text-zinc-400 font-mono">
        <span class="text-zinc-300">{{ stress.currentLoad }}</span>
        <span class="text-zinc-600"> / </span>
        <span>{{ stress.dailyLimit }}</span>
        <span class="text-zinc-500 ml-1">{{ t("gauge.points") }}</span>
      </p>
    </div>
  </div>
</template>

<style scoped>
/* Orbiting Moon */
@keyframes orbit-moon {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-orbit-moon {
  animation: orbit-moon 12s linear infinite;
}

/* Twinkling City Lights */
@keyframes twinkle {
  0%,
  100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
}

.animate-twinkle {
  animation: twinkle 2s ease-in-out infinite;
}

/* Slow Pulse for Industrial Stage */
@keyframes pulse-slow {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.02);
  }
}

.animate-pulse-slow {
  animation: pulse-slow 3s ease-in-out infinite;
}

/* Shake for Critical Stage */
@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  10%,
  30%,
  50%,
  70%,
  90% {
    transform: translateX(-2px);
  }
  20%,
  40%,
  60%,
  80% {
    transform: translateX(2px);
  }
}

.animate-shake {
  animation: shake 0.5s ease-in-out infinite;
}

/* Explosion Animation */
@keyframes explode {
  0%,
  100% {
    transform: scale(1);
    filter: brightness(1);
  }
  25% {
    transform: scale(1.05);
    filter: brightness(1.3);
  }
  50% {
    transform: scale(0.98);
    filter: brightness(1.5);
  }
  75% {
    transform: scale(1.03);
    filter: brightness(1.2);
  }
}

.animate-explode {
  animation: explode 0.3s ease-in-out infinite;
}

/* Explosion Particles */
@keyframes explosion-particle {
  0% {
    transform: rotate(var(--angle)) translateY(0) scale(1);
    opacity: 1;
  }
  100% {
    transform: rotate(var(--angle)) translateY(-60px) scale(0);
    opacity: 0;
  }
}

.animate-explosion-particle {
  animation: explosion-particle 1s ease-out infinite;
}
</style>
