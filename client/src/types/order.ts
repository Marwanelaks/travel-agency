import { User } from './user';

export type OrderStatus = 'pending' | 'approved' | 'delivered' | 'cancelled';

export interface OrderProduct {
  id: string;
  name: string;
  price: number;
  quantity: number;
  type: string;
  image?: string;
}

export interface Order {
  id: string;
  buyer_id: string;
  seller_id: string;
  status: OrderStatus;
  total: number;
  product_data: OrderProduct[];
  approved_at: string | null;
  delivered_at: string | null;
  cancelled_at: string | null;
  created_at: string;
  updated_at: string;
  buyer?: User;
  seller?: User;
}

export interface OrdersResponse {
  data: Order[];
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
  };
}
