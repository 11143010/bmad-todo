// Vitest setup file
import { setActivePinia, createPinia } from "pinia";
import { beforeEach, vi } from "vitest";

// Create fresh Pinia instance for each test
beforeEach(() => {
  setActivePinia(createPinia());
});

// Mock RxDB database module
vi.mock("@/modules/db", () => ({
  getDB: vi.fn(() =>
    Promise.resolve({
      tasks: {
        find: vi.fn(() => ({
          $: { subscribe: vi.fn() },
          exec: vi.fn(() => Promise.resolve([])),
        })),
        findOne: vi.fn(() => ({
          $: { subscribe: vi.fn() },
          exec: vi.fn(() => Promise.resolve(null)),
        })),
        insert: vi.fn(() => Promise.resolve()),
        bulkInsert: vi.fn(() => Promise.resolve()),
      },
      settings: {
        findOne: vi.fn(() => ({
          $: { subscribe: vi.fn() },
          exec: vi.fn(() => Promise.resolve(null)),
        })),
      },
    })
  ),
}));

// Mock sensory module
vi.mock("@/modules/sensory", () => ({
  sensory: {
    play: vi.fn(),
    vibrate: vi.fn(),
  },
}));
