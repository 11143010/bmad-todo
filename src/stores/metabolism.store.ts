import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { getDB } from "@/modules/db";
import type { TaskDocType } from "@/modules/db/schemas/task.schema";
import type { SettingsDocType } from "@/modules/db/schemas/settings.schema";
import { sensory } from "@/modules/sensory";
import { useAnalyticsStore } from "./analytics.store";

/** Default daily limit for metabolism/stress */
const DEFAULT_DAILY_LIMIT = 100;

/** Maximum percentage to display (prevents UI overflow) */
const MAX_DISPLAY_PERCENTAGE = 999;

export const useMetabolismStore = defineStore("metabolism", () => {
  const currentLoad = ref(0);
  const dailyLimit = ref(DEFAULT_DAILY_LIMIT);
  const isInitialized = ref(false);

  /**
   * Calculate the load percentage based on current load and daily limit
   * @returns {number} The percentage (0-999)
   */
  const loadPercentage = computed(() => {
    if (dailyLimit.value <= 0) return 0;
    return Math.min(
      Math.round((currentLoad.value / dailyLimit.value) * 100),
      MAX_DISPLAY_PERCENTAGE
    );
  });

  /**
   * Check if current load exceeds the daily limit
   * @returns {boolean} True if overflowing
   */
  const isOverflow = computed(() => loadPercentage.value > 100);

  const overrideActive = ref(false);

  /**
   * Check if the system is in overloaded state (task input should be blocked)
   * @returns {boolean} True if overflowing and not overridden
   */
  const isSystemOverloaded = computed(() => {
    // Overloaded if overflowing AND not overridden
    return isOverflow.value && !overrideActive.value;
  });

  /**
   * Initialize the metabolism store by subscribing to tasks and settings
   * @returns {Promise<void>}
   */
  const init = async (): Promise<void> => {
    if (isInitialized.value) return;

    const db = await getDB();

    // 1. Subscribe to Active Tasks
    db.tasks
      .find({
        selector: {
          status: "active",
        },
      })
      .$.subscribe((activeTasks: TaskDocType[]) => {
        // Calculate total points
        const total = activeTasks.reduce(
          (sum, task) => sum + (task.points || 0),
          0
        );

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

  /**
   * Activate the override to temporarily allow adding tasks when overloaded
   * @returns {void}
   */
  const activateOverride = (): void => {
    overrideActive.value = true;
  };

  /**
   * Reset the override state
   * @returns {void}
   */
  const resetOverride = (): void => {
    overrideActive.value = false;
  };

  /**
   * Reset daily load for a new day
   * @returns {void}
   */
  const dailyReset = (): void => {
    currentLoad.value = 0; // Reset local state immediately
    overrideActive.value = false;
  };

  return {
    currentLoad,
    dailyLimit,
    loadPercentage,
    isOverflow,
    isSystemOverloaded,
    overrideActive,
    init,
    activateOverride,
    resetOverride,
    dailyReset,
  };
});
