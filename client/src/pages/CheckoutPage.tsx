import React from 'react';
import { useCart } from '@/components/providers/cart-provider';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, CreditCard, ShoppingBag } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { formatCurrency } from '@/lib/utils';

const CheckoutPage: React.FC = () => {
  const { cart } = useCart();
  const navigate = useNavigate();

  const handleReturnToCart = () => {
    navigate('/cart');
  };

  if (cart.items.length === 0) {
    return (
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Checkout</h1>
        <Card className="text-center py-12">
          <CardContent>
            <div className="flex flex-col items-center space-y-4">
              <ShoppingBag className="h-12 w-12 text-muted-foreground" />
              <CardTitle>Your cart is empty</CardTitle>
              <CardDescription>You need to add items to your cart before checking out.</CardDescription>
              <Button onClick={() => navigate('/products')} className="mt-4">
                Browse Products
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Payment Information</CardTitle>
              <CardDescription>Enter your payment details to complete your purchase</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center p-12">
                <div className="flex flex-col items-center space-y-4 text-center">
                  <CreditCard className="h-12 w-12 text-muted-foreground" />
                  <CardTitle className="text-xl">Payment Processing Coming Soon</CardTitle>
                  <CardDescription>
                    This is a demo checkout page. In a real application, payment processing would be implemented here.
                  </CardDescription>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handleReturnToCart}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Cart
              </Button>
              <Button onClick={() => alert('This is a demo - payment would be processed here')}>
                Complete Purchase
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
              <CardDescription>
                {cart.totalItems} {cart.totalItems === 1 ? 'item' : 'items'} in your cart
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <div className="flex-1">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {item.quantity} × {formatCurrency(item.price)}
                      </div>
                    </div>
                    <div className="font-medium">
                      {formatCurrency(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
                
                <Separator />
                
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatCurrency(cart.subtotal)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                
                <Separator />
                
                <div className="flex justify-between font-medium text-lg">
                  <span>Total</span>
                  <span>{formatCurrency(cart.subtotal)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
