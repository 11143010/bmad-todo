import { defineStore } from "pinia";
import { ref } from "vue";
import { getDB } from "@/modules/db";
import type { TaskDocType } from "@/modules/db/schemas/task.schema";
import { v4 as uuidv4 } from "uuid";
import { sensory } from "@/modules/sensory";
import { useAnalyticsStore } from "./analytics.store";

export const useTaskStore = defineStore("tasks", () => {
  const tasks = ref<TaskDocType[]>([]);
  const isInitialized = ref(false);

  const init = async () => {
    if (isInitialized.value) return;

    const db = await getDB();

    // Subscribe to all tasks for now
    db.tasks
      .find({
        selector: {
          status: "active",
        },
        sort: [{ createdAt: "desc" }],
      })
      .$.subscribe((docs: TaskDocType[]) => {
        tasks.value = docs;
      });

    isInitialized.value = true;
  };

  const addTask = async (title: string) => {
    const db = await getDB();
    const newTask: TaskDocType = {
      id: uuidv4(),
      title: title.trim(),
      status: "active",
      points: 0, // 0 = Unprocessed / Raw
      createdAt: Date.now(),
    };
    await db.tasks.insert(newTask);
    sensory.play("add");
    sensory.vibrate("light");
  };

  const estimateTask = async (id: string, points: number) => {
    const db = await getDB();
    const task = await db.tasks.findOne(id).exec();
    if (task) {
      await task.patch({ points });
      sensory.play("add");
    }
  };

  const completeTask = async (id: string) => {
    const db = await getDB();
    const task = await db.tasks.findOne(id).exec();
    if (task) {
      // Get necessary data before updating
      const points = task.points;

      await task.patch({ status: "completed" });
      sensory.play("complete");
      sensory.vibrate("medium");

      // Log Analytics
      try {
        const analytics = useAnalyticsStore();
        await analytics.init();
        await analytics.logAction(points);

        // Check achievements
        const { useAchievementStore } = await import(
          "@/stores/achievement.store"
        );
        const achievementStore = useAchievementStore();
        await achievementStore.checkAchievements();
      } catch (e) {
        // Analytics/achievements failed silently
      }
    }
  };

  const chopTask = async (originalId: string, newTitles: string[]) => {
    const db = await getDB();

    // 1. Find and Remove original task
    const originalTask = await db.tasks.findOne(originalId).exec();
    if (!originalTask) return;

    await originalTask.remove();

    // 2. Create new subtasks
    const timestamp = Date.now();
    const newTasks: TaskDocType[] = newTitles.map((title, index) => ({
      id: uuidv4(),
      title: title.trim(),
      status: "active",
      points: 0,
      createdAt: timestamp + index, // Ensure order preservation by slight time diff
    }));

    await db.tasks.bulkInsert(newTasks);

    // 3. Feedback
    // Play a burst of sounds
    newTitles.forEach((_, i) => {
      setTimeout(() => {
        sensory.play("add");
        sensory.vibrate("light");
      }, i * 150); // Staggered effects
    });
  };

  const updateTaskTitle = async (id: string, newTitle: string) => {
    const db = await getDB();
    const task = await db.tasks.findOne(id).exec();
    if (task) {
      await task.patch({ title: newTitle.trim() });
    }
  };

  const deleteTask = async (id: string) => {
    const db = await getDB();
    const task = await db.tasks.findOne(id).exec();
    if (task) {
      await task.remove();
      sensory.play("complete");
    }
  };

  const archiveCompleted = async () => {
    const db = await getDB();
    // Find all completed tasks
    const completedTasks = await db.tasks
      .find({
        selector: {
          status: "completed",
        },
      })
      .exec();

    const ids = completedTasks.map((t) => t.id);
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
    chopTask,
    updateTaskTitle,
    deleteTask,
    archiveCompleted,
  };
});
// Force HMR Update
