import { Button } from "@/src/shared/components/ui/button";
import { RiQuillPenFill as QuillPen } from "react-icons/ri";
import { MdAdd } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/src/shared/utils/tailwindUtils";
import type { UseFormRegister, FieldErrors } from "react-hook-form";
import type { AddTodoFormInputs } from "./AddTodo";
import { Input } from "@/src/shared/components/ui/input";

interface AddTodoFormProps {
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  register: UseFormRegister<AddTodoFormInputs>;
  errors: FieldErrors<AddTodoFormInputs>;
  isSubmitting: boolean;
  isFocused: boolean;
  setIsFocused: (isFocused: boolean) => void;
  showSuccess: boolean;
}

export function AddTodoForm({
  handleSubmit,
  register,
  errors,
  isSubmitting,
  isFocused,
  setIsFocused,
  showSuccess,
}: AddTodoFormProps) {
  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-3"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex gap-2">
        <motion.div className="flex-1 relative">
          <QuillPen className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-950 pointer-events-none scale-x-[-1]" />
          <Input
            type="text"
            placeholder="Write a new task..."
            {...register("todo")}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="h-12 pl-10 pr-20 text-base handwritten bg-white/50 border-dashed border-neutral-400"
            disabled={isSubmitting}
            maxLength={200}
          />
          {isFocused && errors.todo && (
            <motion.div
              className="absolute hidden sm:flex right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 pt-1 handwritten pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <AnimatePresence>
                <motion.span
                  className={cn(
                    "text-ink/60",
                    errors.todo?.message?.includes("exceed") &&
                      "text-orange-500"
                  )}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  {errors.todo?.message}
                </motion.span>
              </AnimatePresence>
            </motion.div>
          )}
        </motion.div>

        <motion.div
          whileTap={{ scale: 0.98 }}
          animate={showSuccess ? { scale: [1, 1.05, 1] } : {}}
          transition={{ duration: 0.3 }}
        >
          <Button
            type="submit"
            disabled={isSubmitting}
            loadingText="Adding..."
            className={cn(
              "h-12 px-4 handwritten border border-neutral-400 text-ink transition-colors",
              "disabled:bg-[var(--item-unselected)] disabled:text-ink/50",
              "enabled:bg-[var(--item-selected)] hover:enabled:bg-[var(--item-focus)]"
            )}
            variant="outline"
          >
            <AnimatePresence mode="wait">
              {showSuccess ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="text-green-600"
                >
                  ✓
                </motion.div>
              ) : (
                <motion.div
                  key="default"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <MdAdd className="h-6 w-6" />
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
        </motion.div>
      </div>
    </motion.form>
  );
}
