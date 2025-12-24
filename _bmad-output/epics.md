---
stepsCompleted: ["1", "2"]
inputDocuments:
  [
    "_bmad-output/prd.md",
    "_bmad-output/architecture.md",
    "_bmad-output/ux-design-specification.md",
  ]
---

# BMad (TodoList) - 史詩與故事清單

## 概覽 (Overview)

本文件詳細列出了 BMad (TodoList) 的史詩 (Epics) 與使用者故事 (User Stories) 分解。所有內容皆源自於 PRD 需求、UX 設計規範與架構決策。

## 需求盤點 (Requirements Inventory)

### 功能性需求 (Functional Requirements)

- **FR-1 任務管理 (Task Management)**:
  - 建立任務，包含標題與選填的詳細資訊。
  - 完成任務 (右滑/互動) 以獲得「能量」。
  - 刪除任務 (左滑/互動) 並提供震動回饋。
  - 檢視依狀態排序的任務列表。
- **FR-2 孵化機制 (Incubator Mechanics)**:
  - 消耗能量來獲取「異變蛋 (Eggs)」。
  - 隨時間孵化蛋 (倒數計時)。
  - 孵化完成後揭曉「寵物 (Pet)」。
- **FR-3 收藏系統 (Collection System)**:
  - 在圖鑑 (Gallery) 中檢視已收集的寵物。
  - 查看每隻寵物的詳細資料。
- **FR-4 防弊機制 (Anti-Cheat)**:
  - 透過伺服器端 Token/Timestamp 驗證孵化時間，防止竄改時間。
- **FR-5 離線模式 (Offline Mode)**:
  - 在無網路狀態下允許完整 CRUD 與孵化操作。
  - 恢復連線後自動同步資料。

### 非功能性需求 (NonFunctional Requirements)

- **NFR-1 離線優先 (Offline-First)**: 必須在無網路環境下完全可用。
- **NFR-2 極速回應 (Performance)**: 關鍵操作 (完成任務) 延遲 < 50ms。
- **NFR-3 視覺體驗 (Visuals)**: Neon Glow 與 Shake 特效需維持 60fps 流暢度。
- **NFR-4 無障礙設計 (Accessibility)**: 符合 WCAG 2.1 AA (支援螢幕閱讀器、減少動態模式)。
- **NFR-5 跨平台 (Platform)**: 可安裝於 iOS/Android 的 PWA。

### 額外需求 (Additional Requirements)

- **架構面 (Architecture)**:
  - **技術棧**: Vue 3 + Pinia + RxDB + Tailwind。
  - **結構**: Hybrid Modules (`modules/tasks`, `modules/incubator`)。
  - **安全**: 孵化動作需使用 Token-based Time Sync。
  - **遷移**: 僅允許「附加式 (Additive)」Schema 變更。
  - **測試**: 單元測試 (Vitest) + E2E (Playwright) + VRT (視覺回歸驗證)。
- **UX 設計 (UX Design)**:
  - **主題**: "The Neon Incubator" (深色模式、玻璃擬態、霓虹綠/粉)。
  - **互動**: 手機版採 Swipe Actions，桌面版採 Hover Actions。
  - **回饋**: 觸覺回饋 (Haptics) + 視覺震動 (Shake)。

### 需求覆蓋地圖 (FR Coverage Map)

- **FR-1, FR-5** -> Epic 1: 任務獵人 (The Task Hunter)
- **FR-2, FR-4** -> Epic 2: 霓虹孵化器 (The Neon Incubator)
- **FR-3** -> Epic 3: 收藏圖鑑 (The Collection)

## 史詩清單 (Epic List)

### Epic 1: 任務獵人 (The Task Hunter)

**目標**: 建立核心任務管理系統，讓使用者能透過完成任務獲取能量，並驗證離線架構的穩定性。
**涵蓋需求**: FR-1 (CRUD), FR-5 (Offline), NFR-1, NFR-2

### Epic 2: 霓虹孵化器 (The Neon Incubator)

**目標**: 實作核心遊戲化迴圈 (Core Loop)，讓使用者消耗能量孵化寵物，並包含防弊與高互動視覺特效。
**涵蓋需求**: FR-2 (Incubate), FR-4 (Anti-Cheat), NFR-3 (Visuals)

### Epic 3: 收藏圖鑑 (The Collection)

**目標**: 提供長期留存動力，讓使用者檢視與管理他們的戰利品 (寵物)，並完善無障礙體驗。
**涵蓋需求**: FR-3 (Collection), NFR-4 (Accessibility)

## Epic 1: 任務獵人 (The Task Hunter)

**目標**: 建立核心任務管理系統，讓使用者能透過完成任務獲取能量，並驗證離線架構的穩定性。

### Story 1.1: Project Initialization & PWA Setup

As a Developer (representing User needs for stability),
I want the basic Vitesse + RxDB project structure set up,
So that I can verify the app installs as a PWA and connects to the offline database.

**Acceptance Criteria:**
**Given** a fresh environment
**When** I run `npm run dev`
**Then** the app should load with the "Neon Incubator" dark theme background
**And** `vite-plugin-pwa` should generate a valid manifest (installable)
**And** The Browser Console should show "RxDB Database Initialized" without errors

### Story 1.2: The Neon Shell (App Layout)

As a User,
I want to see the main application interface with navigation,
So that I can move between the Incubator and Task List views.

**Acceptance Criteria:**
**Given** the app is open
**When** I view the main layout
**Then** I should see the Glassmorphism Sidebar (Desktop) or Bottom Dock (Mobile)
**And** The "User Energy" counter should be visible in the header (default 0)
**And** Clicking nav items should switch views with a smooth transition (Nuxt-like)

### Story 1.3: Core Task CRUD

As a User,
I want to create and complete tasks,
So that I can organize my day and earn Energy.

**Acceptance Criteria:**
**Given** I am on the Task List page
**When** I add a task "Buy Milk"
**Then** it should appear in the list immediately (Optimistic UI)
**When** I swipe right on the task
**Then** it should play a "Success" sound/haptic, disappear from the list, and Energy should increase by +10

## Epic 2: 霓虹孵化器 (The Neon Incubator)

**目標**: 實作核心遊戲化迴圈 (Core Loop)，讓使用者消耗能量孵化寵物，並包含防弊與高互動視覺特效。

### Story 2.1: The Egg Market (Economy)

As a User,
I want to spend my earned Energy to buy Eggs,
So that I can start the incubation process.

**Acceptance Criteria:**
**Given** I have enough Energy (>100)
**When** I click "Buy Egg" in the Incubator view
**Then** 100 Energy should be deducted
**And** An "Unhatched Egg" should appear in the incubator slot
**And** If I don't have enough Energy, a Toast message "Not enough energy" should appear

### Story 2.2: Incubation Logic (Time & Security)

As a User,
I want my Egg to incubate over time,
So that I can eventually hatch it (and I expect the game to be fair).

**Acceptance Criteria:**
**Given** I have purchased an Egg
**When** the incubation starts
**Then** a countdown timer (e.g., 30m) should be displayed on the Egg
**And** The system should request a `signed-timestamp` from the server to verify start time
**When** the timer reaches zero
**Then** the Egg state should change to "Ready to Hatch" ONLY if the server verifies the elapsed time

### Story 2.3: The Hatching Ritual (Reveal)

As a User,
I want to open my ready Egg and see what's inside,
So that I can get a reward for my patience.

**Acceptance Criteria:**
**Given** an Egg is "Ready to Hatch"
**When** I click the Egg
**Then** a "Shake" animation and Haptic vibration should play
**And** After 2 seconds, the Egg should crack open
**And** A random Pet (from the loot table) should be revealed and added to my Collection

## Epic 3: 收藏圖鑑 (The Collection)

**目標**: 提供長期留存動力，讓使用者檢視與管理他們的戰利品 (寵物)，並完善無障礙體驗。

### Story 3.1: The Pet Gallery (Grid View)

As a User,
I want to see all the pets I have collected,
So that I can feel a sense of progression and completion.

**Acceptance Criteria:**
**Given** I access the Collection Page
**When** the page loads
**Then** I should see a grid of all available pets
**And** Pets I own should be fully visible
**And** Pets I don't own should be shown as silhouettes (locked state)
**And** I can sort them by Rarity (Common, Rare, Legendary)

### Story 3.2: Pet Details (Inspection)

As a User,
I want to inspect a specific pet,
So that I can learn more about its lore and details.

**Acceptance Criteria:**
**Given** I am on the Collection Page
**When** I click on an unlocked pet
**Then** a Detail Modal should open
**And** It should show the Pet's 3D model/Image, Name, Description, and Hatch Date
**And** I can close the modal to return to the grid

### Story 3.3: Accessibility Polish (a11y)

As a User who relies on assistive technology,
I want the app to be navigable via screen readers and keyboard,
So that I can enjoy the game regardless of my ability.

**Acceptance Criteria:**
**Given** I am using a Screen Reader (VoiceOver/NVDA)
**When** I navigate the interface
**Then** all icon-only buttons (like "Close") must have descriptive `aria-label`s
**And** Incubator status changes should trigger an `aria-live` announcement
**And** When a Modal opens, focus should be trapped inside it until closed
