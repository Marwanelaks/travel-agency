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
  Hotel, 
  Plane, 
  Package, 
  Ticket, 
  Activity, 
  MapPin, 
  ArrowLeft,
  Check,
  Loader2
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

export function CreateProductForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Initialize form with validation
  const form = useForm<FormData>({
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
  async function onSubmit(data: z.infer<typeof productFormSchema>) {
    try {
      setIsSubmitting(true);
      
      // Ensure price is set to the sale price for backward compatibility
      const submissionData = {
        ...data,
        price: data.sale_price // Set price to match sale_price for backward compatibility
      };
      
      // Calculate discount percentage for display
      const discountPercentage = data.original_price > 0 
        ? Math.round((1 - (data.sale_price / data.original_price)) * 100) 
        : 0;
      
      // Simulate API call with a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, this would be an API call
      // await axios.post('/api/products', submissionData);
      
      console.log('Product created:', submissionData);
      console.log(`Discount applied: ${discountPercentage}%`);
      
      toast({
        title: "Product Created",
        description: `Your product has been successfully created${discountPercentage > 0 ? ` with a ${discountPercentage}% discount` : ''}.`,
        variant: "default",
      });
      
      // Navigate back to products list
      navigate('/dashboard/products-enhanced');
    } catch (error) {
      console.error('Error creating product:', error);
      toast({
        title: "Error",
        description: "Failed to create the product. Please try again.",
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
        return <Hotel className="h-5 w-5 text-blue-500" />;
      case 'flight':
        return <Plane className="h-5 w-5 text-purple-500" />;
      case 'package':
        return <Package className="h-5 w-5 text-amber-500" />;
      case 'sport':
      case 'entertainment':
        return <Ticket className="h-5 w-5 text-red-500" />;
      case 'activity':
      case 'tour':
        return <Activity className="h-5 w-5 text-green-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Create New Product</h2>
          <p className="text-muted-foreground">Add a new travel product to your inventory</p>
        </div>
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
          <CardDescription>Enter the details of your new product</CardDescription>
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
                  render={({ field }) => (
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
                  render={({ field }) => (
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
                  render={({ field }) => (
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
                          <span>Active Product</span>
                        </div>
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-base">Product Status</FormLabel>
                        <FormDescription>
                          Active products will be visible to customers in the shop
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
                  onClick={() => navigate('/dashboard/products-enhanced')}
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
                    'Create Product'
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
