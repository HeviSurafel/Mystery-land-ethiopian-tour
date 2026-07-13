// components/HomePage/FeaturedTours.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Star, Users, Clock, MapPin, ArrowRight, Loader2 } from 'lucide-react';

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
  price?: number;
}

export default function FeaturedTours() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFeaturedTours();
  }, []);

  const fetchFeaturedTours = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/tours?featured=true&limit=3');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch featured tours');
      }

      setTours(data.data || []);
    } catch (err: any) {
      console.error('Error fetching featured tours:', err);
      setError(err.message || 'Failed to load featured tours');
    } finally {
      setLoading(false);
    }
  };

  // Format price if available, otherwise use default
  const formatPrice = (price?: number) => {
    if (price) {
      return `$${price.toLocaleString()} pp`;
    }
    return 'Contact for pricing';
  };

  // Get the first image or use a fallback
  const getImageUrl = (tour: Tour) => {
    if (tour.images && tour.images.length > 0) {
      return tour.images[0];
    }
    return `https://picsum.photos/seed/${tour.slug}/800/600`;
  };

  if (loading) {
    return (
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <motion.h2
          className="font-['Playfair_Display'] text-4xl font-semibold text-[#004525] mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Curated Adventure Packages
        </motion.h2>
        <div className="flex flex-col gap-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white rounded-2xl overflow-hidden shadow-md border border-[#c0c9bf] animate-pulse">
            <div className="lg:col-span-7 h-[400px] lg:h-auto bg-gray-200" />
            <div className="lg:col-span-5 p-6 flex flex-col justify-center space-y-4">
              <div className="h-6 bg-gray-200 rounded w-1/3" />
              <div className="h-8 bg-gray-200 rounded w-3/4" />
              <div className="h-20 bg-gray-200 rounded w-full" />
              <div className="grid grid-cols-3 gap-4 py-4 border-t border-b border-gray-200">
                <div className="h-12 bg-gray-200 rounded" />
                <div className="h-12 bg-gray-200 rounded" />
                <div className="h-12 bg-gray-200 rounded" />
              </div>
              <div className="h-12 bg-gray-200 rounded-full w-full" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <motion.h2
          className="font-['Playfair_Display'] text-4xl font-semibold text-[#004525] mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Curated Adventure Packages
        </motion.h2>
        <div className="text-center py-12">
          <p className="text-red-600">{error}</p>
          <button
            onClick={fetchFeaturedTours}
            className="mt-4 px-6 py-2 bg-[#004525] text-white rounded-lg hover:bg-[#1f5d3a] transition-colors"
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  if (!tours.length) {
    return (
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <motion.h2
          className="font-['Playfair_Display'] text-4xl font-semibold text-[#004525] mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Curated Adventure Packages
        </motion.h2>
        <p className="text-center text-[#404942]">No featured tours available at the moment.</p>
      </section>
    );
  }

  // Display the first tour prominently (main featured tour)
  const mainTour = tours[0];

  return (
    <section className="py-20 px-6 max-w-7xl mx-auto">
      <motion.h2
        className="font-['Playfair_Display'] text-4xl font-semibold text-[#004525] mb-12 text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        Curated Adventure Packages
      </motion.h2>

      <motion.div
        className="flex flex-col gap-12"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
      >
        {/* Main Featured Tour */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white rounded-2xl overflow-hidden shadow-md border border-[#c0c9bf] group hover:shadow-xl transition-shadow duration-300">
          <div className="lg:col-span-7 h-[400px] lg:h-auto overflow-hidden relative">
            <Image
              src={getImageUrl(mainTour)}
              alt={mainTour.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  parent.className = 'lg:col-span-7 h-[400px] lg:h-auto overflow-hidden bg-gradient-to-br from-[#004525] to-[#2d6a4f] flex items-center justify-center text-white text-4xl font-bold';
                  parent.textContent = mainTour.name.charAt(0);
                }
              }}
              priority
            />
            {mainTour.tag && (
              <div className="absolute top-4 left-4 z-10">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${
                  mainTour.tag === 'UNESCO' ? 'bg-[#735c00] text-white' : 
                  mainTour.tag === 'Premium' ? 'bg-amber-500 text-white' :
                  'bg-[#004525] text-white'
                }`}>
                  {mainTour.tag}
                </span>
              </div>
            )}
          </div>
          <div className="lg:col-span-5 p-6 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-3 flex-wrap">
              <span className="bg-[#ffe088] text-[#241a00] text-xs font-semibold px-3 py-1 rounded">
                {mainTour.featured ? '⭐ Featured' : 'Recommended'}
              </span>
              {mainTour.rating > 0 && (
                <span className="text-[#404942] text-xs font-semibold flex items-center gap-1">
                  <Star size={16} fill="currentColor" className="text-yellow-400" /> 
                  {mainTour.rating.toFixed(1)} ({mainTour.reviewCount || 0} reviews)
                </span>
              )}
            </div>
            <h3 className="font-['Playfair_Display'] text-2xl font-semibold mb-2 text-[#004525]">
              {mainTour.name}
            </h3>
            <p className="text-sm text-[#404942] mb-2 flex items-center gap-1">
              <MapPin size={14} className="text-[#707971]" />
              {mainTour.coordinates?.city || mainTour.coordinates?.region || 'Ethiopia'}
            </p>
            <p className="text-base text-[#404942] mb-6 line-clamp-3">
              {mainTour.description}
            </p>
            <div className="flex items-center justify-between mb-6 border-t border-b border-[#c0c9bf] py-4">
              <div>
                <p className="text-xs font-semibold text-[#707971] uppercase flex items-center gap-1">
                  <Clock size={14} /> Duration
                </p>
                <p className="font-bold text-[#004525]">{mainTour.duration}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-[#707971] uppercase flex items-center gap-1">
                  <Users size={14} /> Group Size
                </p>
                <p className="font-bold text-[#004525]">{mainTour.groupSize || 'Max 8'}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-[#707971] uppercase">Difficulty</p>
                <p className="font-bold text-[#004525] text-sm">{mainTour.difficulty || 'Moderate'}</p>
              </div>
            </div>
            <Link href={`/tours/${mainTour.slug}`}>
              <button className="bg-[#004525] text-white w-full py-4 rounded-full text-sm font-semibold hover:bg-[#1f5d3a] transition-all flex items-center justify-center gap-2 group/btn">
                View Full Itinerary
                <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </Link>
          </div>
        </div>

        {/* Additional Featured Tours (if more than 1) */}
        {tours.length > 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tours.slice(1).map((tour, index) => (
              <motion.div
                key={tour._id || tour.id || index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group bg-white rounded-xl overflow-hidden shadow-md border border-[#c0c9bf] hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={getImageUrl(tour)}
                    alt={tour.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.className = 'relative h-56 overflow-hidden bg-gradient-to-br from-[#004525] to-[#2d6a4f] flex items-center justify-center text-white text-3xl font-bold';
                        parent.textContent = tour.name.charAt(0);
                      }
                    }}
                  />
                  {tour.tag && (
                    <div className="absolute top-3 left-3 z-10">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                        tour.tag === 'UNESCO' ? 'bg-[#735c00] text-white' : 
                        tour.tag === 'Premium' ? 'bg-amber-500 text-white' :
                        'bg-[#004525] text-white'
                      }`}>
                        {tour.tag}
                      </span>
                    </div>
                  )}
                  {tour.rating > 0 && (
                    <div className="absolute top-3 right-3 z-10">
                      <span className="bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                        <Star size={12} fill="currentColor" className="text-yellow-400" />
                        {tour.rating.toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h4 className="font-['Playfair_Display'] text-xl font-semibold text-[#004525] mb-1 group-hover:text-[#1f5d3a] transition-colors line-clamp-1">
                    {tour.name}
                  </h4>
                  <p className="text-sm text-[#404942] mb-2 line-clamp-2">
                    {tour.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-[#707971] mb-3">
                    <span className="flex items-center gap-1">
                      <Clock size={12} /> {tour.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users size={12} /> {tour.groupSize || 'Max 8'}
                    </span>
                  </div>
                  <Link href={`/tours/${tour.slug}`}>
                    <button className="w-full py-2.5 bg-[#004525]/10 text-[#004525] rounded-full text-sm font-semibold hover:bg-[#004525] hover:text-white transition-all">
                      View Details
                    </button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </section>
  );
}