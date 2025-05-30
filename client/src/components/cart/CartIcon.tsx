import React, { useState, useEffect } from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/components/providers/cart-provider';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export const CartIcon: React.FC = () => {
  const { cart, refreshCart } = useCart();
  const navigate = useNavigate();
  
  // Only do an initial refresh when the component mounts
  // The cart-provider handles regular refreshes on a longer interval
  useEffect(() => {
    // No need for constant refreshes as the localStorage is the source of truth
    // and we've already optimized the cartService to avoid unnecessary API calls
  }, []);

  const handleClick = () => {
    navigate('/cart');
  };

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={handleClick}
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
  );
};
