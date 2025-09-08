import { useTodosData } from "./useTodosData";
import { useTodoActions } from "./useTodoActions";

export function useTodos() {
  const {
    todos,
    hasMoreTodos,
    localDiffs,
    hasLocalChanges,
    hasData,
    isLoading,
    error,
    isFetching,
    isError,
    setCurrentPage,
    refetch,
  } = useTodosData();

  const { loadMore, refresh, reset } = useTodoActions(setCurrentPage, refetch);

  return {
    todos,
    hasMoreTodos,
    localDiffs,
    hasLocalChanges,
    hasData,
    isLoading,
    error,
    isFetching,
    isError,
    loadMore: () => hasMoreTodos && loadMore(),
    refresh,
    reset,
  };
}
