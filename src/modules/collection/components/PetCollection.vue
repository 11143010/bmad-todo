<script setup lang="ts">
import { onMounted } from "vue";
import { usePet } from "@/modules/collection/usePet";

const { pets, init } = usePet();

onMounted(() => {
  init();
});

const getPetIcon = (type: string) => {
  // All pets now have custom assets!
  // Fallback to Emoji CDN only for unknown types
  const getUrl = (emoji: string) =>
    `https://emojicdn.elk.sh/${emoji}?style=twitter`;

  const icons: Record<string, string> = {
    // Common
    slime: "/pets/slime.png",
    rock: "/pets/rock.png",
    worm: "/pets/worm.png",
    // Uncommon
    beetle: "/pets/beetle.png",
    bat: "/pets/bat.png",
    wolf: "/pets/wolf.png",
    // Rare
    ghost: "/pets/ghost.png",
    golem: "/pets/golem.png",
    griffin: "/pets/griffin.png",
    // Epic
    unicorn: "/pets/unicorn.png",
    phoenix: "/pets/phoenix.png",
    hydra: "/pets/hydra.png",
    // Legendary
    dragon: "/pets/dragon.png",
    titan: "/pets/titan.png",
    angel: "/pets/angel.png",
    // Mythic
    cthulhu: "/pets/cthulhu.png",
    leviathan: "/pets/leviathan.png",
    // Divine
    "the creator": "/pets/the creator.png",
  };
  return icons[type] || icons[type.toLowerCase()] || getUrl("👾");
};
</script>

<template>
  <div class="pet-collection p-4">
    <!-- Empty State -->
    <div
      v-if="pets.length === 0"
      class="flex flex-col items-center justify-center p-8 text-gray-500 space-y-4"
    >
      <div class="text-4xl">🕸️</div>
      <p>Your collection is empty.</p>
      <p class="text-xs">Go hatch some eggs!</p>
    </div>

    <!-- Grid -->
    <div v-else class="grid grid-cols-3 gap-4">
      <div
        v-for="pet in pets"
        :key="pet.id"
        class="aspect-square bg-gray-900 border border-gray-800 rounded-xl flex flex-col items-center justify-center relative group"
      >
        <div
          class="w-16 h-16 animate-bounce flex items-center justify-center p-2"
        >
          <img
            :src="getPetIcon(pet.type)"
            :alt="pet.type"
            class="w-full h-full object-contain filter drop-shadow-lg"
          />
        </div>
        <p
          class="text-[10px] mt-2 font-bold text-gray-400 group-hover:text-white transition-colors truncate w-full text-center px-1"
        >
          {{ pet.name }}
        </p>
        <div
          v-if="['divine', 'mythic', 'legendary'].includes(pet.rarity)"
          class="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl pointer-events-none"
        ></div>
      </div>
    </div>
  </div>
</template>
