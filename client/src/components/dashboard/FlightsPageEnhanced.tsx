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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Plane,
  Search,
  Plus,
  MoreHorizontal,
  Edit,
  Trash,
  Eye,
  CheckCircle,
  XCircle,
  Calendar,
  Clock,
  Filter,
  RefreshCw,
  Download,
  ChevronDown,
  ArrowLeft,
  ArrowRight,
  Map,
  Users
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

// Define the Flight interface
interface Flight {
  id: number;
  flight_number: string;
  airline: string;
  departure: {
    airport: string;
    code: string;
    city: string;
    date: string;
    time: string;
  };
  arrival: {
    airport: string;
    code: string;
    city: string;
    date: string;
    time: string;
  };
  duration: string;
  price: number;
  seats_available: number;
  status: 'scheduled' | 'in-air' | 'delayed' | 'cancelled' | 'completed';
}

// Mock data for flights
const mockFlights: Flight[] = [
  {
    id: 1,
    flight_number: "FL1234",
    airline: "SkyWay Airlines",
    departure: {
      airport: "John F. Kennedy International Airport",
      code: "JFK",
      city: "New York",
      date: "2025-07-15",
      time: "08:30"
    },
    arrival: {
      airport: "Los Angeles International Airport",
      code: "LAX",
      city: "Los Angeles",
      date: "2025-07-15",
      time: "11:45"
    },
    duration: "6h 15m",
    price: 349.99,
    seats_available: 42,
    status: "scheduled"
  },
  {
    id: 2,
    flight_number: "FL2567",
    airline: "Global Airways",
    departure: {
      airport: "Heathrow Airport",
      code: "LHR",
      city: "London",
      date: "2025-07-16",
      time: "14:20"
    },
    arrival: {
      airport: "Charles de Gaulle Airport",
      code: "CDG",
      city: "Paris",
      date: "2025-07-16",
      time: "16:50"
    },
    duration: "2h 30m",
    price: 189.99,
    seats_available: 18,
    status: "delayed"
  },
  {
    id: 3,
    flight_number: "FL7890",
    airline: "Pacific Flyers",
    departure: {
      airport: "Dubai International Airport",
      code: "DXB",
      city: "Dubai",
      date: "2025-07-18",
      time: "23:40"
    },
    arrival: {
      airport: "Changi Airport",
      code: "SIN",
      city: "Singapore",
      date: "2025-07-19",
      time: "12:10"
    },
    duration: "7h 30m",
    price: 629.99,
    seats_available: 35,
    status: "scheduled"
  },
  {
    id: 4,
    flight_number: "FL4321",
    airline: "SkyWay Airlines",
    departure: {
      airport: "O'Hare International Airport",
      code: "ORD",
      city: "Chicago",
      date: "2025-07-15",
      time: "16:15"
    },
    arrival: {
      airport: "Miami International Airport",
      code: "MIA",
      city: "Miami",
      date: "2025-07-15",
      time: "20:30"
    },
    duration: "3h 15m",
    price: 289.99,
    seats_available: 0,
    status: "completed"
  }
];

// Get status badge for a flight
const getStatusBadge = (status: Flight['status']) => {
  switch(status) {
    case 'scheduled':
      return (
        <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
          <Clock className="h-3 w-3 mr-1" />
          Scheduled
        </Badge>
      );
    case 'in-air':
      return (
        <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400">
          <Plane className="h-3 w-3 mr-1" />
          In Air
        </Badge>
      );
    case 'delayed':
      return (
        <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">
          <Clock className="h-3 w-3 mr-1" />
          Delayed
        </Badge>
      );
    case 'cancelled':
      return (
        <Badge className="bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400">
          <XCircle className="h-3 w-3 mr-1" />
          Cancelled
        </Badge>
      );
    case 'completed':
      return (
        <Badge className="bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400">
          <CheckCircle className="h-3 w-3 mr-1" />
          Completed
        </Badge>
      );
  }
};

export function FlightsPageEnhanced() {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterAirline, setFilterAirline] = useState('all');
  
  const navigate = useNavigate();
  const { toast } = useToast();

  // Fetch flights data
  useEffect(() => {
    const fetchFlights = async () => {
      try {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
          setFlights(mockFlights);
          setLoading(false);
        }, 1000);
        
        // In a real app, this would be an API call:
        // const response = await axios.get('/api/flights');
        // setFlights(response.data);
      } catch (error) {
        console.error('Error fetching flights:', error);
        toast({
          title: "Error",
          description: "Failed to load flights. Please try again.",
          variant: "destructive"
        });
        setLoading(false);
      }
    };

    fetchFlights();
  }, [toast]);

  // Get unique airlines for the filter
  const airlines = Array.from(new Set(flights.map(flight => flight.airline)));

  // Filter flights based on search and filters
  const filteredFlights = flights.filter(flight => {
    const matchesSearch = 
      flight.flight_number.toLowerCase().includes(searchTerm.toLowerCase()) || 
      flight.airline.toLowerCase().includes(searchTerm.toLowerCase()) ||
      flight.departure.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      flight.arrival.city.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || flight.status === filterStatus;
    const matchesAirline = filterAirline === 'all' || flight.airline === filterAirline;
    
    return matchesSearch && matchesStatus && matchesAirline;
  });

  // Handle flight deletion
  const handleDeleteFlight = (id: number) => {
    // In a real app, this would be an API call
    setFlights(flights.filter(flight => flight.id !== id));
    
    toast({
      title: "Flight Deleted",
      description: "The flight has been successfully removed.",
    });
  };

  return (
    <div className="space-y-8">
      {/* Header with title and action button */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Flights</h2>
          <p className="text-muted-foreground">Manage your flight inventory and schedules</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => navigate('/dashboard/flights-enhanced/new')}
            className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Flight
          </Button>
        </div>
      </div>

      {/* Flight statistics cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-none shadow-md overflow-hidden bg-white dark:bg-gray-800">
          <div className="absolute top-0 left-0 h-1 w-full bg-purple-500"></div>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-sm text-gray-600 dark:text-gray-400 font-medium">Total Flights</CardTitle>
              <div className="rounded-full bg-purple-100 dark:bg-purple-900/20 p-2 text-purple-600 dark:text-purple-400">
                <Plane className="h-4 w-4" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{flights.length}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {flights.filter(f => f.status === 'scheduled' || f.status === 'in-air').length} active
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md overflow-hidden bg-white dark:bg-gray-800">
          <div className="absolute top-0 left-0 h-1 w-full bg-blue-500"></div>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-sm text-gray-600 dark:text-gray-400 font-medium">On-Time Rate</CardTitle>
              <div className="rounded-full bg-blue-100 dark:bg-blue-900/20 p-2 text-blue-600 dark:text-blue-400">
                <Clock className="h-4 w-4" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">92%</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Last 30 days
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md overflow-hidden bg-white dark:bg-gray-800">
          <div className="absolute top-0 left-0 h-1 w-full bg-green-500"></div>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-sm text-gray-600 dark:text-gray-400 font-medium">Occupancy</CardTitle>
              <div className="rounded-full bg-green-100 dark:bg-green-900/20 p-2 text-green-600 dark:text-green-400">
                <Users className="h-4 w-4" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">78%</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Average fill rate
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md overflow-hidden bg-white dark:bg-gray-800">
          <div className="absolute top-0 left-0 h-1 w-full bg-amber-500"></div>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-sm text-gray-600 dark:text-gray-400 font-medium">Revenue</CardTitle>
              <div className="rounded-full bg-amber-100 dark:bg-amber-900/20 p-2 text-amber-600 dark:text-amber-400">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="h-4 w-4"
                >
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/>
                  <path d="M12 18V6"/>
                </svg>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">$187,495</div>
            <div className="text-xs text-green-500 dark:text-green-400 flex items-center">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="h-3 w-3 mr-1"
              >
                <path d="m18 15-6-6-6 6"/>
              </svg>
              8.2% from last month
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
                placeholder="Search flights by number, city or airline..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[140px] bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="in-air">In Air</SelectItem>
                  <SelectItem value="delayed">Delayed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={filterAirline} onValueChange={setFilterAirline}>
                <SelectTrigger className="w-[160px] bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700">
                  <SelectValue placeholder="All Airlines" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Airlines</SelectItem>
                  {airlines.map(airline => (
                    <SelectItem key={airline} value={airline}>{airline}</SelectItem>
                  ))}
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

      {/* Loading placeholder and flights content will be added in the next step */}
      <Card className="border-none shadow-md overflow-hidden bg-white dark:bg-gray-800">
        <CardHeader className="border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-gray-800 dark:text-gray-200">Flight Inventory</CardTitle>
              <CardDescription className="text-gray-500 dark:text-gray-400">
                {filteredFlights.length} flights found
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
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
              <div className="inline-block p-3 rounded-full bg-gradient-to-tr from-purple-500/20 to-indigo-500/20">
                <div className="animate-spin h-10 w-10 rounded-full border-4 border-purple-100 border-t-purple-500"></div>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-700">
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Flight</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Route</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Schedule</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Duration</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Price</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Seats</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Status</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-500 dark:text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFlights.map((flight) => (
                    <tr 
                      key={flight.id} 
                      className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-md bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 dark:text-purple-400">
                            <Plane className="h-6 w-6" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-800 dark:text-gray-200">{flight.flight_number}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {flight.airline}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-700 dark:text-gray-300">{flight.departure.code}</span>
                          <ArrowRight className="h-3 w-3 text-gray-400" />
                          <span className="font-medium text-gray-700 dark:text-gray-300">{flight.arrival.code}</span>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {flight.departure.city} to {flight.arrival.city}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-gray-700 dark:text-gray-300">
                          {flight.departure.date} · {flight.departure.time}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Arr: {flight.arrival.time}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {flight.duration}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          ${flight.price.toFixed(2)}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {flight.seats_available > 0 ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/10 dark:text-green-400 dark:border-green-800">
                            {flight.seats_available} available
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 dark:bg-red-900/10 dark:text-red-400 dark:border-red-800">
                            Sold out
                          </Badge>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {getStatusBadge(flight.status)}
                      </td>
                      <td className="px-4 py-3 text-right">
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
                              onClick={() => navigate(`/dashboard/flights-enhanced/${flight.id}`)}
                              className="cursor-pointer"
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => navigate(`/dashboard/flights-enhanced/${flight.id}/edit`)}
                              className="cursor-pointer"
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleDeleteFlight(flight.id)}
                              className="text-red-600 focus:text-red-600 cursor-pointer"
                            >
                              <Trash className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
        <CardFooter className="border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 py-3">
          <div className="flex items-center justify-between w-full">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Showing {filteredFlights.length} of {flights.length} flights
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                <ChevronDown className="h-4 w-4 rotate-90" />
              </Button>
              <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                <ChevronDown className="h-4 w-4 -rotate-90" />
              </Button>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
