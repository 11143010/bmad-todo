import { registerSW } from "virtual:pwa-register";

export const updateSW = registerSW({
  onNeedRefresh() {
    // Logic to show "Update Available" toast would go here
    // For now, we rely on autoUpdate
    console.log("PWA: Content is available offline or update is needed");
  },
  onOfflineReady() {
    console.log("PWA: App is ready to work offline");
  },
});

export const initPWA = () => {
  // Just ensuring the import side-effects or updateSW existence is enough
  console.log("PWA: Initialized");
};
