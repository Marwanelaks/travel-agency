import { api } from '@/lib/axios';
import { Order, OrderStatus } from '@/types/order';

const BASE_URL = '/orders';

// Mock data for development when API is not available
const MOCK_ORDERS: Order[] = [
  {
    id: '1',
    buyer_id: '1',
    seller_id: '2',
    status: 'pending',
    total: 199.99,
    product_data: [
      {
        id: '101',
        name: 'Luxury Hotel Stay',
        price: 199.99,
        quantity: 1,
        type: 'hotel',
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945',
      },
    ],
    created_at: '2025-05-28T14:30:00',
    updated_at: '2025-05-28T14:30:00',
    buyer: { id: '1', name: 'John Doe', email: 'john@example.com', role: 'Customer' },
    seller: { id: '2', name: 'Luxury Hotels Inc.', email: 'sales@luxuryhotels.com', role: 'Seller' },
    approved_at: null,
    delivered_at: null,
    cancelled_at: null,
  },
  {
    id: '2',
    buyer_id: '3',
    seller_id: '2',
    status: 'approved',
    total: 349.99,
    product_data: [
      {
        id: '102',
        name: 'Weekend Getaway Package',
        price: 349.99,
        quantity: 1,
        type: 'package',
        image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4',
      },
    ],
    created_at: '2025-05-27T10:15:00',
    updated_at: '2025-05-27T16:30:00',
    buyer: { id: '3', name: 'Sarah Smith', email: 'sarah@example.com', role: 'Customer' },
    seller: { id: '2', name: 'Luxury Hotels Inc.', email: 'sales@luxuryhotels.com', role: 'Seller' },
    approved_at: '2025-05-27T16:30:00',
    delivered_at: null,
    cancelled_at: null,
  },
  {
    id: '3',
    buyer_id: '4',
    seller_id: '5',
    status: 'delivered',
    total: 499.99,
    product_data: [
      {
        id: '103',
        name: 'City Tour Package',
        price: 499.99,
        quantity: 1,
        type: 'package',
        image: 'https://images.unsplash.com/photo-1519677100203-a0e668c92439',
      },
    ],
    created_at: '2025-05-25T09:20:00',
    updated_at: '2025-05-29T11:45:00',
    buyer: { id: '4', name: 'Michael Johnson', email: 'michael@example.com', role: 'Customer' },
    seller: { id: '5', name: 'City Tours Ltd.', email: 'bookings@citytours.com', role: 'Seller' },
    approved_at: '2025-05-26T10:30:00',
    delivered_at: '2025-05-29T11:45:00',
    cancelled_at: null,
  },
];

// Flag to use mock data during development when API is not available
const USE_MOCK_DATA = false;

export const getOrders = async (page = 1, limit = 20): Promise<{ data: Order[], meta: any }> => {
  try {
    if (USE_MOCK_DATA) {
      console.log('Using mock orders data for development');
      // Simulate API pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedData = MOCK_ORDERS.slice(startIndex, endIndex);
      
      return {
        data: paginatedData,
        meta: {
          current_page: page,
          from: startIndex + 1,
          last_page: Math.ceil(MOCK_ORDERS.length / limit),
          per_page: limit,
          to: Math.min(endIndex, MOCK_ORDERS.length),
          total: MOCK_ORDERS.length,
        }
      };
    }
    
    // Try the real API
    const response = await api.get(`${BASE_URL}?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    
    // If API failed, fallback to mock data
    if (!USE_MOCK_DATA) {
      console.log('API failed, falling back to mock orders data');
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedData = MOCK_ORDERS.slice(startIndex, endIndex);
      
      return {
        data: paginatedData,
        meta: {
          current_page: page,
          from: startIndex + 1,
          last_page: Math.ceil(MOCK_ORDERS.length / limit),
          per_page: limit,
          to: Math.min(endIndex, MOCK_ORDERS.length),
          total: MOCK_ORDERS.length,
        }
      };
    }
    
    throw error;
  }
};

export const getOrderById = async (id: string): Promise<Order> => {
  try {
    // If using mock data, find the order by ID
    if (USE_MOCK_DATA) {
      console.log(`Using mock data for order ${id}`);
      const order = MOCK_ORDERS.find(order => order.id === id);
      
      if (order) {
        return order;
      } else {
        // Create a mock order if the ID doesn't exist
        return {
          id,
          buyer_id: '1',
          seller_id: '2',
          status: 'pending',
          total: 199.99,
          product_data: [
            {
              id: '101',
              name: 'Luxury Hotel Stay',
              price: 199.99,
              quantity: 1,
              type: 'hotel',
              image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945',
            },
          ],
          created_at: '2025-05-28T14:30:00',
          updated_at: '2025-05-28T14:30:00',
          buyer: { id: '1', name: 'John Doe', email: 'john@example.com', role: 'Customer' },
          seller: { id: '2', name: 'Luxury Hotels Inc.', email: 'sales@luxuryhotels.com', role: 'Seller' },
          approved_at: null,
          delivered_at: null,
          cancelled_at: null,
        };
      }
    }
    
    // Try the real API
    const response = await api.get(`${BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching order ${id}:`, error);
    
    // If API failed, fall back to mock data
    if (!USE_MOCK_DATA) {
      console.log(`API failed, falling back to mock data for order ${id}`);
      const order = MOCK_ORDERS.find(order => order.id === id);
      
      if (order) {
        return order;
      } else {
        // Create a mock order if the ID doesn't exist
        return {
          id,
          buyer_id: '1',
          seller_id: '2',
          status: 'pending',
          total: 199.99,
          product_data: [
            {
              id: '101',
              name: 'Luxury Hotel Stay',
              price: 199.99,
              quantity: 1,
              type: 'hotel',
              image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945',
            },
          ],
          created_at: '2025-05-28T14:30:00',
          updated_at: '2025-05-28T14:30:00',
          buyer: { id: '1', name: 'John Doe', email: 'john@example.com', role: 'Customer' },
          seller: { id: '2', name: 'Luxury Hotels Inc.', email: 'sales@luxuryhotels.com', role: 'Seller' },
          approved_at: null,
          delivered_at: null,
          cancelled_at: null,
        };
      }
    }
    
    throw error;
  }
};

export const approveOrder = async (id: string): Promise<Order> => {
  try {
    const response = await api.put(`${BASE_URL}/${id}/approve`);
    return response.data;
  } catch (error) {
    console.error(`Error approving order ${id}:`, error);
    throw error;
  }
};

export const deliverOrder = async (id: string): Promise<Order> => {
  try {
    const response = await api.put(`${BASE_URL}/${id}/deliver`);
    return response.data;
  } catch (error) {
    console.error(`Error delivering order ${id}:`, error);
    throw error;
  }
};

export const cancelOrder = async (id: string): Promise<Order> => {
  try {
    const response = await api.put(`${BASE_URL}/${id}/cancel`);
    return response.data;
  } catch (error) {
    console.error(`Error cancelling order ${id}:`, error);
    throw error;
  }
};
