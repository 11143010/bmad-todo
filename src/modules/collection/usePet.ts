import { ref } from "vue";
import { getDB } from "@/modules/db";
import type { EggDocType } from "@/modules/incubator/egg.schema";
import { v4 as uuidv4 } from "uuid";

const pets = ref<any[]>([]);
const isInitialized = ref(false);

const PET_TYPES = {
  common: ["Slime", "Rock", "Worm"],
  uncommon: ["Beetle", "Bat", "Wolf"],
  rare: ["Ghost", "Golem", "Griffin"],
  epic: ["Unicorn", "Phoenix", "Hydra"],
  legendary: ["Dragon", "Titan", "Angel"],
  mythic: ["Cthulhu", "Leviathan"],
  divine: ["The Creator"],
};

export function usePet() {
  const init = async () => {
    if (isInitialized.value) return;
    const db = await getDB();

    db.pets.find().$.subscribe((pts) => {
      pets.value = pts;
    });

    isInitialized.value = true;
  };

  const hatchEgg = async (egg: EggDocType) => {
    const db = await getDB();

    // 1. Determine Pet Type based on Egg Rarity
    const pool =
      PET_TYPES[egg.rarity as keyof typeof PET_TYPES] || PET_TYPES["common"];
    const randomType =
      pool[Math.floor(Math.random() * pool.length)] || "Unknown";

    // 2. Create Pet
    const petData = {
      id: uuidv4(),
      name: randomType, // Default name is Type
      type: randomType.toLowerCase(),
      rarity: egg.rarity || "common",
      image: "", // Placeholder
      createdAt: Date.now(),
    };

    await db.pets.insert(petData);

    // 3. Remove Egg
    const eggDoc = await db.eggs.findOne(egg.id).exec();
    if (eggDoc) {
      await eggDoc.remove();
    }

    return petData;
  };

  return {
    pets,
    init,
    hatchEgg,
  };
}
