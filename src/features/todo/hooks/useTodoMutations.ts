import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createTodo,
  updateTodo as updateTodoApi,
  deleteTodo as deleteTodoApi,
  type CreateTodoRequest,
  type UpdateTodoRequest,
  type Todo,
  type TempId,
  type DeletedTodo,
} from "@/src/features/todo/api";
import { useAppDispatch, useAppSelector } from "@/src/features/todo/hooks";
import {
  addTodo as addTodoState,
  updateTodo as updateTodoState,
  deleteTodo as deleteTodoState,
  replaceTodo,
} from "@/src/features/todo/store/todoSlice";
import { toast } from "sonner";
import type { UseFormReset } from "react-hook-form";
import type { AddTodoFormInputs } from "@/src/features/todo/components/add/AddTodo";
import ApiError from "@/src/shared/utils/ApiError";
import { getTruncatedText } from "@/src/shared/utils/stringUtils";
import {
  createMutationErrorHandler,
  createMutationHelpers,
} from "@/src/features/todo/utils/mutationUtils";

export function useTodoMutations() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const { todos } = useAppSelector((state) => state.todos);

  const onSettled = () =>
    queryClient.invalidateQueries({ queryKey: ["todos"] });

  const { onUpdateSuccess, onDeleteSuccess } = createMutationHelpers(
    dispatch,
    onSettled
  );

  const addMutation = useMutation<
    Todo,
    ApiError,
    CreateTodoRequest,
    { previousTodos: Todo[]; tempId: TempId }
  >({
    mutationFn: createTodo,
    onMutate: async (newTodo) => {
      await queryClient.cancelQueries({ queryKey: ["todos"] });
      const tempId = Date.now().toString() as TempId;
      const tempTodo: Todo = { ...newTodo, id: -Date.now(), _tempId: tempId };

      const previousTodos = todos;
      dispatch(addTodoState(tempTodo));

      toast.success("Todo added successfully!", {
        description: `Task "${getTruncatedText(
          tempTodo.todo
        )}" has been added.`,
      });

      return { previousTodos, tempId };
    },
    onSuccess: (newTodo, _variables, context) => {
      dispatch(
        replaceTodo({ tempId: context.tempId as unknown as string, newTodo })
      );
    },
    onError: createMutationErrorHandler(dispatch, "add"),
    onSettled,
  });

  const updateMutation = useMutation<
    Todo,
    ApiError,
    { payload: UpdateTodoRequest; isToggle?: boolean },
    { previousTodos: Todo[] }
  >({
    mutationFn: ({ payload }) => updateTodoApi(payload),
    onMutate: async ({ payload }) => {
      await queryClient.cancelQueries({ queryKey: ["todos"] });
      const previousTodos = todos;
      dispatch(updateTodoState({ id: payload.id, updates: payload }));
      return { previousTodos };
    },
    onSuccess: onUpdateSuccess,
    onError: createMutationErrorHandler(dispatch, "update"),
    onSettled,
  });

  const deleteMutation = useMutation<
    DeletedTodo,
    ApiError,
    number,
    { previousTodos: Todo[] }
  >({
    mutationFn: deleteTodoApi,
    onMutate: async (deletedTodoId) => {
      await queryClient.cancelQueries({ queryKey: ["todos"] });
      const previousTodos = [...todos];
      dispatch(deleteTodoState(deletedTodoId));
      return { previousTodos };
    },
    onSuccess: onDeleteSuccess,
    onError: createMutationErrorHandler(dispatch, "delete"),
    onSettled,
  });

  const addTodo = (
    newTodo: CreateTodoRequest,
    reset?: UseFormReset<AddTodoFormInputs>
  ) => {
    reset?.();
    addMutation.mutate(newTodo);
  };

  const updateTodo = (updatedTodo: UpdateTodoRequest) => {
    updateMutation.mutate({ payload: updatedTodo });
  };

  const toggleCompletion = (id: number, completed: boolean) => {
    updateMutation.mutate({ payload: { id, completed }, isToggle: true });
  };

  const deleteTodo = (id: number) => {
    deleteMutation.mutate(id);
  };

  return {
    addTodo,
    updateTodo,
    toggleCompletion,
    deleteTodo,
    isAdding: addMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
