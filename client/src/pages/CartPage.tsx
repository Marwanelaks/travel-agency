import React, { useEffect } from 'react';
import { useCart } from '@/components/providers/cart-provider';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { MinusCircle, PlusCircle, Trash2, ArrowLeft, ShoppingBag } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { formatCurrency } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';

const CartPage: React.FC = () => {
  const { cart, isLoading, updateItem, removeItem, emptyCart, refreshCart } = useCart();
  const navigate = useNavigate();

  // Refresh cart on page load
  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const handleUpdateQuantity = async (itemId: string, currentQuantity: number, change: number) => {
    try {
      const newQuantity = Math.max(0, currentQuantity + change);
      await updateItem(itemId, newQuantity);
    } catch (error) {
      console.error('Error updating quantity:', error);
      // Error is already handled in the cart provider
    }
  };

  const handleContinueShopping = () => {
    navigate('/products');
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (isLoading) {
    return (
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <Skeleton className="h-8 w-32" />
              </CardHeader>
              <CardContent className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <Skeleton className="h-20 w-20 rounded-md" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-40" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <Skeleton className="h-10 w-32" />
                    <Skeleton className="h-10 w-24" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
          <div>
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
      
      {cart.items.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <div className="flex flex-col items-center space-y-4">
              <ShoppingBag className="h-12 w-12 text-muted-foreground" />
              <CardTitle>Your cart is empty</CardTitle>
              <CardDescription>Looks like you haven't added any items to your cart yet.</CardDescription>
              <Button onClick={handleContinueShopping} className="mt-4">
                Continue Shopping
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Items ({cart.totalItems})</CardTitle>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={async (e) => {
                    e.preventDefault();
                    try {
                      await emptyCart();
                    } catch (error) {
                      console.error('Error clearing cart:', error);
                      // Error is already handled in the cart provider
                    }
                  }}
                  className="flex items-center gap-1"
                >
                  <Trash2 className="h-4 w-4" />
                  Clear Cart
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {cart.items.map((item) => (
                    <div key={item.id}>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <div className="w-20 h-20 rounded-md overflow-hidden bg-muted flex-shrink-0">
                          {item.image ? (
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              className="w-full h-full object-cover" 
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-muted">
                              <ShoppingBag className="h-8 w-8 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                          </p>
                          <p className="text-sm font-medium">{formatCurrency(item.price)}</p>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity, -1)}
                            disabled={item.quantity <= 1}
                            aria-label="Decrease quantity"
                          >
                            <MinusCircle className="h-4 w-4" />
                          </Button>
                          
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={async (e) => {
                              e.preventDefault();
                              const value = parseInt(e.target.value, 10);
                              if (!isNaN(value) && value >= 0) {
                                try {
                                  await updateItem(item.id, value);
                                } catch (error) {
                                  console.error('Error updating item quantity:', error);
                                  // Error is already handled in the cart provider
                                }
                              }
                            }}
                            className="w-16 text-center"
                            aria-label="Quantity"
                          />
                          
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity, 1)}
                            aria-label="Increase quantity"
                          >
                            <PlusCircle className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="text-right min-w-[100px]">
                          <div className="font-medium">{formatCurrency(item.price * item.quantity)}</div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2 text-muted-foreground hover:text-foreground"
                            onClick={async (e) => {
                              e.preventDefault();
                              try {
                                await removeItem(item.id);
                              } catch (error) {
                                console.error('Error removing item:', error);
                                // Error is already handled in the cart provider
                              }
                            }}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Remove
                          </Button>
                        </div>
                      </div>
                      <Separator className="mt-4" />
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline" 
                  className="flex items-center gap-1"
                  onClick={handleContinueShopping}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Continue Shopping
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatCurrency(cart.subtotal)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-medium text-lg">
                    <span>Total</span>
                    <span>{formatCurrency(cart.subtotal)}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={handleCheckout}>
                  Proceed to Checkout
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
