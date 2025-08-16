import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { configureStore } from "@reduxjs/toolkit";
import todoReducer from "@/src/features/todo/store/todoSlice";
import { TodoItem } from "./index";
import type { Todo } from "@/src/features/todo/api/types";
import "@testing-library/jest-dom";

// Mock the hooks
vi.mock("@/hooks/useToggleTodoCompletion", () => ({
  useToggleTodoCompletion: () => ({
    mutate: vi.fn(),
    isPending: false,
  }),
}));

vi.mock("@/hooks/useDeleteTodo", () => ({
  useDeleteTodo: () => ({
    mutate: vi.fn(),
    isPending: false,
  }),
}));

vi.mock("@/hooks/useTodoDrag", () => ({
  useTodoDrag: () => ({
    controls: {},
    scale: 1,
    zIndex: 1,
    handleDragStart: vi.fn(),
    handleDragEnd: vi.fn(),
  }),
}));

// Mock the toast
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock framer-motion
vi.mock("framer-motion", () => ({
  Reorder: {
    Item: ({
      children,
      value,
    }: {
      children: React.ReactNode;
      value: { id: number };
    }) => <div data-testid={`reorder-item-${value.id}`}>{children}</div>,
  },
  useDragControls: () => ({}),
  useMotionValue: () => ({ get: () => 0, set: vi.fn() }),
  useTransform: () => ({ get: () => 1, set: vi.fn() }),
  AnimatePresence: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  motion: {
    div: ({ children, ...props }: React.ComponentProps<"div">) => (
      <div {...props}>{children}</div>
    ),
  },
}));

// Mock the TodoItemContent component
vi.mock("./TodoItemContent", () => ({
  TodoItemContent: ({
    todo,
    isEditing,
    onCancel,
  }: {
    todo: Todo;
    isEditing: boolean;
    onCancel: () => void;
  }) => (
    <div data-testid="todo-content">
      {isEditing ? (
        <input data-testid="edit-input" defaultValue={todo.todo} />
      ) : (
        <span data-testid="todo-text">{todo.todo}</span>
      )}
      {isEditing && (
        <button onClick={onCancel} data-testid="cancel-edit">
          Cancel
        </button>
      )}
    </div>
  ),
}));

// Mock the TodoItemActions component
vi.mock("./TodoItemActions", () => ({
  TodoItemActions: ({
    onEdit,
    onDelete,
    isDeleting,
  }: {
    onEdit: () => void;
    onDelete: () => void;
    isDeleting: boolean;
  }) => (
    <div data-testid="todo-actions">
      <button onClick={onEdit} data-testid="edit-btn">
        Edit
      </button>
      <button onClick={onDelete} data-testid="delete-btn" disabled={isDeleting}>
        Delete
      </button>
    </div>
  ),
}));

// Mock the TodoItemCheckbox component
vi.mock("./TodoItemCheckbox", () => ({
  TodoItemCheckbox: ({
    completed,
    onToggle,
  }: {
    completed: boolean;
    onToggle: () => void;
  }) => (
    <input
      type="checkbox"
      checked={completed}
      onChange={onToggle}
      data-testid="todo-checkbox"
    />
  ),
}));

// Mock the TodoItemDragHandle component
vi.mock("./TodoItemDragHandle", () => ({
  TodoItemDragHandle: () => <div data-testid="drag-handle">⋮⋮</div>,
}));

const createTestStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      todos: todoReducer,
    },
    preloadedState: {
      todos: {
        todos: [],
        serverTodos: [],
        filter: "all" as const,
        searchQuery: "",
        draggedTodo: null,
        isLoading: false,
        error: null,
        hasMoreTodos: true,
        lastFetchedPage: 0,
        totalTodos: 0,
        lastSyncTime: null,
        isOnline: true,
        localDiffs: {
          created: [],
          updated: [],
          deleted: [],
          reorderedCount: 0,
        },
        ...initialState,
      },
    },
  });
};

const createTestQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
};

const renderWithProviders = (
  component: React.ReactElement,
  initialState = {}
) => {
  const store = createTestStore(initialState);
  const queryClient = createTestQueryClient();

  return render(
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        {component}
      </QueryClientProvider>
    </Provider>
  );
};

const mockTodo: Todo = {
  id: 1,
  todo: "Test todo item",
  completed: false,
  userId: 1,
};

describe("TodoItem", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders todo item with correct content", () => {
    renderWithProviders(<TodoItem todo={mockTodo} />);

    expect(screen.getByTestId("todo-text")).toHaveTextContent("Test todo item");
    expect(screen.getByTestId("todo-checkbox")).not.toBeChecked();
    expect(screen.getByTestId("drag-handle")).toBeInTheDocument();
    expect(screen.getByTestId("todo-actions")).toBeInTheDocument();
  });

  it("shows completed state when todo is completed", () => {
    const completedTodo = { ...mockTodo, completed: true };
    renderWithProviders(<TodoItem todo={completedTodo} />);

    expect(screen.getByTestId("todo-checkbox")).toBeChecked();
  });

  it("enters edit mode when edit button is clicked", () => {
    renderWithProviders(<TodoItem todo={mockTodo} />);

    const editButton = screen.getByTestId("edit-btn");
    fireEvent.click(editButton);

    expect(screen.getByTestId("edit-input")).toBeInTheDocument();
    expect(screen.getByTestId("cancel-edit")).toBeInTheDocument();
    expect(screen.queryByTestId("todo-text")).not.toBeInTheDocument();
  });

  it("exits edit mode when cancel button is clicked", () => {
    renderWithProviders(<TodoItem todo={mockTodo} />);

    // Enter edit mode
    const editButton = screen.getByTestId("edit-btn");
    fireEvent.click(editButton);

    // Exit edit mode
    const cancelButton = screen.getByTestId("cancel-edit");
    fireEvent.click(cancelButton);

    expect(screen.getByTestId("todo-text")).toBeInTheDocument();
    expect(screen.queryByTestId("edit-input")).not.toBeInTheDocument();
    expect(screen.queryByTestId("cancel-edit")).not.toBeInTheDocument();
  });

  it("hides actions when in edit mode", () => {
    renderWithProviders(<TodoItem todo={mockTodo} />);

    // Enter edit mode
    const editButton = screen.getByTestId("edit-btn");
    fireEvent.click(editButton);

    // Actions should be hidden in edit mode
    expect(screen.queryByTestId("todo-actions")).not.toBeInTheDocument();
  });
});
