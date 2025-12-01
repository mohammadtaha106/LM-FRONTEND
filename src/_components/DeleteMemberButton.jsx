import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import axiosInstance from '../lib/axios';

function DeleteMemberButton({ memberId }) {
    const [open, setOpen] = useState(false);
    const queryClient = useQueryClient();

    //console.log("Member ID to delete:", memberId);

    const mutation = useMutation({
        mutationKey: ['deleteMember'],
        mutationFn: async () => {
            const res = await axiosInstance.delete(`/members/${memberId}`);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['members'] });
            setOpen(false);
        },
    });
    const handleDelete = () => {
        mutation.mutate();
    };

  return (
       <Dialog open={open} onOpenChange={setOpen}>
         <DialogTrigger asChild>
           <Button variant="destructive" size="sm">
             Delete
           </Button>
         </DialogTrigger>
   
         <DialogContent className="sm:max-w-[400px]">
           <DialogHeader>
             <DialogTitle>Delete Member</DialogTitle>
             <DialogDescription>
               Are you sure you want to delete this copy? This action cannot be undone.
             </DialogDescription>
           </DialogHeader>
   
           <div className="flex justify-end gap-2 pt-4">
             <Button
               variant="outline"
               onClick={() => setOpen(false)}
             >
               Cancel
             </Button>
             <Button
               variant="destructive"
               onClick={handleDelete}
               disabled={mutation.isLoading}
             >
               {mutation.isLoading ? 'Deleting...' : 'Delete'}
             </Button>
           </div>
         </DialogContent>
       </Dialog>
  )
}

export default DeleteMemberButton