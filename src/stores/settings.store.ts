import { defineStore } from "pinia";
import { ref, watch } from "vue";
import { getDB } from "@/modules/db";
import type { SettingsDocType } from "@/modules/db/schemas/settings.schema";

/** Default daily limit for new users */
const DEFAULT_DAILY_LIMIT = 100;

/** Default sound enabled state */
const DEFAULT_SOUND_ENABLED = true;

/** Default haptics enabled state */
const DEFAULT_HAPTICS_ENABLED = true;

/** Default font size */
const DEFAULT_FONT_SIZE = "medium";

/** Font size options */
export type FontSize = "small" | "medium" | "large";

/** Font size CSS values */
const FONT_SIZE_MAP: Record<FontSize, string> = {
  small: "14px",
  medium: "16px",
  large: "18px",
};

/** Valid setting keys that can be updated */
type SettingKey = "dailyLimit" | "soundEnabled" | "hapticsEnabled" | "fontSize";

/** Valid setting value types */
type SettingValue = number | boolean | FontSize;

export const useSettingsStore = defineStore("settings", () => {
  const dailyLimit = ref(DEFAULT_DAILY_LIMIT);
  const soundEnabled = ref(DEFAULT_SOUND_ENABLED);
  const hapticsEnabled = ref(DEFAULT_HAPTICS_ENABLED);
  const fontSize = ref<FontSize>(DEFAULT_FONT_SIZE);
  const isInitialized = ref(false);

  // Apply font size to document
  watch(
    fontSize,
    (newSize) => {
      document.documentElement.style.fontSize = FONT_SIZE_MAP[newSize];
    },
    { immediate: true }
  );

  /**
   * Initialize the store by syncing with RxDB
   * @returns {Promise<void>}
   */
  const init = async (): Promise<void> => {
    if (isInitialized.value) return;

    const db = await getDB();
    const settings$ = db.settings.findOne("user").$;

    // Subscribe to changes in the database and update local state
    settings$.subscribe((doc: SettingsDocType | null) => {
      if (doc) {
        dailyLimit.value = doc.dailyLimit;
        soundEnabled.value = doc.soundEnabled;
        hapticsEnabled.value = doc.hapticsEnabled;
        fontSize.value = (doc.fontSize as FontSize) || DEFAULT_FONT_SIZE;
      }
    });

    isInitialized.value = true;
  };

  /**
   * Update a setting in RxDB
   * @param {SettingKey} key - The setting key to update
   * @param {SettingValue} value - The new value
   * @returns {Promise<void>}
   */
  const updateSetting = async (
    key: SettingKey,
    value: SettingValue
  ): Promise<void> => {
    const db = await getDB();

    await db.settings.upsert({
      id: "user",
      dailyLimit: dailyLimit.value,
      soundEnabled: soundEnabled.value,
      hapticsEnabled: hapticsEnabled.value,
      fontSize: fontSize.value,
      [key]: value,
    });
  };

  /**
   * Set the daily limit
   * @param {number} limit - The new daily limit value
   * @returns {Promise<void>}
   */
  const setDailyLimit = async (limit: number): Promise<void> => {
    await updateSetting("dailyLimit", limit);
  };

  /**
   * Toggle the sound enabled state
   * @returns {Promise<void>}
   */
  const toggleSound = async (): Promise<void> => {
    await updateSetting("soundEnabled", !soundEnabled.value);
  };

  /**
   * Toggle the haptics enabled state
   * @returns {Promise<void>}
   */
  const toggleHaptics = async (): Promise<void> => {
    await updateSetting("hapticsEnabled", !hapticsEnabled.value);
  };

  /**
   * Set the font size
   * @param {FontSize} size - The new font size
   * @returns {Promise<void>}
   */
  const setFontSize = async (size: FontSize): Promise<void> => {
    await updateSetting("fontSize", size);
  };

  /**
   * UI State for Settings Panel Visibility
   * Not persisted to DB
   */
  const isSettingsOpen = ref(false);
  const toggleSettings = () => {
    isSettingsOpen.value = !isSettingsOpen.value;
  };

  return {
    dailyLimit,
    soundEnabled,
    hapticsEnabled,
    fontSize,
    init,
    setDailyLimit,
    toggleSound,
    toggleHaptics,
    setFontSize,
    isSettingsOpen,
    toggleSettings,
  };
});
