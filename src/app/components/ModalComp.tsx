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
  children: React.ReactNode;
  open: boolean;
  onClose: () => void;
  onSave?: () => void;
  saveText?: string;
  loading?: boolean;
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
          <DialogClose asChild>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </DialogClose>

          <Button
            className="text-white cursor-pointer"
            disabled={loading}
            onClick={onSave}>
            {loading ? "Loading..." : saveText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalComp;
