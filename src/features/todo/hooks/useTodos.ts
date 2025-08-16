import { useState, useEffect } from "react";
import { useTodosState } from "./useTodosState";
import { useTodosQuery } from "./useTodosQuery";
import { useTodosSync } from "./useTodosSync";
import { useTodosActions } from "./useTodosActions";
import { useAppSelector } from "@/src/features/todo/hooks";

export function useTodos() {
  const { lastFetchedPage } = useAppSelector((state) => state.todos);
  const [currentPage, setCurrentPage] = useState(lastFetchedPage || 1);

  useEffect(() => {
    if (lastFetchedPage && lastFetchedPage > currentPage) {
      setCurrentPage(lastFetchedPage);
    }
  }, [lastFetchedPage, currentPage]);

  const {
    todos,
    hasMoreTodos,
    localDiffs,
    hasLocalChanges,
    hasData,
    error: stateError,
  } = useTodosState();

  const {
    data,
    isLoading,
    error: queryError,
    refetch,
    isFetching,
    isError,
    isSuccess,
  } = useTodosQuery(currentPage, hasMoreTodos, hasData);

  useTodosSync({
    data,
    isSuccess,
    isLoading,
    isError,
    error: queryError,
    currentPage,
  });

  const { handleLoadMore, handleFetchFromServer, handleReset } =
    useTodosActions(setCurrentPage, refetch);

  return {
    todos,
    hasMoreTodos,
    localDiffs,
    hasLocalChanges,
    hasData,
    isLoading,
    error: stateError,
    isFetching,
    isError,
    handleLoadMore: () => handleLoadMore(hasMoreTodos),
    handleFetchFromServer,
    handleReset,
  };
}
