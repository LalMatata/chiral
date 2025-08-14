import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Users, Plus, Edit, Trash2, Shield, UserCheck, UserX,
  Calendar, Mail, Key
} from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    loadUsers();
    getCurrentUser();
  }, []);

  const getCurrentUser = () => {
    // Get current user info from token or local storage
    const userStr = localStorage.getItem('admin_user');
    if (userStr) {
      try {
        setCurrentUser(JSON.parse(userStr));
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  };

  const loadUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('admin_token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await fetch('/api/auth/users', {
        headers
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        // Fallback to mock data if API not available
        setUsers([
          {
            id: 1,
            username: 'admin',
            email: 'admin@chiral-robotics.com',
            role: 'admin',
            is_active: true,
            last_login: '2024-01-15T10:30:00Z',
            created_at: '2024-01-01T00:00:00Z'
          },
          {
            id: 2,
            username: 'sales_manager',
            email: 'sales@chiral-robotics.com',
            role: 'manager',
            is_active: true,
            last_login: '2024-01-14T15:45:00Z',
            created_at: '2024-01-02T00:00:00Z'
          },
          {
            id: 3,
            username: 'sales_rep',
            email: 'rep@chiral-robotics.com',
            role: 'sales',
            is_active: true,
            last_login: '2024-01-13T09:15:00Z',
            created_at: '2024-01-03T00:00:00Z'
          }
        ]);
      }
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (userData) => {
    try {
      const token = localStorage.getItem('admin_token');
      const headers = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` })
      };

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers,
        body: JSON.stringify(userData)
      });

      if (response.ok) {
        toast.success('User created successfully');
        loadUsers();
        setIsDialogOpen(false);
        setEditingUser(null);
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to create user');
      }
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error('Failed to create user');
    }
  };

  const handleUpdateUser = async (userId, userData) => {
    try {
      const token = localStorage.getItem('admin_token');
      const headers = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` })
      };

      const response = await fetch(`/api/auth/users/${userId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(userData)
      });

      if (response.ok) {
        toast.success('User updated successfully');
        loadUsers();
        setIsDialogOpen(false);
        setEditingUser(null);
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to update user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user');
    }
  };

  const handleDeactivateUser = async (userId) => {
    if (userId === currentUser?.id) {
      toast.error('Cannot deactivate your own account');
      return;
    }

    try {
      const token = localStorage.getItem('admin_token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await fetch(`/api/auth/users/${userId}`, {
        method: 'DELETE',
        headers
      });

      if (response.ok) {
        toast.success('User deactivated successfully');
        loadUsers();
      } else {
        toast.error('Failed to deactivate user');
      }
    } catch (error) {
      console.error('Error deactivating user:', error);
      toast.error('Failed to deactivate user');
    }
  };

  const getRoleBadge = (role) => {
    const colors = {
      admin: 'bg-red-500 text-white',
      manager: 'bg-blue-500 text-white',
      sales: 'bg-green-500 text-white'
    };

    return (
      <Badge className={colors[role] || 'bg-gray-500 text-white'}>
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </Badge>
    );
  };

  const getStatusBadge = (isActive) => (
    <Badge className={isActive ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}>
      {isActive ? 'Active' : 'Inactive'}
    </Badge>
  );

  const UserForm = ({ user, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
      username: user?.username || '',
      email: user?.email || '',
      password: '',
      role: user?.role || 'sales'
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      
      if (!user && !formData.password) {
        toast.error('Password is required for new users');
        return;
      }

      const userData = { ...formData };
      if (!formData.password) delete userData.password;

      if (user) {
        handleUpdateUser(user.id, userData);
      } else {
        handleCreateUser(userData);
      }
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            value={formData.username}
            onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            required
          />
        </div>

        <div>
          <Label htmlFor="password">
            Password {user ? '(leave blank to keep current)' : ''}
          </Label>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
            required={!user}
          />
          {!user && (
            <p className="text-xs text-gray-500 mt-1">
              Password must be at least 8 characters long
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="role">Role</Label>
          <Select 
            value={formData.role} 
            onValueChange={(value) => setFormData(prev => ({ ...prev, role: value }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="manager">Manager</SelectItem>
              <SelectItem value="sales">Sales</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex space-x-2">
          <Button type="submit">
            {user ? 'Update User' : 'Create User'}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">User Management</h2>
          <p className="text-gray-600">Manage system users and their permissions</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingUser(null)}>
              <Plus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingUser ? 'Edit User' : 'Create New User'}
              </DialogTitle>
              <DialogDescription>
                {editingUser ? 'Update user information and permissions' : 'Add a new user to the system'}
              </DialogDescription>
            </DialogHeader>
            
            <UserForm
              user={editingUser}
              onSave={() => {}} // handled in form
              onCancel={() => {
                setEditingUser(null);
                setIsDialogOpen(false);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="mr-2 h-5 w-5" />
            System Users ({users.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-12">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      No users found
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div>
                          <div className="flex items-center space-x-2">
                            <p className="font-medium">{user.username}</p>
                            {user.id === currentUser?.id && (
                              <Badge variant="outline" className="text-xs">
                                You
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <Mail className="h-3 w-3" />
                            <span>{user.email}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getRoleBadge(user.role)}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(user.is_active)}
                      </TableCell>
                      <TableCell>
                        {user.last_login ? (
                          <div className="text-sm">
                            {new Date(user.last_login).toLocaleDateString()}
                            <br />
                            <span className="text-gray-500">
                              {new Date(user.last_login).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-500">Never</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1 text-sm text-gray-500">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(user.created_at).toLocaleDateString()}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem 
                              onClick={() => {
                                setEditingUser(user);
                                setIsDialogOpen(true);
                              }}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit User
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Key className="mr-2 h-4 w-4" />
                              Reset Password
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleDeactivateUser(user.id)}
                              disabled={user.id === currentUser?.id}
                              className="text-red-600"
                            >
                              <UserX className="mr-2 h-4 w-4" />
                              Deactivate
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
        </CardContent>
      </Card>

      {/* Role Permissions Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="mr-2 h-5 w-5" />
            Role Permissions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  {getRoleBadge('admin')}
                </div>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Full system access</li>
                  <li>• User management</li>
                  <li>• System configuration</li>
                  <li>• All lead management features</li>
                </ul>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  {getRoleBadge('manager')}
                </div>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Lead management</li>
                  <li>• Team performance analytics</li>
                  <li>• Bulk operations</li>
                  <li>• Export capabilities</li>
                </ul>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  {getRoleBadge('sales')}
                </div>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• View assigned leads</li>
                  <li>• Update lead status</li>
                  <li>• Add follow-ups</li>
                  <li>• Basic reporting</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;