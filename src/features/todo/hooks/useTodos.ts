import { useState } from "react";
import { useTodosState } from "./useTodosState";
import { useTodosQuery } from "./useTodosQuery";
import { useTodosSync } from "./useTodosSync";
import { useTodosActions } from "./useTodosActions";

export function useTodos() {
  const [currentPage, setCurrentPage] = useState(1);
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
