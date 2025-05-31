import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { ModeToggle } from '../ui/mode-toggle';
import { Input } from '../../components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import { Bell, Settings, LogOut, User, Search, HelpCircle, Calendar, MessageSquare, Sun } from 'lucide-react';
import { Badge } from '../../components/ui/badge';

export function DashboardHeader() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };
  
  const notificationCount = 3; // This would come from an API in a real app
  const messageCount = 2; // This would come from an API in a real app

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality here - would connect to API
    console.log('Searching for:', searchQuery);
  };

  return (
    <div className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
      <div className="flex h-14 items-center justify-between px-4">
        {/* Left side - Date */}
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-gray-800"
          >
            <Calendar className="h-4 w-4 mr-2" />
            <span className="text-sm font-medium">May 30</span>
          </Button>
        </div>
        
        {/* Right side controls */}
        <div className="flex items-center gap-2">
          {/* Light/Dark mode toggle */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
          >
            <Sun className="h-5 w-5" />
          </Button>
          
          {/* Messages Button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
            onClick={() => navigate('/dashboard/messages')}
          >
            <MessageSquare className="h-5 w-5" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-green-500 text-white text-xs rounded-full">
              {messageCount}
            </Badge>
          </Button>
          
          {/* Notifications Button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
            onClick={() => navigate('/dashboard/notifications')}
          >
            <Bell className="h-5 w-5" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-red-500 text-white text-xs rounded-full">
              {notificationCount}
            </Badge>
          </Button>
          
          {/* Help Button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
            onClick={() => navigate('/dashboard/help')}
          >
            <HelpCircle className="h-5 w-5" />
          </Button>
          
          {/* User Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 rounded-full p-0 overflow-hidden bg-indigo-600 text-white font-medium">
                <span>SA</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white">
                  <span className="text-base font-medium">SA</span>
                </div>
                <div className="flex flex-col">
                  <p className="text-sm font-medium leading-none">Super Admin</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">superadmin@example.com</p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer flex items-center" onClick={() => navigate('/dashboard/profile')}>
                <User className="mr-2 h-4 w-4 text-indigo-500" />
                <span>My Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer flex items-center" onClick={() => navigate('/dashboard/settings')}>
                <Settings className="mr-2 h-4 w-4 text-indigo-500" />
                <span>Account Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer flex items-center text-red-500" onClick={() => logout()}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
