import { useQuery } from "@tanstack/react-query";
import { fetchTodos } from "@/src/features/todo/api";
import { useAppSelector } from "@/src/features/todo/hooks";

export function useTodosQuery(
  currentPage: number,
  hasMoreTodos: boolean,
  hasData: boolean
) {
  const { lastFetchedPage } = useAppSelector((state) => state.todos);

  return useQuery({
    queryKey: ["todos", currentPage],
    queryFn: () => fetchTodos({ limit: 20, skip: (currentPage - 1) * 20 }),
    enabled:
      currentPage > 1
        ? hasMoreTodos && currentPage > lastFetchedPage
        : !hasData,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}
