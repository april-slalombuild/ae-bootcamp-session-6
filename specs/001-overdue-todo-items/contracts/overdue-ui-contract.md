# UI Contract: Overdue Todo Indicator

**Feature**: Support for Overdue Todo Items
**Component**: `TodoCard` (`packages/frontend/src/components/TodoCard.js`)
**Date**: 2026-05-28

## Contract Description

The `TodoCard` component MUST apply a visual overdue indicator to the due date text when a
todo item is overdue. The indicator is implemented as a CSS class that applies the design
system's danger color token.

---

## Overdue Indicator Rule

| Condition                                            | CSS Class on `<p className="todo-due-date">` |
|------------------------------------------------------|----------------------------------------------|
| `isOverdue(todo)` is `true`                          | `"todo-due-date overdue-due-date"`            |
| `isOverdue(todo)` is `false` (any other case)        | `"todo-due-date"` (unchanged)                |

### `isOverdue` definition

```js
function isOverdue(todo) {
  if (!todo.dueDate || todo.completed) return false;
  const today = new Date().toISOString().slice(0, 10);
  return todo.dueDate < today;
}
```

---

## CSS Token Usage

```css
/* In App.css — appended to existing rules */
.overdue-due-date {
  color: var(--danger-color);
}
```

The `--danger-color` token is already defined in `theme.css`:
- **Light mode**: `#c62828`
- **Dark mode**: `#ef5350`

No new tokens or overrides are needed.

---

## Component Rendering Contract

```jsx
{todo.dueDate && (
  <p className={`todo-due-date${isOverdue(todo) ? ' overdue-due-date' : ''}`}>
    Due: {formatDate(todo.dueDate)}
  </p>
)}
```

- The element is **not rendered** when `todo.dueDate` is `null` or `undefined`.
- The `overdue-due-date` class is added **only** when `isOverdue(todo)` is `true`.
- No other card elements (title, checkbox, action buttons) are modified.

---

## Auto-Refresh Contract

`App.js` MUST set up an interval that triggers a re-render every 60 seconds to ensure overdue
status is re-evaluated across midnight without a page reload.

```js
// In App.js — inside useEffect
useEffect(() => {
  const interval = setInterval(() => {
    setTick(t => t + 1); // force re-render; `tick` is a local state counter
  }, 60_000);
  return () => clearInterval(interval);
}, []);
```

The `TodoCard` component itself requires no change to support this — it re-derives `isOverdue`
on every render automatically.

---

## Test Contract

All of the following assertions MUST pass in `TodoCard.test.js`:

| Scenario                                        | Element with `overdue-due-date` class |
|-------------------------------------------------|---------------------------------------|
| Incomplete, due date = yesterday                | present                               |
| Incomplete, due date = today                    | absent                                |
| Incomplete, due date = tomorrow                 | absent                                |
| Incomplete, no due date                         | absent (element not rendered)         |
| Completed, due date = yesterday                 | absent                                |
| After 60s interval tick (past midnight scenario)| present (via fake timers)             |
