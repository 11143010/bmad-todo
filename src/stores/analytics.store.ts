import { defineStore } from "pinia";
import { ref } from "vue";
import { getDB } from "@/modules/db";
import type { DailyLogDocType } from "@/modules/db/schemas/daily-log.schema";

/** Initial task count for new logs */
const INITIAL_TASKS_COMPLETED = 1;

/** Initial overload count for new logs */
const INITIAL_OVERLOAD_COUNT = 0;

export const useAnalyticsStore = defineStore("analytics", () => {
  const currentLog = ref<DailyLogDocType | null>(null);
  const isInitialized = ref(false);

  /**
   * Get today's date ID in YYYY-MM-DD format
   * @returns {string} Today's date ID
   */
  const getTodayId = (): string => {
    const now = new Date();
    // Use local time offset
    const offset = now.getTimezoneOffset() * 60000;
    const dateStr = new Date(now.getTime() - offset)
      .toISOString()
      .split("T")[0];
    return dateStr ?? now.toISOString().slice(0, 10);
  };

  /**
   * Initialize the analytics store by subscribing to today's log
   * @returns {Promise<void>}
   */
  const init = async (): Promise<void> => {
    if (isInitialized.value) return;

    const db = await getDB();
    const todayId = getTodayId();

    // Subscribe to today's log
    db.daily_logs.findOne(todayId).$.subscribe((log: unknown) => {
      if (log) {
        currentLog.value = log as DailyLogDocType;
      } else {
        // If no log exists for today, keep it null until created
        currentLog.value = null;
      }
    });

    isInitialized.value = true;
  };

  /**
   * Records completed points and increments task count.
   * Creates the log if it doesn't exist.
   * @param {number} points - Points to add from completed task
   * @returns {Promise<void>}
   */
  const logAction = async (points: number): Promise<void> => {
    const db = await getDB();
    const todayId = getTodayId();

    try {
      const existingLog = await db.daily_logs.findOne(todayId).exec();

      if (existingLog) {
        await existingLog.update({
          $inc: {
            totalPoints: points,
            tasksCompleted: 1,
          },
        });
      } else {
        await db.daily_logs.insert({
          id: todayId,
          date: Date.now(),
          totalPoints: points,
          tasksCompleted: INITIAL_TASKS_COMPLETED,
          overloadCount: INITIAL_OVERLOAD_COUNT,
        });
      }
    } catch (error) {
      console.error("Analytics: Error logging action", error);
    }
  };

  /**
   * Records an overload event for today
   * @returns {Promise<void>}
   */
  const logOverload = async (): Promise<void> => {
    const db = await getDB();
    const todayId = getTodayId();
    const existingLog = await db.daily_logs.findOne(todayId).exec();

    if (existingLog) {
      await existingLog.update({
        $inc: {
          overloadCount: 1,
        },
      });
    } else {
      await db.daily_logs.insert({
        id: todayId,
        date: Date.now(),
        totalPoints: 0,
        tasksCompleted: 0,
        overloadCount: 1,
      });
    }
  };

  return {
    init,
    currentLog,
    logAction,
    logOverload,
  };
});
