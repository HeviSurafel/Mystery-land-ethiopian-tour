// app/tours/[slug]/page.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  FiCalendar,
  FiUsers,
  FiStar,
  FiMapPin,
  FiClock,
  FiCheck,
  FiX,
  FiChevronDown,
  FiMessageCircle,
  FiHeart,
  FiShare2,
  FiAward,
  FiGlobe,
} from 'react-icons/fi';
import { useAuth } from '@/contexts/AuthContext';

// Map imports - only import on client side
import dynamic from 'next/dynamic';

// Dynamically import Leaflet components with no SSR
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);
const ZoomControl = dynamic(
  () => import('react-leaflet').then((mod) => mod.ZoomControl),
  { ssr: false }
);

import L from 'leaflet';

// Fix Leaflet marker icons - only run on client
let defaultIcon: L.Icon | null = null;
if (typeof window !== 'undefined') {
  defaultIcon = new L.Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
}

interface Tour {
  _id: string;
  id: string;
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
  itinerary: {
    day: number;
    title: string;
    description: string;
    image?: string;
  }[];
  inclusions: string[];
  exclusions: string[];
  departureDates: string[];
  faq: {
    question: string;
    answer: string;
    _id?: string;
  }[];
  season: string;
  departurePoint: string;
  languages: string[];
  status: string;
  bookingsCount: number;
  isUnesco: boolean;
}

export default function TourDetailPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;
  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isMounted, setIsMounted] = useState(false);
  const [activeDay, setActiveDay] = useState<number | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedDate, setSelectedDate] = useState('');
  const [adults, setAdults] = useState(2);
  const [rooms, setRooms] = useState(1);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());
  const [mapLoaded, setMapLoaded] = useState(false);
  
  const heroRef = useRef<HTMLDivElement>(null);
  
  // Fix: Only use useScroll when mounted on client
  const { scrollYProgress } = useScroll({
    target: typeof window !== 'undefined' ? heroRef : undefined,
    offset: ["start start", "end start"],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.2]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.98]);

  useEffect(() => {
    setIsMounted(true);
    fetchTour();
  }, [slug]);

  useEffect(() => {
    if (isMounted && tour) {
      setMapLoaded(true);
    }
  }, [isMounted, tour]);

  const fetchTour = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch(`/api/tours/${slug}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch tour');
      }

      if (data.data) {
        // Ensure price is set (fallback to 0 if not)
        const tourData = {
          ...data.data,
          price: data.data.price || 0,
        };

        if (!tourData.images || tourData.images.length === 0) {
          tourData.images = [
            `https://picsum.photos/seed/${tourData.slug || 'tour'}/800/600`,
            `https://picsum.photos/seed/${tourData.slug || 'tour'}-2/800/600`,
            `https://picsum.photos/seed/${tourData.slug || 'tour'}-3/800/600`,
          ];
        } else {
          tourData.images = tourData.images
            .filter((img: string) => img && img.trim() !== '')
            .map((img: string) => img);
          
          if (tourData.images.length === 0) {
            tourData.images = [
              `https://picsum.photos/seed/${tourData.slug || 'tour'}/800/600`,
              `https://picsum.photos/seed/${tourData.slug || 'tour'}-2/800/600`,
              `https://picsum.photos/seed/${tourData.slug || 'tour'}-3/800/600`,
            ];
          }
        }

        setTour(tourData);
        if (tourData?.departureDates?.length > 0) {
          setSelectedDate(tourData.departureDates[0]);
        }
      }
    } catch (err: any) {
      console.error('Error fetching tour:', err);
      setError(err.message || 'Failed to load tour');
    } finally {
      setLoading(false);
    }
  };

  const toggleDay = (day: number) => {
    setActiveDay(activeDay === day ? null : day);
  };

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const nextSlide = () => {
    if (tour?.images) {
      setCurrentSlide((prev) => (prev + 1) % tour.images.length);
    }
  };

  const prevSlide = () => {
    if (tour?.images) {
      setCurrentSlide((prev) => (prev - 1 + tour.images.length) % tour.images.length);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors: { [key: string]: string } = {
      'Easy': 'bg-green-100 text-green-800',
      'Moderate': 'bg-yellow-100 text-yellow-800',
      'Challenging': 'bg-orange-100 text-orange-800',
      'Epic': 'bg-red-100 text-red-800',
    };
    return colors[difficulty] || 'bg-gray-100 text-gray-800';
  };

  const getImageUrl = (imagePath: string, index: number = 0) => {
    if (!imagePath || imagePath.trim() === '') {
      return `https://picsum.photos/seed/${tour?.slug || 'tour'}/${index + 1}/800/600`;
    }
    if (imagePath.startsWith('/')) {
      return imagePath;
    }
    return imagePath;
  };

  const handleImageError = (index: number) => {
    setImageErrors(prev => new Set(prev).add(index));
  };

  const getCurrentImage = () => {
    if (!tour?.images || tour.images.length === 0) {
      return `https://picsum.photos/seed/${tour?.slug || 'tour'}/800/600`;
    }
    
    const imagePath = tour.images[currentSlide];
    if (!imagePath || imagePath.trim() === '' || imageErrors.has(currentSlide)) {
      return `https://picsum.photos/seed/${tour?.slug || 'tour'}-${currentSlide}/800/600`;
    }
    
    return getImageUrl(imagePath, currentSlide);
  };

  const handleBookNow = () => {
    if (!user) {
      sessionStorage.setItem('redirectAfterLogin', window.location.pathname + window.location.search);
      router.push('/login');
      return;
    }
    // Navigate to booking page with tour slug
    router.push(`/booking?tour=${tour?.slug}`);
  };

  if (!isMounted || loading) {
    return (
      <div className="pt-32 pb-20 px-4 md:px-6 max-w-7xl mx-auto">
        <div className="animate-pulse">
          <div className="h-[500px] bg-gray-200 rounded-3xl mb-8"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-12 bg-gray-200 rounded w-3/4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
            <div className="lg:col-span-1">
              <div className="h-96 bg-gray-200 rounded-3xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !tour) {
    return (
      <div className="pt-32 pb-20 px-4 md:px-6 max-w-7xl mx-auto text-center">
        <h2 className="text-2xl font-semibold text-[#004525] mb-4">Tour Not Found</h2>
        <p className="text-[#404942] mb-6">{error || 'The tour you are looking for does not exist.'}</p>
        <Link
          href="/tours"
          className="inline-block px-6 py-3 bg-[#004525] text-white rounded-lg hover:bg-[#1f5d3a] transition-colors"
        >
          Back to Tours
        </Link>
      </div>
    );
  }

  // Map coordinates
  const position: [number, number] = [
    tour.coordinates?.lat || 9.032,
    tour.coordinates?.lng || 38.7468
  ];

  // Fix: Only show map on client side
  const renderMap = () => {
    if (!isMounted || !mapLoaded || typeof window === 'undefined') {
      return (
        <div className="w-full h-full flex items-center justify-center bg-[#d0dbed]">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-[#004525] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-[#404942]">Loading map...</p>
          </div>
        </div>
      );
    }

    return (
      <MapContainer
        center={position}
        zoom={13}
        scrollWheelZoom={true}
        className="w-full h-full"
        zoomControl={false}
        whenReady={() => setMapLoaded(true)}
      >
        <ZoomControl position="bottomright" />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {defaultIcon && (
          <Marker position={position} icon={defaultIcon}>
            <Popup>
              <div className="text-center">
                <h3 className="font-semibold text-[#004525]">{tour.name}</h3>
                <p className="text-sm text-[#404942]">{tour.coordinates?.city}, {tour.coordinates?.region}</p>
                <Link 
                  href={`https://www.google.com/maps/dir/?api=1&destination=${position[0]},${position[1]}`}
                  target="_blank"
                  className="text-blue-600 text-sm hover:underline"
                >
                  Get Directions
                </Link>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    );
  };

  return (
    <main className="bg-[#f8f9ff] min-h-screen">
      {/* Hero Gallery Slider */}
      <section ref={heroRef} className="relative w-full h-[716px] group overflow-hidden bg-[#1a1a2e]">
        <motion.div 
          className="absolute inset-0 z-0"
          style={{ opacity: heroOpacity, scale: heroScale }}
        >
          <div className="relative w-full h-[716px]">
            <Image
              src={getCurrentImage()}
              alt={tour.name}
              fill
              className="object-cover object-center"
              priority
              onError={() => handleImageError(currentSlide)}
              unoptimized={true}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
        </motion.div>

        {/* Image counter */}
        {tour.images && tour.images.length > 0 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
            <span className="bg-black/50 text-white px-3 py-1 rounded-full text-xs">
              {currentSlide + 1} / {tour.images.length}
            </span>
          </div>
        )}

        {/* UNESCO Badge */}
        {tour.isUnesco && (
          <div className="absolute top-6 left-6 z-20">
            <span className="bg-[#cca830] text-[#4f3e00] px-4 py-2 rounded-full text-[12px] leading-[16px] font-semibold uppercase tracking-wider flex items-center gap-2">
              <FiAward size={16} />
              UNESCO World Heritage
            </span>
          </div>
        )}

        {/* Slider Controls */}
        {tour.images && tour.images.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 backdrop-blur-md text-white p-3 rounded-full hover:bg-black/50 transition-all opacity-0 group-hover:opacity-100"
            >
              <FiChevronDown className="rotate-90" size={24} />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 backdrop-blur-md text-white p-3 rounded-full hover:bg-black/50 transition-all opacity-0 group-hover:opacity-100"
            >
              <FiChevronDown className="-rotate-90" size={24} />
            </button>
          </>
        )}

        {/* Dots */}
        {tour.images && tour.images.length > 1 && (
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {tour.images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-8 h-1 rounded-full transition-all ${
                  index === currentSlide ? 'bg-white opacity-100' : 'bg-white opacity-40'
                }`}
              />
            ))}
          </div>
        )}

        {/* Hero Content */}
        <div className="absolute inset-0 flex items-end pb-12 px-4 md:px-6 max-w-[1280px] mx-auto z-10 pointer-events-none">
          <div className="max-w-3xl text-white">
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <span className="inline-block bg-[#cca830] text-[#4f3e00] px-3 py-1 rounded-full text-[12px] leading-[16px] font-medium">
                Curated Experience
              </span>
              <span className="inline-block bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-full text-[12px] leading-[16px] font-medium flex items-center gap-1">
                <FiStar size={14} className="text-[#cca830]" />
                {tour.rating} ({tour.reviewCount} reviews)
              </span>
            </div>
            <h1 className="font-['Playfair_Display'] text-[40px] md:text-[64px] leading-[48px] md:leading-[72px] tracking-[-0.02em] font-bold mb-3">
              {tour.name}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-white/90">
              <span className="flex items-center gap-2">
                <FiMapPin size={18} />
                {tour.coordinates?.city}, {tour.coordinates?.region}
              </span>
              <span className="flex items-center gap-2">
                <FiClock size={18} />
                {tour.duration}
              </span>
              <span className="flex items-center gap-2">
                <FiUsers size={18} />
                {tour.groupSize}
              </span>
            </div>
            <p className="text-[18px] leading-[28px] text-white/90 mt-4 max-w-2xl">
              {tour.description}
            </p>
          </div>
        </div>
      </section>

      {/* Content Grid */}
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
        {/* Left: Main Content */}
        <div className="lg:col-span-2 space-y-12">
          {/* Overview */}
          <section id="overview">
            <h2 className="font-['Playfair_Display'] text-[32px] md:text-[48px] leading-[40px] md:leading-[56px] font-semibold text-[#004525] border-l-4 border-[#004525] pl-4 mb-4">
              The Essence of the Journey
            </h2>
            <p className="text-[18px] leading-[28px] text-[#404942] mb-6">
              {tour.description}
            </p>
            
            {/* Highlights */}
            {tour.highlights && tour.highlights.length > 0 && (
              <div className="mb-6">
                <h3 className="font-['Playfair_Display'] text-[24px] leading-[32px] font-semibold text-[#004525] mb-3">
                  Experience Highlights
                </h3>
                <div className="flex flex-wrap gap-2">
                  {tour.highlights.map((highlight, index) => (
                    <span key={index} className="bg-[#004525]/10 text-[#004525] px-3 py-1 rounded-full text-[14px] leading-[20px] font-medium">
                      {highlight}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="p-4 bg-[#eff4ff] rounded-xl text-center">
                <FiCalendar size={24} className="text-[#004525] mx-auto mb-2" />
                <p className="text-[12px] leading-[16px] font-medium uppercase tracking-widest text-[#707971]">Duration</p>
                <p className="font-['Playfair_Display'] text-[24px] leading-[32px] font-semibold text-[#004525]">{tour.duration}</p>
              </div>
              <div className="p-4 bg-[#eff4ff] rounded-xl text-center">
                <FiUsers size={24} className="text-[#004525] mx-auto mb-2" />
                <p className="text-[12px] leading-[16px] font-medium uppercase tracking-widest text-[#707971]">Group Size</p>
                <p className="font-['Playfair_Display'] text-[24px] leading-[32px] font-semibold text-[#004525]">{tour.groupSize || 'Max 6'}</p>
              </div>
              <div className="p-4 bg-[#eff4ff] rounded-xl text-center">
                <FiStar size={24} className="text-[#004525] mx-auto mb-2" />
                <p className="text-[12px] leading-[16px] font-medium uppercase tracking-widest text-[#707971]">Difficulty</p>
                <span className={`px-3 py-1 rounded-full text-[12px] leading-[16px] font-medium ${getDifficultyColor(tour.difficulty)}`}>
                  {tour.difficulty || 'Moderate'}
                </span>
              </div>
              <div className="p-4 bg-[#eff4ff] rounded-xl text-center">
                <FiMapPin size={24} className="text-[#004525] mx-auto mb-2" />
                <p className="text-[12px] leading-[16px] font-medium uppercase tracking-widest text-[#707971]">Location</p>
                <p className="font-['Playfair_Display'] text-[24px] leading-[32px] font-semibold text-[#004525]">{tour.coordinates?.city || 'Ethiopia'}</p>
              </div>
            </div>

            {/* Additional Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              {tour.bestTime && tour.bestTime.length > 0 && (
                <div className="p-4 bg-white rounded-xl border border-[#c0c9bf]/30">
                  <h4 className="font-semibold text-[#004525] flex items-center gap-2 mb-2">
                    <FiCalendar size={18} /> Best Time to Visit
                  </h4>
                  <p className="text-[#404942]">{tour.bestTime.join(', ')}</p>
                </div>
              )}
              {tour.languages && tour.languages.length > 0 && (
                <div className="p-4 bg-white rounded-xl border border-[#c0c9bf]/30">
                  <h4 className="font-semibold text-[#004525] flex items-center gap-2 mb-2">
                    <FiGlobe size={18} /> Languages
                  </h4>
                  <p className="text-[#404942]">{tour.languages.join(', ')}</p>
                </div>
              )}
              {tour.departurePoint && (
                <div className="p-4 bg-white rounded-xl border border-[#c0c9bf]/30">
                  <h4 className="font-semibold text-[#004525] flex items-center gap-2 mb-2">
                    <FiMapPin size={18} /> Departure Point
                  </h4>
                  <p className="text-[#404942]">{tour.departurePoint}</p>
                </div>
              )}
              {tour.season && (
                <div className="p-4 bg-white rounded-xl border border-[#c0c9bf]/30">
                  <h4 className="font-semibold text-[#004525] flex items-center gap-2 mb-2">
                    <FiClock size={18} /> Season
                  </h4>
                  <p className="text-[#404942]">{tour.season}</p>
                </div>
              )}
            </div>
          </section>

          {/* Itinerary */}
          {tour.itinerary && tour.itinerary.length > 0 && (
            <section id="itinerary">
              <h2 className="font-['Playfair_Display'] text-[32px] md:text-[48px] leading-[40px] md:leading-[56px] font-semibold text-[#004525] mb-4">
                Daily Itinerary
              </h2>
              <div className="space-y-4">
                {tour.itinerary.map((day, index) => (
                  <div key={index} className="relative pl-6">
                    {index < tour.itinerary.length - 1 && (
                      <div className="absolute left-3 top-8 bottom-0 w-0.5 bg-[#004525]/20"></div>
                    )}
                    <div className="flex items-start gap-4">
                      <div className="w-6 h-6 rounded-full bg-[#004525] flex-shrink-0 mt-1 relative z-10 border-4 border-white shadow-sm"></div>
                      <div className="w-full">
                        <button
                          onClick={() => toggleDay(index + 1)}
                          className="w-full flex justify-between items-center bg-[#dee9fc] p-4 rounded-xl hover:bg-[#d9e3f6] transition-colors"
                        >
                          <div className="text-left">
                            <span className="text-[14px] leading-[20px] font-semibold text-[#004525]">DAY {day.day}</span>
                            <h3 className="font-['Playfair_Display'] text-[24px] leading-[32px] font-semibold">{day.title}</h3>
                          </div>
                          <FiChevronDown 
                            size={24} 
                            className={`transition-transform ${activeDay === index + 1 ? 'rotate-180' : ''}`}
                          />
                        </button>
                        <div className={`mt-3 space-y-3 ${activeDay === index + 1 ? 'block' : 'hidden'}`}>
                          <p className="text-[16px] leading-[24px] text-[#404942]">{day.description}</p>
                          {day.image && (
                            <div className="relative h-48 w-full rounded-xl overflow-hidden">
                              <Image
                                src={day.image}
                                alt={day.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Inclusions / Exclusions Bento */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#004525]/5 p-6 rounded-3xl border border-[#004525]/10">
              <h3 className="font-['Playfair_Display'] text-[24px] leading-[32px] font-semibold text-[#004525] mb-4 flex items-center gap-2">
                <FiCheck size={24} className="text-[#004525]" /> Included
              </h3>
              <ul className="space-y-2">
                {tour.inclusions && tour.inclusions.length > 0 ? (
                  tour.inclusions.map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-[16px] leading-[24px] text-[#404942]">
                      <FiCheck size={18} className="text-[#004525] mt-1 flex-shrink-0" />
                      {item}
                    </li>
                  ))
                ) : (
                  <li className="text-[#404942]">No inclusions listed</li>
                )}
              </ul>
            </div>
            <div className="bg-[#eff4ff] p-6 rounded-3xl border border-[#c0c9bf]">
              <h3 className="font-['Playfair_Display'] text-[24px] leading-[32px] font-semibold text-[#404942] mb-4 flex items-center gap-2">
                <FiX size={24} className="text-[#ba1a1a]" /> Excluded
              </h3>
              <ul className="space-y-2">
                {tour.exclusions && tour.exclusions.length > 0 ? (
                  tour.exclusions.map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-[16px] leading-[24px] text-[#404942] opacity-70">
                      <FiX size={18} className="text-[#ba1a1a] mt-1 flex-shrink-0" />
                      {item}
                    </li>
                  ))
                ) : (
                  <li className="text-[#404942] opacity-70">No exclusions listed</li>
                )}
              </ul>
            </div>
          </section>

          {/* FAQ Section */}
          {tour.faq && tour.faq.length > 0 && (
            <section id="faq">
              <h2 className="font-['Playfair_Display'] text-[32px] md:text-[48px] leading-[40px] md:leading-[56px] font-semibold text-[#004525] mb-4">
                Frequently Asked Questions
              </h2>
              <div className="space-y-3">
                {tour.faq.map((item, index) => (
                  <div key={index} className="bg-white rounded-xl border border-[#c0c9bf]/30 overflow-hidden">
                    <button
                      onClick={() => toggleFaq(index)}
                      className="w-full flex justify-between items-center p-4 hover:bg-[#eff4ff] transition-colors text-left"
                    >
                      <span className="font-semibold text-[#004525]">{item.question}</span>
                      <FiChevronDown 
                        size={20} 
                        className={`transition-transform text-[#004525] ${activeFaq === index ? 'rotate-180' : ''}`}
                      />
                    </button>
                    <div className={`px-4 pb-4 ${activeFaq === index ? 'block' : 'hidden'}`}>
                      <p className="text-[#404942]">{item.answer}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Map Section with Leaflet Integration */}
          <section>
            <h2 className="font-['Playfair_Display'] text-[32px] md:text-[48px] leading-[40px] md:leading-[56px] font-semibold text-[#004525] mb-4">
              Location Map
            </h2>
            <div className="w-full aspect-video rounded-3xl overflow-hidden shadow-[0px_10px_30px_rgba(31,93,58,0.08)] relative bg-[#d0dbed]">
              {renderMap()}
              
              {/* Location Info Overlay */}
              <div className="absolute top-4 left-4 bg-white/60 backdrop-blur-[20px] border border-white/20 p-4 rounded-xl max-w-xs z-[1000]">
                <p className="text-[14px] leading-[20px] font-semibold text-[#004525]">📍 LOCATION</p>
                <p className="text-[16px] leading-[24px] text-[#404942]">
                  {tour.coordinates?.city}, {tour.coordinates?.region}, Ethiopia
                </p>
                <p className="text-[12px] leading-[16px] text-[#707971] mt-1">
                  Lat: {tour.coordinates?.lat.toFixed(4)}, Lng: {tour.coordinates?.lng.toFixed(4)}
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Right: Sidebar Sticky Widget */}
        <aside className="lg:col-span-1">
          <div className="sticky top-24 space-y-4">
            <div className="bg-white/60 backdrop-blur-[20px] border border-white/20 p-6 rounded-3xl shadow-[0px_10px_30px_rgba(31,93,58,0.08)]">
              <div className="mb-4">
                <p className="text-[12px] leading-[16px] font-medium text-[#707971] uppercase tracking-widest">All-Inclusive Price</p>
                <div className="flex items-baseline gap-1">
                  <span className="font-['Playfair_Display'] text-[32px] leading-[40px] font-semibold text-[#004525]">
                    ${tour.price?.toLocaleString() || '0'}
                  </span>
                  <span className="text-[16px] leading-[24px] text-[#404942]">/ per person</span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-[14px] leading-[20px] font-semibold block mb-1 text-[#121c2a]">Select Departure</label>
                  <select 
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full bg-white border-[#c0c9bf] rounded-xl p-3 text-[16px] leading-[24px] focus:ring-[#004525] focus:border-[#004525]"
                  >
                    {tour.departureDates && tour.departureDates.length > 0 ? (
                      tour.departureDates.map((date, index) => (
                        <option key={index} value={date}>{date}</option>
                      ))
                    ) : (
                      <option>Select a departure date</option>
                    )}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[14px] leading-[20px] font-semibold block mb-1 text-[#121c2a]">Adults</label>
                    <input 
                      type="number" 
                      value={adults}
                      onChange={(e) => setAdults(parseInt(e.target.value))}
                      className="w-full bg-white border-[#c0c9bf] rounded-xl p-3 text-[16px] leading-[24px] focus:ring-[#004525] focus:border-[#004525]"
                      min="1"
                    />
                  </div>
                  <div>
                    <label className="text-[14px] leading-[20px] font-semibold block mb-1 text-[#121c2a]">Rooms</label>
                    <input 
                      type="number" 
                      value={rooms}
                      onChange={(e) => setRooms(parseInt(e.target.value))}
                      className="w-full bg-white border-[#c0c9bf] rounded-xl p-3 text-[16px] leading-[24px] focus:ring-[#004525] focus:border-[#004525]"
                      min="1"
                    />
                  </div>
                </div>
                <button 
                  onClick={handleBookNow}
                  className="w-full bg-[#004525] text-white font-['Playfair_Display'] text-[24px] leading-[32px] font-semibold py-4 rounded-xl hover:bg-[#1f5d3a] transition-all shadow-[0px_10px_30px_rgba(31,93,58,0.08)]"
                >
                  Book Now
                </button>
              </div>

              <div className="mt-4 pt-4 border-t border-[#c0c9bf]/30 text-center space-y-2">
                <Link href="#" className="inline-flex items-center gap-2 text-[14px] leading-[20px] font-semibold text-[#735c00] hover:text-[#cca830] transition-colors">
                  <FiMessageCircle size={18} />
                  Contact Specialist Guide
                </Link>
                <div className="flex justify-center gap-4 text-[#707971]">
                  <button className="hover:text-[#004525] transition-colors flex items-center gap-1">
                    <FiHeart size={18} /> Wishlist
                  </button>
                  <button className="hover:text-[#004525] transition-colors flex items-center gap-1">
                    <FiShare2 size={18} /> Share
                  </button>
                </div>
              </div>
            </div>

            {/* UNESCO Info */}
            {tour.isUnesco && (
              <div className="bg-[#eff4ff] p-4 rounded-2xl border border-[#c0c9bf]/30">
                <div className="flex items-start gap-3">
                  <FiAward size={24} className="text-[#735c00] flex-shrink-0 mt-1" />
                  <div>
                    <h5 className="font-semibold text-[#004525]">UNESCO World Heritage Site</h5>
                    <p className="text-[12px] leading-[16px] text-[#404942]">This tour includes a UNESCO World Heritage site, recognized for its outstanding cultural significance.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>
    </main>
  );
}