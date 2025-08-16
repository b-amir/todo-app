import { useAppDispatch } from "@/src/features/todo/hooks";
import {
  clearLocalDiffs,
  setLastSyncTime,
  appendTodos,
  resetTodos,
} from "@/src/features/todo/store/todoSlice";
import type { UseQueryResult } from "@tanstack/react-query";
import type { TodosResponse } from "@/src/features/todo/api";

export function useTodosActions(
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>,
  refetch: UseQueryResult<TodosResponse>["refetch"]
) {
  const dispatch = useAppDispatch();

  const handleLoadMore = (hasMoreTodos: boolean) => {
    if (hasMoreTodos) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handleFetchFromServer = async () => {
    dispatch(clearLocalDiffs());
    dispatch(setLastSyncTime(null));
    setCurrentPage(1);
    const { data } = await refetch();
    if (data?.todos) {
      dispatch(
        appendTodos({
          todos: data.todos,
          total: data.total,
          page: 1,
        })
      );
      dispatch(setLastSyncTime(Date.now()));
    }
  };

  const handleReset = async () => {
    dispatch(resetTodos());
    setCurrentPage(1);
    const { data } = await refetch();
    if (data?.todos) {
      dispatch(
        appendTodos({
          todos: data.todos,
          total: data.total,
          page: 1,
        })
      );
      dispatch(setLastSyncTime(Date.now()));
    }
  };

  return {
    handleLoadMore,
    handleFetchFromServer,
    handleReset,
  };
}
