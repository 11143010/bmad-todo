import { defineStore } from "pinia";
import { ref } from "vue";
import { getDB } from "@/modules/db";
import type { UserDocType } from "@/modules/db/schemas/user.schema";

const DEFAULT_PLAYER_ID = "player";

/**
 * User Store
 * Manages game-related player state: Energy, Level, XP.
 * (Separate from Settings which manages App Config)
 */
export const useUserStore = defineStore("user", () => {
  const energy = ref(0);
  const level = ref(1);
  const xp = ref(0);
  const isInitialized = ref(false);

  /**
   * Initialize and sync with RxDB
   */
  const init = async (): Promise<void> => {
    if (isInitialized.value) return;

    const db = await getDB();

    // Ensure player document exists
    const playerDoc = await db.users.findOne(DEFAULT_PLAYER_ID).exec();
    if (!playerDoc) {
      await db.users.insert({
        id: DEFAULT_PLAYER_ID,
        energy: 0,
        level: 1,
        xp: 0,
      });
    }

    // Subscribe to changes
    db.users
      .findOne(DEFAULT_PLAYER_ID)
      .$.subscribe((doc: UserDocType | null) => {
        if (doc) {
          energy.value = doc.energy;
          level.value = doc.level;
          xp.value = doc.xp;
        }
      });

    isInitialized.value = true;
  };

  /**
   * Spend energy (Transactional)
   * @param amount Amount to spend
   * @returns boolean success/failure
   */
  const spendEnergy = async (amount: number): Promise<boolean> => {
    if (energy.value < amount) return false;

    const db = await getDB();
    await db.users.upsert({
      id: DEFAULT_PLAYER_ID,
      energy: energy.value - amount,
      level: level.value,
      xp: xp.value,
    });

    return true;
  };

  /**
   * Add energy (e.g., Task Completion)
   * @param amount Amount to add
   */
  const addEnergy = async (amount: number): Promise<void> => {
    const db = await getDB();
    await db.users.upsert({
      id: DEFAULT_PLAYER_ID,
      energy: energy.value + amount,
      level: level.value,
      xp: xp.value,
    });
  };

  return {
    energy,
    level,
    xp,
    init,
    spendEnergy,
    addEnergy,
  };
});
