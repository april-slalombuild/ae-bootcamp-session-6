# Feature Specification: Support for Overdue Todo Items

**Feature Branch**: `feature/overdue-todo-items`

**Created**: 2026-05-28

**Status**: Draft

**Input**: User description: "Support for Overdue Todo Items — Users need a clear, visual way to identify which todos have not been completed by their due date."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View Overdue Todos at a Glance (Priority: P1)

A user opens the todo app and immediately sees which of their incomplete tasks have passed their due date. Overdue todos are visually distinct from non-overdue todos so the user does not need to manually compare dates to today.

**Why this priority**: This is the core value of the feature — without a visual distinction, users have no benefit from this feature at all. All other stories depend on this working correctly.

**Independent Test**: Can be fully tested by creating a todo with a past due date and verifying the visual indicator appears, while a todo with a future due date shows no indicator.

**Acceptance Scenarios**:

1. **Given** an incomplete todo with a due date in the past, **When** the user views the todo list, **Then** the todo displays a clear visual overdue indicator (e.g., distinct color, label, or icon).
2. **Given** an incomplete todo with a due date set to today, **When** the user views the todo list, **Then** the todo does NOT display an overdue indicator.
3. **Given** an incomplete todo with a due date in the future, **When** the user views the todo list, **Then** the todo does NOT display an overdue indicator.
4. **Given** an incomplete todo with no due date, **When** the user views the todo list, **Then** the todo does NOT display an overdue indicator.

---

### User Story 2 - Completed Todos Are Never Shown as Overdue (Priority: P2)

A user who has marked a todo as complete does not see an overdue indicator on it, even if its due date has already passed. This prevents completed work from creating false urgency.

**Why this priority**: Showing completed items as overdue would be confusing and misleading. This is a correctness requirement that directly impacts trust in the feature.

**Independent Test**: Can be fully tested by creating a todo with a past due date, marking it complete, and verifying no overdue indicator appears.

**Acceptance Scenarios**:

1. **Given** a completed todo with a due date in the past, **When** the user views the todo list, **Then** the todo does NOT display an overdue indicator.
2. **Given** a todo that was previously shown as overdue, **When** the user marks it as complete, **Then** the overdue indicator disappears immediately.

---

### User Story 3 - Overdue Indicator Respects Light and Dark Mode (Priority: P3)

The overdue visual indicator is clearly visible and legible in both light mode and dark mode, consistent with the app's design system.

**Why this priority**: The app already supports a light/dark mode toggle. The overdue indicator must work in both themes to avoid accessibility or usability gaps.

**Independent Test**: Can be fully tested by toggling the theme and verifying the overdue indicator remains visible and uses the appropriate danger color for each mode.

**Acceptance Scenarios**:

1. **Given** an overdue todo and the app in light mode, **When** the user views the todo list, **Then** the overdue indicator uses the danger color appropriate for light mode.
2. **Given** an overdue todo and the app in dark mode, **When** the user views the todo list, **Then** the overdue indicator uses the danger color appropriate for dark mode.

---

### Edge Cases

- What happens when a todo has no due date? → It is never considered overdue; no indicator is shown.
- What happens when a todo is due exactly today? → It is not overdue; no indicator is shown (overdue means strictly past).
- What happens when a completed todo has a past due date? → No overdue indicator; completed status takes precedence.
- How does the system handle due dates when the user's local clock is incorrect? → Overdue status is determined by the client's local date at the time the page loads; no server-side date enforcement is applied.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST visually distinguish incomplete todos whose due date is strictly before today's date from all other todos.
- **FR-002**: A todo MUST be considered overdue if and only if: it has a due date set, the due date is before today (not including today), and it is not marked as complete.
- **FR-003**: Completed todos MUST NOT display an overdue indicator, regardless of their due date.
- **FR-004**: Todos without a due date MUST NOT display an overdue indicator.
- **FR-005**: Todos with a due date of today MUST NOT display an overdue indicator.
- **FR-006**: The overdue indicator MUST be visually distinguishable using the design system's danger color (red) for both light and dark modes.
- **FR-007**: When a user marks an overdue todo as complete, the overdue indicator MUST disappear without requiring a page reload.
- **FR-008**: The overdue determination MUST be based on the current local date (date portion only; time of day is ignored).

### Key Entities

- **Todo**: Existing entity with title, optional due date, and completion status. The "overdue" state is a derived, display-only property — computed from due date and completion status at render time. No new data fields are required on the todo entity.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can identify overdue todos within 3 seconds of opening the todo list without reading individual due dates.
- **SC-002**: 100% of incomplete todos with a due date before today display the overdue indicator; 0% of completed todos or todos with no due date display the indicator.
- **SC-003**: The overdue indicator is visible and legible in both light and dark modes without additional user action.
- **SC-004**: When a user completes an overdue todo, the overdue indicator disappears in the same interaction, with no additional steps required.

## Assumptions

- Overdue status is computed on the client side by comparing the todo's due date to the current local date at the time of rendering. No backend changes are required.
- Due dates are compared at the date level only (YYYY-MM-DD); time-of-day is not considered.
- The existing todo data model already stores a due date field, so no schema or API changes are needed.
- "Overdue" is defined as a due date strictly before today (yesterday or earlier). A todo due today is not overdue.
- The overdue indicator is a visual enhancement to the existing todo card; the existing card layout and interaction model (checkbox, edit, delete) remain unchanged.
- The feature is scoped to display-only changes — no new filtering, sorting, or grouping by overdue status is included.
- Desktop-focused display; no mobile-specific styling is required for the indicator.
