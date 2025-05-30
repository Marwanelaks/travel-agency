import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LoadingSpinner, PageLoadingSpinner } from '../ui/loading-spinner';
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
  ArrowUpDown
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { DataTable } from '../ui/data-table-a11y';
import { ColumnDef } from '@tanstack/react-table';

// This would typically come from your API
const mockProducts = [
  {
    id: 1,
    name: 'Luxury Beach Resort',
    type: 'hotel',
    description: '5-star luxury resort with private beach access',
    price: 299.99,
    location: 'Maldives',
    is_active: true,
    created_at: '2025-01-15T08:00:00.000Z'
  },
  {
    id: 2,
    name: 'Business Class Flight to Paris',
    type: 'flight',
    description: 'Round-trip business class flight to Paris',
    price: 1299.99,
    location: 'Dubai',
    is_active: true,
    created_at: '2025-02-10T10:30:00.000Z'
  },
  {
    id: 3,
    name: 'Champions League Final',
    type: 'sport',
    description: 'Football match ticket for the UEFA Champions League Final',
    price: 399.99,
    location: 'London',
    is_active: true,
    created_at: '2025-03-05T14:15:00.000Z'
  },
  {
    id: 4,
    name: 'Broadway Musical Night',
    type: 'entertainment',
    description: 'VIP ticket to a Broadway musical',
    price: 159.99,
    location: 'New York',
    is_active: true,
    created_at: '2025-03-12T19:45:00.000Z'
  },
  {
    id: 5,
    name: 'Weekend Getaway Package',
    type: 'package',
    description: 'All-inclusive weekend package for two',
    price: 599.99,
    location: 'Rome',
    is_active: true,
    created_at: '2025-03-25T09:20:00.000Z'
  },
  {
    id: 6,
    name: 'Travel Insurance',
    type: 'other',
    description: 'Comprehensive travel insurance for your trip',
    price: 49.99,
    location: null,
    is_active: true,
    created_at: '2025-04-01T11:10:00.000Z'
  },
];

type Product = typeof mockProducts[0];

// Type icon mapping
const getTypeIcon = (type: string) => {
  switch (type) {
    case 'hotel':
      return <Hotel className="h-4 w-4" />;
    case 'flight':
      return <Plane className="h-4 w-4" />;
    case 'sport':
      return <Activity className="h-4 w-4" />;
    case 'entertainment':
      return <Ticket className="h-4 w-4" />;
    case 'package':
      return <Package className="h-4 w-4" />;
    default:
      return <Tag className="h-4 w-4" />;
  }
};

export function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [currentTab, setCurrentTab] = useState('all');
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Fetch products from the API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Try to fetch from API first
        try {
          const response = await axios.get('http://localhost:8000/api/products');
          setProducts(response.data);
        } catch (apiError) {
          console.warn('API fetch failed, using mock data', apiError);
          // Fallback to mock data if API fails
          setProducts(mockProducts);
        }
      } catch (err) {
        setError('Failed to load products. Please try again.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

  // Column definitions for the data table
  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {getTypeIcon(row.original.type)}
          <span className="font-medium">{row.original.name}</span>
        </div>
      ),
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => {
        const type = row.original.type;
        return (
          <div className="flex items-center">
            <Badge variant="outline" className="capitalize">
              {type}
            </Badge>
          </div>
        );
      },
    },
    {
      accessorKey: "price",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Price
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const price = parseFloat(row.getValue("price"));
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(price);
        return <div>{formatted}</div>;
      },
    },
    {
      accessorKey: "location",
      header: "Location",
      cell: ({ row }) => row.original.location || "N/A",
    },
    {
      accessorKey: "is_active",
      header: "Status",
      cell: ({ row }) => {
        return (
          <Badge variant={row.original.is_active ? "success" : "destructive"}>
            {row.original.is_active ? "Active" : "Inactive"}
          </Badge>
        );
      },
    },
    {
      id: "actions",
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
            <DropdownMenuItem onClick={() => handleViewProduct(row.original.id)}>
              <Eye className="mr-2 h-4 w-4" />
              View details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleEditProduct(row.original.id)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleDeleteProduct(row.original.id)} className="text-red-600">
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  // Filter products based on search term and type
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = filterType === 'all' || product.type === filterType;
    const matchesTab = currentTab === 'all' || product.type === currentTab;
    
    return matchesSearch && matchesType && matchesTab;
  });

  // Handler functions
  const handleAddProduct = () => navigate('/dashboard/products/new');
  
  const handleViewProduct = (id: number) => {
    navigate(`/dashboard/products/${id}`);
  };
  
  const handleEditProduct = (id: number) => {
    navigate(`/dashboard/products/${id}/edit`);
  };
  
  const handleDeleteProduct = (id: number) => {
    if (confirm('Are you sure you want to delete this product?')) {
      // In a real app, you would call an API to delete the product
      setProducts(products.filter(product => product.id !== id));
      toast({
        title: "Product deleted",
        description: "The product has been successfully deleted.",
      });
    }
  };

  // Handle error and loading states
  if (error) {
    return (
      <Card className="p-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <span className="text-destructive text-lg">{error}</span>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </Card>
    );
  }
  
  if (isLoading) {
    return <PageLoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Products</h2>
        <Button onClick={handleAddProduct}>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      <Tabs defaultValue="all" value={currentTab} onValueChange={setCurrentTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Products</TabsTrigger>
          <TabsTrigger value="hotel">Hotels</TabsTrigger>
          <TabsTrigger value="flight">Flights</TabsTrigger>
          <TabsTrigger value="sport">Sports</TabsTrigger>
          <TabsTrigger value="entertainment">Entertainment</TabsTrigger>
          <TabsTrigger value="package">Packages</TabsTrigger>
        </TabsList>

        <Card>
          <CardHeader>
            <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
              <div>
                <CardTitle>Product Management</CardTitle>
                <CardDescription>
                  View and manage all your travel products from one place
                </CardDescription>
              </div>
              <div className="flex flex-col space-y-2 md:flex-row md:space-x-2 md:space-y-0">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="relative flex-1 w-full">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search products..."
                      className="pl-8 w-full"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-full sm:w-[160px]">
                      <Filter className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="hotel">Hotels</SelectItem>
                      <SelectItem value="flight">Flights</SelectItem>
                      <SelectItem value="activity">Activities</SelectItem>
                      <SelectItem value="package">Packages</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <DataTable 
              columns={columns} 
              data={filteredProducts} 
              searchKey="name" 
              ariaLabel="Products Table"
              caption="List of available travel products"
            />
          </CardContent>
          <CardFooter className="justify-between">
            <div className="text-sm text-muted-foreground">
              Showing <strong>{filteredProducts.length}</strong> of <strong>{products.length}</strong> products
            </div>
          </CardFooter>
        </Card>
      </Tabs>
    </div>
  );
}
