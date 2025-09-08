import {
  configureStore,
  createListenerMiddleware,
  isAnyOf,
} from "@reduxjs/toolkit";
import todoSlice, {
  addTodo,
  appendTodos,
  deleteTodo,
  replaceTodo,
  reorderTodos,
  resetTodos,
  setHasMoreTodos,
  setLastSyncTime,
  setTodos,
  updateTodo,
  clearLocalDiffs,
  setLocalDiffs,
} from "@/src/features/todo/store/todoSlice";
import { saveToLocalStorage } from "@/src/shared/utils/localStorage";
import { computeLocalDiffs } from "@/src/shared/utils/recalculateLocalDiffs";

const listenerMiddleware = createListenerMiddleware();

listenerMiddleware.startListening({
  matcher: isAnyOf(
    addTodo,
    updateTodo,
    deleteTodo,
    reorderTodos,
    setTodos,
    appendTodos,
    replaceTodo,
    resetTodos
  ),
  effect: async (_action, api) => {
    const state = api.getState() as ReturnType<typeof store.getState>;
    const diffs = computeLocalDiffs(state.todos.todos, state.todos.serverTodos);
    api.dispatch(setLocalDiffs(diffs));
    const newState = api.getState() as ReturnType<typeof store.getState>;
    saveToLocalStorage(newState.todos);
  },
});

listenerMiddleware.startListening({
  matcher: isAnyOf(setHasMoreTodos, setLastSyncTime, clearLocalDiffs),
  effect: async (_action, api) => {
    const state = api.getState() as ReturnType<typeof store.getState>;
    saveToLocalStorage(state.todos);
  },
});

export const store = configureStore({
  reducer: {
    todos: todoSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [],
      },
    }).prepend(listenerMiddleware.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
