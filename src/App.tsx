import RootLayout from "@/src/app/layout";
import { Button } from "@/src/shared/components/ui/button";
import { TodoList } from "@/src/features/todo/components/list";
import { AddTodo } from "@/src/features/todo/components/add/AddTodo";
import { InfoTiles } from "@/src/shared/components/layout/header/layout";
import { ErrorBoundary } from "@/src/shared/components/common/ErrorBoundary";
import { useTodos } from "@/src/features/todo/hooks/useTodos";

function TodoAppContent() {
  const {
    hasData,
    hasLocalChanges,
    isFetching,
    error,
    handleFetchFromServer,
    handleReset,
    handleLoadMore,
  } = useTodos();

  const showRefreshButton = !hasData || hasLocalChanges;

  return (
    <div className="min-h-screen paper-texture">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
          <ErrorBoundary>
            <InfoTiles
              onFetchFromServer={handleFetchFromServer}
              onReset={handleReset}
              isFetching={isFetching}
              hasLocalChanges={hasLocalChanges}
              showRefreshButton={showRefreshButton}
            />
          </ErrorBoundary>

          <div className=" bg-white/20 pt-4 sm:pt-6 pb-2 sm:pb-0 overflow-hidden shadow-sm rounded-lg border border-neutral-400/50">
            <div className="space-y-4 sm:space-y-6 paper-texture">
              <ErrorBoundary>
                <AddTodo />
              </ErrorBoundary>

              {error && (
                <div className="flex items-center justify-center py-4">
                  <Button
                    variant="outline"
                    onClick={handleFetchFromServer}
                    loading={isFetching}
                    loadingText="Retrying..."
                    className="handwritten bg-transparent border-red-400 text-red-700 hover:bg-red-50"
                  >
                    Retry
                  </Button>
                </div>
              )}

              <ErrorBoundary>
                <TodoList onLoadMore={handleLoadMore} isLoading={isFetching} />
              </ErrorBoundary>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <RootLayout>
      <ErrorBoundary>
        <TodoAppContent />
      </ErrorBoundary>
    </RootLayout>
  );
}
