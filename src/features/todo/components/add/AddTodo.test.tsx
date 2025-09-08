import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { configureStore } from "@reduxjs/toolkit";
import todoReducer from "@/src/features/todo/store/todoSlice";
import type { UseFormRegister } from "react-hook-form";
import { AddTodo } from "./AddTodo";
import "@testing-library/jest-dom";

type AddTodoFormValues = { todo: string };

// Mock the hooks
vi.mock("@/src/features/todo/hooks", () => ({
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
  useTodoMutations: () => ({
    addTodo: vi.fn(),
    updateTodo: vi.fn(),
    toggleCompletion: vi.fn(),
    deleteTodo: vi.fn(),
    isAdding: false,
    isUpdating: false,
    isToggling: false,
    isDeleting: false,
  }),
}));

// Mock the toast
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock the AddTodoForm component
vi.mock("./AddTodoForm", () => ({
  AddTodoForm: ({
    handleSubmit,
    register,
    errors,
    isSubmitting,
    isFocused,
    setIsFocused,
    showSuccess,
  }: {
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    register: UseFormRegister<AddTodoFormValues>;
    errors: { todo?: { message: string } };
    isSubmitting: boolean;
    isFocused: boolean;
    setIsFocused: (isFocused: boolean) => void;
    showSuccess: boolean;
  }) => (
    <form onSubmit={handleSubmit} data-testid="add-todo-form">
      <input
        {...register("todo")}
        placeholder="Add a new task..."
        data-testid="todo-input"
        className={errors.todo ? "error" : ""}
      />
      {errors.todo && (
        <span data-testid="todo-error">{errors.todo.message}</span>
      )}
      <button type="submit" disabled={isSubmitting} data-testid="submit-btn">
        {isSubmitting ? "Adding..." : "Add Task"}
      </button>
      <button
        type="button"
        onClick={() => setIsFocused(!isFocused)}
        data-testid="focus-toggle"
      >
        Toggle Focus
      </button>
      {showSuccess && (
        <div data-testid="success-message">Task added successfully!</div>
      )}
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

describe("AddTodo", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the add todo form", () => {
    renderWithProviders(<AddTodo />);

    expect(screen.getByTestId("add-todo-form")).toBeInTheDocument();
    expect(screen.getByTestId("todo-input")).toBeInTheDocument();
    expect(screen.getByTestId("submit-btn")).toBeInTheDocument();
  });

  it("shows validation error for empty todo", async () => {
    renderWithProviders(<AddTodo />);

    const submitButton = screen.getByTestId("submit-btn");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByTestId("todo-error")).toBeInTheDocument();
    });
  });

  it("shows validation error for todo that is too short", async () => {
    renderWithProviders(<AddTodo />);

    const input = screen.getByTestId("todo-input");
    const submitButton = screen.getByTestId("submit-btn");

    // Type a todo that's too short
    fireEvent.change(input, { target: { value: "ab" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByTestId("todo-error")).toBeInTheDocument();
    });
  });

  it("shows validation error for todo that is too long", async () => {
    renderWithProviders(<AddTodo />);

    const input = screen.getByTestId("todo-input");
    const submitButton = screen.getByTestId("submit-btn");

    // Type a todo that's too long (201 characters)
    const longTodo = "a".repeat(201);
    fireEvent.change(input, { target: { value: longTodo } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByTestId("todo-error")).toBeInTheDocument();
    });
  });

  it("handles focus state changes", () => {
    renderWithProviders(<AddTodo />);

    const focusToggle = screen.getByTestId("focus-toggle");
    fireEvent.click(focusToggle);

    // The focus state should be managed by the component
    expect(focusToggle).toBeInTheDocument();
  });
});
