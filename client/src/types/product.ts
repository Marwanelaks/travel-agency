export type ProductType = 'hotel' | 'flight' | 'sport' | 'entertainment' | 'package' | 'other';

export interface Product {
  id: string;
  name: string;
  description: string;
  type: ProductType;
  price: number;
  location: string;
  rating?: number;
  image?: string;
  isActive: boolean;
  startDate?: string;
  endDate?: string;
  capacity?: number;
  createdAt: string;
  updatedAt: string;
  // Type-specific fields
  hotelDetails?: HotelDetails;
  flightDetails?: FlightDetails;
  sportDetails?: SportDetails;
  entertainmentDetails?: EntertainmentDetails;
}

export interface HotelDetails {
  stars: number;
  amenities: string[];
  checkInTime: string;
  checkOutTime: string;
  roomTypes: RoomType[];
}

export interface RoomType {
  type: string;
  price: number;
  capacity: number;
  available: number;
}

export interface FlightDetails {
  airline: string;
  flightNumber: string;
  departure: {
    airport: string;
    time: string;
    city: string;
  };
  arrival: {
    airport: string;
    time: string;
    city: string;
  };
  duration: number; // in minutes
  cabinClass: 'economy' | 'business' | 'first';
  baggageAllowance: string;
}

export interface SportDetails {
  sportType: string;
  venue: string;
  date: string;
  time: string;
  duration: number; // in minutes
  equipmentIncluded: boolean;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

export interface EntertainmentDetails {
  venue: string;
  eventDate: string;
  eventTime: string;
  duration: number; // in minutes
  ageRestriction?: string;
  performers?: string[];
}

export interface ProductFormData extends Omit<Product, 'id' | 'createdAt' | 'updatedAt'> {
  id?: string;
}
