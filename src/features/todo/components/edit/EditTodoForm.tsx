import React from "react";
import { useForm, type SubmitHandler, type FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  useAppDispatch,
  useAppSelector,
  useTodoMutations,
} from "@/src/features/todo/hooks";
import { updateTodo as updateTodoState } from "@/src/features/todo/store/todoSlice";
import type { Todo } from "@/src/features/todo/api";
import { editTodoSchema } from "@/src/features/todo/utils/validations/todoSchema";
import { EditTodoFormUI } from "./EditTodoFormUI";

interface EditTodoFormProps {
  todo: Todo;
  onCancel: () => void;
}

type EditTodoFormInputs = z.infer<typeof editTodoSchema>;

export function EditTodoForm({ todo, onCancel }: EditTodoFormProps) {
  const dispatch = useAppDispatch();
  const { localDiffs } = useAppSelector((state) => state.todos);
  const isNewlyCreated = localDiffs.created.some((t) => t.id === todo.id);

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<EditTodoFormInputs>({
    resolver: zodResolver(editTodoSchema),
    defaultValues: {
      todo: todo.todo,
    },
  });

  const { updateTodo } = useTodoMutations();

  const onSubmit: SubmitHandler<EditTodoFormInputs> = (data) => {
    if (data.todo === todo.todo) {
      onCancel();
      return;
    }

    if (isNewlyCreated) {
      dispatch(updateTodoState({ id: todo.id, updates: { todo: data.todo } }));
      toast.success("Todo updated locally!", {
        description: `Task updated to "${
          data.todo.length > 20 ? `${data.todo.substring(0, 20)}...` : data.todo
        }".`,
      });
      onCancel();
    } else {
      updateTodo({ id: todo.id, todo: data.todo });
    }
  };

  const onInvalid = (errors: FieldErrors<EditTodoFormInputs>) => {
    const errorMessage = Object.values(errors)
      .map((err) => err.message)
      .join(", ");
    toast.error("Invalid input", {
      description: errorMessage,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit(onSubmit, onInvalid)();
    }
    if (e.key === "Escape") {
      onCancel();
    }
  };

  return (
    <EditTodoFormUI
      handleSubmit={handleSubmit(onSubmit, onInvalid)}
      register={register}
      errors={errors}
      isSubmitting={isSubmitting}
      onCancel={onCancel}
      handleKeyDown={handleKeyDown}
      isPending={false}
    />
  );
}
