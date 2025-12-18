import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { getDB } from "@/modules/db";
import type { TaskDocType } from "@/modules/db/schemas/task.schema";
import type { SettingsDocType } from "@/modules/db/schemas/settings.schema";
import { sensory } from "@/modules/sensory";
import { useAnalyticsStore } from "./analytics.store";

export const useMetabolismStore = defineStore("metabolism", () => {
  const currentLoad = ref(0);
  const dailyLimit = ref(100);
  const isInitialized = ref(false);

  const loadPercentage = computed(() => {
    if (dailyLimit.value <= 0) return 0;
    return Math.min(
      Math.round((currentLoad.value / dailyLimit.value) * 100),
      999
    );
  });

  const isOverflow = computed(() => loadPercentage.value > 100);

  const overrideActive = ref(false);

  const isKitchenClosed = computed(() => {
    // Closed if overflowing AND not overridden
    return isOverflow.value && !overrideActive.value;
  });

  const init = async () => {
    if (isInitialized.value) return;

    const db = await getDB();

    // 1. Subscribe to Active Tasks
    db.tasks
      .find({
        selector: {
          status: "active",
        },
      })
      .$.subscribe((tasks: TaskDocType[]) => {
        // Calculate total points
        const total = tasks.reduce((sum, task) => sum + (task.points || 0), 0);

        // Check for transition to overflow
        const wasOverflow =
          dailyLimit.value > 0 && currentLoad.value > dailyLimit.value;
        const nowOverflow = dailyLimit.value > 0 && total > dailyLimit.value;

        currentLoad.value = total;

        if (!wasOverflow && nowOverflow) {
          sensory.play("warning");
          sensory.vibrate("pulse");

          // Log Analytics
          const analytics = useAnalyticsStore();
          analytics.init().then(() => {
            analytics.logOverload();
          });
        }

        // Auto-reset override if we drop below limit
        if (overrideActive.value && total <= dailyLimit.value) {
          overrideActive.value = false;
        }
      });
    db.settings
      .findOne("user")
      .$.subscribe((settings: SettingsDocType | null) => {
        if (settings) {
          dailyLimit.value = settings.dailyLimit;
        }
      });

    isInitialized.value = true;
  };

  const activateOverride = () => {
    overrideActive.value = true;
  };

  const resetOverride = () => {
    overrideActive.value = false;
  };

  const dailyReset = () => {
    currentLoad.value = 0; // Reset local state immediately
    overrideActive.value = false;
  };

  return {
    currentLoad,
    dailyLimit,
    loadPercentage,
    isOverflow,
    isKitchenClosed,
    overrideActive,
    init,
    activateOverride,
    resetOverride,
    dailyReset,
  };
});
