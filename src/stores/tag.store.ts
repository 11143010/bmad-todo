import { defineStore } from "pinia";
import { ref } from "vue";

export interface Tag {
  id: string;
  name: string;
  color: string;
  emoji: string;
}

/** Default tags for new users */
const DEFAULT_TAGS: Tag[] = [
  { id: "work", name: "工作", color: "#3b82f6", emoji: "💼" },
  { id: "personal", name: "個人", color: "#22c55e", emoji: "🏠" },
  { id: "urgent", name: "緊急", color: "#ef4444", emoji: "🔥" },
  { id: "learning", name: "學習", color: "#a855f7", emoji: "📚" },
  { id: "health", name: "健康", color: "#14b8a6", emoji: "💪" },
];

/** LocalStorage key for tags */
const STORAGE_KEY_TAGS = "bmad-tags";

/** LocalStorage key for task-tag associations */
const STORAGE_KEY_TASK_TAGS = "bmad-task-tags";

export const useTagStore = defineStore("tags", () => {
  const tags = ref<Tag[]>([]);
  const taskTags = ref<Record<string, string[]>>({}); // taskId -> tagIds[]

  /**
   * Initialize the tag store from localStorage
   * @returns {void}
   */
  const init = (): void => {
    // Load tags
    const savedTags = localStorage.getItem(STORAGE_KEY_TAGS);
    if (savedTags) {
      const parsed = JSON.parse(savedTags) as Tag[];
      tags.value = parsed.length > 0 ? parsed : DEFAULT_TAGS;
    } else {
      tags.value = DEFAULT_TAGS;
    }
    save();

    // Load task-tag associations
    const savedTaskTags = localStorage.getItem(STORAGE_KEY_TASK_TAGS);
    if (savedTaskTags) {
      taskTags.value = JSON.parse(savedTaskTags);
    }
  };

  /**
   * Save tags and task-tag associations to localStorage
   * @returns {void}
   */
  const save = (): void => {
    localStorage.setItem(STORAGE_KEY_TAGS, JSON.stringify(tags.value));
    localStorage.setItem(STORAGE_KEY_TASK_TAGS, JSON.stringify(taskTags.value));
  };

  /**
   * Add a new tag
   * @param {string} name - Tag name
   * @param {string} color - Tag color (hex)
   * @param {string} emoji - Tag emoji
   * @returns {string} The new tag's ID
   */
  const addTag = (name: string, color: string, emoji: string): string => {
    const id = `tag-${Date.now()}`;
    tags.value.push({ id, name, color, emoji });
    save();
    return id;
  };

  /**
   * Remove a tag by ID
   * @param {string} tagId - The tag ID to remove
   * @returns {void}
   */
  const removeTag = (tagId: string): void => {
    tags.value = tags.value.filter((tag) => tag.id !== tagId);
    // Remove from all task associations
    for (const taskId in taskTags.value) {
      const currentTags = taskTags.value[taskId];
      if (currentTags) {
        taskTags.value[taskId] = currentTags.filter((id) => id !== tagId);
      }
    }
    save();
  };

  /**
   * Assign a tag to a task
   * @param {string} taskId - The task ID
   * @param {string} tagId - The tag ID to assign
   * @returns {void}
   */
  const assignTag = (taskId: string, tagId: string): void => {
    if (!taskTags.value[taskId]) {
      taskTags.value[taskId] = [];
    }
    if (!taskTags.value[taskId].includes(tagId)) {
      taskTags.value[taskId].push(tagId);
      save();
    }
  };

  /**
   * Remove a tag from a task
   * @param {string} taskId - The task ID
   * @param {string} tagId - The tag ID to remove
   * @returns {void}
   */
  const unassignTag = (taskId: string, tagId: string): void => {
    if (taskTags.value[taskId]) {
      taskTags.value[taskId] = taskTags.value[taskId].filter(
        (id) => id !== tagId
      );
      save();
    }
  };

  /**
   * Get all tags assigned to a task
   * @param {string} taskId - The task ID
   * @returns {Tag[]} Array of tags assigned to the task
   */
  const getTaskTags = (taskId: string): Tag[] => {
    const tagIds = taskTags.value[taskId] || [];
    return tags.value.filter((tag) => tagIds.includes(tag.id));
  };

  /**
   * Toggle a tag on a task (assign if not assigned, unassign if assigned)
   * @param {string} taskId - The task ID
   * @param {string} tagId - The tag ID to toggle
   * @returns {void}
   */
  const toggleTag = (taskId: string, tagId: string): void => {
    if (taskTags.value[taskId]?.includes(tagId)) {
      unassignTag(taskId, tagId);
    } else {
      assignTag(taskId, tagId);
    }
  };

  return {
    tags,
    taskTags,
    init,
    addTag,
    removeTag,
    assignTag,
    unassignTag,
    getTaskTags,
    toggleTag,
  };
});
