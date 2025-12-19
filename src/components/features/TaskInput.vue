<script setup lang="ts">
import { ref } from "vue";
import { useTaskStore } from "@/stores/task.store";
import { useStressStore } from "@/stores/stress.store";
import { useI18n } from "@/modules/i18n";

const { t } = useI18n();
const taskStore = useTaskStore();
const stress = useStressStore();
const newTaskTitle = ref("");
const isFocused = ref(false);

/**
 * Handle form submission
 */
const handleSubmit = async (): Promise<void> => {
  if (!newTaskTitle.value.trim()) return;
  if (stress.isSystemOverloaded) return;

  await taskStore.addTask(newTaskTitle.value);
  newTaskTitle.value = "";
};
</script>

<template>
  <div class="w-full mb-8 relative">
    <!-- Aurora Border Wrapper -->
    <div
      class="relative rounded-xl p-[1px] transition-all duration-300"
      :class="isFocused ? 'cosmic-glow-cyan' : ''"
      :style="{
        background: isFocused
          ? 'linear-gradient(90deg, var(--nebula-cyan), var(--nebula-purple), var(--nebula-pink))'
          : 'var(--glass-border)',
      }"
    >
      <div class="relative rounded-xl overflow-hidden">
        <input
          v-model="newTaskTitle"
          @keydown.enter="handleSubmit"
          @focus="isFocused = true"
          @blur="isFocused = false"
          type="text"
          :placeholder="t('input.placeholder')"
          class="w-full rounded-xl px-6 py-4 text-lg text-white placeholder-zinc-500 focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          style="
            background: linear-gradient(
              135deg,
              var(--space-dark) 0%,
              var(--space-mid) 100%
            );
            backdrop-filter: blur(12px);
          "
          :disabled="stress.isSystemOverloaded"
        />

        <!-- Enter Key Hint -->
        <div
          v-if="newTaskTitle"
          class="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono border rounded px-2 py-1 pointer-events-none transition-all"
          :class="
            isFocused
              ? 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10'
              : 'text-zinc-500 border-zinc-700'
          "
        >
          ENTER ↵
        </div>

        <!-- Focused Glow Effect -->
        <div
          v-if="isFocused"
          class="absolute inset-0 rounded-xl pointer-events-none"
          style="
            background: radial-gradient(
              ellipse at center,
              rgba(6, 182, 212, 0.1) 0%,
              transparent 70%
            );
          "
        ></div>
      </div>
    </div>

    <!-- Kitchen Closed Feedback -->
    <p
      v-if="stress.isSystemOverloaded"
      class="absolute -bottom-6 left-0 text-xs font-bold animate-pulse"
      style="color: var(--nebula-pink)"
    >
      {{ t("input.kitchenClosed") }}
    </p>
  </div>
</template>
