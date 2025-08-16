import type { TodoState } from "@/src/features/todo/store/todoSlice";

export const loadFromLocalStorage = () => {
  try {
    const savedState = localStorage.getItem("todoAppState");
    if (savedState) {
      const parsed = JSON.parse(savedState);
      return {
        todos: parsed.todos || [],
        serverTodos: parsed.serverTodos || [],
        totalTodos: parsed.totalTodos || 0,
        lastFetchedPage: parsed.lastFetchedPage || 0,
        hasMoreTodos:
          parsed.hasMoreTodos !== undefined ? parsed.hasMoreTodos : true,
        lastSyncTime: parsed.lastSyncTime || null,
        localDiffs:
          parsed.localDiffs && typeof parsed.localDiffs === "object"
            ? {
                created: Array.isArray(parsed.localDiffs.created)
                  ? parsed.localDiffs.created
                  : [],
                updated: Array.isArray(parsed.localDiffs.updated)
                  ? parsed.localDiffs.updated
                  : [],
                deleted: Array.isArray(parsed.localDiffs.deleted)
                  ? parsed.localDiffs.deleted
                  : [],
                reorderedCount: parsed.localDiffs.reorderedCount || 0,
              }
            : {
                created: [],
                updated: [],
                deleted: [],
                reorderedCount: 0,
              },
      };
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Failed to load state from localStorage:", error);
  }
  return null;
};

export const saveToLocalStorage = (state: TodoState) => {
  try {
    const stateToSave = {
      todos: state.todos,
      serverTodos: state.serverTodos,
      totalTodos: state.totalTodos,
      hasMoreTodos: state.hasMoreTodos,
      lastFetchedPage: state.lastFetchedPage,
      lastSyncTime: state.lastSyncTime,
      localDiffs: state.localDiffs,
    };
    localStorage.setItem("todoAppState", JSON.stringify(stateToSave));
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Failed to save state to localStorage:", error);
  }
};
