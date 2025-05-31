import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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
  AlertCircle,
  Loader2
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { UserRole, User } from '@/types/user';
import useUsers from '@/hooks/useUsers';
import { CreateUserData } from '@/services/userService';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

export function UserManagementPageEnhanced() {
  const {
    users,
    loading,
    error,
    fetchUsers,
    addUser,
    editUser,
    removeUser,
    toggleStatus
  } = useUsers();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isNewUserDialogOpen, setIsNewUserDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newUserData, setNewUserData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: 'Customer' as UserRole,
  });

  const navigate = useNavigate();
  const { toast } = useToast();

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers().catch(error => {
      console.error('Failed to fetch users:', error);
      toast({
        title: "Error fetching users",
        description: "There was a problem loading the user data. Please try again.",
        variant: "destructive"
      });
    });
  }, [fetchUsers, toast]);

  // Filter users based on search term and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = true; // We'll implement status filtering when the API provides this field
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Handle user selection
  const toggleUserSelection = (userId: string) => {
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
  const handleCreateUser = async () => {
    try {
      setIsSubmitting(true);
      
      // Prepare the user data
      const userData: CreateUserData = {
        name: newUserData.name,
        email: newUserData.email,
        password: newUserData.password,
        password_confirmation: newUserData.password_confirmation,
        role: newUserData.role
      };
      
      // Create the user
      const newUser = await addUser(userData);
      
      // Reset form and close dialog
      setIsNewUserDialogOpen(false);
      setNewUserData({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'Customer' as UserRole
      });
      
      toast({
        title: "User created",
        description: `${newUser.name} has been added successfully.`,
      });
    } catch (error) {
      console.error('Error creating user:', error);
      toast({
        title: "Error creating user",
        description: "There was a problem creating the user. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle user deletion
  const handleDeleteUser = async (userId: string) => {
    try {
      await removeUser(userId);
      setSelectedUsers(prev => prev.filter(id => id !== userId));
      
      toast({
        title: "User deleted",
        description: "The user has been removed from the system.",
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: "Error deleting user",
        description: "There was a problem deleting the user. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Handle bulk actions
  const handleBulkAction = async (action: string) => {
    if (action === 'delete') {
      try {
        // Delete multiple users one by one
        const promises = selectedUsers.map(id => removeUser(id));
        await Promise.all(promises);
        
        toast({
          title: "Users deleted",
          description: `${selectedUsers.length} users have been removed from the system.`,
        });
        
        setSelectedUsers([]);
      } catch (error) {
        console.error('Error performing bulk delete:', error);
        toast({
          title: "Error deleting users",
          description: "There was a problem deleting the users. Please try again.",
          variant: "destructive"
        });
      }
    } else if (action === 'activate' || action === 'deactivate') {
      try {
        // Toggle status for multiple users
        const promises = selectedUsers.map(id => toggleStatus(id));
        await Promise.all(promises);
        
        toast({
          title: `Users ${action}d`,
          description: `${selectedUsers.length} users have been ${action}d.`,
        });
      } catch (error) {
        console.error(`Error performing bulk ${action}:`, error);
        toast({
          title: `Error ${action}ing users`,
          description: `There was a problem ${action}ing the users. Please try again.`,
          variant: "destructive"
        });
      }
    }
  };

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Get status badge (we'll assume active status if no status is provided)
  const getStatusBadge = (user: User) => {
    // For the demo, we'll just show all users as active
    return (
      <Badge className="bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400">
        <CheckCircle className="h-3 w-3 mr-1" />
        Active
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">User Management</h2>
        <Button
          onClick={() => setIsNewUserDialogOpen(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
        >
          <UserPlus className="h-4 w-4" />
          Add New User
        </Button>
      </div>

      <Card className="border-none shadow-md overflow-hidden">
        <CardHeader className="border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 p-4 sm:p-6">
          <CardTitle>Users</CardTitle>
          <CardDescription>Manage your system users, assign roles, and control access permissions.</CardDescription>
        </CardHeader>
        
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex-1 max-w-md relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search users by name or email..."
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
                  <SelectItem value="SuperAdmin">Super Admin</SelectItem>
                  <SelectItem value="SubSuperAdmin">Sub-Super Admin</SelectItem>
                  <SelectItem value="Seller">Seller</SelectItem>
                  <SelectItem value="Customer">Customer</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" size="icon" className="border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                <Filter className="h-4 w-4 text-gray-500" />
              </Button>
              
              <Button 
                variant="outline" 
                size="icon" 
                className="border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
                onClick={() => fetchUsers()}
              >
                <RefreshCw className={`h-4 w-4 text-gray-500 ${loading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
          
          {selectedUsers.length > 0 && (
            <div className="flex items-center gap-2 mt-4 p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
              <span className="text-sm text-gray-500 dark:text-gray-400">{selectedUsers.length} users selected</span>
              <div className="ml-auto flex gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8">
                      Bulk Actions <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleBulkAction('activate')}>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Activate
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleBulkAction('deactivate')}>
                      <XCircle className="h-4 w-4 mr-2" />
                      Deactivate
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleBulkAction('delete')} className="text-red-600 focus:text-red-600">
                      <Trash className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          )}
        </CardContent>
        
        {loading ? (
          <div className="flex justify-center items-center p-8">
            <div className="flex flex-col items-center gap-2">
              <div className="h-10 w-10 rounded-full border-4 border-t-indigo-500 border-r-indigo-500 border-b-indigo-200 border-l-indigo-200 animate-spin"></div>
              <p className="text-gray-500 dark:text-gray-400">Loading users...</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table className="w-full">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40px]">
                    <Checkbox 
                      checked={selectedUsers.length > 0 && selectedUsers.length === filteredUsers.length} 
                      onCheckedChange={(checked) => selectAllUsers(!!checked)}
                      className="translate-y-[2px]"
                    />
                  </TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      {searchTerm || filterRole !== 'all' ? 'No users match your search criteria' : 'No users found'}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id} className="border-b border-gray-100 dark:border-gray-700">
                      <TableCell>
                        <Checkbox 
                          checked={selectedUsers.includes(user.id)} 
                          onCheckedChange={() => toggleUserSelection(user.id)}
                          className="translate-y-[2px]"
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9 bg-gray-100 dark:bg-gray-800">
                            <AvatarFallback className="text-gray-500 bg-gray-200 dark:bg-gray-700">
                              {user.name?.substring(0, 2).toUpperCase() || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-gray-900 dark:text-gray-100">{user.name}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                          {user.role || 'Customer'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(user)}
                      </TableCell>
                      <TableCell>
                        {formatDate(user.created_at)}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => navigate(`/dashboard/users/${user.id}`)}>
                              <UserCog className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate(`/dashboard/users/${user.id}/edit`)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleDeleteUser(user.id)} className="text-red-600 focus:text-red-600">
                              <Trash className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>

      {/* New User Dialog */}
      <Dialog open={isNewUserDialogOpen} onOpenChange={setIsNewUserDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New User</DialogTitle>
            <DialogDescription>
              Add a new user to the system. Fill out the form below to create a user account.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 gap-3">
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name" 
                value={newUserData.name} 
                onChange={(e) => setNewUserData({...newUserData, name: e.target.value})}
                placeholder="Enter full name"
              />
            </div>
            
            <div className="grid grid-cols-1 gap-3">
              <Label htmlFor="email">Email Address</Label>
              <Input 
                id="email" 
                type="email" 
                value={newUserData.email} 
                onChange={(e) => setNewUserData({...newUserData, email: e.target.value})}
                placeholder="Enter email address"
              />
            </div>
            
            <div className="grid grid-cols-1 gap-3">
              <Label htmlFor="role">User Role</Label>
              <Select 
                value={newUserData.role} 
                onValueChange={(value) => setNewUserData({...newUserData, role: value as UserRole})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Customer">Customer</SelectItem>
                  <SelectItem value="Seller">Seller</SelectItem>
                  <SelectItem value="SubSuperAdmin">Sub-Super Admin</SelectItem>
                  <SelectItem value="SuperAdmin">Super Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-1 gap-3">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                value={newUserData.password} 
                onChange={(e) => setNewUserData({...newUserData, password: e.target.value})}
                placeholder="Enter password"
              />
            </div>
            
            <div className="grid grid-cols-1 gap-3">
              <Label htmlFor="password_confirmation">Confirm Password</Label>
              <Input 
                id="password_confirmation" 
                type="password" 
                value={newUserData.password_confirmation} 
                onChange={(e) => setNewUserData({...newUserData, password_confirmation: e.target.value})}
                placeholder="Confirm password"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewUserDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateUser} 
              disabled={isSubmitting || !newUserData.name || !newUserData.email || !newUserData.password || !newUserData.password_confirmation}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>Create User</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
