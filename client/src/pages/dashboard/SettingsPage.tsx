import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { gradientPresets, siteConfig, GradientPreset, FeaturedProductSetting } from "@/config/siteConfig";
import { getProducts } from "@/services/productService";
import { Separator } from "@/components/ui/separator";
import { X, Check, Info } from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

// Import the Product type
import { Product as ImportedProduct } from "@/types/product";

// Define a local Product interface that extends the imported one but ensures id is treated as number for calculations
interface Product extends Omit<ImportedProduct, 'id'> {
  id: number;
}

export default function SettingsPage() {
  const { toast } = useToast();
  // Active gradient preset state
  const [activeGradient, setActiveGradient] = useState<string>(
    localStorage.getItem("activeGradientPreset") || siteConfig.activeGradient
  );

  // Featured products settings state
  const [featuredSettings, setFeaturedSettings] = useState<FeaturedProductSetting>({
    ...siteConfig.featuredProducts
  });

  // Products state
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);

  // Load products
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true);
        const productsData = await getProducts();
        // Convert string IDs to numbers to ensure type safety
        const convertedProducts: Product[] = productsData.map(product => ({
          ...product,
          id: Number(product.id)
        }));
        setProducts(convertedProducts);
      } catch (error) {
        console.error("Failed to load products:", error);
        toast({
          title: "Error",
          description: "Failed to load products",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Load selected products based on IDs
  useEffect(() => {
    if (!isLoading && products.length > 0) {
      // Get the stored product IDs or use empty array
      const storedSettings = localStorage.getItem("featuredProductSettings");
      const storedProductIds = storedSettings 
        ? JSON.parse(storedSettings).productIds 
        : featuredSettings.productIds;

      // Filter selected products
      const selected = products.filter(product => 
        storedProductIds.includes(product.id)
      );
      setSelectedProducts(selected);

      // Filter available (unselected) products
      const available = products.filter(product => 
        !storedProductIds.includes(product.id)
      );
      setAvailableProducts(available);

      // Update settings with stored IDs
      if (storedSettings) {
        setFeaturedSettings(prev => ({
          ...prev,
          ...JSON.parse(storedSettings)
        }));
      }
    }
  }, [isLoading, products]);

  // Function to get current gradient preset
  const getCurrentGradientPreset = () => {
    return gradientPresets.find(preset => preset.id === activeGradient) || gradientPresets[0];
  };

  // Function to update color scheme
  const handleGradientChange = (gradientId: string) => {
    setActiveGradient(gradientId);
    localStorage.setItem("activeGradientPreset", gradientId);
    toast({
      title: "Color scheme updated",
      description: "Your site colors have been updated successfully.",
    });
  };

  // Function to toggle featured products
  const handleFeaturedToggle = (enabled: boolean) => {
    setFeaturedSettings(prev => ({
      ...prev,
      enabled
    }));
  };

  // Function to update featured products settings
  const handleFeaturedSettingsChange = (field: keyof FeaturedProductSetting, value: any) => {
    setFeaturedSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Function to add a product to featured list
  const handleAddProduct = (productId: number) => {
    if (selectedProducts.length >= featuredSettings.maxProducts) {
      toast({
        title: "Maximum products reached",
        description: `You can select up to ${featuredSettings.maxProducts} featured products.`,
        variant: "destructive"
      });
      return;
    }

    const newProductIds = [...featuredSettings.productIds, productId];
    setFeaturedSettings(prev => ({
      ...prev,
      productIds: newProductIds
    }));

    // Update selected and available products
    const productToAdd = availableProducts.find(p => p.id === productId);
    if (productToAdd) {
      setSelectedProducts([...selectedProducts, productToAdd]);
      setAvailableProducts(availableProducts.filter(p => p.id !== productId));
    }
  };

  // Function to remove a product from featured list
  const handleRemoveProduct = (productId: number) => {
    const newProductIds = featuredSettings.productIds.filter(id => id !== productId);
    setFeaturedSettings(prev => ({
      ...prev,
      productIds: newProductIds
    }));

    // Update selected and available products
    const productToRemove = selectedProducts.find(p => p.id === productId);
    if (productToRemove) {
      setAvailableProducts([...availableProducts, productToRemove]);
      setSelectedProducts(selectedProducts.filter(p => p.id !== productId));
    }
  };

  // Function to save settings
  const handleSaveSettings = () => {
    // In a real application, this would call an API to save settings to the server
    // For now, we'll save to localStorage
    localStorage.setItem("featuredProductSettings", JSON.stringify(featuredSettings));
    toast({
      title: "Settings saved",
      description: "Your settings have been saved successfully.",
    });
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Site Settings</h1>
        <p className="text-muted-foreground">
          Configure your site appearance and featured content
        </p>
      </div>

      <Tabs defaultValue="appearance">
        <TabsList className="mb-4">
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="featured">Featured Content</TabsTrigger>
        </TabsList>

        {/* Appearance Tab */}
        <TabsContent value="appearance">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Color Scheme</CardTitle>
                <CardDescription>
                  Choose a color scheme for your site. Changes will apply to the homepage and other key areas.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {gradientPresets.map((preset) => (
                    <div 
                      key={preset.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        activeGradient === preset.id ? 'ring-2 ring-primary' : ''
                      }`}
                      onClick={() => handleGradientChange(preset.id)}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium">{preset.name}</h3>
                        {activeGradient === preset.id && <Check className="h-5 w-5 text-primary" />}
                      </div>
                      
                      {/* Header Preview */}
                      <div className={`h-6 rounded-md mb-2 bg-gradient-to-r ${preset.headerGradient}`} />
                      
                      {/* Hero Preview */}
                      <div className={`h-12 rounded-md mb-2 bg-gradient-to-r ${preset.heroGradient}`}>
                        <div className="h-full flex items-center justify-center">
                          <div className={`text-xs font-bold text-transparent bg-clip-text bg-gradient-to-r ${preset.textGradient}`}>
                            Sample Text
                          </div>
                        </div>
                      </div>
                      
                      {/* Button Previews */}
                      <div className="flex gap-2">
                        <div className={`h-6 flex-1 rounded-md bg-gradient-to-r ${preset.primaryButtonGradient}`} />
                        <div className={`h-6 flex-1 rounded-md bg-gradient-to-r ${preset.secondaryButtonGradient}`} />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Active Scheme Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-hidden rounded-lg border">
                  {/* Header */}
                  <div className={`p-4 bg-gradient-to-r ${getCurrentGradientPreset().headerGradient}`}>
                    <div className="text-white font-bold">TravelEase</div>
                  </div>
                  
                  {/* Hero Section */}
                  <div className={`p-6 bg-gradient-to-r ${getCurrentGradientPreset().heroGradient}`}>
                    <h2 className={`text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${getCurrentGradientPreset().textGradient}`}>
                      Find your perfect travel experience
                    </h2>
                    <div className="mt-3 flex gap-2">
                      <button className={`px-3 py-1 rounded text-white text-sm bg-gradient-to-r ${getCurrentGradientPreset().primaryButtonGradient}`}>
                        Explore Now
                      </button>
                      <button className={`px-3 py-1 rounded text-white text-sm bg-gradient-to-r ${getCurrentGradientPreset().secondaryButtonGradient}`}>
                        View Deals
                      </button>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-4 bg-white">
                    <h3 className="font-medium">Featured Destinations</h3>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div className="bg-gray-100 rounded p-2 text-xs">Product Card 1</div>
                      <div className="bg-gray-100 rounded p-2 text-xs">Product Card 2</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Featured Content Tab */}
        <TabsContent value="featured">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Featured Products</CardTitle>
                <CardDescription>
                  Configure which products appear in the featured section on your homepage
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Enable/Disable Featured Products */}
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="featured-toggle"
                      checked={featuredSettings.enabled}
                      onCheckedChange={handleFeaturedToggle}
                    />
                    <Label htmlFor="featured-toggle">Enable Featured Products Section</Label>
                  </div>
                  
                  {featuredSettings.enabled && (
                    <>
                      <Separator className="my-4" />
                      
                      {/* Section Title and Description */}
                      <div className="grid gap-4">
                        <div>
                          <Label htmlFor="featured-title">Section Title</Label>
                          <Input
                            id="featured-title"
                            value={featuredSettings.title}
                            onChange={(e) => handleFeaturedSettingsChange('title', e.target.value)}
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="featured-description">Section Description</Label>
                          <Input
                            id="featured-description"
                            value={featuredSettings.description}
                            onChange={(e) => handleFeaturedSettingsChange('description', e.target.value)}
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="max-products">Maximum Products to Display</Label>
                          <Input
                            id="max-products"
                            type="number"
                            min={1}
                            max={12}
                            value={featuredSettings.maxProducts}
                            onChange={(e) => handleFeaturedSettingsChange('maxProducts', parseInt(e.target.value))}
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="auto-select">Auto-Select Strategy</Label>
                          <Select 
                            value={featuredSettings.autoSelectStrategy || 'popular'}
                            onValueChange={(value) => handleFeaturedSettingsChange('autoSelectStrategy', value)}
                          >
                            <SelectTrigger id="auto-select">
                              <SelectValue placeholder="Select a strategy" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="newest">Newest Products</SelectItem>
                              <SelectItem value="popular">Most Popular</SelectItem>
                              <SelectItem value="discounted">Discounted Items</SelectItem>
                              <SelectItem value="random">Random Selection</SelectItem>
                            </SelectContent>
                          </Select>
                          <p className="text-sm text-muted-foreground mt-1">
                            Used when no products are manually selected or not enough products are available
                          </p>
                        </div>
                      </div>
                      
                      <Separator className="my-4" />
                      
                      {/* Selected Products */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium">Selected Products</h3>
                          <span className="text-sm text-muted-foreground">
                            {selectedProducts.length} of {featuredSettings.maxProducts} selected
                          </span>
                        </div>
                        
                        {selectedProducts.length > 0 ? (
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Product Name</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Action</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {selectedProducts.map((product) => (
                                <TableRow key={product.id}>
                                  <TableCell className="font-medium">{product.name}</TableCell>
                                  <TableCell>{product.type}</TableCell>
                                  <TableCell>${product.price}</TableCell>
                                  <TableCell>
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => handleRemoveProduct(product.id)}
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        ) : (
                          <div className="flex items-center justify-center p-4 border rounded-md bg-muted/20">
                            <p className="text-sm text-muted-foreground">No products selected</p>
                          </div>
                        )}
                      </div>
                      
                      <Separator className="my-4" />
                      
                      {/* Available Products */}
                      <div>
                        <h3 className="font-medium mb-2">Available Products</h3>
                        {isLoading ? (
                          <div className="flex items-center justify-center p-4">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                          </div>
                        ) : availableProducts.length > 0 ? (
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Product Name</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Action</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {availableProducts.map((product) => (
                                <TableRow key={product.id}>
                                  <TableCell className="font-medium">{product.name}</TableCell>
                                  <TableCell>{product.type}</TableCell>
                                  <TableCell>${product.price}</TableCell>
                                  <TableCell>
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => handleAddProduct(product.id)}
                                      disabled={selectedProducts.length >= featuredSettings.maxProducts}
                                    >
                                      <Check className="h-4 w-4" />
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        ) : (
                          <div className="flex items-center justify-center p-4 border rounded-md bg-muted/20">
                            <p className="text-sm text-muted-foreground">No more products available</p>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveSettings}>Save Settings</Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
