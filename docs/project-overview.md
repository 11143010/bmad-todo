# 專案總覽 (Project Overview)

## 簡介

BMad (可能為 "Be Mad" 或 "Burn Metabolics" 的縮寫) 是一個結合**代謝隱喻 (Metabolic Metaphor)** 的待辦事項應用程式。它不僅僅是一個清單，更引入了 "壓力" (Stress) 與 "消化" (Digestion) 的概念，將任務視為需要被消化和代謝的能量。

## 核心架構

本專案採用 **Offline-First 單體式前端架構 (Client-Side Monolith)**。
所有資料主要儲存在用戶端 (Browser)，支援 PWA (Progressive Web App) 離線操作。

### 技術堆疊 (Tech Stack)

| 類別         | 技術        | 版本     | 用途                                            |
| ------------ | ----------- | -------- | ----------------------------------------------- |
| **核心框架** | Vue 3       | ^3.5.24  | 使用 `<script setup>` 與 Composition API。      |
| **建置工具** | Vite        | -        | 快速開發與建置。                                |
| **狀態管理** | Pinia       | ^3.0.4   | 應用程式全域狀態管理。                          |
| **資料庫**   | RxDB        | ^16.21.1 | Reactive Database，底層使用 Dexie (IndexedDB)。 |
| **樣式系統** | TailwindCSS | ^4.1.18  | Utility-first CSS 框架。                        |
| **測試框架** | Vitest      | ^4.0.16  | 單元測試與測試執行器。                          |
| **E2E 測試** | Playwright  | ^1.57.0  | 端對端整合測試。                                |

## 應用程式流程

1.  **進入點** (`main.ts`)：初始化 PWA、RxDB 資料庫，掛載 Vue 應用。
2.  **主畫面** (`App.vue`)：
    - **StomachGauge**：視覺化當前壓力/負載狀態。
    - **Plate**：任務清單的主要互動區域 (排序、拖曳、新增)。
    - **SystemOverload**：當壓力過大時的阻斷機制。
3.  **資料流**：
    - 使用者操作 UI -> Pinia Store Action -> RxDB/LocalStorage -> UI Reactivity (Subscription).

## 專案特色

- **Gamification**：將任務完成視為 "消化"，累積壓力會有 "系統過載" (System Overload) 風險。
- **Isomorphic Logic**：部分業務邏輯 (如任務切分 `chopTask`) 封裝在 Store 中。
- **PWA**：完整的離線支援與安裝能力。
