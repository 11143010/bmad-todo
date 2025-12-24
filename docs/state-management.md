# 狀態管理 (State Management)

本專案使用 **Pinia** 作為全域狀態管理庫，並根據業務邏輯拆分為多個 Store。

## 主要 Stores

### 1. Task Store (`tasks`)

- **檔案**: `src/stores/task.store.ts`
- **職責**: 管理任務的生命週期 (CRUD)、排序與業務邏輯。
- **關鍵功能**:
  - `init()`: 訂閱 RxDB `active` 狀態的任務，實現即時更新。
  - `addTask(title)`: 新增任務，預設 0 分。
  - `chopTask(id, newTitles)`: 將大任務 "切碎" 為多個子任務 (核心 Gamification 機制)。
  - `estimateTask(id, points)`: 為任務 "秤重" (設定壓力點數)。
  - `archiveCompleted()`: 清除已完成任務。

### 2. Tag Store (`tags`)

- **檔案**: `src/stores/tag.store.ts`
- **職責**: 管理標籤與任務關聯。
- **特點**: 不依賴 RxDB，直接使用 `LocalStorage` 以及 `bmad-tags`, `bmad-task-tags` Keys。
- **資料結構**: 維護 `tags` (列表) 與 `taskTags` (關聯 Map)。

### 3. Stress Store (`stress`)

- **檔案**: `src/stores/stress.store.ts`
- **職責**: 計算當前系統負載 (Stress Level)。
- **計算邏輯**:
  - 監聽 `taskStore.tasks`。
  - 加總所有 `active` 任務的 `points`。
  - 判斷是否超過 `dailyLimit` (Overload)。
- **連動**: 驅動 `StomachGauge` 與 `SystemOverload` 元件。

### 4. Settings Store (`settings`)

- **檔案**: `src/stores/settings.store.ts`
- **職責**: 使用者偏好設定 (音效、觸覺、每日上限)。
- **持久化**: 透過 RxDB `settings` collection 儲存。

## 狀態設計模式

- **Init Pattern**: 每個 Store 都有 `init()` 方法，統一在 `App.vue/onMounted` 中呼叫。
- **Subscription**: Task Store 使用 RxDB 的 `$` observable 訂閱資料變更，自動同步到 `ref`。
- **Action Driven**: UI 僅呼叫 Actions (如 `chopTask`)，不直接修改 State。
