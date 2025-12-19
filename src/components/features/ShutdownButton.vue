<script setup lang="ts">
import { ref } from "vue";
import { useTaskStore } from "@/stores/task.store";
import { useStressStore } from "@/stores/stress.store";
import { useAnalyticsStore } from "@/stores/analytics.store";
import { sensory } from "@/modules/sensory";
import { useI18n } from "@/modules/i18n";

const { t } = useI18n();
const taskStore = useTaskStore();
const stress = useStressStore();
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
  stress.dailyReset();
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
        class="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
        style="
          background: linear-gradient(
            180deg,
            rgba(10, 10, 20, 0.98) 0%,
            rgba(26, 10, 42, 0.95) 100%
          );
        "
      >
        <!-- Nebula Glow -->
        <div
          class="absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full pointer-events-none"
          style="
            background: radial-gradient(
              circle,
              rgba(139, 92, 246, 0.2) 0%,
              transparent 70%
            );
            filter: blur(60px);
          "
        ></div>

        <!-- Close Button -->
        <button
          @click="cancel"
          class="shutdown-btn fixed top-4 right-[8rem] z-50 p-3 rounded-full text-zinc-400 hover:text-white transition-all"
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
          class="shutdown-panel w-full max-w-sm rounded-2xl p-8 space-y-8 relative overflow-hidden text-center"
        >
          <!-- Background Glow -->
          <div
            class="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full pointer-events-none"
            style="
              background: radial-gradient(
                circle,
                rgba(139, 92, 246, 0.3) 0%,
                transparent 70%
              );
              filter: blur(30px);
            "
          ></div>

          <div class="relative z-10 space-y-2">
            <h2
              class="text-3xl font-black uppercase tracking-tighter gradient-text"
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
                class="text-6xl font-black tabular-nums tracking-tighter"
                style="
                  color: var(--nebula-cyan);
                  text-shadow: 0 0 30px rgba(6, 182, 212, 0.5);
                "
              >
                {{ analytics.currentLog.totalPoints }}
              </div>
              <div
                class="text-zinc-400 text-xs font-bold uppercase tracking-widest"
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
              class="cancel-btn py-4 rounded-xl font-bold transition-all"
            >
              {{ t("shutdown.cancel") }}
            </button>
            <button
              @click="confirmShutdown"
              class="confirm-btn py-4 rounded-xl text-white font-black transition-all"
            >
              {{ t("shutdown.confirm") }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.shutdown-panel {
  background: rgba(15, 15, 26, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--glass-border);
  box-shadow:
    0 25px 50px rgba(0, 0, 0, 0.5),
    0 0 40px rgba(139, 92, 246, 0.1);
}

.cancel-btn {
  border: 1px solid var(--glass-border);
  color: var(--stardust);
  background: transparent;
}

.cancel-btn:hover {
  border-color: rgba(139, 92, 246, 0.4);
  color: white;
  background: rgba(139, 92, 246, 0.1);
}

.confirm-btn {
  background: linear-gradient(135deg, var(--nebula-purple), var(--nebula-pink));
  box-shadow: 0 0 25px rgba(139, 92, 246, 0.4);
}

.confirm-btn:hover {
  box-shadow: 0 0 35px rgba(236, 72, 153, 0.5);
  transform: translateY(-1px);
}
</style>
