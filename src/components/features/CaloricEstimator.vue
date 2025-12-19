<script setup lang="ts">
import { useI18n } from "@/modules/i18n";

const { locale } = useI18n();

const emit = defineEmits<{
  (e: "select", points: number): void;
  (e: "close"): void;
}>();

const options = [
  {
    label: "輕微",
    labelEn: "Light",
    points: 1,
    desc: "快速處理 (5-15分鐘)",
    descEn: "Quick (5-15 min)",
    colorClass: "option-light",
  },
  {
    label: "中等",
    labelEn: "Medium",
    points: 3,
    desc: "需要專注 (30-60分鐘)",
    descEn: "Focused (30-60 min)",
    colorClass: "option-medium",
  },
  {
    label: "沉重",
    labelEn: "Heavy",
    points: 5,
    desc: "耗時費力 (2-4小時)",
    descEn: "Demanding (2-4 hours)",
    colorClass: "option-heavy",
  },
  {
    label: "爆量",
    labelEn: "Extreme",
    points: 8,
    desc: "極度耗能 / 風險高",
    descEn: "Exhausting / High Risk",
    colorClass: "option-extreme",
  },
];
</script>

<template>
  <div
    class="fixed inset-0 z-40 backdrop-blur-sm flex items-center justify-center p-4"
    style="
      background: linear-gradient(
        180deg,
        rgba(10, 10, 20, 0.95) 0%,
        rgba(26, 10, 42, 0.92) 100%
      );
    "
    @click.self="emit('close')"
  >
    <!-- Nebula Glow -->
    <div
      class="absolute top-1/3 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full pointer-events-none"
      style="
        background: radial-gradient(
          circle,
          rgba(139, 92, 246, 0.15) 0%,
          transparent 70%
        );
        filter: blur(60px);
      "
    ></div>

    <div
      class="estimator-panel rounded-xl p-6 w-full max-w-sm shadow-2xl animate-in fade-in zoom-in-95 duration-200"
    >
      <h3 class="text-lg font-bold mb-4 gradient-text">
        {{ locale === "zh-TW" ? "預估壓力成本" : "Estimate Stress Cost" }}
      </h3>

      <div class="space-y-3">
        <button
          v-for="opt in options"
          :key="opt.points"
          @click="emit('select', opt.points)"
          class="estimator-option w-full flex items-center justify-between p-4 rounded-lg border transition-all active:scale-95"
          :class="opt.colorClass"
        >
          <div class="flex flex-col items-start">
            <span class="font-bold text-lg">{{
              locale === "zh-TW" ? opt.label : opt.labelEn
            }}</span>
            <span class="text-xs opacity-75">{{
              locale === "zh-TW" ? opt.desc : opt.descEn
            }}</span>
          </div>
          <span class="text-xl font-mono font-black">{{ opt.points }}</span>
        </button>
      </div>

      <button
        @click="emit('close')"
        class="mt-6 w-full py-3 text-zinc-500 hover:text-white transition-colors text-sm rounded-lg"
        style="border: 1px solid var(--glass-border)"
      >
        {{ locale === "zh-TW" ? "取消" : "Cancel" }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.estimator-panel {
  background: rgba(15, 15, 26, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--glass-border);
  box-shadow:
    0 25px 50px rgba(0, 0, 0, 0.5),
    0 0 30px rgba(139, 92, 246, 0.1);
}

.estimator-option {
  background: var(--glass-bg);
}

.estimator-option:hover {
  transform: translateY(-2px);
}

/* Light - Cyan */
.option-light {
  border-color: rgba(6, 182, 212, 0.4);
  color: var(--nebula-cyan);
}
.option-light:hover {
  background: rgba(6, 182, 212, 0.1);
  box-shadow: 0 0 20px rgba(6, 182, 212, 0.3);
}

/* Medium - Blue/Purple */
.option-medium {
  border-color: rgba(99, 102, 241, 0.4);
  color: #818cf8;
}
.option-medium:hover {
  background: rgba(99, 102, 241, 0.1);
  box-shadow: 0 0 20px rgba(99, 102, 241, 0.3);
}

/* Heavy - Purple/Violet */
.option-heavy {
  border-color: rgba(139, 92, 246, 0.4);
  color: var(--nebula-violet);
}
.option-heavy:hover {
  background: rgba(139, 92, 246, 0.1);
  box-shadow: 0 0 20px rgba(139, 92, 246, 0.3);
}

/* Extreme - Pink */
.option-extreme {
  border-color: rgba(236, 72, 153, 0.4);
  color: var(--nebula-pink);
}
.option-extreme:hover {
  background: rgba(236, 72, 153, 0.1);
  box-shadow: 0 0 20px rgba(236, 72, 153, 0.3);
}
</style>
