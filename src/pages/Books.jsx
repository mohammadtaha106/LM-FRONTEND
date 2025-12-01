import React, { useState } from "react";
import axiosInstance from "../lib/axios";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";

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
import DeleteBookButton from "../_components/DeleteBookButton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

function Books() {
const [search, setSearch] = useState('')
const [genre, setGenre] = useState('')
  const {
    data: books,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["books" , search, genre],
    queryFn: async () => {
      const params = new URLSearchParams();
      if(search) params.append('search', search);
      if(genre) params.append('genre', genre);
   const res = await axiosInstance.get("/books", {
  params: {
    ...(search && { search }),
    ...(genre && { genre }),
  },
});
return res.data;

    },
  });

const booksData = books || [];

const filteredBooks = booksData.filter(book => {
  // Genre filter
  if (genre && genre !== "all" && book.genre !== genre) return false;

  // Search filter
  if (search) {
    const lowerSearch = search.toLowerCase();
    if (
      !book.title.toLowerCase().includes(lowerSearch) &&
      !book.author.toLowerCase().includes(lowerSearch)
    ) {
      return false;
    }
  }

  return true;
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
      <div className="flex gap-4 mb-6">
  <Input 
    placeholder="Search by title or author..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="max-w-sm"
  />
  <Select value={genre} onValueChange={setGenre}>
    <SelectTrigger className="w-48">
      <SelectValue placeholder="Filter by genre" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="all">All Genres</SelectItem>
      <SelectItem value="Fiction">Fiction</SelectItem>
      <SelectItem value="Science">Science</SelectItem>
      <SelectItem value="History">History</SelectItem>
      <SelectItem value="Biography">Biography</SelectItem>
      <SelectItem value="Fantasy">Fantasy</SelectItem>
      <SelectItem value="Dystopian">Dystopian</SelectItem>
       <SelectItem value="Romance">Romance</SelectItem>
      {/* Add more genres */}
    </SelectContent>
  </Select>
</div>
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
  {filteredBooks?.map((book) => (
    <TableRow key={book._id}>
      <TableCell>{book.title}</TableCell>
      <TableCell>{book.author}</TableCell>
      <TableCell>{book.genre}</TableCell>
      <TableCell>{book.isbn}</TableCell>

      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <EditBookDialog book={book} />
          <DeleteBookButton bookId={book._id} />
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
