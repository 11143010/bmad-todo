import { defineStore } from "pinia";
import { ref } from "vue";
import { getDB } from "@/modules/db";
import type { TaskDocType } from "@/modules/db/schemas/task.schema";
import { v4 as uuidv4 } from "uuid";
import { sensory } from "@/modules/sensory";
import { useAnalyticsStore } from "./analytics.store";

/** Default points for unprocessed tasks */
const UNPROCESSED_POINTS = 0;

/** Delay between staggered sound effects (ms) */
const STAGGER_DELAY_MS = 150;

export const useTaskStore = defineStore("tasks", () => {
  const tasks = ref<TaskDocType[]>([]);
  const isInitialized = ref(false);

  /**
   * Initialize the task store by subscribing to active tasks from the database
   * @returns {Promise<void>}
   */
  const init = async (): Promise<void> => {
    if (isInitialized.value) return;

    const db = await getDB();

    // Subscribe to all tasks for now
    db.tasks
      .find({
        selector: {
          status: "active",
        },
        sort: [{ order: "asc" }, { createdAt: "desc" }],
      })
      .$.subscribe((docs: TaskDocType[]) => {
        tasks.value = docs;
      });

    isInitialized.value = true;
  };

  /**
   * Add a new task to the database
   * @param {string} title - The task title
   * @returns {Promise<void>}
   */
  const addTask = async (title: string): Promise<void> => {
    const db = await getDB();
    const newTask: TaskDocType = {
      id: uuidv4(),
      title: title.trim(),
      status: "active",
      points: UNPROCESSED_POINTS,
      createdAt: Date.now(),
      order: 0, // Default order, will be updated on manual sort
    };
    await db.tasks.insert(newTask);
    sensory.play("add");
    sensory.vibrate("light");
  };

  /**
   * Reorder tasks based on the provided list of IDs
   * @param {string[]} orderedIds - List of task IDs in the new order
   * @returns {Promise<void>}
   */
  const reorderTasks = async (orderedIds: string[]): Promise<void> => {
    const db = await getDB();
    const tasksMap = await db.tasks
      .find({
        selector: {
          id: {
            $in: orderedIds,
          },
        },
      })
      .exec()
      .then((docs) => new Map(docs.map((d) => [d.id, d])));

    const updates: Promise<unknown>[] = [];

    // Update order for each task based on its new index
    orderedIds.forEach((id, i) => {
      const task = tasksMap.get(id);
      if (task && task.order !== i) {
        updates.push(task.patch({ order: i }));
      }
    });

    if (updates.length > 0) {
      await Promise.all(updates);
      // Sensory feedback for reorder is handled by UI drag end usually,
      // but we can add a subtle one here if needed.
    }
  };

  /**
   * Estimate the points/weight of a task
   * @param {string} id - The task ID
   * @param {number} points - The estimated points value
   * @returns {Promise<void>}
   */
  const estimateTask = async (id: string, points: number): Promise<void> => {
    const db = await getDB();
    const task = await db.tasks.findOne(id).exec();
    if (task) {
      await task.patch({ points });
      sensory.play("add");
    }
  };

  /**
   * Mark a task as completed and log analytics
   * @param {string} id - The task ID to complete
   * @returns {Promise<void>}
   */
  const completeTask = async (id: string): Promise<void> => {
    const db = await getDB();
    const task = await db.tasks.findOne(id).exec();
    if (task) {
      // Get necessary data before updating
      // const points = task.points;

      await task.patch({ status: "completed" });
      sensory.play("complete");
      sensory.vibrate("medium");

      // Log Analytics
      try {
        const analytics = useAnalyticsStore();
        await analytics.init();
        // Log to analytics with task details
        await analytics.logAction({
          id: task.id,
          title: task.title,
          points: task.points,
        });

        // Check achievements
        const { useAchievementStore } = await import(
          "@/stores/achievement.store"
        );
        const achievementStore = useAchievementStore();
        await achievementStore.checkAchievements();
      } catch (error) {
        console.warn("Analytics/achievements failed:", error);
      }
    }
  };

  /**
   * Split a task into multiple subtasks
   * @param {string} originalId - The original task ID to chop
   * @param {string[]} newTitles - Array of new subtask titles
   * @returns {Promise<void>}
   */
  const chopTask = async (
    originalId: string,
    newTitles: string[]
  ): Promise<void> => {
    const db = await getDB();

    // 1. Find and Remove original task
    const originalTask = await db.tasks.findOne(originalId).exec();
    if (!originalTask) return;

    await originalTask.remove();

    // 2. Create new subtasks
    const timestamp = Date.now();
    const newTasks: TaskDocType[] = newTitles.map((title, taskIndex) => ({
      id: uuidv4(),
      title: title.trim(),
      status: "active",
      points: UNPROCESSED_POINTS,
      createdAt: timestamp + taskIndex, // Ensure order preservation by slight time diff
    }));

    await db.tasks.bulkInsert(newTasks);

    // 3. Feedback - Play a burst of sounds
    newTitles.forEach((_unusedTitle, soundIndex) => {
      setTimeout(() => {
        sensory.play("add");
        sensory.vibrate("light");
      }, soundIndex * STAGGER_DELAY_MS);
    });
  };

  /**
   * Update the title of an existing task
   * @param {string} id - The task ID
   * @param {string} newTitle - The new title
   * @returns {Promise<void>}
   */
  const updateTaskTitle = async (
    id: string,
    newTitle: string
  ): Promise<void> => {
    const db = await getDB();
    const task = await db.tasks.findOne(id).exec();
    if (task) {
      await task.patch({ title: newTitle.trim() });
    }
  };

  /**
   * Delete a task from the database
   * @param {string} id - The task ID to delete
   * @returns {Promise<void>}
   */
  const deleteTask = async (id: string): Promise<void> => {
    const db = await getDB();
    const task = await db.tasks.findOne(id).exec();
    if (task) {
      await task.remove();
      sensory.play("complete");
    }
  };

  /**
   * Archive all completed tasks by removing them from the database
   * @returns {Promise<void>}
   */
  const archiveCompleted = async (): Promise<void> => {
    const db = await getDB();
    // Find all completed tasks
    const completedTasks = await db.tasks
      .find({
        selector: {
          status: "completed",
        },
      })
      .exec();

    const ids = completedTasks.map((task) => task.id);
    if (ids.length > 0) {
      await db.tasks.find({ selector: { id: { $in: ids } } }).remove();
      sensory.play("complete"); // Final satisfaction
    }
  };

  return {
    tasks,
    init,
    addTask,
    estimateTask,
    completeTask,
    reorderTasks,
    chopTask,
    updateTaskTitle,
    deleteTask,
    archiveCompleted,
  };
});
