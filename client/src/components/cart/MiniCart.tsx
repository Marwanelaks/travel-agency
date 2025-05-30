import React from 'react';
import { ShoppingCart, X, Trash2 } from 'lucide-react';
import { useCart } from '@/components/providers/cart-provider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '@/lib/utils';

export const MiniCart: React.FC = () => {
  const { cart, removeItem, emptyCart } = useCart();
  const navigate = useNavigate();

  const handleViewCart = () => {
    navigate('/cart');
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative"
          aria-label={`View cart with ${cart.totalItems} items`}
        >
          <ShoppingCart className="h-5 w-5" />
          {cart.totalItems > 0 && (
            <Badge 
              className="absolute -top-2 -right-2 px-1.5 py-0.5 min-w-[1.25rem] h-5 flex items-center justify-center bg-primary text-primary-foreground rounded-full"
            >
              {cart.totalItems}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" align="end">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Your Cart</span>
          {cart.totalItems > 0 && (
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5 p-0"
              onClick={() => emptyCart()}
              aria-label="Empty cart"
            >
              <Trash2 className="h-4 w-4 text-muted-foreground" />
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {cart.items.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            Your cart is empty
          </div>
        ) : (
          <>
            <div className="max-h-64 overflow-y-auto">
              {cart.items.slice(0, 4).map((item) => (
                <DropdownMenuItem key={item.id} className="py-2 flex justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-muted rounded overflow-hidden">
                      {item.image && (
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover" 
                        />
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium truncate max-w-[120px]">
                        {item.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {item.quantity} × {formatCurrency(item.price)}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeItem(item.id);
                    }}
                    aria-label={`Remove ${item.name} from cart`}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </DropdownMenuItem>
              ))}
              
              {cart.items.length > 4 && (
                <DropdownMenuItem className="py-2 text-center text-sm text-muted-foreground">
                  +{cart.items.length - 4} more items
                </DropdownMenuItem>
              )}
            </div>
            
            <DropdownMenuSeparator />
            
            <div className="p-4">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Subtotal:</span>
                <span className="text-sm font-medium">{formatCurrency(cart.subtotal)}</span>
              </div>
              <div className="space-y-2">
                <Button 
                  className="w-full" 
                  size="sm" 
                  variant="outline"
                  onClick={handleViewCart}
                >
                  View Cart
                </Button>
                <Button 
                  className="w-full" 
                  size="sm"
                  onClick={handleCheckout}
                >
                  Checkout
                </Button>
              </div>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
