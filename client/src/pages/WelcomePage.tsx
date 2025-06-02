import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { getProducts } from '@/services/productService';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { Product, ProductType } from '@/types/product';
import { MiniCart } from '@/components/cart/MiniCart';
import { useCart } from '@/components/providers/cart-provider';
import { ShoppingCart, Eye, BadgePercent } from 'lucide-react';
import { getActiveGradientPreset, siteConfig } from '@/config/siteConfig';

// Using the Product type from @/types/product

export function WelcomePage() {
  const { user } = useAuth();
  const isAuthenticated = !!user;
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { addItem, isLoading: isCartLoading } = useCart();
  const [addingToCart, setAddingToCart] = useState<{[key: string]: boolean}>({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getProducts({ isActive: true });
        // Transform the data to match our Product type
        const formattedProducts = data.map(product => {
          // Use type assertion to handle API response having different property names than our Product type
          const apiProduct = product as any;
          return {
            ...product,
            isActive: apiProduct.is_active ?? true,
            image: product.image || getDefaultImageByType(product.type),
            rating: product.rating || 0,
            location: product.location || 'Not specified'
          };
        });
        setProducts(formattedProducts);
      } catch (err: any) {
        console.error('Failed to fetch products:', err);
        
        // Handle 401 Unauthorized error
        if (err.response?.status === 401) {
          // Don't show error toast for unauthorized, just log it
          console.log('User not authenticated, showing limited content');
          setProducts([]); // Clear products or show limited content
          return;
        }
        
        const errorMessage = err instanceof Error ? err.message : 'Failed to load products';
        setError(errorMessage);
        
        // Only show toast if the component is still mounted
        if (toast) {
          toast({
            title: 'Error',
            description: errorMessage,
            variant: 'destructive',
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
    
    // Cleanup function to prevent state updates after unmount
    return () => {
      // Any cleanup if needed
    };
  }, [toast]);

  // Handle adding product to cart
  const handleAddToCart = async (productId: string) => {
    try {
      // Track which product is being added to the cart
      setAddingToCart(prev => ({ ...prev, [productId]: true }));
      
      // Add item to cart with default quantity of 1
      await addItem(productId, 1);
      
      toast({
        title: 'Success',
        description: 'Item added to your cart',
      });
    } catch (error) {
      console.error('Failed to add item to cart:', error);
      toast({
        title: 'Error',
        description: 'Failed to add item to cart. Please try again.',
        variant: 'destructive',
      });
    } finally {
      // Reset loading state for this product
      setAddingToCart(prev => ({ ...prev, [productId]: false }));
    }
  };

  // Helper function to get default image based on product type
  const getDefaultImageByType = (type: ProductType) => {
    const defaultImages = {
      hotel: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
      flight: 'https://images.unsplash.com/photo-1549144511-f099e773c147?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      sport: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
      entertainment: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
      package: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
      other: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80'
    };
    return defaultImages[type] || defaultImages.other;
  };

  // Get the active gradient preset for dynamic styling
  const gradientPreset = getActiveGradientPreset();
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with gradient background */}
      <header className={`bg-gradient-to-r ${gradientPreset.headerGradient} shadow-lg`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-3xl font-extrabold text-white tracking-tight">Travel<span className="text-yellow-300">Ease</span></span>
            </div>
            <nav className="flex items-center space-x-4">
              <Button variant="secondary" asChild className="bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm">
                <Link to="/shop" className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Shop All
                </Link>
              </Button>
              <MiniCart />
              
              {!isAuthenticated ? (
                <>
                  <Button variant="ghost" asChild className="text-white hover:bg-white/20">
                    <Link to="/login">Sign In</Link>
                  </Button>
                  <Button asChild className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium">
                    <Link to="/register">Sign Up</Link>
                  </Button>
                </>
              ) : (
                <Button asChild className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium">
                  <Link to="/dashboard">Dashboard</Link>
                </Button>
              )}
            </nav>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section with Background Image and Overlay */}
        <div className="pt-20 relative overflow-hidden bg-cover bg-center h-[150vh] md:h-[95vh]" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80')" }}>
          <div className={`absolute inset-0 bg-gradient-to-r ${gradientPreset.heroGradient} backdrop-blur-[2px]`}></div>
          <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8 h-full flex flex-col justify-center">
            <div className="text-center">
              <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-6xl md:text-7xl">
                <span className="block mb-2">Find your perfect</span>
                <span className={`block text-transparent bg-clip-text bg-gradient-to-r ${gradientPreset.textGradient} animate-gradient-x`}>travel experience</span>
              </h1>
              <p className="mt-6 max-w-md mx-auto text-xl text-white/80 sm:text-2xl md:mt-8 md:max-w-3xl">
                Discover amazing destinations and book your perfect stay with our curated selection of accommodations worldwide.
              </p>
              <div className="mt-8 w-full max-w-lg mx-auto flex flex-col sm:flex-row sm:justify-center sm:space-x-4 space-y-4 sm:space-y-0 md:mt-12">
                <Button 
                  size="lg" 
                  className={`relative z-10 bg-gradient-to-r ${gradientPreset.primaryButtonGradient} text-white shadow-lg text-lg px-8 py-6 h-auto flex items-center justify-center min-w-[200px] transform transition-transform hover:-translate-y-1`}
                  asChild
                >
                  <a href="/shop">
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Explore Now
                  </a>
                </Button>
                
                <Button
                  size="lg" 
                  className={`relative z-10 bg-gradient-to-r ${gradientPreset.secondaryButtonGradient} text-white border-white/20 hover:border-white/40 text-lg px-8 py-6 h-auto flex items-center justify-center min-w-[200px] transform transition-transform hover:-translate-y-1`}
                  asChild
                >
                  <a href="/shop">
                    <Eye className="w-5 h-5 mr-2" />
                    View Deals
                  </a>
                </Button>
              </div>

              {/* Travel Categories Section - Blue-Indigo Gradient Design */}
              <div className="mt-16 mb-20 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-5xl mx-auto relative z-30">
                {[{ name: 'Hotels', icon: '🏨', shade: 'from-blue-500 to-indigo-600' }, 
                  { name: 'Flights', icon: '✈️', shade: 'from-blue-600 to-indigo-700' },
                  { name: 'Activities', icon: '🏄‍♂️', shade: 'from-blue-700 to-indigo-800' },
                  { name: 'Packages', icon: '🎁', shade: 'from-blue-800 to-indigo-900' }].map((category) => (
                  <a 
                    href="/shop" 
                    key={category.name} 
                    className="group block relative overflow-hidden"
                  >
                    <div className={`flex flex-col items-center justify-center p-6 rounded-2xl transition-all transform hover:-translate-y-1 hover:shadow-xl h-full shadow-lg bg-gradient-to-br ${category.shade} border border-blue-300/20`}>
                      <div className="w-16 h-16 flex items-center justify-center bg-white/20 backdrop-blur-sm rounded-full mb-4 text-white group-hover:scale-110 transition-transform">
                        <span className="text-3xl">{category.icon}</span>
                      </div>
                      <span className="text-base font-semibold text-white drop-shadow-md">{category.name}</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Wave Divider - Positioned to not hide buttons */}
          <div className="absolute bottom-0 left-0 w-full pointer-events-none" style={{ transform: 'translateY(30px)', zIndex: 10 }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto">
              <path fill="#f9fafb" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,165.3C960,192,1056,224,1152,208C1248,192,1344,128,1392,96L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
            </svg>
          </div>
        </div>

        {/* Featured Destinations */}
        <div className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="inline-block px-3 py-1 text-sm font-medium rounded-full bg-indigo-100 text-indigo-800 mb-3">
                HANDPICKED FOR YOU
              </span>
              <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl tracking-tight">
                <span className="relative">
                  <span className="relative z-10">{siteConfig.featuredProducts.title}</span>
                  <span className="absolute bottom-1 left-0 w-full h-4 bg-yellow-200 opacity-40 z-0"></span>
                </span>
              </h2>
              <p className="mt-4 max-w-2xl text-xl text-gray-600 mx-auto">
                {siteConfig.featuredProducts.description}
              </p>
            </div>

            {isLoading ? (
              <div className="mt-12 grid gap-6 lg:grid-cols-3 xl:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <Skeleton className="h-48 w-full" />
                    <CardHeader>
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-2/3" />
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-9 w-24" />
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-500">{error}</p>
                <Button 
                  onClick={() => window.location.reload()} 
                  className="mt-4"
                  variant="outline"
                >
                  Retry
                </Button>
              </div>
            ) : products.length > 0 ? (
              <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {products.map((product) => (
                  <Card key={product.id} className="overflow-hidden rounded-xl hover:shadow-xl transition-all duration-300 h-full flex flex-col transform hover:-translate-y-1 border-0 bg-white relative z-10">
                    {/* Card Image Container with Gradient Overlay */}
                    <div className="relative aspect-w-16 aspect-h-9 overflow-hidden rounded-t-xl">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-48 w-full object-cover transition-transform hover:scale-110 duration-500"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = getDefaultImageByType(product.type);
                        }}
                      />
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
                      
                      {/* Type Badge */}
                      <div className="absolute top-3 left-3 z-10">
                        <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full
                          ${product.type === 'hotel' ? 'bg-blue-500 text-white' : 
                          product.type === 'flight' ? 'bg-purple-500 text-white' : 
                          product.type === 'sport' ? 'bg-green-500 text-white' : 
                          product.type === 'entertainment' ? 'bg-pink-500 text-white' : 
                          'bg-gray-500 text-white'}`}>
                          {product.type.charAt(0).toUpperCase() + product.type.slice(1)}
                        </span>
                      </div>
                      
                      {/* Rating Badge */}
                      {(product.rating !== undefined && product.rating > 0) && (
                        <div className="absolute top-3 right-3 flex items-center bg-yellow-400 text-gray-900 px-2 py-1 rounded-full shadow-md">
                          <span className="text-sm font-bold">{Number(product.rating).toFixed(1)}</span>
                          <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        </div>
                      )}
                      
                      {/* Location */}
                      <div className="absolute bottom-3 left-3 text-white flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-sm font-medium truncate max-w-[150px]">{product.location}</span>
                      </div>
                    </div>
                    
                    {/* Product Content */}
                    <div className="flex flex-col flex-grow p-5">
                      {/* Product Title */}
                      <div className="mb-3">
                        <CardTitle className="text-xl font-bold line-clamp-1 group-hover:text-primary transition-colors">
                          {product.name}
                        </CardTitle>
                      </div>
                      
                      {/* Product Description */}
                      <CardDescription className="line-clamp-2 mb-4 flex-grow text-sm">
                        {product.description || 'No description available.'}
                      </CardDescription>
                      
                      {/* Price and Actions */}
                      <div className="mt-auto pt-4 border-t border-gray-100">
                        {/* Price */}
                        <div className="flex justify-between items-center mb-3">
                          <div>
                            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                              ${product.price}
                            </span>
                            <span className="text-sm font-medium text-gray-500 ml-1">
                              {product.type === 'hotel' ? '/ night' : product.type === 'flight' ? '/ person' : ''}
                            </span>
                          </div>
                          
                          {/* Random discount badge (30% chance) */}
                          {Math.random() > 0.7 && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              <BadgePercent className="w-3 h-3 mr-1" />
                              {Math.floor(Math.random() * 30) + 10}% OFF
                            </span>
                          )}
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex gap-2 justify-between">
                          {/* Add to Cart Button */}
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="flex-1 border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-300 relative z-20"
                            onClick={(e) => {
                              handleAddToCart(product.id);
                            }}
                            disabled={addingToCart[product.id] || isCartLoading}
                            type="button" // Explicitly set button type
                          >
                            {addingToCart[product.id] ? (
                              <span className="animate-pulse">Adding...</span>
                            ) : (
                              <>
                                <ShoppingCart className="w-4 h-4 mr-1" />
                                Add to Cart
                              </>
                            )}
                          </Button>
                          
                          {/* View Details Button */}
                          <Button 
                            size="sm"
                            className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 relative z-20 flex items-center justify-center"
                            asChild
                          >
                            <a 
                              href={`/products/${product.id}`}
                              className="whitespace-nowrap flex items-center justify-center w-full h-full " style={{padding: '0.5rem'}}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              View Details
                            </a>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No products available at the moment.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-base text-gray-500">
            &copy; {new Date().getFullYear()} TravelEase. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
