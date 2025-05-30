import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { User } from '@/types/user';
import { getManagedSellers, getManagedSellerOrders } from '@/services/userService';
import { UserPlusIcon, ShoppingCartIcon, SettingsIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DataTable } from '@/components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { formatDate } from '@/lib/utils';
import CustomPagination from '@/components/ui/custom-pagination';

const SubSuperAdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [sellers, setSellers] = useState<User[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      if (user?.id) {
        try {
          const fetchedSellers = await getManagedSellers(user.id);
          setSellers(fetchedSellers);
          
          const ordersData = await getManagedSellerOrders(user.id, currentPage);
          setOrders(ordersData.data);
          setTotalPages(Math.ceil(ordersData.total / ordersData.per_page));
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [user?.id, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const sellerColumns: ColumnDef<User>[] = [
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
        <div className="flex space-x-2">
          <Link to={`/dashboard/sellers/${row.original.id}`}>
            <Button variant="outline" size="sm">View</Button>
          </Link>
        </div>
      ),
    },
  ];

  const orderColumns: ColumnDef<any>[] = [
    {
      accessorKey: 'id',
      header: 'Order ID',
    },
    {
      accessorKey: 'buyer.name',
      header: 'Customer',
      cell: ({ row }) => row.original.buyer?.name || 'Unknown',
    },
    {
      accessorKey: 'seller.name',
      header: 'Seller',
      cell: ({ row }) => row.original.seller?.name || 'Unknown',
    },
    {
      accessorKey: 'total',
      header: 'Amount',
      cell: ({ row }) => `$${row.original.total.toFixed(2)}`,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <div className={`capitalize badge badge-${getStatusColor(row.original.status)}`}>
          {row.original.status}
        </div>
      ),
    },
    {
      accessorKey: 'created_at',
      header: 'Date',
      cell: ({ row }) => formatDate(row.original.created_at || ''),
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <Link to={`/dashboard/orders/${row.original.id}`}>
          <Button variant="outline" size="sm">View</Button>
        </Link>
      ),
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'warning';
      case 'approved':
        return 'success';
      case 'cancelled':
      case 'canceled':
        return 'error';
      case 'delivered':
        return 'info';
      default:
        return 'secondary';
    }
  };

  if (loading) {
    return <div className="p-8">Loading dashboard data...</div>;
  }

  return (
    <div className="p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Sub-Super Admin Dashboard</CardTitle>
          <CardDescription>
            {user?.department 
              ? `Manage sellers and orders for the ${user.department} department` 
              : 'Manage your assigned sellers and their orders'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Sellers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{sellers.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{orders.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-2">
                  <Link to="/dashboard/sellers/add">
                    <Button size="sm" variant="outline">
                      <UserPlusIcon className="h-4 w-4 mr-2" />
                      Add Seller
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="sellers">
            <TabsList>
              <TabsTrigger value="sellers">Managed Sellers</TabsTrigger>
              <TabsTrigger value="orders">Recent Orders</TabsTrigger>
            </TabsList>
            
            <TabsContent value="sellers" className="mt-4">
              {sellers.length > 0 ? (
                <DataTable 
                  columns={sellerColumns} 
                  data={sellers} 
                  searchKey="name"
                />
              ) : (
                <Alert>
                  <AlertTitle>No sellers found</AlertTitle>
                  <AlertDescription>
                    You don't have any assigned sellers yet. Add your first seller to get started.
                  </AlertDescription>
                </Alert>
              )}
            </TabsContent>
            
            <TabsContent value="orders" className="mt-4">
              {orders.length > 0 ? (
                <>
                  <DataTable 
                    columns={orderColumns} 
                    data={orders} 
                    searchKey="buyer.name"
                  />
                  <div className="mt-4 flex justify-center">
                    <CustomPagination 
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />
                  </div>
                </>
              ) : (
                <Alert>
                  <AlertTitle>No orders found</AlertTitle>
                  <AlertDescription>
                    There are no orders from your managed sellers yet.
                  </AlertDescription>
                </Alert>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubSuperAdminDashboard;
