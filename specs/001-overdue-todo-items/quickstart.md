# Quickstart: Support for Overdue Todo Items

**Branch**: `001-overdue-todos`

## Prerequisites

- Node.js 16+ and npm installed
- Dependencies installed: run `npm install` from the repository root once

## Run the App Locally

```bash
# From repository root — starts both frontend (port 3000) and backend (port 5001)
npm run start
```

Open `http://localhost:3000` in a browser to see the app.

## Run the Tests

```bash
# All tests (frontend + backend)
npm test

# Frontend tests only
cd packages/frontend && npm test

# Frontend tests in watch mode
cd packages/frontend && npm test -- --watch

# Run only TodoCard tests
cd packages/frontend && npm test -- --testPathPattern=TodoCard
```

## Lint

```bash
# From repository root
npm run lint
```

All ESLint errors must be resolved before committing.

## Files Changed by This Feature

| File | Change |
|------|--------|
| `packages/frontend/src/components/TodoCard.js` | Add `isOverdue` function; apply `overdue-due-date` class to due date `<p>` |
| `packages/frontend/src/App.css` | Add `.overdue-due-date { color: var(--danger-color); }` |
| `packages/frontend/src/App.js` | Add 60-second `setInterval` to trigger re-renders |
| `packages/frontend/src/components/__tests__/TodoCard.test.js` | Add overdue indicator test cases (written first) |

## Verify the Feature Manually

1. Start the app (`npm run start`)
2. Create a todo with a due date **in the past** (e.g., yesterday) — the due date text should appear in red
3. Create a todo with a due date **of today** — no red color
4. Create a todo with a due date **in the future** — no red color
5. Mark the past-due todo as **complete** — red color disappears immediately
6. Toggle the theme (light ↔ dark) — the red indicator should be visible in both themes

## Design Tokens Referenced

| Token | Light Mode | Dark Mode |
|-------|-----------|-----------|
| `--danger-color` | `#c62828` | `#ef5350` |
