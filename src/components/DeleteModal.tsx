"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteModalProps {
  open: boolean;
  title?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  open,
  title = "Delete Item",
  loading = false,
  onConfirm,
  onCancel,
}) => {
  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-[#333333]">{title}</DialogTitle>
        </DialogHeader>

        <div className="text-center p-4 text-[#D22727] bg-[#FEEBEE] rounded-lg w-full">
          <p className="flex justify-center"><img src="/icons/trash-bin.svg" alt="trash bin" /></p>


          <p className="">
            You’re about to delete this permanently. Once deleted, you cannot
            undo the action.
          </p>
        </div>

        <DialogFooter className="mt-4 w-full flex sm:justify-around">
          <Button className="bg-[#393939] hover:bg-[#393939] font-bold sm:px-6" onClick={onCancel} disabled={loading}>
            No, Cancel
          </Button>
          <Button variant="destructive" className="font-bold sm:px-6" onClick={onConfirm} disabled={loading}>
            {loading ? "Deleting..." : "Yes, Delete It"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteModal;
