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
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  Download,
  Eye,
  Edit,
  Trash2,
  MessageCircle,
  FileText,
  Home,
  Star,
  User,
  Phone,
  Mail,
  AlertTriangle,
  Loader2,
  CreditCard,
  CalendarCheck,
  CalendarX,
  CalendarClock,
  ArrowUpDown,
  FilterX,
  Receipt,
  Printer,
  Send,
  Ban,
  Check,
  Plus,
  Compass,
  Globe,
  Hotel,
  Utensils
} from "lucide-react";
import Swal from "sweetalert2";
import { useAuth } from "@/contexts/AuthContext";

interface Booking {
  id: string;
  _id: string;
  bookingId: string;
  bookingNumber?: string;
  client: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  tour: {
    id: string;
    name: string;
    type: string;
    image?: string;
    duration?: string;
    difficulty?: string;
  };
  destination?: {
    _id: string;
    name: string;
    images?: string[];
  };
  date: string;
  travelDate?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed';
  createdAt: string;
  updatedAt: string;
  participants: number;
  numberOfPeople?: number;
  notes?: string;
  specialRequests?: string;
  totalPrice?: number;
  travelers?: Array<{
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
  }>;
  emergencyContact?: {
    name: string;
    phone: string;
    email?: string;
  };
}

interface BookingsResponse {
  success: boolean;
  data: Booking[];
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
    pending: number;
    confirmed: number;
    completed: number;
    cancelled: number;
    totalRevenue?: number;
    averageBookingValue?: number;
    occupancyRate?: number;
  };
}

const bookingStatuses = [
  "all",
  "pending",
  "confirmed",
  "completed",
  "cancelled"
];

const paymentStatuses = [
  "all",
  "pending",
  "paid",
  "failed"
];

const sortOptions = [
  { value: "createdAt", label: "Booking Date" },
  { value: "travelDate.start", label: "Travel Date" },
  { value: "numberOfTravelers.adults", label: "Participants" }
];

export default function AdminBookingsPage() {
  const { user: currentUser } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: "",
    end: ""
  });
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedBookings, setSelectedBookings] = useState<string[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1,
    hasNextPage: false,
    hasPrevPage: false
  });

  // Fetch bookings
  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(paymentFilter !== 'all' && { paymentStatus: paymentFilter }),
        ...(dateRange.start && { startDate: dateRange.start }),
        ...(dateRange.end && { endDate: dateRange.end }),
        ...(searchTerm && { search: searchTerm }),
        sortBy,
        sortOrder
      });

      const response = await fetch(`/api/admin/bookings?${params}`);

      if (!response.ok) {
        throw new Error('Failed to fetch bookings');
      }

      const data: BookingsResponse = await response.json();
      
      if (data.success) {
        setBookings(data.data);
        setStats(data.stats);
        setPagination(data.pagination);
      }
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [pagination.page, statusFilter, paymentFilter, dateRange.start, dateRange.end, sortBy, sortOrder]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (pagination.page === 1) {
        fetchBookings();
      } else {
        setPagination(prev => ({ ...prev, page: 1 }));
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Update booking status
  const handleUpdateStatus = async (bookingId: string, newStatus: string) => {
    const statusLabels: { [key: string]: string } = {
      pending: "Pending",
      confirmed: "Confirmed",
      completed: "Completed",
      cancelled: "Cancelled"
    };

    // If cancelling, ask for reason
    if (newStatus === 'cancelled') {
      const { value: reason } = await Swal.fire({
        title: 'Cancel Booking',
        input: 'textarea',
        inputLabel: 'Cancellation Reason',
        inputPlaceholder: 'Enter reason for cancellation...',
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: 'Cancel Booking',
        inputValidator: (value) => {
          if (!value) {
            return 'You need to provide a reason!';
          }
        }
      });

      if (!reason) return;

      try {
        const response = await fetch(`/api/admin/bookings/${bookingId}/status`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            status: newStatus,
            reason 
          })
        });

        if (!response.ok) {
          throw new Error('Failed to update booking status');
        }

        await fetchBookings();
        
        Swal.fire({
          title: "Status Updated",
          text: `Booking has been marked as ${statusLabels[newStatus]}`,
          icon: "success",
          timer: 2000,
          confirmButtonColor: "#B88A3D"
        });
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: "Failed to update booking status",
          icon: "error",
          confirmButtonColor: "#B88A3D"
        });
      }
      return;
    }

    // For other status updates
    const result = await Swal.fire({
      title: `Update Booking Status`,
      text: `Are you sure you want to mark this booking as ${statusLabels[newStatus]}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#B88A3D",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, update status"
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`/api/admin/bookings/${bookingId}/status`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: newStatus })
        });

        if (!response.ok) {
          throw new Error('Failed to update booking status');
        }

        await fetchBookings();
        
        Swal.fire({
          title: "Status Updated",
          text: `Booking has been marked as ${statusLabels[newStatus]}`,
          icon: "success",
          timer: 2000,
          confirmButtonColor: "#B88A3D"
        });
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: "Failed to update booking status",
          icon: "error",
          confirmButtonColor: "#B88A3D"
        });
      }
    }
  };

  // Update payment status
  const handleUpdatePayment = async (bookingId: string, newStatus: string) => {
    const paymentLabels: { [key: string]: string } = {
      pending: "Pending",
      paid: "Paid",
      failed: "Failed"
    };

    const result = await Swal.fire({
      title: `Update Payment Status`,
      text: `Are you sure you want to mark payment as ${paymentLabels[newStatus]}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#B88A3D",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, update payment"
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`/api/admin/bookings/${bookingId}/payment`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ paymentStatus: newStatus })
        });

        if (!response.ok) {
          throw new Error('Failed to update payment status');
        }

        await fetchBookings();
        
        Swal.fire({
          title: "Payment Updated",
          text: `Payment status has been updated to ${paymentLabels[newStatus]}`,
          icon: "success",
          timer: 2000,
          confirmButtonColor: "#B88A3D"
        });
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: "Failed to update payment status",
          icon: "error",
          confirmButtonColor: "#B88A3D"
        });
      }
    }
  };

  // Send reminder to client
  const handleSendReminder = async (bookingId: string) => {
    const result = await Swal.fire({
      title: `Send Reminder to Client`,
      text: `This will send a reminder about the upcoming booking.`,
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#B88A3D",
      cancelButtonColor: "#d33",
      confirmButtonText: "Send Reminder"
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`/api/admin/bookings/${bookingId}/reminder`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ type: 'client' })
        });

        if (!response.ok) {
          throw new Error('Failed to send reminder');
        }

        Swal.fire({
          title: "Reminder Sent",
          text: `Reminder has been sent to the client`,
          icon: "success",
          timer: 2000,
          confirmButtonColor: "#B88A3D"
        });
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: "Failed to send reminder",
          icon: "error",
          confirmButtonColor: "#B88A3D"
        });
      }
    }
  };

  // Delete booking
  const handleDeleteBooking = async (bookingId: string) => {
    const result = await Swal.fire({
      title: "Delete Booking",
      text: "Are you sure you want to delete this booking? This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete booking"
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`/api/admin/bookings/${bookingId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to delete booking');
        }

        await fetchBookings();
        
        Swal.fire({
          title: "Booking Deleted",
          text: "Booking has been deleted successfully",
          icon: "success",
          timer: 2000,
          confirmButtonColor: "#B88A3D"
        });
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: "Failed to delete booking",
          icon: "error",
          confirmButtonColor: "#B88A3D"
        });
      }
    }
  };

  // Bulk update status
  const handleBulkStatusUpdate = async (newStatus: string) => {
    if (selectedBookings.length === 0) return;

    const statusLabels: { [key: string]: string } = {
      pending: "Pending",
      confirmed: "Confirmed",
      completed: "Completed",
      cancelled: "Cancelled"
    };

    const result = await Swal.fire({
      title: `Update ${selectedBookings.length} Bookings`,
      text: `Are you sure you want to mark ${selectedBookings.length} bookings as ${statusLabels[newStatus]}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#B88A3D",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, update"
    });

    if (result.isConfirmed) {
      try {
        // Process one by one or use bulk endpoint
        await Promise.all(
          selectedBookings.map(id => 
            fetch(`/api/admin/bookings/${id}/status`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ status: newStatus })
            })
          )
        );

        await fetchBookings();
        setSelectedBookings([]);
        
        Swal.fire({
          title: "Updated",
          text: `${selectedBookings.length} bookings have been updated.`,
          icon: "success",
          timer: 2000,
          confirmButtonColor: "#B88A3D"
        });
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: "Failed to update bookings",
          icon: "error",
          confirmButtonColor: "#B88A3D"
        });
      }
    }
  };

  // Export bookings
  const handleExportBookings = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/admin/bookings/export', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to export bookings');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bookings_export_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      Swal.fire({
        title: "Export Started",
        text: "Bookings data export has been initiated",
        icon: "success",
        timer: 2000,
        confirmButtonColor: "#B88A3D"
      });
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Failed to export bookings",
        icon: "error",
        confirmButtonColor: "#B88A3D"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'confirmed': return 'bg-green-100 text-green-700 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'completed': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getPaymentColor = (status: string) => {
    switch(status) {
      case 'paid': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'failed': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'confirmed': return CheckCircle;
      case 'pending': return Clock;
      case 'completed': return CheckCircle;
      case 'cancelled': return XCircle;
      default: return Clock;
    }
  };

  const getTourTypeIcon = (type: string) => {
    switch(type?.toLowerCase()) {
      case 'hiking': return Compass;
      case 'city': return Home;
      case 'beach': return Globe;
      default: return Compass;
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const StatCard = ({ title, value, icon: Icon, color }: any) => (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            {value}
          </p>
        </div>
        <div className={`p-3 rounded-lg bg-${color}-50`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
      </div>
    </div>
  );

  if (loading && !bookings.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-amber-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Booking Management</h1>
          <p className="text-gray-600 mt-1">Manage all tour bookings and schedules</p>
        </div>
        <div className="flex items-center space-x-3 mt-4 md:mt-0">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg relative"
            title="Toggle filters"
          >
            <Filter className="w-5 h-5" />
            {(statusFilter !== 'all' || paymentFilter !== 'all' || dateRange.start || dateRange.end) && (
              <span className="absolute top-0 right-0 w-2 h-2 bg-amber-500 rounded-full"></span>
            )}
          </button>
          <button
            onClick={handleExportBookings}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            title="Export bookings"
          >
            <Download className="w-5 h-5" />
          </button>
          <button
            onClick={fetchBookings}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            title="Refresh"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
          <Link
            href="/dashboard/admin/bookings/create"
            className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Booking</span>
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
            onClick={fetchBookings}
            className="px-3 py-1 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
          >
            Retry
          </button>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatCard title="Total Bookings" value={stats.total} icon={Calendar} color="blue" />
        <StatCard title="Pending" value={stats.pending} icon={Clock} color="yellow" />
        <StatCard title="Confirmed" value={stats.confirmed} icon={CheckCircle} color="green" />
        <StatCard title="Completed" value={stats.completed} icon={CheckCircle} color="blue" />
        <StatCard title="Cancelled" value={stats.cancelled} icon={XCircle} color="red" />
      </div>

      {/* Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-xl shadow-sm p-6 overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Booking ID, client name, tour name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Booking Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none bg-white"
                >
                  {bookingStatuses.map(status => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Status
                </label>
                <select
                  value={paymentFilter}
                  onChange={(e) => setPaymentFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none bg-white"
                >
                  {paymentStatuses.map(status => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Travel Date From
                </label>
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Travel Date To
                </label>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            <div className="flex justify-between items-center mt-6 pt-4 border-t">
              <div className="flex items-center space-x-4">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:ring-1 focus:ring-amber-500 outline-none"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      Sort by: {option.label}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-900"
                >
                  <ArrowUpDown className="w-4 h-4" />
                  <span>{sortOrder === 'asc' ? 'Ascending' : 'Descending'}</span>
                </button>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("all");
                    setPaymentFilter("all");
                    setDateRange({ start: "", end: "" });
                    setSortBy("createdAt");
                    setSortOrder("desc");
                  }}
                  className="flex items-center space-x-1 text-sm text-amber-600 hover:text-amber-700"
                >
                  <FilterX className="w-4 h-4" />
                  <span>Clear Filters</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bulk Actions */}
      {selectedBookings.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-amber-50 rounded-xl p-4 flex items-center justify-between"
        >
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-amber-700">
              {selectedBookings.length} bookings selected
            </span>
            <button
              onClick={() => setSelectedBookings([])}
              className="text-sm text-amber-600 hover:text-amber-700"
            >
              Clear
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleBulkStatusUpdate("confirmed")}
              className="px-3 py-1 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 transition"
            >
              Confirm Selected
            </button>
            <button
              onClick={() => handleBulkStatusUpdate("completed")}
              className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition"
            >
              Mark Completed
            </button>
            <button
              onClick={() => handleBulkStatusUpdate("cancelled")}
              className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition"
            >
              Cancel Selected
            </button>
          </div>
        </motion.div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
        </div>
      )}

      {/* Bookings Table */}
      {!loading && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr className="text-left text-sm text-gray-500">
                  <th className="px-6 py-4 font-medium">
                    <input
                      type="checkbox"
                      checked={selectedBookings.length === bookings.length && bookings.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedBookings(bookings.map(b => b.id || b._id));
                        } else {
                          setSelectedBookings([]);
                        }
                      }}
                      className="w-4 h-4 text-amber-500 rounded border-gray-300 focus:ring-amber-500"
                    />
                  </th>
                  <th className="px-6 py-4 font-medium">Booking ID</th>
                  <th className="px-6 py-4 font-medium">Tour</th>
                  <th className="px-6 py-4 font-medium">Client</th>
                  <th className="px-6 py-4 font-medium">Travel Date</th>
                  <th className="px-6 py-4 font-medium">Participants</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Payment</th>
                  <th className="px-6 py-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {bookings.map((booking, index) => {
                  const StatusIcon = getStatusIcon(booking.status);
                  const TourIcon = getTourTypeIcon(booking.tour?.type);
                  const displayId = booking.bookingNumber || booking.bookingId || booking.id;
                  const travelDate = booking.travelDate || booking.date;
                  const participants = booking.numberOfPeople || booking.participants;
                  const destinationName = booking.destination?.name || 'Unknown Destination';
                  
                  return (
                    <motion.tr
                      key={booking.id || booking._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.02 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedBookings.includes(booking.id || booking._id)}
                          onChange={(e) => {
                            const bookingKey = booking.id || booking._id;
                            if (e.target.checked) {
                              setSelectedBookings([...selectedBookings, bookingKey]);
                            } else {
                              setSelectedBookings(selectedBookings.filter(id => id !== bookingKey));
                            }
                          }}
                          className="w-4 h-4 text-amber-500 rounded border-gray-300 focus:ring-amber-500"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <Link 
                          href={`/dashboard/admin/bookings/${booking.id || booking._id}`}
                          className="font-mono text-sm text-amber-600 hover:text-amber-700 font-medium"
                        >
                          #{displayId}
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-amber-50 rounded-lg">
                            <TourIcon className="w-4 h-4 text-amber-600" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{booking.tour?.name || 'Unknown Tour'}</div>
                            <div className="text-xs text-gray-500 flex items-center mt-1">
                              <MapPin className="w-3 h-3 mr-1" />
                              {destinationName}
                            </div>
                            <div className="text-xs text-gray-500">
                              {booking.tour?.type || 'Standard'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                            {booking.client?.avatar ? (
                              <Image 
                                src={booking.client.avatar} 
                                alt={booking.client.name} 
                                width={32} 
                                height={32} 
                                className="object-cover" 
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-500 to-orange-500">
                                <span className="text-xs font-bold text-white">
                                  {booking.client?.name?.charAt(0) || '?'}
                                </span>
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {booking.client?.name || 'Unknown Client'}
                            </div>
                            <div className="text-xs text-gray-500">
                              {booking.client?.email || 'No email'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-sm">
                            {formatDate(travelDate)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <Users className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-sm font-medium">{participants || 1}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={booking.status}
                          onChange={(e) => handleUpdateStatus(booking.id || booking._id, e.target.value)}
                          className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(booking.status)} focus:ring-1 focus:ring-amber-500 outline-none`}
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={booking.paymentStatus}
                          onChange={(e) => handleUpdatePayment(booking.id || booking._id, e.target.value)}
                          className={`text-xs px-2 py-1 rounded-full border ${getPaymentColor(booking.paymentStatus)} focus:ring-1 focus:ring-amber-500 outline-none`}
                        >
                          <option value="pending">Pending</option>
                          <option value="paid">Paid</option>
                          <option value="failed">Failed</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <Link
                            href={`/dashboard/admin/bookings/${booking.id || booking._id}`}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded-lg"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleSendReminder(booking.id || booking._id)}
                            className="p-1 text-green-600 hover:bg-green-50 rounded-lg"
                            title="Send Reminder"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteBooking(booking.id || booking._id)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded-lg"
                            title="Delete Booking"
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

            {bookings.length === 0 && (
              <div className="text-center py-12">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No bookings found</h3>
                <p className="text-gray-500 mt-1">Try adjusting your search or filters</p>
                <Link
                  href="/dashboard/admin/bookings/create"
                  className="inline-flex items-center space-x-2 mt-4 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create New Booking</span>
                </Link>
              </div>
            )}
          </div>
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
            <span className="font-medium">{pagination.total}</span> bookings
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