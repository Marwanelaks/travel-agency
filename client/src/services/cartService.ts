import api from './api';
import { Cart, CartItem, AddToCartRequest, UpdateCartItemRequest } from '@/types/cart';
import { Product } from '@/types/product';

const CART_API = '/cart';
const CART_STORAGE_KEY = 'travel_agency_cart';

// Set this to false if you want to attempt API calls
// Set to true to use only localStorage and skip API calls
const USE_LOCAL_STORAGE_ONLY = true;

// Track if the API is available to avoid excessive failed calls
let isApiAvailable = !USE_LOCAL_STORAGE_ONLY;

// Mock cart for development purposes
let mockCart: Cart = {
  id: 'local-cart',
  userId: null,
  items: [],
  totalItems: 0,
  subtotal: 0,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

// Initialize cart from localStorage if available
const initializeCart = (): void => {
  try {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      mockCart = JSON.parse(savedCart);
    }
  } catch (error) {
    console.error('Failed to initialize cart from localStorage:', error);
  }
};

// Save cart to localStorage
const saveCartToStorage = (): void => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(mockCart));
  } catch (error) {
    console.error('Failed to save cart to localStorage:', error);
  }
};

// Initialize cart on module load
initializeCart();

// Calculate cart totals
const calculateCartTotals = (): void => {
  mockCart.totalItems = mockCart.items.reduce((total, item) => total + item.quantity, 0);
  mockCart.subtotal = mockCart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  mockCart.updatedAt = new Date().toISOString();
};

/**
 * Get the current cart
 */
export const getCart = async (): Promise<Cart> => {
  // If we're using local storage only or we already know the API is not available,
  // skip the API call and return the local cart directly
  if (USE_LOCAL_STORAGE_ONLY || !isApiAvailable) {
    return mockCart;
  }

  try {
    // Try to get cart from API
    try {
      const response = await api.get(CART_API);
      if (response.data) {
        // Update the mockCart with the server data
        // This ensures localStorage stays in sync with the server
        mockCart = response.data;
        saveCartToStorage();
        return response.data;
      }
    } catch (apiError: any) {
      // If we get a 404, mark the API as unavailable to avoid future calls
      if (apiError.response && apiError.response.status === 404) {
        console.log('Cart API not available, switching to local storage only');
        isApiAvailable = false;
      } else {
        console.log('API getCart failed, using local storage');
      }
      // Continue to fallback
    }
    
    // Return mock cart
    return mockCart;
  } catch (error) {
    console.error('Error fetching cart:', error);
    return mockCart;
  }
};

/**
 * Add an item to the cart
 */
export const addToCart = async (request: AddToCartRequest): Promise<Cart> => {
  try {
    // Only try API if it's available
    if (!USE_LOCAL_STORAGE_ONLY && isApiAvailable) {
      try {
        const response = await api.post(`${CART_API}/items`, request);
        if (response.data) {
          // Update local cart with server data
          mockCart = response.data;
          saveCartToStorage();
          return response.data;
        }
      } catch (apiError: any) {
        // If we get a 404, mark the API as unavailable to avoid future calls
        if (apiError.response && apiError.response.status === 404) {
          console.log('Cart API not available, switching to local storage only');
          isApiAvailable = false;
        } else {
          console.log('API addToCart failed, using local storage');
        }
        // Continue to fallback
      }
    }
    
    // Mock implementation
    const { productId, quantity } = request;
    
    // Check if product already exists in cart
    const existingItemIndex = mockCart.items.findIndex(item => item.productId === productId);
    
    if (existingItemIndex >= 0) {
      // Update quantity if product already in cart
      mockCart.items[existingItemIndex].quantity += quantity;
    } else {
      // Fetch product details
      try {
        const productResponse = await api.get(`/products/${productId}`);
        const product = productResponse.data.data || productResponse.data;
        
        // Add new item to cart
        const newItem: CartItem = {
          id: `item-${Date.now()}`,
          productId,
          name: product.name,
          price: product.price,
          quantity,
          image: product.image,
          type: product.type,
          dateAdded: new Date().toISOString()
        };
        
        mockCart.items.push(newItem);
      } catch (productError) {
        // If API fails, try to create item with minimal info
        console.log('Failed to get product details, creating minimal cart item');
        
        const newItem: CartItem = {
          id: `item-${Date.now()}`,
          productId,
          name: 'Product',
          price: 0,
          quantity,
          image: '',
          type: 'other',
          dateAdded: new Date().toISOString()
        };
        
        mockCart.items.push(newItem);
      }
    }
    
    // Recalculate totals and save
    calculateCartTotals();
    saveCartToStorage();
    
    return { ...mockCart };
  } catch (error) {
    console.error('Error adding item to cart:', error);
    throw error;
  }
};

/**
 * Update cart item quantity
 */
export const updateCartItem = async (request: UpdateCartItemRequest): Promise<Cart> => {
  try {
    // Only try API if it's available
    if (!USE_LOCAL_STORAGE_ONLY && isApiAvailable) {
      try {
        const response = await api.put(`${CART_API}/items/${request.itemId}`, { quantity: request.quantity });
        if (response.data) {
          // Update local cart with server data
          mockCart = response.data;
          saveCartToStorage();
          return response.data;
        }
      } catch (apiError: any) {
        // If we get a 404, mark the API as unavailable to avoid future calls
        if (apiError.response && apiError.response.status === 404) {
          console.log('Cart API not available, switching to local storage only');
          isApiAvailable = false;
        } else {
          console.log('API updateCartItem failed, using local storage');
        }
        // Continue to fallback
      }
    }
    
    // Mock implementation
    const { itemId, quantity } = request;
    
    // Find the item
    const itemIndex = mockCart.items.findIndex(item => item.id === itemId);
    if (itemIndex === -1) {
      throw new Error(`Cart item with id ${itemId} not found`);
    }
    
    if (quantity <= 0) {
      // Remove item if quantity is 0 or less
      mockCart.items = mockCart.items.filter(item => item.id !== itemId);
    } else {
      // Update quantity
      mockCart.items[itemIndex].quantity = quantity;
    }
    
    // Recalculate totals and save
    calculateCartTotals();
    saveCartToStorage();
    
    return { ...mockCart };
  } catch (error) {
    console.error('Error updating cart item:', error);
    throw error;
  }
};

/**
 * Remove an item from the cart
 */
export const removeCartItem = async (itemId: string): Promise<Cart> => {
  try {
    // Only try API if it's available
    if (!USE_LOCAL_STORAGE_ONLY && isApiAvailable) {
      try {
        const response = await api.delete(`${CART_API}/items/${itemId}`);
        if (response.data) {
          // Update local cart with server data
          mockCart = response.data;
          saveCartToStorage();
          return response.data;
        }
      } catch (apiError: any) {
        // If we get a 404, mark the API as unavailable to avoid future calls
        if (apiError.response && apiError.response.status === 404) {
          console.log('Cart API not available, switching to local storage only');
          isApiAvailable = false;
        } else {
          console.log('API removeCartItem failed, using local storage');
        }
        // Continue to fallback
      }
    }
    
    // Mock implementation
    // Remove the item
    mockCart.items = mockCart.items.filter(item => item.id !== itemId);
    
    // Recalculate totals and save
    calculateCartTotals();
    saveCartToStorage();
    
    return { ...mockCart };
  } catch (error) {
    console.error('Error removing cart item:', error);
    throw error;
  }
};

/**
 * Clear the entire cart
 */
export const clearCart = async (): Promise<Cart> => {
  try {
    // Only try API if it's available
    if (!USE_LOCAL_STORAGE_ONLY && isApiAvailable) {
      try {
        const response = await api.delete(CART_API);
        if (response.data) {
          // Update local cart with server data
          mockCart = response.data;
          saveCartToStorage();
          return response.data;
        }
      } catch (apiError: any) {
        // If we get a 404, mark the API as unavailable to avoid future calls
        if (apiError.response && apiError.response.status === 404) {
          console.log('Cart API not available, switching to local storage only');
          isApiAvailable = false;
        } else {
          console.log('API clearCart failed, using local storage');
        }
        // Continue to fallback
      }
    }
    
    // Mock implementation
    mockCart.items = [];
    
    // Recalculate totals and save
    calculateCartTotals();
    saveCartToStorage();
    
    return { ...mockCart };
  } catch (error) {
    console.error('Error clearing cart:', error);
    throw error;
  }
};

/**
 * Get cart summary (for displaying in header/mini-cart)
 * 
 * This is a lightweight version that doesn't make API calls if we already have the data locally
 */
export const getCartSummary = async (): Promise<{ totalItems: number; subtotal: number }> => {
  try {
    // If we're using local storage only or API is not available, just return the current mock cart data
    // This prevents unnecessary API calls for the header cart icon
    if (USE_LOCAL_STORAGE_ONLY || !isApiAvailable) {
      return {
        totalItems: mockCart.totalItems,
        subtotal: mockCart.subtotal
      };
    }
    
    // Otherwise get the full cart which will check the API
    const cart = await getCart();
    return {
      totalItems: cart.totalItems,
      subtotal: cart.subtotal
    };
  } catch (error) {
    console.error('Error getting cart summary:', error);
    return { totalItems: mockCart.totalItems, subtotal: mockCart.subtotal };
  }
};
