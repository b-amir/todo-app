import { useEffect } from "react";
import { useAppDispatch } from "@/src/features/todo/hooks";
import {
  setLoading,
  setError,
  setOnlineStatus,
  setLastSyncTime,
  appendTodos,
} from "@/src/features/todo/store/todoSlice";
import { toast } from "sonner";
import type { TodosResponse } from "@/src/features/todo/api";

export function useTodosSync({
  data,
  isSuccess,
  isLoading,
  isError,
  error,
  currentPage,
}: {
  data: TodosResponse | undefined;
  isSuccess: boolean;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  currentPage: number;
}) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isSuccess && data?.todos) {
      dispatch(
        appendTodos({
          todos: data.todos,
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

    if (error) {
      let errorMessage = "Failed to load todos. Please try again.";

      if (error instanceof Error) {
        if (error.message.includes("fetch")) {
          errorMessage =
            "Network error. Please check your internet connection.";
        } else if (error.message.includes("timeout")) {
          errorMessage = "Request timed out. Please try again.";
        } else if (error.message.includes("500")) {
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
  }, [isLoading, error, dispatch, isError]);
}
