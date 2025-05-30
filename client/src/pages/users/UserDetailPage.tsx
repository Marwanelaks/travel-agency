import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUsers } from '@/hooks/useUsers';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Edit, Trash2, ArrowLeft, UserX, UserCheck } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';

const UserDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { currentUser, fetchUser, toggleStatus, removeUser } = useUsers();
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [toggling, setToggling] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      if (!id) return;
      try {
        setLoading(true);
        await fetchUser(id);
      } catch (error) {
        console.error('Failed to load user', error);
        toast({
          title: 'Error',
          description: 'Failed to load user data',
          variant: 'destructive',
        });
        navigate('/users');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [id, fetchUser, navigate, toast]);

  const handleToggleStatus = async () => {
    if (!id || !currentUser) return;
    
    setToggling(true);
    try {
      await toggleStatus(id);
      toast({
        title: 'Success',
        description: `User ${currentUser.email_verified_at ? 'deactivated' : 'activated'} successfully`,
        variant: 'default',
      });
    } catch (error) {
      console.error('Failed to toggle user status', error);
      toast({
        title: 'Error',
        description: 'Failed to update user status',
        variant: 'destructive',
      });
    } finally {
      setToggling(false);
    }
  };

  const handleDelete = async () => {
    if (!id || !currentUser) return;
    
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    setDeleting(true);
    try {
      await removeUser(id);
      toast({
        title: 'Success',
        description: 'User deleted successfully',
        variant: 'default',
      });
      navigate('/users');
    } catch (error) {
      console.error('Failed to delete user', error);
      toast({
        title: 'Error',
        description: 'Failed to delete user',
        variant: 'destructive',
      });
    } finally {
      setDeleting(false);
    }
  };

  if (loading || !currentUser) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-2xl font-bold">User Details</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">{currentUser.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{currentUser.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Role</p>
                  <Badge variant={currentUser.role === 'admin' ? 'default' : 'secondary'}>
                    {currentUser.role}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge variant={currentUser.email_verified_at ? 'success' : 'destructive'}>
                    {currentUser.email_verified_at ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Member Since</p>
                  <p className="font-medium">
                    {currentUser.created_at ? format(new Date(currentUser.created_at), 'PPpp') : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Last Updated</p>
                  <p className="font-medium">
                    {currentUser.updated_at ? format(new Date(currentUser.updated_at), 'PPpp') : 'N/A'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col space-y-2">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => navigate(`/users/${currentUser.id}/edit`)}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit User
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={handleToggleStatus}
              disabled={toggling}
            >
              {toggling ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : currentUser.email_verified_at ? (
                <UserX className="mr-2 h-4 w-4 text-yellow-500" />
              ) : (
                <UserCheck className="mr-2 h-4 w-4 text-green-500" />
              )}
              {currentUser.email_verified_at ? 'Deactivate User' : 'Activate User'}
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="mr-2 h-4 w-4" />
              )}
              Delete User
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailPage;
