<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from "vue";
import { useTagStore } from "@/stores/tag.store";
import { useI18n } from "@/modules/i18n";

const props = defineProps<{
  taskId: string;
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

const { locale } = useI18n();
const tagStore = useTagStore();
const dropdownRef = ref<HTMLElement | null>(null);

const tags = computed(() => tagStore.tags);

const isTagAssigned = (tagId: string): boolean => {
  return tagStore.getTaskTags(props.taskId).some((t) => t.id === tagId);
};

const toggleTag = (tagId: string) => {
  tagStore.toggleTag(props.taskId, tagId);
  emit("close");
};

// Close on click outside
const handleClickOutside = (e: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target as Node)) {
    emit("close");
  }
};

onMounted(() => {
  setTimeout(() => {
    document.addEventListener("click", handleClickOutside);
  }, 100);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<template>
  <Teleport to="body">
    <div
      ref="dropdownRef"
      class="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl z-[100] min-w-[280px]"
    >
      <div class="text-sm font-bold text-white mb-3">
        {{ locale === "zh-TW" ? "選擇標籤" : "Select Tags" }}
      </div>

      <!-- Tags list -->
      <div class="space-y-2">
        <button
          v-for="tag in tags"
          :key="tag.id"
          @click.stop="toggleTag(tag.id)"
          class="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left"
          :class="
            isTagAssigned(tag.id)
              ? 'bg-zinc-800 text-white border border-zinc-600'
              : 'hover:bg-zinc-800 text-zinc-400 border border-transparent'
          "
        >
          <span class="text-xl">{{ tag.emoji }}</span>
          <span class="flex-1 font-medium">{{ tag.name }}</span>
          <span v-if="isTagAssigned(tag.id)" class="text-green-400 text-lg"
            >✓</span
          >
        </button>
      </div>

      <!-- Empty state -->
      <div
        v-if="tags.length === 0"
        class="text-zinc-500 text-sm py-4 text-center"
      >
        {{ locale === "zh-TW" ? "沒有可用標籤" : "No tags available" }}
      </div>

      <button
        @click="emit('close')"
        class="w-full mt-4 py-3 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors font-medium"
      >
        {{ locale === "zh-TW" ? "完成" : "Done" }}
      </button>
    </div>

    <!-- Backdrop -->
    <div class="fixed inset-0 bg-black/50 z-[99]" @click="emit('close')"></div>
  </Teleport>
</template>
