import React, { useState } from "react";
import axiosInstance from "../lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function EditBookDialog({ book }) {
  const [open, setOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: book.title || "",
    genre: book.genre || "",
    isbn: book.isbn || "",
    publisher: book.publisher || "",
    publicationYear: book.publicationYear || "",
    author: book.author || "",
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (updatedBook) => {
      const res = await axiosInstance.put(`/books/${book._id}`, updatedBook);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] }); // Refresh list
      setOpen(false);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Edit
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Book</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="grid gap-2">
            <Label>Title</Label>
            <Input
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label>Author</Label>
            <Input
              name="author"
              value={formData.author}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label>Genre</Label>
            <Input name="genre" value={formData.genre} onChange={handleChange} />
          </div>

          <div className="grid gap-2">
            <Label>ISBN</Label>
            <Input name="isbn" value={formData.isbn} onChange={handleChange} />
          </div>

          <div className="grid gap-2">
            <Label>Publisher</Label>
            <Input
              name="publisher"
              value={formData.publisher}
              onChange={handleChange}
            />
          </div>

          <div className="grid gap-2">
            <Label>Publication Year</Label>
            <Input
              name="publicationYear"
              type="number"
              value={formData.publicationYear}
              onChange={handleChange}
            />
          </div>

          <DialogFooter>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Updating..." : "Update"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default EditBookDialog;
