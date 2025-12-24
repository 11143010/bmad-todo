<script setup lang="ts">
import { ref } from "vue";
import { useUserStore } from "@/stores/user.store";
import EggMarket from "@/modules/incubator/components/EggMarket.vue";
import PetCollection from "@/modules/collection/components/PetCollection.vue";

const activeTab = ref<"incubator" | "collection">("incubator");
const userStore = useUserStore();
</script>

<template>
  <div
    class="gamification-center w-full bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden flex flex-col h-[500px]"
  >
    <!-- Header Area (Dynamic Title) -->
    <div
      class="p-4 border-b border-white/10 flex justify-between items-center bg-black/20"
    >
      <h2 class="text-xl font-black italic text-white tracking-widest">
        {{ activeTab === "incubator" ? "INCUBATOR LAB" : "PET COLLECTION" }}
      </h2>

      <!-- Energy Display -->
      <div
        class="px-4 py-2 rounded-full border border-yellow-500/50 bg-black/50 text-yellow-500 font-mono font-bold flex items-center gap-2 shadow-[0_0_10px_rgba(234,179,8,0.2)]"
      >
        ⚡ {{ userStore.energy }}
      </div>
    </div>

    <!-- Content Area (Scrollable) -->
    <div class="flex-1 overflow-y-auto custom-scrollbar relative">
      <Transition
        enter-active-class="transition-opacity duration-300 ease-out"
        enter-from-class="opacity-0 translate-y-2"
        leave-active-class="hidden"
      >
        <div v-if="activeTab === 'incubator'" class="p-4">
          <EggMarket :minimal="true" />
        </div>
        <div v-else-if="activeTab === 'collection'" class="p-4">
          <PetCollection />
        </div>
      </Transition>
    </div>

    <!-- Bottom Navigation Bar -->
    <div class="flex border-t border-white/10 bg-black/60 backdrop-blur-xl">
      <button
        @click="activeTab = 'incubator'"
        class="flex-1 py-4 flex flex-col items-center justify-center gap-1 transition-all group"
        :class="
          activeTab === 'incubator'
            ? 'text-purple-400 bg-white/5'
            : 'text-gray-500 hover:text-gray-300'
        "
      >
        <span class="text-2xl transition-transform group-active:scale-95"
          >🥚</span
        >
        <span class="text-[10px] font-bold tracking-wider uppercase"
          >Incubator</span
        >
      </button>

      <div class="w-px bg-white/10"></div>

      <button
        @click="activeTab = 'collection'"
        class="flex-1 py-4 flex flex-col items-center justify-center gap-1 transition-all group"
        :class="
          activeTab === 'collection'
            ? 'text-green-400 bg-white/5'
            : 'text-gray-500 hover:text-gray-300'
        "
      >
        <span class="text-2xl transition-transform group-active:scale-95"
          >🐾</span
        >
        <span class="text-[10px] font-bold tracking-wider uppercase"
          >Collection</span
        >
      </button>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.2);
}
</style>
