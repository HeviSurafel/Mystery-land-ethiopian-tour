"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  Filter,
  ChevronDown,
  MoreVertical,
  User,
  Mail,
  Phone,
  Calendar,
  Shield,
  Ban,
  Trash2,
  Edit,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  Download,
  Plus,
  UserPlus,
  UserCog,
  Lock,
  Unlock,
  Star,
  Clock,
  MapPin,
  DollarSign,
  MessageCircle,
  FileText,
  Settings,
  LogOut,
  Users as UsersIcon,
  Activity,
  BarChart3,
  TrendingUp,
  Award,
  Crown,
  BadgeCheck,
  ShieldCheck,
  AlertTriangle,
  Loader2
} from "lucide-react";
import Swal from "sweetalert2";
import { useAuth } from "@/contexts/AuthContext";

interface User {
  _id: string;
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'client' | 'admin' ;
  status: 'active' | 'inactive' | 'banned';
  verified: boolean;
  banned: boolean;
  banReason?: string;
  bannedAt?: string;
  avatar?: string | null;
  joinedAt: string;
  lastActive?: string;
  bookingsCount: number;
  totalSpent: number;
  reviewsCount: number;
  location?: string;
  twoFactorEnabled?: boolean;
  emailVerified?: boolean;
  phoneVerified?: boolean;
  specialization?: string;
  languages?: string[];
  rating?: number;
  permissions?: string[];
  createdAt: string;
  updatedAt: string;
}

interface UsersResponse {
  success: boolean;
  data: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  stats: {
    total: number;
    active: number;
    inactive: number;
    banned: number;
    verified: number;
    unverified: number;
    clients: number;
    guides: number;
    admins: number;
    owners: number;
  };
}

const roles = ["all", "client", "admin"];
const statuses = ["all", "active", "inactive", "banned"];
const verificationStatuses = ["all", "verified", "unverified"];

export default function AdminUsersPage() {
  const { user: currentUser, hasRole } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [verificationFilter, setVerificationFilter] = useState("all");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [sortBy, setSortBy] = useState("joinedAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [showFilters, setShowFilters] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    banned: 0,
    verified: 0,
    unverified: 0,
    clients: 0,
    guides: 0,
    admins: 0,
    owners: 0
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1,
    hasNextPage: false,
    hasPrevPage: false
  });

  // Fetch users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(roleFilter !== 'all' && { role: roleFilter }),
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(verificationFilter !== 'all' && { verified: verificationFilter === 'verified' ? 'true' : 'false' }),
        ...(searchTerm && { search: searchTerm }),
        sortBy,
        sortOrder
      });

      const response = await fetch(`/api/admin/users?${params}`);

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data: UsersResponse = await response.json();
      
      if (data.success) {
        setUsers(data.data);
        setStats(data.stats);
        setPagination(data.pagination);
      }
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [pagination.page, roleFilter, statusFilter, verificationFilter, sortBy, sortOrder]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (pagination.page === 1) {
        fetchUsers();
      } else {
        setPagination(prev => ({ ...prev, page: 1 }));
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // ONLY TWO FUNCTIONS REMAIN: handleRoleChange and handleDeleteUser
  const handleRoleChange = async (userId: string, newRole: string) => {
    const result = await Swal.fire({
      title: "Change User Role",
      text: `Are you sure you want to change this user's role to ${newRole}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#B88A3D",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, change role"
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`/api/admin/users/${userId}/role`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ role: newRole })
        });

        if (!response.ok) {
          throw new Error('Failed to update role');
        }

        await fetchUsers();
        
        Swal.fire({
          title: "Role Updated",
          text: "User role has been changed successfully",
          icon: "success",
          timer: 2000,
          confirmButtonColor: "#B88A3D"
        });
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: "Failed to update user role",
          icon: "error",
          confirmButtonColor: "#B88A3D"
        });
      }
    }
  };

  const handleDeleteUser = async (userId: string) => {
    const result = await Swal.fire({
      title: "Delete User",
      text: "Are you sure you want to delete this user? This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete user"
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`/api/admin/users/${userId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to delete user');
        }

        await fetchUsers();
        
        Swal.fire({
          title: "User Deleted",
          text: "User has been deleted successfully",
          icon: "success",
          timer: 2000,
          confirmButtonColor: "#B88A3D"
        });
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: "Failed to delete user",
          icon: "error",
          confirmButtonColor: "#B88A3D"
        });
      }
    }
  };

  // Removed: handleBanUser, handleBulkAction, handleVerifyUser, handleSendNotification, handleImpersonateUser, handleExportUsers

  const getRoleBadgeColor = (role: string) => {
    switch(role) {
    
      case 'admin': return 'bg-red-100 text-red-700 border-red-200';
    
      default: return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  const getRoleIcon = (role: string) => {
    switch(role) {
      case 'admin': return Shield;
    
      default: return User;
    }
  };

  const getStatusBadge = (user: User) => {
    if (user.banned) {
      return {
        color: 'bg-red-100 text-red-700 border-red-200',
        icon: Ban,
        text: 'Banned'
      };
    }
    switch(user.status) {
      case 'active':
        return {
          color: 'bg-green-100 text-green-700 border-green-200',
          icon: CheckCircle,
          text: 'Active'
        };
      case 'inactive':
        return {
          color: 'bg-gray-100 text-gray-700 border-gray-200',
          icon: Clock,
          text: 'Inactive'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-700 border-gray-200',
          icon: User,
          text: user.status
        };
    }
  };

  const StatCard = ({ title, value, icon: Icon, color }: any) => (
    <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-lg bg-${color}-50`}>
          <Icon className={`w-5 h-5 text-${color}-600`} />
        </div>
      </div>
    </div>
  );

  if (loading && !users.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-amber-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-1">Manage users and roles</p>
        </div>
        <div className="flex items-center space-x-3 mt-4 md:mt-0">
          <button
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            title={viewMode === 'grid' ? 'Switch to list view' : 'Switch to grid view'}
          >
            {viewMode === 'grid' ? '📋' : '🔲'}
          </button>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            title="Toggle filters"
          >
            <Filter className="w-5 h-5" />
          </button>
          <button
            onClick={fetchUsers}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            title="Refresh"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
          <Link
            href="/admin/users/create"
            className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition flex items-center space-x-2"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add User</span>
          </Link>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <p className="text-red-600">{error}</p>
          </div>
          <button
            onClick={fetchUsers}
            className="px-3 py-1 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
          >
            Retry
          </button>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatCard title="Total Users" value={stats.total} icon={UsersIcon} color="blue" />
        <StatCard title="Banned" value={stats.banned} icon={Ban} color="red" />
        <StatCard title="Clients" value={stats.clients} icon={User} color="blue" />
        <StatCard title="Admins" value={stats.admins} icon={Shield} color="red" />
      </div>

      {/* Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-xl shadow-sm p-4 overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Name, email, phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role
                </label>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none bg-white"
                >
                  {roles.map(role => (
                    <option key={role} value={role}>
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none bg-white"
                >
                  {statuses.map(status => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Verification
                </label>
                <select
                  value={verificationFilter}
                  onChange={(e) => setVerificationFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none bg-white"
                >
                  {verificationStatuses.map(status => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end items-center mt-4 pt-4 border-t">
              <button
                onClick={() => {
                  setSearchTerm("");
                  setRoleFilter("all");
                  setStatusFilter("all");
                  setVerificationFilter("all");
                }}
                className="text-sm text-amber-600 hover:text-amber-700"
              >
                Clear Filters
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
        </div>
      )}

      {/* Users Grid/List */}
      {!loading && (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user, index) => {
              const RoleIcon = getRoleIcon(user.role);
              const status = getStatusBadge(user);
              const StatusIcon = status.icon;

              return (
                <motion.div
                  key={user._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-6 border border-gray-100"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200">
                          {user.avatar ? (
                            <Image 
                              src={user.avatar} 
                              alt={user.name} 
                              width={64} 
                              height={64} 
                              className="object-cover" 
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-500 to-orange-500">
                              <span className="text-2xl font-bold text-white">
                                {user.name.charAt(0)}
                              </span>
                            </div>
                          )}
                        </div>
                        {user.verified && (
                          <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                            <BadgeCheck className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{user.name}</h3>
                        <p className="text-sm text-gray-500">{user.email}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-xs border ${getRoleBadgeColor(user.role)}`}>
                            <RoleIcon className="w-3 h-3" />
                            <span className="capitalize">{user.role}</span>
                          </span>
                          <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-xs border ${status.color}`}>
                            <StatusIcon className="w-3 h-3" />
                            <span>{status.text}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="w-4 h-4 mr-2 text-gray-400" />
                      {user.email}
                    </div>
                    {user.phone && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="w-4 h-4 mr-2 text-gray-400" />
                        {user.phone}
                      </div>
                    )}
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                      Joined {new Date(user.joinedAt).toLocaleDateString()}
                    </div>
                    {user.location && (
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                        {user.location}
                      </div>
                    )}
                  </div>

                  {user.banned && user.banReason && (
                    <div className="mt-3 p-2 bg-red-50 rounded-lg">
                      <p className="text-xs text-red-600">
                        <span className="font-medium">Ban reason:</span> {user.banReason}
                      </p>
                      {user.bannedAt && (
                        <p className="text-xs text-red-500 mt-1">
                          Banned on {new Date(user.bannedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  )}

                  {/* ONLY TWO ACTIONS: Role Change and Delete */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user._id, e.target.value)}
                      className="text-xs border border-gray-300 rounded-lg px-2 py-1 focus:ring-1 focus:ring-amber-500 focus:border-transparent outline-none"
                      disabled={user._id === currentUser?.id}
                    >
                      <option value="client">Client</option>
                     
                      <option value="admin">Admin</option>
                      
                    </select>

                    <button
                      onClick={() => handleDeleteUser(user._id)}
                      className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded-lg flex items-center space-x-1 hover:bg-red-100"
                      disabled={user._id === currentUser?.id }
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Delete</span>
                    </button>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
                    <span>Last active: {user.lastActive || 'Never'}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr className="text-left text-sm text-gray-500">
                    <th className="px-6 py-4 font-medium">User</th>
                    <th className="px-6 py-4 font-medium">Contact</th>
                    <th className="px-6 py-4 font-medium">Role</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium">Joined</th>
                    <th className="px-6 py-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {users.map((user, index) => {
                    const RoleIcon = getRoleIcon(user.role);
                    const status = getStatusBadge(user);
                    const StatusIcon = status.icon;

                    return (
                      <motion.tr
                        key={user._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.02 }}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                              {user.avatar ? (
                                <Image 
                                  src={user.avatar} 
                                  alt={user.name} 
                                  width={40} 
                                  height={40} 
                                  className="object-cover" 
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-500 to-orange-500">
                                  <span className="text-sm font-bold text-white">
                                    {user.name.charAt(0)}
                                  </span>
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="flex items-center space-x-2">
                                <span className="font-medium text-gray-900">{user.name}</span>
                                {user.verified && (
                                  <BadgeCheck className="w-4 h-4 text-green-500" />
                                )}
                              </div>
                              <span className="text-sm text-gray-500">{user.email}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{user.phone || 'N/A'}</div>
                          <div className="text-xs text-gray-500">{user.location || 'N/A'}</div>
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={user.role}
                            onChange={(e) => handleRoleChange(user._id, e.target.value)}
                            className={`text-xs px-2 py-1 rounded-full border ${getRoleBadgeColor(user.role)} focus:ring-1 focus:ring-amber-500 outline-none`}
                            disabled={user._id === currentUser?.id}
                          >
                            <option value="client">Client</option>
                            
                            <option value="admin">Admin</option>
                           
                          </select>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs border ${status.color}`}>
                            <StatusIcon className="w-3 h-3" />
                            <span>{status.text}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {new Date(user.joinedAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleDeleteUser(user._id)}
                              className="p-1 text-red-600 hover:bg-red-50 rounded-lg"
                              title="Delete"
                              disabled={user._id === currentUser?.id }
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )
      )}

      {!loading && users.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl">
          <UsersIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No users found</h3>
          <p className="text-gray-500 mt-1">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-between bg-white rounded-xl shadow-sm px-6 py-4">
          <div className="text-sm text-gray-500">
            Showing <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span> to{" "}
            <span className="font-medium">
              {Math.min(pagination.page * pagination.limit, pagination.total)}
            </span> of{" "}
            <span className="font-medium">{pagination.total}</span> users
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
              disabled={!pagination.hasPrevPage}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
              let pageNum = pagination.page;
              if (pagination.pages <= 5) {
                pageNum = i + 1;
              } else if (pagination.page <= 3) {
                pageNum = i + 1;
              } else if (pagination.page >= pagination.pages - 2) {
                pageNum = pagination.pages - 4 + i;
              } else {
                pageNum = pagination.page - 2 + i;
              }
              
              return (
                <button
                  key={i}
                  onClick={() => setPagination(prev => ({ ...prev, page: pageNum }))}
                  className={`px-3 py-1 rounded-lg text-sm ${
                    pagination.page === pageNum
                      ? 'bg-amber-500 text-white'
                      : 'border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
              disabled={!pagination.hasNextPage}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}