# 元件清單 (Component Inventory)

BMad 的 UI 介面由多個功能性元件組成，主要位於 `src/components/features/`。

## 核心介面 (Core Interface)

### `Plate.vue`

- **功能**: 應用程式的主要工作區域 ("盤子")。
- **職責**:
  - 顯示任務清單 (`draggable` 實現拖拉排序)。
  - 提供排序切換 (最新/最重/最輕/手動)。
  - 處理搜尋過濾。
  - 任務操作入口 (完成、秤重、切分、標籤、刪除)。
- **視覺**: 包含 "Galaxy Theme" 的背景動效 (Stardust Burst)。

### `StomachGauge.vue`

- **功能**: 視覺化壓力儀表板 ("胃")。
- **職責**:
  - 顯示當前壓力百分比 (Current Load / Daily Limit)。
  - **星球演化視覺**: 根據壓力階段改變星球狀態 (Peaceful -> Developing -> Critical -> Exploding)。
  - 動畫: Shake, Pulse, Explode 效果。

### `TaskInput.vue`

- **功能**: 新增任務的輸入框。
- **職責**: 快速輸入並呼叫 `taskStore.addTask()`。

## 系統控制 (System Controls)

### `SettingsPanel.vue`

- **功能**: 設定面板。
- **內容**: 調整每日上限、開關音效/觸覺回饋。

### `SystemOverload.vue`

- **功能**: 系統過載遮罩。
- **觸發**: 當壓力超過 100% 時顯示，阻斷操作並發出警示。

### `ShutdownButton.vue`

- **功能**: 關閉系統 (模擬)。
- **用途**: 提供一種 "登出" 或 "結束一天" 的儀式感。

## 輔助模態框 (Modals)

### `ChopperModal.vue`

- **用途**: 執行 "切分任務" (Chopping) 的介面。
- **互動**: 輸入多個子任務標題，將大任務分解。

### `StressEstimator.vue`

- **用途**: 執行 "秤重" (Weighing) 的介面。
- **互動**: 選擇任務的點數 (1, 2, 3, 5, 8...)。

### `TagSelector.vue`

- **用途**: 標籤選擇器 (Dropdown)。
- **互動**: 為任務新增或移除標籤。
