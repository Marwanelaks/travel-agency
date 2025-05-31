import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { 
  Users, 
  Search, 
  Filter, 
  UserPlus, 
  MoreHorizontal, 
  Edit, 
  Trash, 
  Mail, 
  Lock, 
  Shield,
  RefreshCw,
  Download,
  UploadCloud,
  ChevronDown,
  UserCog,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { DataTable } from '@/components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';

// Mock user data - would be fetched from an API in a real application
const mockUsers = [
  {
    id: 1,
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    role: 'Admin',
    status: 'active',
    created_at: '2025-01-10T14:30:00Z',
    last_login: '2025-05-28T09:15:22Z'
  },
  {
    id: 2,
    name: 'Samantha Williams',
    email: 'samantha.w@example.com',
    role: 'Seller',
    status: 'active',
    created_at: '2025-02-15T11:20:00Z',
    last_login: '2025-05-29T16:45:12Z'
  },
  {
    id: 3,
    name: 'Michael Chen',
    email: 'michael.chen@example.com',
    role: 'Customer',
    status: 'active',
    created_at: '2025-03-22T08:45:00Z',
    last_login: '2025-05-25T14:30:08Z'
  },
  {
    id: 4,
    name: 'Emily Rodriguez',
    email: 'emily.r@example.com',
    role: 'Seller',
    status: 'inactive',
    created_at: '2025-01-30T16:15:00Z',
    last_login: '2025-04-15T11:20:45Z'
  },
  {
    id: 5,
    name: 'James Wilson',
    email: 'james.wilson@example.com',
    role: 'Customer',
    status: 'active',
    created_at: '2025-04-05T09:30:00Z',
    last_login: '2025-05-30T08:10:33Z'
  },
  {
    id: 6,
    name: 'Olivia Taylor',
    email: 'olivia.t@example.com',
    role: 'Customer',
    status: 'active',
    created_at: '2025-03-12T13:45:00Z',
    last_login: '2025-05-28T19:25:18Z'
  },
  {
    id: 7,
    name: 'David Brown',
    email: 'david.brown@example.com',
    role: 'Admin',
    status: 'active',
    created_at: '2025-02-28T10:20:00Z',
    last_login: '2025-05-29T12:35:50Z'
  },
  {
    id: 8,
    name: 'Sophia Martinez',
    email: 'sophia.m@example.com',
    role: 'Seller',
    status: 'suspended',
    created_at: '2025-01-18T15:10:00Z',
    last_login: '2025-04-20T09:15:22Z'
  }
];

// Interface for user data
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'suspended';
  created_at: string;
  last_login: string;
}

export function UserManagementPage() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [isNewUserDialogOpen, setIsNewUserDialogOpen] = useState(false);
  const [newUserData, setNewUserData] = useState({
    name: '',
    email: '',
    role: 'Customer',
    status: 'active'
  });
  
  const navigate = useNavigate();
  const { toast } = useToast();

  // Simulate API fetch
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Filter users based on search term and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Handle user selection
  const toggleUserSelection = (userId: number) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId) 
        : [...prev, userId]
    );
  };

  const selectAllUsers = (select: boolean) => {
    if (select) {
      setSelectedUsers(filteredUsers.map(user => user.id));
    } else {
      setSelectedUsers([]);
    }
  };

  // Handle new user submission
  const handleCreateUser = () => {
    // In a real app, this would be an API call
    const newUser: User = {
      id: users.length + 1,
      name: newUserData.name,
      email: newUserData.email,
      role: newUserData.role,
      status: newUserData.status as 'active' | 'inactive' | 'suspended',
      created_at: new Date().toISOString(),
      last_login: ''
    };
    
    setUsers(prev => [...prev, newUser]);
    setIsNewUserDialogOpen(false);
    setNewUserData({ name: '', email: '', role: 'Customer', status: 'active' });
    
    toast({
      title: "User created",
      description: `${newUser.name} has been added successfully.`,
    });
  };

  // Handle user deletion
  const handleDeleteUser = (userId: number) => {
    // In a real app, this would be an API call
    setUsers(prev => prev.filter(user => user.id !== userId));
    setSelectedUsers(prev => prev.filter(id => id !== userId));
    
    toast({
      title: "User deleted",
      description: "The user has been removed from the system.",
    });
  };

  // Handle bulk actions
  const handleBulkAction = (action: string) => {
    if (action === 'delete') {
      // In a real app, this would be an API call
      setUsers(prev => prev.filter(user => !selectedUsers.includes(user.id)));
      
      toast({
        title: "Users deleted",
        description: `${selectedUsers.length} users have been removed from the system.`,
      });
      
      setSelectedUsers([]);
    } else if (action === 'activate' || action === 'deactivate') {
      const newStatus = action === 'activate' ? 'active' : 'inactive';
      
      setUsers(prev => prev.map(user => 
        selectedUsers.includes(user.id) 
          ? { ...user, status: newStatus as 'active' | 'inactive' | 'suspended' } 
          : user
      ));
      
      toast({
        title: `Users ${action}d`,
        description: `${selectedUsers.length} users have been ${action}d.`,
      });
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <Badge className="bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400">
            <CheckCircle className="h-3 w-3 mr-1" />
            Active
          </Badge>
        );
      case 'inactive':
        return (
          <Badge variant="secondary" className="bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400">
            <XCircle className="h-3 w-3 mr-1" />
            Inactive
          </Badge>
        );
      case 'suspended':
        return (
          <Badge variant="destructive" className="bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400">
            <AlertCircle className="h-3 w-3 mr-1" />
            Suspended
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            {status}
          </Badge>
        );
    }
  };

  // Get role badge
  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'Admin':
        return (
          <Badge variant="outline" className="border-indigo-200 text-indigo-700 dark:border-indigo-800 dark:text-indigo-400">
            <Shield className="h-3 w-3 mr-1" />
            {role}
          </Badge>
        );
      case 'Seller':
        return (
          <Badge variant="outline" className="border-purple-200 text-purple-700 dark:border-purple-800 dark:text-purple-400">
            <UserCog className="h-3 w-3 mr-1" />
            {role}
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="border-blue-200 text-blue-700 dark:border-blue-800 dark:text-blue-400">
            <Users className="h-3 w-3 mr-1" />
            {role}
          </Badge>
        );
    }
  };

  // Get user initials for avatar
  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  // Table columns definition
  const columns: ColumnDef<User>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox 
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => selectAllUsers(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox 
          checked={selectedUsers.includes(row.original.id)}
          onCheckedChange={() => toggleUserSelection(row.original.id)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'name',
      header: 'User',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 border-2 border-gray-100 dark:border-gray-800">
            <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
              {getUserInitials(row.original.name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium text-gray-700 dark:text-gray-300">{row.original.name}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{row.original.email}</div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'role',
      header: 'Role',
      cell: ({ row }) => getRoleBadge(row.original.role),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => getStatusBadge(row.original.status),
    },
    {
      accessorKey: 'created_at',
      header: 'Created',
      cell: ({ row }) => formatDate(row.original.created_at),
    },
    {
      accessorKey: 'last_login',
      header: 'Last Login',
      cell: ({ row }) => formatDate(row.original.last_login),
    },
    {
      id: 'actions',
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
            <DropdownMenuItem 
              onClick={() => navigate(`/dashboard/users/${row.original.id}`)}
              className="cursor-pointer"
            >
              <Users className="h-4 w-4 mr-2" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => navigate(`/dashboard/users/${row.original.id}/edit`)}
              className="cursor-pointer"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit User
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => {/* Would implement send email */}}
              className="cursor-pointer"
            >
              <Mail className="h-4 w-4 mr-2" />
              Send Email
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => {/* Would implement reset password */}}
              className="cursor-pointer"
            >
              <Lock className="h-4 w-4 mr-2" />
              Reset Password
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => handleDeleteUser(row.original.id)}
              className="text-red-600 focus:text-red-600 cursor-pointer"
            >
              <Trash className="h-4 w-4 mr-2" />
              Delete User
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">User Management</h2>
          <p className="text-muted-foreground">Manage users and permissions in your system</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setIsNewUserDialogOpen(true)}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      {/* Filters and actions */}
      <Card className="border-none shadow-md overflow-hidden bg-white dark:bg-gray-800">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex-1 max-w-md relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Select value={filterRole} onValueChange={setFilterRole}>
                <SelectTrigger className="w-[140px] bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700">
                  <SelectValue placeholder="All Roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Seller">Seller</SelectItem>
                  <SelectItem value="Customer">Customer</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[140px] bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" size="icon" className="border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                <Filter className="h-4 w-4 text-gray-500" />
              </Button>
              
              <Button variant="outline" size="icon" className="border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                <RefreshCw className="h-4 w-4 text-gray-500" />
              </Button>
            </div>
          </div>
          
          {/* Bulk actions */}
          {selectedUsers.length > 0 && (
            <div className="mt-4 p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-md flex items-center justify-between">
              <span className="text-sm text-indigo-700 dark:text-indigo-400 font-medium ml-2">
                {selectedUsers.length} users selected
              </span>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleBulkAction('activate')}
                  className="border-indigo-200 text-indigo-700 dark:border-indigo-800 dark:text-indigo-400"
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Activate
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleBulkAction('deactivate')}
                  className="border-gray-200 text-gray-700 dark:border-gray-800 dark:text-gray-400"
                >
                  <XCircle className="h-4 w-4 mr-1" />
                  Deactivate
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleBulkAction('delete')}
                  className="border-red-200 text-red-700 dark:border-red-800 dark:text-red-400"
                >
                  <Trash className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* User table */}
      <Card className="border-none shadow-md overflow-hidden bg-white dark:bg-gray-800">
        <CardHeader className="border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-gray-800 dark:text-gray-200">Users List</CardTitle>
              <CardDescription className="text-gray-500 dark:text-gray-400">
                {filteredUsers.length} users found
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="border-gray-200 dark:border-gray-700">
                    <Download className="h-4 w-4 mr-1" />
                    Export
                    <ChevronDown className="h-4 w-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    Export as CSV
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    Export as Excel
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    Export as PDF
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="outline" size="sm" className="border-gray-200 dark:border-gray-700">
                <UploadCloud className="h-4 w-4 mr-1" />
                Import
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center items-center py-16">
              <div className="inline-block p-3 rounded-full bg-gradient-to-tr from-indigo-500/20 to-purple-500/20">
                <div className="animate-spin h-10 w-10 rounded-full border-4 border-indigo-100 border-t-indigo-500"></div>
              </div>
            </div>
          ) : (
            <DataTable 
              columns={columns} 
              data={filteredUsers} 
              initialState={{
                pagination: {
                  pageSize: 10,
                }
              }}
            />
          )}
        </CardContent>
        <CardFooter className="border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 py-3">
          <div className="flex items-center justify-between w-full">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Showing {filteredUsers.length} of {users.length} users
            </div>
          </div>
        </CardFooter>
      </Card>

      {/* New User Dialog */}
      <Dialog open={isNewUserDialogOpen} onOpenChange={setIsNewUserDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Enter the details for the new user. They will receive an email to set their password.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name" 
                value={newUserData.name} 
                onChange={(e) => setNewUserData({...newUserData, name: e.target.value})} 
                placeholder="John Doe"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                value={newUserData.email} 
                onChange={(e) => setNewUserData({...newUserData, email: e.target.value})} 
                placeholder="john.doe@example.com"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role">Role</Label>
              <Select 
                value={newUserData.role} 
                onValueChange={(value) => setNewUserData({...newUserData, role: value})}
              >
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Seller">Seller</SelectItem>
                  <SelectItem value="Customer">Customer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select 
                value={newUserData.status} 
                onValueChange={(value) => setNewUserData({...newUserData, status: value})}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewUserDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateUser}>Create User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
