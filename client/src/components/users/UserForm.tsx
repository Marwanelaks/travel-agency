import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useUsers } from '@/hooks/useUsers';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@radix-ui/react-label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, ArrowLeft, Save } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const userFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  role: z.enum(['Seller', 'SuperAdmin', 'Random buyer']),
  password: z.string().min(8, 'Password must be at least 8 characters').optional().or(z.literal('')),
  password_confirmation: z.string().optional(),
}).refine(
  (data) => !data.password || data.password === data.password_confirmation,
  {
    message: "Passwords don't match",
    path: ['password_confirmation'],
  }
);

type UserFormValues = z.infer<typeof userFormSchema>;

interface UserFormProps {
  isEditing?: boolean;
  defaultValues?: Partial<UserFormValues>;
}

const UserForm: React.FC<UserFormProps> = ({ isEditing = false, defaultValues }) => {
  const { id } = useParams<{ id: string }>();
  const { addUser, editUser, loading } = useUsers();
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: '',
      email: '',
      role: 'Seller',
      password: '',
      password_confirmation: '',
      ...defaultValues,
    },
  });

  useEffect(() => {
    if (isEditing && defaultValues) {
      form.reset(defaultValues);
    }
  }, [isEditing, defaultValues, form]);

  const onSubmit = async (formData: UserFormValues) => {
    try {
      if (isEditing && id) {
        // If password is empty, remove it from the data
        const updateData = { ...formData };
        if (!updateData.password) {
          delete updateData.password;
          delete updateData.password_confirmation;
        }
        await editUser(id, updateData as any);
        toast({
          title: 'Success',
          description: 'User updated successfully',
          variant: 'default',
        });
      } else {
        // Ensure required fields are present for new user
        const createData = {
          ...formData,
          password: formData.password || '',
          password_confirmation: formData.password_confirmation || ''
        };
        await addUser(createData);
        toast({
          title: 'Success',
          description: 'User created successfully',
          variant: 'default',
        });
        navigate('/users');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-2xl font-bold">
          {isEditing ? 'Edit User' : 'Add New User'}
        </h2>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              {...form.register('name')}
              placeholder="John Doe"
            />
            {form.formState.errors.name && (
              <p className="text-sm text-red-500">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...form.register('email')}
              placeholder="john@example.com"
              disabled={isEditing}
            />
            {form.formState.errors.email && (
              <p className="text-sm text-red-500">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select
              value={form.watch('role')}
              onValueChange={value => form.setValue('role', value, { shouldValidate: true })}
            >
              <SelectTrigger id="role">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Seller">Seller</SelectItem>
                <SelectItem value="SuperAdmin">SuperAdmin</SelectItem>
                <SelectItem value="Random buyer">Random buyer</SelectItem>
              </SelectContent>
            </Select>
            {form.formState.errors.role && (
              <p className="text-sm text-red-500">
                {form.formState.errors.role.message}
              </p>
            )}
          </div>

          {!isEditing && (
            <>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  {...form.register('password')}
                  placeholder="••••••••"
                />
                {form.formState.errors.password && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.password.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password_confirmation">Confirm Password</Label>
                <Input
                  id="password_confirmation"
                  type="password"
                  {...form.register('password_confirmation')}
                  placeholder="••••••••"
                />
                {form.formState.errors.password_confirmation && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.password_confirmation.message}
                  </p>
                )}
              </div>
            </>
          )}
        </div>

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/users')}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isEditing ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {isEditing ? 'Update User' : 'Create User'}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;
