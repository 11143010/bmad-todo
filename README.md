# 🌌 BMad - 壓力管理系統

> Galaxy-themed stress management for your brain ✨

BMad 是一個銀河系主題的壓力管理應用程式，幫助你追蹤和管理每日任務負載，避免大腦超載。

## ✨ 功能特色

- 🪐 **演化星球** - 壓力計以星球形式呈現，隨壓力等級從寧靜演化到爆炸
- ⭐ **動態星空** - 緩慢飄動的星空背景，帶有星雲呼吸效果
- 🎆 **任務完成動畫** - 完成任務時的星塵爆發效果
- 🔒 **系統超載保護** - 超過每日限制時自動阻止新增任務
- 📊 **分析儀表板** - 追蹤每日完成統計
- 🏆 **成就系統** - 解鎖成就獲得激勵
- 📱 **PWA 支援** - 可安裝為獨立應用程式

## 🛠 技術棧

| 類別         | 技術                            |
| ------------ | ------------------------------- |
| **框架**     | Vue 3 + TypeScript              |
| **狀態管理** | Pinia                           |
| **資料庫**   | RxDB (IndexedDB)                |
| **樣式**     | Tailwind CSS + 自訂 Galaxy 主題 |
| **建構工具** | Vite                            |
| **PWA**      | VitePWA                         |

## 🚀 快速開始

```bash
# 安裝依賴
npm install

# 啟動開發伺服器
npm run dev

# 建構生產版本
npm run build

# 預覽生產版本
npm run preview
```

## 📁 專案結構

```
src/
├── components/
│   └── features/          # 功能組件
│       ├── Plate.vue           # 任務列表
│       ├── StomachGauge.vue    # 壓力計（星球視覺化）
│       ├── TaskInput.vue       # 任務輸入
│       ├── StressEstimator.vue # 壓力點數估計
│       ├── SettingsPanel.vue   # 設定面板
│       └── ...
├── stores/                # Pinia 狀態管理
│   ├── stress.store.ts        # 壓力/負載追蹤
│   ├── task.store.ts          # 任務 CRUD
│   ├── settings.store.ts      # 用戶設定
│   └── ...
├── modules/
│   ├── db/                # RxDB 資料庫
│   ├── i18n/              # 多語言 (繁中/英)
│   └── sensory/           # 音效/觸覺回饋
└── style.css              # Galaxy 主題設計系統
```

## 🎨 設計系統

### 配色

| 變數              | 顏色      | 用途       |
| ----------------- | --------- | ---------- |
| `--nebula-cyan`   | `#06b6d4` | 主要強調色 |
| `--nebula-purple` | `#8b5cf6` | 次要強調色 |
| `--nebula-pink`   | `#ec4899` | 警告/危險  |
| `--space-deep`    | `#0a0a14` | 背景深色   |

### 效果

- **玻璃擬態** - 半透明模糊效果
- **Aurora 漸層** - cyan → purple → pink
- **GPU 加速動畫** - `will-change` 優化
- **無障礙支援** - 尊重 `prefers-reduced-motion`

## 🌐 多語言

支援：

- 🇹🇼 繁體中文 (zh-TW)
- 🇺🇸 English (en)

## 📄 授權

MIT License
