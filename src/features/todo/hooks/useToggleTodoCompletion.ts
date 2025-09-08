import { useMutation } from "@tanstack/react-query";
import {
  updateTodo,
  type Todo,
  type UpdateTodoRequest,
} from "@/src/features/todo/api";
import { useAppDispatch, useAppSelector } from "@/src/features/todo/hooks";
import {
  updateTodo as updateTodoState,
  setTodos,
} from "@/src/features/todo/store/todoSlice";
import { toast } from "sonner";
import ApiError from "@/src/shared/utils/ApiError";

export function useToggleTodoCompletion() {
  const dispatch = useAppDispatch();
  const { todos } = useAppSelector((state) => state.todos);

  return useMutation<
    Todo,
    ApiError,
    UpdateTodoRequest,
    { previousTodos: Todo[] } | undefined
  >({
    mutationFn: (updatedTodo: UpdateTodoRequest) => updateTodo(updatedTodo),
    onMutate: async (updatedTodo) => {
      const previousTodos = todos;
      dispatch(
        updateTodoState({
          id: updatedTodo.id,
          updates: updatedTodo,
        })
      );
      return { previousTodos };
    },
    onSuccess: (updatedTodo) => {
      toast.success("Todo updated!", {
        description: `Task marked as ${
          updatedTodo.completed ? "complete" : "incomplete"
        }.`,
      });
    },
    onError: (_error, _variables, context) => {
      if (context?.previousTodos) {
        dispatch(setTodos(context.previousTodos));
      }
      toast.error("Failed to update todo", {
        description:
          "Couldn't save to the server. Your changes have been rolled back.",
      });
    },
  });
}
