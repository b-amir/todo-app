import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { configureStore } from "@reduxjs/toolkit";
import todoReducer from "@/src/features/todo/store/todoSlice";
import { TodoList } from "./index";
import type { Todo } from "@/src/features/todo/api/types";
import "@testing-library/jest-dom";

// Mock the TodoItem component
vi.mock("../item", () => ({
  TodoItem: ({ todo }: { todo: Todo }) => (
    <div data-testid={`todo-item-${todo.id}`}>
      <span data-testid={`todo-text-${todo.id}`}>{todo.todo}</span>
      <input
        type="checkbox"
        checked={todo.completed}
        data-testid={`todo-checkbox-${todo.id}`}
        readOnly
      />
    </div>
  ),
}));

// Mock the LoadMoreButton component
vi.mock("../layout", () => ({
  LoadMoreButton: ({
    onLoadMore,
    isLoading,
  }: {
    onLoadMore: () => void;
    isLoading: boolean;
  }) => (
    <button
      onClick={onLoadMore}
      disabled={isLoading}
      data-testid="load-more-button"
    >
      {isLoading ? "Loading..." : "Load More"}
    </button>
  ),
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
    Group: ({
      children,
      onReorder,
    }: {
      children: React.ReactNode;
      onReorder?: (newOrder: unknown[]) => void;
    }) => (
      <div
        data-testid="reorder-group"
        onClick={() => onReorder && onReorder([])}
        onKeyDown={() => onReorder && onReorder([])}
        role="button"
        tabIndex={0}
      >
        {children}
      </div>
    ),
    Item: ({
      children,
      value,
    }: {
      children: React.ReactNode;
      value: { id: number };
    }) => <div data-testid={`reorder-item-${value.id}`}>{children}</div>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="animate-presence">{children}</div>
  ),
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

const mockTodos: Todo[] = [
  { id: 1, todo: "First todo", completed: false, userId: 1 },
  { id: 2, todo: "Second todo", completed: true, userId: 1 },
  { id: 3, todo: "Third todo", completed: false, userId: 1 },
];

describe("TodoList", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders empty state when no todos are available", () => {
    renderWithProviders(<TodoList onLoadMore={vi.fn()} />);

    expect(screen.getByText("No tasks available.")).toBeInTheDocument();
    expect(
      screen.getByText("Add a new task to get started.")
    ).toBeInTheDocument();
    expect(screen.queryByTestId("reorder-group")).not.toBeInTheDocument();
  });

  it("renders todo items when todos are available", () => {
    renderWithProviders(<TodoList onLoadMore={vi.fn()} />, {
      todos: mockTodos,
    });

    expect(screen.getByTestId("reorder-group")).toBeInTheDocument();
    expect(screen.getByTestId("animate-presence")).toBeInTheDocument();

    // Check that all todo items are rendered
    mockTodos.forEach((todo) => {
      expect(screen.getByTestId(`todo-item-${todo.id}`)).toBeInTheDocument();
      expect(screen.getByTestId(`todo-text-${todo.id}`)).toHaveTextContent(
        todo.todo
      );
      expect(
        screen.getByTestId(`todo-checkbox-${todo.id}`)
      ).toBeInTheDocument();
    });
  });

  it("renders load more button when todos are available", () => {
    renderWithProviders(<TodoList onLoadMore={vi.fn()} />, {
      todos: mockTodos,
    });

    expect(screen.getByTestId("load-more-button")).toBeInTheDocument();
    expect(screen.getByTestId("load-more-button")).toHaveTextContent(
      "Load More"
    );
  });

  it("calls onLoadMore when load more button is clicked", () => {
    const mockOnLoadMore = vi.fn();
    renderWithProviders(<TodoList onLoadMore={mockOnLoadMore} />, {
      todos: mockTodos,
    });

    const loadMoreButton = screen.getByTestId("load-more-button");
    fireEvent.click(loadMoreButton);

    expect(mockOnLoadMore).toHaveBeenCalledTimes(1);
  });

  it("disables load more button when loading", () => {
    renderWithProviders(<TodoList onLoadMore={vi.fn()} isLoading={true} />, {
      todos: mockTodos,
    });

    const loadMoreButton = screen.getByTestId("load-more-button");
    expect(loadMoreButton).toBeDisabled();
    expect(loadMoreButton).toHaveTextContent("Loading...");
  });

  it("enables load more button when not loading", () => {
    renderWithProviders(<TodoList onLoadMore={vi.fn()} isLoading={false} />, {
      todos: mockTodos,
    });

    const loadMoreButton = screen.getByTestId("load-more-button");
    expect(loadMoreButton).not.toBeDisabled();
    expect(loadMoreButton).toHaveTextContent("Load More");
  });

  it("renders reorder items with correct keys", () => {
    renderWithProviders(<TodoList onLoadMore={vi.fn()} />, {
      todos: mockTodos,
    });

    mockTodos.forEach((todo) => {
      expect(screen.getByTestId(`reorder-item-${todo.id}`)).toBeInTheDocument();
    });
  });

  it("handles reorder group click", () => {
    renderWithProviders(<TodoList onLoadMore={vi.fn()} />, {
      todos: mockTodos,
    });

    const reorderGroup = screen.getByTestId("reorder-group");
    fireEvent.click(reorderGroup);

    // The reorder group should be clickable and trigger onReorder
    expect(reorderGroup).toBeInTheDocument();
  });

  it("shows correct todo completion states", () => {
    renderWithProviders(<TodoList onLoadMore={vi.fn()} />, {
      todos: mockTodos,
    });

    // Check completion states
    const firstTodoCheckbox = screen.getByTestId("todo-checkbox-1");
    const secondTodoCheckbox = screen.getByTestId("todo-checkbox-2");
    const thirdTodoCheckbox = screen.getByTestId("todo-checkbox-3");

    expect(firstTodoCheckbox).not.toBeChecked();
    expect(secondTodoCheckbox).toBeChecked();
    expect(thirdTodoCheckbox).not.toBeChecked();
  });

  it("displays todo text correctly", () => {
    renderWithProviders(<TodoList onLoadMore={vi.fn()} />, {
      todos: mockTodos,
    });

    expect(screen.getByTestId("todo-text-1")).toHaveTextContent("First todo");
    expect(screen.getByTestId("todo-text-2")).toHaveTextContent("Second todo");
    expect(screen.getByTestId("todo-text-3")).toHaveTextContent("Third todo");
  });

  it("handles empty todos array", () => {
    renderWithProviders(<TodoList onLoadMore={vi.fn()} />, { todos: [] });

    expect(screen.getByText("No tasks available.")).toBeInTheDocument();
    expect(screen.queryByTestId("reorder-group")).not.toBeInTheDocument();
  });

  it("maintains proper structure with todos", () => {
    renderWithProviders(<TodoList onLoadMore={vi.fn()} />, {
      todos: mockTodos,
    });

    // Check the overall structure
    expect(screen.getByTestId("reorder-group")).toBeInTheDocument();
    expect(screen.getByTestId("animate-presence")).toBeInTheDocument();
    expect(screen.getByTestId("load-more-button")).toBeInTheDocument();

    // Check that the number of reorder items matches the number of todos
    const reorderItems = screen.getAllByTestId(/reorder-item-/);
    expect(reorderItems).toHaveLength(mockTodos.length);
  });
});
