import { useState } from "react";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import axiosInstance from "../lib/axios";

export default function AddCopyDialog() {
  const [selectedBook, setSelectedBook] = useState("");
  const [barcode, setBarcode] = useState("");
  const [open, setOpen] = useState(false);
  const [bookOpen, setBookOpen] = useState(false);

  const queryClient = useQueryClient();

  const { data: books, isLoading } = useQuery({
    queryKey: ["books"],
    queryFn: async () => {
      const res = await axiosInstance.get("/books");
      return res.data || [];  // Fix: always return array
    },
  });

  const mutation = useMutation({
    mutationFn: async (newCopy) => {
      const res = await axiosInstance.post("/copies", newCopy);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["copies"]);
      setOpen(false);
      setSelectedBook("");
      setBarcode("");
    },
  });

  const handleAddCopy = () => {
    if (!selectedBook || !barcode) return;
    mutation.mutate({
      bookId: selectedBook,
      barcode,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Copy</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Copy</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
        
          <div>
            <Label>Select Book</Label>
            <Popover open={bookOpen} onOpenChange={setBookOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={bookOpen}
                  className="w-full justify-between"
                >
                  {selectedBook
                    ? books?.find((book) => book._id === selectedBook)?.title
                    : "Select book..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Search books..." />
                  <CommandEmpty>No book found.</CommandEmpty>
                  <CommandGroup>
                    {books?.map((book) => (
                      <CommandItem
                        key={book._id}
                        value={book.title}
                        onSelect={() => {
                          setSelectedBook(book._id);
                          setBookOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedBook === book._id ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {book.title}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* Barcode Input */}
          <div>
            <Label>Barcode</Label>
            <Input
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              placeholder="Enter barcode"
            />
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleAddCopy}
            disabled={!selectedBook || !barcode || mutation.isPending}
            className="w-full"
          >
            {mutation.isPending ? "Adding..." : "Add Copy"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}