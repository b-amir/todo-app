import { Button } from "@/src/shared/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/src/shared/components/ui/dialog";
import { FiRotateCcw as RotateCcw } from "react-icons/fi";

interface ResetDialogProps {
  onReset: () => void;
  isLoading?: boolean;
}

export function ResetDialog({ onReset, isLoading = false }: ResetDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          loading={isLoading}
          loadingText="Resetting..."
          size="sm"
          fullWidth
          className="handwritten h-6 sm:h-7 lg:h-8 text-xs sm:text-sm lg:text-base bg-[var(--darker)] border-t border-neutral-400/50 text-ink hover:bg-[var(--item-focus)] rounded-b-lg"
        >
          <RotateCcw className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="hidden sm:inline">Reset</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>
            This will discard all your local changes and reset to the original
            server data. This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost" className="text-black">
              Cancel
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              onClick={onReset}
              className="bg-[var(--destructive)] hover:bg-red-700 text-white"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
