import { memo, useState, useCallback } from "react";
import type { Todo } from "@/src/features/todo/api";
import {
  useAppDispatch,
  useAppSelector,
  useTodoMutations,
  useTodoDrag,
} from "@/src/features/todo/hooks";
import {
  updateTodo,
  deleteTodo as deleteTodoState,
} from "@/src/features/todo/store/todoSlice";
import { toast } from "sonner";
import { cn } from "@/src/shared/utils/tailwindUtils";
import { Reorder } from "framer-motion";
import { TodoItemActions } from "./TodoItemActions";
import { TodoItemContent } from "./TodoItemContent";
import { TodoItemDragHandle } from "./TodoItemDragHandle";
import { TodoItemCheckbox } from "./TodoItemCheckbox";

interface TodoItemProps {
  todo: Todo;
  onDragEnd?: () => void;
}

export const TodoItem = memo(function TodoItem({
  todo,
  onDragEnd,
}: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const dispatch = useAppDispatch();
  const isNewlyCreated = useAppSelector((state) =>
    state.todos.localDiffs.created.some((t) => t.id === todo.id)
  );

  const { toggleCompletion, deleteTodo } = useTodoMutations();
  const { controls, scale, zIndex, handleDragStart, handleDragEnd } =
    useTodoDrag();

  const handleToggleComplete = useCallback(() => {
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
      toggleCompletion(todo.id, !todo.completed);
    }
  }, [isNewlyCreated, dispatch, todo.id, todo.completed, toggleCompletion]);

  const handleDelete = useCallback(() => {
    if (isNewlyCreated) {
      dispatch(deleteTodoState(todo.id));
      toast.success("Todo deleted locally!", {
        description: `Task "${
          todo.todo.length > 20 ? `${todo.todo.substring(0, 20)}...` : todo.todo
        }" has been deleted.`,
      });
    } else {
      deleteTodo(todo.id);
    }
  }, [isNewlyCreated, dispatch, todo.id, todo.todo, deleteTodo]);

  const handleEdit = useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleCancelEditing = useCallback(() => {
    setIsEditing(false);
  }, []);

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
      style={{ scale, zIndex, willChange: "transform" }}
      dragSnapToOrigin
      onDragStart={handleDragStart}
      onDragEnd={() => {
        handleDragEnd();
        onDragEnd?.();
      }}
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
          onCancel={handleCancelEditing}
          onToggle={handleToggleComplete}
        />
        {!isEditing && (
          <TodoItemActions
            todo={todo}
            isDeleting={false}
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
