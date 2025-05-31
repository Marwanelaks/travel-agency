import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  Hotel,
  Plane,
  Settings,
  ChevronDown,
  ChevronRight,
  Globe,
  BarChart3,
  LifeBuoy,
  PackageIcon,
  UserCog,
  Building2,
  ShieldCheck,
  BookOpenText,
  CircleDollarSign,
  TrendingUp,
  Activity,
  MessageSquare,
  CalendarDays,
  HelpCircle,
  HeartPulse,
  CreditCard,
  LogOut
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useAuth } from '@/hooks/useAuth';

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  isExpanded?: boolean;
  badge?: string;
  badgeColor?: 'default' | 'secondary' | 'destructive' | 'outline';
  children?: NavItem[];
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

export function DashboardNav() {
  const location = useLocation();
  const { user } = useAuth();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    'dashboard': true,
    'catalog': true
  });

  // Check if user is a sub-super admin
  const isSubSuperAdmin = user?.role === 'SubSuperAdmin';

  // Define navigation items grouped by sections
  const mainNav: NavGroup[] = [
    {
      title: 'Dashboard',
      items: [
        {
          title: 'Overview',
          href: '/dashboard',
          icon: <LayoutDashboard className="h-5 w-5" />,
        },
        {
          title: 'Analytics',
          href: '/dashboard/analytics',
          icon: <BarChart3 className="h-5 w-5" />,
          badge: 'New',
          badgeColor: 'default'
        },
        {
          title: 'Reports',
          href: '/dashboard/reports',
          icon: <BookOpenText className="h-5 w-5" />,
        },
        {
          title: 'Calendar',
          href: '/dashboard/calendar',
          icon: <CalendarDays className="h-5 w-5" />,
        },
      ]
    },
    {
      title: 'Catalog',
      items: [
        {
          title: 'Products',
          href: '/dashboard/products-enhanced',
          icon: <ShoppingBag className="h-5 w-5" />,
          badge: '156',
          badgeColor: 'default'
        },
        {
          title: 'Hotels',
          href: '/dashboard/hotels-enhanced',
          icon: <Hotel className="h-5 w-5" />,
          badge: '48',
          badgeColor: 'default'
        },
        {
          title: 'Flights',
          href: '/dashboard/flights-enhanced',
          icon: <Plane className="h-5 w-5" />,
        },
      ]
    },
    {
      title: 'Sales',
      items: [
        {
          title: 'Orders',
          href: '/dashboard/orders',
          icon: <PackageIcon className="h-5 w-5" />,
          badge: '12',
          badgeColor: 'default'
        },
        {
          title: 'Transactions',
          href: '/dashboard/transactions',
          icon: <CreditCard className="h-5 w-5" />,
        },
        {
          title: 'Revenue',
          href: '/dashboard/revenue',
          icon: <CircleDollarSign className="h-5 w-5" />,
        },
      ]
    },
    {
      title: 'Users',
      items: [
        {
          title: 'User Management',
          href: '/dashboard/users',
          icon: <Users className="h-5 w-5" />,
        },
        {
          title: 'Customers',
          href: '/dashboard/customers',
          icon: <HeartPulse className="h-5 w-5" />,
        },
        {
          title: 'Messages',
          href: '/dashboard/messages',
          icon: <MessageSquare className="h-5 w-5" />,
          badge: '5',
          badgeColor: 'destructive'
        },
      ]
    },
    {
      title: 'System',
      items: [
        {
          title: 'API Backend',
          href: '/dashboard/api-docs',
          icon: <Globe className="h-5 w-5" />,
        },
        {
          title: 'Settings',
          href: '/dashboard/settings',
          icon: <Settings className="h-5 w-5" />,
        },
        {
          title: 'Help & Support',
          href: '/dashboard/support',
          icon: <HelpCircle className="h-5 w-5" />,
        },
      ]
    }
  ];
  
  // Sub-Super Admin specific navigation items
  const subSuperAdminNav: NavGroup[] = [
    {
      title: 'Administration',
      items: [
        {
          title: 'Department Dashboard',
          href: '/dashboard',
          icon: <Building2 className="h-5 w-5" />,
        },
        {
          title: 'Manage Sellers',
          href: '/dashboard/manage-sellers',
          icon: <UserCog className="h-5 w-5" />,
          badge: '8',
          badgeColor: 'default'
        },
        {
          title: 'Department Settings',
          href: '/dashboard/department-settings',
          icon: <ShieldCheck className="h-5 w-5" />,
        },
      ]
    }
  ];

  // Combine the navigation groups based on user role
  const navGroups = isSubSuperAdmin 
    ? [...subSuperAdminNav, ...mainNav.filter(group => group.title !== 'Dashboard')]
    : mainNav;

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return location.pathname === href;
    }
    return location.pathname.startsWith(href);
  };

  const toggleExpand = (key: string) => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex flex-col h-full max-h-[calc(100vh-4rem)]">
        {/* Logo and brand */}
        <div className="flex h-16 items-center justify-center border-b border-indigo-100 dark:border-gray-700 px-4 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 dark:from-indigo-900/20 dark:to-purple-900/20">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md">
              <Globe className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 text-transparent bg-clip-text">Travel Agency</span>
          </Link>
        </div>

        {/* User info */}
        <div className="px-4 py-3 border-b border-indigo-100 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate text-gray-800 dark:text-gray-200">{user?.name || 'User'}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.role || 'User'}</p>
            </div>
          </div>
        </div>

        {/* Navigation section */}
        <ScrollArea className="flex-1 py-4 overflow-auto">
          <nav className="px-3 pb-16 space-y-6">
            {navGroups.map((group, groupIndex) => (
              <div key={groupIndex} className="space-y-2">
                {/* Group title */}
                <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 px-3 uppercase tracking-wider">
                  {group.title}
                </h3>
                
                {/* Group items */}
                <div className="space-y-1">
                  {group.items.map((item, index) => (
                    <Tooltip key={index}>
                      <TooltipTrigger asChild>
                        <Link to={item.href}>
                          <Button
                            variant="ghost"
                            className={cn(
                              "w-full justify-start h-10 px-3 rounded-lg text-gray-700 dark:text-gray-300",
                              isActive(item.href) && "bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 text-indigo-700 dark:text-indigo-300 font-medium",
                              !isActive(item.href) && "hover:bg-gray-100 dark:hover:bg-gray-800"
                            )}
                          >
                            <div className={cn(
                              "mr-3 h-8 w-8 rounded-md flex items-center justify-center",
                              isActive(item.href) ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                            )}>
                              {item.icon}
                            </div>
                            <span className="flex-1 truncate">{item.title}</span>
                            {item.badge && (
                              <Badge variant={item.badgeColor || 'default'} className={cn(
                                "flex items-center justify-center min-w-[1.5rem] h-5 text-xs font-medium ml-auto rounded-full px-2",
                                item.badgeColor === 'outline' && "bg-indigo-100/60 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
                                item.badgeColor === 'default' && "bg-indigo-100/60 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
                                item.badgeColor === 'destructive' && "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                              )}>
                                {item.badge}
                              </Badge>
                            )}
                          </Button>
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="font-medium">
                        {item.title}
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </ScrollArea>

        {/* Logout button */}
        <div className="p-3 mt-auto border-t border-indigo-100 dark:border-gray-700">
          <Button 
            variant="ghost" 
            className="w-full justify-start h-10 px-3 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
            onClick={() => user?.logout && user.logout()}
          >
            <div className="mr-3 h-8 w-8 rounded-md bg-red-100 dark:bg-red-900/20 flex items-center justify-center text-red-600 dark:text-red-400">
              <LogOut className="h-5 w-5" />
            </div>
            <span className="flex-1">Log out</span>
          </Button>
        </div>
      </div>
    </TooltipProvider>
  );
}
