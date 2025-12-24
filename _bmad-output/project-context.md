---
project_name: "BMad"
user_name: "Ray Pong"
date: "2025-12-24"
sections_completed: ["technology_stack", "critical_rules"]
existing_patterns_found: 8
---

# Project Context for AI Agents

_This file contains critical rules and patterns that AI agents must follow when implementing code in this project. Focus on unobvious details that agents might otherwise miss._

---

## Technology Stack & Versions

- **Frontend**: Vue 3 (Composition API, `<script setup>`)
- **Language**: TypeScript (Strict Mode)
- **State Management**: Pinia (Global State) + Composables (Feature Logic)
- **Data Persistence**: RxDB (Offline-First, IndexedDB)
- **UI Framework**: Tailwind CSS (Utility-first)
- **Build Tool**: Vite (with `vite-plugin-pwa`)
- **Testing**: Vitest (Unit)
- **Linting**: ESLint + Prettier

## Critical Implementation Rules

### 1. Architectural Patterns (MUST FOLLOW)

- **Directory Structure**: Use the **Hybrid Module** structure.
  - `src/modules/{feature}/` for business logic (Tasks, Incubator).
  - `src/components/` only for shared, dumb UI components.
- **Data Flow**: **Reactive Stream Pattern**.
  - UI never touches RxDB directly.
  - UI -> Composable Action -> RxDB -> Subscription -> UI Ref.
- **State Management**:
  - Use `Pinia` for global app settings/user session.
  - Use `Composables` (`useTasks`) for all business data logic.

### 2. Naming Conventions

- **Components**: `camelCase` (e.g., `neonIncubator.vue`) - **USER OVERRIDE**.
- **Composables**: `camelCase` with `use` prefix (e.g., `useIncubator.ts`).
- **Events**: `kebab-case` in templates (e.g., `@hatch-complete`).

### 3. Security & Stability

- **Anti-Cheat**: Critical actions (incubating/hatching) must specificy a `timestamp` token.
- **Migrations**: RxDB schema changes must be **Additive Only**. Never rename/delete fields in client DB.

### 4. Testing Rules
*   **Unit Tests (Vitest)**:
    *   Focus on Business Logic (Composables, Helpers, Stores).
    *   Mock external dependencies (RxDB, API) to keep tests fast.
    *   Location: `src/modules/{feature}/__tests__/`.
*   **E2E Tests (Playwright)**:
    *   Cover critical User Journeys (Incubation, Task CRUD).
    *   Test against Production Build.
*   **Visual Regression (VRT)**:
    *   **Scope**: Critical Visual Components ONLY (Incubator, GlassCard).
    *   **Threshold**: Strict (`maxDiffPixelRatio: 0.05`).
    *   **Env**: Run in Docker to ensure consistent rendering.

### 5. Development Workflow
*   **Branching**: `feature/{epic-id}-{short-desc}` (e.g., `feature/epic-1-task-crud`).
*   **Commits**: Conventional Commits (e.g., `feat(task): add validation logic`).
*   **Quality Gates**:
    *   No `console.log` in production.
    *   No `any` types (Strict TypeScript).

---

## Usage Guidelines

**For AI Agents:**
*   **Read this file** before implementing any code.
*   **Follow ALL rules** exactly as documented.
*   **Prefer** the more restrictive option when in doubt.
*   **Update** this file if new implementation patterns emerge during development.

**For Humans:**
*   Keep this file lean and focused on **unobvious details**.
*   Review quarterly for outdated rules.

Last Updated: 2025-12-24
