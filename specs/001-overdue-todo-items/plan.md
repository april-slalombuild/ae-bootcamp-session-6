# Implementation Plan: Support for Overdue Todo Items

**Branch**: `001-overdue-todos` | **Date**: 2026-05-28 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-overdue-todo-items/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Add a visual overdue indicator to the `TodoCard` component by computing a derived `isOverdue`
flag (due date strictly before today, incomplete todo) at render time. Apply the
`--danger-color` CSS token to the due date text via an `overdue-due-date` CSS class.
An interval-based refresh (every 60 seconds) in `App.js` ensures overdue state is
re-evaluated without a page reload. No backend changes are required.

## Technical Context

**Language/Version**: JavaScript (ES2020) — React 18 (frontend), Node.js 16+ / Express.js (backend)

**Primary Dependencies**: React 18, @testing-library/react, Jest 29

**Storage**: N/A (no schema or API changes; overdue is a derived display property)

**Testing**: Jest + @testing-library/react (frontend unit/component tests)

**Target Platform**: Desktop web browser (Chrome/Firefox/Safari latest)

**Project Type**: Web application — full-stack monorepo (`packages/frontend/`, `packages/backend/`)

**Performance Goals**: Overdue status recalculated at most once per minute; no measurable render penalty expected

**Constraints**: Frontend-only change; no direct browser storage for todo data; must pass ESLint with no errors

**Scale/Scope**: Single-user desktop app; this feature touches one React component and one CSS file

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Verify compliance with all five principles from `.specify/memory/constitution.md`:

- [x] **I. Code Quality & Simplicity**: `isOverdue` is a single pure function (< 5 lines).
  No new abstractions introduced. `camelCase` for the function, `overdue-due-date` CSS class
  follows existing kebab-case patterns. ESLint-compliant.
- [x] **II. Test-First Development**: Tests will be written first in `TodoCard.test.js` to cover
  all FR scenarios (past/today/future/null due date, completed override, theme variants).
  Coverage will remain above 80%.
- [x] **III. Scope Discipline**: Feature is display-only — no filtering, sorting, grouping, or
  new fields. Matches FR-001 through FR-009 exactly. No out-of-scope items.
- [x] **IV. Design System Adherence**: Uses `--danger-color` CSS token already defined for both
  light (`#c62828`) and dark (`#ef5350`) modes in `theme.css`. No new design tokens introduced.
- [x] **V. Full-Stack Monorepo Architecture**: All changes in `packages/frontend/`. No backend
  changes. No service-layer modifications needed (overdue is derived at render time).

## Project Structure

### Documentation (this feature)

```text
specs/001-overdue-todo-items/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
│   └── overdue-ui-contract.md
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
packages/frontend/
├── src/
│   ├── components/
│   │   ├── TodoCard.js          # MODIFY: add isOverdue helper + apply CSS class
│   │   └── __tests__/
│   │       └── TodoCard.test.js # MODIFY: add overdue indicator tests (write first)
│   ├── styles/
│   │   └── theme.css            # NO CHANGE: --danger-color already defined
│   └── App.js                   # MODIFY: add 60s interval to trigger re-renders
│   └── App.css                  # MODIFY: add .overdue-due-date rule
packages/backend/                # NO CHANGES
```

**Structure Decision**: Web application (Option 2). All changes confined to `packages/frontend/`.
No backend files modified. Overdue state is derived at render time — no new fields, routes, or services.

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   └── services/
└── tests/

# [REMOVE IF UNUSED] Option 3: Mobile + API (when "iOS/Android" detected)
api/
└── [same as backend above]

ios/ or android/
└── [platform-specific structure: feature modules, UI flows, platform tests]
```

**Structure Decision**: [Document the selected structure and reference the real
directories captured above]

## Complexity Tracking

> No constitution violations. No entries required.
