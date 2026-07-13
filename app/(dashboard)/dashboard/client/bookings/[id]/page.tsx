"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  Clock,
  Star,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  Download,
  Mail,
  Phone,
  User,
  Globe,
  FileText,
  CreditCard,
  Hotel,
  Plane,
  Car,
  Utensils,
  MessageSquare,
  Printer,
  Share2,
  ChevronRight,
  Package,
  CheckSquare,
  XSquare,
  Award,
  Shield,
  Info
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import Swal from "sweetalert2";

interface BookingDetails {
  id: string;
  _id: string;
  bookingNumber: string;
  bookingId: string;
  
  tour: {
    id: string;
    name: string;
    description: string;
    type: string;
    images: string[];
    duration: string;
    difficulty: string;
    highlights: string[];
    inclusions: string[];
    exclusions: string[];
    itinerary: Array<{
      day: number;
      title: string;
      description: string;
      activities: string[];
      accommodation: string;
      meals: string[];
    }>;
  };
  
  destination?: {
    id: string;
    name: string;
    description: string;
    images: string[];
    location?: string;
  };
  
  travelDate: {
    start: string;
    end: string;
  };
  
  numberOfTravelers: {
    adults: number;
    children: number;
    infants: number;
  };
  
  bookingStatus: 'confirmed' | 'pending' | 'cancelled' | 'completed' | 'no-show';
  paymentStatus: 'pending' | 'partial' | 'paid' | 'refunded' | 'cancelled';
  paymentMethod: string;
  
  specialRequests?: string;
  
  travelers: Array<{
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
    nationality?: string;
    passportNumber?: string;
    dietaryRestrictions?: string;
    medicalConditions?: string;
  }>;
  
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
    email?: string;
  };
  
  accommodations: Array<{
    type: string;
    name: string;
    checkIn: string;
    checkOut: string;
    roomType?: string;
    numberOfRooms: number;
  }>;
  
  cancellationPolicy: string;
  
  createdAt: string;
  updatedAt: string;
  
  totalTravelers: number;
  durationDays: number;
}

export default function BookingDetailsPage() {
  const { user } = useAuth();
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'itinerary' | 'travelers' | 'documents'>('overview');

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/client/bookings/${params.id}`);
        const data = await response.json();
        
        if (data.success) {
          setBooking(data.data);
        } else {
          Swal.fire({
            title: 'Error',
            text: data.error || 'Failed to load booking details',
            icon: 'error',
            confirmButtonColor: '#B88A3D'
          });
          router.push('/dashboard/client/bookings');
        }
      } catch (error) {
        console.error('Error fetching booking:', error);
        Swal.fire({
          title: 'Error',
          text: 'Failed to load booking details',
          icon: 'error',
          confirmButtonColor: '#B88A3D'
        });
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchBookingDetails();
    }
  }, [params.id, router]);

  const handleCancelBooking = async () => {
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
        const response = await fetch(`/api/client/bookings/${params.id}/cancel`, {
          method: 'POST'
        });
        
        if (!response.ok) throw new Error('Failed to cancel booking');
        
        // Refresh booking details
        const refreshResponse = await fetch(`/api/client/bookings/${params.id}`);
        const refreshData = await refreshResponse.json();
        if (refreshData.success) {
          setBooking(refreshData.data);
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

  const handleDownloadVoucher = () => {
    if (!booking) return;
    
    const content = `
      BOOKING VOUCHER
      ===============
      
      Booking Reference: ${booking.bookingNumber}
      Booking Date: ${new Date(booking.createdAt).toLocaleDateString()}
      
      TOUR DETAILS
      ------------
      Tour: ${booking.tour.name}
      Duration: ${booking.tour.duration}
      Travel Dates: ${new Date(booking.travelDate.start).toLocaleDateString()} - ${new Date(booking.travelDate.end).toLocaleDateString()}
      
      TRAVELERS
      ---------
      Adults: ${booking.numberOfTravelers.adults}
      Children: ${booking.numberOfTravelers.children}
      Infants: ${booking.numberOfTravelers.infants}
      Total: ${booking.totalTravelers}
      
      CONTACT INFORMATION
      -------------------
      Primary Contact: ${booking.travelers[0]?.firstName} ${booking.travelers[0]?.lastName}
      Email: ${booking.travelers[0]?.email}
      Phone: ${booking.travelers[0]?.phone}
      
      Emergency Contact: ${booking.emergencyContact.name}
      Emergency Phone: ${booking.emergencyContact.phone}
      
      This voucher confirms your booking. Please present it upon check-in.
    `;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `voucher-${booking.bookingNumber}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { color: string, icon: any, text: string }> = {
      confirmed: { 
        color: 'bg-green-100 text-green-700 border-green-200', 
        icon: CheckCircle, 
        text: 'Confirmed' 
      },
      pending: { 
        color: 'bg-yellow-100 text-yellow-700 border-yellow-200', 
        icon: Clock, 
        text: 'Pending' 
      },
      cancelled: { 
        color: 'bg-red-100 text-red-700 border-red-200', 
        icon: XCircle, 
        text: 'Cancelled' 
      },
      completed: { 
        color: 'bg-blue-100 text-blue-700 border-blue-200', 
        icon: CheckCircle, 
        text: 'Completed' 
      },
      'no-show': { 
        color: 'bg-gray-100 text-gray-700 border-gray-200', 
        icon: AlertCircle, 
        text: 'No Show' 
      }
    };
    
    const statusInfo = statusMap[status] || statusMap.pending;
    const Icon = statusInfo.icon;
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${statusInfo.color}`}>
        <Icon className="w-4 h-4 mr-2" />
        {statusInfo.text}
      </span>
    );
  };

  const getPaymentBadge = (status: string) => {
    const statusMap: Record<string, { color: string, icon: any, text: string }> = {
      paid: { color: 'bg-green-100 text-green-700', icon: CheckCircle, text: 'Paid' },
      partial: { color: 'bg-blue-100 text-blue-700', icon: Clock, text: 'Partial' },
      pending: { color: 'bg-yellow-100 text-yellow-700', icon: Clock, text: 'Pending' },
      refunded: { color: 'bg-purple-100 text-purple-700', icon: CheckCircle, text: 'Refunded' },
      cancelled: { color: 'bg-gray-100 text-gray-700', icon: XCircle, text: 'Cancelled' }
    };
    
    const statusInfo = statusMap[status] || statusMap.pending;
    const Icon = statusInfo.icon;
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}>
        <Icon className="w-4 h-4 mr-2" />
        {statusInfo.text}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-amber-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900">Booking not found</h3>
        <Link
          href="/dashboard/client/bookings"
          className="inline-flex items-center mt-4 text-amber-600 hover:text-amber-700"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Bookings
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with back button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-gray-900 transition"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Bookings
        </button>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleDownloadVoucher}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition flex items-center"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Voucher
          </button>
          {booking.bookingStatus === 'confirmed' && (
            <button
              onClick={handleCancelBooking}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center"
            >
              <XCircle className="w-4 h-4 mr-2" />
              Cancel Booking
            </button>
          )}
        </div>
      </div>

      {/* Booking Reference Header */}
      <div className="bg-gradient-to-r from-amber-600 to-amber-700 rounded-xl p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-amber-100 text-sm mb-1">Booking Reference</p>
            <h1 className="text-3xl font-bold">{booking.bookingNumber}</h1>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-3">
            {getStatusBadge(booking.bookingStatus)}
            {getPaymentBadge(booking.paymentStatus)}
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tour Summary Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  {booking.tour.images?.[0] ? (
                    <Image
                      src={booking.tour.images[0]}
                      alt={booking.tour.name}
                      width={96}
                      height={96}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                      <span className="text-white text-2xl font-bold">EQ</span>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{booking.tour.name}</h2>
                  <p className="text-gray-600 mb-4">{booking.tour.description}</p>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-2 text-amber-500" />
                      {booking.tour.duration}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="w-4 h-4 mr-2 text-amber-500" />
                      {booking.destination?.name || 'Ethiopia'}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Award className="w-4 h-4 mr-2 text-amber-500" />
                      {booking.tour.difficulty}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              {[
                { id: 'overview', label: 'Overview', icon: Info },
                { id: 'itinerary', label: 'Itinerary', icon: Calendar },
                { id: 'travelers', label: 'Travelers', icon: Users },
                { id: 'documents', label: 'Documents', icon: FileText }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition ${
                      activeTab === tab.id
                        ? 'border-amber-500 text-amber-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Travel Dates */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-amber-500" />
                    Travel Dates
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">Start Date</p>
                      <p className="font-semibold text-gray-900">{formatDate(booking.travelDate.start)}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">End Date</p>
                      <p className="font-semibold text-gray-900">{formatDate(booking.travelDate.end)}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Duration: {booking.durationDays} days
                  </p>
                </div>

                {/* Tour Highlights */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Star className="w-5 h-5 mr-2 text-amber-500" />
                    Tour Highlights
                  </h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {booking.tour.highlights?.map((highlight, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-600">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Inclusions & Exclusions */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <CheckSquare className="w-5 h-5 mr-2 text-green-500" />
                      What's Included
                    </h3>
                    <ul className="space-y-2">
                      {booking.tour.inclusions?.map((item, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-600">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <XSquare className="w-5 h-5 mr-2 text-red-500" />
                      What's Not Included
                    </h3>
                    <ul className="space-y-2">
                      {booking.tour.exclusions?.map((item, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <XCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-600">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Special Requests */}
                {booking.specialRequests && (
                  <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                    <h3 className="font-semibold text-amber-800 mb-2">Special Requests</h3>
                    <p className="text-amber-700">{booking.specialRequests}</p>
                  </div>
                )}
              </div>
            )}

            {/* Itinerary Tab */}
            {activeTab === 'itinerary' && (
              <div className="space-y-4">
                {booking.tour.itinerary?.map((day) => (
                  <div key={day.day} className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-amber-50 px-4 py-3 border-b border-amber-100">
                      <h4 className="font-semibold text-amber-800">
                        Day {day.day}: {day.title}
                      </h4>
                    </div>
                    <div className="p-4">
                      <p className="text-gray-600 mb-3">{day.description}</p>
                      <div className="space-y-2">
                        <h5 className="font-medium text-sm text-gray-700">Activities:</h5>
                        <ul className="list-disc list-inside space-y-1">
                          {day.activities.map((activity, idx) => (
                            <li key={idx} className="text-sm text-gray-600">{activity}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between text-sm">
                        <span className="text-gray-500">
                          <Hotel className="w-4 h-4 inline mr-1" />
                          {day.accommodation}
                        </span>
                        <span className="text-gray-500">
                          <Utensils className="w-4 h-4 inline mr-1" />
                          {day.meals?.join(' • ')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Travelers Tab */}
            {activeTab === 'travelers' && (
              <div className="space-y-6">
                {/* Travelers Summary */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-3">Travelers Summary</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">{booking.numberOfTravelers.adults}</p>
                      <p className="text-sm text-gray-500">Adults</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">{booking.numberOfTravelers.children}</p>
                      <p className="text-sm text-gray-500">Children</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">{booking.numberOfTravelers.infants}</p>
                      <p className="text-sm text-gray-500">Infants</p>
                    </div>
                  </div>
                </div>

                {/* Travelers Details */}
                {booking.travelers.map((traveler, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">
                      Traveler {index + 1}: {traveler.firstName} {traveler.lastName}
                    </h4>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      {traveler.email && (
                        <div className="flex items-center text-gray-600">
                          <Mail className="w-4 h-4 mr-2 text-gray-400" />
                          {traveler.email}
                        </div>
                      )}
                      {traveler.phone && (
                        <div className="flex items-center text-gray-600">
                          <Phone className="w-4 h-4 mr-2 text-gray-400" />
                          {traveler.phone}
                        </div>
                      )}
                      {traveler.nationality && (
                        <div className="flex items-center text-gray-600">
                          <Globe className="w-4 h-4 mr-2 text-gray-400" />
                          {traveler.nationality}
                        </div>
                      )}
                      {traveler.passportNumber && (
                        <div className="flex items-center text-gray-600">
                          <FileText className="w-4 h-4 mr-2 text-gray-400" />
                          Passport: {traveler.passportNumber}
                        </div>
                      )}
                    </div>
                    {traveler.dietaryRestrictions && (
                      <div className="mt-2 text-sm">
                        <span className="font-medium text-gray-700">Dietary:</span>
                        <span className="text-gray-600 ml-2">{traveler.dietaryRestrictions}</span>
                      </div>
                    )}
                    {traveler.medicalConditions && (
                      <div className="mt-1 text-sm">
                        <span className="font-medium text-gray-700">Medical:</span>
                        <span className="text-gray-600 ml-2">{traveler.medicalConditions}</span>
                      </div>
                    )}
                  </div>
                ))}

                {/* Emergency Contact */}
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                  <h4 className="font-semibold text-amber-800 mb-3">Emergency Contact</h4>
                  <div className="space-y-2">
                    <p className="text-sm text-amber-700">
                      <span className="font-medium">Name:</span> {booking.emergencyContact.name}
                    </p>
                    <p className="text-sm text-amber-700">
                      <span className="font-medium">Relationship:</span> {booking.emergencyContact.relationship}
                    </p>
                    <p className="text-sm text-amber-700">
                      <span className="font-medium">Phone:</span> {booking.emergencyContact.phone}
                    </p>
                    {booking.emergencyContact.email && (
                      <p className="text-sm text-amber-700">
                        <span className="font-medium">Email:</span> {booking.emergencyContact.email}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Documents Tab */}
            {activeTab === 'documents' && (
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-6 text-center">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">Booking Documents</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Your booking confirmation and important documents
                  </p>
                  <button
                    onClick={handleDownloadVoucher}
                    className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition inline-flex items-center"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Booking Voucher
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Quick Info Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Info</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Booking Date</span>
                <span className="font-medium text-gray-900">
                  {new Date(booking.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Total Travelers</span>
                <span className="font-medium text-gray-900">{booking.totalTravelers}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Duration</span>
                <span className="font-medium text-gray-900">{booking.durationDays} days</span>
              </div>
              
            </div>
          </div>

          {/* Accommodation Card */}
          {booking.accommodations && booking.accommodations.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Hotel className="w-5 h-5 mr-2 text-amber-500" />
                Accommodation
              </h3>
              {booking.accommodations.map((acc, index) => (
                <div key={index} className="space-y-3">
                  <div>
                    <p className="font-medium text-gray-900 capitalize">{acc.type}</p>
                    <p className="text-sm text-gray-600">{acc.name}</p>
                  </div>
                  <div className="text-sm text-gray-500">
                    <p>Check-in: {new Date(acc.checkIn).toLocaleDateString()}</p>
                    <p>Check-out: {new Date(acc.checkOut).toLocaleDateString()}</p>
                    <p>Rooms: {acc.numberOfRooms}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Cancellation Policy */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Shield className="w-5 h-5 mr-2 text-amber-500" />
              Cancellation Policy
            </h3>
            <p className="text-sm text-gray-600 capitalize mb-2">
              Policy: {booking.cancellationPolicy}
            </p>
            <p className="text-xs text-gray-500">
              Please refer to your booking confirmation email for detailed cancellation terms.
            </p>
          </div>

          {/* Need Help? */}
          <div className="bg-amber-50 rounded-xl p-6 border border-amber-200">
            <h3 className="font-semibold text-amber-800 mb-2">Need Help?</h3>
            <p className="text-sm text-amber-700 mb-4">
              If you have any questions about your booking, our support team is here to help.
            </p>
            <button className="w-full px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}