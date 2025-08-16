import { Button } from "@/src/shared/components/ui/button";
import { MdEdit as EditIcon } from "react-icons/md";
import { DeleteTodoDialog } from "@/src/features/todo/components/dialogs";
import type { Todo } from "@/src/features/todo/api";
import { cn } from "@/src/shared/utils/tailwindUtils";

interface TodoItemActionsProps {
  todo: Todo;
  isDeleting: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

export function TodoItemActions({
  todo,
  isDeleting,
  onEdit,
  onDelete,
}: TodoItemActionsProps) {
  return (
    <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
      <Button
        size="sm"
        variant="ghost"
        onClick={(e) => {
          e.stopPropagation();
          onEdit();
        }}
        className={cn(
          "h-8 w-8 p-0 text-ink-700 hover:text-ink-900 opacity-80 hover:opacity-100",
          "transition-all duration-150 ease-out",
          "hover:scale-110 active:scale-95"
        )}
        data-clickable="false"
      >
        <EditIcon className="h-4 w-4" />
      </Button>
      <DeleteTodoDialog
        todo={todo}
        onDelete={onDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
}
