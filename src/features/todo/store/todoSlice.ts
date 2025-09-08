import { createSlice } from "@reduxjs/toolkit";
import type { Todo } from "@/src/features/todo/api";
import { loadFromLocalStorage } from "@/src/shared/utils/localStorage";
import { reducers } from "./reducers";

export interface TodoState {
  todos: Todo[];
  serverTodos: Todo[];
  draggedTodo: Todo | null;
  isLoading: boolean;
  error: string | null;
  hasMoreTodos: boolean;
  lastFetchedPage: number;
  totalTodos: number;
  lastSyncTime: number | null;
  isOnline: boolean;
  localDiffs: {
    created: Todo[];
    updated: Todo[];
    deleted: number[];
    reorderedCount?: number;
  };
}

const savedState = loadFromLocalStorage();

const initialState: TodoState = {
  todos: savedState?.todos || [],
  serverTodos: savedState?.serverTodos || [],
  draggedTodo: null,
  isLoading: false,
  error: null,
  hasMoreTodos:
    savedState?.hasMoreTodos !== undefined ? savedState.hasMoreTodos : true,
  lastFetchedPage: savedState?.lastFetchedPage || 0,
  totalTodos: savedState?.totalTodos || 0,
  lastSyncTime: savedState?.lastSyncTime || null,
  isOnline: true,
  localDiffs:
    savedState?.localDiffs && typeof savedState.localDiffs === "object"
      ? {
          created: Array.isArray(savedState.localDiffs.created)
            ? savedState.localDiffs.created
            : [],
          updated: Array.isArray(savedState.localDiffs.updated)
            ? savedState.localDiffs.updated
            : [],
          deleted: Array.isArray(savedState.localDiffs.deleted)
            ? savedState.localDiffs.deleted
            : [],
          reorderedCount: savedState.localDiffs.reorderedCount || 0,
        }
      : {
          created: [],
          updated: [],
          deleted: [],
          reorderedCount: 0,
        },
};

const todoSlice = createSlice({
  name: "todos",
  initialState,
  reducers,
});

export const {
  setDraggedTodo,
  reorderTodos,
  setLoading,
  setError,
  setOnlineStatus,
  setLastSyncTime,
  appendTodos,
  addTodo,
  updateTodo,
  deleteTodo,
  clearLocalDiffs,
  resetTodos,
  setHasMoreTodos,
  setTodos,
  replaceTodo,
} = todoSlice.actions;

export default todoSlice.reducer;
