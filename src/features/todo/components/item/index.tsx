import { memo, useState } from "react";
import type { Todo } from "@/src/features/todo/api";
import { useAppDispatch, useAppSelector } from "@/src/features/todo/hooks";
import { updateTodo, deleteTodo } from "@/src/features/todo/store/todoSlice";
import { toast } from "sonner";
import { cn } from "@/src/shared/utils/tailwindUtils";
import { Reorder } from "framer-motion";
import {
  useToggleTodoCompletion,
  useDeleteTodo,
  useTodoDrag,
} from "@/src/features/todo/hooks";
import { TodoItemActions } from "./TodoItemActions";
import { TodoItemContent } from "./TodoItemContent";
import { TodoItemDragHandle } from "./TodoItemDragHandle";
import { TodoItemCheckbox } from "./TodoItemCheckbox";

interface TodoItemProps {
  todo: Todo;
}

export const TodoItem = memo(function TodoItem({ todo }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const dispatch = useAppDispatch();
  const { localDiffs } = useAppSelector((state) => state.todos);

  const isNewlyCreated = localDiffs.created.some((t) => t.id === todo.id);

  const updateMutation = useToggleTodoCompletion();
  const deleteMutation = useDeleteTodo();
  const { controls, scale, zIndex, handleDragStart, handleDragEnd } =
    useTodoDrag();

  const handleToggleComplete = () => {
    if (isNewlyCreated) {
      dispatch(
        updateTodo({
          id: todo.id,
          updates: { completed: !todo.completed },
        })
      );
      toast.success("Todo updated locally!", {
        description: `Task marked as ${
          !todo.completed ? "complete" : "incomplete"
        }.`,
      });
    } else {
      updateMutation.mutate({
        id: todo.id,
        completed: !todo.completed,
      });
    }
  };

  const handleDelete = () => {
    if (isNewlyCreated) {
      dispatch(deleteTodo(todo.id));
      toast.success("Todo deleted locally!", {
        description: `Task "${
          todo.todo.length > 20 ? `${todo.todo.substring(0, 20)}...` : todo.todo
        }" has been deleted.`,
      });
    } else {
      deleteMutation.mutate(todo.id);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  return (
    <Reorder.Item
      value={todo}
      dragListener={false}
      dragControls={controls}
      className="relative group"
      as="div"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      style={{ scale, zIndex }}
      dragSnapToOrigin
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      layout
      transition={{
        type: "spring",
        stiffness: 600,
        damping: 30,
      }}
    >
      <div
        className={cn(
          "flex items-center gap-3 px-4 todo-line-height",
          "transition-all duration-200 ease-out",
          "border-b border-dashed  border-neutral-400/50",
          "cursor-default",
          isEditing
            ? "bg-[var(--item-focus)] shadow-xs border-neutral-400"
            : "hover:bg-[var(--item-unselected)]"
        )}
      >
        <TodoItemDragHandle controls={controls} />
        <TodoItemCheckbox
          completed={todo.completed}
          onToggle={handleToggleComplete}
        />
        <TodoItemContent
          todo={todo}
          isEditing={isEditing}
          onCancel={() => setIsEditing(false)}
          onToggle={handleToggleComplete}
        />
        {!isEditing && (
          <TodoItemActions
            todo={todo}
            isDeleting={deleteMutation.isPending}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>
    </Reorder.Item>
  );
});

export * from "./TodoItemActions";
export * from "./TodoItemCheckbox";
export * from "./TodoItemContent";
export * from "./TodoItemDragHandle";
