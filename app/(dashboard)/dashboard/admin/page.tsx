"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  Eye,
  Star,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowUp,
  ArrowDown,
  MoreVertical,
  Download,
  Filter,
  RefreshCw,
  UserPlus,
  MapPin,
  Award,
  MessageCircle,
  Phone,
  Mail
} from "lucide-react";

import LoadingSpinner from "@/components/dashboard/LoadingSpinner";
import { StatsCard } from "@/components/dashboard/StatsCard";

// Types for API responses
interface DashboardStats {
  totalUsers: number;
  newUsers: number;
  activeUsers: number;
  returningUsers: number;
  totalBookings: number;
  pendingBookings: number;
  completedBookings: number;
  bookingsOverTime: Array<{ _id: string; count: number }>;
  completionRate: number;
  totalReviews: number;
  averageRating: number;
  activeTours: number;
  completedTours: number;
  toursByCategory: Array<{ _id: string; count: number }>;
  timeRange: string;
  lastUpdated: string;
}

interface RecentBooking {
  id: string;
  bookingId: string;
  user: {
    name: string;
    email: string;
  };
  tour: string;
  date: string;
  status: string;
  paymentStatus: string;
  participants: number;
  hasReview: boolean;
  rating: number | null;
}

interface TopTour {
  name: string;
  category: string;
  duration: string;
  difficulty: string;
  bookings: number;
  avgRating: number;
  totalParticipants: number;
  completionRate: number;
}

interface RecentUser {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  joined: string;
  lastActive: string;
  isVerified: boolean;
  status: string;
  stats: {
    totalBookings: number;
    completedBookings: number;
    hasBooked: boolean;
    lastBookingDate: string | null;
  };
}

interface SystemStatus {
  server: {
    status: string;
    uptime: string;
    memory: any;
    cpu: number[];
    platform: string;
    nodeVersion: string;
  };
  database: {
    status: string;
    latency: number | null;
    lastBackup: string;
  };
  system: {
    activeSessions: number;
    storageUsed: number;
    lastChecked: string;
  };
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState("week");
  
  // State for dashboard data
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([]);
  const [topTours, setTopTours] = useState<TopTour[]>([]);
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);

  // Check authentication and fetch data
  useEffect(() => {
    checkAuthAndFetchData();
  }, [timeRange]);

  const checkAuthAndFetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
  
      
      // Fetch all dashboard data in parallel
      await fetchDashboardData();
    } catch (error) {
      console.error('Auth check failed:', error);
      setError('Authentication failed. Please log in again.');
      setTimeout(() => router.push('/login'), 2000);
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboardData = async () => {
    try {
      // Fetch all data in parallel for better performance
      const [statsRes, bookingsRes, toursRes, usersRes, systemRes] = await Promise.all([
        fetch(`http://localhost:3000/api/admin/dashboard/stats?timeRange=${timeRange}`),
        fetch('http://localhost:3000/api/admin/dashboard/recent-bookings?limit=10'),
        fetch('http://localhost:3000/api/admin/dashboard/top-tours?limit=5'),
        fetch('http://localhost:3000/api/admin/dashboard/recent-users?limit=5'),
        fetch('http://localhost:3000/api/admin/dashboard/system-status')
      ]);

      // Check if any request failed
      if (!statsRes.ok || !bookingsRes.ok || !toursRes.ok || !usersRes.ok || !systemRes.ok) {
        throw new Error('Failed to fetch dashboard data');
      }

      // Parse responses
      const statsData = await statsRes.json();
      const bookingsData = await bookingsRes.json();
      const toursData = await toursRes.json();
      const usersData = await usersRes.json();
      const systemData = await systemRes.json();

      // Update state
      if (statsData.success) setStats(statsData.data);
      if (bookingsData.success) setRecentBookings(bookingsData.data);
      if (toursData.success) setTopTours(toursData.data);
      if (usersData.success) setRecentUsers(usersData.data);
      if (systemData.success) setSystemStatus(systemData.data);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data. Please try again.');
    }
  };

  const handleRefresh = () => {
    checkAuthAndFetchData();
  };

  const handleExport = () => {
    // Implement export functionality
    console.log('Exporting dashboard data...');
  };

  const formatNumber = (num: number | undefined) => {
    if (num === undefined || num === null) return '0';
    return num.toLocaleString();
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'confirmed': return 'text-green-600 bg-green-50';
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      case 'cancelled': return 'text-red-600 bg-red-50';
      case 'refunded': return 'text-purple-600 bg-purple-50';
      case 'completed': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch(status) {
      case 'paid': return 'text-green-600 bg-green-50';
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      case 'failed': return 'text-red-600 bg-red-50';
      case 'refunded': return 'text-purple-600 bg-purple-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatRelativeTime = (dateString: string) => {
    if (!dateString) return 'N/A';
    const now = new Date();
    const date = new Date(dateString);
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return formatDate(dateString);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">
            {stats?.lastUpdated ? `Last updated: ${formatDate(stats.lastUpdated)}` : 'Loading...'}
          </p>
        </div>
        <div className="flex items-center space-x-3 mt-4 md:mt-0">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none bg-white"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
          <button
            onClick={handleRefresh}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            title="Refresh"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
          <button
            onClick={handleExport}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            title="Export Data"
          >
            <Download className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Users"
          value={formatNumber(stats?.totalUsers)}
          icon={Users}
          color="blue"
          trend={stats?.newUsers ? `+${stats.newUsers} this ${timeRange}` : undefined}
        />
      
        <StatsCard
          title="Total Bookings"
          value={formatNumber(stats?.totalBookings)}
          icon={Calendar}
          color="purple"
          trend={stats?.pendingBookings ? `${stats.pendingBookings} pending` : undefined}
        />
        
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bookings Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Bookings Overview</h2>
            <span className="text-sm text-gray-500">Last {timeRange}</span>
          </div>
          {stats?.bookingsOverTime && stats.bookingsOverTime.length > 0 ? (
            <div className="h-64 flex items-end space-x-2">
              {stats.bookingsOverTime.map((item, index) => {
                const maxCount = Math.max(...stats.bookingsOverTime.map(i => i.count));
                const height = maxCount > 0 ? (item.count / maxCount) * 200 : 20;
                return (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-full bg-amber-500 rounded-t-lg"
                      style={{ 
                        height: `${Math.max(20, height)}px`,
                        minHeight: '20px'
                      }}
                    />
                    <span className="text-xs text-gray-500 mt-2 transform -rotate-45 origin-top-left">
                      {item._id}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <p className="text-gray-500">No booking data available</p>
            </div>
          )}
        </motion.div>

        {/* Tours by Category */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Tours by Category</h2>
            <span className="text-sm text-gray-500">Active tours: {stats?.activeTours || 0}</span>
          </div>
          {stats?.toursByCategory && stats.toursByCategory.length > 0 ? (
            <div className="space-y-3">
              {stats.toursByCategory.map((category, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 capitalize">{category._id || 'Uncategorized'}</span>
                    <span className="font-medium text-gray-900">{category.count || 0}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-amber-500 h-2 rounded-full"
                      style={{ 
                        width: stats.activeTours > 0 
                          ? `${((category.count || 0) / stats.activeTours) * 100}%` 
                          : '0%'
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <p className="text-gray-500">No tour data available</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Recent Bookings & Top Tours */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Bookings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Bookings</h2>
            <Link href="/admin/bookings" className="text-amber-600 hover:text-amber-700 text-sm font-medium">
              View All
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-gray-500 border-b">
                  <th className="pb-3 font-medium">Booking ID</th>
                  <th className="pb-3 font-medium">Customer</th>
                  <th className="pb-3 font-medium">Tour</th>
                  <th className="pb-3 font-medium">Date</th>
                  <th className="pb-3 font-medium">Participants</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {recentBookings.length > 0 ? (
                  recentBookings.map((booking, index) => (
                    <tr key={booking.id || index} className="border-b last:border-0">
                      <td className="py-3 font-medium text-gray-900">{booking.bookingId || 'N/A'}</td>
                      <td className="py-3 text-gray-700">
                        <div>
                          <p>{booking.user?.name || 'Unknown'}</p>
                          <p className="text-xs text-gray-500">{booking.user?.email || 'No email'}</p>
                        </div>
                      </td>
                      <td className="py-3 text-gray-700">{booking.tour || 'Unknown'}</td>
                      <td className="py-3 text-gray-700">{formatDate(booking.date)}</td>
                      <td className="py-3 text-gray-700">{booking.participants || 1}</td>
                      <td className="py-3">
                        <div className="flex flex-col space-y-1">
                          <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(booking.status)}`}>
                            {booking.status || 'pending'}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full ${getPaymentStatusColor(booking.paymentStatus)}`}>
                            {booking.paymentStatus || 'pending'}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-500">
                      No recent bookings
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Top Tours */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Tours</h2>
          <div className="space-y-4">
            {topTours.length > 0 ? (
              topTours.map((tour, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{tour.name || 'Unknown Tour'}</h3>
                    <div className="flex items-center space-x-3 mt-1">
                      <span className="text-xs text-gray-500">{tour.bookings || 0} bookings</span>
                      <span className="text-xs text-gray-500">{tour.totalParticipants || 0} participants</span>
                      <span className="text-xs text-gray-500">{tour.completionRate || 0}% complete</span>
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs bg-gray-200 px-2 py-0.5 rounded-full">
                        {tour.category || 'Uncategorized'}
                      </span>
                      <span className="text-xs bg-gray-200 px-2 py-0.5 rounded-full">
                        {tour.difficulty || 'N/A'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 bg-amber-100 px-2 py-1 rounded-full ml-2">
                    <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                    <span className="text-xs font-medium text-amber-700">
                      {tour.avgRating ? tour.avgRating.toFixed(1) : '0.0'}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                No tour data available
              </div>
            )}
          </div>

          <Link href="/admin/tours">
            <button className="w-full mt-4 text-center text-sm text-amber-600 hover:text-amber-700 font-medium">
              View All Tours
            </button>
          </Link>
        </motion.div>
      </div>

      {/* Recent Users & System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Users */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Users</h2>
            <Link href="/admin/users" className="text-amber-600 hover:text-amber-700 text-sm font-medium">
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {recentUsers.length > 0 ? (
              recentUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 flex items-center justify-center">
                      <span className="text-white text-xs font-medium">
                        {user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{user.name || 'Unknown User'}</p>
                      <p className="text-xs text-gray-500">{user.email || 'No email'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">
                      {formatRelativeTime(user.joined)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {user.stats?.totalBookings || 0} {user.stats?.totalBookings === 1 ? 'booking' : 'bookings'}
                    </p>
                    {user.isVerified && (
                      <span className="text-xs text-green-600">✓ Verified</span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                No recent users
              </div>
            )}
          </div>
        </motion.div>

        {/* System Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">System Status</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Server Status</span>
              <span className={`flex items-center text-sm ${
                systemStatus?.server?.status === 'online' ? 'text-green-600' : 'text-red-600'
              }`}>
                <CheckCircle className="w-4 h-4 mr-1" />
                {systemStatus?.server?.status || 'Unknown'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Uptime</span>
              <span className="text-sm text-gray-900">{systemStatus?.server?.uptime || 'N/A'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Database</span>
              <span className={`flex items-center text-sm ${
                systemStatus?.database?.status === 'connected' ? 'text-green-600' : 'text-red-600'
              }`}>
                <CheckCircle className="w-4 h-4 mr-1" />
                {systemStatus?.database?.status || 'Unknown'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">DB Latency</span>
              <span className="text-sm text-gray-900">
                {systemStatus?.database?.latency ? `${systemStatus.database.latency}ms` : 'N/A'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Last Backup</span>
              <span className="text-sm text-gray-900">
                {systemStatus?.database?.lastBackup 
                  ? formatRelativeTime(systemStatus.database.lastBackup)
                  : 'N/A'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Storage Used</span>
              <span className="text-sm text-gray-900">{systemStatus?.system?.storageUsed || 0}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Active Sessions</span>
              <span className="text-sm text-gray-900">{systemStatus?.system?.activeSessions || 0}</span>
            </div>
          </div>

          {/* Completion Rate */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Booking Completion Rate</span>
              <span className="text-sm font-medium text-gray-900">{stats?.completionRate?.toFixed(1) || 0}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full"
                style={{ width: `${stats?.completionRate || 0}%` }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}