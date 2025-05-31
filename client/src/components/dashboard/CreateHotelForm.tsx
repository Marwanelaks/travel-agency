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
  is_active: z.boolean().default(true),
  image_url: z.string().optional(),
});

type FormData = z.infer<typeof hotelFormSchema>;

// Available amenities
const amenitiesOptions = [
  { id: 'wifi', label: 'WiFi', icon: <Wifi className="h-4 w-4 mr-2 text-blue-500" /> },
  { id: 'parking', label: 'Parking', icon: <Car className="h-4 w-4 mr-2 text-blue-500" /> },
  { id: 'pool', label: 'Swimming Pool', icon: <Waves className="h-4 w-4 mr-2 text-blue-500" /> },
  { id: 'restaurant', label: 'Restaurant', icon: <Utensils className="h-4 w-4 mr-2 text-blue-500" /> },
  { id: 'spa', label: 'Spa', icon: <Bath className="h-4 w-4 mr-2 text-blue-500" /> },
  { id: 'breakfast', label: 'Breakfast', icon: <Coffee className="h-4 w-4 mr-2 text-blue-500" /> },
  { id: 'tv', label: 'Smart TV', icon: <Tv className="h-4 w-4 mr-2 text-blue-500" /> },
  { id: 'ac', label: 'Air Conditioning', icon: <Wind className="h-4 w-4 mr-2 text-blue-500" /> },
];

export function CreateHotelForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Initialize form with default values
  const form = useForm<FormData>({
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
      image_url: "",
    },
  });

  // Form submission handler
  async function onSubmit(data: z.infer<typeof hotelFormSchema>) {
    try {
      setIsSubmitting(true);
      
      // Simulate API call with a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, this would be an API call
      // await axios.post('/api/hotels', data);
      
      console.log('Hotel created:', data);
      
      toast({
        title: "Hotel Created",
        description: "Your hotel has been successfully created.",
        variant: "default",
      });
      
      // Navigate back to hotels list
      navigate('/dashboard/hotels-enhanced');
    } catch (error) {
      console.error('Error creating hotel:', error);
      toast({
        title: "Error",
        description: "Failed to create the hotel. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  // Star rating component
  const StarRating = ({ rating }: { rating: number }) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Add New Hotel</h2>
          <p className="text-muted-foreground">Create a new hotel property in your inventory</p>
        </div>
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
          <CardDescription>Enter the details of your new hotel property</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hotel Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter hotel name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                          <Input className="pl-9" placeholder="City, Country" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="rating"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Star Rating</FormLabel>
                      <Select 
                        onValueChange={(value) => field.onChange(parseInt(value))} 
                        defaultValue={field.value.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select star rating" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1">
                            <div className="flex items-center">
                              <StarRating rating={1} />
                              <span className="ml-2">1 Star</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="2">
                            <div className="flex items-center">
                              <StarRating rating={2} />
                              <span className="ml-2">2 Stars</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="3">
                            <div className="flex items-center">
                              <StarRating rating={3} />
                              <span className="ml-2">3 Stars</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="4">
                            <div className="flex items-center">
                              <StarRating rating={4} />
                              <span className="ml-2">4 Stars</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="5">
                            <div className="flex items-center">
                              <StarRating rating={5} />
                              <span className="ml-2">5 Stars</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="rooms"
                  render={({ field }) => (
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
                  name="price_range"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price Range</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select price range" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="budget">
                            <div className="flex items-center">
                              <DollarSign className="h-4 w-4 mr-1 text-green-500" />
                              <span>Budget</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="moderate">
                            <div className="flex items-center">
                              <div className="flex">
                                <DollarSign className="h-4 w-4 text-green-500" />
                                <DollarSign className="h-4 w-4 text-green-500" />
                              </div>
                              <span className="ml-1">Moderate</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="luxury">
                            <div className="flex items-center">
                              <div className="flex">
                                <DollarSign className="h-4 w-4 text-green-500" />
                                <DollarSign className="h-4 w-4 text-green-500" />
                                <DollarSign className="h-4 w-4 text-green-500" />
                              </div>
                              <span className="ml-1">Luxury</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="premium">
                            <div className="flex items-center">
                              <div className="flex">
                                <DollarSign className="h-4 w-4 text-green-500" />
                                <DollarSign className="h-4 w-4 text-green-500" />
                                <DollarSign className="h-4 w-4 text-green-500" />
                                <DollarSign className="h-4 w-4 text-green-500" />
                              </div>
                              <span className="ml-1">Premium</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="image_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URL <span className="text-gray-400 text-sm">(optional)</span></FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/image.jpg" {...field} />
                      </FormControl>
                      <FormDescription className="text-xs">
                        Provide a URL to the hotel's featured image
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
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
                  name="amenities"
                  render={() => (
                    <FormItem className="md:col-span-2">
                      <div className="mb-4">
                        <FormLabel>Amenities</FormLabel>
                        <FormDescription>
                          Select the amenities available at this hotel
                        </FormDescription>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                        {amenitiesOptions.map((amenity) => (
                          <FormField
                            key={amenity.id}
                            control={form.control}
                            name="amenities"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={amenity.id}
                                  className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-gray-200 dark:border-gray-700 p-3"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(amenity.id)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, amenity.id])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== amenity.id
                                              )
                                            )
                                      }}
                                    />
                                  </FormControl>
                                  <div className="flex items-center space-y-0 leading-none">
                                    {amenity.icon}
                                    <span>{amenity.label}</span>
                                  </div>
                                </FormItem>
                              )
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="is_active"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 md:col-span-2 p-4 rounded-md border border-gray-200 dark:border-gray-700">
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
                          <span>Active Hotel</span>
                        </div>
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-base">Hotel Status</FormLabel>
                        <FormDescription>
                          Active hotels will be visible to customers for booking
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
                  onClick={() => navigate('/dashboard/hotels-enhanced')}
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
                    'Create Hotel'
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
