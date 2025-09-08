import type { Todo } from "@/src/features/todo/api";

export interface LocalDiffs {
  created: Todo[];
  updated: Todo[];
  deleted: number[];
  reorderedCount: number;
}

export function computeLocalDiffs(
  todos: ReadonlyArray<Todo>,
  serverTodos: ReadonlyArray<Todo>
): LocalDiffs {
  const created: Todo[] = [];
  const updated: Todo[] = [];
  const deleted: number[] = [];
  let reorderedCount = 0;

  const serverTodoMap = new Map(serverTodos.map((todo) => [todo.id, todo]));
  const currentTodoMap = new Map(todos.map((todo) => [todo.id, todo]));

  for (const todo of todos) {
    const serverTodo = serverTodoMap.get(todo.id);
    if (!serverTodo) {
      created.push(todo);
    } else if (JSON.stringify(todo) !== JSON.stringify(serverTodo)) {
      updated.push(todo);
    }
  }

  for (const serverTodo of serverTodos) {
    if (!currentTodoMap.has(serverTodo.id)) {
      deleted.push(serverTodo.id);
    }
  }

  const hasOrderChanges =
    todos.length === serverTodos.length &&
    todos.some((todo, index) => {
      const serverTodo = serverTodos[index];
      return !serverTodo || todo.id !== serverTodo.id;
    });

  if (hasOrderChanges) {
    reorderedCount = todos.filter((todo, index) => {
      const serverTodo = serverTodos[index];
      return serverTodo && todo.id !== serverTodo.id;
    }).length;
  }

  return { created, updated, deleted, reorderedCount };
}
