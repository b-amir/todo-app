import { useMutation } from "@tanstack/react-query";
import {
  deleteTodo,
  type DeletedTodo,
  type Todo,
} from "@/src/features/todo/api";
import { useAppDispatch, useAppSelector } from "@/src/features/todo/hooks";
import {
  deleteTodo as deleteTodoState,
  setTodos,
} from "@/src/features/todo/store/todoSlice";
import { toast } from "sonner";
import { ApiError } from "@/src/shared/utils/apiClient";

export function useDeleteTodo() {
  const dispatch = useAppDispatch();
  const { todos } = useAppSelector((state) => state.todos);

  return useMutation<DeletedTodo, ApiError, string, { previousTodos: Todo[] }>({
    mutationFn: deleteTodo,
    onMutate: async (deletedTodoId) => {
      const previousTodos = [...todos];
      dispatch(deleteTodoState(deletedTodoId));
      return { previousTodos };
    },
    onSuccess: (deletedTodo) => {
      if (deletedTodo) {
        toast.success("Todo deleted!", {
          description: `Task "${
            deletedTodo.todo.length > 20
              ? `${deletedTodo.todo.substring(0, 20)}...`
              : deletedTodo.todo
          }" has been removed.`,
        });
      }
    },
    onError: (_error, _variables, context) => {
      if (context?.previousTodos) {
        dispatch(setTodos(context.previousTodos));
      }
      toast.error("Failed to delete todo", {
        description:
          "Couldn't save to the server. Your todo has been restored.",
      });
    },
  });
}
