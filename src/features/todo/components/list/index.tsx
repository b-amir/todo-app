import { useAppSelector, useAppDispatch } from "@/src/features/todo/hooks";
import { useCallback, useState, useEffect } from "react";
import { reorderTodos } from "@/src/features/todo/store/todoSlice";
import { Reorder } from "framer-motion";
import type { Todo } from "@/src/features/todo/api";
import { toast } from "sonner";
import { LoadMoreButton } from "@/src/features/todo/components/layout";
import { TodoItem } from "@/src/features/todo/components/item";
import { LazyMotion, domMax } from "framer-motion";

interface TodoListProps {
  onLoadMore: () => void;
  isLoading?: boolean;
}

export function TodoList({ onLoadMore, isLoading = false }: TodoListProps) {
  const dispatch = useAppDispatch();
  const { todos: todosFromStore } = useAppSelector((state) => state.todos);
  const [todos, setTodos] = useState(todosFromStore);

  useEffect(() => {
    setTodos(todosFromStore);
  }, [todosFromStore]);

  const handleReorder = useCallback((newOrder: Todo[]) => {
    setTodos(newOrder);
  }, []);

  const handleDragEnd = useCallback(() => {
    const oldIndexMap = new Map(
      todosFromStore.map((todo, index) => [todo.id, index])
    );

    let movedItemId: number | null = null;
    let maxDisplacement = -1;

    for (const todo of todos) {
      const oldIndex = oldIndexMap.get(todo.id);
      if (oldIndex === undefined) continue;

      const newIndex = todos.findIndex((t) => t.id === todo.id);
      const displacement = Math.abs(newIndex - oldIndex);

      if (displacement > maxDisplacement) {
        maxDisplacement = displacement;
        movedItemId = todo.id;
      }
    }

    if (movedItemId) {
      const oldIndex = oldIndexMap.get(movedItemId);
      const newIndex = todos.findIndex((t) => t.id === movedItemId);

      if (oldIndex !== undefined && newIndex !== -1 && oldIndex !== newIndex) {
        dispatch(
          reorderTodos({
            fromIndex: oldIndex,
            toIndex: newIndex,
          })
        );
        toast.success("Task reordered successfully!", {
          description: "Your list has been updated with the new order.",
        });
      }
    }
  }, [todos, todosFromStore, dispatch]);

  if (todos.length === 0) {
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
      <LazyMotion features={domMax}>
        <Reorder.Group
          axis="y"
          values={todos}
          onReorder={handleReorder}
          className="flex flex-col gap-0 w-full mb-0"
        >
          {todos.map((todo) => (
            <TodoItem
              key={todo._tempId || todo.id}
              todo={todo}
              onDragEnd={handleDragEnd}
            />
          ))}
        </Reorder.Group>
      </LazyMotion>
      <LoadMoreButton onLoadMore={onLoadMore} isLoading={isLoading} />
    </>
  );
}
