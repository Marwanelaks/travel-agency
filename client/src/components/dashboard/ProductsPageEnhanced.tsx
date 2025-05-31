import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Hotel, 
  Plane, 
  Ticket, 
  Activity, 
  Package, 
  Search, 
  Filter, 
  Plus, 
  MoreHorizontal, 
  Edit, 
  Trash, 
  Eye, 
  Tag,
  ArrowUpDown,
  Download,
  UploadCloud,
  RefreshCw,
  ChevronDown,
  ChevronRight,
  CheckCircle,
  Clock,
  Calendar,
  Loader2,
  XCircle,
  AlertCircle,
  Pencil,
  MapPin,
  DollarSign
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { DataTable } from '@/components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';

// Type definition for products
interface Product {
  id: number;
  name: string;
  type: string;
  description: string;
  price: number;
  original_price: number;
  sale_price: number;
  location: string;
  is_active: boolean;
  created_at: string;
}

// This would typically come from your API
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
  },
  {
    id: 4,
    name: 'Broadway Musical Night',
    type: 'entertainment',
    description: 'VIP ticket to a Broadway musical',
    price: 129.99,
    original_price: 159.99,
    sale_price: 129.99,
    location: 'New York',
    is_active: true,
    created_at: '2025-03-12T19:45:00.000Z'
  },
  {
    id: 5,
    name: 'Weekend Getaway Package',
    type: 'package',
    description: 'All-inclusive weekend package for two',
    price: 499.99,
    original_price: 599.99,
    sale_price: 499.99,
    location: 'Rome',
    is_active: true,
    created_at: '2025-03-20T12:00:00.000Z'
  },
  {
    id: 6,
    name: 'Ski Resort Weekend',
    type: 'hotel',
    description: 'Luxury ski resort with spa access',
    price: 449.99,
    original_price: 449.99,
    sale_price: 449.99,
    location: 'Alps',
    is_active: false,
    created_at: '2025-04-02T09:30:00.000Z'
  },
  {
    id: 7,
    name: 'City Tour Guide',
    type: 'tour',
    description: 'Private guided tour of historical landmarks',
    price: 59.99,
    original_price: 79.99,
    sale_price: 59.99,
    location: 'Barcelona',
    is_active: true,
    created_at: '2025-04-15T15:20:00.000Z'
  },
  {
    id: 8,
    name: 'Desert Safari Adventure',
    type: 'activity',
    description: 'Exciting desert safari with dinner and entertainment',
    price: 99.99,
    original_price: 129.99,
    sale_price: 99.99,
    location: 'Dubai',
    is_active: true,
    created_at: '2025-04-22T11:10:00.000Z'
  }
];

// Type icon mapping
const getTypeIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'hotel':
      return <Hotel className="h-5 w-5 text-blue-500" />;
    case 'flight':
      return <Plane className="h-5 w-5 text-purple-500" />;
    case 'sport':
    case 'entertainment':
      return <Ticket className="h-5 w-5 text-red-500" />;
    case 'activity':
    case 'tour':
      return <Activity className="h-5 w-5 text-green-500" />;
    case 'package':
      return <Package className="h-5 w-5 text-amber-500" />;
    default:
      return <Tag className="h-5 w-5 text-gray-500" />;
  }
};

// Format price with currency
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price);
};

// Format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
};

export function ProductsPageEnhanced() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [view, setView] = useState<'grid' | 'table'>('table');
  
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Add product handler
  const handleAddProduct = () => {
    navigate('/dashboard/products-enhanced/new');
  };

  // Fetch products data
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Simulate API call with delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // In a real app, this would be an API call like:
        // const response = await axios.get('/api/products');
        // setProducts(response.data);
        
        setProducts(mockProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
        toast({
          title: "Error",
          description: "Failed to load products. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [toast]);

  // Filter products based on search term and filters
  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || product.type === filterType;
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'active' && product.is_active) || 
      (filterStatus === 'inactive' && !product.is_active);
    
    return matchesSearch && matchesType && matchesStatus;
  });

  // Delete product handler
  const handleDeleteProduct = async (id: number) => {
    try {
      // In a real app, this would be an API call
      // await axios.delete(`/api/products/${id}`);
      
      setProducts(prev => prev.filter(product => product.id !== id));
      
      toast({
        title: "Product Deleted",
        description: "The product has been successfully removed.",
      });
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: "Error",
        description: "Failed to delete the product. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Toggle product status handler
  const handleToggleStatus = async (id: number) => {
    try {
      // Find the product
      const product = products.find(p => p.id === id);
      if (!product) return;
      
      // In a real app, this would be an API call
      // await axios.patch(`/api/products/${id}`, { is_active: !product.is_active });
      
      setProducts(prev => prev.map(p => 
        p.id === id ? { ...p, is_active: !p.is_active } : p
      ));
      
      toast({
        title: product.is_active ? "Product Deactivated" : "Product Activated",
        description: `The product status has been updated to ${product.is_active ? 'inactive' : 'active'}.`,
      });
    } catch (error) {
      console.error('Error updating product status:', error);
      toast({
        title: "Error",
        description: "Failed to update the product status. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Table columns definition
  const columns: ColumnDef<Product, unknown>[] = [
    {
      accessorKey: 'name',
      header: 'Product',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="rounded-md bg-gray-100 dark:bg-gray-800 p-2 flex items-center justify-center">
            {getTypeIcon(row.original.type)}
          </div>
          <div className="max-w-[300px]">
            <div className="font-medium text-gray-900 dark:text-gray-100 truncate">{row.original.name}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400 truncate">{row.original.description}</div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }) => (
        <Badge variant="outline" className="capitalize">
          {row.original.type}
        </Badge>
      ),
    },
    {
      accessorKey: 'price',
      header: 'Price',
      cell: ({ row }) => {
        const product = row.original;
        const hasDiscount = product.original_price > product.sale_price;
        const discountPercentage = hasDiscount
          ? Math.round((1 - (product.sale_price / product.original_price)) * 100)
          : 0;
          
        return (
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {formatPrice(product.sale_price)}
              </span>
              
              {hasDiscount && (
                <Badge className="bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400">
                  -{discountPercentage}%
                </Badge>
              )}
            </div>
            
            {hasDiscount && (
              <div className="text-sm text-gray-500 dark:text-gray-400 line-through">
                {formatPrice(product.original_price)}
              </div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'location',
      header: 'Location',
      cell: ({ row }) => (
        <div className="flex items-center text-gray-700 dark:text-gray-300">
          <MapPin className="h-4 w-4 mr-1 text-gray-400" />
          {row.original.location}
        </div>
      ),
    },
    {
      accessorKey: 'is_active',
      header: 'Status',
      cell: ({ row }) => (
        row.original.is_active ? (
          <Badge className="bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400">
            <CheckCircle className="h-3 w-3 mr-1" />
            Active
          </Badge>
        ) : (
          <Badge variant="secondary" className="bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400">
            <XCircle className="h-3 w-3 mr-1" />
            Inactive
          </Badge>
        )
      ),
    },
    {
      accessorKey: 'created_at',
      header: 'Created',
      cell: ({ row }) => (
        <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
          <Calendar className="h-3 w-3 mr-1" />
          {formatDate(row.original.created_at)}
        </div>
      ),
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem 
              onClick={() => navigate(`/dashboard/products-enhanced/${row.original.id}`)}
              className="cursor-pointer"
            >
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => navigate(`/dashboard/products-enhanced/${row.original.id}/edit`)}
              className="cursor-pointer"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => handleToggleStatus(row.original.id)}
              className="cursor-pointer"
            >
              {row.original.is_active ? (
                <>
                  <XCircle className="h-4 w-4 mr-2" />
                  Deactivate
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Activate
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => handleDeleteProduct(row.original.id)}
              className="text-red-600 focus:text-red-600 cursor-pointer"
            >
              <Trash className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header with title and main action */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Products</h2>
          <p className="text-muted-foreground">Manage your travel products and offerings</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => navigate('/dashboard/products-enhanced/new')}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Filter bar */}
      <Card className="border-none shadow-md overflow-hidden bg-white dark:bg-gray-800">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex-1 max-w-md relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[140px] bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="hotel">Hotels</SelectItem>
                  <SelectItem value="flight">Flights</SelectItem>
                  <SelectItem value="activity">Activities</SelectItem>
                  <SelectItem value="tour">Tours</SelectItem>
                  <SelectItem value="package">Packages</SelectItem>
                  <SelectItem value="sport">Sports</SelectItem>
                  <SelectItem value="entertainment">Entertainment</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[140px] bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" size="icon" className="border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                <Filter className="h-4 w-4 text-gray-500" />
              </Button>
              
              <Button variant="outline" size="icon" className="border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                <RefreshCw className="h-4 w-4 text-gray-500" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products table */}
      <Card className="border-none shadow-md overflow-hidden bg-white dark:bg-gray-800">
        <CardHeader className="border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-gray-800 dark:text-gray-200">Product Inventory</CardTitle>
              <CardDescription className="text-gray-500 dark:text-gray-400">
                {filteredProducts.length} products found
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden md:flex items-center gap-2">
                <Button 
                  variant={view === 'table' ? "default" : "outline"}
                  size="sm"
                  onClick={() => setView('table')}
                  className="flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 mr-1"
                  >
                    <rect width="18" height="18" x="3" y="3" rx="2" />
                    <path d="M3 9h18" />
                    <path d="M3 15h18" />
                    <path d="M9 3v18" />
                    <path d="M15 3v18" />
                  </svg>
                  Table
                </Button>
                <Button 
                  variant={view === 'grid' ? "default" : "outline"}
                  size="sm"
                  onClick={() => setView('grid')}
                  className="flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 mr-1"
                  >
                    <rect width="7" height="7" x="3" y="3" rx="1" />
                    <rect width="7" height="7" x="14" y="3" rx="1" />
                    <rect width="7" height="7" x="14" y="14" rx="1" />
                    <rect width="7" height="7" x="3" y="14" rx="1" />
                  </svg>
                  Grid
                </Button>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="border-gray-200 dark:border-gray-700">
                    <Download className="h-4 w-4 mr-1" />
                    Export
                    <ChevronDown className="h-4 w-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    Export as CSV
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    Export as Excel
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    Export as PDF
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="outline" size="sm" className="border-gray-200 dark:border-gray-700">
                <UploadCloud className="h-4 w-4 mr-1" />
                Import
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center items-center py-16">
              <div className="inline-block p-3 rounded-full bg-gradient-to-tr from-indigo-500/20 to-purple-500/20">
                <div className="animate-spin h-10 w-10 rounded-full border-4 border-indigo-100 border-t-indigo-500"></div>
              </div>
            </div>
          ) : (
            <div>
              {view === 'table' && (
                <div className="w-full">
                  <DataTable 
                    columns={columns} 
                    data={filteredProducts} 
                    searchKey="name"
                    onAddNew={handleAddProduct}
                    filterOptions={[
                      {
                        label: "Type",
                        value: "type",
                        options: [
                          { label: "All", value: "all" },
                          { label: "Hotel", value: "hotel" },
                          { label: "Flight", value: "flight" },
                          { label: "Package", value: "package" },
                        ],
                      },
                      {
                        label: "Status",
                        value: "is_active",
                        options: [
                          { label: "All", value: "all" },
                          { label: "Active", value: "true" },
                          { label: "Inactive", value: "false" },
                        ],
                      },
                    ]}
                    isLoading={loading}
                  />
                </div>
              )}
              
              {view === 'grid' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                  {filteredProducts.map(product => (
                    <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                              {getTypeIcon(product.type)}
                            </div>
                            <div>
                              <CardTitle className="text-base">{product.name}</CardTitle>
                              <CardDescription className="text-xs">{product.type}</CardDescription>
                            </div>
                          </div>
                          <Badge variant={product.is_active ? "default" : "secondary"}>
                            {product.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{product.description}</p>
                        <div className="mt-2 text-sm flex items-center text-gray-500 dark:text-gray-400">
                          <MapPin className="h-3 w-3 mr-1" />
                          {product.location}
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between pt-0">
                        <div>
                          {product.original_price > product.sale_price ? (
                            <div className="flex flex-col">
                              <div className="flex items-center gap-2">
                                <span className="text-lg font-semibold">
                                  {formatPrice(product.sale_price)}
                                </span>
                                <Badge className="bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400">
                                  -{Math.round((1 - (product.sale_price / product.original_price)) * 100)}%
                                </Badge>
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400 line-through">
                                {formatPrice(product.original_price)}
                              </div>
                            </div>
                          ) : (
                            <div className="text-lg font-semibold">{formatPrice(product.sale_price)}</div>
                          )}
                        </div>
                        <Button size="sm" variant="outline" onClick={() => navigate(`/products/${product.id}`)}>
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter className="border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 py-3">
          <div className="flex items-center justify-between w-full">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Showing {filteredProducts.length} of {products.length} products
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
