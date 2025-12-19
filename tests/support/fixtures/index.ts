import { test as base } from "@playwright/test";

/**
 * BMad E2E Test Fixtures
 *
 * Extends Playwright's base test with custom fixtures for:
 * - Database reset between tests
 * - Task creation helpers
 * - Metabolism state control
 */

type BMadFixtures = {
  /** Reset IndexedDB to clean state */
  cleanDatabase: void;
  /** Helper to create tasks via UI */
  createTask: (
    title: string,
    size: "snack" | "meal" | "feast"
  ) => Promise<void>;
};

export const test = base.extend<BMadFixtures>({
  // Clean database before each test
  cleanDatabase: [
    async ({ page }, use) => {
      // Clear IndexedDB
      await page.evaluate(async () => {
        const databases = await indexedDB.databases();
        for (const db of databases) {
          if (db.name) {
            indexedDB.deleteDatabase(db.name);
          }
        }
      });
      await use();
    },
    { auto: true },
  ],

  // Helper to create a task through the UI
  createTask: async ({ page }, use) => {
    const createTask = async (
      title: string,
      size: "snack" | "meal" | "feast"
    ) => {
      // Open task input
      await page.click('[data-testid="add-task-button"]');

      // Enter title
      await page.fill('[data-testid="task-input"]', title);
      await page.keyboard.press("Enter");

      // Select size
      const sizeMap = { snack: "10", meal: "30", feast: "50" };
      await page.click(`[data-testid="size-${sizeMap[size]}"]`);
    };

    await use(createTask);
  },
});

export { expect } from "@playwright/test";
