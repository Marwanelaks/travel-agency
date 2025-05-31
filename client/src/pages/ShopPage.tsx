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
      <header className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-2xl font-bold text-white flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M5.5 16a.5.5 0 01-.5-.5v-6a.5.5 0 01.5-.5h2a.5.5 0 01.5.5v6a.5.5 0 01-.5.5h-2zm4-10a.5.5 0 01-.5-.5v-2a.5.5 0 01.5-.5h2a.5.5 0 01.5.5v2a.5.5 0 01-.5.5h-2zm4 10a.5.5 0 01-.5-.5v-10a.5.5 0 01.5-.5h2a.5.5 0 01.5.5v10a.5.5 0 01-.5.5h-2z" />
                </svg>
                TravelEase
              </Link>
            </div>
            <div className="hidden sm:block flex-1 max-w-md mx-auto">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-indigo-200" />
                </div>
                <Input
                  type="text"
                  placeholder="Search destinations, hotels, flights..."
                  className="pl-10 pr-4 py-2 w-full bg-indigo-700/30 border-indigo-500/50 text-white placeholder:text-indigo-200 focus:bg-indigo-800/40 transition-all duration-200"
                  value={filters.searchQuery}
                  onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
                />
              </div>
            </div>
            <nav className="flex items-center space-x-4">
              <MiniCart />
              <Button asChild variant="secondary" className="bg-white/10 hover:bg-white/20 text-white border-none">
                <Link to="/dashboard">Dashboard</Link>
              </Button>
            </nav>
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-b from-indigo-600 to-indigo-900 text-white overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path fill="#fff" fillOpacity="1" d="M0,192L48,176C96,160,192,128,288,133.3C384,139,480,181,576,192C672,203,768,181,864,165.3C960,149,1056,139,1152,144C1248,149,1344,171,1392,181.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">Discover Your Perfect Getaway</h1>
            <p className="text-xl max-w-3xl mx-auto text-indigo-100 mb-8">Explore our curated selection of hotels, flights, and vacation packages designed for unforgettable experiences.</p>
            <div className="flex flex-wrap justify-center gap-4 max-w-2xl mx-auto mb-6">
              {categories.map((category) => (
                <Button 
                  key={category.id}
                  variant="secondary"
                  className={`bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 ${filters.categories.includes(category.id) ? 'bg-white/30 ring-2 ring-white' : ''}`}
                  onClick={() => {
                    if (filters.categories.includes(category.id)) {
                      setFilters({
                        ...filters,
                        categories: filters.categories.filter(c => c !== category.id)
                      });
                    } else {
                      setFilters({
                        ...filters,
                        categories: [...filters.categories, category.id]
                      });
                    }
                  }}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>
        </div>
        <div className="h-16 bg-gradient-to-b from-indigo-900/0 to-gray-50 relative z-10"></div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mobile search - visible only on small screens */}
        <div className="sm:hidden mb-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-indigo-400" />
            </div>
            <Input
              type="text"
              placeholder="Search destinations, hotels, flights..."
              className="pl-10 pr-4 py-2 w-full border-indigo-200 focus:border-indigo-500 transition-all duration-200"
              value={filters.searchQuery}
              onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters Sidebar */}
          <aside className={`md:w-72 shrink-0 transition-all duration-300 ease-in-out ${showFilters ? 'block' : 'hidden md:block'}`}>
            <div className="bg-white p-6 rounded-xl shadow-md border border-indigo-100 overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500"></div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold flex items-center text-indigo-900">
                  <Filter className="w-5 h-5 mr-2 text-indigo-600" />
                  Refine Results
                </h2>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="md:hidden text-indigo-600 hover:bg-indigo-50"
                  onClick={() => setShowFilters(false)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <Accordion type="single" collapsible className="w-full">
                {/* Price Range Filter */}
                <AccordionItem value="price" className="border-b border-indigo-100">
                  <AccordionTrigger className="text-sm font-medium text-indigo-900 hover:text-indigo-700 hover:no-underline py-4">
                    <div className="flex items-center">
                      <Tag className="w-4 h-4 mr-2 text-indigo-600" />
                      Price Range
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="py-4 px-1">
                      <Slider
                        defaultValue={[0, 10000]}
                        max={10000}
                        step={100}
                        value={filters.priceRange}
                        onValueChange={(value) => setFilters({ ...filters, priceRange: value as [number, number] })}
                        className="my-6"
                      />
                      <div className="flex items-center justify-between">
                        <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-md text-sm font-medium">
                          ${filters.priceRange[0]}
                        </span>
                        <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-md text-sm font-medium">
                          ${filters.priceRange[1]}
                        </span>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Categories Filter */}
                <AccordionItem value="categories" className="border-b border-indigo-100">
                  <AccordionTrigger className="text-sm font-medium text-indigo-900 hover:text-indigo-700 hover:no-underline py-4">
                    <div className="flex items-center">
                      <Filter className="w-4 h-4 mr-2 text-indigo-600" />
                      Categories
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid grid-cols-2 gap-3 py-2">
                      {categories.map((category) => (
                        <div 
                          key={category.id}
                          className={`flex items-center p-2 rounded-lg cursor-pointer transition-all duration-200 ${filters.categories.includes(category.id) ? 'bg-indigo-100 text-indigo-800' : 'hover:bg-gray-50'}`}
                          onClick={() => {
                            if (filters.categories.includes(category.id)) {
                              setFilters({
                                ...filters,
                                categories: filters.categories.filter(c => c !== category.id)
                              });
                            } else {
                              setFilters({
                                ...filters,
                                categories: [...filters.categories, category.id]
                              });
                            }
                          }}
                        >
                          <Checkbox 
                            id={`category-${category.id}`} 
                            checked={filters.categories.includes(category.id)}
                            className="data-[state=checked]:bg-indigo-600 data-[state=checked]:text-primary-foreground"
                          />
                          <label 
                            htmlFor={`category-${category.id}`}
                            className="text-sm ml-2 font-medium cursor-pointer select-none"
                          >
                            {category.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Rating Filter */}
                <AccordionItem value="rating" className="border-b border-indigo-100">
                  <AccordionTrigger className="text-sm font-medium text-indigo-900 hover:text-indigo-700 hover:no-underline py-4">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 mr-2 text-indigo-600" />
                      Rating
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3 py-2">
                      {[5, 4, 3, 2, 1].map((star) => (
                        <div 
                          className={`flex items-center p-2 rounded-lg cursor-pointer transition-all duration-200 ${filters.rating === star ? 'bg-amber-50 text-amber-800' : 'hover:bg-gray-50'}`} 
                          key={star}
                          onClick={() => {
                            setFilters({
                              ...filters,
                              rating: filters.rating === star ? null : star
                            });
                          }}
                        >
                          <Checkbox 
                            id={`rating-${star}`} 
                            checked={filters.rating === star}
                            className="data-[state=checked]:bg-amber-500 data-[state=checked]:text-primary-foreground"
                          />
                          <label 
                            htmlFor={`rating-${star}`}
                            className="text-sm ml-2 font-medium cursor-pointer select-none flex items-center"
                          >
                            <div className="flex items-center text-amber-400">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${i < star ? 'fill-current' : 'text-gray-300'}`}
                                />
                              ))}
                            </div>
                            <span className="ml-2 text-gray-700">& Up</span>
                          </label>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Discounts Filter */}
                <AccordionItem value="discounts" className="border-b border-indigo-100">
                  <AccordionTrigger className="text-sm font-medium text-indigo-900 hover:text-indigo-700 hover:no-underline py-4">
                    <div className="flex items-center">
                      <BadgePercent className="w-4 h-4 mr-2 text-indigo-600" />
                      Special Offers
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div 
                      className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200 ${filters.onlyDiscounted ? 'bg-rose-50 text-rose-800' : 'hover:bg-gray-50'}`}
                      onClick={() => {
                        setFilters({
                          ...filters,
                          onlyDiscounted: !filters.onlyDiscounted
                        });
                      }}
                    >
                      <Checkbox 
                        id="discounted-only" 
                        checked={filters.onlyDiscounted}
                        className="data-[state=checked]:bg-rose-600 data-[state=checked]:text-primary-foreground"
                      />
                      <label 
                        htmlFor="discounted-only"
                        className="text-sm ml-2 font-medium cursor-pointer select-none flex items-center"
                      >
                        <BadgePercent className="w-4 h-4 mr-1 text-rose-500" />
                        <span className="font-medium">Items on Sale</span>
                      </label>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <div className="mt-6 pt-4 border-t border-indigo-100">
                <Button 
                  variant="outline" 
                  className="w-full bg-white border-indigo-200 text-indigo-700 hover:bg-indigo-50 hover:text-indigo-800 transition-all duration-200 font-medium"
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
                  <X className="w-4 h-4 mr-2" />
                  Reset All Filters
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="overflow-hidden rounded-xl border-0 shadow-md">
                    <div className="relative">
                      <Skeleton className="h-56 w-full" />
                      <div className="absolute top-2 right-2">
                        <Skeleton className="h-6 w-12 rounded-full" />
                      </div>
                    </div>
                    <div className="p-6">
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2 mb-4" />
                      <div className="flex mb-3">
                        {[...Array(5)].map((_, starIndex) => (
                          <Skeleton key={starIndex} className="h-4 w-4 mr-1 rounded-full" />
                        ))}
                      </div>
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-2/3 mb-4" />
                      <div className="flex justify-between items-center">
                        <Skeleton className="h-7 w-20" />
                        <div className="flex gap-2">
                          <Skeleton className="h-9 w-20 rounded-lg" />
                          <Skeleton className="h-9 w-16 rounded-lg" />
                        </div>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => {
                  const discountPercentage = (product as any).discountPercentage || 0;
                  const hasDiscount = discountPercentage > 0;
                  const discountedPrice = hasDiscount 
                    ? product.price * (1 - discountPercentage / 100) 
                    : product.price;
                    
                  return (
                    <Card key={product.id} className="overflow-hidden group hover:shadow-xl transition-all duration-300 h-full flex flex-col border-0 shadow-md rounded-xl">
                      {/* Product Image with Discount Badge */}
                      <div className="relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-56 w-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = getDefaultImageByType(product.type);
                          }}
                        />
                        
                        {/* Category Badge */}
                        <div className="absolute top-3 left-3 z-20">
                          <Badge className="bg-white/90 text-indigo-600 hover:bg-white font-medium shadow-sm">
                            {product.type.charAt(0).toUpperCase() + product.type.slice(1)}
                          </Badge>
                        </div>
                        
                        {/* Discount Badge */}
                        {hasDiscount && (
                          <div className="absolute top-3 right-3 z-20">
                            <Badge className="bg-gradient-to-r from-rose-500 to-pink-500 text-white font-medium shadow-sm">
                              -{discountPercentage}% OFF
                            </Badge>
                          </div>
                        )}
                        
                        {/* Quick Action Buttons (visible on hover) */}
                        <div className="absolute bottom-3 right-3 left-3 z-20 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <Button 
                            variant="secondary" 
                            size="sm"
                            className="bg-white/90 hover:bg-white text-indigo-600 rounded-full w-10 h-10 p-0 mr-2"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleAddToCart(product.id);
                            }}
                            disabled={addingToCart[product.id]}
                          >
                            {addingToCart[product.id] ? (
                              <span className="animate-spin">⟳</span>
                            ) : (
                              <ShoppingCart className="w-5 h-5" />
                            )}
                          </Button>
                          <Button 
                            asChild 
                            variant="secondary"
                            size="sm"
                            className="bg-white/90 hover:bg-white text-indigo-600 rounded-full w-10 h-10 p-0"
                          >
                            <Link to={`/products/${product.id}`}>
                              <Eye className="w-5 h-5" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex flex-col flex-grow p-5">
                        {/* Title and Location */}
                        <div>
                          <CardTitle className="text-lg font-bold line-clamp-1 group-hover:text-indigo-600 transition-colors duration-200">{product.name}</CardTitle>
                          <p className="text-sm text-gray-500 flex items-center mt-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {product.location}
                          </p>
                        </div>
                        
                        {/* Rating */}
                        <div className="mt-3 flex items-center">
                          <div className="flex text-amber-400">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${i < Math.round(product.rating || 0) ? 'fill-current' : 'text-gray-300'}`}
                              />
                            ))}
                          </div>
                          <span className="ml-2 text-xs text-gray-500">{product.rating?.toFixed(1) || '0.0'}/5.0</span>
                        </div>
                        
                        {/* Description */}
                        <CardDescription className="line-clamp-2 mt-3 text-gray-600 flex-grow">
                          {product.description || 'No description available.'}
                        </CardDescription>
                        
                        {/* Price */}
                        <div className="mt-4 mb-3">
                          {hasDiscount ? (
                            <div className="flex items-center">
                              <span className="text-xl font-bold text-indigo-600">
                                ${discountedPrice.toFixed(2)}
                              </span>
                              <span className="text-sm text-gray-500 line-through ml-2">
                                ${product.price.toFixed(2)}
                              </span>
                            </div>
                          ) : (
                            <span className="text-xl font-bold text-indigo-600">
                              ${product.price.toFixed(2)}
                            </span>
                          )}
                        </div>
                        
                        {/* Actions */}
                        <div className="flex gap-2 mt-auto pt-3 border-t border-gray-100">
                          <Button 
                            className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                            size="sm"
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
                                <ShoppingCart className="w-4 h-4 mr-2" />
                                Add to Cart
                              </>
                            )}
                          </Button>
                          <Button 
                            asChild 
                            variant="outline" 
                            size="sm"
                            className="flex-[0.4] border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700"
                          >
                            <Link to={`/products/${product.id}`}>
                              <Eye className="w-4 h-4" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-xl shadow-md border-0">
                <div className="max-w-md mx-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-indigo-200 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <h3 className="text-xl font-bold text-indigo-900 mb-2">No Results Found</h3>
                  <p className="text-gray-500 mb-6">We couldn't find any products that match your current filters. Try adjusting your search criteria.</p>
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
                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Reset All Filters
                  </Button>
                </div>
              </div>
            )}
            
            {/* Results Count */}
            {filteredProducts.length > 0 && (
              <div className="mt-8 text-center">
                <div className="inline-block px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium">
                  Showing {filteredProducts.length} of {products.length} products
                </div>
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
