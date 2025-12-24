# Story 2.1: The Egg Market (Economy)

## Status

- [x] Drafted
- [x] Ready for Dev
- [x] In Progress
- [x] Verified
- [x] Done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a User,
I want to spend my earned Energy to buy Eggs,
So that I can start the incubation process.

## Acceptance Criteria

1.  **Energy Deduction**: Clicking "Buy Egg" deducts 100 Energy from the global store.
2.  **Insufficient Funds**: If Energy < 100, the button is disabled or shows a "Not enough energy" Toast message.
3.  **Egg Generation**: Buying an egg creates a new `Egg` entity in the RxDB `incubator` collection with `status: 'incubating'` (or 'new').
4.  **UI Feedback**: The UI updates to show an "Unhatched Egg" in the incubator slot immediately.

## Tasks / Subtasks

- [ ] Create Incubator Module (AC: 1, 3)
  - [ ] Create directory `src/modules/incubator`.
  - [ ] Create RxDB Schema `egg.schema.ts` (id, status, hatchTime, petId).
  - [ ] Register collection in `database.ts`.
- [ ] Implement Energy Store Logic (AC: 1)
  - [ ] Ensure `useUserStore` has `energy` state and `spendEnergy(amount)` action.
  - [ ] Add persistence to user store (RxDB or LocalStorage).
- [ ] Build Egg Market UI (AC: 2, 4)
  - [ ] Create component `EggMarket.vue`.
  - [ ] Add "Buy Button" with price check logic.
  - [ ] Display "Incubator Slot" state (Empty vs Has Egg).

## Dev Notes

- **Architecture**:
  - **Module**: `src/modules/incubator/`.
  - **Store**: `src/stores/useUserStore.ts` (for Energy).
  - **DB**: New collection `eggs` in RxDB.
- **UX**:
  - **Button**: Use `NeonButton` component (if exists) or clean Tailwind button with Glow effect.
  - **Feedback**: Use `sonner` or standard `alert` for insufficient funds (MVP).

### References

- [Epics](file:///Users/ray.pong/Developer/BMad2/bmad-app/_bmad-output/epics.md): "Story 2.1", "Energy Deduction".
- [Project Context](file:///Users/ray.pong/Developer/BMad2/bmad-app/_bmad-output/project-context.md): "Reactive Stream Pattern".

## Dev Agent Record

### Agent Model Used

Gemini 2.0 Flash

### File List
