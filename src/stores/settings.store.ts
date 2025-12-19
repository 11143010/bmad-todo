import { defineStore } from "pinia";
import { ref } from "vue";
import { getDB } from "@/modules/db";
import type { SettingsDocType } from "@/modules/db/schemas/settings.schema";

/** Default daily limit for new users */
const DEFAULT_DAILY_LIMIT = 100;

/** Default sound enabled state */
const DEFAULT_SOUND_ENABLED = true;

/** Default haptics enabled state */
const DEFAULT_HAPTICS_ENABLED = true;

/** Valid setting keys that can be updated */
type SettingKey = "dailyLimit" | "soundEnabled" | "hapticsEnabled";

/** Valid setting value types */
type SettingValue = number | boolean;

export const useSettingsStore = defineStore("settings", () => {
  const dailyLimit = ref(DEFAULT_DAILY_LIMIT);
  const soundEnabled = ref(DEFAULT_SOUND_ENABLED);
  const hapticsEnabled = ref(DEFAULT_HAPTICS_ENABLED);
  const isInitialized = ref(false);

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
    // Optimistic update happens via local ref if we bound v-model to it,
    // but here we ensure the DB is the source of truth.
    // For distinct optimistic UI, we might update ref immediately,
    // but RxDB subscription will loop back quickly.

    await db.settings.upsert({
      id: "user",
      dailyLimit: dailyLimit.value,
      soundEnabled: soundEnabled.value,
      hapticsEnabled: hapticsEnabled.value,
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

  return {
    dailyLimit,
    soundEnabled,
    hapticsEnabled,
    init,
    setDailyLimit,
    toggleSound,
    toggleHaptics,
  };
});
