import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from '@/types/user';
import { getUsers, assignSellerToManager, removeSellerFromManager } from '@/services/userService';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { CheckIcon, XIcon, UserPlusIcon } from 'lucide-react';
import { DataTable } from '@/components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { formatDate } from '@/lib/utils';
import { toast } from '@/components/ui/use-toast';

const ManageSellersPage: React.FC = () => {
  const { user } = useAuth();
  const [allSellers, setAllSellers] = useState<User[]>([]);
  const [managedSellers, setManagedSellers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Get all users with the role "Seller"
        const users = await getUsers();
        const sellers = users.filter(user => user.role === 'Seller');
        setAllSellers(sellers);

        // Filter out sellers that are already managed by the current sub-super admin
        const managed = sellers.filter(seller => seller.manager_id === user?.id);
        setManagedSellers(managed);
      } catch (error) {
        console.error('Error fetching sellers:', error);
        toast({
          title: 'Error',
          description: 'Failed to load sellers. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchData();
    }
  }, [user?.id]);

  const assignSeller = async (sellerId: string) => {
    if (!user?.id) return;

    try {
      await assignSellerToManager(sellerId, user.id);
      
      // Update the local state to reflect the changes
      setAllSellers(prevSellers => 
        prevSellers.map(seller => 
          seller.id === sellerId ? { ...seller, manager_id: user.id } : seller
        )
      );
      
      // Add to managed sellers
      const updatedSeller = allSellers.find(seller => seller.id === sellerId);
      if (updatedSeller) {
        setManagedSellers(prev => [...prev, { ...updatedSeller, manager_id: user.id }]);
      }
      
      toast({
        title: 'Success',
        description: 'Seller has been assigned to you successfully.',
      });
    } catch (error) {
      console.error('Error assigning seller:', error);
      toast({
        title: 'Error',
        description: 'Failed to assign seller. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const removeSeller = async (sellerId: string) => {
    try {
      await removeSellerFromManager(sellerId);
      
      // Update the local state to reflect the changes
      setAllSellers(prevSellers => 
        prevSellers.map(seller => 
          seller.id === sellerId ? { ...seller, manager_id: undefined } : seller
        )
      );
      
      // Remove from managed sellers
      setManagedSellers(prev => prev.filter(seller => seller.id !== sellerId));
      
      toast({
        title: 'Success',
        description: 'Seller has been removed from your management.',
      });
    } catch (error) {
      console.error('Error removing seller:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove seller. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const unassignedSellerColumns: ColumnDef<User>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorKey: 'created_at',
      header: 'Created At',
      cell: ({ row }) => formatDate(row.original.created_at || ''),
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="sm">
              <UserPlusIcon className="h-4 w-4 mr-2" />
              Assign
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Assign Seller</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to assign {row.original.name} to your management?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => assignSeller(row.original.id)}>
                Assign
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ),
    },
  ];

  const managedSellerColumns: ColumnDef<User>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorKey: 'created_at',
      header: 'Created At',
      cell: ({ row }) => formatDate(row.original.created_at || ''),
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="sm">
              <XIcon className="h-4 w-4 mr-2" />
              Remove
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Remove Seller</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to remove {row.original.name} from your management?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => removeSeller(row.original.id)}>
                Remove
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ),
    },
  ];

  // Filter out sellers that are already managed
  const unassignedSellers = allSellers.filter(
    seller => !seller.manager_id || seller.manager_id !== user?.id
  );

  if (loading) {
    return <div className="p-8">Loading sellers data...</div>;
  }

  return (
    <div className="p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Manage Sellers</CardTitle>
          <CardDescription>
            Assign and manage sellers for your department
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Your Assigned Sellers</h3>
            {managedSellers.length > 0 ? (
              <DataTable 
                columns={managedSellerColumns} 
                data={managedSellers} 
                searchKey="name" 
              />
            ) : (
              <p className="text-muted-foreground">You don't have any assigned sellers yet.</p>
            )}
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Available Sellers</h3>
            {unassignedSellers.length > 0 ? (
              <DataTable 
                columns={unassignedSellerColumns} 
                data={unassignedSellers} 
                searchKey="name" 
              />
            ) : (
              <p className="text-muted-foreground">No available sellers to assign.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManageSellersPage;
