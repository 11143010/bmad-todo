---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
inputDocuments:
  [
    "_bmad-output/analysis/product-brief-TodoList-2025-12-19.md",
    "docs/index.md",
    "docs/project-overview.md",
    "docs/data-models.md",
    "docs/component-inventory.md",
    "docs/state-management.md",
  ]
documentCounts:
  briefs: 1
  research: 0
  brainstorming: 0
  projectDocs: 5
workflowType: "prd"
lastStep: 0
project_name: "TodoList"
user_name: "Peng"
date: "2025-12-19"
---

# Product Requirements Document - TodoList

**Author:** Peng
**Date:** 2025-12-19

## Executive Summary (執行摘要)

BMad TodoList 將枯燥的日常任務管理轉化為一場引人入勝的 **「Task-Hunter (任務獵人)」** 冒險。透過將任務重新想像為「神秘蛋」，並在完成後孵化成可收集的星際生物，本產品**將拖延轉化為對未知的期待 (Turns procrastination into anticipation)**，解決了傳統生產力工具中使用者參與度低落以及「還債感」的核心問題。主要目標客群為需要情感支持的「療癒尋求者 (上班族)」以及需要即時反饋來克服拖延的「遊戲化學習者 (學生)」。

### What Makes This Special (獨特賣點)

不同於依賴冷冰冰數據的傳統習慣追蹤器，BMad 利用 **「可愛收集 (Cute & Collectible)」** 美學與 **「差異化孵化 (Variable Incubation)」** 機制。其獨特的差異化在於將**使用者的努力 (專注時間)** 與 **獎勵的視覺品質 (酷 vs. 醜)** 直接掛鉤，創造出 **「趣味變異 (Fun Mutation)」** 的行為驅動力，激勵使用者保持一致性與高品質的工作表現。

## Project Classification (專案分類)

**Technical Type (技術類型):** 網頁應用程式 (Web App / PWA)
**Domain (領域):** 一般 (遊戲化生產力 / Gamified Productivity)
**Complexity (複雜度):** 中等 (本地優先遊戲狀態 + RxDB 狀態同步)
**Project Context (專案背景):** Brownfield (既有專案) - 擴充現有的離線優先客戶端單體架構 (Offline-First Client-Side Monolith)

- **Existing Tech Stack (既有技術堆疊):** Vue 3, Pinia, RxDB, TailwindCSS
- **Existing Tech Stack (既有技術堆疊):** Vue 3, Pinia, RxDB, TailwindCSS
- **New Feature Type (新功能類型):** 遊戲化引擎 (孵化、收集、圖鑑資產庫)

## Success Criteria (成功標準)

### User Success (使用者成功)

- **Sticky Habitat (建立棲息地)**: 使用者連續 7 天都有開啟 App (習慣養成)。
- **Emotional Resilience (情感韌性)**: 點擊寵物對話框後，30分鐘內完成任務的轉化率 > 50% (需排除建立後 5 分鐘內完成的任務)。
- **Collection Pride (收集成就)**: 一週內解鎖至少 1 個稀有生物 (針對 Leo 的需求)。

### Business Success (商業/產品成功)

- **D30 Retention**: 30 日留存率 > 20% (北極星指標)。
- **Screenshot Action Rate (截圖率)**: 每月每位活躍用戶的主動截圖次數 > 1 (作為分享意圖的代理指標)。
- **Ecosystem Health**: 變異清理率 > 80% (確保用戶還在乎這個世界)。

### Technical Success (技術成功)

- **Offline Resilience**: 在無網路狀態下，孵化動畫與資料儲存 100% 成功。
- **Conflict Resolution**: 多裝置衝突解決成功率 100% (無資料遺失)。
- **Performance**: 孵化動畫與 UI 互動延遲 < 100ms (追求極致絲滑)。

### Product Scope (產品範疇)

#### MVP (Minimum Viable Product)

- **Core**: 變異孵化引擎 (Cool vs Ugly)、20 隻生物資產、基礎剪影圖鑑。
- **Constraint**: 暫無社交分享、暫無寵物互動 (餵食)。

#### Growth Features (Post-MVP)

- **Social**: IG 分享卡片 generator。
- **Depth**: 寵物親密度系統、更多物種包 (Species Packs)。

#### Vision (Future)

- **Metaverse**: 每個用戶的收集變成一個可探索的「星系」，可以去朋友的星系串門子。

## Innovation & Novel Patterns (創新與新穎模式)

### Detected Innovation Areas (偵測到的創新領域)

1.  **Curiosity-Driven Productivity (好奇心驅動生產力)**
    - **Concept**: 利用神秘結果將行動力從「責任驅動」轉變為「好奇心驅動」。
    - **Novelty**: 任務變成「孵化室」。想看「會孵出什麼」的動力取代了「必須工作」的恐懼。

2.  **The "Adaptation Pity" System (適應性保底 / 失敗向前機制)**
    - **Concept**: 轉蛋遊戲「保底機制 (Pity System)」的生產力應用版。
    - **Mechanism**: **變異並非死路。** 失敗的任務（變異）會產生 **「適應能量 (Adaptation Energy)」**，為 _下一次_ 同類型的任務孵化提供被動增益（加速或運氣提升）。
    - **Narrative**: 「變異的寵物會幫助它的兄弟生存。」（將羞恥轉化為支持）。
    - **Novelty**: 解決「斷鍊焦慮 (Streak-Breaking Anxiety)」，確保失敗也能貢獻於未來的成功，而非抹殺進度。

3.  **Genre Mixing (生產力 x 收集 RPG)**
    - **Concept**: 將變動獎勵 (RNG) 深度整合進任務完成流程。
    - **Novelty**: 不同於 _Habitica_ (血量/金幣) 或 _Forest_ (枯樹)，BMad 提供獨特、可收集且幽默的異質資產 (寵物)，來講述使用者的習慣故事。

### Market Context & Competitive Landscape (市場與競品脈絡)

- **Habitica**: 使用負面懲罰 (扣血)，造成壓力。
- **Forest**: 使用視覺羞辱 (枯樹)，造成遺憾。
- **BMad**: 使用 **「補償性進程 (Compensatory Progression)」**。即使失敗也能累積「保底計數」或提供「適應 Buff」，確保使用者的時間永遠不會完全白費。

### Validation Approach (驗證方法)

1.  **Conversion Spec ("反彈" 指標)**: 測量在「變異」事件後 1 小時內開始新任務的使用者百分比。(假設: 保底 Buff 能提高此轉化率 vs 對照組)。
2.  **Share Ratio**: 比較「稀有寵物」與「搞笑變異寵物」的社交分享率。

### Risk Mitigation (風險緩解)

- **Risk**: **鑽系統漏洞 (故意失敗)**。使用者故意讓簡單任務失敗來刷 Buff 給困難任務用。
- **Mitigation Strategy**: **「標籤鎖定適應 (Tag-Locked Adaptation)」**。Buff 僅適用於 _相同類別_ 的任務 (例如: 失敗的程式任務只能 Buff 下一個程式任務)。
- **Balance Rule**: 「完美孵化」的價值必須永遠大於「變異 + 保底 Buff」。

## Web App (PWA) 特定需求

### 專案類型總覽

BMad "Task-Hunter" 將建構為高效能的 **離線優先單頁應用程式 (Offline-First SPA)**，並具備 **漸進式網頁應用 (PWA)** 能力。重點在於透過瀏覽器提供類似原生 App 的體驗（快速、流暢、可離線使用），優先考慮互動延遲和動畫流暢度，而非廣泛的舊版相容性或公開 SEO。

### 技術架構考量

- **App 架構**: 客戶端單體 (Client-Side Monolith)，使用 **Vue 3** (Composition API) + **Pinia** 進行狀態管理。
- **離線資料策略**:
  - **資料庫**: **RxDB** (Local-First) 用於穩健的離線儲存與即時 UI 更新。
  - **同步協定**: 與後端進行複製 (Replication)。
  - **衝突解決**: 採用 **最後寫入者勝 (Last Write Wins, LWW)** 策略（簡單高效，適用於單一使用者主導的資料）。
- **PWA 能力**:
  - 透過 Web Manifest 啟用「加入主畫面」。
  - Service Worker 用於資源快取（離線存取 App Shell）。
  - _註：PWA 視為增強功能（"Nice to have"），主要使用場景仍為標準手機瀏覽器。_

### 瀏覽器支援列表

- **目標**: **僅限現代瀏覽器** (最新的 2 個主要版本)。
  - 電腦: Chrome, Edge, Safari, Firefox。
  - 手機: iOS Safari (iOS 15+), Android Chrome。
- **排除**: 不支援 Internet Explorer 或舊版本。

### 效能目標 (關鍵成功因素)

- **互動**: 所有 UI 互動（查看任務、收集寵物）回應時間 **< 100ms**。
- **動畫**: 孵化與收集動畫需達到穩定的 **60fps**。
- **載入時間**: 4G 網路下的首次內容繪製 (FCP) **< 1.5s**。

### 實作考量

- **SEO**: **無**。不需要公開索引，無需 SSR (伺服器端渲染) 的複雜度。
- **無障礙性**: 遵守基本的 **WCAG 2.1 AA** 標準以確保可用性，但優先考慮遊戲化的視覺體驗。

## Project Scoping & Phased Development (專案範疇與階段開發)

### MVP Strategy & Philosophy (MVP 策略與哲學)

**MVP Approach:** **Experience MVP (體驗導向 MVP)**
重點在於透過「核心遊戲循環 (孵化與收集)」提供完整的情感體驗，而非堆疊功能。我們必須驗證「變異」是否能被使用者視為一種樂趣而非懲罰。

**Resource Requirements (資源需求):**

- **Dev**: 1 Frontend (Vue/RxDB), 1 Game Logic (Mechanics).
- **Art**: 20 隻生物資產 (每隻需有 Cool/Ugly 兩種變體 + 蛋型態) + UI 素材。

### MVP Feature Set (Phase 1) (MVP 功能集 - 第一階段)

**Core User Journeys Supported (支援的核心使用者旅程):**

1.  **Sarah's Healing Ritual**: 完成任務 -> 孵化可愛生物 -> 獲得療癒。
2.  **Leo's Gamified Grind**: 快速完成 -> 收集稀有 -> 獲得成就感。
3.  **Fail-Forward Loop**: 任務過期 -> 獲得變異 -> 獲得適應性 Buff (Rebound)。

**Must-Have Capabilities (必要功能):**

- **Task Management**: CRUD, Tags, Focus Timer.
- **Incubation Engine**: Logic for conversion (Time/Focus -> Result).
- **Asset Library**: Initial Gen-1 Pokedex (20 Species).
- **Local Persistence**: RxDB offline storage.
- **Settings**: Sound on/off, Data reset.

### Post-MVP Features (MVP 後續規劃)

**Phase 2 (Growth / 成長期):**

- **Social**: IG Story Generator, Share Cards.
- **Retention**: Streak Rewards (Habitat Decorations).
- **Content**: Gen-2 Species Pack.

**Phase 3 (Expansion / 擴展期):**

- **Interaction**: Pet Feeding & Bonding system.
- **Metaverse**: Visit friends' habitats.
- **Monetization**: Premium Skins / Themes.

### Risk Mitigation Strategy (風險緩解策略)

**Technical Risks (技術風險):**

- **Offline Conflict**: 採用 LWW (Last Write Wins) 簡化 MVP 複雜度。
- **Performance**: 限制 MVP 畫面中的寵物數量，避免 WebGL 效能瓶頸。

**Market Risks (市場風險):**

- **Art Style Rejection**: MVP 前進行小規模 Art Test (A/B Test) 確認「醜萌」的接受度。

**Resource Risks (資源風險):**

- **Asset Bottle-neck**: 若美術產能不足，MVP 可縮減至 10-15 隻生物，利用「異色版 (Recolors)」擴充數量。

## Functional Requirements (功能需求)

### Task & Habit Management (任務與習慣管理)

- **FR-01**: 使用者可以建立單次任務 (Todo) 與重複習慣 (Habit)。
- **FR-02**: 使用者可以設定任務的「專注時間長度」(例如 25min)，這將影響孵化結果。
- **FR-03**: 使用者可以為任務添加標籤 (Tag)，標籤將影響孵化出的寵物屬性 (例如：Coding -> Cyber Pet)。
- **FR-04**: 使用者可以啟動「專注模式」，期間此任務將鎖定為當前活動。

### Incubation & Mutation Engine (孵化與變異引擎)

- **FR-05**: 使用者完成任務後，獲得一顆「神秘蛋」並立即進入孵化畫面。
- **FR-06**: 系统根據「專注度」(是否暫停、是否切換視窗) 計算孵化結果 (Perfect / Normal / Corrupted)。
- **FR-07**: 若任務過期未完成，該蛋自動轉化為「變異狀態 (Mutated)」。
- **FR-08 (Pity System)**: 當使用者獲得「變異」結果時，系統自動發放「適應性 Buff (Adaptation Essence)」，提升下次同類任務的孵化品質。

### Collection & Asset Library (收集與圖鑑)

- **FR-09**: 使用者可以查看「棲息地 (Habitat)」，瀏覽所有已收集的寵物。
- **FR-10**: 使用者可以點擊寵物查看詳細檔案 (名稱、出生日期、來源任務)。
- **FR-11**: 使用者可以「釋放 (Release)」寵物以清理棲息地空間 (MVP暫不提供回收資源)。

### System & Settings (系統與設定)

- **FR-12**: 支援離線操作 (Offline-First)，所有數據需本地持久化。
- **FR-13**: 使用者可以手動重置所有數據 (Factory Reset)。
- **FR-14**: 支援 PWA 安裝至主畫面。

## Non-Functional Requirements (非功能需求)

### Performance (效能體驗)

- **NFR-01 (Interaction Latency)**: 核心操作（完成任務、切換頁面）的回應時間需 **< 100ms** (感覺不到延遲)。
- **NFR-02 (Animation Smoothness)**: 孵化與收集動畫在主流中階手機上需維持 **60 fps**。
- **NFR-03 (Cold Start)**: App 冷啟動至可互動狀態需 **< 1.5秒** (4G環境)。

### Reliability & Offline (可靠性與離線)

- **NFR-04 (Offline Resilience)**: 在飛行模式下，使用者可以執行所有 CRUD 與孵化變異操作，且無錯誤提示。
- **NFR-05 (Data Integrity)**: 當網路恢復時，本地數據需在 **30秒內** 自動與雲端完成同步。

### Compliance & Privacy (合規與隱私)

- **NFR-06 (Privacy)**: 使用者未主動分享前，所有任務數據與寵物收藏預設為 **私有 (Private)**。
- **NFR-07 (Accessibility)**: 雖然是遊戲化介面，但文字對比度與按鈕大小需符合 **WCAG 2.1 AA** 標準，確保長時間使用不疲勞。

### Scalability (擴展性 - Optional for MVP)

- **NFR-08**: 客戶端資料庫 (RxDB) 需能流暢支撐至少 **5,000 筆** 歷史任務與 **500 隻** 寵物資產，無顯著效能下降。
