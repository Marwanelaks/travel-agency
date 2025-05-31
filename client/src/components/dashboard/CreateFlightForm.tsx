import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
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
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, FormProvider } from 'react-hook-form';
import * as z from 'zod';
import { useToast } from '@/components/ui/use-toast';
import { 
  Plane, 
  MapPin, 
  ArrowLeft,
  Check,
  Loader2,
  DollarSign,
  Clock,
  Calendar,
  CalendarIcon,
  Luggage,
  Users,
  ArrowRightLeft
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

// Form schema validation
const flightFormSchema = z.object({
  flight_number: z.string().min(3, { message: "Flight number must be at least 3 characters." }),
  airline: z.string().min(2, { message: "Airline name is required." }),
  departure_city: z.string().min(2, { message: "Departure city is required." }),
  arrival_city: z.string().min(2, { message: "Arrival city is required." }),
  departure_date: z.date({ required_error: "Departure date is required." }),
  departure_time: z.string().min(1, { message: "Departure time is required." }),
  arrival_time: z.string().min(1, { message: "Arrival time is required." }),
  price: z.coerce.number().positive({ message: "Price must be a positive number." }),
  cabin_class: z.string({ required_error: "Cabin class is required." }),
  available_seats: z.coerce.number().int().positive({ message: "Available seats must be a positive number." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  is_active: z.boolean().default(true),
});

type FlightFormValues = z.infer<typeof flightFormSchema>;

// Remove duplicate type definition

export function CreateFlightForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Initialize form with default values
  const form = useForm<FlightFormValues>({
    resolver: zodResolver(flightFormSchema) as any, // Type assertion to fix TypeScript error
    defaultValues: {
      flight_number: "",
      airline: "",
      departure_city: "",
      arrival_city: "",
      departure_time: "",
      arrival_time: "",
      price: 0,
      cabin_class: "",
      available_seats: 100,
      description: "",
      is_active: true,
    },
  });

  // Form submission handler
  async function onSubmit(data: FlightFormValues) {
    try {
      setIsSubmitting(true);
      
      // Simulate API call with a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, this would be an API call
      // await axios.post('/api/flights', data);
      
      console.log('Flight created:', data);
      
      toast({
        title: "Flight Created",
        description: "Your flight has been successfully created.",
        variant: "default",
      });
      
      // Navigate back to flights list
      navigate('/dashboard/flights-enhanced');
    } catch (error) {
      console.error('Error creating flight:', error);
      toast({
        title: "Error",
        description: "Failed to create the flight. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Add New Flight</h2>
          <p className="text-muted-foreground">Create a new flight in your travel inventory</p>
        </div>
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
          <CardDescription>Enter the details of your new flight</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="flight_number"
                  render={({ field }: { field: any }) => (
                    <FormItem>
                      <FormLabel>Flight Number</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Plane className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                          <Input className="pl-9" placeholder="XY123" {...field} />
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
                        <Input placeholder="Airline name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cabin_class"
                  render={({ field }: { field: any }) => (
                    <FormItem>
                      <FormLabel>Cabin Class</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select cabin class" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="economy">Economy</SelectItem>
                          <SelectItem value="premium_economy">Premium Economy</SelectItem>
                          <SelectItem value="business">Business</SelectItem>
                          <SelectItem value="first">First Class</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="departure_city"
                  render={({ field }: { field: any }) => (
                    <FormItem>
                      <FormLabel>Departure City</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                          <Input className="pl-9" placeholder="City name" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="arrival_city"
                  render={({ field }: { field: any }) => (
                    <FormItem>
                      <FormLabel>Arrival City</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                          <Input className="pl-9" placeholder="City name" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex items-center justify-center">
                  <ArrowRightLeft className="h-6 w-6 text-gray-400" />
                </div>

                <FormField
                  control={form.control}
                  name="departure_date"
                  render={({ field }: { field: any }) => {
                    const [open, setOpen] = useState(false);
                    return (
                      <FormItem className="flex flex-col">
                        <FormLabel>Departure Date</FormLabel>
                        <Popover open={open} onOpenChange={setOpen}>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                                onClick={() => setOpen(true)}
                                type="button"
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start" onEscapeKeyDown={() => setOpen(false)}>
                            <CalendarComponent
                              mode="single"
                              selected={field.value}
                              onSelect={(date: Date | undefined) => {
                                field.onChange(date);
                                // Keep open briefly so user can see their selection
                                setTimeout(() => setOpen(false), 100);
                              }}
                              disabled={(date: Date) =>
                                date < new Date()
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />

                <FormField
                  control={form.control}
                  name="departure_time"
                  render={({ field }: { field: any }) => (
                    <FormItem>
                      <FormLabel>Departure Time</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                          <Input className="pl-9" placeholder="10:00 AM" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="arrival_time"
                  render={({ field }: { field: any }) => (
                    <FormItem>
                      <FormLabel>Arrival Time</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                          <Input className="pl-9" placeholder="12:00 PM" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }: { field: any }) => (
                    <FormItem>
                      <FormLabel>Price (USD)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            className="pl-8"
                            {...field}
                            onChange={(e) => field.onChange(e.target.valueAsNumber)}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="available_seats"
                  render={({ field }: { field: any }) => (
                    <FormItem>
                      <FormLabel>Available Seats</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                          <Input
                            type="number"
                            min="1"
                            className="pl-8"
                            {...field}
                            onChange={(e) => field.onChange(e.target.valueAsNumber)}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }: { field: any }) => (
                    <FormItem className="md:col-span-3">
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter flight description" 
                          className="h-32 resize-none" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="is_active"
                  render={({ field }: { field: any }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 md:col-span-3 p-4 rounded-md border border-gray-200 dark:border-gray-700">
                      <FormControl>
                        <div className="flex items-center space-x-2">
                          <div 
                            className={`h-6 w-6 rounded-full border flex items-center justify-center cursor-pointer ${
                              field.value 
                                ? 'bg-green-500 border-green-500 text-white' 
                                : 'bg-gray-100 border-gray-300 dark:bg-gray-800 dark:border-gray-600'
                            }`}
                            onClick={() => form.setValue('is_active', !field.value)}
                          >
                            {field.value && <Check className="h-4 w-4" />}
                          </div>
                          <span>Active Flight</span>
                        </div>
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-base">Flight Status</FormLabel>
                        <FormDescription>
                          Active flights will be visible to customers for booking
                        </FormDescription>
                      </div>
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
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Flight'
                  )}
                </Button>
              </div>
            </form>
          </FormProvider>
        </CardContent>
      </Card>
    </div>
  );
}
