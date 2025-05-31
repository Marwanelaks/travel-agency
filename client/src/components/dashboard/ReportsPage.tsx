import React, { useState, useEffect } from 'react';
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
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  BookOpenText, 
  Calendar, 
  Download, 
  Filter, 
  RefreshCw, 
  Search, 
  FileText, 
  BarChart, 
  PieChart, 
  TrendingUp, 
  Users, 
  Briefcase,
  ShoppingBag,
  Hotel,
  Plane,
  FileSpreadsheet,
  Mail,
  Printer,
  Share2,
  Eye,
  Clock
} from 'lucide-react';
import { BarChart as BarChartComponent, LineChart, AreaChart, DonutChart } from '@/components/ui/charts';

// Sample report types for demonstration
const reportTypes = [
  { id: 'sales', name: 'Sales Reports', icon: <TrendingUp className="h-5 w-5" /> },
  { id: 'products', name: 'Product Performance', icon: <ShoppingBag className="h-5 w-5" /> },
  { id: 'hotels', name: 'Hotel Bookings', icon: <Hotel className="h-5 w-5" /> },
  { id: 'flights', name: 'Flight Reservations', icon: <Plane className="h-5 w-5" /> },
  { id: 'customers', name: 'Customer Analytics', icon: <Users className="h-5 w-5" /> },
  { id: 'financial', name: 'Financial Reports', icon: <FileSpreadsheet className="h-5 w-5" /> }
];

// Sample report data
const recentReports = [
  { 
    id: 1, 
    title: 'Monthly Sales Summary', 
    type: 'Sales', 
    created: '2025-05-20T14:30:00Z',
    lastViewed: '2025-05-30T09:15:00Z',
    status: 'Completed',
    format: 'PDF'
  },
  { 
    id: 2, 
    title: 'Hotel Booking Analysis Q2', 
    type: 'Hotels', 
    created: '2025-05-18T11:20:00Z',
    lastViewed: '2025-05-29T16:45:00Z',
    status: 'Completed',
    format: 'Excel'
  },
  { 
    id: 3, 
    title: 'Top Performing Flight Routes', 
    type: 'Flights', 
    created: '2025-05-15T09:00:00Z',
    lastViewed: '2025-05-28T14:30:00Z',
    status: 'Completed',
    format: 'PDF'
  },
  { 
    id: 4, 
    title: 'Customer Satisfaction Survey', 
    type: 'Customers', 
    created: '2025-05-10T16:45:00Z',
    lastViewed: '2025-05-25T10:20:00Z',
    status: 'Completed',
    format: 'PDF'
  },
  { 
    id: 5, 
    title: 'Revenue Forecast 2025-Q3', 
    type: 'Financial', 
    created: '2025-05-05T13:15:00Z',
    lastViewed: '2025-05-22T15:10:00Z',
    status: 'Completed',
    format: 'Excel'
  }
];

// Sample scheduled reports
const scheduledReports = [
  { 
    id: 101, 
    title: 'Weekly Sales Report', 
    type: 'Sales', 
    schedule: 'Every Monday at 9:00 AM',
    nextRun: '2025-06-03T09:00:00Z',
    recipients: 5,
    format: 'PDF'
  },
  { 
    id: 102, 
    title: 'Monthly Financial Statement', 
    type: 'Financial', 
    schedule: 'First day of month at 8:00 AM',
    nextRun: '2025-06-01T08:00:00Z',
    recipients: 3,
    format: 'Excel'
  },
  { 
    id: 103, 
    title: 'Bi-weekly Inventory Status', 
    type: 'Products', 
    schedule: 'Every other Friday at 4:00 PM',
    nextRun: '2025-06-07T16:00:00Z',
    recipients: 4,
    format: 'PDF'
  }
];

// Monthly data for sample charts
const monthlySalesData = [
  { month: 'Jan', sales: 4200 },
  { month: 'Feb', sales: 3800 },
  { month: 'Mar', sales: 5100 },
  { month: 'Apr', sales: 4700 },
  { month: 'May', sales: 5600 },
  { month: 'Jun', sales: 6800 },
  { month: 'Jul', sales: 7400 },
  { month: 'Aug', sales: 8200 },
  { month: 'Sep', sales: 7500 },
  { month: 'Oct', sales: 6900 },
  { month: 'Nov', sales: 7800 },
  { month: 'Dec', sales: 9200 }
];

// Data for product distribution chart
const productDistributionData = [
  { name: 'Hotel Bookings', value: 42 },
  { name: 'Flight Tickets', value: 28 },
  { name: 'Tour Packages', value: 18 },
  { name: 'Activities', value: 12 }
];

export function ReportsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('browse');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReportType, setSelectedReportType] = useState('all');
  
  // Simulate API fetch on component mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Calculate time difference for display
  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return `${diffInSeconds} seconds ago`;
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    }
    
    const diffInMonths = Math.floor(diffInDays / 30);
    return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
  };

  // Filter reports based on search query and selected type
  const filteredReports = recentReports.filter(report => {
    const matchesSearch = searchQuery === '' || 
      report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.type.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = selectedReportType === 'all' || 
      report.type.toLowerCase() === selectedReportType.toLowerCase();
    
    return matchesSearch && matchesType;
  });

  if (isLoading) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center min-h-[400px]">
        <div className="space-y-4 text-center">
          <div className="inline-block p-3 rounded-full bg-gradient-to-tr from-indigo-500/20 to-purple-500/20">
            <div className="animate-spin h-10 w-10 rounded-full border-4 border-indigo-100 border-t-indigo-500"></div>
          </div>
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">Loading reports</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Please wait while we process your request</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header with title and actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Reports</h2>
          <p className="text-muted-foreground">Access, generate, and schedule reports for your business</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white">
            <FileText className="h-4 w-4 mr-2" />
            New Report
          </Button>
        </div>
      </div>

      {/* Tabs for different report views */}
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-muted grid w-full grid-cols-3 h-11">
          <TabsTrigger value="browse">Browse Reports</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled Reports</TabsTrigger>
          <TabsTrigger value="templates">Report Templates</TabsTrigger>
        </TabsList>

        {/* Browse Reports Tab */}
        <TabsContent value="browse" className="space-y-6">
          {/* Search and filter bar */}
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <Input 
                placeholder="Search reports..." 
                className="pl-10" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select 
              value={selectedReportType} 
              onValueChange={setSelectedReportType}
            >
              <SelectTrigger className="w-[180px] bg-white dark:bg-gray-800">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Reports</SelectItem>
                <SelectItem value="sales">Sales</SelectItem>
                <SelectItem value="hotels">Hotels</SelectItem>
                <SelectItem value="flights">Flights</SelectItem>
                <SelectItem value="customers">Customers</SelectItem>
                <SelectItem value="financial">Financial</SelectItem>
                <SelectItem value="products">Products</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="gap-1">
              <Filter className="h-4 w-4" />
              More Filters
            </Button>
          </div>

          {/* Recent reports */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Reports</CardTitle>
              <CardDescription>Browse and access your recently generated reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/50 border-b">
                      <th className="h-12 px-4 text-left font-medium">Report Name</th>
                      <th className="h-12 px-4 text-left font-medium">Type</th>
                      <th className="h-12 px-4 text-left font-medium hidden md:table-cell">Created</th>
                      <th className="h-12 px-4 text-left font-medium hidden lg:table-cell">Last Viewed</th>
                      <th className="h-12 px-4 text-left font-medium">Format</th>
                      <th className="h-12 px-4 text-right font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredReports.map((report) => (
                      <tr key={report.id} className="border-b hover:bg-muted/50">
                        <td className="p-4 align-middle font-medium">{report.title}</td>
                        <td className="p-4 align-middle">
                          <Badge variant="outline" className="capitalize">
                            {report.type}
                          </Badge>
                        </td>
                        <td className="p-4 align-middle hidden md:table-cell text-muted-foreground">
                          {getTimeAgo(report.created)}
                        </td>
                        <td className="p-4 align-middle hidden lg:table-cell text-muted-foreground">
                          {getTimeAgo(report.lastViewed)}
                        </td>
                        <td className="p-4 align-middle">
                          <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                            report.format === 'PDF' 
                              ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' 
                              : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          }`}>
                            {report.format}
                          </span>
                        </td>
                        <td className="p-4 align-middle text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Share2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredReports.length === 0 && (
                      <tr>
                        <td colSpan={6} className="h-24 text-center text-muted-foreground">
                          No reports found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {filteredReports.length} of {recentReports.length} reports
              </div>
              <Button variant="outline" size="sm">
                View All Reports
              </Button>
            </CardFooter>
          </Card>

          {/* Analytics Overview */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Sales Performance (Monthly)</CardTitle>
                <CardDescription>Monthly sales performance for the current year</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <BarChartComponent 
                    data={monthlySalesData}
                    index="month"
                    categories={["sales"]}
                  />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Product Distribution</CardTitle>
                <CardDescription>Breakdown of sales by product category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <DonutChart 
                    data={productDistributionData}
                    index="name"
                    category="value"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Scheduled Reports Tab */}
        <TabsContent value="scheduled" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Reports</CardTitle>
              <CardDescription>Manage your automated report generation and delivery</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/50 border-b">
                      <th className="h-12 px-4 text-left font-medium">Report Name</th>
                      <th className="h-12 px-4 text-left font-medium">Type</th>
                      <th className="h-12 px-4 text-left font-medium hidden md:table-cell">Schedule</th>
                      <th className="h-12 px-4 text-left font-medium hidden lg:table-cell">Next Run</th>
                      <th className="h-12 px-4 text-left font-medium">Recipients</th>
                      <th className="h-12 px-4 text-right font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scheduledReports.map((report) => (
                      <tr key={report.id} className="border-b hover:bg-muted/50">
                        <td className="p-4 align-middle font-medium">{report.title}</td>
                        <td className="p-4 align-middle">
                          <Badge variant="outline" className="capitalize">
                            {report.type}
                          </Badge>
                        </td>
                        <td className="p-4 align-middle hidden md:table-cell text-muted-foreground">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2 text-indigo-500" />
                            {report.schedule}
                          </div>
                        </td>
                        <td className="p-4 align-middle hidden lg:table-cell text-muted-foreground">
                          {formatDate(report.nextRun)}
                        </td>
                        <td className="p-4 align-middle">
                          <Badge>{report.recipients}</Badge>
                        </td>
                        <td className="p-4 align-middle text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Mail className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500">
                              <div className="sr-only">Delete</div>
                              ×
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule New Report
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Report Templates Tab */}
        <TabsContent value="templates" className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {reportTypes.map((type) => (
              <Card key={type.id} className="overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400">
                      {type.icon}
                    </div>
                    <CardTitle>{type.name}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <p className="text-sm text-muted-foreground mb-4">
                    Generate detailed {type.name.toLowerCase()} with customizable parameters and export options.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">Daily</Badge>
                    <Badge variant="secondary">Weekly</Badge>
                    <Badge variant="secondary">Monthly</Badge>
                    <Badge variant="secondary">Custom</Badge>
                  </div>
                </CardContent>
                <CardFooter className="bg-muted/20 border-t px-6 py-4">
                  <Button className="w-full">
                    Generate Report
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
