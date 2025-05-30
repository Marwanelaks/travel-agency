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
  Plane, 
  Search, 
  Plus, 
  MoreHorizontal, 
  Edit, 
  Trash, 
  Eye,
  ArrowUpDown,
  Calendar,
  Clock,
  MapPin
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { DataTable } from '@/components/ui/data-table-a11y';
import { ColumnDef } from '@tanstack/react-table';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

// Flight type definition
interface Flight {
  id: number;
  flight_number: string;
  airline: string;
  departure_airport: string;
  departure_city: string;
  arrival_airport: string;
  arrival_city: string;
  departure_time: string;
  arrival_time: string;
  duration: string;
  price: number;
  available_seats: number;
  aircraft_type?: string;
  status: 'scheduled' | 'delayed' | 'cancelled' | 'boarding' | 'in-flight' | 'arrived';
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

// Mock data for flights
const mockFlights: Flight[] = [
  {
    id: 1,
    flight_number: 'FL1234',
    airline: 'SkyWings',
    departure_airport: 'JFK',
    departure_city: 'New York',
    arrival_airport: 'LAX',
    arrival_city: 'Los Angeles',
    departure_time: '2025-06-15T08:00:00',
    arrival_time: '2025-06-15T11:30:00',
    duration: '3h 30m',
    price: 299.99,
    available_seats: 45,
    aircraft_type: 'Boeing 737',
    status: 'scheduled',
    is_active: true,
    created_at: '2025-05-01T10:00:00',
    updated_at: '2025-05-15T14:30:00'
  },
  {
    id: 2,
    flight_number: 'FL5678',
    airline: 'Global Airways',
    departure_airport: 'LHR',
    departure_city: 'London',
    arrival_airport: 'CDG',
    arrival_city: 'Paris',
    departure_time: '2025-06-20T14:15:00',
    arrival_time: '2025-06-20T16:45:00',
    duration: '1h 30m',
    price: 189.50,
    available_seats: 28,
    aircraft_type: 'Airbus A320',
    status: 'scheduled',
    is_active: true,
    created_at: '2025-05-02T09:15:00',
    updated_at: '2025-05-16T11:20:00'
  },
  {
    id: 3,
    flight_number: 'FL9012',
    airline: 'SunExpress',
    departure_airport: 'DXB',
    departure_city: 'Dubai',
    arrival_airport: 'SIN',
    arrival_city: 'Singapore',
    departure_time: '2025-06-22T23:45:00',
    arrival_time: '2025-06-23T11:30:00',
    duration: '7h 45m',
    price: 649.99,
    available_seats: 12,
    aircraft_type: 'Boeing 787',
    status: 'scheduled',
    is_active: true,
    created_at: '2025-05-03T16:40:00',
    updated_at: '2025-05-17T09:10:00'
  },
  {
    id: 4,
    flight_number: 'FL3456',
    airline: 'MountainJet',
    departure_airport: 'SFO',
    departure_city: 'San Francisco',
    arrival_airport: 'YVR',
    arrival_city: 'Vancouver',
    departure_time: '2025-06-25T10:30:00',
    arrival_time: '2025-06-25T13:15:00',
    duration: '2h 45m',
    price: 275.00,
    available_seats: 35,
    aircraft_type: 'Airbus A321',
    status: 'delayed',
    is_active: true,
    created_at: '2025-05-04T13:20:00',
    updated_at: '2025-05-18T15:45:00'
  },
  {
    id: 5,
    flight_number: 'FL7890',
    airline: 'OceanAir',
    departure_airport: 'SYD',
    departure_city: 'Sydney',
    arrival_airport: 'MEL',
    arrival_city: 'Melbourne',
    departure_time: '2025-06-30T07:15:00',
    arrival_time: '2025-06-30T08:50:00',
    duration: '1h 35m',
    price: 149.00,
    available_seats: 20,
    aircraft_type: 'Boeing 737',
    status: 'cancelled',
    is_active: false,
    created_at: '2025-05-05T08:30:00',
    updated_at: '2025-05-19T10:15:00'
  }
];

// Flight form data type
interface FlightFormData {
  flight_number: string;
  airline: string;
  departure_airport: string;
  departure_city: string;
  arrival_airport: string;
  arrival_city: string;
  departure_time: string;
  arrival_time: string;
  price: string;
  available_seats: string;
  aircraft_type: string;
  status: string;
  is_active: boolean;
}

export function FlightsPage() {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentFlight, setCurrentFlight] = useState<Flight | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  // Form state
  const [flightData, setFlightData] = useState<FlightFormData>({
    flight_number: '',
    airline: '',
    departure_airport: '',
    departure_city: '',
    arrival_airport: '',
    arrival_city: '',
    departure_time: '',
    arrival_time: '',
    price: '',
    available_seats: '',
    aircraft_type: '',
    status: 'scheduled',
    is_active: true
  });

  // Fetch flights data
  useEffect(() => {
    const fetchFlights = async () => {
      try {
        setLoading(true);
        // In a real app, this would be an API call
        // const response = await axios.get('/api/flights');
        // setFlights(response.data);
        
        // Using mock data for now
        setTimeout(() => {
          setFlights(mockFlights);
          setLoading(false);
        }, 800);
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

  // Column definitions for the data table
  const columns: ColumnDef<Flight>[] = [
    {
      accessorKey: "flight_number",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Flight
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Plane className="h-4 w-4 text-muted-foreground" />
          <div>
            <div className="font-medium">{row.original.flight_number}</div>
            <div className="text-xs text-muted-foreground">{row.original.airline}</div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "route",
      header: "Route",
      cell: ({ row }) => (
        <div>
          <div className="flex items-center">
            <MapPin className="h-3 w-3 mr-1 text-muted-foreground" />
            <span>{row.original.departure_city} ({row.original.departure_airport})</span>
          </div>
          <div className="flex items-center mt-1">
            <MapPin className="h-3 w-3 mr-1 text-muted-foreground" />
            <span>{row.original.arrival_city} ({row.original.arrival_airport})</span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "departure_time",
      header: "Departure",
      cell: ({ row }) => {
        const departureDate = new Date(row.original.departure_time);
        return (
          <div className="flex items-center">
            <Calendar className="mr-1 h-4 w-4 text-muted-foreground" />
            <span>
              {departureDate.toLocaleDateString()} {departureDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "duration",
      header: "Duration",
      cell: ({ row }) => (
        <div className="flex items-center">
          <Clock className="mr-1 h-4 w-4 text-muted-foreground" />
          <span>{row.original.duration}</span>
        </div>
      ),
    },
    {
      accessorKey: "price",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Price
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
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        let variant: "default" | "success" | "destructive" | "outline" | "secondary" = "default";
        
        switch(status) {
          case 'scheduled':
            variant = "default";
            break;
          case 'boarding':
          case 'in-flight':
            variant = "success";
            break;
          case 'delayed':
            variant = "secondary";
            break;
          case 'cancelled':
            variant = "destructive";
            break;
          case 'arrived':
            variant = "outline";
            break;
        }
        
        return (
          <Badge variant={variant} className="capitalize">
            {status}
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
            <DropdownMenuItem onClick={() => handleViewFlight(row.original.id)}>
              <Eye className="mr-2 h-4 w-4" />
              View details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleEditFlight(row.original)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleDeleteFlight(row.original.id)} className="text-red-600">
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  // Filter flights based on search term and status
  const filteredFlights = flights.filter(flight => {
    const matchesSearch = 
      flight.flight_number.toLowerCase().includes(searchTerm.toLowerCase()) || 
      flight.airline.toLowerCase().includes(searchTerm.toLowerCase()) ||
      flight.departure_city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      flight.arrival_city.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || flight.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Handler functions
  const handleAddFlight = () => {
    setCurrentFlight(null);
    setFlightData({
      flight_number: '',
      airline: '',
      departure_airport: '',
      departure_city: '',
      arrival_airport: '',
      arrival_city: '',
      departure_time: '',
      arrival_time: '',
      price: '',
      available_seats: '',
      aircraft_type: '',
      status: 'scheduled',
      is_active: true
    });
    setIsDialogOpen(true);
  };
  
  const handleViewFlight = (id: number) => {
    // In a real app, this would navigate to a flight detail page
    const flight = flights.find(f => f.id === id);
    if (flight) {
      toast({
        title: `Flight ${flight.flight_number}`,
        description: `${flight.airline} flight from ${flight.departure_city} to ${flight.arrival_city}`,
      });
    }
  };
  
  const handleEditFlight = (flight: Flight) => {
    setCurrentFlight(flight);
    
    // Format dates for datetime-local input
    const departureTime = new Date(flight.departure_time)
      .toISOString()
      .slice(0, 16);
    
    const arrivalTime = new Date(flight.arrival_time)
      .toISOString()
      .slice(0, 16);
    
    setFlightData({
      flight_number: flight.flight_number,
      airline: flight.airline,
      departure_airport: flight.departure_airport,
      departure_city: flight.departure_city,
      arrival_airport: flight.arrival_airport,
      arrival_city: flight.arrival_city,
      departure_time: departureTime,
      arrival_time: arrivalTime,
      price: flight.price.toString(),
      available_seats: flight.available_seats.toString(),
      aircraft_type: flight.aircraft_type || '',
      status: flight.status,
      is_active: flight.is_active
    });
    
    setIsDialogOpen(true);
  };
  
  const handleDeleteFlight = (id: number) => {
    if (confirm('Are you sure you want to delete this flight?')) {
      // In a real app, this would call an API to delete the flight
      setFlights(flights.filter(flight => flight.id !== id));
      toast({
        title: "Flight deleted",
        description: "The flight has been successfully deleted.",
      });
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFlightData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFlightData(prev => ({
      ...prev,
      [name]: checked
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Calculate duration (in a real app, this would be more sophisticated)
    const departureTime = new Date(flightData.departure_time);
    const arrivalTime = new Date(flightData.arrival_time);
    const durationMs = arrivalTime.getTime() - departureTime.getTime();
    const durationHours = Math.floor(durationMs / (1000 * 60 * 60));
    const durationMinutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    const duration = `${durationHours}h ${durationMinutes}m`;
    
    setTimeout(() => {
      if (currentFlight) {
        // Update existing flight
        const updatedFlight: Flight = {
          ...currentFlight,
          flight_number: flightData.flight_number,
          airline: flightData.airline,
          departure_airport: flightData.departure_airport,
          departure_city: flightData.departure_city,
          arrival_airport: flightData.arrival_airport,
          arrival_city: flightData.arrival_city,
          departure_time: flightData.departure_time,
          arrival_time: flightData.arrival_time,
          duration,
          price: parseFloat(flightData.price),
          available_seats: parseInt(flightData.available_seats),
          aircraft_type: flightData.aircraft_type,
          status: flightData.status as 'scheduled' | 'delayed' | 'cancelled' | 'boarding' | 'in-flight' | 'arrived',
          is_active: flightData.is_active,
          updated_at: new Date().toISOString()
        };
        
        setFlights(prev => 
          prev.map(flight => flight.id === currentFlight.id ? updatedFlight : flight)
        );
        
        toast({
          title: "Flight updated",
          description: `Flight ${updatedFlight.flight_number} has been updated successfully.`,
        });
      } else {
        // Create new flight
        const newFlight: Flight = {
          id: Math.max(...flights.map(f => f.id)) + 1,
          flight_number: flightData.flight_number,
          airline: flightData.airline,
          departure_airport: flightData.departure_airport,
          departure_city: flightData.departure_city,
          arrival_airport: flightData.arrival_airport,
          arrival_city: flightData.arrival_city,
          departure_time: flightData.departure_time,
          arrival_time: flightData.arrival_time,
          duration,
          price: parseFloat(flightData.price),
          available_seats: parseInt(flightData.available_seats),
          aircraft_type: flightData.aircraft_type,
          status: flightData.status as 'scheduled' | 'delayed' | 'cancelled' | 'boarding' | 'in-flight' | 'arrived',
          is_active: flightData.is_active,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        setFlights(prev => [...prev, newFlight]);
        
        toast({
          title: "Flight created",
          description: `Flight ${newFlight.flight_number} has been created successfully.`,
        });
      }
      
      setIsDialogOpen(false);
      setIsSubmitting(false);
    }, 1000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Flights Management</h1>
        <Button onClick={handleAddFlight}>
          <Plus className="mr-2 h-4 w-4" />
          Add Flight
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>Flights</CardTitle>
            <CardDescription>
              Manage flight schedules, prices, and availability
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Search flights, airlines, cities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
                icon={<Search className="h-4 w-4 text-muted-foreground" />}
              />
            </div>
            <div className="w-full md:w-[200px]">
              <Select
                value={filterStatus}
                onValueChange={setFilterStatus}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="boarding">Boarding</SelectItem>
                  <SelectItem value="in-flight">In Flight</SelectItem>
                  <SelectItem value="delayed">Delayed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="arrived">Arrived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DataTable 
            columns={columns} 
            data={filteredFlights} 
            ariaLabel="Flights table"
            searchKey="flight_number" 
          />
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {currentFlight ? `Edit Flight ${currentFlight.flight_number}` : 'Add New Flight'}
            </DialogTitle>
            <DialogDescription>
              {currentFlight 
                ? "Update the flight details below." 
                : "Fill in the details for the new flight."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="flight_number">Flight Number</Label>
                  <Input
                    id="flight_number"
                    name="flight_number"
                    value={flightData.flight_number}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="airline">Airline</Label>
                  <Input
                    id="airline"
                    name="airline"
                    value={flightData.airline}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="departure_city">Departure City</Label>
                  <Input
                    id="departure_city"
                    name="departure_city"
                    value={flightData.departure_city}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="departure_airport">Departure Airport</Label>
                  <Input
                    id="departure_airport"
                    name="departure_airport"
                    value={flightData.departure_airport}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="arrival_city">Arrival City</Label>
                  <Input
                    id="arrival_city"
                    name="arrival_city"
                    value={flightData.arrival_city}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="arrival_airport">Arrival Airport</Label>
                  <Input
                    id="arrival_airport"
                    name="arrival_airport"
                    value={flightData.arrival_airport}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="departure_time">Departure Time</Label>
                  <Input
                    id="departure_time"
                    name="departure_time"
                    type="datetime-local"
                    value={flightData.departure_time}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="arrival_time">Arrival Time</Label>
                  <Input
                    id="arrival_time"
                    name="arrival_time"
                    type="datetime-local"
                    value={flightData.arrival_time}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="price">Price ($)</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={flightData.price}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="available_seats">Available Seats</Label>
                  <Input
                    id="available_seats"
                    name="available_seats"
                    type="number"
                    min="0"
                    value={flightData.available_seats}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="aircraft_type">Aircraft Type</Label>
                  <Input
                    id="aircraft_type"
                    name="aircraft_type"
                    value={flightData.aircraft_type}
                    onChange={handleInputChange}
                    placeholder="e.g., Boeing 737"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={flightData.status}
                    onValueChange={(value) => 
                      setFlightData(prev => ({ ...prev, status: value }))
                    }
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="boarding">Boarding</SelectItem>
                      <SelectItem value="in-flight">In Flight</SelectItem>
                      <SelectItem value="delayed">Delayed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                      <SelectItem value="arrived">Arrived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2 pt-8">
                  <input
                    type="checkbox"
                    id="is_active"
                    name="is_active"
                    checked={flightData.is_active}
                    onChange={handleCheckboxChange}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="is_active">Active flight (available for booking)</Label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting 
                  ? "Saving..." 
                  : currentFlight ? "Update Flight" : "Create Flight"
                }
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
