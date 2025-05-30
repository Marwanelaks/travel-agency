// Type definitions for hotel-related data

export interface Hotel {
  id: number;
  name: string;
  description: string;
  location: string;
  stars: number;
  price: number;
  rooms: number | Room[]; // Can be either a count or actual room objects
  rooms_count?: number; // For when we need a separate count field
  amenities: string[];
  image: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface HotelFormData {
  name: string;
  description: string;
  location: string;
  stars: number;
  price: number;
  rooms: number;
  amenities: string[];
  image?: string;
  is_active?: boolean;
}

export interface Room {
  id: number;
  hotel_id: number;
  room_type_id?: number;
  room_number?: string;
  price_per_night?: number;
  price?: number; // For backward compatibility
  capacity?: number;
  quantity?: number;
  available_quantity?: number;
  available?: number; // For backward compatibility
  is_available?: boolean; // Whether the room is available for booking
  status?: string;
  amenities?: string[];
  created_at?: string;
  updated_at?: string;
  type?: string; // For backward compatibility
  description?: string; // Room description
}

export interface RoomFormData {
  hotel_id: number;
  type: string;
  price: number;
  capacity: number;
  available: number;
  amenities: string[];
}
