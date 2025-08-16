import { useAppSelector } from "@/src/features/todo/hooks";
import { TotalTodosStat, Logo, SyncStatus } from ".";

interface InfoTilesProps {
  onFetchFromServer: () => void;
  onReset: () => void;
  isFetching: boolean;
  hasLocalChanges: boolean;
  showRefreshButton: boolean;
}

export function InfoTiles({
  onFetchFromServer,
  onReset,
  isFetching,
  showRefreshButton,
}: InfoTilesProps) {
  const { totalTodos, todos, isOnline, localDiffs } = useAppSelector(
    (state) => state.todos
  );

  const hasLocalChangesFromState =
    (localDiffs?.created?.length || 0) > 0 ||
    (localDiffs?.updated?.length || 0) > 0 ||
    (localDiffs?.deleted?.length || 0) > 0 ||
    (localDiffs?.reorderedCount || 0) > 0;

  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-4">
      <Logo />
      <TotalTodosStat totalTodos={totalTodos} />
      <SyncStatus
        isOnline={isOnline}
        hasLocalChanges={hasLocalChangesFromState}
        isFetching={isFetching}
        showRefreshButton={showRefreshButton}
        onFetchFromServer={onFetchFromServer}
        onReset={onReset}
        hasTodos={todos.length > 0}
      />
    </div>
  );
}
