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
    "plate.search": "搜尋任務...",
    "plate.noResults": "找不到任務",
    "plate.found": "個結果",
    "plate.sort.manual": "手動排序",

    // Task
    "task.weigh": "稱重",
    "task.delete": "刪除任務",
    "task.edit": "雙擊編輯",
    "task.chop": "切碎任務",

    // Tags
    "tag.add": "添加標籤",

    // Gauge
    "gauge.normal": "壓力正常",
    "gauge.heavy": "壓力沈重",
    "gauge.overload": "系統超載",
    "gauge.points": "點數",

    // Input
    "input.placeholder": "你在想什麼？",
    "input.kitchenClosed": "系統超載 - 請先處理現有任務",

    // Settings
    "settings.title": "壓力設定",
    "settings.dailyLimit": "每日壓力上限",
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

    // Overload Modal (was Kitchen Closed)
    "kitchen.title": "系統超載",
    "kitchen.subtitle": "壓力超出負荷",
    "kitchen.message": "你的系統已經超載。完成一些任務來釋放壓力。",
    "kitchen.digest": "開始處理任務",
    "kitchen.override": "我必須繼續（長按強制）",
    "kitchen.focusMode": "專注模式",
    "kitchen.focusMessage": "無法新增任務，請專注完成現有項目。",

    // PWA
    "pwa.offline": "你目前處於離線狀態，但資料會保存在本地",
    "pwa.online": "網路連線已恢復",

    // Achievements
    "achievement.unlocked": "成就解鎖！",

    // Estimator
    "estimator.title": "這個任務有多重？",
    "estimator.subtitle": "選擇一個壓力等級",

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
    "plate.search": "Search tasks...",
    "plate.noResults": "No tasks found",
    "plate.found": "found",
    "plate.sort.manual": "Manual (drag to reorder)",

    // Task
    "task.weigh": "Weigh",
    "task.delete": "Delete Task",
    "task.edit": "Double-click to edit",
    "task.chop": "Chop Task",

    // Tags
    "tag.add": "Add Tag",

    // Gauge
    "gauge.normal": "Normal",
    "gauge.heavy": "Heavy Load",
    "gauge.overload": "OVERLOAD",
    "gauge.points": "pts",

    // Input
    "input.placeholder": "What's on your mind?",
    "input.kitchenClosed": "System Overloaded - Handle existing tasks first",

    // Settings
    "settings.title": "Stress Settings",
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
    "analytics.title": "Stress Trends",
    "analytics.subtitle": "LAST 7 DAYS",
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

    // Overload Modal (was Kitchen Closed)
    "kitchen.title": "System Overload",
    "kitchen.subtitle": "CAPACITY_EXCEEDED",
    "kitchen.message":
      "Your system is overloaded. Complete some tasks to release pressure.",
    "kitchen.digest": "Start Processing",
    "kitchen.override": "I must continue (hold to force)",
    "kitchen.focusMode": "Focus Mode",
    "kitchen.focusMessage":
      "Cannot add tasks. Focus on completing existing ones.",

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

/** Default locale for new users */
const DEFAULT_LOCALE: Locale = "zh-TW";

/** LocalStorage key for locale preference */
const STORAGE_KEY_LOCALE = "bmad-locale";

// Reactive locale
const currentLocale = ref<Locale>(
  (localStorage.getItem(STORAGE_KEY_LOCALE) as Locale) || DEFAULT_LOCALE
);

/**
 * Set the current locale and persist to localStorage
 * @param {Locale} locale - The locale to set
 * @returns {void}
 */
export const setLocale = (locale: Locale): void => {
  currentLocale.value = locale;
  localStorage.setItem(STORAGE_KEY_LOCALE, locale);
};

/**
 * Get the current locale
 * @returns {Locale} The current locale
 */
export const getLocale = (): Locale => currentLocale.value;

/**
 * Vue composable for i18n functionality
 * @returns {{ t: Function, locale: ComputedRef, setLocale: Function }}
 */
export const useI18n = () => {
  const locale = computed(() => currentLocale.value);

  /**
   * Translate a key to the current locale
   * @param {TranslationKey} key - The translation key
   * @returns {string} The translated string
   */
  const t = (key: TranslationKey): string => {
    return translations[currentLocale.value][key] || key;
  };

  return { t, locale, setLocale };
};

/**
 * Simple translation function for non-reactive usage
 * @param {TranslationKey} key - The translation key
 * @returns {string} The translated string
 */
export const t = (key: TranslationKey): string => {
  return translations[currentLocale.value][key] || key;
};

export default { useI18n, t, setLocale, getLocale };
