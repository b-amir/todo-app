import { useQuery } from "@tanstack/react-query";
import { fetchTodos } from "@/src/features/todo/api";

export function useTodosQuery(
  currentPage: number,
  hasMoreTodos: boolean,
  hasData: boolean
) {
  return useQuery({
    queryKey: ["todos", currentPage],
    queryFn: () => fetchTodos({ limit: 20, skip: (currentPage - 1) * 20 }),
    enabled: currentPage > 1 ? hasMoreTodos : !hasData,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}
