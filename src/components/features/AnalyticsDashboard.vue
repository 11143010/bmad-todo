<script setup lang="ts">
import { ref, onMounted, computed, watch } from "vue";
import { useAnalyticsStore } from "@/stores/analytics.store";
import { storeToRefs } from "pinia";
import { getDB } from "@/modules/db";
import type { DailyLogDocType } from "@/modules/db/schemas/daily-log.schema";
import { useI18n } from "@/modules/i18n";

const { t, locale } = useI18n();

const analyticsStore = useAnalyticsStore();
const { currentLog } = storeToRefs(analyticsStore);

const weeklyLogs = ref<DailyLogDocType[]>([]);

watch(
  currentLog,
  () => {
    fetchWeeklyLogs();
  },
  { deep: true }
);

const fetchWeeklyLogs = async () => {
  const db = await getDB();
  const logs = await db.daily_logs
    .find({
      sort: [{ id: "desc" }],
      limit: 7,
    })
    .exec();

  // Reverse to show Chronological (Oldest -> Newest)
  weeklyLogs.value = [...logs].reverse();
};

onMounted(async () => {
  await analyticsStore.init();
  await fetchWeeklyLogs();
});

const maxPoints = computed(() => {
  if (weeklyLogs.value.length === 0) return 100;
  return Math.max(...weeklyLogs.value.map((l) => l.totalPoints)) * 1.2 || 100;
});

// Container height is h-48 = 192px. Leave room for label (~20px).
const CHART_HEIGHT = 160; // Max bar height in pixels

const getBarHeight = (points: number) => {
  const pct = points / maxPoints.value;
  const height = Math.max(4, Math.round(pct * CHART_HEIGHT)); // Min 4px so tiny bars are visible
  return `${height}px`;
};

const getDayLabel = (dateStr: string) => {
  const date = new Date(dateStr);
  const localeStr = locale.value === "zh-TW" ? "zh-TW" : "en-US";
  return new Intl.DateTimeFormat(localeStr, { weekday: "short" }).format(date);
};
</script>

<template>
  <div class="analytics-card space-y-6 p-4 rounded-xl">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="space-y-1">
        <h2 class="text-zinc-300 text-xs font-bold uppercase tracking-widest">
          {{ t("analytics.title") }}
        </h2>
        <div class="text-[10px] text-zinc-500 font-mono">
          {{ t("analytics.subtitle") }}
        </div>
      </div>
    </div>

    <!-- Chart Container -->
    <div class="h-48 flex items-end justify-between gap-2 relative">
      <!-- Grid Lines -->
      <div
        class="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20"
      >
        <div class="border-t border-zinc-700 w-full h-0"></div>
        <div class="border-t border-dashed border-zinc-700 w-full h-0"></div>
        <div class="border-t border-zinc-700 w-full h-0"></div>
      </div>

      <!-- Bars -->
      <div
        v-for="log in weeklyLogs"
        :key="log.id"
        class="flex flex-col items-center justify-end gap-2 group relative z-10"
        style="width: 40px"
      >
        <!-- Tooltip -->
        <div
          class="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-900 border border-zinc-800 p-2 rounded text-xs z-20 pointer-events-none whitespace-nowrap"
        >
          <div class="font-bold text-white">
            {{ log.totalPoints }} {{ t("analytics.points") }}
          </div>
          <div class="text-zinc-500">
            {{ log.tasksCompleted }} {{ t("analytics.tasks") }}
          </div>
          <div v-if="log.overloadCount" class="text-red-500">
            {{ log.overloadCount }} {{ t("analytics.overloads") }}
          </div>
        </div>

        <!-- Bar -->
        <div
          class="w-full rounded-lg relative overflow-hidden transition-all duration-500"
          :style="{
            height: getBarHeight(log.totalPoints),
            background:
              log.overloadCount > 0
                ? 'linear-gradient(to top, var(--nebula-pink), var(--nebula-violet))'
                : 'linear-gradient(to top, var(--nebula-cyan), var(--nebula-purple))',
            boxShadow:
              log.overloadCount > 0
                ? '0 0 15px rgba(236, 72, 153, 0.4)'
                : '0 0 15px rgba(6, 182, 212, 0.3)',
          }"
        >
          <!-- Shine effect -->
          <div
            class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
          ></div>
        </div>

        <!-- Label -->
        <div class="text-[10px] text-zinc-500 font-mono uppercase mt-1">
          {{ getDayLabel(log.id) }}
        </div>
      </div>

      <!-- Empty State if no logs -->
      <div
        v-if="weeklyLogs.length === 0"
        class="absolute inset-0 flex items-center justify-center text-zinc-700 text-sm font-mono"
      >
        {{ t("analytics.noData") }}
      </div>
    </div>

    <!-- Today's Summary -->
    <div
      v-if="currentLog"
      class="grid grid-cols-3 gap-4 border-t border-zinc-900 pt-6"
    >
      <div class="text-center">
        <div class="text-2xl font-black text-white">
          {{ currentLog.totalPoints }}
        </div>
        <div class="text-[10px] text-zinc-500 uppercase">
          {{ t("analytics.points") }}
        </div>
      </div>
      <div class="text-center">
        <div class="text-2xl font-black text-white">
          {{ currentLog.tasksCompleted }}
        </div>
        <div class="text-[10px] text-zinc-500 uppercase">
          {{ t("analytics.tasks") }}
        </div>
      </div>
      <div class="text-center">
        <div
          class="text-2xl font-black"
          :class="
            currentLog.overloadCount > 0 ? 'text-red-500' : 'text-zinc-600'
          "
        >
          {{ currentLog.overloadCount }}
        </div>
        <div class="text-[10px] text-zinc-500 uppercase">
          {{ t("analytics.overloads") }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.analytics-card {
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}
</style>
