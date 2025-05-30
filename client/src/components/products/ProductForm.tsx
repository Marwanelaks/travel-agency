import * as React from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useNavigate } from "react-router-dom"
import { Loader2, Save, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Product, ProductType, ProductFormData } from "@/types/product"
import { toast } from "@/components/ui/use-toast"

const productFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  type: z.enum(['hotel', 'flight', 'sport', 'entertainment', 'package', 'other']),
  price: z.coerce.number().min(0, {
    message: "Price must be a positive number.",
  }),
  location: z.string().min(2, {
    message: "Location is required.",
  }),
  image: z.string().url({
    message: "Please enter a valid URL.",
  }).optional(),
  isActive: z.boolean().default(true),
  startDate: z.string({
    required_error: "Start date is required",
  }).refine(date => !!date, {
    message: "Start date is required",
  }),
  endDate: z.string({
    required_error: "End date is required",
  }).refine(date => !!date, {
    message: "End date is required",
  }),
  capacity: z.coerce.number().min(1).optional(),
  // Type-specific fields
  hotelDetails: z.object({
    stars: z.coerce.number().min(1).max(5),
    amenities: z.array(z.string()),
    checkInTime: z.string(),
    checkOutTime: z.string(),
    roomTypes: z.array(z.object({
      type: z.string(),
      price: z.number(),
      capacity: z.number(),
      available: z.number(),
    })),
  }).optional(),
  flightDetails: z.object({
    airline: z.string(),
    flightNumber: z.string(),
    departure: z.object({
      airport: z.string(),
      time: z.string(),
      city: z.string(),
    }),
    arrival: z.object({
      airport: z.string(),
      time: z.string(),
      city: z.string(),
    }),
    duration: z.number(),
    cabinClass: z.enum(['economy', 'business', 'first']),
    baggageAllowance: z.string(),
  }).optional(),
  sportDetails: z.object({
    sportType: z.string(),
    venue: z.string(),
    date: z.string(),
    time: z.string(),
    duration: z.number(),
    equipmentIncluded: z.boolean(),
    difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  }).optional(),
  entertainmentDetails: z.object({
    venue: z.string(),
    eventDate: z.string(),
    eventTime: z.string(),
    duration: z.number(),
    ageRestriction: z.string().optional(),
    performers: z.array(z.string()).optional(),
  }).optional(),
}).refine((data) => {
  if (!data.startDate || !data.endDate) return true; // This will be caught by the individual field validations
  return new Date(data.endDate) > new Date(data.startDate);
}, {
  message: "End date must be after start date",
  path: ["endDate"], // Shows the error on the endDate field
})

type ProductFormValues = z.infer<typeof productFormSchema>

interface ProductFormProps {
  initialData?: Product
  onSubmit: (data: ProductFormData) => Promise<void>
  isSubmitting: boolean
}

export function ProductForm({ initialData, onSubmit, isSubmitting }: ProductFormProps) {
  const navigate = useNavigate()
  const [selectedType, setSelectedType] = React.useState<ProductType>(
    initialData?.type || 'hotel'
  )

  const defaultValues = {
    name: initialData?.name || "",
    description: initialData?.description || "",
    type: initialData?.type || 'hotel',
    price: initialData?.price || 0,
    location: initialData?.location || "",
    image: initialData?.image || "",
    isActive: initialData?.isActive ?? true,
    startDate: initialData?.startDate || "",
    endDate: initialData?.endDate || "",
    capacity: initialData?.capacity,
    hotelDetails: initialData?.hotelDetails || {
      stars: 3,
      amenities: [],
      checkInTime: "14:00",
      checkOutTime: "12:00",
      roomTypes: [{ type: "Standard", price: 0, capacity: 2, available: 1 }],
    },
    flightDetails: initialData?.flightDetails || {
      airline: "",
      flightNumber: "",
      departure: { airport: "", time: "", city: "" },
      arrival: { airport: "", time: "", city: "" },
      duration: 0,
      cabinClass: "economy",
      baggageAllowance: "23kg",
    },
    sportDetails: initialData?.sportDetails || {
      sportType: "",
      venue: "",
      date: "",
      time: "",
      duration: 60,
      equipmentIncluded: false,
      difficulty: "beginner",
    },
    entertainmentDetails: initialData?.entertainmentDetails || {
      venue: "",
      eventDate: "",
      eventTime: "",
      duration: 120,
      ageRestriction: "All ages",
      performers: [],
    },
  }

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues,
  })

  const productType = form.watch("type") as ProductType

  React.useEffect(() => {
    setSelectedType(productType)
  }, [productType])

  const handleSubmit = async (data: ProductFormValues) => {
    try {
      await onSubmit(data as ProductFormData)
      toast({
        title: "Success",
        description: initialData ? "Product updated successfully!" : "Product created successfully!",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      })
    }
  }

  const renderTypeSpecificFields = () => {
    switch (selectedType) {
      case 'hotel':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Hotel Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="hotelDetails.stars"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Star Rating</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select star rating" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {[1, 2, 3, 4, 5].map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {Array(num).fill('★').join('')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Add more hotel specific fields */}
            </div>
          </div>
        )
      case 'flight':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Flight Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="flightDetails.airline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Airline</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Add more flight specific fields */}
            </div>
          </div>
        )
      // Add cases for other product types
      default:
        return null
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">
            {initialData ? 'Edit Product' : 'Create New Product'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a product type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="hotel">Hotel</SelectItem>
                      <SelectItem value="flight">Flight</SelectItem>
                      <SelectItem value="sport">Sport Activity</SelectItem>
                      <SelectItem value="entertainment">Entertainment</SelectItem>
                      <SelectItem value="package">Package</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter product description"
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price (USD)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
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
                    <Input placeholder="Enter location" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/image.jpg" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Active</FormLabel>
                  <FormDescription>
                    This product will be visible to customers if active.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {renderTypeSpecificFields()}
        </div>

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(-1)}
            disabled={isSubmitting}
          >
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {initialData ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {initialData ? 'Update Product' : 'Create Product'}
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}
