import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Hotel as HotelIcon, 
  Search, 
  Plus, 
  MoreHorizontal, 
  Edit, 
  Trash, 
  Eye, 
  Star,
  MapPin,
  ArrowUpDown,
  BedDouble
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { DataTable } from '@/components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Hotel } from '@/types/hotel';
import { 
  getHotels, 
  getHotelById, 
  createHotel, 
  updateHotel, 
  deleteHotel, 
  toggleHotelStatus 
} from '@/services/hotelService';

// Component to display star rating
const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
        />
      ))}
      <span className="ml-1 text-sm">({rating})</span>
    </div>
  );
};

export function HotelsPage() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStars, setFilterStars] = useState('all');
  const navigate = useNavigate();
  const { toast } = useToast();

  // Fetch hotels data
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setLoading(true);
        const hotelData = await getHotels();
        setHotels(hotelData);
      } catch (error) {
        console.error('Error fetching hotels:', error);
        toast({
          title: "Error",
          description: "Failed to load hotels. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, [toast]);

  // Column definitions for the data table
  const columns: ColumnDef<Hotel>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Hotel Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-medium">{row.original.name}</span>
          <span className="text-xs text-muted-foreground">{row.original.description.substring(0, 50)}...</span>
        </div>
      ),
    },
    {
      accessorKey: "location",
      header: "Location",
      cell: ({ row }) => (
        <div className="flex items-center">
          <MapPin className="mr-1 h-4 w-4 text-muted-foreground" />
          {row.original.location}
        </div>
      ),
    },
    {
      accessorKey: "stars",
      header: "Rating",
      cell: ({ row }) => <StarRating rating={row.original.stars} />,
    },
    {
      accessorKey: "rooms",
      header: "Rooms",
      cell: ({ row }) => {
        // Handle different data types for rooms property
        const roomsData = row.original.rooms;
        let roomsDisplay: string | number = "";
        
        // First check if rooms_count is available (our preferred field)
        if (row.original.rooms_count !== undefined) {
          roomsDisplay = row.original.rooms_count;
        }
        // Check if rooms is an array
        else if (Array.isArray(roomsData)) {
          roomsDisplay = roomsData.length;
        }
        // Check if rooms is an object with an id (likely a single room object)
        else if (roomsData && typeof roomsData === 'object' && roomsData !== null) {
          roomsDisplay = 1; // Single room object
        }
        // Check if rooms is a number (room count)
        else if (typeof roomsData === 'number') {
          roomsDisplay = roomsData;
        }
        // If it's a string, display it directly
        else if (typeof roomsData === 'string') {
          roomsDisplay = roomsData;
        }
        // Default case
        else {
          roomsDisplay = 0;
        }
        
        return (
          <div className="flex items-center">
            <BedDouble className="mr-1 h-4 w-4 text-muted-foreground" />
            {roomsDisplay}
          </div>
        );
      },
    },
    {
      accessorKey: "price",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Price per Night
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const price = parseFloat(row.getValue("price"));
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(price);
        return <div>{formatted}</div>;
      },
    },
    {
      accessorKey: "is_active",
      header: "Status",
      cell: ({ row }) => {
        return (
          <Badge variant={row.original.is_active ? "success" : "destructive"}>
            {row.original.is_active ? "Active" : "Inactive"}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => handleViewHotel(row.original.id)}>
              <Eye className="mr-2 h-4 w-4" />
              View details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleViewRooms(row.original.id)}>
              <BedDouble className="mr-2 h-4 w-4" />
              Manage rooms
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleEditHotel(row.original.id)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleToggleStatus(row.original.id, !row.original.is_active)}>
              <Badge variant={row.original.is_active ? "destructive" : "success"} className="mr-2">
                {row.original.is_active ? "Deactivate" : "Activate"}
              </Badge>
              {row.original.is_active ? "Mark as Inactive" : "Mark as Active"}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleDeleteHotel(row.original.id)} className="text-red-600">
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  // Filter hotels based on search term and stars
  const filteredHotels = hotels.filter(hotel => {
    const matchesSearch = hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        hotel.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStars = filterStars === 'all' || hotel.stars === parseInt(filterStars);
    
    return matchesSearch && matchesStars;
  });

  // Handler functions
  const handleAddHotel = () => navigate('/dashboard/hotels/new');
  
  const handleViewHotel = (id: number) => {
    navigate(`/dashboard/hotels/${id}`);
  };
  
  const handleViewRooms = (id: number) => {
    navigate(`/dashboard/hotels/${id}/rooms`);
  };
  
  const handleEditHotel = (id: number) => {
    navigate(`/dashboard/hotels/${id}/edit`);
  };
  
  const handleToggleStatus = async (id: number, isActive: boolean) => {
    try {
      await toggleHotelStatus(id, isActive);
      // Update local state after successful API call
      setHotels(prevHotels => 
        prevHotels.map(hotel => 
          hotel.id === id ? { ...hotel, is_active: isActive } : hotel
        )
      );
      toast({
        title: `Hotel ${isActive ? 'Activated' : 'Deactivated'}`,
        description: `The hotel has been ${isActive ? 'activated' : 'deactivated'} successfully.`,
      });
    } catch (error) {
      console.error('Error toggling hotel status:', error);
      toast({
        title: "Error",
        description: "Failed to update hotel status. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleDeleteHotel = async (id: number) => {
    if (confirm('Are you sure you want to delete this hotel?')) {
      try {
        await deleteHotel(id);
        // Update local state after successful API call
        setHotels(prevHotels => prevHotels.filter(hotel => hotel.id !== id));
        toast({
          title: "Hotel deleted",
          description: "The hotel has been successfully deleted.",
        });
      } catch (error) {
        console.error('Error deleting hotel:', error);
        toast({
          title: "Error",
          description: "Failed to delete hotel. Please try again.",
          variant: "destructive"
        });
      }
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Hotels</h2>
          <p className="text-muted-foreground">
            View and manage all your hotel properties here.
          </p>
        </div>
        <Button onClick={handleAddHotel}>
          <Plus className="mr-2 h-4 w-4" /> Add New Hotel
        </Button>
      </div>
      
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Hotels Overview</CardTitle>
            <CardDescription>
              Browse, filter, and manage your hotel listings.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-end">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search hotels by name or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              <div className="w-full md:w-[180px]">
                <Select
                  value={filterStars}
                  onValueChange={setFilterStars}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by Stars" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Ratings</SelectItem>
                    <SelectItem value="5">5 Stars</SelectItem>
                    <SelectItem value="4">4 Stars</SelectItem>
                    <SelectItem value="3">3 Stars</SelectItem>
                    <SelectItem value="2">2 Stars</SelectItem>
                    <SelectItem value="1">1 Star</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {loading ? (
              <div className="flex justify-center py-8">
                <p>Loading hotels...</p>
              </div>
            ) : filteredHotels.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No hotels found. Try adjusting your search or filters.</p>
              </div>
            ) : (
              <div>
                <DataTable
                  columns={columns}
                  data={filteredHotels}
                  searchKey="name"
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
