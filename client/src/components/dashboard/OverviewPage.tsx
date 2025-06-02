import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LoadingSpinner, PageLoadingSpinner } from '../ui/loading-spinner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Hotel, CreditCard, Plane, Activity, Tag, TrendingUp, Package } from 'lucide-react';
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
    return <PageLoadingSpinner />;
  }
  
  // Display error state
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
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">{currentDate}</p>
        </div>
        <div className="flex items-center gap-2">
          <Card className="p-2">
            <p className="text-sm font-medium">Welcome back, {user?.name}!</p>
          </Card>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsData.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className={`text-xs ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'} flex items-center`}>
                {stat.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
                <CardDescription>Monthly revenue for the current year</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <AreaChart 
                  data={revenueData}
                  index="month"
                  categories={["revenue"]}
                />
              </CardContent>
            </Card>
            
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Product Distribution</CardTitle>
                <CardDescription>Breakdown by product type</CardDescription>
              </CardHeader>
              <CardContent>
                <BarChart 
                  data={productDistribution}
                  index="name"
                  categories={["value"]}
                  title="Product Distribution"
                />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recently Added Products</CardTitle>
              <CardDescription>Latest products added to the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentProducts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center gap-4">
                      <div className="rounded-full bg-primary/10 p-2">
                        {product.icon}
                      </div>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Tag className="mr-1 h-3 w-3" />
                          <span>{product.type}</span>
                          <span className="mx-2">•</span>
                          <span>{product.location}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{product.price}</p>
                      <p className="text-sm text-muted-foreground">{product.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sales Analytics</CardTitle>
              <CardDescription>Detailed analytics will appear here</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex h-[300px] items-center justify-center text-muted-foreground">
                Advanced analytics module (coming soon)
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reports</CardTitle>
              <CardDescription>Downloadable reports will appear here</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex h-[300px] items-center justify-center text-muted-foreground">
                Reports module (coming soon)
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
