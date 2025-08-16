import { Checkbox } from "@/src/shared/components/ui/checkbox";
import { cn } from "@/src/shared/utils/tailwindUtils";

interface TodoItemCheckboxProps {
  completed: boolean;
  onToggle: () => void;
}

export function TodoItemCheckbox({
  completed,
  onToggle,
}: TodoItemCheckboxProps) {
  return (
    <div className="flex-shrink-0" data-clickable="false">
      <Checkbox
        checked={completed}
        onChange={onToggle}
        className={cn(
          "data-[state=checked]:bg-ink-700 data-[state=checked]:border-ink-700 h-5 w-5",
          "transition-all duration-200 ease-out",
          "hover:scale-110 active:scale-95"
        )}
      />
    </div>
  );
}
