---
stepsCompleted: [1, 2, 3, 4, 5]
inputDocuments:
  - _bmad-output/prd.md
  - _bmad-output/ux-design-specification.md
  - _bmad-output/analysis/product-brief-TodoList-2025-12-19.md
workflowType: "architecture"
lastStep: 0
project_name: "TodoList"
user_name: "Peng"
date: "2025-12-24"
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**

- **Core Loop**: Task Management (CRUD) -> Earn Energy -> Hatch Egg -> Collect Creature.
- **Gamification**: "Hatching Ritual" (Immersive Animation), "Fail-Forward" (Mutation), Collection Gallery.
- **User Types**: "Sarah" (Healing/Low-Friction) vs "Leo" (Gamer/Achievement).

**Non-Functional Requirements (NFRs):**

- **Offline-First**: Must fully function without network. Sync happens in background.
- **0-Latency**: Interaction response time < 50ms (Optimistic UI).
- **Visual Performance**: 60fps animations on mid-range devices.
- **Battery Efficiency**: Aggressive throttling when in background.

**Scale & Complexity:**

- **Primary Domain**: Client-Heavy SPA (Single Page Application).
- **Complexity Level**: Medium-High (Due to Offline Sync + Advanced UI).
- **Estimated Components**: ~30 Vue Components (including Neon Pack).

### Architectural Drivers (Key Decisions)

1.  **Driver: Offline-First Consistency**
    - **Constraint**: The Local Database (RxDB) must be the Single Source of Truth. The backend is merely a synchronization peer and backup.
    - **Risk**: Data conflicts across devices.
    - **Strategy**: Use **Last-Write-Wins (LWW)** for simple fields (task title), but **Delta Updates** (/) for inventory/stats to prevent race conditions.

2.  **Driver: Visual Performance vs. Battery**
    - **Constraint**: Heavy use of Glassmorphism and Canvas particles.
    - **Risk**: High battery drain and thermal throttling.
    - **Strategy**: Implement **Page Visibility API** to strictly pause all rendering/sync loops when app is backgrounded. Support **Reduced Motion** preference.

3.  **Driver: Game Integrity (Anti-Cheat)**
    - **Risk**: Users manipulating local device time to exploit hatching/tasks.
    - **Strategy**: **Soft Anti-Cheat**. User experience trusts local time for 0-latency, but sync payload includes server-time offset calculation. Significant anomalies flag the "Hatch" as unverified for leaderboards (if added later).

### Technical Constraints & Dependencies

- **Framework**: Vue 3 (Composition API) + Pinia.
- **Database**: RxDB (with IndexedDB adapter).
- **Styling**: Tailwind CSS + Headless UI (Logic) + Custom "Neon Pack" (Visuals).
- **Platform**: PWA (Service Workers for caching App Shell).

## Starter Template Evaluation

### Primary Technology Domain

**Client-Side SPA (PWA)** with Offline capabilities.

### Selected Starter: Vitesse (antfu/vitesse)

**Rationale for Selection:**

- **PWA Ready**: Built-in configuration for , essential for our Offline-First requirement.
- **Developer Experience (DX)**: Auto-import for Vue/Pinia APIs reduces boilerplate significantly.
- **Neon Theme Compatible**: robust Dark Mode handling (VueUse ) out of the box.
- **Modern Tooling**: Vite, TypeScript, ESLint, and PostCSS pre-configured.

**Initialization Command:**

```bash
npx degit antfu/vitesse bmad-app
```

**Architectural Decisions Provided by Starter:**

- **Framework**: Vue 3 (Composition API) + TypeScript.
- **State Management**: Pinia (Store pattern).
- **Routing**: Vue Router (File-based routing via ).
- **Styling**: Tailwind CSS (via UnoCSS or dedicated Tailwind plugin).
- **Icons**: Iconify (On-demand usage).

## Core Architectural Decisions

### Directory Structure: Hybrid Module-Based

We adopt a **Hybrid** approach to balance cohesion with simplicity:

- **`src/modules/`**: Core Business Domains (Tasks, Incubator, Collection). Self-contained with their own components, stores, and logic.
- **`src/components/`**: Shared UI primitives (Buttons, Inputs, GlassCard) stay flat for easy access.

### Frontend Architecture: Reactive Data Stream

- **State Management**: **Pinia** is used for global app state (User Energy, Settings), but **Composables** (`useTasks`, `useIncubator`) are the primary interface for business data.
- **Data Flow**: **One-Way Reactive Stream**.
  1.  UI calls Composable Action (e.g., `addTask`).
  2.  Composable writes to RxDB.
  3.  RxDB syncs/persists and emits change event.
  4.  Composable's Live Query subscription updates the Vue `ref`.
  5.  UI updates automatically.
  - _Note: Pinia actions should NOT manually update state if that state is mirrored from DB._

### Data Persistence: RxDB

- **Single Source of Truth**: The local RxDB instance is the truth. The UI reflects it.
- **Sync Strategy**: Background replication to server.
- **Conflict Resolution**: Last-Write-Wins (LWW) for simple fields; Delta-CRDT patterns for counters/inventory.

### Infrastructure

- **Hosting**: Vercel (Frontend/PWA).
- **CI/CD**: GitHub Actions (Lint -> Test -> Build).

## Implementation Patterns & Consistency Rules

### Naming Patterns

- **Components**: **`camelCase`** (e.g., `neonIncubator.vue`, `taskCard.vue`). _[User Override]_
- **Composables**: `camelCase` with `use` prefix (e.g., `useIncubator.ts`).
- **Stores**: `camelCase` with `use` prefix + `Store` suffix (e.g., `useTaskStore.ts`).
- **Events**: `kebab-case` in templates (e.g., `@hatch-complete`).
- **Directories**: `kebab-case` (e.g., `modules/task-manager/`).

### Communication Patterns

- **Props**: Must have strict TypeScript interfaces. NO `any`.
- **Expose**: Use `defineExpose` to explicitly whitelist public methods. Default to closed.
- **Events**: Simple events use `emit`; complex data passing requires validation rules.

### Process Patterns

- **Error Handling**:
  - **UI**: Use explicit `onErrorCaptured` in container components to prevent white-screen crashes.
  - **Logic**: Catch errors in Composables and surface via a Toast/Notification service.
- **Loading States**:
  - **Skeleton**: Preferred for initial load (matches GlassCard shape).
  - **Spinner**: Used only for short actions (< 2s).

## Project Structure & Boundaries

### Complete Project Directory Structure
```text
src/
├── components/          # Shared Dumb UI 
│   ├── ui/              # Generic UI Kit (The Neon Pack base)
│   └── layout/          # Layout Shells (AppShell, NavBar)
├── modules/             # Business Logic & Smart Components
│   ├── tasks/
│   │   ├── components/  # Feature-specific components
│   │   ├── logic/       # useTasks.ts (Reactive Services)
│   │   └── types.ts
│   ├── incubator/
│   │   └── ...
│   └── collection/
├── services/            # Global Services
│   ├── db/              # RxDB Schema & Setup
│   └── time/            # Anti-Cheat Time Service
├── stores/              # Global Pinia Stores (User, Settings)
├── sw/                  # Service Worker Custom Logic
├── styles/              # Tailwind & CSS Variables
├── types/               # Global Types (env.d.ts)
└── App.vue

public/
├── models/              # 3D/GLTF Assets
├── sounds/              # Audio Assets
└── icons/               # PWA Icons
```

### Architectural Boundaries
*   **Module Boundary**: Modules (tasks/incubator) are self-contained. Cross-module communication happens ONLY via Global Stores or Events.
*   **Logic Boundary**: UI components NEVER touch RxDB directly. They must use Composable/Service layers ().

### Integration Points
*   **Data Flow**: UI -> Composable -> RxDB -> (Replication) -> Server.
*   **Env Config**: Typed environment variables defined in .

## Architecture Validation Results

### Coherence Validation ✅
*   **Structure & Logic**: The Hybrid Module structure aligns perfectly with the "Feature-based" nature of the app.
*   **Tech Stack**: Vue 3 + Pinia + RxDB + Tailwind matches the PWA requirement without conflict.

### Requirements Coverage ✅
*   **Offline-First**: Fully covered by RxDB.
*   **Anti-Cheat**: ADDRESSED. Implemented **Token-based Time Sync** strategy (Signed Timestamp).
*   **Data Reliability**: ADDRESSED. Enforced **Additive Schema Strategy** to mitigate client-side migration risks.

### Architecture Readiness Assessment
**Overall Status**: READY FOR IMPLEMENTATION

**Key Strengths:**
1.  **Resilient**: Offline-first via RxDB.
2.  **Maintainable**: Clear separation of Business Logic (Modules) vs UI (Components).
3.  **Performant**: 0-Latency Interactions via Reactive Streams.

**Security/Stability Constraints (Party Mode):**
*   **Time Service**: Must use Server-Signed Tokens for critical actions (Hatching).
*   **Schema Migration**: STRICTLY Additive (add fields only). Do not rename/delete fields in Client DB.

## Architecture Completion Summary

### Final Architecture Deliverables
*   **📋 Complete Architecture Document**: Documented all decisions (Hybrid Module, RxDB, Neon Pack).
*   **🏗️ Implementation Ready**: Verified against PRD requirements with Security/Reliability improvements.
*   **📚 Patterns Defined**: Naming, Directory Structure, and State Management patterns established.

### Implementation Handoff
**First Priority**: Initialize project with Vitesse.
```bash
npx degit antfu/vitesse bmad-app
```

**AI Agent Guidelines**:
1.  **Strictly follow** the  directory structure.
2.  **Never** write to RxDB directly from UI components; use Composables.
3.  **Always** use  for Vue components (User Override).
4.  **Security**: Use Token-based Time Sync for sensitive actions.

**Architecture Status**: READY FOR IMPLEMENTATION ✅
