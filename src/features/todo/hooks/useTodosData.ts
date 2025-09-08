import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAppDispatch, useAppSelector } from "@/src/features/todo/hooks";
import { fetchTodos } from "@/src/features/todo/api";
import {
  setLoading,
  setError,
  setOnlineStatus,
  setLastSyncTime,
  appendTodos,
} from "@/src/features/todo/store/todoSlice";
import { toast } from "sonner";

export function useTodosData() {
  const dispatch = useAppDispatch();
  const { lastFetchedPage, todos, hasMoreTodos, localDiffs, error } =
    useAppSelector((state) => state.todos);

  const [currentPage, setCurrentPage] = useState(lastFetchedPage || 1);

  useEffect(() => {
    if (lastFetchedPage && lastFetchedPage > currentPage) {
      setCurrentPage(lastFetchedPage);
    }
  }, [lastFetchedPage, currentPage]);

  const hasLocalChanges =
    (localDiffs?.created?.length || 0) > 0 ||
    (localDiffs?.updated?.length || 0) > 0 ||
    (localDiffs?.deleted?.length || 0) > 0 ||
    (localDiffs?.reorderedCount || 0) > 0;

  const hasData = todos.length > 0;

  const {
    data,
    isLoading,
    error: queryError,
    refetch,
    isFetching,
    isError,
    isSuccess,
  } = useQuery({
    queryKey: ["todos", currentPage],
    queryFn: () => fetchTodos({ limit: 20, skip: (currentPage - 1) * 20 }),
    enabled:
      currentPage > 1
        ? hasMoreTodos && currentPage > lastFetchedPage
        : !hasData,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (isSuccess && data?.todos) {
      dispatch(
        appendTodos({
          todos: [...data.todos],
          total: data.total,
          page: currentPage,
        })
      );
      dispatch(setLastSyncTime(Date.now()));
    }
  }, [isSuccess, data, dispatch, currentPage]);

  useEffect(() => {
    dispatch(setLoading(isLoading));
    dispatch(setOnlineStatus(!isError));

    if (queryError) {
      let errorMessage = "Failed to load todos. Please try again.";

      if (queryError instanceof Error) {
        if (queryError.message.includes("fetch")) {
          errorMessage =
            "Network error. Please check your internet connection.";
        } else if (queryError.message.includes("timeout")) {
          errorMessage = "Request timed out. Please try again.";
        } else if (queryError.message.includes("500")) {
          errorMessage = "Server error. Please try again later.";
        }
      }

      dispatch(setError(errorMessage));
      toast.error(errorMessage, {
        description: "Click the retry button to try again.",
      });
    } else {
      dispatch(setError(null));
    }
  }, [isLoading, queryError, dispatch, isError]);

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
    currentPage,
    setCurrentPage,
    refetch,
  };
}
