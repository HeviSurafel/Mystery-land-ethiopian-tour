// components/BookingPage.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  FiChevronDown,
  FiArrowRight,
  FiCalendar,
  FiUsers,
  FiUser,
  FiMapPin,
  FiClock,
  FiDollarSign,
  FiCheckCircle,
  FiShield,
  FiPlus,
  FiMinus,
  FiCompass,
  FiHeart,
  FiStar,
  FiAlertCircle,
  FiLoader,
  FiLock,
} from 'react-icons/fi';
import { MdVerified } from 'react-icons/md';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';

interface Tour {
  id: string;
  _id: string;
  name: string;
  slug: string;
  description: string;
  duration: string;
  images: string[];
  coordinates: {
    lat: number;
    lng: number;
    city: string;
    region: string;
  };
  groupSize: string;
  difficulty: string;
  rating: number;
  reviewCount: number;
  featured: boolean;
  tag: string;
  highlights: string[];
  category: string;
  bestTime: string[];
  price: number;
  location?: string;
}

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function BookingPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const tourSlug = searchParams.get('tour');
  
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  const [tours, setTours] = useState<Tour[]>([]);
  const [travelers, setTravelers] = useState(2);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingReference, setBookingReference] = useState('');
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    country: 'Ethiopia',
    preferredDate: '',
    specialRequests: '',
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      sessionStorage.setItem('redirectAfterLogin', window.location.pathname + window.location.search);
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: user.name || '',
        email: user.email || '',
      
      }));
    }
    fetchTours();
  }, [user]);

  const fetchTours = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/tours?limit=10&featured=true');
      const data = await response.json();

      if (response.ok && data.success) {
        const toursWithPrices = data.data.map((tour: any) => ({
          ...tour,
          price: tour.price || Math.floor(Math.random() * 5000) + 2000,
        }));
        setTours(toursWithPrices);
        
        if (tourSlug) {
          const tour = toursWithPrices.find((t: Tour) => t.slug === tourSlug);
          if (tour) {
            setSelectedTour(tour);
          }
        } else if (toursWithPrices.length > 0) {
          setSelectedTour(toursWithPrices[0]);
        }
      }
    } catch (err) {
      console.error('Error fetching tours:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    if (!selectedTour) {
      setError('Please select a tour');
      setSubmitting(false);
      return;
    }

    if (!user) {
      setError('Please login to complete your booking');
      setSubmitting(false);
      return;
    }

    try {
      const bookingData = {
        fullName: formData.fullName || user.name,
        email: formData.email || user.email,
        phone: formData.phone ||'',
        country: formData.country,
        preferredDate: formData.preferredDate,
        travelers: travelers,
        specialRequests: formData.specialRequests,
        itemId: selectedTour._id || selectedTour.id,
        itemName: selectedTour.name,
        itemType: 'tour',
        userId: user.id,
      };

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create booking');
      }

      setBookingReference(data.data?.bookingReference || '');
      setBookingSuccess(true);
      setCurrentStep(4);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const totalPrice = selectedTour ? (selectedTour.price || 0) * travelers : 0;

  const steps = ['Tour & Dates', 'Traveler Info', 'Review'];

  if (authLoading) {
    return (
      <div className="pt-32 pb-20 px-4 md:px-6 max-w-7xl mx-auto">
        <div className="flex flex-col items-center justify-center py-20">
          <FiLoader className="w-12 h-12 text-[#004525] animate-spin" />
          <p className="mt-4 text-[#404942]">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="pt-32 pb-20 px-4 md:px-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-[#c0c9bf]/20 text-center"
        >
          <div className="w-20 h-20 bg-[#004525]/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiLock className="w-10 h-10 text-[#004525]" />
          </div>
          <h2 className="font-['Playfair_Display'] text-3xl md:text-4xl font-semibold text-[#004525] mb-4">
            Please Login to Book
          </h2>
          <p className="text-[#404942] text-lg mb-6">
            You need to be logged in to book a tour. Please login or create an account to continue.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login">
              <button className="px-8 py-3 bg-[#004525] text-white rounded-xl font-semibold hover:bg-[#1f5d3a] transition-colors">
                Login
              </button>
            </Link>
            <Link href="/signup">
              <button className="px-8 py-3 border border-[#004525] text-[#004525] rounded-xl font-semibold hover:bg-[#004525]/5 transition-colors">
                Create Account
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="pt-32 pb-20 px-4 md:px-6 max-w-7xl mx-auto">
        <div className="flex flex-col items-center justify-center py-20">
          <FiLoader className="w-12 h-12 text-[#004525] animate-spin" />
          <p className="mt-4 text-[#404942]">Loading tours...</p>
        </div>
      </div>
    );
  }

  if (bookingSuccess) {
    return (
      <div className="pt-32 pb-20 px-4 md:px-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-[#c0c9bf]/20 text-center"
        >
          <div className="w-20 h-20 bg-[#97f3b5]/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiCheckCircle className="w-10 h-10 text-[#004525]" />
          </div>
          <h2 className="font-['Playfair_Display'] text-3xl md:text-4xl font-semibold text-[#004525] mb-4">
            Booking Confirmed!
          </h2>
          <p className="text-[#404942] text-lg mb-2">
            Your adventure is booked. We've sent a confirmation to your email.
          </p>
          <div className="bg-[#f8f9ff] p-4 rounded-xl inline-block mb-6">
            <p className="text-sm text-[#707971]">Booking Reference</p>
            <p className="font-['Playfair_Display'] text-2xl font-bold text-[#004525]">
              {bookingReference}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <button className="px-8 py-3 bg-[#004525] text-white rounded-xl font-semibold hover:bg-[#1f5d3a] transition-colors">
                Return Home
              </button>
            </Link>
            <Link href="/tours">
              <button className="px-8 py-3 border border-[#004525] text-[#004525] rounded-xl font-semibold hover:bg-[#004525]/5 transition-colors">
                Explore More Tours
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!selectedTour) {
    return (
      <div className="pt-32 pb-20 px-4 md:px-6 max-w-7xl mx-auto">
        <div className="text-center py-20">
          <p className="text-[#404942]">No tours available for booking.</p>
          <Link href="/tours">
            <button className="mt-4 px-6 py-2 bg-[#004525] text-white rounded-lg hover:bg-[#1f5d3a] transition-colors">
              Browse Tours
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 px-4 md:px-6 max-w-7xl mx-auto">
      {/* Booking Wizard Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 overflow-x-auto"
      >
        <div className="flex items-center justify-between min-w-[400px] px-2">
          {steps.map((step, index) => {
            const stepNumber = index + 1;
            const isActive = stepNumber === currentStep;
            const isCompleted = stepNumber < currentStep;
            
            return (
              <div key={index} className="flex items-center gap-3 flex-1">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                      isActive || isCompleted
                        ? 'bg-[#004525] text-white'
                        : 'bg-[#c0c9bf] text-[#121c2a] opacity-50'
                    }`}
                  >
                    {isCompleted ? <FiCheckCircle size={20} /> : stepNumber}
                  </div>
                  <span
                    className={`text-sm font-semibold whitespace-nowrap ${
                      isActive ? 'text-[#004525]' : 'text-[#404942] opacity-50'
                    }`}
                  >
                    {step}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`h-0.5 flex-1 mx-2 transition-all ${
                      isCompleted || isActive ? 'bg-[#004525]' : 'bg-[#c0c9bf]'
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Forms */}
        <div className="lg:col-span-8 space-y-8">
          <form onSubmit={handleSubmit}>
            {/* Section 1: Tour Selection */}
            {currentStep === 1 && (
              <motion.section
                initial="initial"
                animate="animate"
                variants={stagger}
                className="space-y-4"
              >
                <motion.h2
                  variants={fadeInUp}
                  className="font-['Playfair_Display'] text-3xl font-semibold text-[#004525]"
                >
                  Curate Your Journey
                </motion.h2>
                <motion.p
                  variants={fadeInUp}
                  className="text-lg text-[#404942] max-w-2xl"
                >
                  Select your preferred tour and travel dates.
                </motion.p>

                <motion.div
                  variants={fadeInUp}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4"
                >
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-[#004525]">
                      Select Tour
                    </label>
                    <div className="relative">
                      <select
                        value={selectedTour?._id || selectedTour?.id || ''}
                        onChange={(e) => {
                          const tour = tours.find(t => t._id === e.target.value || t.id === e.target.value);
                          if (tour) setSelectedTour(tour);
                        }}
                        className="w-full h-14 pl-4 pr-10 appearance-none bg-white border border-[#c0c9bf] rounded-xl focus:border-[#004525] transition-colors"
                      >
                        {tours.map((tour) => (
                          <option key={tour._id || tour.id} value={tour._id || tour.id}>
                            {tour.name}
                          </option>
                        ))}
                      </select>
                      <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#404942]" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-[#004525]">
                      Travel Dates
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        name="preferredDate"
                        value={formData.preferredDate}
                        onChange={handleInputChange}
                        required
                        className="w-full h-14 px-4 bg-white border border-[#c0c9bf] rounded-xl focus:border-[#004525] transition-colors"
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                  </div>
                </motion.div>

                <motion.div variants={fadeInUp} className="pt-4">
                  <h3 className="font-['Playfair_Display'] text-2xl font-semibold mb-4">
                    Selected Tour Preview
                  </h3>
                  <div className="glass-card rounded-2xl overflow-hidden group">
                    <div className="relative h-64">
                      {selectedTour.images && selectedTour.images.length > 0 ? (
                        <Image
                          src={selectedTour.images[0]}
                          alt={selectedTour.name}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#004525] to-[#2d6a4f] flex items-center justify-center text-white text-4xl font-bold">
                          {selectedTour.name.charAt(0)}
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                      <div className="absolute top-4 left-4">
                        <span className="bg-[#ffe088] text-[#241a00] px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider">
                          {selectedTour.tag || 'Featured'}
                        </span>
                      </div>
                      {selectedTour.rating > 0 && (
                        <div className="absolute top-4 right-4 flex items-center gap-1 bg-white/80 backdrop-blur-md px-3 py-1 rounded-full">
                          <FiStar size={16} className="text-[#735c00] fill-[#735c00]" />
                          <span className="text-sm font-bold text-[#004525]">
                            {selectedTour.rating.toFixed(1)}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-6 space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-['Playfair_Display'] text-2xl font-semibold text-[#004525]">
                            {selectedTour.name}
                          </h4>
                          <p className="text-[#404942] flex items-center gap-1">
                            <FiMapPin size={16} /> 
                            {selectedTour.coordinates?.city || selectedTour.location || 'Ethiopia'}
                          </p>
                          <p className="text-sm text-[#404942] mt-1">
                            {selectedTour.duration} • {selectedTour.groupSize || 'Private Guide Included'}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="font-['Playfair_Display'] text-2xl font-bold text-[#004525]">
                            ${selectedTour.price || 0}
                          </span>
                          <p className="text-xs text-[#404942]">per person</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Travelers */}
                <motion.div variants={fadeInUp} className="pt-4">
                  <label className="text-sm font-semibold text-[#004525] block mb-2">
                    Number of Travelers
                  </label>
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => setTravelers(Math.max(1, travelers - 1))}
                      className="w-12 h-12 rounded-full border border-[#c0c9bf] flex items-center justify-center hover:border-[#004525] transition-colors"
                    >
                      <FiMinus size={20} />
                    </button>
                    <span className="text-2xl font-bold text-[#004525] w-12 text-center">
                      {travelers}
                    </span>
                    <button
                      type="button"
                      onClick={() => setTravelers(Math.min(12, travelers + 1))}
                      className="w-12 h-12 rounded-full border border-[#c0c9bf] flex items-center justify-center hover:border-[#004525] transition-colors"
                    >
                      <FiPlus size={20} />
                    </button>
                    <span className="text-sm text-[#404942] ml-2">
                      {travelers === 1 ? 'Adult' : 'Adults'}
                    </span>
                  </div>
                </motion.div>

                <div className="flex justify-end pt-4">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="px-8 py-3 bg-[#004525] text-white rounded-lg text-sm font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2"
                  >
                    Continue
                    <FiArrowRight size={20} />
                  </button>
                </div>
              </motion.section>
            )}

            {/* Section 2: Traveler Info */}
            {currentStep === 2 && (
              <motion.section
                initial="initial"
                animate="animate"
                variants={stagger}
                className="space-y-4"
              >
                <motion.h2
                  variants={fadeInUp}
                  className="font-['Playfair_Display'] text-3xl font-semibold text-[#004525]"
                >
                  Traveler Information
                </motion.h2>
                <motion.p
                  variants={fadeInUp}
                  className="text-lg text-[#404942] max-w-2xl"
                >
                  Confirm your details for the booking.
                </motion.p>

                <motion.div
                  variants={fadeInUp}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4"
                >
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-[#004525]">Full Name *</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                      className="w-full h-14 px-4 bg-white border border-[#c0c9bf] rounded-xl focus:border-[#004525] transition-colors"
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-[#004525]">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full h-14 px-4 bg-white border border-[#c0c9bf] rounded-xl focus:border-[#004525] transition-colors"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-[#004525]">Phone *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full h-14 px-4 bg-white border border-[#c0c9bf] rounded-xl focus:border-[#004525] transition-colors"
                      placeholder="+251 912 345 678"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-[#004525]">Country *</label>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      required
                      className="w-full h-14 px-4 bg-white border border-[#c0c9bf] rounded-xl focus:border-[#004525] transition-colors"
                    >
                      <option value="Ethiopia">Ethiopia</option>
                      <option value="United States">United States</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Canada">Canada</option>
                      <option value="Australia">Australia</option>
                      <option value="Germany">Germany</option>
                      <option value="France">France</option>
                      <option value="Italy">Italy</option>
                      <option value="Spain">Spain</option>
                      <option value="Netherlands">Netherlands</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-sm font-semibold text-[#004525]">Special Requests</label>
                    <textarea
                      name="specialRequests"
                      value={formData.specialRequests}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-3 bg-white border border-[#c0c9bf] rounded-xl focus:border-[#004525] transition-colors"
                      placeholder="Dietary restrictions, accessibility needs, special occasions..."
                    />
                  </div>
                </motion.div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                    <FiAlertCircle className="text-red-500 mt-0.5 flex-shrink-0" />
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                )}

                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="px-6 py-3 border border-[#c0c9bf] text-[#404942] rounded-lg text-sm font-semibold hover:border-[#004525] hover:text-[#004525] transition-all"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-8 py-3 bg-[#004525] text-white rounded-lg text-sm font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <>
                        <FiLoader className="animate-spin" size={20} />
                        Processing...
                      </>
                    ) : (
                      <>
                        Complete Booking
                        <FiArrowRight size={20} />
                      </>
                    )}
                  </button>
                </div>
              </motion.section>
            )}
          </form>
        </div>

        {/* Right Column: Summary Sidebar */}
        <aside className="lg:col-span-4">
          <div className="glass-card rounded-2xl p-6 sticky top-28 space-y-6">
            <h3 className="font-['Playfair_Display'] text-2xl font-semibold text-[#004525]">
              Booking Summary
            </h3>

            <div className="space-y-3 border-b border-[#c0c9bf] pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-semibold text-[#004525]">Tour</p>
                  <p className="text-[#404942] text-sm">{selectedTour?.name}</p>
                </div>
              </div>
              <div className="flex justify-between">
                <div>
                  <p className="text-sm font-semibold text-[#004525]">Dates</p>
                  <p className="text-[#404942] text-sm">
                    {formData.preferredDate ? new Date(formData.preferredDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    }) : 'Select date'}
                  </p>
                </div>
              </div>
              <div className="flex justify-between">
                <div>
                  <p className="text-sm font-semibold text-[#004525]">Travelers</p>
                  <p className="text-[#404942] text-sm">{travelers} {travelers === 1 ? 'Adult' : 'Adults'}</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-base">
                <span>Base Rate (x{travelers})</span>
                <span>${((selectedTour?.price || 0) * travelers).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base">
                <span>Service Fee</span>
                <span>$0.00</span>
              </div>
            </div>

            <div className="pt-4 border-t border-[#004525]/20">
              <div className="flex justify-between items-baseline mb-1">
                <span className="font-['Playfair_Display'] text-2xl font-semibold text-[#004525]">
                  Total
                </span>
                <span className="font-['Playfair_Display'] text-3xl font-bold text-[#004525]">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>
              <p className="text-xs text-[#404942] italic">
                All taxes and private transfers included.
              </p>
            </div>

            <div className="bg-[#004525]/5 p-4 rounded-xl space-y-2">
              <div className="flex gap-2 items-center text-[#004525]">
                <MdVerified size={20} />
                <span className="text-sm font-semibold">Secure Booking</span>
              </div>
              <p className="text-xs text-[#404942]">
                Your reservation is protected by our Platinum Guarantee.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}