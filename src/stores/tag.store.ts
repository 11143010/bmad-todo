import { defineStore } from "pinia";
import { ref } from "vue";

export interface Tag {
  id: string;
  name: string;
  color: string;
  emoji: string;
}

// Default tags
const DEFAULT_TAGS: Tag[] = [
  { id: "work", name: "工作", color: "#3b82f6", emoji: "💼" },
  { id: "personal", name: "個人", color: "#22c55e", emoji: "🏠" },
  { id: "urgent", name: "緊急", color: "#ef4444", emoji: "🔥" },
  { id: "learning", name: "學習", color: "#a855f7", emoji: "📚" },
  { id: "health", name: "健康", color: "#14b8a6", emoji: "💪" },
];

export const useTagStore = defineStore("tags", () => {
  const tags = ref<Tag[]>([]);
  const taskTags = ref<Record<string, string[]>>({}); // taskId -> tagIds[]

  const init = () => {
    // Load tags
    const savedTags = localStorage.getItem("bmad-tags");
    if (savedTags) {
      const parsed = JSON.parse(savedTags) as Tag[];
      tags.value = parsed.length > 0 ? parsed : DEFAULT_TAGS;
    } else {
      tags.value = DEFAULT_TAGS;
    }
    save();

    // Load task-tag associations
    const savedTaskTags = localStorage.getItem("bmad-task-tags");
    if (savedTaskTags) {
      taskTags.value = JSON.parse(savedTaskTags);
    }
  };

  const save = () => {
    localStorage.setItem("bmad-tags", JSON.stringify(tags.value));
    localStorage.setItem("bmad-task-tags", JSON.stringify(taskTags.value));
  };

  const addTag = (name: string, color: string, emoji: string) => {
    const id = `tag-${Date.now()}`;
    tags.value.push({ id, name, color, emoji });
    save();
    return id;
  };

  const removeTag = (tagId: string) => {
    tags.value = tags.value.filter((t) => t.id !== tagId);
    // Remove from all task associations
    for (const taskId in taskTags.value) {
      const current = taskTags.value[taskId];
      if (current) {
        taskTags.value[taskId] = current.filter((id) => id !== tagId);
      }
    }
    save();
  };

  const assignTag = (taskId: string, tagId: string) => {
    if (!taskTags.value[taskId]) {
      taskTags.value[taskId] = [];
    }
    if (!taskTags.value[taskId].includes(tagId)) {
      taskTags.value[taskId].push(tagId);
      save();
    }
  };

  const unassignTag = (taskId: string, tagId: string) => {
    if (taskTags.value[taskId]) {
      taskTags.value[taskId] = taskTags.value[taskId].filter(
        (id) => id !== tagId
      );
      save();
    }
  };

  const getTaskTags = (taskId: string): Tag[] => {
    const tagIds = taskTags.value[taskId] || [];
    return tags.value.filter((t) => tagIds.includes(t.id));
  };

  const toggleTag = (taskId: string, tagId: string) => {
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
