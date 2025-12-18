<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";

// Global keyboard shortcuts
const handleKeydown = (e: KeyboardEvent) => {
  // Ignore if user is typing in an input
  const target = e.target as HTMLElement;
  if (
    target.tagName === "INPUT" ||
    target.tagName === "TEXTAREA" ||
    target.isContentEditable
  ) {
    return;
  }

  // Cmd/Ctrl + K - Focus task input
  if ((e.metaKey || e.ctrlKey) && e.key === "k") {
    e.preventDefault();
    const input = document.querySelector(
      'input[placeholder*="你在想什麼"]'
    ) as HTMLInputElement;
    if (input) {
      input.focus();
    }
  }

  // Escape - Close any open modal
  if (e.key === "Escape") {
    // Find and click close buttons in open modals
    const closeBtn = document.querySelector(
      "[data-close-modal]"
    ) as HTMLButtonElement;
    if (closeBtn) {
      closeBtn.click();
    }
  }

  // ? - Show keyboard shortcuts help
  if (e.key === "?" && e.shiftKey) {
    e.preventDefault();
    showHelp();
  }
};

const showHelp = () => {
  // Create a simple toast-like notification
  const help = document.createElement("div");
  help.className =
    "fixed bottom-4 left-4 z-[300] bg-zinc-800 border border-zinc-700 rounded-xl p-6 shadow-2xl max-w-sm";
  help.innerHTML = `
    <div class="text-lg font-bold text-white mb-4">⌨️ 快捷鍵</div>
    <div class="space-y-2 text-sm text-zinc-300">
      <div class="flex justify-between"><span>聚焦輸入框</span><kbd class="bg-zinc-700 px-2 py-1 rounded text-xs">⌘K</kbd></div>
      <div class="flex justify-between"><span>關閉 Modal</span><kbd class="bg-zinc-700 px-2 py-1 rounded text-xs">Esc</kbd></div>
      <div class="flex justify-between"><span>顯示快捷鍵</span><kbd class="bg-zinc-700 px-2 py-1 rounded text-xs">?</kbd></div>
    </div>
    <div class="mt-4 text-xs text-zinc-500">點擊任意處關閉</div>
  `;

  document.body.appendChild(help);

  const close = () => {
    help.remove();
    document.removeEventListener("click", close);
  };

  setTimeout(() => {
    document.addEventListener("click", close);
  }, 100);

  setTimeout(() => {
    help.remove();
  }, 5000);
};

onMounted(() => {
  document.addEventListener("keydown", handleKeydown);
});

onUnmounted(() => {
  document.removeEventListener("keydown", handleKeydown);
});
</script>

<template>
  <!-- This component doesn't render anything visible, it just handles keyboard shortcuts -->
  <div class="hidden"></div>
</template>
