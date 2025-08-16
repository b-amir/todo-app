import { Button } from "@/src/shared/components/ui/button";
import { FiCheck as Check } from "react-icons/fi";
import { MdEditOff as EditOff } from "react-icons/md";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import type { UseFormRegister, FieldErrors } from "react-hook-form";
import type { EditTodoFormInputs } from "./EditTodoForm";
import { Input } from "@/src/shared/components/ui/input";

interface EditTodoFormUIProps {
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  register: UseFormRegister<EditTodoFormInputs>;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  onCancel: () => void;
  errors: FieldErrors<EditTodoFormInputs>;
  isSubmitting: boolean;
  isPending: boolean;
}

export function EditTodoFormUI({
  handleSubmit,
  register,
  handleKeyDown,
  onCancel,
  errors,
  isSubmitting,
  isPending,
}: EditTodoFormUIProps) {
  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full items-center space-x-2"
    >
      <Input
        className="h-8 flex-grow bg-transparent border-0 shadow-none px-0 focus-visible:shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
        {...register("todo")}
        onKeyDown={handleKeyDown}
      />
      <AnimatePresence>
        {errors.todo && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <p className="text-red-500 text-xs">{errors.todo.message}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-1 flex-shrink-0">
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={onCancel}
          disabled={isSubmitting}
          className="h-8 w-8 p-0"
        >
          <EditOff className="h-4 w-4" />
        </Button>{" "}
        <Button
          type="submit"
          size="sm"
          variant="ghost"
          loading={isPending}
          disabled={isSubmitting}
          className="h-8 w-8 p-0 text-green-600 hover:text-green-700"
        >
          <Check className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}
