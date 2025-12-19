import { describe, it, expect, beforeEach, vi } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useMetabolismStore } from "@/stores/metabolism.store";

describe("Metabolism Store", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  describe("loadPercentage", () => {
    it("should calculate load percentage correctly", () => {
      const store = useMetabolismStore();

      store.currentLoad = 50;
      store.dailyLimit = 100;

      expect(store.loadPercentage).toBe(50);
    });

    it("should cap at 999% for extreme overflow", () => {
      const store = useMetabolismStore();

      store.currentLoad = 10000;
      store.dailyLimit = 100;

      expect(store.loadPercentage).toBe(999);
    });

    it("should return 0 when daily limit is 0", () => {
      const store = useMetabolismStore();

      store.currentLoad = 50;
      store.dailyLimit = 0;

      expect(store.loadPercentage).toBe(0);
    });
  });

  describe("isOverflow", () => {
    it("should be true when load exceeds limit", () => {
      const store = useMetabolismStore();

      store.currentLoad = 110;
      store.dailyLimit = 100;

      expect(store.isOverflow).toBe(true);
    });

    it("should be false when load equals limit", () => {
      const store = useMetabolismStore();

      store.currentLoad = 100;
      store.dailyLimit = 100;

      expect(store.isOverflow).toBe(false);
    });
  });

  describe("isKitchenClosed", () => {
    it("should be true when overflow and not overridden", () => {
      const store = useMetabolismStore();

      store.currentLoad = 110;
      store.dailyLimit = 100;
      store.overrideActive = false;

      expect(store.isKitchenClosed).toBe(true);
    });

    it("should be false when overflow but overridden", () => {
      const store = useMetabolismStore();

      store.currentLoad = 110;
      store.dailyLimit = 100;
      store.activateOverride();

      expect(store.isKitchenClosed).toBe(false);
    });
  });

  describe("dailyReset", () => {
    it("should reset load and override", () => {
      const store = useMetabolismStore();

      store.currentLoad = 150;
      store.overrideActive = true;

      store.dailyReset();

      expect(store.currentLoad).toBe(0);
      expect(store.overrideActive).toBe(false);
    });
  });
});
