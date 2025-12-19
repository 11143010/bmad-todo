import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { getDB } from "@/modules/db";

/** Duration to show achievement notification (ms) */
const NOTIFICATION_DURATION_MS = 3000;

/** Minimum tasks to qualify for "no overload" achievement */
const MIN_TASKS_FOR_NO_OVERLOAD = 3;

/** Days required for streak achievement */
const STREAK_DAYS_REQUIRED = 7;

/** Night owl start hour (22:00) */
const NIGHT_OWL_START_HOUR = 22;

/** Night owl end hour (05:00) */
const NIGHT_OWL_END_HOUR = 5;

/** Early bird start hour (05:00) */
const EARLY_BIRD_START_HOUR = 5;

/** Early bird end hour (07:00) */
const EARLY_BIRD_END_HOUR = 7;

export interface Achievement {
  id: string;
  name: string;
  description: string;
  emoji: string;
  unlockedAt: number | null;
  condition: () => Promise<boolean>;
}

export const useAchievementStore = defineStore("achievements", () => {
  const unlockedAchievements = ref<Set<string>>(new Set());
  const recentUnlock = ref<Achievement | null>(null);
  const showNotification = ref(false);

  // Achievement definitions
  const achievements: Achievement[] = [
    {
      id: "first-task",
      name: "第一步！",
      description: "完成你的第一個任務",
      emoji: "🎯",
      unlockedAt: null,
      condition: async () => {
        const db = await getDB();
        const logs = await db.daily_logs.find().exec();
        return logs.some((log) => log.tasksCompleted >= 1);
      },
    },
    {
      id: "ten-tasks",
      name: "十全十美",
      description: "累計完成 10 個任務",
      emoji: "🔟",
      unlockedAt: null,
      condition: async () => {
        const db = await getDB();
        const logs = await db.daily_logs.find().exec();
        const total = logs.reduce((sum, log) => sum + log.tasksCompleted, 0);
        return total >= 10;
      },
    },
    {
      id: "hundred-points",
      name: "百分百努力",
      description: "單日累積達 100 點",
      emoji: "💯",
      unlockedAt: null,
      condition: async () => {
        const db = await getDB();
        const logs = await db.daily_logs.find().exec();
        return logs.some((log) => log.totalPoints >= 100);
      },
    },
    {
      id: "no-overload",
      name: "完美自律",
      description: "完成一天且沒有超載",
      emoji: "⚖️",
      unlockedAt: null,
      condition: async () => {
        const db = await getDB();
        const logs = await db.daily_logs.find().exec();
        return logs.some(
          (log) =>
            log.tasksCompleted >= MIN_TASKS_FOR_NO_OVERLOAD &&
            log.overloadCount === 0
        );
      },
    },
    {
      id: "week-streak",
      name: "七天連勝",
      description: "連續七天都有完成任務",
      emoji: "🔥",
      unlockedAt: null,
      condition: async () => {
        const db = await getDB();
        const logs = await db.daily_logs.find().exec();
        return (
          logs.filter((log) => log.tasksCompleted >= 1).length >=
          STREAK_DAYS_REQUIRED
        );
      },
    },
    {
      id: "night-owl",
      name: "夜貓子",
      description: "在晚上 10 點後完成任務",
      emoji: "🦉",
      unlockedAt: null,
      condition: async () => {
        const hour = new Date().getHours();
        return hour >= NIGHT_OWL_START_HOUR || hour < NIGHT_OWL_END_HOUR;
      },
    },
    {
      id: "early-bird",
      name: "早起鳥",
      description: "在早上 6 點前完成任務",
      emoji: "🐦",
      unlockedAt: null,
      condition: async () => {
        const hour = new Date().getHours();
        return hour >= EARLY_BIRD_START_HOUR && hour < EARLY_BIRD_END_HOUR;
      },
    },
  ];

  /**
   * Get all achievements with their unlock status
   * @returns {Array} All achievements with unlocked boolean
   */
  const allAchievements = computed(() => {
    return achievements.map((achievement) => ({
      ...achievement,
      unlocked: unlockedAchievements.value.has(achievement.id),
    }));
  });

  /**
   * Get the count of unlocked achievements
   * @returns {number} Number of unlocked achievements
   */
  const unlockedCount = computed(() => unlockedAchievements.value.size);

  /**
   * Initialize the achievement store from localStorage
   * @returns {void}
   */
  const init = (): void => {
    // Load unlocked achievements from localStorage
    const saved = localStorage.getItem("bmad-achievements");
    if (saved) {
      const ids = JSON.parse(saved) as string[];
      unlockedAchievements.value = new Set(ids);
    }
  };

  /**
   * Save unlocked achievements to localStorage
   * @returns {void}
   */
  const save = (): void => {
    localStorage.setItem(
      "bmad-achievements",
      JSON.stringify([...unlockedAchievements.value])
    );
  };

  /**
   * Check all achievements and unlock any that meet their conditions
   * @returns {Promise<void>}
   */
  const checkAchievements = async (): Promise<void> => {
    for (const achievement of achievements) {
      if (unlockedAchievements.value.has(achievement.id)) continue;

      const isUnlocked = await achievement.condition();
      if (isUnlocked) {
        unlock(achievement);
      }
    }
  };

  /**
   * Unlock an achievement and show notification
   * @param {Achievement} achievement - The achievement to unlock
   * @returns {void}
   */
  const unlock = (achievement: Achievement): void => {
    if (unlockedAchievements.value.has(achievement.id)) return;

    unlockedAchievements.value.add(achievement.id);
    save();

    // Show notification
    recentUnlock.value = achievement;
    showNotification.value = true;

    // Auto-hide after duration
    setTimeout(() => {
      showNotification.value = false;
    }, NOTIFICATION_DURATION_MS);
  };

  /**
   * Dismiss the achievement notification
   * @returns {void}
   */
  const dismissNotification = (): void => {
    showNotification.value = false;
  };

  return {
    allAchievements,
    unlockedCount,
    recentUnlock,
    showNotification,
    init,
    checkAchievements,
    dismissNotification,
  };
});
