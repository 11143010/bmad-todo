import { ref, computed } from "vue";
import { getDB } from "@/modules/db";
import type { EggDocType } from "@/modules/incubator/egg.schema";

export function useIncubator() {
  const eggs = ref<EggDocType[]>([]);
  const isInitialized = ref(false);

  const init = async () => {
    if (isInitialized.value) return;

    const db = await getDB();

    // Subscribe to all eggs
    // In strict mode, we might want to filter by user ownership, but currently it's local DB
    db.eggs.find().$.subscribe((docs) => {
      eggs.value = docs.map((doc) => doc.toJSON());
    });

    isInitialized.value = true;
  };

  const activeIncubationCount = computed(
    () => eggs.value.filter((e) => e.status === "incubating").length
  );

  const getRarityDuration = (rarity: string = "common") => {
    // For Dev/Demo, using shorter times. In Prod these would be Hours.
    switch (rarity) {
      case "divine":
        return 6 * 60; // 6 Hours
      case "mythic":
        return 3 * 60; // 3 Hours
      case "legendary":
        return 60; // 1 Hour
      case "epic":
        return 30; // 30 Min
      case "rare":
        return 10; // 10 Min
      case "uncommon":
        return 3; // 3 Min
      default:
        return 1; // 1 Min (Common)
    }
  };

  const incubateEgg = async (egg: EggDocType) => {
    const db = await getDB();
    const durationMinutes = getRarityDuration(egg.rarity);
    const durationMs = durationMinutes * 60 * 1000;

    await db.eggs.upsert({
      ...egg,
      status: "incubating",
      hatchTime: Date.now() + durationMs,
      incubationDuration: durationMs,
    });
  };

  const fastForwardEgg = async (egg: EggDocType) => {
    const db = await getDB();
    await db.eggs.upsert({
      ...egg,
      hatchTime: Date.now() - 1000, // Set to 1 second ago
    });
  };

  const markReady = async (egg: EggDocType) => {
    if (egg.status === "ready") return;
    const db = await getDB();
    await db.eggs.upsert({
      ...egg,
      status: "ready",
    });
  };

  return {
    eggs,
    init,
    incubateEgg,
    fastForwardEgg,
    markReady,
    activeIncubationCount,
  };
}
