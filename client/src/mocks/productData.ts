import { Product } from '@/types/product';

// Define the product types as string constants to match the type definition
const PRODUCT_TYPES = {
  HOTEL: 'hotel' as const,
  FLIGHT: 'flight' as const,
  ACTIVITY: 'sport' as const,
  CRUISE: 'package' as const,
  RESORT: 'entertainment' as const,
  OTHER: 'other' as const
};

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Luxury Beach Resort - Maldives',
    description: 'Experience paradise with overwater bungalows and pristine beaches.',
    price: 2999.99,
    type: PRODUCT_TYPES.HOTEL,
    location: 'Maldives',
    image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3540&q=80',
    isActive: true,
    createdAt: '2023-01-15T10:00:00Z',
    updatedAt: '2023-02-20T14:30:00Z',
    rating: 4.9,
    hotelDetails: {
      stars: 5,
      amenities: ['Beach access', 'Spa', 'Fine dining', 'Water sports'],
      checkInTime: '15:00',
      checkOutTime: '11:00',
      roomTypes: [
        { type: 'Standard', price: 299.99, capacity: 2, available: 10 }
      ]
    }
  },
  {
    id: '2',
    name: 'Business Class Flight - London to New York',
    description: 'Travel in comfort with our premium business class service.',
    price: 1599.99,
    type: PRODUCT_TYPES.FLIGHT,
    location: 'London to New York',
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3548&q=80',
    isActive: true,
    createdAt: '2023-03-05T12:15:00Z',
    updatedAt: '2023-03-10T09:45:00Z',
    rating: 4.7,
    flightDetails: {
      airline: 'Global Airways',
      flightNumber: 'GA789',
      departure: {
        airport: 'LHR',
        time: '10:00',
        city: 'London'
      },
      arrival: {
        airport: 'JFK',
        time: '13:00',
        city: 'New York'
      },
      duration: 7.5,
      cabinClass: 'business',
      baggageAllowance: '2x32kg'
    }
  },
  {
    id: '3',
    name: 'Safari Adventure - Serengeti',
    description: 'Unforgettable wildlife encounters in the heart of Africa.',
    price: 3499.99,
    type: PRODUCT_TYPES.ACTIVITY,
    location: 'Tanzania',
    image: 'https://images.unsplash.com/photo-1523805009345-7448845a9e53?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3544&q=80',
    isActive: true,
    createdAt: '2023-02-10T08:30:00Z',
    updatedAt: '2023-02-28T16:20:00Z',
    rating: 4.8,
    sportDetails: {
      sportType: 'Safari',
      venue: 'Serengeti National Park',
      date: '2023-06-15',
      time: '06:00',
      duration: 8,
      equipmentIncluded: true,
      difficulty: 'intermediate'
    }
  },
  {
    id: '4',
    name: 'Mediterranean Cruise - 7 Days',
    description: 'Explore the stunning Mediterranean coastline with stops at historic ports.',
    price: 1899.99,
    type: PRODUCT_TYPES.CRUISE,
    location: 'Mediterranean Sea',
    image: 'https://images.unsplash.com/photo-1548574505-5e239809ee19?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3264&q=80',
    isActive: true,
    createdAt: '2023-04-02T14:00:00Z',
    updatedAt: '2023-04-15T11:10:00Z',
    rating: 4.6,
    startDate: '2023-07-01',
    endDate: '2023-07-08',
    capacity: 2000
  },
  {
    id: '5',
    name: 'Ski Resort Package - Alps',
    description: 'Premium ski experience with lodging and lift tickets included.',
    price: 2199.99,
    type: PRODUCT_TYPES.RESORT,
    location: 'French Alps',
    image: 'https://images.unsplash.com/photo-1551524559-8af4e6624178?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3625&q=80',
    isActive: true,
    createdAt: '2023-01-20T09:45:00Z',
    updatedAt: '2023-02-05T17:30:00Z',
    rating: 4.7
  },
  {
    id: '6',
    name: 'Cultural Tour - Kyoto',
    description: 'Immerse yourself in Japanese culture with guided tours of temples and gardens.',
    price: 1299.99,
    type: PRODUCT_TYPES.ACTIVITY,
    location: 'Kyoto, Japan',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3540&q=80',
    isActive: true,
    createdAt: '2023-03-15T15:20:00Z',
    updatedAt: '2023-03-25T10:00:00Z',
    rating: 4.9,
    sportDetails: {
      sportType: 'Cultural Tour',
      venue: 'Various temples in Kyoto',
      date: '2023-05-10',
      time: '09:00',
      duration: 6,
      equipmentIncluded: false,
      difficulty: 'beginner'
    }
  }
];

export const getDefaultImageByType = (type: string): string => {
  switch (type) {
    case PRODUCT_TYPES.HOTEL:
      return 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3540&q=80';
    case PRODUCT_TYPES.FLIGHT:
      return 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3548&q=80';
    case PRODUCT_TYPES.ACTIVITY:
      return 'https://images.unsplash.com/photo-1526495124232-a04e1849168c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3474&q=80';
    case PRODUCT_TYPES.CRUISE:
      return 'https://images.unsplash.com/photo-1548574505-5e239809ee19?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3264&q=80';
    case PRODUCT_TYPES.RESORT:
      return 'https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3545&q=80';
    default:
      return 'https://images.unsplash.com/photo-1500835556837-99ac94a94552?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3540&q=80';
  }
};
