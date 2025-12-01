import React, { useState } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import axiosInstance from '../lib/axios';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import AddMemberDialog from '../_components/AddMemberDialog';
import EditMemberDialog from '../_components/EditMemberDialog';
import DeleteMemberButton from '../_components/DeleteMemberButton';


function Members() {
  const queryClient = useQueryClient();

  const { data: members, isLoading, isError, refetch } = useQuery({
    queryKey: ['members'],
    queryFn: async () => {
      const res = await axiosInstance.get('/members');
      return res.data;
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading members.</div>;

  return (
    <div className="space-y-4">
      {/* Header with Add Member */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Members</h1>
        <AddMemberDialog refetchMembers={refetch} />
      </div>

      {/* Members Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Borrowing Limit</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => (
            <TableRow key={member._id}>
              <TableCell>{member.name}</TableCell>
              <TableCell>{member.email}</TableCell>
              <TableCell>{member.phone}</TableCell>
              <TableCell>
                <Badge variant="secondary">{member.role}</Badge>
              </TableCell>
              <TableCell>{member.borrowingLimit}</TableCell>
              <TableCell className="flex gap-2">
                {/* Edit Member Dialog */}
                <EditMemberDialog member={member} refetchMembers={refetch} />

                {/* Delete Member Button */}
              <DeleteMemberButton memberId={member._id} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default Members;
