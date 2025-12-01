import React from 'react'
import axiosInstance from '../lib/axios';
import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AddCopyDialog from '../_components/AddCopyDialog';
import UpdateCopyStatusDialog from '../_components/UpdateCopyStatusDialog';
import DeleteCopyButton from '../_components/DeleteCopyButton';
function Copies() {

    const { data: copies, isLoading, isError, refetch } = useQuery({
    queryKey: ['copies'],
    queryFn: async () => {
        const res = await axiosInstance.get('/copies');
        return res.data.copies;
    }})

   const copiesData = copies || [];
console.log(copiesData);
    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error loading copies.</div>;

  return (
    <>
    <div>
      <AddCopyDialog refetchCopies={refetch} />
    </div>
  <Table>
  <TableHeader>
    <TableRow>
      <TableHead>Barcode</TableHead>
      <TableHead>Book Title</TableHead>
      <TableHead>Status</TableHead>
      <TableHead>Actions</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {copies.map((copy) => (
      <TableRow key={copy._id}>
        <TableCell>{copy.barcode}</TableCell>
        <TableCell>{copy.bookId.title}</TableCell> {/* Populated */}
        <TableCell>
          <Badge>{copy.status}</Badge>
        </TableCell>
        <TableCell>
          <div className='flex gap-2'>
            <UpdateCopyStatusDialog copy={copy} />
            <DeleteCopyButton copyId={copy._id} />
          </div>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
</>
  )
}

export default Copies