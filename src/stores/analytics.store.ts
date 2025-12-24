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
   * @param {Object} taskData - The task details
   * @param {string} taskData.id - Task ID
   * @param {string} taskData.title - Task title
   * @param {number} taskData.points - Points to add
   * @returns {Promise<void>}
   */
  const logAction = async (taskData: {
    id: string;
    title: string;
    points: number;
  }): Promise<void> => {
    const db = await getDB();
    const todayId = getTodayId();

    const record = {
      taskId: taskData.id,
      title: taskData.title,
      points: taskData.points,
      completedAt: Date.now(),
      type: "task" as const,
    };

    try {
      const existingLog = await db.daily_logs.findOne(todayId).exec();

      if (existingLog) {
        // Use atomic update function to safely handle the records array
        await existingLog.incrementalModify((doc) => {
          const records = [...(doc.records || [])];
          records.push(record);

          return {
            ...doc,
            totalPoints: (doc.totalPoints || 0) + taskData.points,
            tasksCompleted: (doc.tasksCompleted || 0) + 1,
            records: records,
          };
        });
      } else {
        await db.daily_logs.insert({
          id: todayId,
          date: Date.now(),
          totalPoints: taskData.points,
          tasksCompleted: INITIAL_TASKS_COMPLETED,
          overloadCount: INITIAL_OVERLOAD_COUNT,
          records: [record],
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

    const record = {
      taskId: "", // No specific task for overload
      title: "System Overload",
      points: 0,
      completedAt: Date.now(),
      type: "overload" as const,
    };

    if (existingLog) {
      await existingLog.incrementalModify((doc) => {
        const records = [...(doc.records || [])];
        records.push(record);

        return {
          ...doc,
          overloadCount: (doc.overloadCount || 0) + 1,
          records: records,
        };
      });
    } else {
      await db.daily_logs.insert({
        id: todayId,
        date: Date.now(),
        totalPoints: 0,
        tasksCompleted: 0,
        overloadCount: 1,
        records: [record],
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
