import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import TodoCard from '../TodoCard';

describe('TodoCard Component', () => {
  const mockTodo = {
    id: 1,
    title: 'Test Todo',
    dueDate: '2025-12-25',
    completed: 0,
    createdAt: '2025-11-01T00:00:00Z'
  };

  const mockHandlers = {
    onToggle: jest.fn(),
    onEdit: jest.fn(),
    onDelete: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render todo title and due date', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    expect(screen.getByText('Test Todo')).toBeInTheDocument();
    expect(screen.getByText(/December 25, 2025/)).toBeInTheDocument();
  });

  it('should render unchecked checkbox when todo is incomplete', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
  });

  it('should render checked checkbox when todo is complete', () => {
    const completedTodo = { ...mockTodo, completed: 1 };
    render(<TodoCard todo={completedTodo} {...mockHandlers} isLoading={false} />);
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });

  it('should call onToggle when checkbox is clicked', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    
    expect(mockHandlers.onToggle).toHaveBeenCalledWith(mockTodo.id);
  });

  it('should show edit button', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const editButton = screen.getByLabelText(/Edit/);
    expect(editButton).toBeInTheDocument();
  });

  it('should show delete button', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const deleteButton = screen.getByLabelText(/Delete/);
    expect(deleteButton).toBeInTheDocument();
  });

  it('should call onDelete when delete button is clicked and confirmed', () => {
    window.confirm = jest.fn(() => true);
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const deleteButton = screen.getByLabelText(/Delete/);
    fireEvent.click(deleteButton);
    
    expect(mockHandlers.onDelete).toHaveBeenCalledWith(mockTodo.id);
  });

  it('should enter edit mode when edit button is clicked', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const editButton = screen.getByLabelText(/Edit/);
    fireEvent.click(editButton);
    
    expect(screen.getByDisplayValue('Test Todo')).toBeInTheDocument();
  });

  it('should apply completed class when todo is completed', () => {
    const completedTodo = { ...mockTodo, completed: 1 };
    const { container } = render(<TodoCard todo={completedTodo} {...mockHandlers} isLoading={false} />);
    
    const card = container.querySelector('.todo-card');
    expect(card).toHaveClass('completed');
  });

  it('should not render due date when dueDate is null', () => {
    const todoNoDate = { ...mockTodo, dueDate: null };
    render(<TodoCard todo={todoNoDate} {...mockHandlers} isLoading={false} />);
    
    expect(screen.queryByText(/Due:/)).not.toBeInTheDocument();
  });
});

// Helper: returns a YYYY-MM-DD date string offset from today by `days`
function getDateOffset(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

describe('TodoCard — Overdue Indicator (US1)', () => {
  const mockHandlers = {
    onToggle: jest.fn(),
    onEdit: jest.fn(),
    onDelete: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // T003 — Scenario 1: past due date → overdue-due-date class present
  it('should add overdue-due-date class when incomplete todo has a past due date', () => {
    const yesterday = getDateOffset(-1);
    const todo = { id: 1, title: 'Overdue', dueDate: yesterday, completed: 0 };
    const { container } = render(<TodoCard todo={todo} {...mockHandlers} isLoading={false} />);

    const dueDateEl = container.querySelector('.todo-due-date');
    expect(dueDateEl).toHaveClass('overdue-due-date');
  });

  // T003 — Scenario 2: today → no overdue class
  it('should NOT add overdue-due-date class when due date is today', () => {
    const today = getDateOffset(0);
    const todo = { id: 2, title: 'Due Today', dueDate: today, completed: 0 };
    const { container } = render(<TodoCard todo={todo} {...mockHandlers} isLoading={false} />);

    const dueDateEl = container.querySelector('.todo-due-date');
    expect(dueDateEl).not.toHaveClass('overdue-due-date');
  });

  // T003 — Scenario 3: future date → no overdue class
  it('should NOT add overdue-due-date class when due date is in the future', () => {
    const tomorrow = getDateOffset(1);
    const todo = { id: 3, title: 'Future', dueDate: tomorrow, completed: 0 };
    const { container } = render(<TodoCard todo={todo} {...mockHandlers} isLoading={false} />);

    const dueDateEl = container.querySelector('.todo-due-date');
    expect(dueDateEl).not.toHaveClass('overdue-due-date');
  });

  // T003 — Scenario 4: null due date → due date element not rendered
  it('should NOT render due date element when dueDate is null', () => {
    const todo = { id: 4, title: 'No Date', dueDate: null, completed: 0 };
    const { container } = render(<TodoCard todo={todo} {...mockHandlers} isLoading={false} />);

    expect(container.querySelector('.todo-due-date')).not.toBeInTheDocument();
  });

  // T004 — 60-second auto-refresh: after 60 s a past-due date remains overdue
  it('should retain overdue-due-date class after 60-second interval tick', () => {
    jest.useFakeTimers();
    const yesterday = getDateOffset(-1);
    const todo = { id: 5, title: 'Still Overdue', dueDate: yesterday, completed: 0 };
    const { container } = render(<TodoCard todo={todo} {...mockHandlers} isLoading={false} />);

    act(() => {
      jest.advanceTimersByTime(60_000);
    });

    const dueDateEl = container.querySelector('.todo-due-date');
    expect(dueDateEl).toHaveClass('overdue-due-date');

    jest.useRealTimers();
  });
});

describe('TodoCard — Completed Todo Never Overdue (US2)', () => {
  const mockHandlers = {
    onToggle: jest.fn(),
    onEdit: jest.fn(),
    onDelete: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // T008 — completed + past due date → no overdue class
  it('should NOT add overdue-due-date class when todo is completed even with a past due date', () => {
    const yesterday = getDateOffset(-1);
    const todo = { id: 6, title: 'Done Overdue', dueDate: yesterday, completed: 1 };
    const { container } = render(<TodoCard todo={todo} {...mockHandlers} isLoading={false} />);

    const dueDateEl = container.querySelector('.todo-due-date');
    expect(dueDateEl).not.toHaveClass('overdue-due-date');
  });

  // T009 — mark overdue todo complete → indicator disappears immediately
  it('should remove overdue-due-date class immediately when todo is marked complete', () => {
    const yesterday = getDateOffset(-1);
    const incompleteTodo = { id: 7, title: 'Was Overdue', dueDate: yesterday, completed: 0 };
    const completedTodo = { ...incompleteTodo, completed: 1 };

    const { container, rerender } = render(
      <TodoCard todo={incompleteTodo} {...mockHandlers} isLoading={false} />
    );
    expect(container.querySelector('.todo-due-date')).toHaveClass('overdue-due-date');

    rerender(<TodoCard todo={completedTodo} {...mockHandlers} isLoading={false} />);
    expect(container.querySelector('.todo-due-date')).not.toHaveClass('overdue-due-date');
  });
});

describe('TodoCard — Overdue Indicator in Light and Dark Mode (US3)', () => {
  const mockHandlers = {
    onToggle: jest.fn(),
    onEdit: jest.fn(),
    onDelete: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // T011 — light mode: overdue due date carries overdue-due-date class
  it('should apply overdue-due-date class in light mode (uses --danger-color #c62828)', () => {
    document.documentElement.removeAttribute('data-theme'); // default = light
    const yesterday = getDateOffset(-1);
    const todo = { id: 8, title: 'Light Overdue', dueDate: yesterday, completed: 0 };
    const { container } = render(<TodoCard todo={todo} {...mockHandlers} isLoading={false} />);

    expect(container.querySelector('.todo-due-date')).toHaveClass('overdue-due-date');
  });

  // T012 — dark mode: overdue due date carries overdue-due-date class
  it('should apply overdue-due-date class in dark mode (uses --danger-color #ef5350)', () => {
    document.documentElement.setAttribute('data-theme', 'dark');
    const yesterday = getDateOffset(-1);
    const todo = { id: 9, title: 'Dark Overdue', dueDate: yesterday, completed: 0 };
    const { container } = render(<TodoCard todo={todo} {...mockHandlers} isLoading={false} />);

    expect(container.querySelector('.todo-due-date')).toHaveClass('overdue-due-date');

    document.documentElement.removeAttribute('data-theme'); // cleanup
  });
});
