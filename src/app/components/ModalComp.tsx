"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ModalProps {
  header?: string;
  desc?: string;
  children?: React.ReactNode;
  open?: boolean;
  onClose: () => void;
  onSave?: () => void;
  saveText?: string;
  loading?: boolean;
  saveIcon?: React.ReactNode;
  actionType?: "create" | "update" | "delete";
}

const ModalComp: React.FC<ModalProps> = ({
  header,
  desc,
  children,
  open,
  onClose,
  onSave,
  saveText,
  loading,
  actionType,
  saveIcon,
}) => {
  return (
    <Dialog open={open} onOpenChange={(state) => !state && onClose()}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>{header || "Modal Title"}</DialogTitle>
          {desc && <DialogDescription>{desc}</DialogDescription>}
        </DialogHeader>

        <div className="py-2">{children}</div>

        <DialogFooter>
          {onClose && (
            <DialogClose asChild>
              <Button
                variant="outline"
                className="cursor-pointer"
                onClick={onClose}>
                Cancel
              </Button>
            </DialogClose>
          )}

          {onSave && (
            <Button
              className={`text-white cursor-pointer ${
                actionType === "delete" ? "bg-red-600 hover:bg-red-700" : ""
              }`}
              disabled={loading}
              // variant={""}
              onClick={onSave}>
              {saveIcon}
              {loading ? "Loading..." : saveText}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalComp;
