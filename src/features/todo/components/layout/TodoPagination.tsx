import { useAppSelector } from "@/src/features/todo/hooks";
import { Button } from "@/src/shared/components/ui/button";
import { FiDownload as Download } from "react-icons/fi";

interface LoadMoreButtonProps {
  onLoadMore: () => void;
  isLoading?: boolean;
}

export function LoadMoreButton({
  onLoadMore,
  isLoading = false,
}: LoadMoreButtonProps) {
  const { hasMoreTodos, totalTodos, todos } = useAppSelector(
    (state) => state.todos
  );

  if (!hasMoreTodos) {
    return (
      <div className="flex flex-col items-center justify-center space-y-2 py-4">
        <div className="text-sm text-ink/60 handwritten">
          All {totalTodos} todos loaded
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-2 pb-4">
      <Button
        onClick={onLoadMore}
        loading={isLoading}
        loadingText="Loading..."
        fullWidth
        className="handwritten bg-[var(--item-focus)]/40 border-ink/80 text-ink hover:bg-[var(--ink-pale)] py-8 my-0 text-base shadow-inner cursor-pointer"
      >
        <Download className="h-4 w-4 mb-1" />
        Load More
      </Button>
      <div className="text-sm text-ink/60 handwritten border-t border-neutral-400/50 bg-[var(--item-unselected)] p-2 -mb-6 sm:-mb-4 w-full text-center">
        {todos.length} of {totalTodos} todos loaded
      </div>
    </div>
  );
}
