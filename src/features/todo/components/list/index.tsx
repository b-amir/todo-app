import { useAppSelector, useAppDispatch } from "@/src/features/todo/hooks";
import { useCallback, useState } from "react";
import { reorderTodos } from "@/src/features/todo/store/todoSlice";
import { Reorder, AnimatePresence } from "framer-motion";
import type { Todo } from "@/src/features/todo/api";
import { toast } from "sonner";
import { LoadMoreButton } from "@/src/features/todo/components/layout";
import { TodoItem } from "@/src/features/todo/components/item";

interface TodoListProps {
  onLoadMore: () => void;
  isLoading?: boolean;
}

export function TodoList({ onLoadMore, isLoading = false }: TodoListProps) {
  const dispatch = useAppDispatch();
  const { todos } = useAppSelector((state) => state.todos);
  const [isReordered, setIsReordered] = useState(false);

  const filteredTodos = todos;

  const handleReorder = useCallback(
    (newFilteredTodos: Todo[]) => {
      const movedItemId = newFilteredTodos.find(
        (todo: Todo, i: number) => todos[i]?.id !== todo.id
      )?.id;

      if (movedItemId) {
        const oldIndex = todos.findIndex(
          (todo: Todo) => todo.id === movedItemId
        );
        const newIndex = newFilteredTodos.findIndex(
          (todo: Todo) => todo.id === movedItemId
        );

        if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
          dispatch(
            reorderTodos({
              fromIndex: oldIndex,
              toIndex: newIndex,
            })
          );
          setIsReordered(true);
        }
      }
    },
    [todos, dispatch]
  );

  const handleDragEnd = () => {
    if (isReordered) {
      toast.success("Task reordered successfully!", {
        description: "Your list has been updated with the new order.",
      });
      setIsReordered(false);
    }
  };

  if (filteredTodos.length === 0) {
    return (
      <div className="text-center py-10">
        <div className="text-ink/60 text-lg mb-2 handwritten">
          No tasks available.
        </div>
        <div className="text-ink/50 text-sm handwritten">
          Add a new task to get started.
        </div>
      </div>
    );
  }

  return (
    <>
      <Reorder.Group
        axis="y"
        values={filteredTodos}
        onReorder={handleReorder}
        className="flex flex-col gap-0 w-full mb-0"
      >
        <AnimatePresence>
          {filteredTodos.map((todo) => (
            <Reorder.Item
              key={todo._tempId || todo.id}
              value={todo}
              className="w-full"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              onDragEnd={handleDragEnd}
            >
              <TodoItem todo={todo} />
            </Reorder.Item>
          ))}
        </AnimatePresence>
      </Reorder.Group>
      <LoadMoreButton onLoadMore={onLoadMore} isLoading={isLoading} />
    </>
  );
}
