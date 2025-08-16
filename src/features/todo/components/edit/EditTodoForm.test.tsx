import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { configureStore } from "@reduxjs/toolkit";
import todoReducer from "@/src/features/todo/store/todoSlice";
import { EditTodoForm } from "./EditTodoForm";
import type { Todo } from "@/src/features/todo/api/types";
import "@testing-library/jest-dom";

// Mock the useEditTodo hook
vi.mock("@/hooks", () => ({
  useAppDispatch: () => vi.fn(),
  useAppSelector: (selector: (state: unknown) => unknown) =>
    selector({
      todos: {
        localDiffs: {
          created: [],
          updated: [],
          deleted: [],
          reorderedCount: 0,
        },
      },
    }),
  useEditTodo: () => ({
    mutate: vi.fn(),
    isPending: false,
    isSuccess: false,
    isError: false,
  }),
}));

// Mock the toast
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock the EditTodoFormUI component
vi.mock("./EditTodoFormUI", () => ({
  EditTodoFormUI: ({
    handleSubmit,
    register,
    errors,
    isSubmitting,
    onCancel,
    handleKeyDown,
    isPending,
  }: {
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    register: unknown;
    errors: { todo?: { message: string } };
    isSubmitting: boolean;
    onCancel: () => void;
    handleKeyDown: (e: React.KeyboardEvent) => void;
    isPending: boolean;
  }) => (
    <form onSubmit={handleSubmit} data-testid="edit-form">
      <input
        {...register("todo")}
        data-testid="edit-input"
        onKeyDown={handleKeyDown}
        defaultValue="Original todo text"
      />
      {errors.todo && (
        <span data-testid="error-message">{errors.todo.message}</span>
      )}
      <button
        type="button"
        onClick={onCancel}
        data-testid="cancel-btn"
        disabled={isSubmitting}
      >
        Cancel
      </button>
      <button
        type="submit"
        data-testid="save-btn"
        disabled={isSubmitting || isPending}
      >
        {isPending ? "Saving..." : "Save"}
      </button>
    </form>
  ),
}));

const createTestStore = () => {
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

const renderWithProviders = (component: React.ReactElement) => {
  const store = createTestStore();
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
  todo: "Original todo text",
  completed: false,
  userId: 1,
};

describe("EditTodoForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the edit form with todo text", () => {
    renderWithProviders(<EditTodoForm todo={mockTodo} onCancel={vi.fn()} />);

    expect(screen.getByTestId("edit-input")).toBeInTheDocument();
    expect(screen.getByTestId("save-btn")).toBeInTheDocument();
    expect(screen.getByTestId("cancel-btn")).toBeInTheDocument();
  });

  it("calls onCancel when cancel button is clicked", () => {
    const mockOnCancel = vi.fn();

    renderWithProviders(
      <EditTodoForm todo={mockTodo} onCancel={mockOnCancel} />
    );

    const cancelButton = screen.getByTestId("cancel-btn");
    fireEvent.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it("calls onCancel when Escape key is pressed", () => {
    const mockOnCancel = vi.fn();

    renderWithProviders(
      <EditTodoForm todo={mockTodo} onCancel={mockOnCancel} />
    );

    const input = screen.getByTestId("edit-input");
    fireEvent.keyDown(input, { key: "Escape", code: "Escape" });

    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });
});
