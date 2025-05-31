import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChart2, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  CreditCard, 
  Calendar, 
  ArrowRight, 
  Download, 
  Search, 
  Filter, 
  RefreshCw, 
  HelpCircle,
  Star,
  ArrowUpRight,
  PieChart,
  BarChart,
  LineChart as LineChartIcon,
  ShoppingBag,
  MapPin,
  Plane
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { AreaChart, LineChart, BarChart as BarChartComponent, DonutChart, MetricCard } from '@/components/ui/charts';
import { Progress } from '@/components/ui/progress';

export function AnalyticsPage() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('month');
  const [activeTab, setActiveTab] = useState('overview');
  
  // Simulated data - in a real application, this would come from an API
  const revenueData = [
    { date: 'Jan', revenue: 15000, orders: 130, profit: 8250 },
    { date: 'Feb', revenue: 18000, orders: 145, profit: 9900 },
    { date: 'Mar', revenue: 22000, orders: 170, profit: 12100 },
    { date: 'Apr', revenue: 19000, orders: 155, profit: 10450 },
    { date: 'May', revenue: 25000, orders: 190, profit: 13750 },
    { date: 'Jun', revenue: 32000, orders: 220, profit: 17600 },
    { date: 'Jul', revenue: 38000, orders: 250, profit: 20900 },
    { date: 'Aug', revenue: 42000, orders: 270, profit: 23100 },
    { date: 'Sep', revenue: 36000, orders: 240, profit: 19800 },
    { date: 'Oct', revenue: 29000, orders: 200, profit: 15950 },
    { date: 'Nov', revenue: 33000, orders: 230, profit: 18150 },
    { date: 'Dec', revenue: 45000, orders: 290, profit: 24750 }
  ];

  const productPerformance = [
    { name: 'Hotel Bookings', sales: 42, percentage: 42 },
    { name: 'Flight Tickets', sales: 28, percentage: 28 },
    { name: 'Tour Packages', sales: 18, percentage: 18 },
    { name: 'Activities', sales: 12, percentage: 12 }
  ];

  const salesByRegion = [
    { name: 'North America', value: 36, color: 'hsl(210, 70%, 50%)' },
    { name: 'Europe', value: 32, color: 'hsl(120, 70%, 50%)' },
    { name: 'Asia Pacific', value: 22, color: 'hsl(45, 70%, 50%)' },
    { name: 'Middle East', value: 6, color: 'hsl(0, 70%, 50%)' },
    { name: 'Other', value: 4, color: 'hsl(280, 70%, 50%)' }
  ];

  const topSellingProducts = [
    { 
      id: 1, 
      name: 'Luxury Beach Resort', 
      type: 'hotel',
      icon: <Star className="h-4 w-4 text-yellow-500" />,
      color: 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
      location: 'Maldives', 
      sales: 152, 
      revenue: 45448,
      growth: 12.5
    },
    { 
      id: 2, 
      name: 'Business Flight Dubai-London', 
      type: 'flight',
      icon: <Plane className="h-4 w-4 text-purple-500" />,
      color: 'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
      location: 'UAE', 
      sales: 124, 
      revenue: 37076,
      growth: 8.3
    },
    { 
      id: 3, 
      name: 'European Adventure Package', 
      type: 'package',
      icon: <ShoppingBag className="h-4 w-4 text-green-500" />,
      color: 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400',
      location: 'Multiple', 
      sales: 98, 
      revenue: 29302,
      growth: 15.7
    },
    { 
      id: 4, 
      name: 'Mountain Hiking Experience', 
      type: 'activity',
      icon: <MapPin className="h-4 w-4 text-red-500" />,
      color: 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400',
      location: 'Switzerland', 
      sales: 87, 
      revenue: 26013,
      growth: -3.2
    }
  ];

  // Simulate API fetch
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  // Metrics calculations
  const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenue, 0);
  const totalOrders = revenueData.reduce((sum, item) => sum + item.orders, 0);
  const totalProfit = revenueData.reduce((sum, item) => sum + item.profit, 0);
  const averageOrderValue = totalRevenue / totalOrders;

  const handleTimeframeChange = (value: string) => {
    setIsLoading(true);
    setTimeframe(value);
    // In a real app, we would fetch new data based on the timeframe
    setTimeout(() => setIsLoading(false), 800);
  };

  if (isLoading) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center min-h-[400px]">
        <div className="space-y-4 text-center">
          <div className="inline-block p-3 rounded-full bg-gradient-to-tr from-indigo-500/20 to-purple-500/20">
            <div className="animate-spin h-10 w-10 rounded-full border-4 border-indigo-100 border-t-indigo-500"></div>
          </div>
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">Loading analytics data</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Please wait while we process your request</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header with title and timeframe selector */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Analytics Dashboard</h2>
          <p className="text-muted-foreground">Detailed insights and performance metrics for your business</p>
        </div>
        <div className="flex items-center gap-2">
          <Select 
            value={timeframe} 
            onValueChange={handleTimeframeChange}
          >
            <SelectTrigger className="w-[180px] bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Last 24 Hours</SelectItem>
              <SelectItem value="week">Last 7 Days</SelectItem>
              <SelectItem value="month">Last 30 Days</SelectItem>
              <SelectItem value="quarter">Last Quarter</SelectItem>
              <SelectItem value="year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            variant="outline" 
            size="icon"
            className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
          >
            <RefreshCw className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          </Button>
          <Button 
            variant="outline" 
            className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
          >
            <Download className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
            Export
          </Button>
        </div>
      </div>

      {/* Key metrics summary cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-none shadow-md overflow-hidden bg-white dark:bg-gray-800">
          <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-blue-500 to-blue-600"></div>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-sm text-gray-600 dark:text-gray-400 font-medium">Total Revenue</CardTitle>
              <div className="rounded-full bg-blue-100 dark:bg-blue-900/20 p-2 text-blue-600 dark:text-blue-400">
                <CreditCard className="h-4 w-4" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">${totalRevenue.toLocaleString()}</div>
            <div className="flex items-center mt-1">
              <Badge className="bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400 font-medium">
                <TrendingUp className="h-3 w-3 mr-1" />
                18.2%
              </Badge>
              <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">vs. last period</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md overflow-hidden bg-white dark:bg-gray-800">
          <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-purple-500 to-purple-600"></div>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-sm text-gray-600 dark:text-gray-400 font-medium">Total Orders</CardTitle>
              <div className="rounded-full bg-purple-100 dark:bg-purple-900/20 p-2 text-purple-600 dark:text-purple-400">
                <ShoppingBag className="h-4 w-4" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{totalOrders.toLocaleString()}</div>
            <div className="flex items-center mt-1">
              <Badge className="bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400 font-medium">
                <TrendingUp className="h-3 w-3 mr-1" />
                12.5%
              </Badge>
              <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">vs. last period</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md overflow-hidden bg-white dark:bg-gray-800">
          <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-green-500 to-green-600"></div>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-sm text-gray-600 dark:text-gray-400 font-medium">Total Profit</CardTitle>
              <div className="rounded-full bg-green-100 dark:bg-green-900/20 p-2 text-green-600 dark:text-green-400">
                <TrendingUp className="h-4 w-4" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">${totalProfit.toLocaleString()}</div>
            <div className="flex items-center mt-1">
              <Badge className="bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400 font-medium">
                <TrendingUp className="h-3 w-3 mr-1" />
                15.8%
              </Badge>
              <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">vs. last period</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md overflow-hidden bg-white dark:bg-gray-800">
          <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-amber-500 to-amber-600"></div>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-sm text-gray-600 dark:text-gray-400 font-medium">Avg. Order Value</CardTitle>
              <div className="rounded-full bg-amber-100 dark:bg-amber-900/20 p-2 text-amber-600 dark:text-amber-400">
                <CreditCard className="h-4 w-4" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">${averageOrderValue.toFixed(2)}</div>
            <div className="flex items-center mt-1">
              <Badge className="bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400 font-medium">
                <TrendingUp className="h-3 w-3 mr-1" />
                5.3%
              </Badge>
              <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">vs. last period</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabbed content for different analytics views */}
      <Tabs defaultValue="revenue" className="space-y-6">
        <TabsList className="w-full flex justify-between sm:w-auto bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
          <TabsTrigger 
            value="revenue" 
            className="flex-1 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-indigo-600 dark:data-[state=active]:text-indigo-400 rounded-md"
          >
            <LineChartIcon className="h-4 w-4 mr-2" />
            Revenue
          </TabsTrigger>
          <TabsTrigger 
            value="products" 
            className="flex-1 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-indigo-600 dark:data-[state=active]:text-indigo-400 rounded-md"
          >
            <BarChart className="h-4 w-4 mr-2" />
            Products
          </TabsTrigger>
          <TabsTrigger 
            value="regions" 
            className="flex-1 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-indigo-600 dark:data-[state=active]:text-indigo-400 rounded-md"
          >
            <PieChart className="h-4 w-4 mr-2" />
            Regions
          </TabsTrigger>
        </TabsList>

        {/* Revenue Tab */}
        <TabsContent value="revenue" className="space-y-6">
          <Card className="border-none shadow-md overflow-hidden bg-white dark:bg-gray-800">
            <CardHeader className="border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-gray-800 dark:text-gray-200">Revenue Trends</CardTitle>
                  <CardDescription className="text-gray-500 dark:text-gray-400">
                    Monthly revenue, orders, and profit overview
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline" className="border-blue-200 text-blue-700 dark:border-blue-800 dark:text-blue-400 flex items-center">
                    <div className="h-2 w-2 rounded-full bg-blue-500 mr-1"></div>
                    Revenue
                  </Badge>
                  <Badge variant="outline" className="border-purple-200 text-purple-700 dark:border-purple-800 dark:text-purple-400 flex items-center">
                    <div className="h-2 w-2 rounded-full bg-purple-500 mr-1"></div>
                    Orders
                  </Badge>
                  <Badge variant="outline" className="border-green-200 text-green-700 dark:border-green-800 dark:text-green-400 flex items-center">
                    <div className="h-2 w-2 rounded-full bg-green-500 mr-1"></div>
                    Profit
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="h-[350px]">
                <LineChart 
                  data={revenueData} 
                  index="date" 
                  categories={["revenue", "orders", "profit"]} 
                  title="Revenue & Orders"
                />
              </div>
            </CardContent>
            <CardFooter className="border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 py-3">
              <Button variant="ghost" className="text-indigo-600 dark:text-indigo-400 ml-auto">
                View Detailed Report
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Products Tab */}
        <TabsContent value="products" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="border-none shadow-md overflow-hidden bg-white dark:bg-gray-800">
              <CardHeader className="border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-gray-800 dark:text-gray-200">Product Categories</CardTitle>
                    <CardDescription className="text-gray-500 dark:text-gray-400">
                      Sales distribution by product type
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="h-[280px]">
                  <DonutChart 
                    data={productPerformance} 
                    index="name" 
                    categories={["sales"]}
                    valueFormatter={(value) => `${value}%`}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md overflow-hidden bg-white dark:bg-gray-800">
              <CardHeader className="border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-gray-800 dark:text-gray-200">Top Selling Products</CardTitle>
                    <CardDescription className="text-gray-500 dark:text-gray-400">
                      Products with the highest sales volume
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-gray-100 dark:divide-gray-700">
                  {topSellingProducts.map((product, index) => (
                    <div key={product.id} className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-750">
                      <div className="flex items-center gap-3">
                        <div className={`rounded-md p-2 ${product.color}`}>
                          {product.icon}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-800 dark:text-gray-200">{product.name}</h4>
                          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                            <span>{product.type}</span>
                            <span className="mx-2">•</span>
                            <span>{product.location}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-gray-800 dark:text-gray-200">{product.sales} sales</div>
                        <div className="flex items-center text-xs mt-1 justify-end">
                          <span className={`${product.growth >= 0 ? 'text-green-500' : 'text-red-500'} flex items-center`}>
                            {product.growth >= 0 ? (
                              <TrendingUp className="h-3 w-3 mr-1" />
                            ) : (
                              <TrendingDown className="h-3 w-3 mr-1" />
                            )}
                            {Math.abs(product.growth)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 py-3">
                <Button variant="ghost" className="text-indigo-600 dark:text-indigo-400 ml-auto">
                  View All Products
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        {/* Regions Tab */}
        <TabsContent value="regions" className="space-y-6">
          <Card className="border-none shadow-md overflow-hidden bg-white dark:bg-gray-800">
            <CardHeader className="border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-gray-800 dark:text-gray-200">Sales by Region</CardTitle>
                  <CardDescription className="text-gray-500 dark:text-gray-400">
                    Geographic distribution of sales
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid lg:grid-cols-2 gap-8">
                <div className="h-[280px]">
                  <DonutChart 
                    data={salesByRegion} 
                    index="name" 
                    categories={["value"]}
                    valueFormatter={(value) => `${value}%`}
                  />
                </div>
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Region Breakdown</h3>
                  {salesByRegion.map((region, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-700 dark:text-gray-300 flex items-center">
                          <div className="h-3 w-3 rounded-full mr-2" style={{ backgroundColor: region.color }}></div>
                          {region.name}
                        </span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">{region.value}%</span>
                      </div>
                      <Progress value={region.value} className="h-2" />
                    </div>
                  ))}
                  <div className="pt-4">
                    <Button variant="outline" className="w-full mt-4 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-400">
                      View Detailed Regional Analysis
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
