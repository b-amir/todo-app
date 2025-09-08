import { useMutation } from "@tanstack/react-query";
import {
  updateTodo,
  type UpdateTodoRequest,
  type Todo,
} from "@/src/features/todo/api";
import { useAppDispatch, useAppSelector } from "@/src/features/todo/hooks";
import {
  updateTodo as updateTodoState,
  setTodos,
} from "@/src/features/todo/store/todoSlice";
import { toast } from "sonner";
import ApiError from "@/src/shared/utils/ApiError";

export function useEditTodo(onSuccessCallback: () => void) {
  const dispatch = useAppDispatch();
  const { todos } = useAppSelector((state) => state.todos);

  return useMutation<
    Todo,
    ApiError,
    UpdateTodoRequest,
    { previousTodos: Todo[] }
  >({
    mutationFn: (updatedTodo: UpdateTodoRequest) => updateTodo(updatedTodo),
    onMutate: async (updatedTodo) => {
      const previousTodos = todos;
      dispatch(updateTodoState({ id: updatedTodo.id, updates: updatedTodo }));
      onSuccessCallback();
      return { previousTodos };
    },
    onSuccess: (updatedTodo) => {
      dispatch(updateTodoState({ id: updatedTodo.id, updates: updatedTodo }));
      toast.success("Todo updated successfully!", {
        description: `Task "${
          updatedTodo.todo.length > 20
            ? `${updatedTodo.todo.substring(0, 20)}...`
            : updatedTodo.todo
        }" has been updated.`,
      });
    },
    onError: (error, _variables, context) => {
      if (context?.previousTodos) {
        dispatch(setTodos(context.previousTodos));
      }
      toast.error("Failed to update todo", {
        description:
          error instanceof Error ? error.message : "An unknown error occurred.",
      });
    },
  });
}
