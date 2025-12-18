<script setup lang="ts">
import { ref, onMounted, nextTick } from "vue";

const props = defineProps<{
  taskTitle: string;
}>();

const emit = defineEmits<{
  (e: "chop", newTitles: string[]): void;
  (e: "close"): void;
}>();

const newTitles = ref<string[]>(["", ""]);
const inputRefs = ref<HTMLInputElement[]>([]);

const addSlice = () => {
  newTitles.value.push("");
  nextTick(() => {
    // Focus the new input
    const inputs = inputRefs.value;
    if (inputs && inputs.length > 0) {
      inputs[inputs.length - 1]?.focus();
    }
  });
};

const removeSlice = (index: number) => {
  if (newTitles.value.length <= 2) return; // Minimum 2 parts to "split"
  newTitles.value.splice(index, 1);
};

const executeChop = () => {
  // Filter empty
  const validTitles = newTitles.value
    .map((t) => t.trim())
    .filter((t) => t.length > 0);

  if (validTitles.length < 2) {
    return; // Must have at least 2 to be a "chop"
  }

  emit("chop", validTitles);
};

onMounted(() => {
  // Focus first input
  nextTick(() => {
    inputRefs.value[0]?.focus();
  });
});
</script>

<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/90 backdrop-blur-sm animate-in fade-in duration-200"
    @click.self="emit('close')"
  >
    <div
      class="w-full max-w-md bg-zinc-900 border-2 border-red-900/50 rounded-2xl shadow-2xl shadow-red-900/20 overflow-hidden flex flex-col max-h-[90vh]"
    >
      <!-- Header -->
      <div
        class="bg-zinc-950 p-6 border-b border-red-900/30 flex items-start justify-between relative overflow-hidden"
      >
        <!-- Background Decor -->
        <div
          class="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,#450a0a_10px,#450a0a_11px)] opacity-20"
        ></div>

        <div class="relative z-10">
          <h2
            class="text-red-500 font-black text-2xl uppercase tracking-tighter flex items-center gap-2"
          >
            <span>🔪</span> 任務切碎機
          </h2>
          <p class="text-zinc-500 text-xs font-mono mt-1">
            SPLITTING_PROTOCOL_INITIATED // 切分程序已啟動
          </p>
        </div>
        <button
          @click="emit('close')"
          class="text-zinc-500 hover:text-white transition-colors relative z-10"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 18 18" />
          </svg>
        </button>
      </div>

      <!-- Body -->
      <div class="p-6 overflow-y-auto flex-1 space-y-6">
        <!-- Target -->
        <div class="space-y-2">
          <label class="text-xs text-zinc-500 font-bold uppercase"
            >目標任務</label
          >
          <div
            class="text-xl text-zinc-400 font-medium line-through decoration-red-500/50 decoration-2"
          >
            {{ taskTitle }}
          </div>
        </div>

        <!-- Slices -->
        <div class="space-y-3">
          <label class="text-xs text-zinc-500 font-bold uppercase"
            >子任務 (切片)</label
          >
          <div
            v-for="(_title, index) in newTitles"
            :key="index"
            class="flex items-center gap-2 animate-in slide-in-from-left-2 duration-300"
            :style="{ animationDelay: `${index * 50}ms` }"
          >
            <div class="text-red-500/50 font-mono text-sm leading-none">
              {{ index + 1 }}
            </div>
            <input
              ref="inputRefs"
              v-model="newTitles[index]"
              type="text"
              class="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-zinc-200 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all placeholder-zinc-700"
              placeholder="輸入子任務..."
              @keydown.enter="
                index === newTitles.length - 1 ? addSlice() : null
              "
            />
            <button
              v-if="newTitles.length > 2"
              @click="removeSlice(index)"
              class="p-2 text-zinc-600 hover:text-red-400 transition-colors"
              tabindex="-1"
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
                <path d="M18 6 6 18" />
                <path d="m6 6 18 18" />
              </svg>
            </button>
          </div>
        </div>

        <button
          @click="addSlice"
          class="w-full py-3 border border-dashed border-zinc-800 rounded-lg text-zinc-500 hover:text-zinc-300 hover:border-zinc-700 hover:bg-zinc-900/50 transition-all text-sm font-bold uppercase tracking-wide flex items-center justify-center gap-2"
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
            <path d="M5 12h14" />
            <path d="M12 5v14" />
          </svg>
          新增切片
        </button>
      </div>

      <!-- Footer -->
      <div class="p-6 bg-zinc-950 border-t border-zinc-900">
        <button
          @click="executeChop"
          class="w-full bg-red-600 hover:bg-red-500 text-white font-black text-lg py-4 rounded-xl shadow-lg shadow-red-900/30 active:scale-95 transition-all flex items-center justify-center gap-2 group"
          :disabled="newTitles.filter((t) => t.trim().length > 0).length < 2"
          :class="
            newTitles.filter((t) => t.trim().length > 0).length < 2
              ? 'opacity-50 cursor-not-allowed'
              : ''
          "
        >
          <span>執行切碎 (EXECUTE)</span>
          <span class="group-hover:translate-x-1 transition-transform">🔪</span>
        </button>
      </div>
    </div>
  </div>
</template>
