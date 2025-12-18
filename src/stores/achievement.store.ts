import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { getDB } from "@/modules/db";

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
        return logs.some((l) => l.tasksCompleted >= 1);
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
        const total = logs.reduce((sum, l) => sum + l.tasksCompleted, 0);
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
        return logs.some((l) => l.totalPoints >= 100);
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
        return logs.some((l) => l.tasksCompleted >= 3 && l.overloadCount === 0);
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
        return logs.filter((l) => l.tasksCompleted >= 1).length >= 7;
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
        return hour >= 22 || hour < 5;
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
        return hour >= 5 && hour < 7;
      },
    },
  ];

  const allAchievements = computed(() => {
    return achievements.map((a) => ({
      ...a,
      unlocked: unlockedAchievements.value.has(a.id),
    }));
  });

  const unlockedCount = computed(() => unlockedAchievements.value.size);

  const init = () => {
    // Load unlocked achievements from localStorage
    const saved = localStorage.getItem("bmad-achievements");
    if (saved) {
      const ids = JSON.parse(saved) as string[];
      unlockedAchievements.value = new Set(ids);
    }
  };

  const save = () => {
    localStorage.setItem(
      "bmad-achievements",
      JSON.stringify([...unlockedAchievements.value])
    );
  };

  const checkAchievements = async () => {
    for (const achievement of achievements) {
      if (unlockedAchievements.value.has(achievement.id)) continue;

      const unlocked = await achievement.condition();
      if (unlocked) {
        unlock(achievement);
      }
    }
  };

  const unlock = (achievement: Achievement) => {
    if (unlockedAchievements.value.has(achievement.id)) return;

    unlockedAchievements.value.add(achievement.id);
    save();

    // Show notification
    recentUnlock.value = achievement;
    showNotification.value = true;

    // Auto-hide after 3 seconds
    setTimeout(() => {
      showNotification.value = false;
    }, 3000);
  };

  const dismissNotification = () => {
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
