import { Card, CardContent } from "@/src/shared/components/ui/card";
import { IoMdCheckmarkCircleOutline as TodoIcon } from "react-icons/io";

interface TotalTodosStatProps {
  totalTodos: number;
}

export function TotalTodosStat({ totalTodos }: TotalTodosStatProps) {
  return (
    <Card className="hidden sm:flex flex-col items-center justify-center shadow-xs border border-neutral-400/50 bg-[var(--darker)] h-24 sm:h-28 lg:h-32">
      <CardContent className="p-3 sm:p-4 w-full h-full flex flex-col justify-center items-center">
        <div className="flex flex-col items-center justify-center text-center">
          <p className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm lg:text-base font-medium text-[var(--ink-light)] mb-1">
            <TodoIcon className="h-3 w-3 sm:h-4 sm:w-4" />
            Total
          </p>
          <p className="text-lg sm:text-xl lg:text-3xl font-bold text-[var(--ink-light)]">
            {totalTodos}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
