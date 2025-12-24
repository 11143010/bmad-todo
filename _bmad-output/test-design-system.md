# System-Level Test Design

**Date**: 2025-12-24
**Project**: TodoList (BMad App)
**Phase**: Solutioning (Phase 3) - Testability Review

## Testability Assessment

- **Controllability**: **PASS**
  - **Strength**: Local-first architecture (RxDB) allows easy database seeding and state manipulation for tests. Service-layer isolation (Composables) enables unit testing of business logic without UI.
  - **Note**: The "Anti-Cheat" time synchronization (Story 2.2) introduces an external dependency. The `TimeService` must be designed with an interface to allow mocking server timestamps during testing.

- **Observability**: **PASS**
  - **Strength**: Reactive state streams (Pinia/RxDB) make state inspection straightforward.
  - **Action**: Ensure `onErrorCaptured` hooks and Composable error handling surface events that test runners can detect.

- **Reliability**: **PASS**
  - **Strength**: Modular architecture (`src/modules/`) enforces boundaries, reducing side-effects between features (e.g., Task Logic vs Incubator Logic).

## Architecturally Significant Requirements (ASRs)

| ASR ID     | Requirement                         | Impact on Testing                                                                  | Risk Score   |
| :--------- | :---------------------------------- | :--------------------------------------------------------------------------------- | :----------- |
| **ASR-01** | **Offline-First (RxDB)**            | Requires E2E scenarios for network disconnect/reconnect and conflict resolution.   | 9 (Critical) |
| **ASR-02** | **0-Latency Interactions (<100ms)** | Needs automated performance thresholds in E2E tests (e.g., Trace Viewer analysis). | 6 (High)     |
| **ASR-03** | **Anti-Cheat (Time Sync)**          | Requires mocking server time endpoints to validate validation logic.               | 6 (High)     |
| **ASR-04** | **PWA/Background Sync**             | Hard to test in standard CI. Needs specific "Service Worker" test capabilities.    | 4 (Medium)   |

## Test Levels Strategy

Given the **Client-Heavy SPA** nature and **Offline Logic** complexity:

- **Unit Testing (Logic): 40%**
  - **Target**: Composables (`useIncubator`, `useTasks`), Stores, and Utility functions.
  - **Tool**: Vitest.
  - **Rationale**: Core complex business logic (e.g., incubation math, mutation chance) lives in TypeScript modules, not UI. Fast feedback is essential.

- **Component Testing (UI): 30%**
  - **Target**: Vue Components, Animations, Visual features (Neon effects).
  - **Tool**: Vitest + Vue Test Utils (or Cypress Component Testing if preferred later).
  - **Rationale**: Visual-heavy app requires verifying component states and interactions (e.g., Egg shaking) in isolation.

- **E2E Testing (Flows): 30%**
  - **Target**: Critical Critical User Journeys (CUJs), Offline/Sync flows, PWA behavior.
  - **Tool**: Playwright.
  - **Rationale**: Essential for verifying the critical "Offline-First" promise and full database persistence integration which unit tests cannot cover reliably.

## NFR Testing Approach

- **Performance (Interaction)**:
  - **Approach**: Playwright E2E tests with `trace` enabled to measure layout/paint times during critical interactions (e.g., completing a task).
  - **Threshold**: Fail test if interactions exceed 200ms (buffer over 100ms target).

- **Reliability (Offline)**:
  - **Approach**: Playwright Network Interception.
  - **Scenario**: Simulate offline mode -> Perform CRUD -> Restore network -> Verify Sync.

- **Maintainability**:
  - **Approach**: ESLint + Prettier for code style. strict TypeScript configuration.

## Test Environment Requirements

- **Local Simulator**: Ability to run full stack locally with a detailed "Offline Mode" simulator (provided by browser devtools but automated via Playwright).
- **Mock Server**: A lightweight mock server to simulate the Backend API for Sync and Time Check endpoints during Client-only testing.

## Testability Concerns

- **CANVAS / GLTF Testing**: Testing the visual correctness of 3D assets or complex Canvas particles (if used) is notoriously brittle.
  - **Mitigation**: Rely on Visual Regression Testing (VRT) for snapshots of these states, rather than functional assertions on the canvas content.

## Recommendations for Sprint 0

1.  **Mock Time Service**: Implement `TimeService` with a `provider` pattern to easily swap between Real/Mock implementations.
2.  **Playwright Fixtures**: Create custom Playwright fixtures for `offlineContext` to simplify writing offline tests.
