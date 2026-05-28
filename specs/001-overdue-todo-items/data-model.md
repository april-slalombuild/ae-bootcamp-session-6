# Data Model: Support for Overdue Todo Items

**Branch**: `001-overdue-todos` | **Date**: 2026-05-28

## Existing Entity: Todo

No schema changes are required. The `Todo` entity already carries all fields needed to derive overdue status.

| Field       | Type      | Required | Notes                                                          |
|-------------|-----------|----------|----------------------------------------------------------------|
| `id`        | integer   | yes      | Backend-assigned primary key                                   |
| `title`     | string    | yes      | 1–255 characters                                               |
| `completed` | integer   | yes      | `0` = incomplete, `1` = complete (SQLite boolean convention)   |
| `dueDate`   | string    | no       | ISO format `YYYY-MM-DD`; `null` when no due date is set        |
| `createdAt` | string    | yes      | ISO datetime; managed by backend                               |

## Derived Property: `isOverdue`

`isOverdue` is **not stored**. It is a pure, display-only derivation computed at render time in `TodoCard.js`:

```
isOverdue(todo) =
  todo.dueDate !== null
  AND todo.dueDate < today   // strict string comparison, both YYYY-MM-DD
  AND todo.completed !== 1
```

### Truth Table

| dueDate       | completed | isOverdue |
|---------------|-----------|-----------|
| null          | 0         | false     |
| today         | 0         | false     |
| past date     | 0         | **true**  |
| future date   | 0         | false     |
| past date     | 1         | false     |

### Today's Date

`today` is determined by `new Date().toISOString().slice(0, 10)`, evaluated at render time.
It is recalculated on every render, which includes the 60-second interval tick in `App.js`.

## State Transitions

```
incomplete + no due date   ──────────────────────────────►  never overdue
incomplete + future date   ──── (midnight passes) ─────►  overdue (indicator shown)
overdue (incomplete)       ──── (user completes) ──────►  not overdue (indicator hidden)
```

## No Backend Changes

The backend REST API (`packages/backend/src/`) is unchanged. No new routes, fields, or
validation rules are required. The frontend receives the existing `dueDate` and `completed`
fields from the API and derives overdue status locally.
