import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrderById, approveOrder, deliverOrder, cancelOrder } from '@/services/orderService';
import { Order, OrderStatus } from '@/types/order';
import { formatCurrency, formatDate } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  Loader2, 
  CheckCircle, 
  XCircle, 
  TruckIcon, 
  ShoppingBag, 
  Calendar, 
  User, 
  CreditCard 
} from 'lucide-react';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from '@/components/ui/alert-dialog';

const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      fetchOrder();
    }
  }, [id]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const data = await getOrderById(id!);
      setOrder(data);
    } catch (error) {
      console.error('Failed to fetch order:', error);
      toast({
        title: 'Error',
        description: 'Failed to load order details. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!order) return;
    try {
      setActionLoading(true);
      const updatedOrder = await approveOrder(order.id);
      setOrder(updatedOrder);
      toast({
        title: 'Order Approved',
        description: `Order #${order.id} has been approved successfully.`,
        variant: 'success',
      });
    } catch (error) {
      console.error('Failed to approve order:', error);
      toast({
        title: 'Error',
        description: 'Failed to approve order. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeliver = async () => {
    if (!order) return;
    try {
      setActionLoading(true);
      const updatedOrder = await deliverOrder(order.id);
      setOrder(updatedOrder);
      toast({
        title: 'Order Delivered',
        description: `Order #${order.id} has been marked as delivered.`,
        variant: 'success',
      });
    } catch (error) {
      console.error('Failed to deliver order:', error);
      toast({
        title: 'Error',
        description: 'Failed to mark order as delivered. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!order) return;
    try {
      setActionLoading(true);
      const updatedOrder = await cancelOrder(order.id);
      setOrder(updatedOrder);
      toast({
        title: 'Order Cancelled',
        description: `Order #${order.id} has been cancelled.`,
        variant: 'success',
      });
    } catch (error) {
      console.error('Failed to cancel order:', error);
      toast({
        title: 'Error',
        description: 'Failed to cancel order. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadgeVariant = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return 'outline';
      case 'approved':
        return 'secondary';
      case 'delivered':
        return 'success';
      case 'cancelled':
        return 'destructive';
      default:
        return 'default';
    }
  };

  const formatDateIfExists = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <p className="text-lg text-muted-foreground">Loading order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <XCircle className="h-16 w-16 text-destructive mb-4" />
        <h2 className="text-2xl font-bold mb-2">Order Not Found</h2>
        <p className="text-muted-foreground mb-6">The requested order could not be found.</p>
        <Button onClick={() => navigate('/dashboard/orders')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Orders
        </Button>
      </div>
    );
  }

  const canApprove = order.status === 'pending' && user?.id === order.seller_id;
  const canDeliver = order.status === 'approved' && user?.id === order.seller_id;
  const canCancel = ['pending', 'approved'].includes(order.status) && user?.id === order.buyer_id;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Order #{order.id}</h2>
          <p className="text-muted-foreground">
            Placed on {new Date(order.created_at).toLocaleDateString()}
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate('/dashboard/orders')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Orders
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Order Status Card */}
        <Card className="md:col-span-3">
          <CardHeader className="pb-2">
            <CardTitle>Order Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <Badge variant={getStatusBadgeVariant(order.status)} className="px-3 py-1.5 text-base">
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </Badge>
                <div>
                  <span className="text-sm text-muted-foreground mr-2">Order ID:</span>
                  <span className="font-medium">#{order.id}</span>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground mr-2">Placed:</span>
                  <span className="font-medium">{new Date(order.created_at).toLocaleString()}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {canApprove && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button disabled={actionLoading}>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Approve Order
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Approve Order</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to approve this order? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleApprove}>Approve</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
                
                {canDeliver && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button disabled={actionLoading}>
                        <TruckIcon className="mr-2 h-4 w-4" />
                        Mark as Delivered
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Mark as Delivered</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to mark this order as delivered? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeliver}>Confirm</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
                
                {canCancel && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" disabled={actionLoading}>
                        <XCircle className="mr-2 h-4 w-4" />
                        Cancel Order
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Cancel Order</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to cancel this order? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleCancel}>Confirm</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Order Details */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
            <CardDescription>Products and items in this order</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.product_data.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="capitalize">{item.type}</TableCell>
                    <TableCell className="text-right">{item.quantity}</TableCell>
                    <TableCell className="text-right">{formatCurrency(item.price)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(item.price * item.quantity)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            <div className="mt-6 space-y-2">
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatCurrency(order.total)}</span>
              </div>
              <Separator />
              <div className="flex justify-between py-2 font-bold">
                <span>Total</span>
                <span>{formatCurrency(order.total)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Order Information Card */}
        <Card>
          <CardHeader>
            <CardTitle>Information</CardTitle>
            <CardDescription>Customer and order details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-1 flex items-center">
                <User className="h-4 w-4 mr-1" /> Customer
              </h4>
              <p className="font-medium">{order.buyer?.name || `User #${order.buyer_id}`}</p>
              {order.buyer?.email && <p className="text-sm">{order.buyer.email}</p>}
            </div>
            
            <Separator />
            
            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-1 flex items-center">
                <User className="h-4 w-4 mr-1" /> Seller
              </h4>
              <p className="font-medium">{order.seller?.name || `User #${order.seller_id}`}</p>
              {order.seller?.email && <p className="text-sm">{order.seller.email}</p>}
            </div>
            
            <Separator />
            
            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-1 flex items-center">
                <Calendar className="h-4 w-4 mr-1" /> Order Timeline
              </h4>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span>Created:</span>
                  <span>{formatDateIfExists(order.created_at)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Approved:</span>
                  <span>{formatDateIfExists(order.approved_at)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivered:</span>
                  <span>{formatDateIfExists(order.delivered_at)}</span>
                </div>
                {order.cancelled_at && (
                  <div className="flex justify-between text-destructive">
                    <span>Cancelled:</span>
                    <span>{formatDateIfExists(order.cancelled_at)}</span>
                  </div>
                )}
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-1 flex items-center">
                <CreditCard className="h-4 w-4 mr-1" /> Payment
              </h4>
              <div className="font-medium">{formatCurrency(order.total)}</div>
              <p className="text-sm text-muted-foreground">Processed with cart checkout</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OrderDetailPage;
