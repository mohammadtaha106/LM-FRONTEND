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

function AddBookDialog() {
  const [open, setOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    genre: "",
    isbn: "",
    publisher: "",
    publicationYear: "",
    author: "",
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (newBook) => {
      const res = await axiosInstance.post("/books", newBook);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      setOpen(false);
      setFormData({
        title: "",
        genre: "",
        isbn: "",
        publisher: "",
        publicationYear: "",
        author: "",
      });
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
        <Button>Add Book</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Book</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="grid gap-2">
            <Label>Title</Label>
            <Input
              name="title"
              placeholder="Harry Potter"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label>Author</Label>
            <Input
              name="author"
              placeholder="J.K. Rowling"
              value={formData.author}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label>Genre</Label>
            <Input
              name="genre"
              placeholder="Fantasy / Fiction"
              value={formData.genre}
              onChange={handleChange}
            />
          </div>

          <div className="grid gap-2">
            <Label>ISBN</Label>
            <Input
              name="isbn"
              placeholder="978-0439708180"
              value={formData.isbn}
              onChange={handleChange}
            />
          </div>

          <div className="grid gap-2">
            <Label>Publisher</Label>
            <Input
              name="publisher"
              placeholder="Bloomsbury"
              value={formData.publisher}
              onChange={handleChange}
            />
          </div>

          <div className="grid gap-2">
            <Label>Publication Year</Label>
            <Input
              name="publicationYear"
              type="number"
              placeholder="1997"
              value={formData.publicationYear}
              onChange={handleChange}
            />
          </div>

          <DialogFooter>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Saving..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AddBookDialog;
