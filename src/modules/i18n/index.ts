// Internationalization (i18n) with Vue reactivity
import { ref, computed } from "vue";

export type Locale = "zh-TW" | "en";

const translations = {
  "zh-TW": {
    // App
    "app.title": "BMad",
    "app.version": "測試版",

    // Plate
    "plate.title": "任務清單",
    "plate.empty": "無數據",
    "plate.sort.new": "新",
    "plate.sort.heavy": "重",
    "plate.sort.light": "輕",

    // Task
    "task.weigh": "稱重",
    "task.delete": "刪除任務",
    "task.edit": "雙擊編輯",
    "task.chop": "切碎任務",

    // Gauge
    "gauge.normal": "壓力正常",
    "gauge.heavy": "壓力沈重",
    "gauge.overload": "系統超載",
    "gauge.points": "點數",

    // Input
    "input.placeholder": "你在想什麼？",
    "input.kitchenClosed": "廚房已關閉 - 請先消化現有任務",

    // Settings
    "settings.title": "壓力設定",
    "settings.dailyLimit": "每日熱量上限",
    "settings.sound": "音效",
    "settings.haptics": "觸覺回饋",
    "settings.preset.easy": "輕鬆",
    "settings.preset.normal": "標準",
    "settings.preset.sprint": "衝刺",
    "settings.preset.extreme": "極限",
    "settings.language": "語言",
    "settings.shortcutHint": "按 ? 查看快捷鍵",

    // Analytics
    "analytics.title": "壓力趨勢",
    "analytics.subtitle": "過去七天",
    "analytics.points": "點數",
    "analytics.tasks": "任務",
    "analytics.overloads": "超載",
    "analytics.noData": "尚無數據",

    // Shutdown
    "shutdown.button": "關機",
    "shutdown.title": "系統關機",
    "shutdown.subtitle": "系統關機協議",
    "shutdown.confirm": "確認關機",
    "shutdown.cancel": "取消",
    "shutdown.todayPoints": "今日累積",
    "shutdown.tasksCompleted": "任務完成",

    // Kitchen Closed
    "kitchen.title": "廚房已關閉",
    "kitchen.subtitle": "系統超載",
    "kitchen.message": "你的代謝系統已經超載。完成一些任務來恢復處理能力。",

    // PWA
    "pwa.offline": "你目前處於離線狀態，但資料會保存在本地",
    "pwa.online": "網路連線已恢復",

    // Achievements
    "achievement.unlocked": "成就解鎖！",

    // Estimator
    "estimator.title": "這個任務有多重？",
    "estimator.subtitle": "選擇一個卡路里等級",

    // Chopper
    "chopper.title": "切碎任務",
    "chopper.subtitle": "把大任務分解成小塊",
    "chopper.add": "新增子任務",
    "chopper.confirm": "確認切碎",
    "chopper.cancel": "取消",
  },
  en: {
    // App
    "app.title": "BMad",
    "app.version": "ALPHA",

    // Plate
    "plate.title": "Task Plate",
    "plate.empty": "NO_DATA",
    "plate.sort.new": "New",
    "plate.sort.heavy": "Heavy",
    "plate.sort.light": "Light",

    // Task
    "task.weigh": "Weigh",
    "task.delete": "Delete Task",
    "task.edit": "Double-click to edit",
    "task.chop": "Chop Task",

    // Gauge
    "gauge.normal": "Normal",
    "gauge.heavy": "Heavy Load",
    "gauge.overload": "OVERLOAD",
    "gauge.points": "pts",

    // Input
    "input.placeholder": "What's on your mind?",
    "input.kitchenClosed": "Kitchen Closed - Digest existing tasks first",

    // Settings
    "settings.title": "Metabolism Settings",
    "settings.dailyLimit": "Daily Limit",
    "settings.sound": "Sound",
    "settings.haptics": "Haptic Feedback",
    "settings.preset.easy": "Easy",
    "settings.preset.normal": "Normal",
    "settings.preset.sprint": "Sprint",
    "settings.preset.extreme": "Extreme",
    "settings.language": "Language",
    "settings.shortcutHint": "Press ? for shortcuts",

    // Analytics
    "analytics.title": "Metabolic Trends",
    "analytics.subtitle": "LAST_7_CYCLES",
    "analytics.points": "Points",
    "analytics.tasks": "Tasks",
    "analytics.overloads": "Overloads",
    "analytics.noData": "NO_DATA_AVAILABLE",

    // Shutdown
    "shutdown.button": "SHUT_DOWN",
    "shutdown.title": "Shutdown",
    "shutdown.subtitle": "SYSTEM_SHUTDOWN_PROTOCOL",
    "shutdown.confirm": "Confirm Shutdown",
    "shutdown.cancel": "Cancel",
    "shutdown.todayPoints": "Today's Points",
    "shutdown.tasksCompleted": "Tasks Done",

    // Kitchen Closed
    "kitchen.title": "Kitchen Closed",
    "kitchen.subtitle": "SYSTEM_OVERLOAD",
    "kitchen.message":
      "Your metabolic system is overloaded. Complete some tasks to restore processing capacity.",

    // PWA
    "pwa.offline": "You are offline. Data is saved locally.",
    "pwa.online": "Connection restored",

    // Achievements
    "achievement.unlocked": "Achievement Unlocked!",

    // Estimator
    "estimator.title": "How heavy is this task?",
    "estimator.subtitle": "Choose a calorie level",

    // Chopper
    "chopper.title": "Chop Task",
    "chopper.subtitle": "Break it into smaller pieces",
    "chopper.add": "Add Subtask",
    "chopper.confirm": "Confirm Chop",
    "chopper.cancel": "Cancel",
  },
} as const;

type TranslationKey = keyof (typeof translations)["zh-TW"];

// Reactive locale
const currentLocale = ref<Locale>(
  (localStorage.getItem("bmad-locale") as Locale) || "zh-TW"
);

export const setLocale = (locale: Locale) => {
  currentLocale.value = locale;
  localStorage.setItem("bmad-locale", locale);
};

export const getLocale = (): Locale => currentLocale.value;

export const useI18n = () => {
  const locale = computed(() => currentLocale.value);

  const t = (key: TranslationKey): string => {
    return translations[currentLocale.value][key] || key;
  };

  return { t, locale, setLocale };
};

// Simple function for non-reactive usage
export const t = (key: TranslationKey): string => {
  return translations[currentLocale.value][key] || key;
};

export default { useI18n, t, setLocale, getLocale };
