# Story 2.2: Incubation Logic (Time & Security)

## Story

**As a** User,
**I want** my Egg to incubate over time,
**So that** I can eventually hatch it (and I expect the game to be fair).

## Acceptance Criteria

- [x] **Given** I have purchased an Egg (State: 'new')
- [x] **When** I click the Egg in the market/inventory
- [x] **Then** it should open an "Incubator Modal" or View
- [x] **And** I can click "Start Incubation"
- [x] **Then** the Egg state changes to 'incubating'
- [x] **And** A countdown timer (e.g., 30m) starts
- [x] **When** the timer reaches zero
- [x] **Then** the Egg state should change to 'ready' (Ready to Hatch)
- [ ] **Note**: Anti-cheat (Server Timestamp) is descoped for MVP; use local storage timestamp validation.

## Technical Tasks

- [ ] Update `egg.schema.ts` to support `startTime` and `duration` fields if not present (currently has `hatchTime`).
- [ ] Create `IncubatorModal.vue` to show the egg and timer.
- [ ] Implement `startIncubation(eggId)` action in `useIncubator.ts`.
- [ ] Implement "Timer Logic" (Client-side countdown based on `hatchTime - Date.now()`).
- [ ] Implement "Ready State" logic when time < 0.

## Development Notes

- Use `useNow()` or `useIntervalFn` from `@vueuse/core` for the UI timer.
- `hatchTime` in schema should be the _Timestamp_ when it will hatch.
- If `Date.now() > hatchTime`, show "Ready to Hatch" button.
