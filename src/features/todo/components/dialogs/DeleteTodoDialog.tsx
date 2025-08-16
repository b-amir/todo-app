import React from "react";
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
import { Button } from "@/src/shared/components/ui/button";
import { FiTrash2 as Trash2 } from "react-icons/fi";
import type { Todo } from "@/src/features/todo/api/";

import { DeleteTodoButton } from "./DeleteTodoButton";

interface DeleteTodoDialogProps {
  todo: Todo;
  onDelete: () => void;
  isDeleting: boolean;
}

export const DeleteTodoDialog: React.FC<DeleteTodoDialogProps> = ({
  todo,
  onDelete,
  isDeleting,
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <DeleteTodoButton onClick={(e) => e.stopPropagation()} />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>
            You are about to delete the todo: &quot;{todo.todo}&quot;. This
            action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
              }}
              className="text-black"
            >
              Cancel
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              className="bg-[var(--destructive)] text-white hover:bg-red-700"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              disabled={isDeleting}
              loading={isDeleting}
              loadingText="Deleting..."
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
