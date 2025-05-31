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
  Hotel, 
  Plane, 
  Package, 
  Ticket, 
  Activity, 
  MapPin, 
  ArrowLeft,
  Check,
  Loader2,
  DollarSign
} from 'lucide-react';

// Form schema validation
const productFormSchema = z.object({
  name: z.string().min(3, { message: "Product name must be at least 3 characters." }),
  type: z.string({ required_error: "Please select a product type." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  original_price: z.coerce.number().positive({ message: "Original price must be a positive number." }),
  sale_price: z.coerce.number().positive({ message: "Sale price must be a positive number." }),
  price: z.coerce.number().positive({ message: "Price must be a positive number." })
    .optional()
    .transform(val => val || 0),
  location: z.string().min(2, { message: "Location is required." }),
  is_active: z.boolean().default(true),
}).refine((data) => {
  // Ensure sale price is less than or equal to original price
  return data.sale_price <= data.original_price;
}, {
  message: "Sale price cannot be greater than original price",
  path: ["sale_price"],
});

type FormData = z.infer<typeof productFormSchema>;

// Mock product data - in a real app, this would come from an API
const mockProducts = [
  {
    id: 1,
    name: 'Luxury Beach Resort',
    type: 'hotel',
    description: '5-star luxury resort with private beach access',
    price: 249.99,
    original_price: 349.99,
    sale_price: 249.99,
    location: 'Maldives',
    is_active: true,
    created_at: '2025-01-15T08:00:00.000Z'
  },
  {
    id: 2,
    name: 'Business Class Flight to Paris',
    type: 'flight',
    description: 'Round-trip business class flight to Paris',
    price: 999.99,
    original_price: 1299.99,
    sale_price: 999.99,
    location: 'Dubai',
    is_active: true,
    created_at: '2025-02-10T10:30:00.000Z'
  },
  {
    id: 3,
    name: 'Champions League Final',
    type: 'sport',
    description: 'Football match ticket for the UEFA Champions League Final',
    price: 349.99,
    original_price: 399.99,
    sale_price: 349.99,
    location: 'London',
    is_active: true,
    created_at: '2025-03-05T14:15:00.000Z'
  }
];

export function EditProductForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { id } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [product, setProduct] = useState<any>(null);
  
  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        
        // In a real app, this would be an API call
        // const response = await axios.get(`/api/products/${id}`);
        // const productData = response.data;
        
        // For this example, we'll use mock data
        const productData = mockProducts.find(p => p.id === Number(id));
        
        if (!productData) {
          toast({
            title: "Error",
            description: "Product not found",
            variant: "destructive"
          });
          navigate('/dashboard/products-enhanced');
          return;
        }
        
        setProduct(productData);
        
        // Initialize form with product data
        form.reset({
          name: productData.name,
          type: productData.type,
          description: productData.description,
          original_price: productData.original_price,
          sale_price: productData.sale_price,
          price: productData.price,
          location: productData.location,
          is_active: productData.is_active,
        });
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching product:', error);
        toast({
          title: "Error",
          description: "Failed to load product data. Please try again.",
          variant: "destructive"
        });
        navigate('/dashboard/products-enhanced');
      }
    };
    
    fetchProduct();
  }, [id, navigate, toast]);
  
  type ProductFormValues = z.infer<typeof productFormSchema>;

  // Initialize form with validation
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: "",
      type: "",
      description: "",
      original_price: 0,
      sale_price: 0,
      price: 0,
      location: "",
      is_active: true,
    },
  });

  // Form submission handler
  async function onSubmit(values: z.infer<typeof productFormSchema>) {
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
      // await axios.put(`/api/products/${id}`, submissionData);
      
      console.log('Product updated:', submissionData);
      console.log(`Discount applied: ${discountPercentage}%`);
      
      toast({
        title: "Product Updated",
        description: `Your product has been successfully updated${discountPercentage > 0 ? ` with a ${discountPercentage}% discount` : ''}.`,
        variant: "default",
      });
      
      // Navigate back to products list
      navigate('/dashboard/products-enhanced');
    } catch (error) {
      console.error('Error updating product:', error);
      toast({
        title: "Error",
        description: "Failed to update the product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  // Product type icon mapping
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'hotel':
        return <Hotel className="h-5 w-5" />;
      case 'flight':
        return <Plane className="h-5 w-5" />;
      case 'package':
        return <Package className="h-5 w-5" />;
      case 'sport':
        return <Ticket className="h-5 w-5" />;
      default:
        return <Activity className="h-5 w-5" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[500px]">
        <div className="flex flex-col items-center gap-2">
          <div className="animate-spin h-10 w-10 rounded-full border-4 border-indigo-100 border-t-indigo-500"></div>
          <p className="text-gray-500 dark:text-gray-400">Loading product data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Edit Product</h2>
        <Button 
          variant="outline" 
          onClick={() => navigate('/dashboard/products-enhanced')}
          className="flex items-center gap-1"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Products
        </Button>
      </div>
      
      <Card className="border-none shadow-md overflow-hidden bg-white dark:bg-gray-800">
        <CardHeader className="border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
          <CardTitle className="text-xl">Product Information</CardTitle>
          <CardDescription>Update the details of your product</CardDescription>
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
                      <FormLabel>Product Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter product name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }: { field: any }) => (
                    <FormItem>
                      <FormLabel>Product Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a product type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="hotel">Hotel</SelectItem>
                          <SelectItem value="flight">Flight</SelectItem>
                          <SelectItem value="package">Package</SelectItem>
                          <SelectItem value="activity">Activity / Tour</SelectItem>
                          <SelectItem value="entertainment">Entertainment</SelectItem>
                          <SelectItem value="sport">Sport</SelectItem>
                        </SelectContent>
                      </Select>
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
                        Current selling price (must be equal to or less than original price)
                      </FormDescription>
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
                  name="description"
                  render={({ field }: { field: any }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter product description" 
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
                              Show this product to customers
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
                  onClick={() => navigate('/dashboard/products-enhanced')}
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
