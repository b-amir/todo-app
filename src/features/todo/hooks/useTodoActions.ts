import { useAppDispatch } from "@/src/features/todo/hooks";
import {
  clearLocalDiffs,
  setLastSyncTime,
  appendTodos,
  resetTodos,
} from "@/src/features/todo/store/todoSlice";

export function useTodoActions(
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>,
  refetch: () => Promise<any>
) {
  const dispatch = useAppDispatch();

  const loadMore = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const refresh = async () => {
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

  const reset = async () => {
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
    loadMore,
    refresh,
    reset,
  };
}
