````
---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
inputDocuments:
  - _bmad-output/prd.md
  - _bmad-output/analysis/product-brief-TodoList-2025-12-19.md
workflowType: "ux-design"
lastStep: 0
project_name: "TodoList"
user_name: "Peng"
date: "2025-12-24"
---

# UX Design Specification TodoList

**Author:** Peng
**Date:** 2025-12-24

---

<!-- UX design content will be appended sequentially through collaborative workflow steps -->

## Executive Summary (執行摘要)

### Project Vision (專案願景)

**TodoList (Task-Hunter)** 不僅是一個待辦清單，更是一個 **「生產力孵化器 (Productivity Incubator)」**。它將完成任務的枯燥過程轉化為 **「孵化未知 (Mystery Hatching)」** 的驚喜體驗。核心價值在於將 **拖延的焦慮** 轉化為 **對變異/孵化的期待**。

### Target Users (目標使用者)

1.  **Sarah (The Healing Seeker)**: 上班族。追求 **療癒與低阻力**。她需要的是一個「桌寵」，在她完成工作時給予無壓力的陪伴與鼓勵。
2.  **Leo (The Study Gamer)**: 學生。追求 **成就感與帥氣**。他需要的是「打怪升級」的快感，以及可以向朋友炫耀的稀有收藏。

### Key Design Challenges (關鍵 UX 挑戰)

1.  **Delight vs. Efficiency**: 如何在提供豐富的孵化動畫與轉場時，不拖慢使用者「快速記下任務」的效率？(Performance < 100ms 是關鍵)。
2.  **Reward Perception**: 如何讓「變異 (Mutation)」雖然是任務失敗的結果，卻依然感覺有趣且值

### Target Users (目標使用者)

1.  **Sarah (The Healing Seeker)**: 上班族。 如何平衡「帥氣 (Cool)」與「醜萌 (Ugly/Funny)」兩種截然不同的美術風格在同一個介面中的和諧感？

### Design Opportunities (設計機會點)

1.  **Haptic & Micro-interactions**: 利用手機震動回饋與微動畫（蛋的晃動、裂開的瞬間）創造極致的「手感 (Juice)」。
2.  **Fail-Forward UI**: 專門設計「變異轉化為 Buff」的視覺儀式感，強化「失敗是成功之母」的產品哲學。

### Refinement (Feedback 1)

- User Feedback: "The outline of the progress bar is a bit faint." (進度條的外框有一點淡)
- Adjustment: Increased border contrast for functional containers (Progress Bar, Stats) to ensure better visibility against the dark background. Changed `border-white/5` to `border-white/30`.

## Step 10: User Journey Flows (使用者流程)

### 1. The Incubation Loop (孵化流程 - 核心與獎勵)

這是 BMad 的核心儀式，將「任務完成」轉化為「期待感」。

```mermaid
graph TD
    A[使用者點擊完成任務] -->|0-Latency Feedback| B(任務卡片發光並消失)
    B -->|累積能量| C{孵化器能量滿?}
    C -->|No| D[增加孵化進度條 +Exp]
    C -->|Yes| E{選擇孵化模式?}

    subgraph Hatching Ritual
    E -->|Standard Mode| F[單擊進入孵化畫面]
    E -->|Batch Mode (Leo)| G[連抽模式: 快速連開累積的蛋]
    E -->|Zen Mode (Sarah)| H[長按靜默孵化: 減少特效與震動]

    F --> I[蛋殼震動與裂開 (Haptic Sync)]
    G --> I
    H --> J[優雅的光暈擴散 (無震動)]

    I --> K[生物誕生 Creature Reveal]
    J --> K
    end

    K --> L[加入收藏庫 & 更新統計數據]
````

**Key Improvements (Party Mode):**

- **Batch Hatch (連抽)**: 允許累積多次能量後一次釋放，滿足 "Gamer" 用戶的爽快感需求。
- **Zen Mode (靜默)**: 長按互動可觸發低調版本動畫，適合 "Healing Seeker" 在安靜場合使用。

### 2. The Mutation Loop (變異流程 - 失敗轉化)

將負面情緒轉化為遊戲資源的獨特機制。

```mermaid
graph TD
    A[任務逾期或標記失敗] --> B(介面轉為警示色 Warning Theme)
    B --> C{選擇處理方式?}

    subgraph Fail-Forward Mechanic
    C -->|放棄任務| D[任務消失 (無獎勵/無懲罰)]
    C -->|選擇變異 (Mutate)| E[進入轉化流程]

    E -->|Night Mode| F[注入變異液 (Inject) - Cool & Edgy]
    E -->|Day Mode| G[能量轉化 (Transmute) - Magic & Soft]

    F --> H[獲得 Adaptation Energy (下顆蛋數值加成)]
    G --> H
    H --> I[獲得稀有資源 'Mutagen']
    end

    I --> J[返回主畫面 (帶著增益狀態)]
```

**Key Improvements (Party Mode):**

- **Tone Adjustment**: 根據 Day/Night Theme 調整文案 ("Inject" vs "Transmute") 以減少對療癒型用戶的視覺衝擊。
- **Balance Logic**: 變異寵物將具有「副作用」 (High Maintenance)，防止用戶為了刷稀有怪而故意失敗。

### Journey Patterns & Optimization

1.  **0-Latency Action**: 任何 Check-off 動作必須在 < 50ms 內在前端完成視覺回饋，後端同步非同步處理。
2.  **Haptic Sync**: 震動回饋必須與視覺動畫 (裂開、撞擊) 幀數同步，不能只有簡單的 buzz。
3.  **Fail-Forward**: 所有的錯誤狀態 (Error States) 都應提供至少一個「挽救」或「轉化」的選項，避免死胡同。

## Step 11: Component Strategy (元件策略)

採用的策略為：**「Headless Logic + Custom Visuals (The Neon Pack)」**。
利用 Headless UI 處理無障礙與基礎互動，專注於開發具備高視覺張力的自定義核心元件。

### Custom Components Specification (The Neon Pack)

#### 1. `NeonIncubator.vue` (核心元件)

- **Purpose**: 主畫面中央的互動核心，承載孵化儀式。
- **Props**:
  - `stage`: `'idle' | 'sleeping' | 'cracking' | 'hatching'`
  - `progress`: `number` (0-100)
  - `type`: `'standard' | 'golden' | 'mutated'`
- **Events**:
  - `@tap(intensity)`: 回傳點擊力度，觸發 Haptics。
  - `@hatch-complete`: 動畫結束事件。

#### 2. `GlassCard.vue` (通用容器)

- **Purpose**: 統一的玻璃擬態容器，根據狀態改變光暈。
- **Props**:
  - `variant`: `'default' | 'active' | 'success' | 'warning'`
  - `interactive`: `boolean` (啟用物理按壓效果)
- **Visuals**: 封裝 `backdrop-blur-xl` 與 `border-white/10`。

#### 3. `HoloBar.vue` (數據展示)

- **Purpose**: 高流暢度的數值展示。
- **Optimization**: 使用 `transform: scaleX` 確保 60fps 動畫。
- **Props**: `value`, `max`, `color` ('purple'/'green').

#### 4. `MutagenSwitch.vue` (儀式開關)

- **Purpose**: 用於確認關鍵變異操作。
- **Interaction**: **Drag-to-Activate** (拖曳到底並停留)，取代簡單點擊，增加操作確認感與儀式感。

### Implementation Roadmap

1.  **Phase 1 (MVP)**: `GlassCard`, `HoloBar` (建構基礎 UI)。
2.  **Phase 2 (Core)**: `NeonIncubator` (核心互動)。
3.  **Phase 3 (Polish)**: `MutagenSwitch` & Micro-interactions.

## Step 12: UX Consistency Patterns (互動邏輯)

### 1. Feedback Patterns (回饋機制)

- **Success**: `Neon Green Pulse` (邊框發光) + Haptic Feedback (Light).
- **Error**: `Shake` (左右晃動) + `Red Glitch` (訊號干擾效果).
- **Loading**: `Shimmer` (流光滑過進度條).

### 2. Navigation Patterns (導航結構)

- **Glass Dock**: 底部懸浮導航列 (Task, Incubator, Collection)。
- **Secondary**: 頂部角落的漢堡選單 (Settings, Profile)。

### 3. Adaptive Actions (適應性操作)

針對不同裝置提供最佳化體驗：

- **Mobile (Touch)**:
  - **Swipe-to-Complete**: 右滑卡片完成。
  - **Swipe-to-Delete**: 左滑卡片刪除 (需滑過 50% 觸發阻尼)。
  - **Undo Toast**: 刪除後顯示 3 秒「復原」按鈕，防止誤刪。
  - **Safe Zone**: 列表兩側保留 16px Padding，避免與 iOS 系統手勢衝突。

- **Desktop (Mouse)**:
  - **Hover Actions**: 滑鼠懸停於卡片時，右側浮現操作按鈕 (Complete/Delete)，不強迫拖曳。

### 4. Empty States (空狀態)

- **Visual**: Sleeping Egg (睡覺的蛋)。
- **Micro-copy**: "Shhh... incubating. Add a new task?"

## Step 13: Responsive & Accessibility (響應式與無障礙)

### 1. Breakpoints & Grid System

採用 Mobile-First 策略，針對 Tailwind CSS 進行配置：

- **xs (< 475px)**: _Small Phones_ (Grid: 4 cols). Layout: Compact Single Column.
- **sm (640px)**: _Modern Phones_ (Grid: 4 cols). Base Size: 16px.
- **md (768px)**: _Tablets_ (Grid: 8 cols). **Tablet Mode**: Sidebar Navigation 出現 (可收合)。
- **lg (1024px)**: _Desktops_ (Grid: 12 cols). **Dashboard Mode**: 雙欄佈局 (Incubator Left / Tasks Right).

### 2. Accessibility Technical Specs (A11y)

目標為 **WCAG 2.1 AA**，包含針對高動態視覺的特殊處理。

- **Reduced Motion**:
  - CSS: `@media (prefers-reduced-motion: reduce)` 自動禁用所有 `animate-pulse`, `animate-spin`。
  - JS: 使用 `@vueuse/core` 偵測並禁用 Canvas 粒子與複雜 SVG 動畫。
  - Backdrop: 自動將 `backdrop-blur` 降級為不透明遮罩，減少 GPU 負擔與視覺干擾。
- **Screen Reader Support**:
  - **Live Regions**: 為 NeonIncubator 增加 `aria-live="polite"` 的隱藏區域，文字廣播蛋的狀態 (e.g., "The egg makes a cracking sound").
- **Keyboard Navigation**:
  - **Focus Trap**: 在孵化儀式 Modal 打开时，启用 Focus Trap 防止 Tab 出去。
  - **Skip Links**: 首個 Tab 焦點為 "Skip to Main Content"。

## Step 14: Project Completion (結案)

🎉 **UX Design Complete!**

我們已經完成了針對 **BMad (Task-Hunter)** 的完整 UX 設計規範。
這份文件現在包含了從「用戶痛點」到「像素級實作規格」的所有必要資訊。

### Summary of Accomplishments

1.  **Core Experience**: 定義了 "Incubation Loop" 與 "Fail-Forward" 機制。
2.  **Visual DNA**: 確立了 **Neon Incubator** (Dark/Cyberpunk) 視覺風格。
3.  **Components**: 規劃了 **The Neon Pack** (Incubator, GlassCard, HoloBar) 元件庫。
4.  **Consistency**: 定義了 0-Latency Feedback 與 Mobile-First 的互動模式。
5.  **Technical Specs**: 確立了 Tailwind Breakpoints 與 Reduced Motion 實作細節。

### Next Steps Recommendation

建議接下來的開發順序：

1.  **Architecture Design**: 根據 Component Strategy 規劃 Vue 3 + Pinia 架構。
2.  **Epic Creation**: 將 User Journey Flows 拆解為具體的 User Stories。
3.  **Prototyping**: 優先實作 核心互動的原型 (Proof of Concept)。

**The UX Design Specification is officially FINALIZED.**
