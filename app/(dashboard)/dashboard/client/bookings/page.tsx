"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Eye,
  Star,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  Loader2,
  AlertCircle,
  Mountain,
  Clock,
  CheckCircle,
  AlertTriangle
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import Swal from "sweetalert2";

interface Booking {
  id: string;
  _id: string;
  bookingId: string;
  bookingNumber?: string;
  tour: {
    id: string;
    name: string;
    type: string;
    image?: string;
    duration?: string;
    difficulty?: string;
    highlights?: string[];
  };
  destination?: {
    name: string;
    image?: string;
    location?: string;
  };
  date: string;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  paymentStatus: 'paid' | 'pending' | 'failed';
  participants: number;
  totalPrice?: number;
  guide?: {
    name: string;
    avatar?: string;
    rating?: number;
    phone?: string;
    email?: string;
  };
  specialRequests?: string;
  createdAt: string;
  updatedAt: string;
}

interface BookingsResponse {
  success: boolean;
  data: Booking[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export default function ClientBookingsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [activeFilter, setActiveFilter] = useState<'all' | 'upcoming' | 'past' | 'cancelled'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1
  });
  const [stats, setStats] = useState({
    total: 0,
    upcoming: 0,
    completed: 0,
    cancelled: 0,
    totalSpent: 0
  });

  // Fetch bookings
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/client/bookings?page=${pagination.page}&limit=${pagination.limit}`);
        const data: BookingsResponse = await response.json();
        
        if (data.success) {
          setBookings(data.data);
          setFilteredBookings(data.data);
          setPagination(data.pagination);
          
          // Calculate stats
          const now = new Date();
          const upcoming = data.data.filter(b => 
            new Date(b.date) > now && b.status !== 'cancelled' && b.status !== 'completed'
          ).length;
          const completed = data.data.filter(b => b.status === 'completed').length;
          const cancelled = data.data.filter(b => b.status === 'cancelled').length;
          const totalSpent = data.data.reduce((acc, b) => acc + (b.totalPrice || 0), 0);
          
          setStats({
            total: data.data.length,
            upcoming,
            completed,
            cancelled,
            totalSpent
          });
        }
      } catch (error) {
        console.error('Error fetching bookings:', error);
        Swal.fire({
          title: 'Error',
          text: 'Failed to load bookings',
          icon: 'error',
          confirmButtonColor: '#B88A3D'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [pagination.page, pagination.limit]);

  // Filter bookings based on active filter and search
  useEffect(() => {
    let filtered = [...bookings];
    const now = new Date();

    // Apply status filter
    switch (activeFilter) {
      case 'upcoming':
        filtered = filtered.filter(b => 
          new Date(b.date) > now && b.status !== 'cancelled' && b.status !== 'completed'
        );
        break;
      case 'past':
        filtered = filtered.filter(b => 
          new Date(b.date) <= now || b.status === 'completed'
        );
        break;
      case 'cancelled':
        filtered = filtered.filter(b => b.status === 'cancelled');
        break;
      default:
        break;
    }

    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(b => 
        b.tour.name.toLowerCase().includes(term) ||
        b.bookingId.toLowerCase().includes(term) ||
        b.destination?.name?.toLowerCase().includes(term) ||
        b.guide?.name?.toLowerCase().includes(term)
      );
    }

    setFilteredBookings(filtered);
  }, [activeFilter, searchTerm, bookings]);

  const handleCancelBooking = async (bookingId: string) => {
    const result = await Swal.fire({
      title: 'Cancel Booking',
      text: 'Are you sure you want to cancel this booking?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, cancel'
    });
    
    if (result.isConfirmed) {
      try {
        const response = await fetch(`/api/client/bookings/${bookingId}/cancel`, {
          method: 'POST'
        });
        
        if (!response.ok) throw new Error('Failed to cancel booking');
        
        // Refresh bookings
        const refreshResponse = await fetch(`/api/client/bookings?page=${pagination.page}&limit=${pagination.limit}`);
        const refreshData = await refreshResponse.json();
        if (refreshData.success) {
          setBookings(refreshData.data);
        }
        
        Swal.fire({
          title: 'Cancelled',
          text: 'Booking has been cancelled successfully',
          icon: 'success',
          timer: 2000,
          confirmButtonColor: '#B88A3D'
        });
      } catch (error) {
        Swal.fire({
          title: 'Error',
          text: 'Failed to cancel booking',
          icon: 'error',
          confirmButtonColor: '#B88A3D'
        });
      }
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
            <CheckCircle className="w-3 h-3 mr-1" />
            Confirmed
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
            <XCircle className="w-3 h-3 mr-1" />
            Cancelled
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
            <CheckCircle className="w-3 h-3 mr-1" />
            Completed
          </span>
        );
      default:
        return null;
    }
  };

  const getPaymentBadge = (status: string) => {
    switch(status) {
      case 'paid':
        return <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Paid</span>;
      case 'pending':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">Pending</span>;
      case 'failed':
        return <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">Failed</span>;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDifficultyColor = (difficulty?: string) => {
    switch(difficulty?.toLowerCase()) {
      case 'easy':
        return 'text-green-600 bg-green-50';
      case 'moderate':
        return 'text-yellow-600 bg-yellow-50';
      case 'challenging':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-amber-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
        <p className="text-gray-600 mt-1">Manage your tour bookings and reservations</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Bookings</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Upcoming</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.upcoming}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <Clock className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Completed</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.completed}</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <CheckCircle className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

    
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Filter Tabs */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-2 md:pb-0">
              {(['all', 'upcoming', 'past', 'cancelled'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition ${
                    activeFilter === filter
                      ? 'bg-amber-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                  {filter === 'upcoming' && stats.upcoming > 0 && (
                    <span className="ml-2 px-1.5 py-0.5 bg-white/20 rounded-full text-xs">
                      {stats.upcoming}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="flex items-center space-x-2">
              <div className="relative flex-1 md:flex-initial">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search bookings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full md:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <Filter className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Advanced Filters (expandable) */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 bg-gray-50 border-b border-gray-100"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none">
                  <option>All time</option>
                  <option>Last 30 days</option>
                  <option>Last 3 months</option>
                  <option>Last year</option>
                  <option>Custom range</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none">
                  <option>All</option>
                  <option>Paid</option>
                  <option>Pending</option>
                  <option>Failed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none">
                  <option>Date (Newest first)</option>
                  <option>Date (Oldest first)</option>
                  <option>Price (High to low)</option>
                  <option>Price (Low to high)</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}

        {/* Bookings List */}
        <div className="divide-y">
          {filteredBookings.length > 0 ? (
            filteredBookings.map((booking) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-6 hover:bg-gray-50 transition"
              >
                <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                  {/* Tour Image */}
                  <div className="lg:w-48 flex-shrink-0">
                    <div className="relative h-32 lg:h-24 w-full rounded-lg overflow-hidden bg-gray-100">
                      {booking.tour.image ? (
                        <Image
                          src={booking.tour.image}
                          alt={booking.tour.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-500 to-orange-500">
                          <Mountain className="w-8 h-8 text-white" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Booking Details */}
                  <div className="flex-1">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                      <div>
                        {/* Tour Name and ID */}
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{booking.tour.name}</h3>
                          <span className="text-xs text-gray-400">#{booking.bookingId}</span>
                        </div>

                        {/* Destination */}
                        {booking.destination && (
                          <p className="text-sm text-gray-600 mb-3 flex items-center">
                            <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                            {booking.destination.name}
                          </p>
                        )}

                        {/* Key Details Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                          <div>
                            <p className="text-xs text-gray-500">Date</p>
                            <p className="text-sm font-medium text-gray-900">{formatDate(booking.date)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Participants</p>
                            <p className="text-sm font-medium text-gray-900 flex items-center">
                              <Users className="w-3 h-3 mr-1 text-gray-400" />
                              {booking.participants}
                            </p>
                          </div>
                          {booking.totalPrice && (
                            <div>
                              <p className="text-xs text-gray-500">Total Price</p>
                              <p className="text-sm font-medium text-gray-900">${booking.totalPrice}</p>
                            </div>
                          )}
                          {booking.tour.difficulty && (
                            <div>
                              <p className="text-xs text-gray-500">Difficulty</p>
                              <p className={`text-sm font-medium px-2 py-0.5 rounded-full inline-block ${getDifficultyColor(booking.tour.difficulty)}`}>
                                {booking.tour.difficulty}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Guide Info */}
                        {booking.guide && (
                          <div className="flex items-center space-x-3 text-sm bg-gray-50 p-2 rounded-lg inline-block">
                            <span className="text-gray-500">Guide:</span>
                            <span className="font-medium text-gray-900">{booking.guide.name}</span>
                            {booking.guide.rating && (
                              <span className="flex items-center text-amber-500">
                                <Star className="w-3 h-3 fill-current mr-1" />
                                {booking.guide.rating}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Status and Actions */}
                      <div className="flex flex-col items-end gap-3">
                        <div className="flex items-center gap-2">
                          {getStatusBadge(booking.status)}
                          {getPaymentBadge(booking.paymentStatus)}
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Link
                            href={`/dashboard/client/bookings/${booking.id}`}
                            className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition text-sm flex items-center"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </Link>
                          
                          {booking.status === 'confirmed' && (
                            <button
                              onClick={() => handleCancelBooking(booking.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                              title="Cancel Booking"
                            >
                              <XCircle className="w-5 h-5" />
                            </button>
                          )}
                          
                          {booking.status === 'completed' && (
                            <Link
                              href={`/dashboard/client/reviews/new?booking=${booking.id}`}
                              className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition"
                              title="Write Review"
                            >
                              <Star className="w-5 h-5" />
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Special Requests */}
                    {booking.specialRequests && (
                      <div className="mt-4 p-3 bg-amber-50 rounded-lg">
                        <p className="text-xs font-medium text-amber-700 mb-1">Special Requests:</p>
                        <p className="text-sm text-amber-600">{booking.specialRequests}</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="p-12 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
              <p className="text-gray-500 mb-6">
                {searchTerm 
                  ? "No bookings match your search criteria" 
                  : activeFilter !== 'all' 
                    ? `You don't have any ${activeFilter} bookings` 
                    : "You haven't made any bookings yet"}
              </p>
              <Link
                href="/tours"
                className="inline-flex items-center px-6 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition"
              >
                Explore Tours
              </Link>
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Showing page {pagination.page} of {pagination.pages}
            </p>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                disabled={pagination.page === 1}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="px-4 py-2 bg-amber-50 text-amber-600 rounded-lg">
                {pagination.page}
              </span>
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                disabled={pagination.page === pagination.pages}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}