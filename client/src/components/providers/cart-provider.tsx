import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Cart, CartItem, AddToCartRequest, UpdateCartItemRequest } from '@/types/cart';
import { useToast } from '@/components/ui/use-toast';
import { 
  getCart, 
  addToCart, 
  updateCartItem, 
  removeCartItem, 
  clearCart 
} from '@/services/cartService';

// Define the cart storage key to match the one in cartService
const CART_STORAGE_KEY = 'travel_agency_cart';

// Default empty cart
const defaultCart: Cart = {
  id: '',
  userId: null,
  items: [],
  totalItems: 0,
  subtotal: 0,
  createdAt: '',
  updatedAt: ''
};

interface CartContextType {
  cart: Cart;
  isLoading: boolean;
  addItem: (productId: string, quantity: number) => Promise<void>;
  updateItem: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  emptyCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<Cart>(defaultCart);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Load cart on initial render
  useEffect(() => {
    fetchCart();
    
    // Set up a less frequent refresh interval to avoid excessive API calls
    // This is especially important when API endpoints are not yet implemented
    const refreshInterval = setInterval(() => {
      // Check localStorage version timestamp before refreshing
      const storedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (storedCart) {
        try {
          const parsedCart = JSON.parse(storedCart);
          // Only refresh if our local cart is older than 5 minutes
          const lastUpdated = new Date(parsedCart.updatedAt).getTime();
          const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
          
          if (lastUpdated < fiveMinutesAgo) {
            fetchCart();
          }
        } catch (e) {
          // If parsing fails, refresh the cart
          fetchCart();
        }
      }
    }, 300000); // 5 minutes
    
    return () => clearInterval(refreshInterval);
  }, []);

  const fetchCart = async () => {
    try {
      setIsLoading(true);
      const cartData = await getCart();
      setCart(cartData);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
      toast({
        title: 'Error',
        description: 'Failed to load your cart. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addItem = async (productId: string, quantity: number) => {
    try {
      setIsLoading(true);
      const request: AddToCartRequest = { productId, quantity };
      const updatedCart = await addToCart(request);
      setCart(updatedCart);
      toast({
        title: 'Added to cart',
        description: `Item added to your cart successfully.`,
      });
    } catch (error) {
      console.error('Failed to add item to cart:', error);
      toast({
        title: 'Error',
        description: 'Failed to add item to cart. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateItem = async (itemId: string, quantity: number) => {
    try {
      setIsLoading(true);
      const request: UpdateCartItemRequest = { itemId, quantity };
      const updatedCart = await updateCartItem(request);
      setCart(updatedCart);
      
      if (quantity === 0) {
        toast({
          title: 'Item removed',
          description: 'Item removed from your cart.',
        });
      } else {
        toast({
          title: 'Cart updated',
          description: 'Your cart has been updated.',
        });
      }
    } catch (error) {
      console.error('Failed to update cart item:', error);
      toast({
        title: 'Error',
        description: 'Failed to update cart. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      setIsLoading(true);
      const updatedCart = await removeCartItem(itemId);
      setCart(updatedCart);
      toast({
        title: 'Item removed',
        description: 'Item removed from your cart.',
      });
    } catch (error) {
      console.error('Failed to remove item from cart:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove item. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const emptyCart = async () => {
    try {
      setIsLoading(true);
      const updatedCart = await clearCart();
      setCart(updatedCart);
      toast({
        title: 'Cart cleared',
        description: 'Your cart has been cleared.',
      });
    } catch (error) {
      console.error('Failed to clear cart:', error);
      toast({
        title: 'Error',
        description: 'Failed to clear cart. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const refreshCart = async () => {
    await fetchCart();
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        addItem,
        updateItem,
        removeItem,
        emptyCart,
        refreshCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
