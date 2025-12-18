import { defineStore } from "pinia";
import { ref } from "vue";
import { getDB } from "@/modules/db";
import type { SettingsDocType } from "@/modules/db/schemas/settings.schema";

export const useSettingsStore = defineStore("settings", () => {
  const dailyLimit = ref(100);
  const soundEnabled = ref(true);
  const hapticsEnabled = ref(true);
  const isInitialized = ref(false);

  /**
   * Initialize the store by syncing with RxDB
   */
  const init = async () => {
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
   * @param key The key to update
   * @param value The new value
   */
  const updateSetting = async (key: string, value: any) => {
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

  const setDailyLimit = async (limit: number) => {
    await updateSetting("dailyLimit", limit);
  };

  const toggleSound = async () => {
    await updateSetting("soundEnabled", !soundEnabled.value);
  };

  const toggleHaptics = async () => {
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
