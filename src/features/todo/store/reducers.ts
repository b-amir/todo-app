import type { PayloadAction } from "@reduxjs/toolkit";
import type { Todo } from "@/src/features/todo/api";
import { saveToLocalStorage } from "@/src/shared/utils/localStorage";
import { recalculateLocalDiffs } from "@/src/shared/utils/recalculateLocalDiffs";
import type { TodoState } from "./todoSlice";

export const reducers = {
  setDraggedTodo: (state: TodoState, action: PayloadAction<Todo | null>) => {
    state.draggedTodo = action.payload;
  },
  reorderTodos: (
    state: TodoState,
    action: PayloadAction<{ fromIndex: number; toIndex: number }>
  ) => {
    const { fromIndex, toIndex } = action.payload;
    if (
      fromIndex >= 0 &&
      fromIndex < state.todos.length &&
      toIndex >= 0 &&
      toIndex < state.todos.length
    ) {
      const [removed] = state.todos.splice(fromIndex, 1);
      if (removed) {
        state.todos.splice(toIndex, 0, removed);
        saveToLocalStorage(state);
        recalculateLocalDiffs(state);
      }
    }
  },
  setLoading: (state: TodoState, action: PayloadAction<boolean>) => {
    state.isLoading = action.payload;
  },
  setError: (state: TodoState, action: PayloadAction<string | null>) => {
    state.error = action.payload;
  },
  setOnlineStatus: (state: TodoState, action: PayloadAction<boolean>) => {
    state.isOnline = action.payload;
  },
  setLastSyncTime: (state: TodoState, action: PayloadAction<number | null>) => {
    state.lastSyncTime = action.payload;
    saveToLocalStorage(state);
  },
  appendTodos: (
    state: TodoState,
    action: PayloadAction<{
      todos: Todo[];
      total: number;
      page: number;
    }>
  ) => {
    const { todos, total, page } = action.payload;

    if (page === 1) {
      state.todos = todos;
      state.serverTodos = todos;
      state.localDiffs = {
        created: [],
        updated: [],
        deleted: [],
        reorderedCount: 0,
      };
    } else {
      const existingIds = new Set(state.todos.map((t) => t.id));
      const newTodos = todos.filter((t) => !existingIds.has(t.id));
      state.todos.push(...newTodos);
      state.serverTodos.push(...newTodos);
    }

    state.totalTodos = total;
    state.hasMoreTodos = state.todos.length < total;
    state.lastFetchedPage = page;
    state.lastSyncTime = Date.now();
    saveToLocalStorage(state);
  },
  addTodo: (state: TodoState, action: PayloadAction<Todo>) => {
    const newTodo = action.payload;
    state.todos.unshift(newTodo);
    state.totalTodos += 1;
    recalculateLocalDiffs(state);
    saveToLocalStorage(state);
  },
  updateTodo: (
    state: TodoState,
    action: PayloadAction<{ id: number; updates: Partial<Todo> }>
  ) => {
    const { id, updates } = action.payload;
    const todoIndex = state.todos.findIndex((todo) => todo.id === id);

    if (todoIndex !== -1) {
      const originalTodo = state.todos[todoIndex];
      state.todos[todoIndex] = { ...originalTodo, ...updates } as Todo;
      recalculateLocalDiffs(state);
      saveToLocalStorage(state);
    }
  },
  deleteTodo: (state: TodoState, action: PayloadAction<number>) => {
    const todoId = action.payload;
    const todoIndex = state.todos.findIndex((todo) => todo.id === todoId);

    if (todoIndex !== -1) {
      state.todos.splice(todoIndex, 1);
      state.totalTodos -= 1;
      recalculateLocalDiffs(state);
      saveToLocalStorage(state);
    }
  },
  clearLocalDiffs: (state: TodoState) => {
    state.localDiffs = {
      created: [],
      updated: [],
      deleted: [],
      reorderedCount: 0,
    };
    saveToLocalStorage(state);
  },
  resetTodos: (state: TodoState) => {
    state.todos = [];
    state.serverTodos = [];
    state.totalTodos = 0;
    state.hasMoreTodos = true;
    state.lastFetchedPage = 0;
    state.localDiffs = {
      created: [],
      updated: [],
      deleted: [],
      reorderedCount: 0,
    };
    saveToLocalStorage(state);
  },
  setHasMoreTodos: (state: TodoState, action: PayloadAction<boolean>) => {
    state.hasMoreTodos = action.payload;
    saveToLocalStorage(state);
  },
  setTodos: (state: TodoState, action: PayloadAction<Todo[]>) => {
    state.todos = action.payload;
    recalculateLocalDiffs(state);
    saveToLocalStorage(state);
  },
  replaceTodo: (
    state: TodoState,
    action: PayloadAction<{ tempId: string; newTodo: Todo }>
  ) => {
    const { tempId, newTodo } = action.payload;
    const index = state.todos.findIndex((todo) => String(todo.id) === tempId);
    if (index !== -1) {
      state.todos[index] = { ...newTodo } as Todo;
    }
    recalculateLocalDiffs(state);
    saveToLocalStorage(state);
  },
};
