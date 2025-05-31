import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LoadingSpinner, PageLoadingSpinner } from '../ui/loading-spinner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
// import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
  Users, Hotel, CreditCard, Plane, Activity, Tag, TrendingUp, Package, 
  ArrowUpRight, Clock, MapPin, Calendar, ArrowRight, BarChart2, PieChart,
  FileText, ChevronRight, CheckCircle2, AlertCircle, Info
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { LineChart, BarChart, AreaChart, MetricCard } from '../../components/ui/charts';

export function OverviewPage() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState(null);
  
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  // Fetch dashboard data from API
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Try to fetch from API
        try {
          const response = await axios.get('http://localhost:8000/api/dashboard');
          setDashboardData(response.data);
        } catch (apiError) {
          console.warn('API fetch failed, using mock data', apiError);
          // If API fails, we'll use the mock data defined below
        }
      } catch (err) {
        setError('Failed to load dashboard data. Please try again.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  // Display loading state
  if (isLoading) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center min-h-[400px]">
        <div className="space-y-4 text-center">
          <div className="inline-block p-3 rounded-full bg-gradient-to-tr from-indigo-500/20 to-purple-500/20">
            <div className="animate-spin h-10 w-10 rounded-full border-4 border-indigo-100 border-t-indigo-500"></div>
          </div>
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">Loading dashboard data</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Please wait while we fetch the latest information</p>
        </div>
      </div>
    );
  }
  
  // Display error state
  if (error) {
    return (
      <Card className="border-none shadow-md overflow-hidden bg-white dark:bg-gray-800">
        <div className="p-8 flex flex-col items-center justify-center space-y-4 text-center">
          <div className="inline-block p-4 rounded-full bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400">
            <AlertCircle className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Dashboard Data Unavailable</h3>
          <p className="text-gray-600 dark:text-gray-400 max-w-md">{error}</p>
          <Button 
            onClick={() => window.location.reload()} 
            className="mt-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
          >
            Retry
          </Button>
        </div>
      </Card>
    );
  }

  // Dashboard stats data
  const statsData = [
    {
      title: 'Total Users',
      value: '3,842',
      change: '+12.5%',
      trend: 'up',
      icon: <Users className="h-8 w-8 text-primary" />,
    },
    {
      title: 'Active Bookings',
      value: '624',
      change: '+4.3%',
      trend: 'up',
      icon: <CreditCard className="h-8 w-8 text-primary" />,
    },
    {
      title: 'Hotel Products',
      value: '156',
      change: '+8.7%',
      trend: 'up',
      icon: <Hotel className="h-8 w-8 text-primary" />,
    },
    {
      title: 'Total Revenue',
      value: '$128,429',
      change: '+18.2%',
      trend: 'up',
      icon: <TrendingUp className="h-8 w-8 text-primary" />,
    },
  ];

  // Product distribution data
  const productDistribution = [
    { name: 'Hotels', value: 156, color: 'hsl(210, 70%, 50%)' },
    { name: 'Flights', value: 87, color: 'hsl(0, 70%, 50%)' },
    { name: 'Sports', value: 42, color: 'hsl(120, 70%, 50%)' },
    { name: 'Entertainment', value: 68, color: 'hsl(45, 70%, 50%)' },
    { name: 'Packages', value: 35, color: 'hsl(280, 70%, 50%)' },
  ];

  // Monthly revenue data
  const revenueData = [
    { month: 'Jan', revenue: 15000 },
    { month: 'Feb', revenue: 18000 },
    { month: 'Mar', revenue: 22000 },
    { month: 'Apr', revenue: 19000 },
    { month: 'May', revenue: 25000 },
    { month: 'Jun', revenue: 32000 },
    { month: 'Jul', revenue: 38000 },
    { month: 'Aug', revenue: 42000 },
    { month: 'Sep', revenue: 36000 },
    { month: 'Oct', revenue: 29000 },
    { month: 'Nov', revenue: 33000 },
    { month: 'Dec', revenue: 45000 },
  ];

  // Recent products added
  const recentProducts = [
    {
      id: 1,
      name: 'Luxury Beach Resort',
      type: 'hotel',
      location: 'Maldives',
      price: '$299.99',
      date: '2 days ago',
      icon: <Hotel className="h-4 w-4" />,
    },
    {
      id: 2,
      name: 'Business Class Flight to Paris',
      type: 'flight',
      location: 'Dubai to Paris',
      price: '$1,299.99',
      date: '3 days ago',
      icon: <Plane className="h-4 w-4" />,
    },
    {
      id: 3,
      name: 'Champions League Final',
      type: 'sport',
      location: 'London',
      price: '$399.99',
      date: '5 days ago',
      icon: <Activity className="h-4 w-4" />,
    },
    {
      id: 4,
      name: 'Weekend Getaway Package',
      type: 'package',
      location: 'Rome',
      price: '$599.99',
      date: '1 week ago',
      icon: <Package className="h-4 w-4" />,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header with welcome message and date */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 p-6 md:p-8">
        <div className="absolute top-0 right-0 h-full w-1/2 bg-white/10 transform -skew-x-12"></div>
        <div className="absolute bottom-0 left-0 opacity-20">
          <svg xmlns="http://www.w3.org/2000/svg" width="300" height="120" viewBox="0 0 1000 1000" fill="none">
            <path d="M0,800 C150,700 350,650 500,800 C650,950 850,900 1000,800 L1000,1000 L0,1000 Z" fill="rgba(255,255,255,0.2)"></path>
          </svg>
        </div>
        <div className="relative z-10 md:max-w-2xl">
          <div className="mb-1 inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white">
            {currentDate}
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl">
            Welcome back, {user?.name?.split(' ')[0] || 'User'}!
          </h2>
          <p className="mt-2 max-w-lg text-indigo-100 md:text-lg">
            Here's what's happening with your travel business today.
          </p>
          <div className="mt-4 flex space-x-3">
            <Button 
              className="bg-white text-indigo-600 hover:bg-indigo-50" 
              onClick={() => window.location.href = '/dashboard/analytics'}
            >
              View Analytics
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              className="border-white text-white hover:bg-white/20"
              onClick={() => window.location.href = '/dashboard/reports'}
            >
              Download Reports
            </Button>
          </div>
        </div>
      </div>
      
      {/* Key metrics grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsData.map((stat, index) => (
          <Card key={index} className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="absolute top-0 right-0 h-1 w-full bg-gradient-to-r from-indigo-500 to-purple-600"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">{stat.title}</CardTitle>
              <div className="rounded-full bg-indigo-100 dark:bg-indigo-900/30 p-2 text-indigo-600 dark:text-indigo-400">
                {stat.icon}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-800 dark:text-white">{stat.value}</div>
              <div className="mt-2 flex items-center">
                <Badge 
                  variant={stat.trend === 'up' ? 'default' : 'destructive'}
                  className={`mr-2 ${stat.trend === 'up' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}
                >
                  {stat.change}
                </Badge>
                <p className="text-xs text-gray-500 dark:text-gray-400">from last month</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Dashboard tabs with enhanced content */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="w-full flex justify-between sm:w-auto bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
          <TabsTrigger 
            value="overview" 
            className="flex-1 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-indigo-600 dark:data-[state=active]:text-indigo-400 rounded-md"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger 
            value="analytics" 
            className="flex-1 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-indigo-600 dark:data-[state=active]:text-indigo-400 rounded-md"
          >
            <BarChart2 className="mr-2 h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger 
            value="reports" 
            className="flex-1 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-indigo-600 dark:data-[state=active]:text-indigo-400 rounded-md"
          >
            <FileText className="mr-2 h-4 w-4" />
            Reports
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Revenue & Distribution Charts with enhanced styling */}
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
            <Card className="border-none shadow-md overflow-hidden bg-white dark:bg-gray-800">
              <CardHeader className="border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-gray-800 dark:text-gray-200">Revenue Overview</CardTitle>
                    <CardDescription className="text-gray-500 dark:text-gray-400">Monthly revenue for the current year</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" className="text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800">
                    <PieChart className="mr-2 h-4 w-4" />
                    Details
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="h-[250px]">
                  <AreaChart 
                    data={revenueData}
                    index="month"
                    categories={["revenue"]}
                    title="Monthly Revenue"
                  />
                </div>
              </CardContent>
              <CardFooter className="border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 py-3">
                <div className="flex w-full justify-between text-sm">
                  <div className="flex items-center">
                    <span className="flex h-2 w-2 rounded-full bg-indigo-500 mr-2"></span>
                    <span className="text-gray-600 dark:text-gray-400">YTD Revenue</span>
                  </div>
                  <div className="font-medium text-gray-800 dark:text-gray-200">$354,429</div>
                </div>
              </CardFooter>
            </Card>
            
            <Card className="border-none shadow-md overflow-hidden bg-white dark:bg-gray-800">
              <CardHeader className="border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-gray-800 dark:text-gray-200">Product Distribution</CardTitle>
                    <CardDescription className="text-gray-500 dark:text-gray-400">Breakdown by product type</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="border-green-200 text-green-700 dark:border-green-800 dark:text-green-400">
                      <span className="flex h-2 w-2 rounded-full bg-green-500 mr-1"></span>
                      +12% Growth
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="h-[250px]">
                  <BarChart 
                    data={productDistribution}
                    index="name"
                    categories={["value"]}
                    title="Product Distribution"
                  />
                </div>
              </CardContent>
              <CardFooter className="border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 py-3">
                <div className="grid grid-cols-5 w-full gap-2 text-center text-xs">
                  {productDistribution.map((item, i) => (
                    <div key={i} className="flex flex-col">
                      <span className="font-medium text-gray-800 dark:text-gray-200">{item.value}</span>
                      <span className="text-gray-500 dark:text-gray-400">{item.name}</span>
                    </div>
                  ))}
                </div>
              </CardFooter>
            </Card>
          </div>

          {/* Recent Products with enhanced styling */}
          <Card className="border-none shadow-md overflow-hidden bg-white dark:bg-gray-800">
            <CardHeader className="border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-gray-800 dark:text-gray-200">Recently Added Products</CardTitle>
                  <CardDescription className="text-gray-500 dark:text-gray-400">Latest products added to the platform</CardDescription>
                </div>
                <Button variant="outline" size="sm" className="text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800">
                  View All
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {recentProducts.map((product) => (
                  <div 
                    key={product.id} 
                    className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors cursor-pointer"
                    onClick={() => window.location.href = `/dashboard/products/${product.id}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="rounded-full bg-indigo-100 dark:bg-indigo-900/30 p-3 text-indigo-600 dark:text-indigo-400">
                        {product.icon}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800 dark:text-gray-200">{product.name}</h4>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                          <div className="flex items-center mr-3">
                            <Tag className="mr-1 h-3 w-3 text-indigo-500" />
                            <span className="capitalize">{product.type}</span>
                          </div>
                          <div className="flex items-center">
                            <MapPin className="mr-1 h-3 w-3 text-indigo-500" />
                            <span>{product.location}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-gray-800 dark:text-gray-200">{product.price}</div>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1 justify-end">
                        <Clock className="mr-1 h-3 w-3" />
                        <span>{product.date}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 py-3">
              <div className="w-full flex justify-center">
                <Button variant="ghost" className="text-indigo-600 dark:text-indigo-400">
                  Load more products
                  <ArrowUpRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Analytics Tab Content */}
        <TabsContent value="analytics" className="space-y-6">
          <Card className="border-none shadow-md overflow-hidden bg-white dark:bg-gray-800">
            <CardHeader className="border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-gray-800 dark:text-gray-200">Sales Performance Analytics</CardTitle>
                  <CardDescription className="text-gray-500 dark:text-gray-400">Detailed breakdown of sales performance metrics</CardDescription>
                </div>
                <Badge className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400">
                  <Info className="mr-1 h-4 w-4" />
                  Premium
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-col items-center justify-center space-y-4 text-center py-12">
                <div className="inline-block p-4 rounded-full bg-indigo-100 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400">
                  <BarChart2 className="h-10 w-10" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Advanced Analytics Coming Soon</h3>
                <p className="text-gray-600 dark:text-gray-400 max-w-md">Our team is working on implementing advanced analytics features to provide deeper insights into your business performance.</p>
                <Button 
                  className="mt-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
                >
                  Get Notified When Available
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Reports Tab Content */}
        <TabsContent value="reports" className="space-y-6">
          <Card className="border-none shadow-md overflow-hidden bg-white dark:bg-gray-800">
            <CardHeader className="border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-gray-800 dark:text-gray-200">Business Reports</CardTitle>
                  <CardDescription className="text-gray-500 dark:text-gray-400">Access and download detailed reports</CardDescription>
                </div>
                <Badge className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400">
                  <Info className="mr-1 h-4 w-4" />
                  Premium
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-col items-center justify-center space-y-4 text-center py-12">
                <div className="inline-block p-4 rounded-full bg-indigo-100 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400">
                  <FileText className="h-10 w-10" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Report Generation Coming Soon</h3>
                <p className="text-gray-600 dark:text-gray-400 max-w-md">Our reporting module is currently under development. Soon you'll be able to generate and download customized reports.</p>
                <Button 
                  className="mt-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
                >
                  Get Early Access
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
