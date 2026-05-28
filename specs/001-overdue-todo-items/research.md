# Research: Support for Overdue Todo Items

**Branch**: `001-overdue-todos` | **Date**: 2026-05-28

## 1. Overdue Date Comparison in JavaScript

**Decision**: Compare `todo.dueDate` (ISO `YYYY-MM-DD` string) against `new Date().toISOString().slice(0, 10)` — the current local date as a `YYYY-MM-DD` string.

**Rationale**: Both values are plain date strings in the same format. String comparison (`<`) is correct and sufficient; no date parsing or timezone math is required when both operands are `YYYY-MM-DD`. This avoids `Date` constructor quirks (UTC vs local midnight issues).

**Alternatives Considered**:
- `new Date(dueDate) < new Date()` — rejected: `new Date('2026-05-27')` parses as UTC midnight, which is wrong when the user's local time is ahead of UTC (the date would not yet appear "past" at local midnight).
- Moment.js / date-fns — rejected: adds a dependency for a trivial comparison; YAGNI.

---

## 2. Auto-Refresh Strategy (FR-009)

**Decision**: Use a single `setInterval` in `App.js` with a 60-second period to force a `Date.now()` state update, causing React to re-render and re-evaluate all `isOverdue` computations.

**Rationale**: The overdue check is a pure, synchronous derivation at render time. Triggering a re-render every 60 seconds is the minimal viable approach — no global state, no event bus, no context needed.

**Alternatives Considered**:
- `setInterval` inside `TodoCard` — rejected: creates N intervals for N todos, wasteful and harder to clean up.
- Polling the backend — rejected: the spec explicitly states client-side date comparison; no backend involvement.
- `requestAnimationFrame` loop — rejected: overkill; per-frame checks for a once-per-minute update would waste CPU.

---

## 3. CSS Approach for the Overdue Indicator

**Decision**: Add a CSS class `.overdue-due-date` with `color: var(--danger-color)` in `App.css`. Apply the class conditionally to the `<p className="todo-due-date">` element in `TodoCard.js`.

**Rationale**: `--danger-color` is already defined in `theme.css` for both light (`#c62828`) and dark (`#ef5350`) modes. Using the existing token means light/dark mode support is automatic with zero extra CSS. A class toggle is the simplest, most testable pattern in React.

**Alternatives Considered**:
- Inline `style={{ color: 'var(--danger-color)' }}` — rejected: harder to override, less idiomatic, can't be targeted in snapshot tests.
- New CSS custom property — rejected: `--danger-color` already exists and exactly matches the spec's requirement.
- CSS-in-JS / styled-components — rejected: project uses plain CSS; no CSS-in-JS tooling is installed.

---

## 4. isOverdue Logic Placement

**Decision**: Implement `isOverdue` as a standalone pure function at the top of `TodoCard.js`, not as a separate utility module.

**Rationale**: YAGNI — this function is only used in one place. Extracting it to a shared utility would be premature abstraction. A colocated function is immediately visible to the reader of the component.

**Alternatives Considered**:
- Shared `utils/dateUtils.js` — rejected: only one consumer exists; introduces an unnecessary file and import.
- Custom hook `useOverdue` — rejected: no state or side effects inside the hook; a plain function is sufficient.

---

## 5. Test Strategy

**Decision**: Add test cases to `packages/frontend/src/components/__tests__/TodoCard.test.js` following the existing `@testing-library/react` pattern.

**Test cases required** (written before implementation per constitution):
1. Incomplete todo with past due date → `overdue-due-date` class present
2. Incomplete todo with today's due date → class absent
3. Incomplete todo with future due date → class absent
4. Incomplete todo with no due date → class absent
5. Completed todo with past due date → class absent
6. Timer-based refresh: `jest.useFakeTimers` + advance 60s → overdue state re-evaluated

**Rationale**: Covers all acceptance scenarios from spec FR-001 through FR-009.
