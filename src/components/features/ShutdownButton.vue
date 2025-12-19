<script setup lang="ts">
import { ref } from "vue";
import { useTaskStore } from "@/stores/task.store";
import { useMetabolismStore } from "@/stores/metabolism.store";
import { useAnalyticsStore } from "@/stores/analytics.store";
import { sensory } from "@/modules/sensory";
import { useI18n } from "@/modules/i18n";

const { t } = useI18n();
const taskStore = useTaskStore();
const metabolism = useMetabolismStore();
const analytics = useAnalyticsStore();

const showModal = ref(false);

const openShutdown = () => {
  showModal.value = true;
};

const cancel = () => {
  showModal.value = false;
};

const confirmShutdown = async () => {
  sensory.play("complete");
  await taskStore.archiveCompleted();
  metabolism.dailyReset();
  showModal.value = false;
};
</script>

<template>
  <!-- Fixed Shutdown Button (next to trophy) -->
  <button
    v-if="!showModal"
    @click="openShutdown"
    class="shutdown-btn fixed top-4 right-[8rem] z-50 p-3 rounded-full shadow-xl transition-all group hover:scale-105"
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
      class="text-zinc-400 group-hover:text-pink-400 transition-colors"
    >
      <path d="M12 2v10" />
      <path d="M18.4 6.6a9 9 0 1 1-12.77.04" />
    </svg>
  </button>

  <!-- Modal -->
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
        v-if="showModal"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/95 backdrop-blur-sm"
      >
        <!-- Close Button (same position as shutdown button) -->
        <button
          @click="cancel"
          class="fixed top-4 right-[8rem] z-50 p-3 bg-zinc-800 hover:bg-zinc-700 rounded-full text-zinc-400 hover:text-white transition-all border border-zinc-700"
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

        <div
          class="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-2xl p-8 space-y-8 relative overflow-hidden text-center"
        >
          <!-- Background Glow -->
          <div
            class="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-red-500/20 blur-3xl rounded-full pointer-events-none"
          ></div>

          <div class="relative z-10 space-y-2">
            <h2
              class="text-3xl font-black text-white uppercase tracking-tighter"
            >
              {{ t("shutdown.title") }}
            </h2>
            <p class="text-zinc-500 font-mono text-xs">
              {{ t("shutdown.subtitle") }}
            </p>
          </div>

          <div class="py-8 space-y-4">
            <div v-if="analytics.currentLog" class="space-y-1">
              <div
                class="text-6xl font-black text-white tabular-nums tracking-tighter"
              >
                {{ analytics.currentLog.totalPoints }}
              </div>
              <div
                class="text-zinc-500 text-xs font-bold uppercase tracking-widest"
              >
                {{ t("shutdown.todayPoints") }}
              </div>
            </div>
            <div v-else class="text-zinc-500">{{ t("analytics.noData") }}</div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <button
              @click="cancel"
              data-close-modal
              class="py-4 rounded-xl border border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all font-bold"
            >
              {{ t("shutdown.cancel") }}
            </button>
            <button
              @click="confirmShutdown"
              class="py-4 rounded-xl bg-red-600 text-white hover:bg-red-500 shadow-lg shadow-red-900/50 transition-all font-black"
            >
              {{ t("shutdown.confirm") }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
