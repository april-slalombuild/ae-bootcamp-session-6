<!--
SYNC IMPACT REPORT
==================
Version change: 0.0.0 (template) → 1.0.0
Modified principles: N/A (initial population from template placeholders)
Added sections:
  - Core Principles (5 principles derived from docs/)
  - Technical Constraints
  - Development Workflow
  - Governance
Removed sections: N/A
Templates updated:
  - .specify/templates/plan-template.md ✅ (Constitution Check gate aligned)
  - .specify/templates/spec-template.md ✅ (no changes required)
  - .specify/templates/tasks-template.md ✅ (no changes required)
Deferred TODOs: None
-->

# Todo App Constitution

## Core Principles

### I. Code Quality & Simplicity

Every piece of code MUST follow DRY (Don't Repeat Yourself), KISS (Keep It Simple, Stupid),
and SOLID principles — specifically Single Responsibility at the module/component level.

- Naming MUST follow project conventions: `camelCase` for variables/functions,
  `PascalCase` for React components and classes, `UPPER_SNAKE_CASE` for constants.
- Line length MUST stay under 100 characters; indentation MUST use 2 spaces.
- Imports MUST be ordered: external libraries → internal modules → styles, separated by blank lines.
- All code MUST pass ESLint with no errors before committing; warnings MUST be resolved
  before opening a pull request.
- Complexity MUST be justified. Prefer straightforward implementations over clever ones.
  Optimize only when a measurable performance need exists.

**Rationale**: Consistent, readable code reduces cognitive load across the team and makes
AI-assisted development predictable and reviewable.

### II. Test-First Development (NON-NEGOTIABLE)

Tests MUST be written before implementation code. The Red-Green-Refactor cycle is mandatory.

- Overall code coverage MUST reach and maintain 80%+.
- Unit tests MUST cover all React components, Express route handlers, and utility functions.
- Integration tests MUST cover component interactions, API communication, and
  frontend-to-backend data flows.
- Tests MUST be isolated: no shared mutable state between tests; all external dependencies
  (API calls, timers) MUST be mocked.
- Test files MUST be colocated in `__tests__/` directories adjacent to source files and
  named `{filename}.test.js`.
- Test names MUST be descriptive and behavior-focused, not implementation-focused.
- End-to-end tests are out of scope for initial development.

**Rationale**: Test-first discipline catches regressions early, documents intent, and makes
AI-generated code verifiable by design.

### III. Scope Discipline

Features MUST be implemented exactly as specified in functional requirements — no more,
no less. Gold-plating is prohibited.

- Out-of-scope features (authentication, multi-user, filtering, search, undo/redo,
  bulk operations, mobile optimization, categories/tags) MUST NOT be added without
  explicit approval and a spec update.
- Every new functional requirement MUST be reflected in a spec update before implementation.
- YAGNI (You Aren't Gonna Need It): abstractions and generalization MUST only be
  introduced when a second concrete use case exists.

**Rationale**: Scope creep is the primary cause of delivery delays and untested surface area.
Strict scope discipline keeps the app simple and the test suite meaningful.

### IV. Design System Adherence

All UI MUST conform to the established design system: Halloween-themed, Material Design-inspired,
single-column layout with full light/dark mode support.

- Color tokens MUST use the defined palette (primary: `#ff6b35` light / `#ff8c42` dark;
  secondary, accent, success, danger values as documented in `docs/ui-guidelines.md`).
- Spacing MUST follow the 8px grid system (xs=8px, sm=16px, md=24px, lg=32px, xl=48px).
- Typography MUST use the system font stack at defined sizes (heading 28px/700,
  body 16px/400, button 14px/600, etc.).
- All interactive elements MUST implement hover, focus, and disabled states as specified.
- Confirmation dialogs MUST be used for destructive actions (e.g., delete).
- New components MUST follow the card/button/input patterns defined in `docs/ui-guidelines.md`.

**Rationale**: A consistent design system reduces visual noise, ensures accessibility parity
across light/dark modes, and produces a coherent user experience.

### V. Full-Stack Monorepo Architecture

The project MUST maintain the established monorepo structure with clear separation between
frontend and backend packages.

- Frontend code MUST reside in `packages/frontend/src/` as a React application.
- Backend code MUST reside in `packages/backend/src/` as an Express.js API.
- Tests MUST be colocated within their respective package under `__tests__/` directories.
- Cross-package dependencies MUST be managed via npm workspaces; no ad-hoc path hacks.
- The frontend MUST communicate with the backend exclusively through the REST API service
  layer (`packages/frontend/src/services/`).
- No business logic MUST leak into React components; service modules own API communication.

**Rationale**: Clear architectural boundaries make each layer independently testable,
deployable, and comprehensible to AI agents working on isolated parts of the system.

## Technical Constraints

- **Frontend**: React (functional components, hooks); no class components in new code.
- **Backend**: Node.js v16+, Express.js; single-user scope — no authentication required.
- **Testing**: Jest for both packages; `@testing-library/react` for frontend component tests.
- **Package Management**: npm workspaces; run `npm install` from root, `npm test` for all tests,
  `npm run start` to start both frontend and backend.
- **Persistence**: Backend Express.js API is the sole persistence mechanism;
  no direct browser storage (localStorage/sessionStorage) for todo data.
- **Browser Target**: Desktop-focused; no specific mobile breakpoints required.

## Development Workflow

- Feature branches MUST follow the naming convention `feature/<description>`.
- All linting errors MUST be resolved before committing; run `npm run lint` to verify.
- Pull requests MUST include passing tests and maintain or improve coverage above 80%.
- The spec (`spec.md`) MUST be updated before any out-of-scope work begins.
- Code reviews MUST verify compliance with all five Core Principles before merging.

## Governance

This constitution supersedes all other practices documented in this repository. In the event
of a conflict between this document and any other guideline, the constitution takes precedence.

Amendments MUST be:
1. Proposed with a rationale and impact analysis.
2. Reflected in a version bump following semantic versioning:
   - MAJOR: principle removals, backward-incompatible governance changes.
   - MINOR: new principles or materially expanded guidance.
   - PATCH: clarifications, wording fixes, non-semantic refinements.
3. Propagated to all dependent templates (plan, spec, tasks) before the PR is merged.

All PRs and code reviews MUST include a constitution compliance check. Violations MUST be
documented with a justification in the Complexity Tracking table of the plan.

Refer to `docs/coding-guidelines.md`, `docs/testing-guidelines.md`, `docs/ui-guidelines.md`,
and `docs/functional-requirements.md` for detailed runtime development guidance.

**Version**: 1.0.0 | **Ratified**: 2026-05-28 | **Last Amended**: 2026-05-28
