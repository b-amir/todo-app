import { toast } from "sonner";
import type { useAppDispatch } from "@/src/features/todo/hooks";
import {
  addTodo,
  deleteTodo,
  setTodos,
  updateTodo,
} from "@/src/features/todo/store/todoSlice";
import type ApiError from "@/src/shared/utils/ApiError";
import type { DeletedTodo, Todo } from "@/src/features/todo/api";
import {
  createTodo,
  updateTodo as updateTodoApi,
} from "@/src/features/todo/api";
import { getTruncatedText } from "@/src/shared/utils/stringUtils";

export const createMutationErrorHandler =
  (
    dispatch: ReturnType<typeof useAppDispatch>,
    action: "add" | "update" | "delete"
  ) =>
  (
    _error: ApiError,
    _variables: unknown,
    context: { previousTodos?: Todo[] } | undefined
  ) => {
    if (context?.previousTodos) {
      dispatch(setTodos(context.previousTodos));
    }
    const messages = {
      add: "Your new todo has been removed.",
      update: "Your changes have been rolled back.",
      delete: "Your todo has been restored.",
    };
    toast.error(`Failed to ${action} todo`, {
      description: `Couldn't save to the server. ${messages[action]}`,
    });
  };

export const createMutationHelpers = (
  dispatch: ReturnType<typeof useAppDispatch>,
  onSettled: () => void
) => {
  const handleUndoToggle = async (updatedTodo: Todo) => {
    try {
      const revertedTodo = await updateTodoApi({
        id: updatedTodo.id,
        completed: !updatedTodo.completed,
      });
      dispatch(
        updateTodo({
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
  };

  const handleUndoDelete = async (
    deletedTodo: DeletedTodo,
    previousTodos: Todo[]
  ) => {
    const originalTodo = previousTodos.find((t) => t.id === deletedTodo.id);
    if (!originalTodo) {
      toast.error("Failed to find original todo for undo.");
      return;
    }

    dispatch(addTodo(originalTodo));

    try {
      await createTodo({
        todo: deletedTodo.todo,
        completed: deletedTodo.completed,
        userId: deletedTodo.userId,
      });
      toast.success("Undo successful!");
      onSettled();
    } catch (error) {
      toast.error("Failed to undo", {
        description: "Couldn't restore the todo on the server.",
      });
      dispatch(deleteTodo(originalTodo.id));
    }
  };

  const onUpdateSuccess = (
    updatedTodo: Todo,
    { isToggle }: { isToggle?: boolean }
  ) => {
    dispatch(updateTodo({ id: updatedTodo.id, updates: updatedTodo }));

    if (isToggle) {
      toast.success("Todo updated!", {
        description: `Task marked as ${
          updatedTodo.completed ? "complete" : "incomplete"
        }.`,
        action: {
          label: "Undo",
          onClick: () => handleUndoToggle(updatedTodo),
        },
      });
    } else {
      toast.success("Todo updated successfully!", {
        description: `Task "${getTruncatedText(
          updatedTodo.todo
        )}" has been updated.`,
      });
    }
  };

  const onDeleteSuccess = (
    deletedTodo: DeletedTodo,
    _variables: number,
    { previousTodos }: { previousTodos: Todo[] }
  ) => {
    toast.success("Todo deleted!", {
      description: `Task "${getTruncatedText(
        deletedTodo.todo
      )}" has been removed.`,
      action: {
        label: "Undo",
        onClick: () => handleUndoDelete(deletedTodo, previousTodos),
      },
    });
  };

  return { onUpdateSuccess, onDeleteSuccess };
};
