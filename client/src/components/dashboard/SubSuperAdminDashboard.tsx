import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Building2,
  UserCog,
  ShieldCheck,
  TrendingUp,
  Users,
  Package,
  CreditCard,
  Clock,
  Bell
} from 'lucide-react';

interface Seller {
  id: number;
  name: string;
  status: 'active' | 'pending' | 'inactive';
  revenue: number;
  orders: number;
  products: number;
  lastActive: string;
}

// Mock data for managed sellers
const mockSellers: Seller[] = [
  {
    id: 1,
    name: "Luxury Travel Co.",
    status: "active",
    revenue: 127350.45,
    orders: 134,
    products: 23,
    lastActive: "2025-05-30T10:15:00Z"
  },
  {
    id: 2,
    name: "Adventure Tours Inc.",
    status: "active",
    revenue: 98234.78,
    orders: 112,
    products: 18,
    lastActive: "2025-05-30T08:45:00Z"
  },
  {
    id: 3,
    name: "Budget Trips LLC",
    status: "pending",
    revenue: 45678.90,
    orders: 67,
    products: 12,
    lastActive: "2025-05-29T14:30:00Z"
  },
  {
    id: 4,
    name: "Executive Travels",
    status: "inactive",
    revenue: 12450.00,
    orders: 15,
    products: 8,
    lastActive: "2025-05-25T11:20:00Z"
  }
];

export function SubSuperAdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Header with title */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Department Dashboard</h2>
        <p className="text-muted-foreground">Monitor and manage your department's sellers and operations</p>
      </div>

      {/* Department statistics cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-none shadow-md overflow-hidden bg-white dark:bg-gray-800">
          <div className="absolute top-0 left-0 h-1 w-full bg-indigo-500"></div>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-sm text-gray-600 dark:text-gray-400 font-medium">Total Sellers</CardTitle>
              <div className="rounded-full bg-indigo-100 dark:bg-indigo-900/20 p-2 text-indigo-600 dark:text-indigo-400">
                <Building2 className="h-4 w-4" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{mockSellers.length}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {mockSellers.filter(s => s.status === 'active').length} active
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md overflow-hidden bg-white dark:bg-gray-800">
          <div className="absolute top-0 left-0 h-1 w-full bg-green-500"></div>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-sm text-gray-600 dark:text-gray-400 font-medium">Department Revenue</CardTitle>
              <div className="rounded-full bg-green-100 dark:bg-green-900/20 p-2 text-green-600 dark:text-green-400">
                <TrendingUp className="h-4 w-4" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              ${mockSellers.reduce((sum, seller) => sum + seller.revenue, 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
            <div className="text-xs text-green-500 dark:text-green-400 flex items-center">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="h-3 w-3 mr-1"
              >
                <path d="m18 15-6-6-6 6"/>
              </svg>
              12.5% from last month
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md overflow-hidden bg-white dark:bg-gray-800">
          <div className="absolute top-0 left-0 h-1 w-full bg-amber-500"></div>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-sm text-gray-600 dark:text-gray-400 font-medium">Total Orders</CardTitle>
              <div className="rounded-full bg-amber-100 dark:bg-amber-900/20 p-2 text-amber-600 dark:text-amber-400">
                <Package className="h-4 w-4" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {mockSellers.reduce((sum, seller) => sum + seller.orders, 0)}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              85 this week
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md overflow-hidden bg-white dark:bg-gray-800">
          <div className="absolute top-0 left-0 h-1 w-full bg-blue-500"></div>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-sm text-gray-600 dark:text-gray-400 font-medium">Pending Actions</CardTitle>
              <div className="rounded-full bg-blue-100 dark:bg-blue-900/20 p-2 text-blue-600 dark:text-blue-400">
                <Bell className="h-4 w-4" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">8</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              3 high priority
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Managed sellers section */}
      <Card className="border-none shadow-md overflow-hidden bg-white dark:bg-gray-800">
        <CardHeader className="border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-gray-800 dark:text-gray-200">Managed Sellers</CardTitle>
              <CardDescription className="text-gray-500 dark:text-gray-400">
                Overview of all sellers in your department
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-700">
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Seller</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Revenue</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Orders</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Products</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Last Active</th>
                </tr>
              </thead>
              <tbody>
                {mockSellers.map((seller) => (
                  <tr 
                    key={seller.id} 
                    className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-md bg-indigo-100 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                          <Building2 className="h-6 w-6" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-800 dark:text-gray-200">{seller.name}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            ID: {seller.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {seller.status === 'active' ? (
                        <Badge className="bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                          Active
                        </Badge>
                      ) : seller.status === 'pending' ? (
                        <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">
                          Pending
                        </Badge>
                      ) : (
                        <Badge className="bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400">
                          Inactive
                        </Badge>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900 dark:text-gray-100">
                        ${seller.revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-gray-700 dark:text-gray-300">
                        {seller.orders}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-gray-700 dark:text-gray-300">
                        {seller.products}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center text-gray-500 dark:text-gray-400">
                        <Clock className="h-3 w-3 mr-1" />
                        {new Date(seller.lastActive).toLocaleString()}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
        <CardFooter className="border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 py-3">
          <div className="flex items-center justify-between w-full">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Showing {mockSellers.length} sellers
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
