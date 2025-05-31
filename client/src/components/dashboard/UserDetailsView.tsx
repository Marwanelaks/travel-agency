import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import {
  ArrowLeft,
  User,
  Mail,
  Calendar,
  Clock,
  Shield,
  CheckCircle,
  Edit,
  Trash
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { User as UserType } from '@/types/user';
import useUsers from '@/hooks/useUsers';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export function UserDetailsView() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<UserType | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const { fetchUser, removeUser } = useUsers();
  
  // Fetch user data
  useEffect(() => {
    const loadUser = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const userData = await fetchUser(id);
        setUser(userData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching user:', error);
        toast({
          title: "Error",
          description: "Failed to load user data. Please try again.",
          variant: "destructive"
        });
        navigate('/dashboard/users');
      }
    };
    
    loadUser();
  }, [id, navigate, toast, fetchUser]);

  // Handle user deletion
  const handleDeleteUser = async () => {
    if (!id) return;
    
    try {
      await removeUser(id);
      
      toast({
        title: "User deleted",
        description: "The user has been removed from the system.",
      });
      
      navigate('/dashboard/users');
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: "Error deleting user",
        description: "There was a problem deleting the user. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsDeleteDialogOpen(false);
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[500px]">
        <div className="flex flex-col items-center gap-2">
          <div className="animate-spin h-10 w-10 rounded-full border-4 border-indigo-100 border-t-indigo-500"></div>
          <p className="text-gray-500 dark:text-gray-400">Loading user data...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-[500px]">
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center text-red-600 dark:text-red-400">
            <User className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-semibold mt-4">User Not Found</h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mb-4">
            The user you're looking for doesn't exist or has been deleted.
          </p>
          <Button onClick={() => navigate('/dashboard/users')}>
            Back to Users
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">User Details</h2>
        <Button 
          variant="outline" 
          onClick={() => navigate('/dashboard/users')}
          className="flex items-center gap-1"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Users
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-md overflow-hidden bg-white dark:bg-gray-800 md:col-span-2">
          <CardHeader className="border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
            <CardTitle className="text-xl">User Information</CardTitle>
            <CardDescription>Detailed information about this user</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="flex flex-col items-center">
                <Avatar className="h-24 w-24 text-2xl bg-gray-100 dark:bg-gray-800">
                  <AvatarFallback className="text-gray-500 bg-gray-200 dark:bg-gray-700 text-2xl">
                    {user.name?.substring(0, 2).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <Badge className="mt-4 bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Active
                </Badge>
              </div>
              
              <div className="flex-1 space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{user.name}</h3>
                  <p className="text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    <Mail className="h-3.5 w-3.5" />
                    {user.email}
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-md bg-indigo-100 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                      <Shield className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Role</p>
                      <p className="font-medium text-gray-900 dark:text-gray-100">{user.role || 'Customer'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-md bg-indigo-100 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                      <Calendar className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Created On</p>
                      <p className="font-medium text-gray-900 dark:text-gray-100">{formatDate(user.created_at)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-md bg-indigo-100 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                      <Clock className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Last Updated</p>
                      <p className="font-medium text-gray-900 dark:text-gray-100">{formatDate(user.updated_at)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 p-4">
            <div className="flex flex-col sm:flex-row justify-end gap-3 w-full">
              <Button
                variant="outline"
                onClick={() => navigate(`/dashboard/users/${id}/edit`)}
                className="flex items-center gap-1"
              >
                <Edit className="h-4 w-4" />
                Edit User
              </Button>
              <Button
                variant="destructive"
                onClick={() => setIsDeleteDialogOpen(true)}
                className="flex items-center gap-1"
              >
                <Trash className="h-4 w-4" />
                Delete User
              </Button>
            </div>
          </CardFooter>
        </Card>
        
        <div className="space-y-6">
          <Card className="border-none shadow-md overflow-hidden bg-white dark:bg-gray-800">
            <CardHeader className="border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
              <CardTitle className="text-lg">Department</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <p className="text-gray-500 dark:text-gray-400">
                {user.department || 'No department assigned'}
              </p>
            </CardContent>
          </Card>
          
          {/* Add other cards for additional user information as needed */}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              User: <span className="font-medium text-gray-900 dark:text-gray-100">{user.name}</span>
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Email: <span className="font-medium text-gray-900 dark:text-gray-100">{user.email}</span>
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteUser}>
              Delete User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
