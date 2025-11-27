import React from "react";
import axiosInstance from "../lib/axios";
import { useQuery } from "@tanstack/react-query";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import AddBookDialog from "../_components/AddBookDialog";
import EditBookDialog from "../_components/EditBookDialog";

function Books() {
  const {
    data: books,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["books"],
    queryFn: async () => {
      const res = await axiosInstance.get("/books");
      return res.data;
    },
  });

  if (isLoading) return <p>Loading books...</p>;
  if (isError) return <p>Error loading books</p>;

  return (
    <div className="w-full px-6 py-4">
      <h2 className="text-2xl font-semibold mb-4">Books List</h2>
      <div className="flex justify-between items-center mb-6">

  <AddBookDialog />
</div>

      <div className="w-full overflow-x-auto">
        <Table className="w-full">
          <TableCaption>A list of all books.</TableCaption>

          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Genre</TableHead>
              <TableHead>ISBN</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {books?.map((book) => (
              <TableRow key={book._id}>
                <TableCell>{book.title}</TableCell>
                <TableCell>{book.author}</TableCell>
                <TableCell>{book.genre}</TableCell>
                <TableCell>{book.isbn}</TableCell>

                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                   <EditBookDialog book={book} />
                    <Button size="sm" variant="destructive">Delete</Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default Books;
