import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import axiosInstance from "../lib/axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function UpdateCopyStatusDialog({ copy }) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState(copy.status);

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (updatedStatus) => {
      const res = await axiosInstance.put(`/copies/${copy._id}`, {
        status: updatedStatus,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["copies"] });
      setOpen(false);
    },
  });

  const handleUpdateStatus = () => {
    mutation.mutate(status);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Update Status
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Copy Status</DialogTitle>
          <DialogDescription>
            Change the status of this book copy.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Available">Available</SelectItem>
                <SelectItem value="Issued">Issued</SelectItem>
                <SelectItem value="Lost">Lost</SelectItem>
                <SelectItem value="Damaged">Damaged</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleUpdateStatus}
            disabled={mutation.isLoading}
            className="w-full"
          >
            {mutation.isLoading ? "Updating..." : "Update Status"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default UpdateCopyStatusDialog;
