<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useTaskStore } from "@/stores/task.store";
import { useTagStore } from "@/stores/tag.store";
import CaloricEstimator from "@/components/features/CaloricEstimator.vue";
import ChopperModal from "@/components/features/ChopperModal.vue";
import TagSelector from "@/components/features/TagSelector.vue";
import StardustBurst from "@/components/features/StardustBurst.vue";
import { useI18n } from "@/modules/i18n";

const { t } = useI18n();
const taskStore = useTaskStore();
const tagStore = useTagStore();

// Initialize tag store
onMounted(() => {
  tagStore.init();
});

const taggingTaskId = ref<string | null>(null);

// Stardust burst animation state
const burstPosition = ref<{ x: number; y: number } | null>(null);

const estimatingTaskId = ref<string | null>(null);
const choppingTaskId = ref<string | null>(null);
const choppingTaskTitle = ref("");

// Sorting
type SortOption = "newest" | "oldest" | "points-asc" | "points-desc";
const sortBy = ref<SortOption>("newest");

const sortedTasks = computed(() => {
  const tasks = [...taskStore.tasks];
  switch (sortBy.value) {
    case "oldest":
      return tasks.sort((a, b) => a.createdAt - b.createdAt);
    case "points-asc":
      return tasks.sort((a, b) => a.points - b.points);
    case "points-desc":
      return tasks.sort((a, b) => b.points - a.points);
    case "newest":
    default:
      return tasks.sort((a, b) => b.createdAt - a.createdAt);
  }
});

/**
 * Format timestamp to HH:MM display format
 * @param {number} timestamp - Unix timestamp in milliseconds
 * @returns {string} Formatted time string
 */
const formatDate = (timestamp: number): string =>
  new Date(timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

/**
 * Open the caloric estimator modal for a task
 * @param {string} taskId - The task ID to estimate
 */
const openEstimator = (taskId: string): void => {
  estimatingTaskId.value = taskId;
};

/**
 * Close the caloric estimator modal
 */
const closeEstimator = (): void => {
  estimatingTaskId.value = null;
};

/**
 * Handle the estimation result and update the task
 * @param {number} points - The estimated points
 */
const handleEstimate = async (points: number): Promise<void> => {
  if (estimatingTaskId.value) {
    await taskStore.estimateTask(estimatingTaskId.value, points);
    closeEstimator();
  }
};

/**
 * Open the chopper modal for a task
 * @param {Object} task - The task to chop
 * @param {string} task.id - Task ID
 * @param {string} task.title - Task title
 */
const openChopper = (task: { id: string; title: string }): void => {
  choppingTaskId.value = task.id;
  choppingTaskTitle.value = task.title;
};

/**
 * Close the chopper modal
 */
const closeChopper = (): void => {
  choppingTaskId.value = null;
  choppingTaskTitle.value = "";
};

/**
 * Handle the chop result and create new subtasks
 * @param {string[]} newTitles - Array of new subtask titles
 */
const handleChop = async (newTitles: string[]): Promise<void> => {
  if (choppingTaskId.value) {
    await taskStore.chopTask(choppingTaskId.value, newTitles);
    closeChopper();
  }
};

/**
 * Handle task completion with stardust animation
 * @param {MouseEvent} event - Click event for position
 * @param {string} taskId - The task ID to complete
 */
const handleTaskComplete = async (
  event: MouseEvent,
  taskId: string
): Promise<void> => {
  // Get click position for burst animation
  burstPosition.value = {
    x: event.clientX,
    y: event.clientY,
  };

  // Complete the task
  await taskStore.completeTask(taskId);
};

/**
 * Clear the burst animation
 */
const clearBurst = (): void => {
  burstPosition.value = null;
};

// Edit mode
const editingTaskId = ref<string | null>(null);
const editingTitle = ref("");

/**
 * Start editing a task's title
 * @param {Object} task - The task to edit
 * @param {string} task.id - Task ID
 * @param {string} task.title - Current task title
 */
const startEdit = (task: { id: string; title: string }): void => {
  editingTaskId.value = task.id;
  editingTitle.value = task.title;
};

/**
 * Cancel the current edit operation
 */
const cancelEdit = (): void => {
  editingTaskId.value = null;
  editingTitle.value = "";
};

/**
 * Save the edited task title
 */
const saveEdit = async (): Promise<void> => {
  if (editingTaskId.value && editingTitle.value.trim()) {
    await taskStore.updateTaskTitle(editingTaskId.value, editingTitle.value);
    cancelEdit();
  }
};
</script>

<template>
  <div class="w-full">
    <!-- Header with Tech decoration -->
    <div class="flex items-center justify-between mb-6 px-1">
      <div class="flex items-center space-x-2 text-zinc-500">
        <div
          class="w-2 h-2 rounded-full animate-pulse"
          style="
            background: var(--nebula-cyan);
            box-shadow: 0 0 10px var(--nebula-cyan);
          "
        ></div>
        <h2 class="text-xs font-bold uppercase tracking-[0.25em] text-zinc-400">
          {{ t("plate.title") }} // 0{{ taskStore.tasks.length }}
        </h2>
      </div>
      <div
        class="h-px flex-1 ml-4 relative overflow-hidden"
        style="background: var(--glass-border)"
      >
        <div
          class="absolute inset-0 w-1/2 animate-[shimmer_2s_infinite]"
          style="
            background: linear-gradient(
              to right,
              transparent,
              var(--nebula-purple),
              transparent
            );
          "
        ></div>
      </div>
      <!-- Sort Buttons -->
      <div class="flex items-center gap-1 ml-2">
        <button
          @click="sortBy = 'newest'"
          class="text-[10px] px-2 py-1 rounded transition-colors"
          :class="
            sortBy === 'newest'
              ? 'bg-zinc-800 text-green-400'
              : 'text-zinc-600 hover:text-zinc-400'
          "
        >
          {{ t("plate.sort.new") }}
        </button>
        <button
          @click="sortBy = 'points-desc'"
          class="text-[10px] px-2 py-1 rounded transition-colors"
          :class="
            sortBy === 'points-desc'
              ? 'bg-zinc-800 text-green-400'
              : 'text-zinc-600 hover:text-zinc-400'
          "
        >
          {{ t("plate.sort.heavy") }}
        </button>
        <button
          @click="sortBy = 'points-asc'"
          class="text-[10px] px-2 py-1 rounded transition-colors"
          :class="
            sortBy === 'points-asc'
              ? 'bg-zinc-800 text-green-400'
              : 'text-zinc-600 hover:text-zinc-400'
          "
        >
          {{ t("plate.sort.light") }}
        </button>
      </div>
    </div>

    <!-- Empty State with cosmic theme -->
    <div
      v-if="taskStore.tasks.length === 0"
      class="flex flex-col items-center justify-center py-20 space-y-4 rounded-3xl"
      style="
        background: var(--glass-bg);
        border: 1px dashed var(--glass-border);
        backdrop-filter: blur(8px);
      "
    >
      <div
        class="text-5xl opacity-30 hover:opacity-100 transition-all duration-700 cursor-help"
        style="filter: drop-shadow(0 0 20px var(--nebula-purple))"
      >
        🌌
      </div>
      <p
        class="font-mono text-sm tracking-widest uppercase gradient-text opacity-60"
      >
        {{ t("plate.empty") }}
      </p>
    </div>

    <!-- Task List -->
    <TransitionGroup name="list" tag="div" class="space-y-4">
      <div
        v-for="task in sortedTasks"
        :key="task.id"
        class="task-card group relative overflow-hidden rounded-xl p-5 transition-all duration-300"
      >
        <!-- Hover Glow Effect -->
        <div
          class="absolute top-0 left-0 w-1 h-full transition-all duration-300"
          style="background: var(--glass-border)"
          :style="{
            background:
              task.points > 3 ? 'var(--nebula-pink)' : 'var(--glass-border)',
          }"
        ></div>

        <div class="flex items-start pl-4 justify-between">
          <div class="flex items-start space-x-4">
            <!-- Check Button -->
            <button
              @click="handleTaskComplete($event, task.id)"
              class="mt-1 w-5 h-5 rounded border border-zinc-600 hover:border-green-400 hover:bg-green-500/10 transition-all flex items-center justify-center group/check shrink-0 relative overflow-hidden"
            >
              <div
                class="absolute inset-0 bg-green-400 opacity-0 group-hover/check:opacity-10 transition-opacity"
              ></div>
            </button>

            <div class="space-y-1 flex-1">
              <!-- Editing Mode -->
              <div
                v-if="editingTaskId === task.id"
                class="flex items-center gap-2"
              >
                <input
                  v-model="editingTitle"
                  @keyup.enter="saveEdit"
                  @keyup.escape="cancelEdit"
                  class="flex-1 bg-zinc-800 border border-zinc-600 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-green-500"
                  autofocus
                />
                <button
                  @click="saveEdit"
                  class="text-green-500 hover:text-green-400 text-xs"
                >
                  ✓
                </button>
                <button
                  @click="cancelEdit"
                  class="text-zinc-500 hover:text-zinc-300 text-xs"
                >
                  ✕
                </button>
              </div>
              <!-- Display Mode -->
              <template v-else>
                <h3
                  @dblclick="startEdit(task)"
                  class="text-base text-zinc-200 font-medium tracking-wide group-hover:text-white transition-colors cursor-text"
                  :title="t('task.edit')"
                >
                  {{ task.title }}
                </h3>
              </template>
              <!-- Tags Display -->
              <div class="flex flex-wrap gap-1 mt-1">
                <span
                  v-for="tag in tagStore.getTaskTags(task.id)"
                  :key="tag.id"
                  class="text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1"
                  :style="{
                    backgroundColor: tag.color + '20',
                    color: tag.color,
                  }"
                >
                  {{ tag.emoji }} {{ tag.name }}
                </span>
              </div>
              <p
                class="text-[10px] text-zinc-500 font-mono uppercase tracking-wider"
              >
                ID: {{ task.id.slice(0, 4) }} //
                {{ formatDate(task.createdAt) }}
              </p>
            </div>
          </div>

          <!-- Actions -->
          <div class="pl-2 flex items-center space-x-3 relative">
            <!-- TAG BUTTON -->
            <div class="relative">
              <button
                @click="
                  taggingTaskId = taggingTaskId === task.id ? null : task.id
                "
                class="text-zinc-700 hover:text-amber-400 transition-colors p-1 opacity-0 group-hover:opacity-100"
                :title="t('tag.add')"
              >
                🏷️
              </button>
              <!-- Tag Selector Dropdown -->
              <TagSelector
                v-if="taggingTaskId === task.id"
                :taskId="task.id"
                @close="taggingTaskId = null"
              />
            </div>

            <!-- DELETE BUTTON -->
            <button
              @click="taskStore.deleteTask(task.id)"
              class="text-zinc-700 hover:text-red-400 transition-colors p-1 opacity-0 group-hover:opacity-100"
              :title="t('task.delete')"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M3 6h18" />
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
              </svg>
            </button>

            <!-- CHOPPER TRIGGER (Only if points > 3) -->
            <button
              v-if="task.points > 3"
              @click="openChopper(task)"
              class="text-zinc-600 hover:text-red-500 transition-colors p-1"
              :title="t('task.chop')"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="m2 2 20 20" />
                <path
                  d="m11 2 10.56 10.56a2 2 0 0 1 0 2.83l-1.93 1.93a2 2 0 0 1-2.83 0L6.24 6.76"
                />
              </svg>
            </button>

            <!-- WEIGH / POINTS -->
            <button
              v-if="task.points === 0"
              @click="openEstimator(task.id)"
              class="px-3 py-1 bg-zinc-950 border border-zinc-800 text-zinc-500 text-[10px] font-bold uppercase tracking-widest hover:border-zinc-600 hover:text-zinc-300 transition-all"
            >
              {{ t("task.weigh") }}
            </button>

            <div
              v-else
              @click="openEstimator(task.id)"
              class="flex flex-col items-center cursor-pointer group/points"
            >
              <div
                class="text-xl font-black font-mono leading-none"
                :class="
                  task.points > 3
                    ? 'text-red-500'
                    : 'text-zinc-400 group-hover/points:text-white'
                "
              >
                {{ task.points }}
              </div>
              <div
                class="text-[9px] text-zinc-600 uppercase font-bold tracking-tighter"
              >
                PTS
              </div>
            </div>
          </div>
        </div>
      </div>
    </TransitionGroup>

    <!-- Estimator Modal -->
    <Teleport to="body">
      <CaloricEstimator
        v-if="estimatingTaskId"
        @select="handleEstimate"
        @close="closeEstimator"
      />
    </Teleport>

    <!-- Chopper Modal -->
    <Teleport to="body">
      <ChopperModal
        v-if="choppingTaskId"
        :taskTitle="choppingTaskTitle"
        @chop="handleChop"
        @close="closeChopper"
      />
    </Teleport>

    <!-- Stardust Burst Animation -->
    <Teleport to="body">
      <StardustBurst
        v-if="burstPosition"
        :x="burstPosition.x"
        :y="burstPosition.y"
        @complete="clearBurst"
      />
    </Teleport>
  </div>
</template>

<style scoped>
/* List Transition Animations */
.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.5s cubic-bezier(0.22, 1, 0.36, 1);
}

.list-enter-from {
  opacity: 0;
  transform: translateX(-30px) scale(0.95);
}

.list-leave-to {
  opacity: 0;
  transform: translateX(50px) scale(0.9);
  filter: blur(4px);
}

/* Ensure leaving items are taken out of layout flow */
.list-leave-active {
  position: absolute;
  width: calc(100% - 2rem);
}

/* Completion flash effect */
@keyframes complete-flash {
  0% {
    background-color: transparent;
  }
  50% {
    background-color: rgba(34, 197, 94, 0.2);
  }
  100% {
    background-color: transparent;
  }
}

.completing {
  animation: complete-flash 0.3s ease-out;
}

/* Galaxy Theme Task Card */
.task-card {
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.task-card:hover {
  border-color: rgba(139, 92, 246, 0.3);
  box-shadow: 0 4px 24px rgba(139, 92, 246, 0.1);
}
</style>
