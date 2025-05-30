import { useState, useEffect, ReactNode } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, Edit, Trash2, ShoppingCart, Plus, Minus, Star, Clock, MapPin, Calendar } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Product, ProductType } from "@/types/product"
import { getProductById, deleteProduct } from "@/services/productService"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/hooks/useAuth"
import { useCart } from "@/components/providers/cart-provider"
import { Input } from "@/components/ui/input"
import { formatCurrency } from "@/lib/utils"

const getTypeLabel = (type: ProductType): string => {
  return type.charAt(0).toUpperCase() + type.slice(1)
}

export function ProductDetailPage(): ReactNode {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()
  const { user } = useAuth()
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [localCartLoading, setLocalCartLoading] = useState(false)
  const { addItem, isLoading: isCartLoading } = useCart()

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return
      
      try {
        setIsLoading(true)
        const data = await getProductById(id)
        setProduct(data)
      } catch (err) {
        console.error("Error fetching product:", err)
        toast({
          title: "Error",
          description: "Failed to load product details. Please try again.",
          variant: "destructive"
        })
        navigate("/dashboard/products")
      } finally {
        setIsLoading(false)
      }
    }

    fetchProduct()
  }, [id, navigate, toast])

  const handleEdit = () => {
    if (product) {
      navigate(`/dashboard/products/${product.id}/edit`)
    }
  }

  const handleDelete = async () => {
    if (!product) return

    if (window.confirm(`Are you sure you want to delete ${product.name}?`)) {
      try {
        setIsDeleting(true)
        await deleteProduct(product.id)
        toast({
          title: "Success",
          description: `${product.name} has been deleted.`,
          variant: "success"
        })
        navigate("/dashboard/products")
      } catch (error) {
        console.error("Error deleting product:", error)
        toast({
          title: "Error",
          description: "Failed to delete product. Please try again.",
          variant: "destructive"
        })
      } finally {
        setIsDeleting(false)
      }
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 bg-gradient-to-b from-blue-50 to-indigo-50">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-blue-600 border-r-indigo-600 border-b-blue-600 border-l-indigo-600 border-t-transparent"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50 py-10">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden p-8 text-center">
            <div className="text-blue-600 mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-blue-900 mb-3">Product Not Found</h2>
            <p className="text-blue-700 mb-6">
              The product you're looking for doesn't exist or has been removed.
            </p>
            <Button 
              className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800"
              onClick={() => navigate("/shop")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Shop
            </Button>
          </div>
        </div>
      </div>
    )
  }
  
  // Function to render product details based on product type
  const renderProductDetails = (product: Product) => {
    switch (product.type) {
      case "hotel":
        return (
          <Card className="border-0 shadow-lg overflow-hidden bg-white">
            <CardHeader className="bg-gradient-to-r from-blue-600/10 to-indigo-600/10 border-b border-blue-100">
              <CardTitle className="text-xl text-blue-900 flex items-center">
                <span className="mr-2 text-blue-600">🏨</span> Hotel Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <p className="text-sm font-medium text-blue-700 mb-1">Star Rating</p>
                  <p className="text-xl font-bold text-indigo-700">
                    {Array.from({ length: product.hotelDetails?.stars || 0 }).map((_, i) => (
                      <span key={i} className="text-amber-500">★</span>
                    ))}
                  </p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <p className="text-sm font-medium text-blue-700 mb-1">Check-in/Check-out</p>
                  <p className="text-lg font-semibold text-indigo-700">
                    {product.hotelDetails?.checkInTime || "14:00"} /{" "}
                    {product.hotelDetails?.checkOutTime || "12:00"}
                  </p>
                </div>
              </div>
              
              {product.hotelDetails?.amenities &&
                product.hotelDetails.amenities.length > 0 && (
                  <div className="mt-6">
                    <p className="text-sm font-medium text-blue-700 mb-3">Amenities</p>
                    <div className="flex flex-wrap gap-2">
                      {product.hotelDetails.amenities.map((amenity) => (
                        <Badge key={amenity} className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-3 py-1 rounded-full">
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
            </CardContent>
          </Card>
        );

      case "flight":
        return (
          <Card className="border-0 shadow-lg overflow-hidden bg-white">
            <CardHeader className="bg-gradient-to-r from-blue-600/10 to-indigo-600/10 border-b border-blue-100">
              <CardTitle className="text-xl text-blue-900 flex items-center">
                <span className="mr-2 text-blue-600">✈️</span> Flight Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 bg-gradient-to-b from-blue-50 to-blue-100 p-5 rounded-xl shadow-sm border border-blue-200">
                  <p className="text-sm font-medium text-blue-700 mb-2">Departure</p>
                  <p className="text-xl font-bold text-indigo-700">
                    {product.flightDetails?.departure.airport || "N/A"}
                  </p>
                  <p className="text-blue-600">
                    {product.flightDetails?.departure.city}
                  </p>
                  <p className="mt-2 bg-blue-200/50 inline-block px-3 py-1 rounded-md text-blue-800">
                    {product.flightDetails?.departure.time}
                  </p>
                </div>
                
                <div className="hidden md:flex items-center justify-center text-blue-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
                </div>
                
                <div className="flex-1 bg-gradient-to-b from-indigo-50 to-indigo-100 p-5 rounded-xl shadow-sm border border-indigo-200">
                  <p className="text-sm font-medium text-indigo-700 mb-2">Arrival</p>
                  <p className="text-xl font-bold text-indigo-700">
                    {product.flightDetails?.arrival.airport || "N/A"}
                  </p>
                  <p className="text-indigo-600">
                    {product.flightDetails?.arrival.city}
                  </p>
                  <p className="mt-2 bg-indigo-200/50 inline-block px-3 py-1 rounded-md text-indigo-800">
                    {product.flightDetails?.arrival.time}
                  </p>
                </div>
              </div>
              
              <div className="mt-8 bg-blue-50 p-4 rounded-lg border border-blue-100">
                <p className="text-sm font-medium text-blue-700 mb-3">Flight Information</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-3 rounded-md shadow-sm">
                    <p className="text-xs text-blue-600 mb-1">Airline</p>
                    <p className="font-semibold">{product.flightDetails?.airline || "N/A"}</p>
                  </div>
                  <div className="bg-white p-3 rounded-md shadow-sm">
                    <p className="text-xs text-blue-600 mb-1">Flight Number</p>
                    <p className="font-semibold">{product.flightDetails?.flightNumber || "N/A"}</p>
                  </div>
                  <div className="bg-white p-3 rounded-md shadow-sm">
                    <p className="text-xs text-blue-600 mb-1">Duration</p>
                    <p className="font-semibold">
                      {product.flightDetails?.duration
                        ? `${Math.floor(product.flightDetails.duration / 60)}h ${product.flightDetails.duration % 60}m`
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case "sport":
        return (
          <Card className="border-0 shadow-lg overflow-hidden bg-white">
            <CardHeader className="bg-gradient-to-r from-blue-600/10 to-indigo-600/10 border-b border-blue-100">
              <CardTitle className="text-xl text-blue-900 flex items-center">
                <span className="mr-2 text-blue-600">🏄‍♂️</span> Sport Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <p className="text-sm font-medium text-blue-700 mb-1">Sport Type</p>
                  <p className="text-lg font-semibold text-indigo-700">
                    {product.sportDetails?.sportType || "N/A"}
                  </p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <p className="text-sm font-medium text-blue-700 mb-1">Venue</p>
                  <p className="text-lg font-semibold text-indigo-700">
                    {product.sportDetails?.venue || "N/A"}
                  </p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <p className="text-sm font-medium text-blue-700 mb-1">Duration</p>
                  <p className="text-lg font-semibold text-indigo-700">
                    {product.sportDetails?.duration ? `${product.sportDetails.duration} minutes` : "N/A"}
                  </p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <p className="text-sm font-medium text-blue-700 mb-1">Equipment Included</p>
                  <p className="text-lg font-semibold text-indigo-700">
                    {product.sportDetails?.equipmentIncluded ? "Yes" : "No"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case "entertainment":
        return (
          <Card className="border-0 shadow-lg overflow-hidden bg-white">
            <CardHeader className="bg-gradient-to-r from-blue-600/10 to-indigo-600/10 border-b border-blue-100">
              <CardTitle className="text-xl text-blue-900 flex items-center">
                <span className="mr-2 text-blue-600">🎭</span> Entertainment Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <p className="text-sm font-medium text-blue-700 mb-1">Venue</p>
                  <p className="text-lg font-semibold text-indigo-700">
                    {product.entertainmentDetails?.venue || "N/A"}
                  </p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <p className="text-sm font-medium text-blue-700 mb-1">Date & Time</p>
                  <p className="text-lg font-semibold text-indigo-700">
                    {product.entertainmentDetails?.eventDate &&
                    product.entertainmentDetails?.eventTime
                      ? new Date(
                          `${product.entertainmentDetails.eventDate}T${product.entertainmentDetails.eventTime}`
                        ).toLocaleString()
                      : "N/A"}
                  </p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <p className="text-sm font-medium text-blue-700 mb-1">Duration</p>
                  <p className="text-lg font-semibold text-indigo-700">
                    {product.entertainmentDetails?.duration
                      ? `${product.entertainmentDetails.duration} minutes`
                      : "N/A"}
                  </p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <p className="text-sm font-medium text-blue-700 mb-1">Age Restriction</p>
                  <p className="text-lg font-semibold text-indigo-700">
                    {product.entertainmentDetails?.ageRestriction || "All ages"}
                  </p>
                </div>
              </div>
              
              {product.entertainmentDetails?.performers &&
                product.entertainmentDetails.performers.length > 0 && (
                  <div className="mt-6">
                    <p className="text-sm font-medium text-blue-700 mb-3">Performers</p>
                    <div className="flex flex-wrap gap-2">
                      {product.entertainmentDetails.performers.map((performer) => (
                        <Badge key={performer} className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-3 py-1 rounded-full">
                          {performer}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
            </CardContent>
          </Card>
        );

      case "package":
        return (
          <Card className="border-0 shadow-lg overflow-hidden bg-white">
            <CardHeader className="bg-gradient-to-r from-blue-600/10 to-indigo-600/10 border-b border-blue-100">
              <CardTitle className="text-xl text-blue-900 flex items-center">
                <span className="mr-2 text-blue-600">🎁</span> Package Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                {/* Package details would go here */}
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <p className="text-sm font-medium text-blue-700 mb-1">Package Information</p>
                  <p className="text-lg font-semibold text-indigo-700">
                    This is a travel package combining multiple services.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return (
          <Card className="border-0 shadow-lg overflow-hidden bg-white">
            <CardHeader className="bg-gradient-to-r from-blue-600/10 to-indigo-600/10 border-b border-blue-100">
              <CardTitle className="text-xl text-blue-900">Product Details</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <p className="text-lg text-blue-800">
                  Additional details for this product are not available.
                </p>
              </div>
            </CardContent>
          </Card>
        );
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50">
      {/* Hero Banner with Product Image */}
      <div className="relative w-full h-64 md:h-80 lg:h-96 overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-40"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-indigo-600/20"></div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/60 to-indigo-900/30"></div>
        
        {/* Back Button - Fixed on top */}
        <div className="absolute top-4 left-4 z-10">
          <Button
            variant="ghost"
            className="bg-white/20 hover:bg-white/30 text-white rounded-full backdrop-blur-sm"
            onClick={() => navigate("/shop")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Shop
          </Button>
        </div>
        
        {/* Admin Actions - Fixed on top */}
        {user && (
          <div className="absolute top-4 right-4 z-10 flex space-x-2">
            <Button variant="outline" onClick={handleEdit} className="bg-white/20 hover:bg-white/30 text-white rounded-full backdrop-blur-sm border-white/40">
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
              className="rounded-full backdrop-blur-sm"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        )}
        
        {/* Product Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-blue-900/80 to-transparent">
          <div className="container mx-auto">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Badge className="bg-blue-500 hover:bg-blue-600 px-3 py-1 text-xs font-medium uppercase tracking-wider">
                    {getTypeLabel(product.type)}
                  </Badge>
                  <Badge variant={product.isActive ? "success" : "destructive"}>
                    {product.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">
                  {product.name}
                </h1>
                <div className="flex items-center text-blue-100 mt-1">
                  <MapPin className="h-4 w-4 mr-1 text-blue-200" />
                  <span className="text-blue-200">{product.location}</span>
                </div>
              </div>
              <div className="flex items-center bg-indigo-600/80 backdrop-blur-sm px-6 py-3 rounded-lg shadow-lg">
                <div className="text-white">
                  <div className="text-sm uppercase tracking-wider font-medium mb-1">Price</div>
                  <div className="text-3xl font-bold">{formatCurrency(product.price || 0)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Content Container */}
      <div className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description Card */}
            <Card className="overflow-hidden border-0 shadow-lg bg-white">
              <CardHeader className="bg-gradient-to-r from-blue-600/10 to-indigo-600/10 border-b border-blue-100">
                <CardTitle className="text-xl text-blue-900">About This {getTypeLabel(product.type)}</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="prose max-w-none text-blue-800">
                  <p className="text-lg leading-relaxed">{product.description}</p>
                </div>
              </CardContent>
            </Card>

            {/* Product Details Card */}
            <div className="transform transition-all hover:shadow-lg">
              {renderProductDetails(product)}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Booking Card */}
            <Card className="border-0 shadow-lg overflow-hidden bg-white">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
                <CardTitle className="flex items-center">Book Now</CardTitle>
                {product.capacity !== undefined && (
                  <p className="text-blue-100 mt-1">
                    <span className="font-medium">{product.capacity}</span> spots available
                  </p>
                )}
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-5">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-blue-800">Dates</span>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-blue-600 mb-1">Start Date</p>
                          <p className="font-medium">
                            {product.startDate
                              ? new Date(product.startDate).toLocaleDateString()
                              : "Not specified"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-blue-600 mb-1">End Date</p>
                          <p className="font-medium">
                            {product.endDate
                              ? new Date(product.endDate).toLocaleDateString()
                              : "Not specified"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <label className="block text-sm font-medium text-blue-800 mb-2">Quantity</label>
                    <div className="flex items-center justify-center border border-blue-200 rounded-lg bg-blue-50 p-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-blue-700 hover:text-blue-900 hover:bg-blue-200/60"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1 || isCartLoading}
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <Input
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) => {
                          const value = parseInt(e.target.value, 10);
                          if (!isNaN(value) && value >= 1) {
                            setQuantity(value);
                          }
                        }}
                        className="w-16 h-10 text-center border-0 bg-transparent text-blue-900 font-medium"
                        aria-label="Quantity"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-blue-700 hover:text-blue-900 hover:bg-blue-200/60"
                        onClick={() => setQuantity(quantity + 1)}
                        disabled={isCartLoading}
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button 
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white py-6 rounded-lg shadow-md hover:shadow-lg transition-all"
                      onClick={async (e) => {
                        e.preventDefault(); // Prevent any default form submission
                        e.stopPropagation(); // Stop event propagation to prevent navigation
                        
                        if (id) {
                          try {
                            setLocalCartLoading(true);
                            await addItem(id, quantity);
                            toast({
                              title: "Added to cart",
                              description: `${quantity} × ${product.name} added to your cart`,
                              variant: "success"
                            });
                          } catch (error) {
                            console.error("Error adding to cart:", error);
                            toast({
                              title: "Error",
                              description: "Failed to add item to cart. Please try again.",
                              variant: "destructive"
                            });
                          } finally {
                            setLocalCartLoading(false);
                          }
                        }
                        
                        // Don't navigate away - explicitly return false to prevent navigation
                        return false;
                      }}
                      disabled={isCartLoading || localCartLoading}
                      type="button" // Explicitly set type to button to prevent form submission
                    >
                      <ShoppingCart className="mr-2 h-5 w-5" />
                      {(isCartLoading || localCartLoading) ? "Adding..." : "Add to Cart"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Additional Details Card */}
            {product.image && (
              <Card className="overflow-hidden border-0 shadow-lg bg-white">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-auto object-cover"
                />
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
