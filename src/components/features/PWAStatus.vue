<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useI18n } from "@/modules/i18n";

const { t } = useI18n();
const showPrompt = ref(false);
const isOffline = ref(!navigator.onLine);

onMounted(() => {
  window.addEventListener("online", () => {
    isOffline.value = false;
    showPrompt.value = true;
    setTimeout(() => {
      showPrompt.value = false;
    }, 3000);
  });

  window.addEventListener("offline", () => {
    isOffline.value = true;
  });
});

const dismiss = () => {
  showPrompt.value = false;
  isOffline.value = false;
};
</script>

<template>
  <!-- Offline Banner -->
  <Transition
    enter-active-class="transition ease-out duration-300"
    enter-from-class="opacity-0 -translate-y-full"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition ease-in duration-200"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 -translate-y-full"
  >
    <div
      v-if="isOffline"
      class="fixed top-0 left-0 right-0 z-[200] bg-amber-500 text-black py-2 px-4 text-center text-sm font-bold"
    >
      <span class="mr-2">📡</span>
      {{ t("pwa.offline") }}
      <button @click="dismiss" class="ml-4 text-black/50 hover:text-black">
        ✕
      </button>
    </div>
  </Transition>

  <!-- Online Restored Toast -->
  <Transition
    enter-active-class="transition ease-out duration-300"
    enter-from-class="opacity-0 translate-y-4"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition ease-in duration-200"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 translate-y-4"
  >
    <div
      v-if="showPrompt && !isOffline"
      class="fixed bottom-4 right-4 z-[200] bg-green-500 text-white py-3 px-6 rounded-lg shadow-lg text-sm font-medium flex items-center gap-3"
    >
      <span>✅ {{ t("pwa.online") }}</span>
      <button
        @click="showPrompt = false"
        class="text-white/70 hover:text-white"
      >
        ✕
      </button>
    </div>
  </Transition>
</template>
