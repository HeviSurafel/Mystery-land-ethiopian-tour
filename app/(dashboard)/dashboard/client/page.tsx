"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  // Navigation Icons
  LayoutDashboard,
  Calendar,
  Heart,
  User,
  LogOut,
  Menu,
  X,
  
  // Stats Icons
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
  
  // Action Icons
  Eye,
  Star,
  
  // Status Icons
  Loader2,
  AlertCircle,
  ChevronRight,
  
  // User Icons
  Mail,
  Phone,
  Globe,
  
  // Tour Icons
  Mountain,
  Users,
  DollarSign,
  
  // Utility Icons
  Edit,
  Trash2,
  Compass
} from "lucide-react";

import Swal from "sweetalert2";
import { useAuth } from "@/contexts/AuthContext";
import { StatsCard } from "@/components/dashboard/StatsCard";

// Import components (you'll need to create these)

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
  };
  destination?: {
    name: string;
    image?: string;
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
  };
}

interface WishlistItem {
  id: string;
  tourId: string;
  tourName: string;
  tourImage?: string;
  tourDuration?: string;
  tourDifficulty?: string;
  destination?: string;
  price?: number;
  addedAt: string;
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  country?: string;
  memberSince: string;
  totalBookings: number;
  totalSpent: number;
  reviews: number;
}

export default function ClientDashboard() {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'wishlist' | 'profile'>('overview');
  const [mounted, setMounted] = useState(false);
  
  // Data states
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [upcomingBookings, setUpcomingBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState({
    totalBookings: 0,
    upcoming: 0,
    completed: 0,
    cancelled: 0,
    totalSpent: 0,
    wishlistCount: 0
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch client data
  useEffect(() => {
    const fetchClientData = async () => {
      if (!mounted) return;
      
      try {
        setLoading(true);
        
        // Fetch profile
        const profileRes = await fetch('http://localhost:3000/api/client/profile');
        const profileData = await profileRes.json();
        if (profileData.success) {
          setProfile(profileData.data);
        }
        
        // Fetch bookings
        const bookingsRes = await fetch('http://localhost:3000/api/client/bookings');
        const bookingsData = await bookingsRes.json();
        if (bookingsData.success) {
          setBookings(bookingsData.data);
          
          // Separate upcoming and past bookings
          const now = new Date();
          const upcoming = bookingsData.data.filter((b: Booking) => 
            new Date(b.date) > now && b.status !== 'cancelled' && b.status !== 'completed'
          );
          
          setUpcomingBookings(upcoming);
          
          // Calculate stats
          setStats({
            totalBookings: bookingsData.data.length,
            upcoming: upcoming.length,
            completed: bookingsData.data.filter((b: Booking) => b.status === 'completed').length,
            cancelled: bookingsData.data.filter((b: Booking) => b.status === 'cancelled').length,
            totalSpent: bookingsData.data.reduce((acc: number, b: Booking) => acc + (b.totalPrice || 0), 0),
            wishlistCount: wishlist.length
          });
        }
        
        // Fetch wishlist
        const wishlistRes = await fetch('http://localhost:3000/api/client/wishlist');
        const wishlistData = await wishlistRes.json();
        if (wishlistData.success) {
          setWishlist(wishlistData.data);
          setStats(prev => ({ ...prev, wishlistCount: wishlistData.data.length }));
        }
        
      } catch (error) {
        console.error('Error fetching client data:', error);
        Swal.fire({
          title: 'Error',
          text: 'Failed to load dashboard data',
          icon: 'error',
          confirmButtonColor: '#B88A3D'
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchClientData();
  }, [mounted, wishlist.length]);

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: 'Logout',
      text: 'Are you sure you want to logout?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#B88A3D',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, logout'
    });
    
    if (result.isConfirmed) {
      await logout();
      window.location.href = '/';
    }
  };

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
        
        // Refresh data
        window.location.reload();
        
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

  const handleRemoveFromWishlist = async (itemId: string) => {
    try {
      const response = await fetch(`/api/client/wishlist/${itemId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) throw new Error('Failed to remove from wishlist');
      
      setWishlist(wishlist.filter(item => item.id !== itemId));
      setStats(prev => ({ ...prev, wishlistCount: prev.wishlistCount - 1 }));
      
      Swal.fire({
        title: 'Removed',
        text: 'Item removed from wishlist',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      });
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: 'Failed to remove item',
        icon: 'error',
        confirmButtonColor: '#B88A3D'
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'confirmed':
        return <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Confirmed</span>;
      case 'pending':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">Pending</span>;
      case 'cancelled':
        return <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">Cancelled</span>;
      case 'completed':
        return <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">Completed</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">{status}</span>;
    }
  };

  const getPaymentBadge = (status: string) => {
    switch(status) {
      case 'paid':
        return <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Paid</span>;
      case 'pending':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">Payment Pending</span>;
      case 'failed':
        return <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">Payment Failed</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">{status}</span>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!mounted || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-amber-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
   

      {/* Main Content */}
      <div
       
      >
    
        <main className="p-4 lg:p-8">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard
                  title="Total Bookings"
                  value={stats.totalBookings}
                  icon={Calendar}
                  color="blue"
                />
                <StatsCard
                  title="Upcoming Tours"
                  value={stats.upcoming}
                  icon={TrendingUp}
                  color="green"
                />
                <StatsCard
                  title="Completed"
                  value={stats.completed}
                  icon={CheckCircle}
                  color="purple"
                />
               
              </div>

              {/* Upcoming Bookings */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Upcoming Adventures</h2>
                  <button
                    onClick={() => setActiveTab('bookings')}
                    className="text-sm text-amber-600 hover:text-amber-700 font-medium flex items-center"
                  >
                    View All
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                </div>

                {upcomingBookings.length > 0 ? (
                  <div className="divide-y">
                    {upcomingBookings.slice(0, 3).map((booking) => (
                      <div key={booking.id} className="p-6 hover:bg-gray-50 transition">
                        <div className="flex items-start space-x-4">
                          <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                            {booking.tour.image ? (
                              <Image
                                src={booking.tour.image}
                                alt={booking.tour.name}
                                width={64}
                                height={64}
                                className="object-cover w-full h-full"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-500 to-orange-500">
                                <Mountain className="w-6 h-6 text-white" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-medium text-gray-900">{booking.tour.name}</h3>
                                <p className="text-sm text-gray-500 mt-1 flex items-center">
                                  <Calendar className="w-4 h-4 mr-1" />
                                  {formatDate(booking.date)}
                                </p>
                                <div className="flex items-center mt-2 space-x-2">
                                  {getStatusBadge(booking.status)}
                                  {getPaymentBadge(booking.paymentStatus)}
                                </div>
                              </div>
                              <Link
                                href={`/dashboard/client/bookings/${booking.id}`}
                                className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition"
                              >
                                <Eye className="w-5 h-5" />
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-12 text-center">
                    <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 mb-2">No upcoming bookings</p>
                    <Link
                      href="/tours"
                      className="inline-flex items-center px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition"
                    >
                      <Compass className="w-4 h-4 mr-2" />
                      Explore Tours
                    </Link>
                  </div>
                )}
              </div>

              {/* Wishlist Preview */}
              {wishlist.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">Your Wishlist</h2>
                    <button
                      onClick={() => setActiveTab('wishlist')}
                      className="text-sm text-amber-600 hover:text-amber-700 font-medium flex items-center"
                    >
                      View All
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
                    {wishlist.slice(0, 3).map((item) => (
                      <div key={item.id} className="bg-gray-50 rounded-lg p-4 flex items-start space-x-3">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                          {item.tourImage ? (
                            <Image
                              src={item.tourImage}
                              alt={item.tourName}
                              width={48}
                              height={48}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-amber-100">
                              <Heart className="w-4 h-4 text-amber-500" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 truncate">{item.tourName}</h4>
                          <p className="text-xs text-gray-500 mt-1">{item.tourDuration}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Bookings Tab */}
          {activeTab === 'bookings' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="border-b border-gray-200">
                  <nav className="flex space-x-8 px-6" aria-label="Tabs">
                    {['All Bookings', 'Upcoming', 'Past', 'Cancelled'].map((tab, index) => (
                      <button
                        key={tab}
                        onClick={() => {/* Handle tab filtering */}}
                        className={`py-4 px-1 border-b-2 font-medium text-sm transition ${
                          index === 0 
                            ? 'border-amber-500 text-amber-600' 
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </nav>
                </div>

                <div className="divide-y">
                  {bookings.length > 0 ? (
                    bookings.map((booking) => (
                      <div key={booking.id} className="p-6 hover:bg-gray-50 transition">
                        <div className="flex items-start space-x-4">
                          <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                            {booking.tour.image ? (
                              <Image
                                src={booking.tour.image}
                                alt={booking.tour.name}
                                width={80}
                                height={80}
                                className="object-cover w-full h-full"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-500 to-orange-500">
                                <Mountain className="w-8 h-8 text-white" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-semibold text-gray-900">{booking.tour.name}</h3>
                                <div className="grid grid-cols-2 gap-4 mt-3">
                                  <div className="text-sm">
                                    <span className="text-gray-500">Date:</span>
                                    <p className="font-medium text-gray-900">{formatDate(booking.date)}</p>
                                  </div>
                                  <div className="text-sm">
                                    <span className="text-gray-500">Participants:</span>
                                    <p className="font-medium text-gray-900">{booking.participants} people</p>
                                  </div>
                                  {booking.totalPrice && (
                                    <div className="text-sm">
                                      <span className="text-gray-500">Total:</span>
                                      <p className="font-medium text-gray-900">${booking.totalPrice}</p>
                                    </div>
                                  )}
                                </div>
                                <div className="flex items-center mt-3 space-x-2">
                                  {getStatusBadge(booking.status)}
                                  {getPaymentBadge(booking.paymentStatus)}
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Link
                                  href={`/dashboard/client/bookings/${booking.id}`}
                                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                  title="View Details"
                                >
                                  <Eye className="w-5 h-5" />
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
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-12 text-center">
                      <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings yet</h3>
                      <p className="text-gray-500 mb-4">Start your Ethiopian adventure today!</p>
                      <Link
                        href="/tours"
                        className="inline-flex items-center px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition"
                      >
                        <Compass className="w-4 h-4 mr-2" />
                        Browse Tours
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Wishlist Tab */}
          {activeTab === 'wishlist' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              {wishlist.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                  {wishlist.map((item) => (
                    <div key={item.id} className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
                      <div className="relative h-40 bg-gray-200">
                        {item.tourImage ? (
                          <Image
                            src={item.tourImage}
                            alt={item.tourName}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-500 to-orange-500">
                            <Heart className="w-8 h-8 text-white" />
                          </div>
                        )}
                        <button
                          onClick={() => handleRemoveFromWishlist(item.id)}
                          className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-md hover:bg-red-50 transition"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-1">{item.tourName}</h3>
                        <p className="text-sm text-gray-600 mb-2">{item.destination}</p>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">{item.tourDuration}</span>
                          <span className="font-medium text-amber-600">${item.price}</span>
                        </div>
                        <div className="mt-4 flex space-x-2">
                          <Link
                            href={`/tours/${item.tourId}`}
                            className="flex-1 text-center px-3 py-2 bg-amber-500 text-white rounded-lg text-sm hover:bg-amber-600 transition"
                          >
                            View Tour
                          </Link>
                          <Link
                            href={`/book/${item.tourId}`}
                            className="flex-1 text-center px-3 py-2 border border-amber-500 text-amber-600 rounded-lg text-sm hover:bg-amber-50 transition"
                          >
                            Book Now
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center">
                  <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Your wishlist is empty</h3>
                  <p className="text-gray-500 mb-4">Save tours you're interested in for later</p>
                  <Link
                    href="/tours"
                    className="inline-flex items-center px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition"
                  >
                    <Compass className="w-4 h-4 mr-2" />
                    Explore Tours
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Profile Info */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-6 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                          <User className="w-5 h-5 text-gray-400" />
                          <span className="text-gray-900">{profile?.name || user?.name}</span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                          <Mail className="w-5 h-5 text-gray-400" />
                          <span className="text-gray-900">{profile?.email || user?.email}</span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                          <Phone className="w-5 h-5 text-gray-400" />
                          <span className="text-gray-900">{profile?.phone || 'Not provided'}</span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                        <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                          <Globe className="w-5 h-5 text-gray-400" />
                          <span className="text-gray-900">{profile?.country || 'Not provided'}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <button className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition flex items-center space-x-2">
                        <Edit className="w-4 h-4" />
                        <span>Edit Profile</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-6 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900">Account Statistics</h2>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-gray-900">{stats.totalBookings}</p>
                        <p className="text-sm text-gray-500">Total Bookings</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
                        <p className="text-sm text-gray-500">Completed</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-gray-900">{profile?.reviews || 0}</p>
                        <p className="text-sm text-gray-500">Reviews</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-6 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900">Profile Picture</h2>
                  </div>
                  <div className="p-6 text-center">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 mx-auto mb-4 flex items-center justify-center">
                      {profile?.avatar ? (
                        <Image
                          src={profile.avatar}
                          alt={profile.name}
                          width={128}
                          height={128}
                          className="rounded-full object-cover w-full h-full"
                        />
                      ) : (
                        <span className="text-4xl font-bold text-white">
                          {profile?.name?.charAt(0) || user?.name?.charAt(0) || 'U'}
                        </span>
                      )}
                    </div>
                    <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition text-sm">
                      Change Photo
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-6 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900">Security</h2>
                  </div>
                  <div className="p-6 space-y-3">
                    <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition flex items-center justify-between">
                      <span className="text-sm font-medium">Change Password</span>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </button>
                    <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition flex items-center justify-between">
                      <span className="text-sm font-medium">Two-Factor Authentication</span>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </button>
                    <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition flex items-center justify-between">
                      <span className="text-sm font-medium">Privacy Settings</span>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}