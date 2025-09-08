import { toast } from "sonner";
import { useState } from "react";
import { useForm, type SubmitHandler, type FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTodoMutations } from "@/src/features/todo/hooks";
import { AddTodoForm } from "./AddTodoForm";
import { addTodoSchema } from "@/src/features/todo/utils/validations/todoSchema";

export type AddTodoFormInputs = z.infer<typeof addTodoSchema>;

export function AddTodo() {
  const [showSuccess] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<AddTodoFormInputs>({
    resolver: zodResolver(addTodoSchema),
  });

  const { addTodo } = useTodoMutations();

  const onSubmit: SubmitHandler<AddTodoFormInputs> = (data) => {
    const newTodo = {
      ...data,
      completed: false,
      userId: Math.floor(Math.random() * 100) + 1,
    };
    addTodo(newTodo, reset);
  };

  const onInvalid = (errors: FieldErrors<AddTodoFormInputs>) => {
    const errorMessage = Object.values(errors)
      .map((err) => err.message)
      .join(", ");
    toast.error("Invalid input", {
      description: errorMessage,
    });
  };

  return (
    <div className="space-y-4 bg-[var(--darker)] border-b border-neutral-400/50 p-4 -mt-6 mb-4  rounded-t-lg">
      <AddTodoForm
        handleSubmit={handleSubmit(onSubmit, onInvalid)}
        register={register}
        errors={errors}
        isSubmitting={isSubmitting}
        isFocused={isFocused}
        setIsFocused={setIsFocused}
        showSuccess={showSuccess}
      />
    </div>
  );
}
