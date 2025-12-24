# 資料模型 (Data Models)

本專案採用混合式資料儲存策略，主要資料存放於 **RxDB (IndexedDB)**，部分設定與標籤存放於 **LocalStorage**。

## RxDB 資料庫 (`bmaddb`)

### 1. Tasks Collection (`tasks`)

核心任務資料，對應 `task.schema.ts`。

| 欄位名稱    | 類型     | 說明                                        |
| ----------- | -------- | ------------------------------------------- |
| `id`        | `string` | UUID，主鍵。                                |
| `title`     | `string` | 任務標題。                                  |
| `status`    | `string` | `active` (進行中) 或 `completed` (已完成)。 |
| `points`    | `number` | 任務點數 (壓力值/重量)，預設為 0。          |
| `createdAt` | `number` | 建立時間戳記。                              |
| `order`     | `number` | 排序索引 (Migration 1 新增)。               |

### 2. Settings Collection (`settings`)

全域設定，對應 `settings.schema.ts`。

| 欄位名稱         | 類型      | 說明                          |
| ---------------- | --------- | ----------------------------- |
| `id`             | `string`  | 通常為 `user` (單一文檔)。    |
| `dailyLimit`     | `number`  | 每日壓力上限，預設 100。      |
| `soundEnabled`   | `boolean` | 是否開啟音效。                |
| `hapticsEnabled` | `boolean` | 是否開啟觸覺回饋。            |
| `fontSize`       | `string`  | 字體大小 (Migration 1 新增)。 |

### 3. Daily Logs Collection (`daily_logs`)

每日統計紀錄，對應 `daily-log.schema.ts`。
_主要用於 Analytics Dashboard。_

## LocalStorage 儲存

### Tags (`bmad-tags`)

標籤定義列表。

```typescript
interface Tag {
  id: string;
  name: string; // 例如："工作", "個人"
  color: string; // Hex color
  emoji: string;
}
```

### Task-Tag 關聯 (`bmad-task-tags`)

任務與標籤的多對多關聯映射。

- **Key**: `bmad-task-tags`
- **Structure**: `Record<TaskId, TagId[]>` (例如：`{ "task-1": ["tag-a", "tag-b"] }`)

## 資料關聯圖 (ERD 概念)

- **Task** (RxDB) <--- (ID Reference) ---> **TaskTags** (LocalStorage) <--- (ID Reference) ---> **Tag** (LocalStorage)
- **SystemOverload** 計算依賴於 `tasks` 中所有 `active` 狀態任務的 `points` 總和。
