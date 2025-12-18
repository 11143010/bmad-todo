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
    color: "bg-green-500/20 text-green-400 border-green-500/50",
  },
  {
    label: "中等",
    labelEn: "Medium",
    points: 3,
    desc: "需要專注 (30-60分鐘)",
    descEn: "Focused (30-60 min)",
    color: "bg-blue-500/20 text-blue-400 border-blue-500/50",
  },
  {
    label: "沉重",
    labelEn: "Heavy",
    points: 5,
    desc: "耗時費力 (2-4小時)",
    descEn: "Demanding (2-4 hours)",
    color: "bg-amber-500/20 text-amber-400 border-amber-500/50",
  },
  {
    label: "爆量",
    labelEn: "Extreme",
    points: 8,
    desc: "極度耗能 / 風險高",
    descEn: "Exhausting / High Risk",
    color: "bg-red-500/20 text-red-400 border-red-500/50",
  },
];
</script>

<template>
  <div
    class="fixed inset-0 z-40 bg-zinc-950/80 backdrop-blur-sm flex items-center justify-center p-4"
    @click.self="emit('close')"
  >
    <div
      class="bg-zinc-900 border border-zinc-700 rounded-xl p-6 w-full max-w-sm shadow-2xl animate-in fade-in zoom-in-95 duration-200"
    >
      <h3 class="text-lg font-bold text-white mb-4">
        {{ locale === "zh-TW" ? "預估壓力成本" : "Estimate Stress Cost" }}
      </h3>

      <div class="space-y-3">
        <button
          v-for="opt in options"
          :key="opt.points"
          @click="emit('select', opt.points)"
          class="w-full flex items-center justify-between p-4 rounded-lg border transition-all hover:brightness-110 active:scale-95"
          :class="opt.color"
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
        class="mt-6 w-full py-3 text-zinc-500 hover:text-white transition-colors text-sm"
      >
        {{ locale === "zh-TW" ? "取消" : "Cancel" }}
      </button>
    </div>
  </div>
</template>
