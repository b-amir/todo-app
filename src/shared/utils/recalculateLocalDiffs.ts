import type { Todo } from "@/src/features/todo/api";
import type { TodoState } from "@/src/features/todo/store/todoSlice";

export const recalculateLocalDiffs = (state: TodoState) => {
  if (!state.localDiffs) {
    state.localDiffs = {
      created: [],
      updated: [],
      deleted: [],
      reorderedCount: 0,
    };
  }

  const created: Todo[] = [];
  const updated: Todo[] = [];
  const deleted: number[] = [];
  let reorderedCount = 0;

  const serverTodoMap = new Map(
    state.serverTodos.map((todo) => [todo.id, todo])
  );
  const currentTodoMap = new Map(state.todos.map((todo) => [todo.id, todo]));

  for (const todo of state.todos) {
    const serverTodo = serverTodoMap.get(todo.id);
    if (!serverTodo) {
      created.push(todo);
    } else if (JSON.stringify(todo) !== JSON.stringify(serverTodo)) {
      updated.push(todo);
    }
  }

  for (const serverTodo of state.serverTodos) {
    if (!currentTodoMap.has(serverTodo.id)) {
      deleted.push(serverTodo.id);
    }
  }

  const hasOrderChanges =
    state.todos.length === state.serverTodos.length &&
    state.todos.some((todo, index) => {
      const serverTodo = state.serverTodos[index];
      return !serverTodo || todo.id !== serverTodo.id;
    });

  if (hasOrderChanges) {
    reorderedCount = state.todos.filter((todo, index) => {
      const serverTodo = state.serverTodos[index];
      return serverTodo && todo.id !== serverTodo.id;
    }).length;
  }

  state.localDiffs = { created, updated, deleted, reorderedCount };
};
