# Story 2.3: The Hatching Ritual (Reveal)

## Story

**As a** User,
**I want** to open my ready Egg and see what's inside,
**So that** I can get a reward for my patience.

## Acceptance Criteria

- [ ] **Given** an Egg is "Ready to Hatch" (State: 'ready')
- [ ] **When** I click "HATCH NOW!"
- [ ] **Then** a "Shake" animation and vibration should play
- [ ] **And** After a short delay, the Egg should crack open
- [ ] **And** A random Pet (New Entity) should be generated
- [ ] **And** The Pet should be added to my Collection (DB)
- [ ] **And** The Egg should be removed (or marked hatched/consumed)

## Technical Tasks

- [ ] **Schema**: Create `pet.schema.ts` (id, name, type, rarity, level, createdAt).
- [ ] **DB**: Register `petSchema` in `db/index.ts`.
- [ ] **Data**: Create a simple `LootTable` (Map Rarity -> Potential Pets).
- [ ] **Logic**: Implement `hatchEgg(eggId)` in `useIncubator.ts` (Delete Egg -> Create Pet).
- [ ] **UI**: Create `HatchReveal.vue` (Animation + Result Modal).
- [ ] **Store**: Create `usePetStore` or `useCollection` to fetch owned pets.
