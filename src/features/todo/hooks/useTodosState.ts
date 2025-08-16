import { useAppSelector } from "@/src/features/todo/hooks";

export function useTodosState() {
  const { todos, hasMoreTodos, localDiffs, error } = useAppSelector(
    (state) => state.todos
  );

  const hasLocalChanges =
    (localDiffs?.created?.length || 0) > 0 ||
    (localDiffs?.updated?.length || 0) > 0 ||
    (localDiffs?.deleted?.length || 0) > 0 ||
    (localDiffs?.reorderedCount || 0) > 0;

  const hasData = todos.length > 0;

  return {
    todos,
    hasMoreTodos,
    localDiffs,
    hasLocalChanges,
    hasData,
    error,
  };
}
