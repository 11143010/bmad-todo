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

// Max tasks for chart scaling
const maxTasks = computed(() => {
  if (weeklyLogs.value.length === 0) return 10;
  return Math.max(...weeklyLogs.value.map((l) => l.tasksCompleted)) * 1.2 || 10;
});

// Container height is h-48 = 192px. Leave room for label (~20px).
const CHART_HEIGHT = 160;

const getBarHeight = (tasks: number) => {
  const pct = tasks / maxTasks.value;
  const height = Math.max(4, Math.round(pct * CHART_HEIGHT));
  return `${height}px`;
};

const getDayLabel = (dateStr: string) => {
  const date = new Date(dateStr);
  const localeStr = locale.value === "zh-TW" ? "zh-TW" : "en-US";
  return new Intl.DateTimeFormat(localeStr, { weekday: "short" }).format(date);
};

const selectedLog = ref<DailyLogDocType | null>(null);
const isDetailsOpen = ref(false);

const selectLog = (log: DailyLogDocType) => {
  selectedLog.value = log;
  isDetailsOpen.value = true;
};

const closeDetails = () => {
  isDetailsOpen.value = false;
};

// Auto-select today on load
watch(
  currentLog,
  (newLog) => {
    if (newLog && !selectedLog.value) {
      selectedLog.value = newLog;
    }
  },
  { immediate: true }
);

const formatTime = (timestamp: number) => {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
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
        @click="selectLog(log)"
        class="flex flex-col items-center justify-end gap-2 group relative z-10 cursor-pointer"
        style="width: 40px"
      >
        <!-- Tooltip -->
        <div
          class="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-900 border border-zinc-800 p-2 rounded text-xs z-20 pointer-events-none whitespace-nowrap"
        >
          <div class="font-bold text-white">
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
            height: getBarHeight(log.tasksCompleted),
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

          <!-- Selected Indicator -->
          <div
            v-if="selectedLog?.id === log.id"
            class="absolute inset-0 border-2 border-white/50 rounded-lg"
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
      class="grid grid-cols-2 gap-4 border-t border-zinc-900 pt-6 cursor-pointer hover:bg-white/5 transition-colors rounded-xl p-2"
      @click="selectLog(currentLog)"
    >
      <div class="text-center">
        <div class="text-3xl font-black text-white">
          {{ currentLog.tasksCompleted }}
        </div>
        <div class="text-[10px] text-zinc-500 uppercase">
          {{ t("analytics.tasks") }}
        </div>
      </div>
      <div class="text-center">
        <div
          class="text-3xl font-black"
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

    <!-- Detailed Records Modal -->
    <Teleport to="body">
      <div
        v-if="isDetailsOpen && selectedLog"
        class="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in"
        @click.self="closeDetails"
      >
        <div
          class="bg-[#1a1b26] border border-white/10 rounded-2xl w-full max-w-md max-h-[80vh] flex flex-col shadow-2xl overflow-hidden animate-slide-up"
        >
          <!-- Modal Header -->
          <div
            class="p-6 border-b border-white/5 flex items-center justify-between shrink-0"
          >
            <div class="space-y-1">
              <h3 class="text-white font-bold text-lg tracking-wide">
                {{ t("analytics.details") || "每日日誌詳情" }} //
                {{ selectedLog.id }}
              </h3>
              <p class="text-[10px] text-zinc-500 font-mono">
                {{ selectedLog.records?.length || 0 }} RECORDS
              </p>
            </div>
            <button
              @click="closeDetails"
              class="text-zinc-500 hover:text-white transition-colors cursor-pointer p-2"
            >
              ✕
            </button>
          </div>

          <!-- Scrollable List -->
          <div
            class="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar min-h-0"
          >
            <div
              v-for="(record, index) in selectedLog.records"
              :key="index"
              class="flex items-center justify-between p-4 rounded-xl bg-zinc-900/50 border border-white/5 hover:border-white/10 transition-colors group"
            >
              <div class="flex items-center gap-4">
                <span
                  class="text-xs font-mono text-zinc-500 group-hover:text-zinc-400 transition-colors"
                >
                  {{ formatTime(record.completedAt) }}
                </span>
                <div class="flex flex-col">
                  <span
                    class="font-medium text-sm"
                    :class="
                      record.type === 'overload'
                        ? 'text-red-400 font-bold'
                        : 'text-zinc-200'
                    "
                  >
                    {{ record.title }}
                  </span>
                  <span
                    v-if="record.type === 'overload'"
                    class="text-[10px] text-red-500/60 uppercase tracking-wider font-bold mt-0.5"
                  >
                    System Event
                  </span>
                </div>
              </div>

              <div
                v-if="record.type === 'task'"
                class="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-zinc-400 group-hover:bg-green-500/20 group-hover:text-green-400 transition-all shrink-0"
              >
                <span class="text-xs">✓</span>
              </div>
              <div v-else class="text-lg animate-pulse shrink-0">⚠️</div>
            </div>

            <div
              v-if="!selectedLog.records || selectedLog.records.length === 0"
              class="text-center py-12 text-zinc-600 text-sm italic"
            >
              {{ t("analytics.noRecords") }}
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.analytics-card {
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}
</style>
