import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
  Building, 
  MapPin, 
  ArrowLeft,
  Star,
  BedDouble,
  Check,
  Loader2,
  DollarSign,
  Wifi,
  Bath,
  Coffee,
  Utensils,
  Car,
  Waves,
  Tv,
  Wind
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';

// Form schema validation
const hotelFormSchema = z.object({
  name: z.string().min(3, { message: "Hotel name must be at least 3 characters." }),
  location: z.string().min(2, { message: "Location is required." }),
  rating: z.coerce.number().min(1, { message: "Rating must be between 1 and 5." }).max(5, { message: "Rating must be between 1 and 5." }),
  rooms: z.coerce.number().min(1, { message: "Number of rooms must be at least 1." }),
  price_range: z.string({ required_error: "Price range is required." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  amenities: z.array(z.string()).min(1, { message: "Select at least one amenity." }),
  is_active: z.boolean().default(true)
});

type FormData = z.infer<typeof hotelFormSchema>;

// Available amenities
const amenitiesOptions = [
  { id: 'wifi', label: 'WiFi', icon: <Wifi className="h-4 w-4 mr-2 text-blue-500" /> },
  { id: 'parking', label: 'Parking', icon: <Car className="h-4 w-4 mr-2 text-blue-500" /> },
  { id: 'pool', label: 'Swimming Pool', icon: <Waves className="h-4 w-4 mr-2 text-blue-500" /> },
  { id: 'spa', label: 'Spa', icon: <Bath className="h-4 w-4 mr-2 text-blue-500" /> },
  { id: 'restaurant', label: 'Restaurant', icon: <Utensils className="h-4 w-4 mr-2 text-blue-500" /> },
  { id: 'breakfast', label: 'Breakfast', icon: <Coffee className="h-4 w-4 mr-2 text-blue-500" /> },
  { id: 'tv', label: 'Smart TV', icon: <Tv className="h-4 w-4 mr-2 text-blue-500" /> },
  { id: 'ac', label: 'Air Conditioning', icon: <Wind className="h-4 w-4 mr-2 text-blue-500" /> }
];

// Mock hotel data for demo purposes
const mockHotels = [
  {
    id: 1,
    name: "Grand Hyatt Resort",
    location: "Maldives",
    rating: 5,
    rooms: 200,
    price_range: "$$$",
    description: "Luxury beachfront resort with stunning ocean views",
    amenities: ["wifi", "pool", "spa", "restaurant", "breakfast", "ac"],
    is_active: true,
    created_at: "2025-01-15T08:00:00Z",
    image_url: "https://example.com/grand-hyatt.jpg"
  },
  {
    id: 2,
    name: "City Center Hotel",
    location: "New York",
    rating: 4,
    rooms: 150,
    price_range: "$$",
    description: "Modern hotel in the heart of Manhattan",
    amenities: ["wifi", "parking", "tv", "ac"],
    is_active: true,
    created_at: "2025-02-20T10:30:00Z"
  },
  {
    id: 3,
    name: "Mountain Lodge",
    location: "Swiss Alps",
    rating: 4,
    rooms: 80,
    price_range: "$$$",
    description: "Cozy mountain retreat with ski-in/ski-out access",
    amenities: ["wifi", "spa", "restaurant", "parking"],
    is_active: false,
    created_at: "2025-03-10T14:15:00Z"
  }
];

export function EditHotelForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { id } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hotel, setHotel] = useState<any>(null);
  
  // Fetch hotel data
  useEffect(() => {
    const fetchHotel = async () => {
      try {
        setIsLoading(true);
        
        // In a real app, this would be an API call
        // const response = await axios.get(`/api/hotels/${id}`);
        // const hotelData = response.data;
        
        // For this example, we'll use mock data
        const hotelData = mockHotels.find(h => h.id === Number(id));
        
        if (!hotelData) {
          toast({
            title: "Error",
            description: "Hotel not found",
            variant: "destructive"
          });
          navigate('/dashboard/hotels-enhanced');
          return;
        }
        
        setHotel(hotelData);
        
        // Initialize form with hotel data
        form.reset({
          name: hotelData.name,
          location: hotelData.location,
          rating: hotelData.rating,
          rooms: hotelData.rooms,
          price_range: hotelData.price_range,
          description: hotelData.description,
          amenities: hotelData.amenities,
          is_active: hotelData.is_active,
        });
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching hotel:', error);
        toast({
          title: "Error",
          description: "Failed to load hotel data. Please try again.",
          variant: "destructive"
        });
        navigate('/dashboard/hotels-enhanced');
      }
    };
    
    fetchHotel();
  }, [id, navigate, toast]);
  
  type HotelFormValues = z.infer<typeof hotelFormSchema>;

  // Initialize form with validation
  const form = useForm<HotelFormValues>({
    resolver: zodResolver(hotelFormSchema),
    defaultValues: {
      name: "",
      location: "",
      rating: 3,
      rooms: 1,
      price_range: "",
      description: "",
      amenities: [],
      is_active: true,
    },
  });

  // Form submission handler
  async function onSubmit(values: HotelFormValues) {
    try {
      setIsSubmitting(true);
      
      // Simulate API call with a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, this would be an API call
      // await axios.put(`/api/hotels/${id}`, values);
      
      console.log('Hotel updated:', values);
      
      toast({
        title: "Hotel Updated",
        description: "Your hotel has been successfully updated.",
        variant: "default",
      });
      
      // Navigate back to hotels list
      navigate('/dashboard/hotels-enhanced');
    } catch (error) {
      console.error('Error updating hotel:', error);
      toast({
        title: "Error",
        description: "Failed to update the hotel. Please try again.",
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
          <p className="text-gray-500 dark:text-gray-400">Loading hotel data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Edit Hotel</h2>
        <Button 
          variant="outline" 
          onClick={() => navigate('/dashboard/hotels-enhanced')}
          className="flex items-center gap-1"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Hotels
        </Button>
      </div>
      
      <Card className="border-none shadow-md overflow-hidden bg-white dark:bg-gray-800">
        <CardHeader className="border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
          <CardTitle className="text-xl">Hotel Information</CardTitle>
          <CardDescription>Update the details of your hotel property</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }: { field: any }) => (
                    <FormItem>
                      <FormLabel>Hotel Name</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                          <Input className="pl-9" placeholder="Enter hotel name" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }: { field: any }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                          <Input className="pl-9" placeholder="Enter location" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="rating"
                  render={({ field }: { field: any }) => (
                    <FormItem>
                      <FormLabel>Star Rating</FormLabel>
                      <Select onValueChange={(value) => field.onChange(parseInt(value))} defaultValue={field.value.toString()}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select star rating" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {[1, 2, 3, 4, 5].map((rating) => (
                            <SelectItem key={rating} value={rating.toString()}>
                              <div className="flex items-center">
                                {Array(rating).fill(0).map((_, i) => (
                                  <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                                ))}
                                {Array(5 - rating).fill(0).map((_, i) => (
                                  <Star key={i} className="h-4 w-4 text-gray-300" />
                                ))}
                                <span className="ml-2">{rating} Star</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="rooms"
                  render={({ field }: { field: any }) => (
                    <FormItem>
                      <FormLabel>Number of Rooms</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <BedDouble className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                          <Input
                            type="number"
                            min="1"
                            className="pl-9"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="price_range"
                  render={({ field }: { field: any }) => (
                    <FormItem>
                      <FormLabel>Price Range</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select price range" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="$">$ (Budget)</SelectItem>
                          <SelectItem value="$$">$$ (Standard)</SelectItem>
                          <SelectItem value="$$$">$$$ (Luxury)</SelectItem>
                          <SelectItem value="$$$$">$$$$ (Ultra Luxury)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="amenities"
                  render={({ field }: { field: any }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Amenities</FormLabel>
                      <FormDescription>Select all amenities offered by the hotel</FormDescription>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                        {amenitiesOptions.map((amenity) => (
                          <div key={amenity.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`amenity-${amenity.id}`}
                              checked={field.value?.includes(amenity.id)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, amenity.id])
                                  : field.onChange(field.value?.filter((value: string) => value !== amenity.id));
                              }}
                            />
                            <label
                              htmlFor={`amenity-${amenity.id}`}
                              className="flex items-center text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {amenity.icon}
                              {amenity.label}
                            </label>
                          </div>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }: { field: any }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter hotel description" 
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
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={field.onChange}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          />
                          <div className="space-y-1 leading-none">
                            <FormLabel>Active Status</FormLabel>
                            <FormDescription>
                              Show this hotel to customers
                            </FormDescription>
                          </div>
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/dashboard/hotels-enhanced')}
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
