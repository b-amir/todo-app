import { EditTodoForm } from "@/src/features/todo/components/edit/EditTodoForm";
import type { Todo } from "@/src/features/todo/api";
import { cn } from "@/src/shared/utils/tailwindUtils";
import { motion } from "framer-motion";

interface TodoItemContentProps {
  todo: Todo;
  isEditing: boolean;
  onCancel: () => void;
  onToggle: () => void;
}

export function TodoItemContent({
  todo,
  isEditing,
  onCancel,
  onToggle,
}: TodoItemContentProps) {
  return (
    <div className="flex-1 min-w-0 relative">
      {isEditing ? (
        <EditTodoForm todo={todo} onCancel={onCancel} />
      ) : (
        <div
          className="relative inline-block"
          onClick={onToggle}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onToggle();
            }
          }}
          role="button"
          tabIndex={0}
        >
          <span
            className={cn(
              "text-base font-medium break-words transition-all duration-200 handwritten cursor-pointer",
              "leading-relaxed",
              todo.completed ? "text-black/60 line-through" : "text-ink-800"
            )}
          >
            {todo.todo}
          </span>
          {todo.completed && (
            <motion.div
              className="absolute top-1/2 left-0 h-0.5 bg-ink-600 origin-[left_center]"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
          )}
        </div>
      )}
    </div>
  );
}
