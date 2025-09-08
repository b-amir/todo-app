import { useMutation } from "@tanstack/react-query";
import {
  createTodo,
  type CreateTodoRequest,
  type Todo,
  type TempId,
} from "@/src/features/todo/api";
import { useAppDispatch, useAppSelector } from "@/src/features/todo/hooks";
import {
  addTodo,
  setTodos,
  replaceTodo,
} from "@/src/features/todo/store/todoSlice";
import { toast } from "sonner";
import type { UseFormReset } from "react-hook-form";
import type { AddTodoFormInputs } from "@/src/features/todo/components/add/AddTodo";
import { ApiError } from "@/src/shared/utils/apiClient";

export function useAddTodo(reset: UseFormReset<AddTodoFormInputs>) {
  const dispatch = useAppDispatch();
  const { todos } = useAppSelector((state) => state.todos);

  return useMutation<
    Todo,
    ApiError,
    CreateTodoRequest,
    { previousTodos: Todo[]; tempId: TempId } | undefined
  >({
    mutationFn: (newTodo: CreateTodoRequest) => createTodo(newTodo),
    onMutate: async (newTodo) => {
      const tempId = Date.now().toString() as TempId;
      const tempTodo = { ...newTodo, id: -Date.now(), _tempId: tempId } as Todo;

      const previousTodos = todos;
      dispatch(addTodo(tempTodo));

      toast.success("Todo added successfully!", {
        description: `Task "${
          tempTodo.todo.length > 20
            ? `${tempTodo.todo.substring(0, 20)}...`
            : tempTodo.todo
        }" has been added.`,
      });
      reset();

      return { previousTodos, tempId };
    },
    onSuccess: (newTodo, _variables, context) => {
      if (context) {
        dispatch(
          replaceTodo({ tempId: context.tempId as unknown as string, newTodo })
        );
      }
    },
    onError: (_error, _variables, context) => {
      if (context?.previousTodos) {
        dispatch(setTodos(context.previousTodos));
      }
      toast.error("Failed to add todo", {
        description:
          "Couldn't save to the server. Your new todo has been removed.",
      });
    },
  });
}
