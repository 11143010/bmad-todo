import { test, expect } from "../support/fixtures";

test.describe("BMad Core Flows", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should display stomach gauge on load", async ({ page }) => {
    // The stomach gauge should be visible
    await expect(page.locator('[data-testid="stomach-gauge"]')).toBeVisible();
  });

  test("should add a task to the plate", async ({ page, createTask }) => {
    await createTask("Write proposal", "meal");

    // Task should appear in list
    await expect(page.locator("text=Write proposal")).toBeVisible();
  });

  test("should show Kitchen Closed when over limit", async ({ page }) => {
    // This test requires setting up metabolism store state
    // Add tasks until we exceed the limit
    await page.evaluate(() => {
      // Simulate reaching limit via localStorage or store manipulation
      localStorage.setItem("test-override-limit", "true");
    });

    await page.reload();

    // Kitchen closed UI should be visible
    await expect(page.locator('[data-testid="kitchen-closed"]')).toBeVisible();
  });

  test("should complete task with swipe gesture", async ({
    page,
    createTask,
  }) => {
    await createTask("Quick task", "snack");

    const taskItem = page.locator('[data-testid="task-item"]').first();

    // Swipe right to complete
    await taskItem.dragTo(taskItem, {
      targetPosition: { x: 200, y: 0 },
    });

    // Task should be marked as completed
    await expect(taskItem).toHaveClass(/completed/);
  });
});
