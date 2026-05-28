---
description: "Task list for overdue todo items feature"
---

# Tasks: Support for Overdue Todo Items

**Input**: Design documents from `/specs/001-overdue-todo-items/`

**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/overdue-ui-contract.md ✅, quickstart.md ✅

**Tests**: Per the project constitution (Principle II: Test-First Development), tests are
MANDATORY. Test tasks MUST be written before their corresponding implementation tasks and
MUST appear earlier in the task list to enforce the Red-Green-Refactor cycle.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- All tasks include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm baseline before any changes are made. No new dependencies or configuration needed — this feature is frontend-only with no new packages.

- [X] T001 Confirm existing frontend tests pass as baseline before any changes: `cd packages/frontend && npm test`

**Checkpoint**: All existing tests green — ready to begin

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Add the CSS rule shared by all three user stories. Every story depends on `.overdue-due-date` being defined before any component changes are made.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [X] T002 Add `.overdue-due-date { color: var(--danger-color); }` rule to `packages/frontend/src/App.css`

**Checkpoint**: CSS infrastructure ready — all user story phases may now begin

---

## Phase 3: User Story 1 - View Overdue Todos at a Glance (Priority: P1) 🎯 MVP

**Goal**: Display a red due date text on any incomplete todo whose due date is strictly before today. Auto-refresh overdue status every 60 seconds without a page reload.

**Independent Test**: Create a todo with a past due date → due date text appears in the danger color. Create a todo with today's or a future due date → no color change. No page reload needed.

### Tests for User Story 1 *(Write FIRST — must FAIL before implementation begins)*

> **Constitution Principle II**: Red-Green-Refactor is mandatory. These tasks MUST
> precede all implementation tasks for this user story.

- [X] T003 [US1] Write overdue indicator test cases (4 scenarios: past due date → class present; today → absent; future → absent; null due date → element absent) in `packages/frontend/src/components/__tests__/TodoCard.test.js`
- [X] T004 [US1] Write 60-second auto-refresh test using `jest.useFakeTimers` (advance 60 s → overdue state re-evaluated) in `packages/frontend/src/components/__tests__/TodoCard.test.js`

### Implementation for User Story 1

- [X] T005 [US1] Add `isOverdue` pure function (dueDate + completed guards; string comparison per research.md) to `packages/frontend/src/components/TodoCard.js`
- [X] T006 [US1] Apply `overdue-due-date` class conditionally to due date `<p>` element per overdue-ui-contract.md in `packages/frontend/src/components/TodoCard.js`
- [X] T007 [P] [US1] Add `tick` state counter and 60-second `setInterval` (with cleanup) inside `useEffect` in `packages/frontend/src/App.js`

**Checkpoint**: At this point, User Story 1 is fully functional and independently testable

---

## Phase 4: User Story 2 - Completed Todos Are Never Shown as Overdue (Priority: P2)

**Goal**: Ensure completed todos never display the overdue indicator regardless of their due date. Marking an overdue todo complete removes the indicator immediately.

**Independent Test**: Create a todo with a past due date and mark it complete → no overdue indicator. Previously overdue todo → check the checkbox → indicator disappears without page reload.

### Tests for User Story 2 *(Write FIRST — must FAIL before implementation begins)*

- [X] T008 [US2] Write completed-todo test (completed + past due date → `overdue-due-date` class absent) in `packages/frontend/src/components/__tests__/TodoCard.test.js`
- [X] T009 [US2] Write mark-complete transition test (overdue todo → check complete → indicator disappears immediately) in `packages/frontend/src/components/__tests__/TodoCard.test.js`

### Implementation for User Story 2

- [X] T010 [US2] Confirm `isOverdue` function gates on `todo.completed` field and returns false for completed todos in `packages/frontend/src/components/TodoCard.js` (no separate change needed if T005 is correct — verify and document)

**Checkpoint**: At this point, User Stories 1 AND 2 are fully functional and independently testable

---

## Phase 5: User Story 3 - Overdue Indicator Respects Light and Dark Mode (Priority: P3)

**Goal**: Confirm the overdue indicator is visible and legible in both light mode and dark mode, using the correct danger color token for each theme.

**Independent Test**: Toggle the theme to dark mode → overdue indicator remains visible using `#ef5350`. Toggle back to light mode → indicator uses `#c62828`. No additional CSS changes required.

### Tests for User Story 3 *(Write FIRST — must FAIL before implementation begins)*

- [X] T011 [US3] Write light-mode test (overdue todo in light theme → due date text uses `--danger-color` / `#c62828`) in `packages/frontend/src/components/__tests__/TodoCard.test.js`
- [X] T012 [US3] Write dark-mode test (overdue todo in dark theme → due date text uses `--danger-color` / `#ef5350`) in `packages/frontend/src/components/__tests__/TodoCard.test.js`

### Implementation for User Story 3

- [X] T013 [US3] Confirm `--danger-color` token is defined for both light (`#c62828`) and dark (`#ef5350`) modes in `packages/frontend/src/styles/theme.css` — no change expected per research.md; verify and document

**Checkpoint**: All three user stories are fully functional and independently testable in both themes

---

## Final Phase: Polish & Cross-Cutting Concerns

**Purpose**: Lint validation and manual end-to-end verification per quickstart.md.

- [X] T014 [P] Run full frontend test suite and confirm 100% pass rate: `cd packages/frontend && npm test`
- [X] T015 [P] Run ESLint from repository root and resolve any errors: `npm run lint`
- [X] T016 Follow quickstart.md manual validation checklist (6 scenarios: past due date → red; today → no red; future → no red; complete overdue → red disappears; theme toggle light/dark → indicator visible)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 — BLOCKS all user stories
- **User Stories (Phase 3–5)**: All depend on Phase 2 completion
  - Can proceed sequentially P1 → P2 → P3 (single developer)
  - Or in parallel once Phase 2 is complete (multiple developers, separate test files)
- **Polish (Final Phase)**: Depends on all desired user story phases being complete

### User Story Dependencies

- **User Story 1 (P1)**: Starts after Phase 2 — no dependency on US2 or US3
- **User Story 2 (P2)**: Starts after Phase 2 — integrates with US1's `isOverdue` function but independently testable
- **User Story 3 (P3)**: Starts after Phase 2 — integrates with US1's CSS class but independently testable; `--danger-color` token already defined

### Within Each User Story

- Tests MUST be written and verified to FAIL before implementation begins
- Test tasks always precede implementation tasks in each phase
- `isOverdue` function (T005) must be complete before class application (T006)
- `isOverdue` function (T005) and `setInterval` (T007) are independent and can be done in parallel (different files)

### Parallel Opportunities

- **T007** can run in parallel with **T005/T006** (different files: `App.js` vs `TodoCard.js`)
- **T014** and **T015** can run in parallel (tests vs lint — independent processes)
- US2 and US3 test tasks (T008–T012) are all in the same file; execute sequentially

---

## Parallel Example: User Story 1

```bash
# After tests T003 and T004 are written and confirmed FAILING:

# In parallel — different files, no dependency on each other:
# Developer A:
Task T005: Add isOverdue function to packages/frontend/src/components/TodoCard.js
Task T006: Apply overdue-due-date class in packages/frontend/src/components/TodoCard.js

# Developer B (simultaneously):
Task T007: Add tick state + setInterval in packages/frontend/src/App.js
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup — confirm baseline
2. Complete Phase 2: Foundational — add `.overdue-due-date` CSS rule
3. Complete Phase 3: User Story 1 — write tests (T003, T004), then implement (T005, T006, T007)
4. **STOP and VALIDATE**: Run tests (`npm test`), verify manual scenarios from quickstart.md
5. Demo/deploy MVP — core overdue indicator is fully functional

### Incremental Delivery

1. MVP (US1): Visual overdue indicator for incomplete past-due todos + auto-refresh → demo-ready
2. Add US2: Completed todo guard + transition test → correctness milestone
3. Add US3: Theme-mode test verification → accessibility milestone
4. Polish: Lint + full quickstart validation → release-ready
