import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";
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
  setTodos,
  replaceTodo,
} from "@/src/features/todo/store/todoSlice";
import { toast } from "sonner";
import type { UseFormReset } from "react-hook-form";
import type { AddTodoFormInputs } from "@/src/features/todo/components/add/AddTodo";
import ApiError from "@/src/shared/utils/ApiError";

export function useTodoMutations() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const { todos } = useAppSelector((state) => state.todos);
  const lastSnapshotRef = useRef<Todo[] | null>(null);

  const addMutation = useMutation<
    Todo,
    ApiError,
    CreateTodoRequest,
    | {
        previousTodos: Todo[];
        tempId: TempId;
      }
    | undefined
  >({
    mutationFn: createTodo,
    onMutate: async (newTodo) => {
      await queryClient.cancelQueries({ queryKey: ["todos"] });
      const tempId = Date.now().toString() as TempId;
      const tempTodo = { ...newTodo, id: -Date.now(), _tempId: tempId } as Todo;

      const previousTodos = todos;
      dispatch(addTodoState(tempTodo));

      toast.success("Todo added successfully!", {
        description: `Task "${
          tempTodo.todo.length > 20
            ? `${tempTodo.todo.substring(0, 20)}...`
            : tempTodo.todo
        }" has been added.`,
      });

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
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const updateMutation = useMutation<
    Todo,
    ApiError,
    UpdateTodoRequest,
    { previousTodos: Todo[] } | undefined
  >({
    mutationFn: updateTodoApi,
    onMutate: async (updatedTodo) => {
      await queryClient.cancelQueries({ queryKey: ["todos"] });
      const previousTodos = todos;
      dispatch(
        updateTodoState({
          id: updatedTodo.id,
          updates: updatedTodo,
        })
      );
      lastSnapshotRef.current = previousTodos;
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
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const toggleMutation = useMutation<
    Todo,
    ApiError,
    UpdateTodoRequest,
    { previousTodos: Todo[] } | undefined
  >({
    mutationFn: updateTodoApi,
    onMutate: async (updatedTodo) => {
      await queryClient.cancelQueries({ queryKey: ["todos"] });
      const previousTodos = todos;
      dispatch(
        updateTodoState({
          id: updatedTodo.id,
          updates: updatedTodo,
        })
      );
      lastSnapshotRef.current = previousTodos;
      return { previousTodos };
    },
    onSuccess: (updatedTodo) => {
      toast.success("Todo updated!", {
        description: `Task marked as ${
          updatedTodo.completed ? "complete" : "incomplete"
        }.`,
        action: {
          label: "Undo",
          onClick: async () => {
            try {
              const revertedTodo = await updateTodoApi({
                id: updatedTodo.id,
                completed: !updatedTodo.completed,
              });
              dispatch(
                updateTodoState({
                  id: revertedTodo.id,
                  updates: revertedTodo,
                })
              );
              toast.success("Undo successful!");
            } catch (error) {
              toast.error("Failed to undo", {
                description: "Couldn't reverse the action on the server.",
              });
            }
          },
        },
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
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
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
    onSuccess: (deletedTodo, _variables, context) => {
      if (deletedTodo && context?.previousTodos) {
        toast.success("Todo deleted!", {
          description: `Task "${
            deletedTodo.todo.length > 20
              ? `${deletedTodo.todo.substring(0, 20)}...`
              : deletedTodo.todo
          }" has been removed.`,
          action: {
            label: "Undo",
            onClick: async () => {
              const originalTodo = context.previousTodos.find(
                (t: Todo) => t.id === deletedTodo.id
              );
              if (!originalTodo) {
                toast.error("Failed to find original todo for undo.");
                return;
              }
              dispatch(addTodoState(originalTodo));

              try {
                await createTodo({
                  todo: deletedTodo.todo,
                  completed: deletedTodo.completed,
                  userId: deletedTodo.userId,
                });
                toast.success("Undo successful!");
              } catch (error) {
                toast.error("Failed to undo", {
                  description: "Couldn't restore the todo on the server.",
                });
                dispatch(deleteTodoState(originalTodo.id));
              }
            },
          },
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
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const addTodo = (
    newTodo: CreateTodoRequest,
    reset?: UseFormReset<AddTodoFormInputs>
  ) => {
    reset?.();
    addMutation.mutate(newTodo);
  };

  const updateTodo = (updatedTodo: UpdateTodoRequest) => {
    updateMutation.mutate(updatedTodo);
  };

  const toggleCompletion = (id: number, completed: boolean) => {
    toggleMutation.mutate({ id, completed });
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
    isToggling: toggleMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
