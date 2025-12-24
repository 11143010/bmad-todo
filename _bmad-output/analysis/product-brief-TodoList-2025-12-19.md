---
stepsCompleted: [1, 2, 3, 4, 5]
inputDocuments:
  [
    "docs/index.md",
    "docs/project-overview.md",
    "docs/data-models.md",
    "docs/state-management.md",
    "docs/component-inventory.md",
  ]
workflowType: "product-brief"
lastStep: 1
project_name: "TodoList"
user_name: "Peng"
date: "2025-12-19"
---

# Product Brief: TodoList

**Date:** 2025-12-19
**Author:** Peng

---

<!-- Content will be appended sequentially through collaborative workflow steps -->

## Executive Summary (執行摘要)

BMad 是一個結合「收集機制」的遊戲化待辦事項應用程式，旨在解決一般生產力工具功能單一、導致使用者缺乏動力與黏著度的問題。透過將任務完成轉化為探索宇宙與「收集可愛物品」的過程，BMad 為枯燥的待辦事項注入了樂趣與療癒感，讓使用者在保持生產力的同時，也能享受收集的成就感。

---

## Core Vision (核心願景)

### 核心玩法: "Task-Hunter" (任務即獵物)

BMad 採用獨特的 **"Incubation & Collection" (孵化與收集)** 機制，將生產力轉化為一場星際探索：

- **任務即未知 (Tasks as Mystery)**: 建立任務時，根據難度生成一顆未知的「星際生物蛋」。
- **完成即孵化 (Completion as Hatching)**: 完成任務瞬間，蛋會孵化為可愛的宇宙生物。困難任務有機會孵出稀有的傳說生物。
- **拖延即變異 (Delay as Mutation)**: 若任務過期，蛋會變異為「宇宙垃圾」或「搗蛋鬼」，不僅佔據介面空間，還需額外步驟清理。

### Problem Statement (問題陳述)

傳統待辦工具缺乏立即性的回饋，"完成任務" 的成就感往往不足以對抗拖延的阻力。

### Proposed Solution (解決方案)

引入以 **「收集 (Collection)」** 為核心的遊戲化機制。

- **機制**: 任務的完成不再只是清單的消失，而是轉化為探索的資源。
- **獎勵**: 用戶可以解鎖、發現並收集各種「可愛風格」的宇宙生物或物品。
- **體驗**: 創造一個讓人「因為想看到新收藏」而主動回來完成任務的正向循環。

### Key Differentiators (關鍵差異化)

- **Cute & Collectible (可愛收集)**: 不同於傳統 Habit Tracker 的數據或硬派 RPG 數值，我們主打「可愛/療癒」的視覺與收集體驗，直接訴求使用者的喜愛與蒐集慾。
- **Gamified Retention (遊戲化留存)**: 透過隨機性與圖鑑系統，解決單一功能導致的乏味感。

## Target Users (目標客群)

### Primary Users: "The Healing Seeker" (尋求療癒的上班族)

- **Persona**: Sarah, 28歲, 行銷企劃。
- **Context**: 每天面對大量瑣碎工作與會議，感到壓力與枯燥。傳統 Todo list 讓她覺得像是在還債。
- **Pain Point**: 缺乏動力開始困難的專案，容易職業倦怠 (Burnout)。
- **Needs**: 她需要的是 **「桌寵 (Desk Toy)」** 般的陪伴。
  - **Zero-friction Hatching**: 完成任務時蛋自動裂開，無需額外點擊，提供最絲滑的爽快感。
  - **Emotional Bonding**: 寵物會根據她的壓力狀態給予鼓勵對話 ("Sarah 辛苦了！")，提供情緒價值。

### Secondary Users: "The Study Gamer" (遊戲化學習的學生)

- **Persona**: Leo, 16歲, 高中生。
- **Context**: 需要準備大考，但容易分心滑手機。
- **Pain Point**: 讀書進度很難量化，缺乏即時回饋 (Instant Gratification)。
- **Needs**: 他將讀書進度視為 **「打怪任務」**。
  - **Focus for Rarity**: 結合專注計時器 (Focus Timer)，專注越久，孵出的生物越稀有 (防作弊機制)。
  - **Social Flex**: 能夠一鍵生成帥氣的 "星際圖鑑卡" 分享到 Instagram 限動。

### User Journey (關鍵旅程)

1.  **Morning Setup**: 早上進辦公室/圖書館，開啟 BMad，將今日 "必須做" 的壓迫感任務，轉化為 3-5 顆 "待孵化的蛋"。
2.  **The Grind**: 在執行任務的過程中，看著介面上的蛋微微晃動 (視覺暗示)，產生期待感。
3.  **The Reward**: 終於完成工作/讀完進度！勾選任務 -> **蛋殼瞬間裂開 (自動觸發) -> 蹦出一隻稀有 "星雲幼龍"！**
4.  **Extension**:
    - **Sarah**: 收到幼龍的暖心鼓勵，繼續下一個工作。
    * **Leo**: 發現是稀有與種，立刻生成卡片發到 IG 炫耀。
5.  **End of Day**: 檢查是否有過期變異的 "宇宙垃圾"，除了清理垃圾，也回顧了今日收集到的新夥伴，滿意地結束一天。

## Success Metrics (成功指標)

### North Star Metric (北極星指標)

- **D30 Retention Rate (30日留存率)**: 目標是讓使用者在「新鮮感」過後，因為「捨不得這群寵物」而持續使用超過 30 天。
- **Leading Indicator (領先指標)**: **Collection Milestone (擁有的寵物數量 >= 5)**。達到此門檻的用戶被定義為「已建立情感連結」，預期留存率將顯著提升。

### User Success Metrics (使用者成功)

- **For Sarah (The Healing Seeker)**:
  - **Conversion after Interaction (互動轉化率)**: 點擊寵物對話框後，30分鐘內完成任務的比例。證明情感支持有效轉化為生產力。
  - **Habit Formation**: 每天開啟 App 次數 > 3 次 (不僅是早上排程，工作間隙也會回來「尋求療癒」)。
- **For Leo (The Study Gamer)**:
  - **Quality Collection**: 每週解鎖至少 1 個 **稀有** 物種 (需透過專注模式孵化)。
  - **Social Proof**: 每月至少分享 1 次圖鑑卡片 (或是邀請朋友加入)。

### Business Objectives (產品維運目標)

- **Sticky Engagement**: DAU/MAU (活躍度) > 30%。代表它不僅是偶爾用的工具，而是生活必需品。
- **Ecosystem Health**: **Trash Clearance Rate (變異清理率)**。即使任務失敗，用戶仍願意回來清理垃圾的比例，代表對「遊戲世界觀」的維護意願。

## MVP Scope (MVP 範疇)

### Core Features (核心功能 - Must Have)

1.  **Variable Incubation Engine (差異化孵化引擎)**:
    - **Logic**: 任務難度 (Difficulty) + 專注度 (Focus Time) = 孵化結果。
    - **Visual Hierarchy**:
      - **High Effort**: 孵化出 "S級 - 恆星巨龍" (明顯很酷/特效華麗)。
      - **Low Effort**: 孵化出 "D級 - 鼻涕蟲/宇宙垃圾" (明顯很醜/好笑)。
    - **Behavioral Driver**: 利用「不想拿到醜東西」的心理，驅動使用者認真執行任務。

2.  **Asset Library (美術資產)**:
    - **20 Unique Pets**: 包含 5 隻神話級 (Cool) + 10 隻普通級 + 5 隻懲罰級 (Ugly)。
    - **Distinct Style**: 確保 "Cool" 與 "Ugly" 有極大的視覺落差，創造話題性。

3.  **Collection Codex (圖鑑系統)**:
    - **Mystery Silhouettes (剪影機制)**: 未獲得的生物僅顯示「黑色剪影」，激發好奇心與探索慾。
    - **Collection Progress**: 清楚顯示目前的收集進度 (e.g., 3/20)，暗示還有更多未知生物等待發現。

### Out of Scope for MVP (暫不實作 - V2)

- **Social/Sharing (IG卡片)**: 先專注於驗證單人遊玩的留存率。
- **Pet Interaction (互動/餵食)**: MVP 階段寵物僅作為獎勵展示。
- **Evolution (進化)**: 孵化即定型，簡化開發複雜度。

### MVP Success Criteria

- **D30 Retention**: > 20% (初步驗證遊戲化機制有效)。
- **"Ugly" Aversion Effectiveness**: 當使用者孵出醜生物後，下一次任務的平均專注時間是否提升？(驗證懲罰機制的教育意義)。
