// app/destinations/[slug]/page.tsx
'use client';

import { useState, useEffect, useRef, useCallback, JSX } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  FiCalendar,
  FiUsers,
  FiStar,
  FiMapPin,
  FiClock,
  FiCheck,
  FiChevronDown,
  FiArrowLeft,
  FiShare2,
  FiHeart,
  FiAward,
  FiGlobe,
  FiSun,
} from 'react-icons/fi';
import { MdOutlineExplore } from 'react-icons/md';
import { GiLion, GiTreeBranch } from 'react-icons/gi';
import { FaMountain, FaWater, FaTree } from 'react-icons/fa';
import { RiAncientPavilionLine } from 'react-icons/ri';

// Map imports
import dynamic from 'next/dynamic';

// Dynamically import map to avoid SSR issues
const MapComponent = dynamic(
  () => import('@/components/MapComponent'),
  { ssr: false, loading: () => <div className="w-full h-full bg-gray-200 animate-pulse rounded-3xl" /> }
);

interface Destination {
  id: string;
  _id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  images: string[];
  type: string;
  tag: string;
  highlights: string[];
  featured: boolean;
  coordinates: {
    lat: number;
    lng: number;
    city: string;
    region: string;
  };
  region: string;
  country: string;
  attractions: string[];
  bestTimeToVisit: string[];
  bestTime: string[];
  averageStay: string;
  popularTours: number;
  tourCount: number;
  rating: number;
  status: string;
  imageCount: number;
  reviewCount: number;
  keywords?: string[];
  itinerary?: {
    day: number;
    title: string;
    description: string;
    activities: string[];
    accommodation: string;
    meals: string[];
  }[];
  unesco: boolean;
  isUnesco: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function DestinationDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [destination, setDestination] = useState<Destination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState<Set<string>>(new Set());
  const [isMounted, setIsMounted] = useState(false);
  const [activeDay, setActiveDay] = useState<number | null>(null);
  
  const heroRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.2]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.98]);

  useEffect(() => {
    setIsMounted(true);
    fetchDestination();
  }, [slug]);

  const fetchDestination = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/destinations/${slug}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch destination');
      }

      setDestination(data.data);
    } catch (err: any) {
      console.error('Error fetching destination:', err);
      setError(err.message || 'Failed to load destination');
    } finally {
      setLoading(false);
    }
  };

  const nextSlide = () => {
    if (destination?.images) {
      setCurrentSlide((prev) => (prev + 1) % destination.images.length);
    }
  };

  const prevSlide = () => {
    if (destination?.images) {
      setCurrentSlide((prev) => (prev - 1 + destination.images.length) % destination.images.length);
    }
  };

  const handleImageLoad = useCallback((id: string) => {
    setImagesLoaded(prev => new Set(prev).add(id));
  }, []);

  const toggleDay = (day: number) => {
    setActiveDay(activeDay === day ? null : day);
  };

  const getDestinationIcon = (type: string) => {
    const icons: { [key: string]: JSX.Element } = {
      'cultural': <RiAncientPavilionLine size={24} />,
      'nature': <FaTree size={24} />,
      'wildlife': <GiLion size={24} />,
      'mountain': <FaMountain size={24} />,
      'lake': <FaWater size={24} />,
      'historical': <RiAncientPavilionLine size={24} />,
      'religious': <GiTreeBranch size={24} />,
      'urban': <FiMapPin size={24} />,
      'adventure': <FiMapPin size={24} />,
    };
    return icons[type?.toLowerCase()] || <FiMapPin size={24} />;
  };

  const getTagColor = (tag: string) => {
    const colors: { [key: string]: string } = {
      'unesco': 'bg-[#735c00]',
      'featured': 'bg-[#004525]',
      'cultural': 'bg-[#8e44ad]',
      'wildlife': 'bg-[#2e7d32]',
      'nature': 'bg-[#2d6a4f]',
      'popular': 'bg-[#1f5d3a]',
      'hidden-gem': 'bg-[#6c4a3d]',
      'adventure': 'bg-[#c0392b]',
    };
    return colors[tag?.toLowerCase()] || 'bg-[#004525]';
  };

  if (loading) {
    return (
      <div className="pt-32 pb-20 overflow-x-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="animate-pulse">
            <div className="h-[500px] bg-gray-200 rounded-3xl mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-12 bg-gray-200 rounded w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-24 bg-gray-200 rounded"></div>
                  <div className="h-24 bg-gray-200 rounded"></div>
                </div>
              </div>
              <div className="lg:col-span-1">
                <div className="h-96 bg-gray-200 rounded-3xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !destination) {
    return (
      <div className="pt-32 pb-20 px-4 md:px-6 max-w-7xl mx-auto text-center">
        <h2 className="text-2xl font-semibold text-[#004525] mb-4">Destination Not Found</h2>
        <p className="text-[#404942] mb-6">{error || 'The destination you are looking for does not exist.'}</p>
        <Link
          href="/destinations"
          className="inline-block px-6 py-3 bg-[#004525] text-white rounded-lg hover:bg-[#1f5d3a] transition-colors"
        >
          Back to Destinations
        </Link>
      </div>
    );
  }

  const position: [number, number] = [
    destination.coordinates?.lat || 9.032,
    destination.coordinates?.lng || 38.7468
  ];

  const bestTimeToShow = destination.bestTimeToVisit?.length > 0 
    ? destination.bestTimeToVisit 
    : destination.bestTime?.length > 0 
      ? destination.bestTime 
      : ['Year Round'];

  return (
    <main className="bg-[#f8f9ff] min-h-screen pt-20">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <Link
          href="/destinations"
          className="inline-flex items-center gap-2 text-[#004525] hover:text-[#1f5d3a] transition-colors"
        >
          <FiArrowLeft size={20} />
          <span className="font-medium">Back to Destinations</span>
        </Link>
      </div>

      {/* Hero Section */}
      <section ref={heroRef} className="relative w-full h-[60vh] min-h-[500px] group overflow-hidden bg-[#1a1a2e]">
        <motion.div 
          className="absolute inset-0 z-0"
          style={{ opacity: heroOpacity, scale: heroScale }}
        >
          <div className="relative w-full h-full">
            {destination.images && destination.images.length > 0 ? (
              <>
                <div className={`absolute inset-0 bg-gradient-to-br from-[#004525] to-[#2d6a4f] transition-opacity duration-300 ${imagesLoaded.has(destination._id) ? 'opacity-0' : 'opacity-100'}`} />
                <Image
                  src={destination.images[currentSlide] || destination.images[0]}
                  alt={destination.name}
                  fill
                  className={`object-cover transition-opacity duration-500 ${
                    imagesLoaded.has(destination._id) ? 'opacity-100' : 'opacity-0'
                  }`}
                  priority
                  onLoad={() => handleImageLoad(destination._id)}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              </>
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#004525] to-[#2d6a4f] flex items-center justify-center text-white text-6xl font-bold">
                {destination.name.charAt(0)}
              </div>
            )}
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
        </motion.div>

        {/* Image counter */}
        {destination.images && destination.images.length > 1 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
            <span className="bg-black/50 text-white px-3 py-1 rounded-full text-xs">
              {currentSlide + 1} / {destination.images.length}
            </span>
          </div>
        )}

        {/* Tags */}
        <div className="absolute top-6 left-6 z-20 flex gap-2 flex-wrap">
          {(destination.unesco || destination.isUnesco) && (
            <span className="bg-[#735c00] text-white px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-2">
              <FiAward size={14} />
              UNESCO
            </span>
          )}
          {destination.tag && destination.tag !== 'UNESCO' && (
            <span className={`${getTagColor(destination.tag)} text-white px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider`}>
              {destination.tag}
            </span>
          )}
          {destination.featured && (
            <span className="bg-yellow-500 text-white px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider">
              Featured
            </span>
          )}
        </div>

        {/* Slider Controls */}
        {destination.images && destination.images.length > 1 && (
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
        {destination.images && destination.images.length > 1 && (
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {destination.images.map((_, index) => (
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
        <div className="absolute inset-0 flex items-end pb-12 px-4 md:px-6 max-w-7xl mx-auto z-10">
          <div className="max-w-3xl text-white">
            <div className="flex items-center gap-3 mb-3">
              <span className="flex items-center gap-2 text-sm bg-white/10 backdrop-blur-md px-3 py-1 rounded-full">
                {getDestinationIcon(destination.type)}
                {destination.type || 'Destination'}
              </span>
              <span className="flex items-center gap-2 text-sm bg-white/10 backdrop-blur-md px-3 py-1 rounded-full">
                <FiMapPin size={14} />
                {destination.coordinates?.region || destination.region || 'Ethiopia'}
              </span>
            </div>
            <h1 className="font-['Playfair_Display'] text-4xl md:text-6xl font-bold mb-3">
              {destination.name}
            </h1>
            <p className="text-lg text-white/90 max-w-2xl">
              {destination.shortDescription || destination.description}
            </p>
          </div>
        </div>
      </section>

      {/* Content Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Overview */}
          <section>
            <h2 className="font-['Playfair_Display'] text-3xl font-semibold text-[#004525] mb-4">
              About {destination.name}
            </h2>
            <p className="text-[#404942] text-lg leading-relaxed">
              {destination.description}
            </p>
          </section>

          {/* Highlights */}
          {destination.highlights && destination.highlights.length > 0 && (
            <section>
              <h3 className="font-['Playfair_Display'] text-2xl font-semibold text-[#004525] mb-4">
                Experience Highlights
              </h3>
              <div className="flex flex-wrap gap-2">
                {destination.highlights.map((highlight, index) => (
                  <span key={index} className="bg-[#004525]/10 text-[#004525] px-4 py-2 rounded-full text-sm font-medium">
                    {highlight}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Itinerary */}
          {destination.itinerary && destination.itinerary.length > 0 && (
            <section>
              <h3 className="font-['Playfair_Display'] text-2xl font-semibold text-[#004525] mb-4">
                Suggested Itinerary
              </h3>
              <div className="space-y-4">
                {destination.itinerary.map((day, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <button
                      onClick={() => toggleDay(index + 1)}
                      className="w-full flex justify-between items-center p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="text-left">
                        <span className="text-sm font-semibold text-[#004525]">Day {day.day}</span>
                        <h4 className="font-semibold text-[#004525]">{day.title}</h4>
                      </div>
                      <FiChevronDown 
                        size={20} 
                        className={`transition-transform text-[#004525] ${activeDay === index + 1 ? 'rotate-180' : ''}`}
                      />
                    </button>
                    <div className={`px-4 pb-4 ${activeDay === index + 1 ? 'block' : 'hidden'}`}>
                      <p className="text-[#404942] mb-3">{day.description}</p>
                      {day.activities && day.activities.length > 0 && (
                        <div className="mb-3">
                          <p className="text-sm font-semibold text-[#004525]">Activities:</p>
                          <ul className="list-disc list-inside text-sm text-[#404942]">
                            {day.activities.map((activity, idx) => (
                              <li key={idx}>{activity}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {day.accommodation && (
                        <p className="text-sm text-[#404942]">
                          <span className="font-semibold">Accommodation:</span> {day.accommodation}
                        </p>
                      )}
                      {day.meals && day.meals.length > 0 && (
                        <p className="text-sm text-[#404942]">
                          <span className="font-semibold">Meals:</span> {day.meals.join(', ')}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Attractions */}
          {destination.attractions && destination.attractions.length > 0 && (
            <section>
              <h3 className="font-['Playfair_Display'] text-2xl font-semibold text-[#004525] mb-4">
                Top Attractions
              </h3>
              <div className="flex flex-wrap gap-2">
                {destination.attractions.map((attraction, index) => (
                  <span key={index} className="bg-white px-4 py-2 rounded-full text-sm text-[#404942] border border-gray-200">
                    {attraction}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Quick Stats */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-white rounded-xl shadow-sm text-center">
              <FiClock size={24} className="text-[#004525] mx-auto mb-2" />
              <p className="text-xs font-medium uppercase tracking-widest text-[#707971]">Stay</p>
              <p className="font-semibold text-[#004525]">{destination.averageStay || '2-3 days'}</p>
            </div>
            <div className="p-4 bg-white rounded-xl shadow-sm text-center">
              <FiUsers size={24} className="text-[#004525] mx-auto mb-2" />
              <p className="text-xs font-medium uppercase tracking-widest text-[#707971]">Tours</p>
              <p className="font-semibold text-[#004525]">{destination.tourCount || 0}+</p>
            </div>
            <div className="p-4 bg-white rounded-xl shadow-sm text-center">
              <FiSun size={24} className="text-[#004525] mx-auto mb-2" />
              <p className="text-xs font-medium uppercase tracking-widest text-[#707971]">Best Time</p>
              <p className="font-semibold text-[#004525] text-sm">
                {bestTimeToShow.join(', ')}
              </p>
            </div>
            <div className="p-4 bg-white rounded-xl shadow-sm text-center">
              <FiMapPin size={24} className="text-[#004525] mx-auto mb-2" />
              <p className="text-xs font-medium uppercase tracking-widest text-[#707971]">Region</p>
              <p className="font-semibold text-[#004525] text-sm">{destination.region || 'Ethiopia'}</p>
            </div>
          </section>

          {/* Map Section */}
          <section>
            <h3 className="font-['Playfair_Display'] text-2xl font-semibold text-[#004525] mb-4">
              Location
            </h3>
            <div className="w-full h-[400px] rounded-3xl overflow-hidden shadow-lg relative bg-[#d0dbed]">
              {isMounted && (
                <MapComponent
                  center={position}
                  zoom={13}
                  destinationName={destination.name}
                  city={destination.coordinates?.city || destination.region || 'Ethiopia'}
                />
              )}
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-3 rounded-xl shadow-lg max-w-xs">
                <p className="text-xs font-semibold text-[#004525] uppercase tracking-wider">📍 Location</p>
                <p className="text-sm text-[#404942]">
                  {destination.coordinates?.city || destination.region || 'Ethiopia'}
                </p>
                <p className="text-xs text-[#707971] mt-1">
                  Lat: {position[0].toFixed(4)}, Lng: {position[1].toFixed(4)}
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Right: Sidebar */}
        <aside className="lg:col-span-1">
          <div className="sticky top-24 space-y-4">
            {/* Quick Info Card */}
            <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
              <h3 className="font-['Playfair_Display'] text-xl font-semibold text-[#004525] mb-4">
                Quick Info
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <FiMapPin className="text-[#004525] mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-[#707971]">Location</p>
                    <p className="text-sm text-[#404942]">
                      {destination.coordinates?.city || destination.region || 'Ethiopia'}, Ethiopia
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <FiClock className="text-[#004525] mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-[#707971]">Average Stay</p>
                    <p className="text-sm text-[#404942]">{destination.averageStay || '2-3 days'}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <FiUsers className="text-[#004525] mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-[#707971]">Available Tours</p>
                    <p className="text-sm text-[#404942]">{destination.tourCount || 0} tours available</p>
                  </div>
                </div>
                
                {bestTimeToShow.length > 0 && (
                  <div className="flex items-start gap-3">
                    <FiSun className="text-[#004525] mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-[#707971]">Best Time to Visit</p>
                      <p className="text-sm text-[#404942]">{bestTimeToShow.join(', ')}</p>
                    </div>
                  </div>
                )}

                {destination.rating > 0 && (
                  <div className="flex items-start gap-3">
                    <FiStar className="text-[#004525] mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-[#707971]">Rating</p>
                      <p className="text-sm text-[#404942]">{destination.rating.toFixed(1)} / 5.0</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* CTA Card */}
            <div className="bg-[#004525] p-6 rounded-3xl text-white relative overflow-hidden">
              <div className="relative z-10">
                <h4 className="font-['Playfair_Display'] text-2xl font-semibold mb-2">
                  Ready to Explore?
                </h4>
                <p className="text-white/80 text-sm mb-4">
                  Discover the beauty and culture of {destination.name} with our expert guides.
                </p>
                <Link href={`/tours?destination=${destination.slug}`}>
                  <button className="w-full bg-white text-[#004525] font-semibold py-3 rounded-xl hover:scale-105 transition-transform">
                    View Tours
                  </button>
                </Link>
              </div>
              <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-[#735c00]/20 rounded-full blur-2xl"></div>
            </div>

            {/* Share & Save */}
            <div className="flex gap-3">
              <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">
                <FiHeart className="text-[#004525]" />
                <span className="text-sm font-medium text-[#004525]">Save</span>
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">
                <FiShare2 className="text-[#004525]" />
                <span className="text-sm font-medium text-[#004525]">Share</span>
              </button>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}