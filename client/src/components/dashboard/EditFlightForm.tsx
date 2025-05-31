import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useToast } from '@/components/ui/use-toast';
import { 
  Plane, 
  ArrowLeft,
  Check,
  Loader2,
  ArrowRight,
  Calendar,
  Clock,
  Building,
  MapPin,
  Timer,
  DollarSign
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';

// Form schema validation
const flightFormSchema = z.object({
  flight_number: z.string().min(2, { message: "Flight number is required." }),
  airline: z.string().min(2, { message: "Airline name is required." }),
  departure: z.object({
    airport: z.string().min(2, { message: "Departure airport is required." }),
    code: z.string().min(3, { message: "Airport code is required." }).max(3, { message: "Airport code must be 3 characters." }),
    city: z.string().min(2, { message: "City is required." }),
    date: z.string().min(2, { message: "Departure date is required." }),
    time: z.string().min(2, { message: "Departure time is required." }),
  }),
  arrival: z.object({
    airport: z.string().min(2, { message: "Arrival airport is required." }),
    code: z.string().min(3, { message: "Airport code is required." }).max(3, { message: "Airport code must be 3 characters." }),
    city: z.string().min(2, { message: "City is required." }),
    date: z.string().min(2, { message: "Arrival date is required." }),
    time: z.string().min(2, { message: "Arrival time is required." }),
  }),
  duration: z.string().min(2, { message: "Duration is required." }),
  original_price: z.coerce.number().positive({ message: "Original price must be a positive number." }),
  sale_price: z.coerce.number().positive({ message: "Sale price must be a positive number." }),
  price: z.coerce.number().positive({ message: "Price must be a positive number." })
    .optional()
    .transform(val => val || 0),
  seats_available: z.coerce.number().min(0, { message: "Seats available must be a non-negative number." }),
  status: z.enum(["scheduled", "in-air", "delayed", "cancelled", "completed"], {
    required_error: "Please select a flight status.",
  }),
}).refine((data) => {
  // Ensure sale price is less than or equal to original price
  return data.sale_price <= data.original_price;
}, {
  message: "Sale price cannot be greater than original price",
  path: ["sale_price"],
});

type FormData = z.infer<typeof flightFormSchema>;

// Mock flight data for demo purposes
const mockFlights = [
  {
    id: 1,
    flight_number: "AA1234",
    airline: "American Airlines",
    departure: {
      airport: "Los Angeles International Airport",
      code: "LAX",
      city: "Los Angeles",
      date: "2025-07-15",
      time: "08:30"
    },
    arrival: {
      airport: "John F. Kennedy International Airport",
      code: "JFK",
      city: "New York",
      date: "2025-07-15",
      time: "16:45"
    },
    duration: "5h 15m",
    price: 499.99,
    original_price: 649.99,
    sale_price: 499.99,
    seats_available: 42,
    status: "scheduled"
  },
  {
    id: 2,
    flight_number: "BA472",
    airline: "British Airways",
    departure: {
      airport: "Heathrow Airport",
      code: "LHR",
      city: "London",
      date: "2025-07-20",
      time: "14:15"
    },
    arrival: {
      airport: "Dubai International Airport",
      code: "DXB",
      city: "Dubai",
      date: "2025-07-21",
      time: "00:30"
    },
    duration: "7h 15m",
    price: 759.99,
    original_price: 899.99,
    sale_price: 759.99,
    seats_available: 18,
    status: "scheduled"
  },
  {
    id: 3,
    flight_number: "EK211",
    airline: "Emirates",
    departure: {
      airport: "Dubai International Airport",
      code: "DXB",
      city: "Dubai",
      date: "2025-08-05",
      time: "02:30"
    },
    arrival: {
      airport: "Sydney Airport",
      code: "SYD",
      city: "Sydney",
      date: "2025-08-05",
      time: "22:15"
    },
    duration: "13h 45m",
    price: 1299.99,
    original_price: 1599.99,
    sale_price: 1299.99,
    seats_available: 5,
    status: "scheduled"
  }
];

export function EditFlightForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { id } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [flight, setFlight] = useState<any>(null);
  
  // Fetch flight data
  useEffect(() => {
    const fetchFlight = async () => {
      try {
        setIsLoading(true);
        
        // In a real app, this would be an API call
        // const response = await axios.get(`/api/flights/${id}`);
        // const flightData = response.data;
        
        // For this example, we'll use mock data
        const flightData = mockFlights.find(f => f.id === Number(id));
        
        if (!flightData) {
          toast({
            title: "Error",
            description: "Flight not found",
            variant: "destructive"
          });
          navigate('/dashboard/flights-enhanced');
          return;
        }
        
        setFlight(flightData);
        
        // Initialize form with flight data
        form.reset({
          flight_number: flightData.flight_number,
          airline: flightData.airline,
          departure: {
            airport: flightData.departure.airport,
            code: flightData.departure.code,
            city: flightData.departure.city,
            date: flightData.departure.date,
            time: flightData.departure.time,
          },
          arrival: {
            airport: flightData.arrival.airport,
            code: flightData.arrival.code,
            city: flightData.arrival.city,
            date: flightData.arrival.date,
            time: flightData.arrival.time,
          },
          duration: flightData.duration,
          original_price: flightData.original_price || flightData.price,
          sale_price: flightData.sale_price || flightData.price,
          price: flightData.price,
          seats_available: flightData.seats_available,
          status: flightData.status as "scheduled" | "in-air" | "delayed" | "cancelled" | "completed",
        });
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching flight:', error);
        toast({
          title: "Error",
          description: "Failed to load flight data. Please try again.",
          variant: "destructive"
        });
        navigate('/dashboard/flights-enhanced');
      }
    };
    
    fetchFlight();
  }, [id, navigate, toast]);
  
  type FlightFormValues = z.infer<typeof flightFormSchema>;

  // Initialize form with validation
  const form = useForm<FlightFormValues>({
    resolver: zodResolver(flightFormSchema),
    defaultValues: {
      flight_number: "",
      airline: "",
      departure: {
        airport: "",
        code: "",
        city: "",
        date: "",
        time: "",
      },
      arrival: {
        airport: "",
        code: "",
        city: "",
        date: "",
        time: "",
      },
      duration: "",
      original_price: 0,
      sale_price: 0,
      price: 0,
      seats_available: 0,
      status: "scheduled" as const,
    },
  });

  // Form submission handler
  async function onSubmit(values: z.infer<typeof flightFormSchema>) {
    try {
      setIsSubmitting(true);
      
      // Ensure price is set to the sale price for backward compatibility
      const submissionData = {
        ...values,
        price: values.sale_price // Set price to match sale_price for backward compatibility
      };
      
      // Calculate discount percentage for display
      const discountPercentage = values.original_price > 0 
        ? Math.round((1 - (values.sale_price / values.original_price)) * 100) 
        : 0;
      
      // Simulate API call with a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, this would be an API call
      // await axios.put(`/api/flights/${id}`, submissionData);
      
      console.log('Flight updated:', submissionData);
      console.log(`Discount applied: ${discountPercentage}%`);
      
      toast({
        title: "Flight Updated",
        description: `Your flight has been successfully updated${discountPercentage > 0 ? ` with a ${discountPercentage}% discount` : ''}.`,
        variant: "default",
      });
      
      // Navigate back to flights list
      navigate('/dashboard/flights-enhanced');
    } catch (error) {
      console.error('Error updating flight:', error);
      toast({
        title: "Error",
        description: "Failed to update the flight. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[500px]">
        <div className="flex flex-col items-center gap-2">
          <div className="animate-spin h-10 w-10 rounded-full border-4 border-indigo-100 border-t-indigo-500"></div>
          <p className="text-gray-500 dark:text-gray-400">Loading flight data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Edit Flight</h2>
        <Button 
          variant="outline" 
          onClick={() => navigate('/dashboard/flights-enhanced')}
          className="flex items-center gap-1"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Flights
        </Button>
      </div>
      
      <Card className="border-none shadow-md overflow-hidden bg-white dark:bg-gray-800">
        <CardHeader className="border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
          <CardTitle className="text-xl">Flight Information</CardTitle>
          <CardDescription>Update the details of your flight</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="flight_number"
                  render={({ field }: { field: any }) => (
                    <FormItem>
                      <FormLabel>Flight Number</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Plane className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                          <Input className="pl-9" placeholder="e.g. AA1234" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="airline"
                  render={({ field }: { field: any }) => (
                    <FormItem>
                      <FormLabel>Airline</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter airline name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="border rounded-md p-4 space-y-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Departure Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="departure.airport"
                    render={({ field }: { field: any }) => (
                      <FormItem>
                        <FormLabel>Departure Airport</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                            <Input className="pl-9" placeholder="Enter airport name" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="departure.code"
                    render={({ field }: { field: any }) => (
                      <FormItem>
                        <FormLabel>Airport Code</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g. LAX" 
                            {...field} 
                            maxLength={3}
                            className="uppercase"
                            onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="departure.city"
                    render={({ field }: { field: any }) => (
                      <FormItem>
                        <FormLabel>Departure City</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                            <Input className="pl-9" placeholder="Enter city name" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-2">
                    <FormField
                      control={form.control}
                      name="departure.date"
                      render={({ field }: { field: any }) => (
                        <FormItem>
                          <FormLabel>Departure Date</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                              <Input className="pl-9" type="date" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="departure.time"
                      render={({ field }: { field: any }) => (
                        <FormItem>
                          <FormLabel>Departure Time</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                              <Input className="pl-9" type="time" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
              
              <div className="border rounded-md p-4 space-y-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Arrival Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="arrival.airport"
                    render={({ field }: { field: any }) => (
                      <FormItem>
                        <FormLabel>Arrival Airport</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                            <Input className="pl-9" placeholder="Enter airport name" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="arrival.code"
                    render={({ field }: { field: any }) => (
                      <FormItem>
                        <FormLabel>Airport Code</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g. JFK" 
                            {...field} 
                            maxLength={3}
                            className="uppercase"
                            onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="arrival.city"
                    render={({ field }: { field: any }) => (
                      <FormItem>
                        <FormLabel>Arrival City</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                            <Input className="pl-9" placeholder="Enter city name" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-2">
                    <FormField
                      control={form.control}
                      name="arrival.date"
                      render={({ field }: { field: any }) => (
                        <FormItem>
                          <FormLabel>Arrival Date</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                              <Input className="pl-9" type="date" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="arrival.time"
                      render={({ field }: { field: any }) => (
                        <FormItem>
                          <FormLabel>Arrival Time</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                              <Input className="pl-9" type="time" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }: { field: any }) => (
                    <FormItem>
                      <FormLabel>Flight Duration</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Timer className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                          <Input className="pl-9" placeholder="e.g. 5h 30m" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="original_price"
                  render={({ field }: { field: any }) => (
                    <FormItem>
                      <FormLabel>Original Price (USD)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                          <Input 
                            type="number" 
                            min="0" 
                            step="0.01" 
                            className="pl-8" 
                            {...field} 
                            onChange={(e) => {
                              field.onChange(e);
                              // Auto-update sale price if it's empty or higher than original price
                              const originalPrice = parseFloat(e.target.value);
                              const salePrice = form.getValues('sale_price');
                              if (!salePrice || salePrice > originalPrice) {
                                form.setValue('sale_price', originalPrice);
                              }
                            }}
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Regular price before any discounts
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="sale_price"
                  render={({ field }: { field: any }) => (
                    <FormItem>
                      <FormLabel>Sale Price (USD)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                          <Input 
                            type="number" 
                            min="0" 
                            step="0.01" 
                            className="pl-8" 
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Current selling price
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="seats_available"
                  render={({ field }: { field: any }) => (
                    <FormItem>
                      <FormLabel>Seats Available</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0" 
                          {...field} 
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }: { field: any }) => (
                    <FormItem>
                      <FormLabel>Flight Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select flight status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="scheduled">Scheduled</SelectItem>
                          <SelectItem value="in-air">In Air</SelectItem>
                          <SelectItem value="delayed">Delayed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/dashboard/flights-enhanced')}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving Changes...
                    </>
                  ) : (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
