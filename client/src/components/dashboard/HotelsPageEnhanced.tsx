import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  BedDouble,
  Filter,
  RefreshCw,
  Download,
  UploadCloud,
  ChevronDown,
  CheckCircle,
  XCircle,
  Clock,
  Building,
  CalendarRange,
  Users
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

// Define the Hotel interface
interface Hotel {
  id: number;
  name: string;
  location: string;
  rating: number;
  rooms: number;
  price_range: string;
  is_active: boolean;
  created_at: string;
  amenities: string[];
  image_url?: string;
}

// Mock data for hotels
const mockHotels: Hotel[] = [
  {
    id: 1,
    name: "Grand Seaside Resort",
    location: "Maldives",
    rating: 5,
    rooms: 120,
    price_range: "$300-$1200",
    is_active: true,
    created_at: "2025-01-10T08:30:00Z",
    amenities: ["Spa", "Pool", "Restaurant", "Beach Access", "WiFi"]
  },
  {
    id: 2,
    name: "Mountain View Lodge",
    location: "Swiss Alps",
    rating: 4,
    rooms: 85,
    price_range: "$180-$450",
    is_active: true,
    created_at: "2025-02-15T14:20:00Z",
    amenities: ["Ski Access", "Fireplace", "Restaurant", "Spa", "WiFi"]
  },
  {
    id: 3,
    name: "Urban Luxury Hotel",
    location: "New York",
    rating: 5,
    rooms: 200,
    price_range: "$250-$900",
    is_active: true,
    created_at: "2025-03-05T11:45:00Z",
    amenities: ["Business Center", "Gym", "Restaurant", "Bar", "WiFi"]
  },
  {
    id: 4,
    name: "Desert Oasis Resort",
    location: "Dubai",
    rating: 5,
    rooms: 150,
    price_range: "$280-$1100",
    is_active: false,
    created_at: "2025-01-25T09:15:00Z",
    amenities: ["Pool", "Spa", "Restaurant", "Desert Tours", "WiFi"]
  },
  {
    id: 5,
    name: "Historic City Inn",
    location: "Rome",
    rating: 4,
    rooms: 60,
    price_range: "$150-$380",
    is_active: true,
    created_at: "2025-04-12T16:30:00Z",
    amenities: ["Restaurant", "Bar", "WiFi", "Guided Tours", "Airport Shuttle"]
  },
  {
    id: 6,
    name: "Tropical Paradise Resort",
    location: "Bali",
    rating: 4,
    rooms: 95,
    price_range: "$200-$650",
    is_active: true,
    created_at: "2025-02-28T10:20:00Z",
    amenities: ["Pool", "Beach Access", "Spa", "Restaurant", "WiFi"]
  }
];

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
    </div>
  );
};

export function HotelsPageEnhanced() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStars, setFilterStars] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [view, setView] = useState<'grid' | 'table'>('table');
  
  const navigate = useNavigate();
  const { toast } = useToast();

  // Fetch hotels data
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
          setHotels(mockHotels);
          setLoading(false);
        }, 1000);
        
        // In a real app, this would be an API call:
        // const response = await axios.get('/api/hotels');
        // setHotels(response.data);
      } catch (error) {
        console.error('Error fetching hotels:', error);
        toast({
          title: "Error",
          description: "Failed to load hotels. Please try again.",
          variant: "destructive"
        });
        setLoading(false);
      }
    };

    fetchHotels();
  }, [toast]);

  // Filter hotels based on search and filters
  const filteredHotels = hotels.filter(hotel => {
    const matchesSearch = 
      hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      hotel.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStars = filterStars === 'all' || hotel.rating === parseInt(filterStars);
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'active' && hotel.is_active) || 
      (filterStatus === 'inactive' && !hotel.is_active);
    
    return matchesSearch && matchesStars && matchesStatus;
  });

  // Handle hotel deletion
  const handleDeleteHotel = (id: number) => {
    // In a real app, this would be an API call
    setHotels(hotels.filter(hotel => hotel.id !== id));
    
    toast({
      title: "Hotel Deleted",
      description: "The hotel has been successfully removed.",
    });
  };

  // Toggle hotel status
  const handleToggleStatus = (id: number) => {
    setHotels(hotels.map(hotel => 
      hotel.id === id ? { ...hotel, is_active: !hotel.is_active } : hotel
    ));
    
    const hotel = hotels.find(h => h.id === id);
    
    toast({
      title: hotel?.is_active ? "Hotel Deactivated" : "Hotel Activated",
      description: `${hotel?.name} has been ${hotel?.is_active ? 'deactivated' : 'activated'}.`,
    });
  };

  // Column definitions for the data table
  const columns: ColumnDef<Hotel, unknown>[] = [
    {
      accessorKey: 'name',
      header: 'Hotel',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-md bg-indigo-100 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <HotelIcon className="h-6 w-6" />
          </div>
          <div>
            <div className="font-medium text-gray-800 dark:text-gray-200">{row.original.name}</div>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <MapPin className="h-3 w-3 mr-1" />
              {row.original.location}
            </div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'rating',
      header: 'Rating',
      cell: ({ row }) => <StarRating rating={row.original.rating} />,
    },
    {
      accessorKey: 'rooms',
      header: 'Rooms',
      cell: ({ row }) => (
        <div className="flex items-center text-gray-700 dark:text-gray-300">
          <BedDouble className="h-4 w-4 mr-1 text-gray-400" />
          {row.original.rooms}
        </div>
      ),
    },
    {
      accessorKey: 'price_range',
      header: 'Price Range',
      cell: ({ row }) => (
        <Badge variant="outline" className="font-medium">
          {row.original.price_range}
        </Badge>
      ),
    },
    {
      accessorKey: 'is_active',
      header: 'Status',
      cell: ({ row }) => (
        row.original.is_active ? (
          <Badge className="bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400">
            <CheckCircle className="h-3 w-3 mr-1" />
            Active
          </Badge>
        ) : (
          <Badge variant="secondary" className="bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400">
            <XCircle className="h-3 w-3 mr-1" />
            Inactive
          </Badge>
        )
      ),
    },
    {
      accessorKey: 'amenities',
      header: 'Amenities',
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1 max-w-[200px]">
          {row.original.amenities.slice(0, 3).map((amenity, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {amenity}
            </Badge>
          ))}
          {row.original.amenities.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{row.original.amenities.length - 3}
            </Badge>
          )}
        </div>
      ),
    },
    {
      id: 'actions',
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
            <DropdownMenuItem 
              onClick={() => navigate(`/dashboard/hotels-enhanced/${row.original.id}`)}
              className="cursor-pointer"
            >
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => navigate(`/dashboard/hotels-enhanced/${row.original.id}/edit`)}
              className="cursor-pointer"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => navigate(`/dashboard/hotels-enhanced/${row.original.id}/rooms`)}
              className="cursor-pointer"
            >
              <BedDouble className="h-4 w-4 mr-2" />
              Manage Rooms
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => handleToggleStatus(row.original.id)}
              className="cursor-pointer"
            >
              {row.original.is_active ? (
                <>
                  <XCircle className="h-4 w-4 mr-2" />
                  Deactivate
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Activate
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => handleDeleteHotel(row.original.id)}
              className="text-red-600 focus:text-red-600 cursor-pointer"
            >
              <Trash className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header with title and action button */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Hotels</h2>
          <p className="text-muted-foreground">Manage your hotel properties and accommodations</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              navigate('/dashboard/hotels-enhanced/new');
            }}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white"
            type="button"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Hotel
          </Button>
        </div>
      </div>

      {/* Hotel statistics cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-none shadow-md overflow-hidden bg-white dark:bg-gray-800">
          <div className="absolute top-0 left-0 h-1 w-full bg-blue-500"></div>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-sm text-gray-600 dark:text-gray-400 font-medium">Total Properties</CardTitle>
              <div className="rounded-full bg-blue-100 dark:bg-blue-900/20 p-2 text-blue-600 dark:text-blue-400">
                <Building className="h-4 w-4" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{hotels.length}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {hotels.filter(h => h.is_active).length} active
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md overflow-hidden bg-white dark:bg-gray-800">
          <div className="absolute top-0 left-0 h-1 w-full bg-purple-500"></div>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-sm text-gray-600 dark:text-gray-400 font-medium">Total Rooms</CardTitle>
              <div className="rounded-full bg-purple-100 dark:bg-purple-900/20 p-2 text-purple-600 dark:text-purple-400">
                <BedDouble className="h-4 w-4" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {hotels.reduce((sum, hotel) => sum + hotel.rooms, 0)}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {Math.floor(hotels.reduce((sum, hotel) => sum + hotel.rooms, 0) * 0.75)} available
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md overflow-hidden bg-white dark:bg-gray-800">
          <div className="absolute top-0 left-0 h-1 w-full bg-amber-500"></div>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-sm text-gray-600 dark:text-gray-400 font-medium">Bookings</CardTitle>
              <div className="rounded-full bg-amber-100 dark:bg-amber-900/20 p-2 text-amber-600 dark:text-amber-400">
                <CalendarRange className="h-4 w-4" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">1,248</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              186 this month
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md overflow-hidden bg-white dark:bg-gray-800">
          <div className="absolute top-0 left-0 h-1 w-full bg-green-500"></div>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-sm text-gray-600 dark:text-gray-400 font-medium">Avg. Rating</CardTitle>
              <div className="rounded-full bg-green-100 dark:bg-green-900/20 p-2 text-green-600 dark:text-green-400">
                <Star className="h-4 w-4" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {hotels.length > 0 
                ? (hotels.reduce((sum, hotel) => sum + hotel.rating, 0) / hotels.length).toFixed(1) 
                : '0.0'
              }
            </div>
            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
              <StarRating rating={4.5} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-none shadow-md overflow-hidden bg-white dark:bg-gray-800">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex-1 max-w-md relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search hotels..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Select value={filterStars} onValueChange={setFilterStars}>
                <SelectTrigger className="w-[140px] bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700">
                  <SelectValue placeholder="All Ratings" />
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
              
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[140px] bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" size="icon" className="border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                <Filter className="h-4 w-4 text-gray-500" />
              </Button>
              
              <Button variant="outline" size="icon" className="border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                <RefreshCw className="h-4 w-4 text-gray-500" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hotels table */}
      <Card className="border-none shadow-md overflow-hidden bg-white dark:bg-gray-800">
        <CardHeader className="border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-gray-800 dark:text-gray-200">Hotel Properties</CardTitle>
              <CardDescription className="text-gray-500 dark:text-gray-400">
                {filteredHotels.length} hotels found
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden md:flex items-center gap-2">
                <Button 
                  variant={view === 'table' ? "default" : "outline"}
                  size="sm"
                  onClick={() => setView('table')}
                  className="flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 mr-1"
                  >
                    <rect width="18" height="18" x="3" y="3" rx="2" />
                    <path d="M3 9h18" />
                    <path d="M3 15h18" />
                    <path d="M9 3v18" />
                    <path d="M15 3v18" />
                  </svg>
                  Table
                </Button>
                <Button 
                  variant={view === 'grid' ? "default" : "outline"}
                  size="sm"
                  onClick={() => setView('grid')}
                  className="flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 mr-1"
                  >
                    <rect width="7" height="7" x="3" y="3" rx="1" />
                    <rect width="7" height="7" x="14" y="3" rx="1" />
                    <rect width="7" height="7" x="14" y="14" rx="1" />
                    <rect width="7" height="7" x="3" y="14" rx="1" />
                  </svg>
                  Grid
                </Button>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="border-gray-200 dark:border-gray-700">
                    <Download className="h-4 w-4 mr-1" />
                    Export
                    <ChevronDown className="h-4 w-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    Export as CSV
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    Export as Excel
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    Export as PDF
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center items-center py-16">
              <div className="inline-block p-3 rounded-full bg-gradient-to-tr from-indigo-500/20 to-purple-500/20">
                <div className="animate-spin h-10 w-10 rounded-full border-4 border-indigo-100 border-t-indigo-500"></div>
              </div>
            </div>
          ) : (
            <div>
              {view === 'table' && (
                <div className="w-full">
                  <DataTable 
                    columns={columns} 
                    data={filteredHotels}
                    searchKey="name"
                    filterOptions={[
                      {
                        label: "Status",
                        value: "is_active",
                        options: [
                          { label: "Active", value: "true" },
                          { label: "Inactive", value: "false" },
                        ],
                      },
                    ]}
                    onAddNew={() => navigate('/dashboard/hotels-enhanced/new')}
                    isLoading={loading}
                  />
                </div>
              )}
              
              {view === 'grid' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                  {filteredHotels.map(hotel => (
                    <Card key={hotel.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                              <HotelIcon className="h-5 w-5" />
                            </div>
                            <div>
                              <CardTitle className="text-base">{hotel.name}</CardTitle>
                              <CardDescription className="text-xs">{hotel.location}</CardDescription>
                            </div>
                          </div>
                          <Badge variant={hotel.is_active ? "default" : "secondary"}>
                            {hotel.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-3">
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500 dark:text-gray-400">Rating</span>
                            <StarRating rating={hotel.rating} />
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500 dark:text-gray-400">Rooms</span>
                            <span className="font-medium">{hotel.rooms}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500 dark:text-gray-400">Price Range</span>
                            <span className="font-medium">{hotel.price_range}</span>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1.5">Amenities</p>
                            <div className="flex flex-wrap gap-1.5">
                              {hotel.amenities.map((amenity, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {amenity}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between items-center border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 px-4 py-2">
                        <Button variant="ghost" size="sm" className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 p-0">
                          <Eye className="h-4 w-4 mr-1" />
                          Details
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => navigate(`/dashboard/hotels-enhanced/edit/${hotel.id}`)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleToggleStatus(hotel.id)}>
                              {hotel.is_active ? (
                                <>
                                  <XCircle className="h-4 w-4 mr-2 text-amber-500" />
                                  Deactivate
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                                  Activate
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleDeleteHotel(hotel.id)} className="text-red-600 dark:text-red-400">
                              <Trash className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter className="border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 py-3">
          <div className="flex items-center justify-between w-full">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Showing {filteredHotels.length} of {hotels.length} hotels
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
