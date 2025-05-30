import api from './api';
import { Hotel, HotelFormData, Room } from '../types/hotel';

// Mock data from HotelsPage component that should be moved here
const mockHotels: Hotel[] = [
  {
    id: 1,
    name: "Grand Plaza Hotel",
    description: "A luxurious 5-star hotel located in the heart of downtown with stunning city views.",
    location: "New York, NY",
    stars: 5,
    price: 299.99,
    rooms: 120,
    rooms_count: 120,
    amenities: ["Pool", "Spa", "Gym", "Restaurant", "Room Service", "WiFi"],
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945",
    is_active: true,
    created_at: "2023-01-15T12:00:00Z",
    updated_at: "2023-05-20T09:30:00Z",
  },
  {
    id: 2,
    name: "Seaside Resort",
    description: "Beautiful beachfront property with private access to the beach and water activities.",
    location: "Miami, FL",
    stars: 4,
    price: 189.99,
    rooms: 84,
    rooms_count: 84,
    amenities: ["Beach Access", "Pool", "Restaurant", "Bar", "WiFi"],
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4",
    is_active: true,
    created_at: "2023-02-05T14:20:00Z",
    updated_at: "2023-06-10T11:45:00Z",
  },
  {
    id: 3,
    name: "Mountain View Lodge",
    description: "Cozy lodge with stunning mountain views, perfect for nature lovers and hikers.",
    location: "Aspen, CO",
    stars: 4,
    price: 249.99,
    rooms: 50,
    rooms_count: 50,
    amenities: ["Fireplace", "Hiking Trails", "Restaurant", "Bar", "WiFi"],
    image: "https://images.unsplash.com/photo-1521401830884-6c03c1c87ebb",
    is_active: true,
    created_at: "2023-01-25T10:10:00Z",
    updated_at: "2023-05-15T08:30:00Z",
  },
  {
    id: 4,
    name: "City Lights Inn",
    description: "Affordable hotel with modern amenities, located near shopping centers and tourist attractions.",
    location: "Chicago, IL",
    stars: 3,
    price: 129.99,
    rooms: 95,
    rooms_count: 95,
    amenities: ["Restaurant", "WiFi", "Parking", "Business Center"],
    image: "https://images.unsplash.com/photo-1598605272254-16f0c0ecdfa5",
    is_active: true,
    created_at: "2023-03-12T09:45:00Z",
    updated_at: "2023-07-02T15:20:00Z",
  },
  {
    id: 5,
    name: "Desert Oasis Resort",
    description: "Luxurious desert resort with pools, spa services, and golf courses.",
    location: "Phoenix, AZ",
    stars: 5,
    price: 279.99,
    rooms: 150,
    rooms_count: 150,
    amenities: ["Pool", "Spa", "Golf Course", "Restaurant", "Bar", "WiFi"],
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa",
    is_active: true,
    created_at: "2023-02-18T11:30:00Z",
    updated_at: "2023-06-25T13:15:00Z",
  },
  {
    id: 6,
    name: "Downtown Boutique Hotel",
    description: "Stylish boutique hotel in the heart of the arts district, featuring local artwork and custom furnishings.",
    location: "Portland, OR",
    stars: 4,
    price: 169.99,
    rooms: 30,
    rooms_count: 30,
    amenities: ["Free Breakfast", "Bike Rentals", "Lounge", "WiFi"],
    image: "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f",
    is_active: true,
    created_at: "2023-04-05T08:20:00Z",
    updated_at: "2023-08-10T10:05:00Z",
  },
  {
    id: 7,
    name: "Historic Grand Hotel",
    description: "Landmark hotel with traditional charm and modern conveniences in a historic building.",
    location: "Boston, MA",
    stars: 4,
    price: 219.99,
    rooms: 75,
    rooms_count: 75,
    amenities: ["Room Service", "Concierge", "Restaurant", "Bar", "WiFi"],
    image: "https://images.unsplash.com/photo-1519449556851-5720b33024e7",
    is_active: false,
    created_at: "2023-01-30T12:40:00Z",
    updated_at: "2023-05-22T14:10:00Z",
  }
];

// API endpoints
const HOTEL_API = '/hotels';

// Get all hotels with optional filters
export const getHotels = async (filters: {
  location?: string;
  stars?: number;
  search?: string;
  isActive?: boolean;
} = {}): Promise<Hotel[]> => {
  try {
    const params = {
      ...(filters.location && { location: filters.location }),
      ...(filters.stars && { stars: filters.stars }),
      ...(filters.search && { search: filters.search }),
      ...(filters.isActive !== undefined && { is_active: filters.isActive }),
    };

    const response = await api.get('/hotels', { params });
    
    // Handle different API response formats
    // Check if response.data is an array or has a data property
    const responseData = Array.isArray(response.data) ? response.data : 
                        response.data && response.data.data ? response.data.data : 
                        [];
    
    // Ensure proper data structure
    const hotels = responseData.map((hotel: any) => {
      // If rooms is an array of room objects, add a rooms_count property
      if (Array.isArray(hotel.rooms)) {
        return {
          ...hotel,
          rooms_count: hotel.rooms.length,
        };
      } else if (typeof hotel.rooms === 'object' && hotel.rooms !== null) {
        // If rooms is a single object, convert to array and add count
        return {
          ...hotel,
          rooms: [hotel.rooms],
          rooms_count: 1
        };
      }
      return hotel;
    });
    
    console.log('Processed hotels data:', hotels);
    return hotels;
  } catch (error) {
    console.error('Error fetching hotels:', error);
    
    // Fallback to mock data if API fails
    // Apply filters to mock data
    let filteredHotels = [...mockHotels];
    
    if (filters.location) {
      filteredHotels = filteredHotels.filter(hotel => 
        hotel.location.toLowerCase().includes(filters.location!.toLowerCase())
      );
    }
    
    if (filters.stars) {
      filteredHotels = filteredHotels.filter(hotel => hotel.stars === filters.stars);
    }
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredHotels = filteredHotels.filter(hotel => 
        hotel.name.toLowerCase().includes(searchLower) || 
        hotel.description.toLowerCase().includes(searchLower) ||
        hotel.location.toLowerCase().includes(searchLower)
      );
    }
    
    if (filters.isActive !== undefined) {
      filteredHotels = filteredHotels.filter(hotel => hotel.is_active === filters.isActive);
    }
    
    return filteredHotels;
  }
};

// Get a single hotel by ID
export const getHotelById = async (id: number): Promise<Hotel> => {
  try {
    // Try API first
    try {
      const response = await api.get(`${HOTEL_API}/${id}`);
      if (response.data && (response.data.data || response.data)) {
        return response.data.data || response.data;
      }
    } catch (apiError) {
      console.log('API getHotelById failed, using mock data');
      // Continue to fallback
    }
    
    // Find in mock data
    const hotel = mockHotels.find(h => h.id === id);
    if (hotel) {
      return hotel;
    }
    
    throw new Error(`Hotel with id ${id} not found`);
  } catch (error) {
    console.error(`Error fetching hotel with id ${id}:`, error);
    throw error;
  }
};

// Create a new hotel
export const createHotel = async (hotelData: HotelFormData): Promise<Hotel> => {
  try {
    // Try API first
    try {
      const response = await api.post(HOTEL_API, hotelData);
      if (response.data && (response.data.data || response.data)) {
        return response.data.data || response.data;
      }
    } catch (apiError) {
      console.log('API createHotel failed, using mock data');
      // Continue to fallback
    }
    
    // Create in mock data
    const newId = Math.max(0, ...mockHotels.map(h => h.id)) + 1;
    
    const newHotel: Hotel = {
      id: newId,
      name: hotelData.name || 'New Hotel',
      description: hotelData.description || 'Hotel description',
      location: hotelData.location || 'Unknown',
      stars: hotelData.stars || 3,
      price: hotelData.price || 149.99,
      rooms: typeof hotelData.rooms === 'number' ? hotelData.rooms : 50,
      rooms_count: typeof hotelData.rooms === 'number' ? hotelData.rooms : 50,
      amenities: hotelData.amenities || ['WiFi'],
      image: hotelData.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945',
      is_active: hotelData.is_active !== undefined ? hotelData.is_active : true
    };
    
    // Add to mock data
    mockHotels.push(newHotel);
    
    return newHotel;
  } catch (error) {
    console.error('Error creating hotel:', error);
    throw error;
  }
};

// Update an existing hotel
export const updateHotel = async (id: number, hotelData: Partial<HotelFormData>): Promise<Hotel> => {
  try {
    // Try API first
    try {
      const response = await api.put(`${HOTEL_API}/${id}`, hotelData);
      if (response.data && (response.data.data || response.data)) {
        return response.data.data || response.data;
      }
    } catch (apiError) {
      console.log('API updateHotel failed, using mock data');
      // Continue to fallback
    }
    
    // Update in mock data
    const hotelIndex = mockHotels.findIndex(h => h.id === id);
    if (hotelIndex === -1) {
      throw new Error(`Hotel with id ${id} not found`);
    }
    
    // Update hotel data
    const updatedHotel = {
      ...mockHotels[hotelIndex],
      ...hotelData
    };
    
    // Replace in mock data
    mockHotels[hotelIndex] = updatedHotel;
    
    return updatedHotel;
  } catch (error) {
    console.error(`Error updating hotel with id ${id}:`, error);
    throw error;
  }
};

// Delete a hotel
export const deleteHotel = async (id: number): Promise<void> => {
  try {
    // Try API first
    try {
      await api.delete(`${HOTEL_API}/${id}`);
      return; // Return early if successful
    } catch (apiError) {
      console.log('API deleteHotel failed, using mock data');
      // Continue to fallback
    }
    
    // Delete from mock data
    const hotelIndex = mockHotels.findIndex(h => h.id === id);
    if (hotelIndex === -1) {
      throw new Error(`Hotel with id ${id} not found`);
    }
    
    // Remove from mock data
    mockHotels.splice(hotelIndex, 1);
    
    return;
  } catch (error) {
    console.error(`Error deleting hotel with id ${id}:`, error);
    throw error;
  }
};

// Toggle hotel active status
export const toggleHotelStatus = async (id: number, isActive: boolean): Promise<Hotel> => {
  try {
    // Try API first
    try {
      const response = await api.patch(`${HOTEL_API}/${id}/status`, { is_active: isActive });
      if (response.data && (response.data.data || response.data)) {
        return response.data.data || response.data;
      }
    } catch (apiError) {
      console.log('API toggleHotelStatus failed, using mock data');
      // Continue to fallback
    }
    
    // Update in mock data
    const hotelIndex = mockHotels.findIndex(h => h.id === id);
    if (hotelIndex === -1) {
      throw new Error(`Hotel with id ${id} not found`);
    }
    
    // Update status
    mockHotels[hotelIndex].is_active = isActive;
    
    return mockHotels[hotelIndex];
  } catch (error) {
    console.error(`Error toggling status for hotel with id ${id}:`, error);
    throw error;
  }
};

// Get hotel rooms
export const getHotelRooms = async (hotelId: number): Promise<Room[]> => {
  try {
    // Try API first
    try {
      const response = await api.get(`${HOTEL_API}/${hotelId}/rooms`);
      if (response.data && (response.data.data || response.data)) {
        const roomsData = response.data.data || response.data;
        // Normalize the response data
        return roomsData.map((room: any) => ({
          id: room.id,
          hotel_id: room.hotel_id,
          room_type_id: room.room_type_id,
          room_number: room.room_number,
          price_per_night: room.price_per_night || room.price,
          price: room.price_per_night || room.price, // For backward compatibility
          quantity: room.quantity || 1,
          available_quantity: room.available_quantity || room.available || 0,
          available: room.available_quantity || room.available || 0, // For backward compatibility
          status: room.status || 'available',
          amenities: room.amenities || [],
          type: room.type, // For backward compatibility
          created_at: room.created_at,
          updated_at: room.updated_at,
        }));
      }
    } catch (apiError) {
      console.log('API getHotelRooms failed, using mock data');
      // Continue to fallback
    }
    
    // Mock rooms data
    return [
      { 
        id: 1, 
        hotel_id: hotelId, 
        price_per_night: 99.99,
        type: 'Standard', 
        price: 99.99, 
        capacity: 2, 
        available: 10,
        quantity: 15,
        available_quantity: 10,
        status: 'available',
        room_type_id: 1,
        room_number: '101',
        amenities: ['WiFi', 'TV', 'Air Conditioning']
      },
      { 
        id: 2, 
        hotel_id: hotelId, 
        price_per_night: 149.99,
        type: 'Deluxe', 
        price: 149.99, 
        capacity: 3, 
        available: 5,
        quantity: 10,
        available_quantity: 5,
        status: 'available',
        room_type_id: 2,
        room_number: '201',
        amenities: ['WiFi', 'TV', 'Air Conditioning', 'Mini Bar', 'Coffee Machine']
      },
      { 
        id: 3, 
        hotel_id: hotelId, 
        price_per_night: 249.99,
        type: 'Suite', 
        price: 249.99, 
        capacity: 4, 
        available: 2,
        quantity: 5,
        available_quantity: 2,
        status: 'available',
        room_type_id: 3,
        room_number: '301',
        amenities: ['WiFi', 'TV', 'Air Conditioning', 'Mini Bar', 'Coffee Machine', 'Separate Living Area', 'Bathtub']
      }
    ];
    
  } catch (error) {
    console.error(`Error fetching rooms for hotel with id ${hotelId}:`, error);
    return [];
  }
};

// Create a new room
export const createRoom = async (roomData: any): Promise<Room> => {
  try {
    // Try API first
    try {
      const response = await api.post(`${HOTEL_API}/${roomData.hotel_id}/rooms`, roomData);
      if (response.data && (response.data.data || response.data)) {
        return response.data.data || response.data;
      }
    } catch (apiError) {
      console.log('API createRoom failed, using mock data', apiError);
      // Continue to fallback
    }
    
    // Mock room creation
    const newRoom: Room = {
      id: Math.floor(Math.random() * 10000) + 100, // Generate a random ID
      hotel_id: roomData.hotel_id,
      room_number: roomData.room_number,
      type: roomData.type,
      price: roomData.price,
      capacity: roomData.capacity,
      available: roomData.is_available ? 1 : 0,
      is_available: roomData.is_available,
      description: roomData.description,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    return newRoom;
  } catch (error) {
    console.error(`Error creating room:`, error);
    throw error;
  }
};

// Update an existing room
export const updateRoom = async (roomId: number, roomData: any): Promise<Room> => {
  try {
    // Try API first
    try {
      const response = await api.put(`${HOTEL_API}/rooms/${roomId}`, roomData);
      if (response.data && (response.data.data || response.data)) {
        return response.data.data || response.data;
      }
    } catch (apiError) {
      console.log('API updateRoom failed, using mock data', apiError);
      // Continue to fallback
    }
    
    // Mock room update - in a real app, we would update the mock data store
    const updatedRoom: Room = {
      id: roomId,
      hotel_id: roomData.hotel_id,
      room_number: roomData.room_number,
      type: roomData.type,
      price: roomData.price,
      capacity: roomData.capacity,
      available: roomData.is_available ? 1 : 0,
      is_available: roomData.is_available,
      description: roomData.description,
      updated_at: new Date().toISOString()
    };
    
    return updatedRoom;
  } catch (error) {
    console.error(`Error updating room with id ${roomId}:`, error);
    throw error;
  }
};

// Delete a room
export const deleteRoom = async (roomId: number): Promise<void> => {
  try {
    // Try API first
    try {
      await api.delete(`${HOTEL_API}/rooms/${roomId}`);
      return;
    } catch (apiError) {
      console.log('API deleteRoom failed, using mock data', apiError);
      // Continue to fallback
    }
    
    // Mock room deletion - in a real app, we would remove from the mock data store
    console.log(`Mock deletion of room with id ${roomId} successful`);
    return;
  } catch (error) {
    console.error(`Error deleting room with id ${roomId}:`, error);
    throw error;
  }
};
