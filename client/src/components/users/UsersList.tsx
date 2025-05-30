import React, { useEffect, useState } from 'react';
import { useUsers } from '@/hooks/useUsers';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2, Edit, Trash2, UserPlus, UserX, UserCheck } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { User } from '@/services/userService';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const UsersList: React.FC = () => {
  const { users, loading, error, fetchUsers, removeUser, toggleStatus } = useUsers();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers().catch(console.error);
  }, [fetchUsers]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    
    setDeletingId(id);
    try {
      await removeUser(id);
      toast({
        title: 'Success',
        description: 'User deleted successfully',
        variant: 'default',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete user',
        variant: 'destructive',
      });
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleStatus = async (user: User) => {
    setTogglingId(user.id);
    try {
      await toggleStatus(user.id);
      toast({
        title: 'Success',
        description: `User ${user.email_verified_at ? 'deactivated' : 'activated'} successfully`,
        variant: 'default',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update user status',
        variant: 'destructive',
      });
    } finally {
      setTogglingId(null);
    }
  };

  if (loading && !users.length) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <h3 className="text-sm font-medium text-red-800">Error loading users</h3>
        <p className="mt-2 text-sm text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">User Management</h2>
        <Button onClick={() => navigate('/users/new')}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              Array.isArray(users) && users.filter(Boolean).map((user) => (
                <TableRow key={user?.id ?? Math.random()}>
                  <TableCell className="font-medium">{user?.name ?? ''}</TableCell>
                  <TableCell>{user?.email ?? ''}</TableCell>
                  <TableCell>
                    <Badge variant={user?.role === 'admin' ? 'default' : 'secondary'}>
                      {user?.role ?? ''}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.email_verified_at ? 'success' : 'destructive'}>
                      {user.email_verified_at ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {user.created_at ? format(new Date(user.created_at), 'PPpp') : 'N/A'}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => navigate(`/users/${user.id}/edit`)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleToggleStatus(user)}
                      disabled={togglingId === user.id}
                    >
                      {togglingId === user.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : user.email_verified_at ? (
                        <UserX className="h-4 w-4 text-yellow-500" />
                      ) : (
                        <UserCheck className="h-4 w-4 text-green-500" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(user.id)}
                      disabled={deletingId === user.id}
                    >
                      {deletingId === user.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4 text-red-500" />
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default UsersList;
