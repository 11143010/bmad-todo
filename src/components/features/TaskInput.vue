<script setup lang="ts">
import { ref } from "vue";
import { useTaskStore } from "@/stores/task.store";
import { useMetabolismStore } from "@/stores/metabolism.store";
import { useI18n } from "@/modules/i18n";

const { t } = useI18n();
const taskStore = useTaskStore();
const metabolism = useMetabolismStore();
const newTaskTitle = ref("");

const handleSubmit = async () => {
  if (!newTaskTitle.value.trim()) return;
  if (metabolism.isKitchenClosed) return;

  await taskStore.addTask(newTaskTitle.value);
  newTaskTitle.value = "";
};
</script>

<template>
  <div class="w-full mb-8 relative">
    <div class="relative">
      <input
        v-model="newTaskTitle"
        @keydown.enter="handleSubmit"
        type="text"
        :placeholder="t('input.placeholder')"
        class="w-full bg-zinc-900 border-2 border-zinc-700 rounded-xl px-6 py-4 text-lg text-white placeholder-zinc-500 focus:outline-none focus:border-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="metabolism.isKitchenClosed"
      />

      <!-- Enter Key Hint -->
      <div
        class="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono text-zinc-500 border border-zinc-700 rounded px-2 py-1 pointer-events-none"
        v-if="newTaskTitle"
      >
        ENTER
      </div>
    </div>

    <!-- Kitchen Closed Feedback -->
    <p
      v-if="metabolism.isKitchenClosed"
      class="absolute -bottom-6 left-0 text-xs text-red-500 font-bold animate-pulse"
    >
      {{ t("input.kitchenClosed") }}
    </p>
  </div>
</template>
