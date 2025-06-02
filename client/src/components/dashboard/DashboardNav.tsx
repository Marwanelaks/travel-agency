import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
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
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useAuth } from '@/hooks/useAuth';

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  isExpanded?: boolean;
  children?: NavItem[];
}

export function DashboardNav() {
  const location = useLocation();
  const { user } = useAuth();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    'products': true
  });

  // Check if user is a sub-super admin
  const isSubSuperAdmin = user?.role === 'SubSuperAdmin';

  // Base navigation items for all users
  let baseNavItems: NavItem[] = [
    {
      title: 'Overview',
      href: '/dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      title: 'Analytics',
      href: '/dashboard/analytics',
      icon: <BarChart3 className="h-5 w-5" />,
    },
    {
      title: 'User Management',
      href: '/dashboard/users',
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: 'Products',
      href: '/dashboard/products',
      icon: <ShoppingBag className="h-5 w-5" />,
    },
    {
      title: 'Hotels',
      href: '/dashboard/hotels',
      icon: <Hotel className="h-5 w-5" />,
    },
    {
      title: 'Flights',
      href: '/dashboard/flights',
      icon: <Plane className="h-5 w-5" />,
    },
    {
      title: 'Orders',
      href: '/dashboard/orders',
      icon: <PackageIcon className="h-5 w-5" />,
    },
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
      icon: <LifeBuoy className="h-5 w-5" />,
    },
  ];
  
  // Sub-Super Admin specific navigation items
  const subSuperAdminItems: NavItem[] = [
    {
      title: 'Department Dashboard',
      href: '/dashboard/sub-admin',
      icon: <Building2 className="h-5 w-5" />,
    },
    {
      title: 'Manage Sellers',
      href: '/dashboard/manage-sellers',
      icon: <UserCog className="h-5 w-5" />,
    },
    {
      title: 'Department Settings',
      href: '/dashboard/department-settings',
      icon: <ShieldCheck className="h-5 w-5" />,
    },
  ];
  
  // Combine the navigation items based on user role
  const navItems: NavItem[] = isSubSuperAdmin
    ? [
        // If Sub-Super Admin, show their specific dashboard as first item
        {
          title: 'Department Dashboard',
          href: '/dashboard',
          icon: <Building2 className="h-5 w-5" />,
        },
        // Then insert sub-super admin specific items after orders
        ...baseNavItems.slice(1, 7), // Skip Overview, include up to Orders
        ...subSuperAdminItems.slice(1), // Skip Department Dashboard
        ...baseNavItems.slice(7) // Include the rest
      ]
    : baseNavItems;

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
      <div className="flex flex-col gap-2 h-full max-h-[calc(100vh-4rem)]">
        <div className="flex h-14 items-center border-b px-4">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <Globe className="h-6 w-6" />
            <span className="text-xl font-bold">Travel Agency</span>
          </Link>
        </div>
        <ScrollArea className="flex-1 py-2 overflow-auto">
          <nav className="grid gap-1 px-2 pb-16">
            {navItems.map((item, index) => (
              <React.Fragment key={index}>
                {item.children ? (
                  <div className="space-y-1">
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-start gap-2 font-normal",
                        isActive(item.href) && "bg-accent font-medium"
                      )}
                      onClick={() => toggleExpand(item.title.toLowerCase())}
                    >
                      {item.icon}
                      <span className="flex-1 truncate">{item.title}</span>
                      {expanded[item.title.toLowerCase()] ? (
                        <ChevronDown className="h-4 w-4 opacity-50" />
                      ) : (
                        <ChevronRight className="h-4 w-4 opacity-50" />
                      )}
                    </Button>
                    {expanded[item.title.toLowerCase()] && (
                      <div className="pl-6 space-y-1">
                        {item.children.map((child, childIndex) => (
                          <Tooltip key={childIndex}>
                            <TooltipTrigger asChild>
                              <Link to={child.href}>
                                <Button
                                  variant="ghost"
                                  className={cn(
                                    "w-full justify-start gap-2 font-normal",
                                    isActive(child.href) && "bg-accent font-medium"
                                  )}
                                >
                                  {child.icon}
                                  <span className="flex-1 truncate">{child.title}</span>
                                </Button>
                              </Link>
                            </TooltipTrigger>
                            <TooltipContent side="right">
                              {child.title}
                            </TooltipContent>
                          </Tooltip>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link to={item.href}>
                        <Button
                          variant="ghost"
                          className={cn(
                            "w-full justify-start gap-2 font-normal",
                            isActive(item.href) && "bg-accent font-medium"
                          )}
                        >
                          {item.icon}
                          <span className="flex-1 truncate">{item.title}</span>
                        </Button>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      {item.title}
                    </TooltipContent>
                  </Tooltip>
                )}
              </React.Fragment>
            ))}
          </nav>
        </ScrollArea>
      </div>
    </TooltipProvider>
  );
}
