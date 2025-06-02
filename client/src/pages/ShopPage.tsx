import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '@/services/productService';
import { Product, ProductType } from '@/types/product';
import { useCart } from '@/components/providers/cart-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { 
  Filter, 
  Search, 
  ShoppingCart, 
  Star, 
  SlidersHorizontal, 
  X, 
  ChevronDown, 
  Eye, 
  Tag,
  HeartIcon,
  BadgePercent
} from 'lucide-react';
import { 
  Slider,
  SliderTrack,
  SliderRange,
  SliderThumb,
} from '@/components/ui/slider';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MiniCart } from '@/components/cart/MiniCart';

// Types for our filters
interface FilterState {
  priceRange: [number, number];
  categories: string[];
  rating: number | null;
  searchQuery: string;
  sortBy: 'popularity' | 'price-low' | 'price-high' | 'newest';
  onlyDiscounted: boolean;
}

export function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(true);
  const { toast } = useToast();
  const { addItem } = useCart();
  const [addingToCart, setAddingToCart] = useState<{[key: string]: boolean}>({});
  
  // Define our filter state
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 10000],
    categories: [],
    rating: null,
    searchQuery: '',
    sortBy: 'popularity',
    onlyDiscounted: false
  });

  // Available product categories
  const categories = [
    { id: 'hotel', name: 'Hotels' },
    { id: 'flight', name: 'Flights' },
    { id: 'sport', name: 'Sports' },
    { id: 'entertainment', name: 'Entertainment' },
    { id: 'package', name: 'Packages' }
  ];

  // Fetch products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getProducts();
        
        // Transform and normalize the data
        const formattedProducts = data.map(product => {
          // Use type assertion to handle API response having different property names
          const apiProduct = product as any;
          return {
            ...product,
            isActive: apiProduct.is_active ?? true,
            image: product.image || getDefaultImageByType(product.type),
            rating: product.rating || 0,
            location: product.location || 'Not specified',
            // Add discount information (this would come from API in a real app)
            discountPercentage: Math.random() > 0.7 ? Math.floor(Math.random() * 50) + 5 : 0,
            originalPrice: product.price,
          };
        });
        
        setProducts(formattedProducts);
        setFilteredProducts(formattedProducts);
      } catch (err: any) {
        console.error('Failed to fetch products:', err);
        setError('Failed to load products. Please try again.');
        toast({
          title: 'Error',
          description: 'Failed to load products. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [toast]);

  // Apply filters whenever filter state changes
  useEffect(() => {
    const applyFilters = () => {
      let result = [...products];
      
      // Filter by price range
      result = result.filter(
        product => product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]
      );
      
      // Filter by categories
      if (filters.categories.length > 0) {
        result = result.filter(product => filters.categories.includes(product.type));
      }
      
      // Filter by rating
      if (filters.rating !== null) {
        result = result.filter(product => 
          product.rating !== undefined && product.rating >= filters.rating!
        );
      }
      
      // Filter by search query
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        result = result.filter(
          product => 
            product.name.toLowerCase().includes(query) || 
            product.description.toLowerCase().includes(query) ||
            product.location.toLowerCase().includes(query)
        );
      }
      
      // Filter only discounted items
      if (filters.onlyDiscounted) {
        result = result.filter(product => 
          (product as any).discountPercentage > 0
        );
      }
      
      // Sort products
      switch (filters.sortBy) {
        case 'price-low':
          result.sort((a, b) => a.price - b.price);
          break;
        case 'price-high':
          result.sort((a, b) => b.price - a.price);
          break;
        case 'newest':
          // Assuming we have a createdAt field
          result.sort((a, b) => 
            (new Date(b.createdAt || 0)).getTime() - (new Date(a.createdAt || 0)).getTime()
          );
          break;
        case 'popularity':
        default:
          // Assuming rating is our popularity metric
          result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
          break;
      }
      
      setFilteredProducts(result);
    };
    
    applyFilters();
  }, [filters, products]);

  // Handle adding product to cart
  const handleAddToCart = async (productId: string) => {
    try {
      setAddingToCart(prev => ({ ...prev, [productId]: true }));
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
      setAddingToCart(prev => ({ ...prev, [productId]: false }));
    }
  };

  // Helper function to get default image based on product type
  const getDefaultImageByType = (type: ProductType) => {
    const defaultImages = {
      hotel: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
      flight: 'https://images.unsplash.com/photo-1436491865333-4bdcb1bd645d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
      sport: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
      entertainment: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
      package: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
      other: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80'
    };
    return defaultImages[type] || defaultImages.other;
  };

  // Render star rating
  const renderStarRating = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= Math.round(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-2xl font-bold text-primary">TravelEase</Link>
            </div>
            <div className="hidden sm:block flex-1 max-w-md mx-auto">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  type="text"
                  placeholder="Search products..."
                  className="pl-10 pr-4 py-2 w-full"
                  value={filters.searchQuery}
                  onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
                />
              </div>
            </div>
            <nav className="flex items-center space-x-4">
              <MiniCart />
              <Button asChild variant="ghost">
                <Link to="/dashboard">Dashboard</Link>
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mobile search - visible only on small screens */}
        <div className="sm:hidden mb-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              type="text"
              placeholder="Search products..."
              className="pl-10 pr-4 py-2 w-full"
              value={filters.searchQuery}
              onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters Sidebar */}
          <aside className={`md:w-64 shrink-0 transition-all duration-300 ease-in-out ${showFilters ? 'block' : 'hidden md:block'}`}>
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold flex items-center">
                  <Filter className="w-5 h-5 mr-2" />
                  Filters
                </h2>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="md:hidden"
                  onClick={() => setShowFilters(false)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <Accordion type="single" collapsible className="w-full">
                {/* Price Range Filter */}
                <AccordionItem value="price">
                  <AccordionTrigger className="text-sm font-medium">Price Range</AccordionTrigger>
                  <AccordionContent>
                    <div className="py-2">
                      <Slider
                        defaultValue={[0, 10000]}
                        max={10000}
                        step={100}
                        value={filters.priceRange}
                        onValueChange={(value) => setFilters({ ...filters, priceRange: value as [number, number] })}
                        className="my-6"
                      />
                      <div className="flex items-center justify-between">
                        <span className="bg-gray-100 px-2 py-1 rounded text-sm">
                          ${filters.priceRange[0]}
                        </span>
                        <span className="bg-gray-100 px-2 py-1 rounded text-sm">
                          ${filters.priceRange[1]}
                        </span>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Categories Filter */}
                <AccordionItem value="categories">
                  <AccordionTrigger className="text-sm font-medium">Categories</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <div className="flex items-center space-x-2" key={category.id}>
                          <Checkbox 
                            id={`category-${category.id}`} 
                            checked={filters.categories.includes(category.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setFilters({
                                  ...filters,
                                  categories: [...filters.categories, category.id]
                                });
                              } else {
                                setFilters({
                                  ...filters,
                                  categories: filters.categories.filter(c => c !== category.id)
                                });
                              }
                            }}
                          />
                          <label 
                            htmlFor={`category-${category.id}`}
                            className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {category.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Rating Filter */}
                <AccordionItem value="rating">
                  <AccordionTrigger className="text-sm font-medium">Rating</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      {[5, 4, 3, 2, 1].map((star) => (
                        <div className="flex items-center space-x-2" key={star}>
                          <Checkbox 
                            id={`rating-${star}`} 
                            checked={filters.rating === star}
                            onCheckedChange={(checked) => {
                              setFilters({
                                ...filters,
                                rating: checked ? star : null
                              });
                            }}
                          />
                          <label 
                            htmlFor={`rating-${star}`}
                            className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center"
                          >
                            {renderStarRating(star)} <span className="ml-1">& Up</span>
                          </label>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Discounts Filter */}
                <AccordionItem value="discounts">
                  <AccordionTrigger className="text-sm font-medium">Discounts</AccordionTrigger>
                  <AccordionContent>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="discounted-only" 
                        checked={filters.onlyDiscounted}
                        onCheckedChange={(checked) => {
                          setFilters({
                            ...filters,
                            onlyDiscounted: checked as boolean
                          });
                        }}
                      />
                      <label 
                        htmlFor="discounted-only"
                        className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center"
                      >
                        <BadgePercent className="w-4 h-4 mr-1 text-red-500" />
                        On Sale
                      </label>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <div className="mt-4 pt-4 border-t">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    setFilters({
                      priceRange: [0, 10000],
                      categories: [],
                      rating: null,
                      searchQuery: '',
                      sortBy: 'popularity',
                      onlyDiscounted: false
                    });
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="bg-white p-4 rounded-lg shadow-sm border mb-4 flex flex-wrap items-center justify-between gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="md:hidden"
                onClick={() => setShowFilters(true)}
              >
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Filters
              </Button>

              <div className="flex items-center">
                <span className="text-sm text-gray-500 mr-2">
                  {filteredProducts.length} products
                </span>
              </div>
              
              <div className="flex items-center">
                <span className="text-sm text-gray-500 mr-2">Sort by:</span>
                <Select
                  value={filters.sortBy}
                  onValueChange={(value) => 
                    setFilters({ 
                      ...filters, 
                      sortBy: value as 'popularity' | 'price-low' | 'price-high' | 'newest' 
                    })
                  }
                >
                  <SelectTrigger className="h-8 w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popularity">Popularity</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="newest">Newest First</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Active Filters */}
            {(filters.categories.length > 0 || filters.rating !== null || 
              filters.onlyDiscounted || 
              (filters.priceRange[0] > 0 || filters.priceRange[1] < 10000)) && (
              <div className="bg-white p-4 rounded-lg shadow-sm border mb-4">
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-sm text-gray-500">Active filters:</span>
                  
                  {filters.categories.length > 0 && (
                    filters.categories.map(category => (
                      <Badge key={category} variant="outline" className="flex items-center gap-1">
                        {categories.find(c => c.id === category)?.name}
                        <X 
                          className="w-3 h-3 cursor-pointer" 
                          onClick={() => setFilters({
                            ...filters,
                            categories: filters.categories.filter(c => c !== category)
                          })}
                        />
                      </Badge>
                    ))
                  )}
                  
                  {filters.rating !== null && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      {filters.rating}+ Stars
                      <X 
                        className="w-3 h-3 cursor-pointer" 
                        onClick={() => setFilters({ ...filters, rating: null })}
                      />
                    </Badge>
                  )}
                  
                  {(filters.priceRange[0] > 0 || filters.priceRange[1] < 10000) && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      ${filters.priceRange[0]} - ${filters.priceRange[1]}
                      <X 
                        className="w-3 h-3 cursor-pointer" 
                        onClick={() => setFilters({ ...filters, priceRange: [0, 10000] })}
                      />
                    </Badge>
                  )}
                  
                  {filters.onlyDiscounted && (
                    <Badge variant="outline" className="flex items-center gap-1 bg-red-50">
                      On Sale
                      <X 
                        className="w-3 h-3 cursor-pointer" 
                        onClick={() => setFilters({ ...filters, onlyDiscounted: false })}
                      />
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {/* Products Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <Skeleton className="h-48 w-full" />
                    <div className="p-4">
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2 mb-4" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-2/3 mb-4" />
                      <div className="flex justify-between">
                        <Skeleton className="h-6 w-16" />
                        <Skeleton className="h-9 w-24" />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm border">
                <p className="text-red-500">{error}</p>
                <Button 
                  onClick={() => window.location.reload()} 
                  className="mt-4"
                  variant="outline"
                >
                  Retry
                </Button>
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProducts.map((product) => {
                  const discountPercentage = (product as any).discountPercentage || 0;
                  const hasDiscount = discountPercentage > 0;
                  const discountedPrice = hasDiscount 
                    ? product.price * (1 - discountPercentage / 100) 
                    : product.price;
                    
                  return (
                    <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
                      {/* Product Image with Discount Badge */}
                      <div className="relative">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-48 w-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = getDefaultImageByType(product.type);
                          }}
                        />
                        
                        {/* Category Badge */}
                        <div className="absolute top-2 left-2">
                          <Badge className="bg-white/80 text-primary hover:bg-white/70">
                            {product.type.charAt(0).toUpperCase() + product.type.slice(1)}
                          </Badge>
                        </div>
                        
                        {/* Discount Badge */}
                        {hasDiscount && (
                          <div className="absolute top-2 right-2">
                            <Badge className="bg-red-500 text-white hover:bg-red-600">
                              -{discountPercentage}%
                            </Badge>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-col flex-grow p-4">
                        {/* Title and Location */}
                        <div>
                          <CardTitle className="text-lg line-clamp-1">{product.name}</CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {product.location}
                          </p>
                        </div>
                        
                        {/* Rating */}
                        <div className="mt-2">
                          {renderStarRating(product.rating || 0)}
                        </div>
                        
                        {/* Description */}
                        <CardDescription className="line-clamp-2 mt-2 flex-grow">
                          {product.description || 'No description available.'}
                        </CardDescription>
                        
                        {/* Price */}
                        <div className="mt-3 mb-3">
                          {hasDiscount ? (
                            <div>
                              <span className="text-lg font-bold text-red-500">
                                ${discountedPrice.toFixed(2)}
                              </span>
                              <span className="text-sm text-gray-500 line-through ml-2">
                                ${product.price.toFixed(2)}
                              </span>
                            </div>
                          ) : (
                            <span className="text-lg font-bold">
                              ${product.price.toFixed(2)}
                            </span>
                          )}
                        </div>
                        
                        {/* Actions */}
                        <div className="flex gap-2 mt-auto">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="flex-1"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleAddToCart(product.id);
                            }}
                            disabled={addingToCart[product.id]}
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
                          <Button 
                            asChild 
                            size="sm"
                            className="flex-1"
                          >
                            <Link to={`/products/${product.id}`}>
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm border">
                <p className="text-muted-foreground">No products match your filters.</p>
                <Button 
                  onClick={() => {
                    setFilters({
                      priceRange: [0, 10000],
                      categories: [],
                      rating: null,
                      searchQuery: '',
                      sortBy: 'popularity',
                      onlyDiscounted: false
                    });
                  }} 
                  className="mt-4"
                  variant="outline"
                >
                  Clear Filters
                </Button>
              </div>
            )}
            
            {/* Results Count */}
            {filteredProducts.length > 0 && (
              <div className="mt-6 text-center text-sm text-gray-500">
                Showing {filteredProducts.length} of {products.length} products
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-base text-gray-500">
            &copy; {new Date().getFullYear()} TravelEase. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
