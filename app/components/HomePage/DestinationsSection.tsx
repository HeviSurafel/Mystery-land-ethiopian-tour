// components/HomePage/DestinationsSection.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, Star, MapPin, Clock, Users } from 'lucide-react';

interface Destination {
  id: string;
  _id: string;
  name: string;
  slug: string;
  description: string;
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
  averageStay: string;
  popularTours: number;
  tourCount: number;
  rating: number;
  status: string;
  imageCount: number;
  reviewCount: number;
  keywords?: string[];
}

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

export default function DestinationsSection() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/destinations/featured?limit=6');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch destinations');
      }

      setDestinations(data.data || []);
    } catch (err: any) {
      console.error('Error fetching destinations:', err);
      setError(err.message || 'Failed to load destinations');
    } finally {
      setLoading(false);
    }
  };

  // Loading State
  if (loading) {
    return (
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="font-['Playfair_Display'] text-4xl font-semibold text-[#004525]">
              Popular Destinations
            </h2>
            <p className="text-lg text-[#404942] max-w-md">
              Loading our most sought-after retreats...
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="aspect-[4/5] rounded-xl overflow-hidden bg-gray-200 animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  // Error State
  if (error) {
    return (
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center py-12">
          <p className="text-red-600">{error}</p>
          <button
            onClick={fetchDestinations}
            className="mt-4 px-6 py-2 bg-[#004525] text-white rounded-lg hover:bg-[#1f5d3a] transition-colors"
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  // No destinations
  if (!destinations.length) {
    return (
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center py-12">
          <p className="text-[#404942]">No destinations available at the moment.</p>
        </div>
      </section>
    );
  }

  // Get first 3 destinations for display
  const displayDestinations = destinations.slice(0, 3);

  return (
    <section className="py-20 px-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h2 className="font-['Playfair_Display'] text-4xl font-semibold text-[#004525]">
            Popular Destinations
          </h2>
          <p className="text-lg text-[#404942] max-w-md">
            Our most sought-after retreats chosen by discerning travelers worldwide.
          </p>
        </div>
        <Link
          href="/destinations"
          className="hidden md:flex items-center gap-1 text-[#004525] text-sm font-semibold hover:underline group"
        >
          View All Destinations
          <ArrowUpRight size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </Link>
      </div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={stagger}
      >
        {displayDestinations.map((dest, index) => {
          // Get the first image or use a fallback
          const imageUrl = dest.images && dest.images.length > 0 
            ? dest.images[0] 
            : `/${dest.slug}/800/600`;
          
          // Get region from coordinates or fallback
          const region = dest.coordinates?.region || dest.region || 'Ethiopia';
          
          // Get city from coordinates or fallback
          const city = dest.coordinates?.city || dest.region || 'Ethiopia';

          return (
            <motion.div
              key={dest._id || dest.id || index}
              variants={fadeInUp}
              className="group relative aspect-[4/5] rounded-xl overflow-hidden hover:shadow-2xl transition-shadow duration-500"
            >
              {/* Image */}
              <div className="absolute inset-0 bg-gray-200">
                <Image
                  src={imageUrl}
                  alt={dest.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.className = 'absolute inset-0 bg-gradient-to-br from-[#004525] to-[#2d6a4f] flex items-center justify-center text-white text-4xl font-bold';
                      parent.textContent = dest.name.charAt(0);
                    }
                  }}
                  priority={index < 2}
                />
              </div>
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              
              {/* Tag Badge */}
              {dest.tag && (
                <div className="absolute top-4 left-4 z-10">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                    dest.tag === 'UNESCO' ? 'bg-[#735c00] text-white' : 
                    dest.tag === 'Cultural' ? 'bg-[#8e44ad] text-white' :
                    'bg-[#004525] text-white'
                  }`}>
                    {dest.tag}
                  </span>
                </div>
              )}
              
              {/* Featured Badge */}
              {dest.featured && (
                <div className="absolute top-4 left-20 z-10">
                  <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                    Featured
                  </span>
                </div>
              )}

              {/* Rating */}
              {dest.rating > 0 && (
                <div className="absolute top-4 right-4 z-10">
                  <span className="bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-semibold border border-white/20 flex items-center gap-1">
                    <Star size={14} fill="currentColor" className="text-yellow-400" /> 
                    {dest.rating.toFixed(1)}
                  </span>
                </div>
              )}

              {/* Tour Count */}
              {dest.tourCount > 0 && (
                <div className="absolute top-16 right-4 z-10">
                  <span className="bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                    <Users size={12} />
                    {dest.tourCount} tours
                  </span>
                </div>
              )}

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <p className="text-xs font-semibold uppercase tracking-widest text-white/80 mb-1 flex items-center gap-1">
                  <MapPin size={12} />
                  {city}, {region}
                </p>
                <h3 className="font-['Playfair_Display'] text-2xl font-semibold mb-1">
                  {dest.name}
                </h3>
                <p className="text-sm text-white/80 line-clamp-2 mb-3">
                  {dest.description }
                </p>
                
                <div className="flex flex-wrap gap-2 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                  {dest.bestTimeToVisit && dest.bestTimeToVisit.length > 0 && (
                    <span className="bg-[#004525]/80 backdrop-blur-sm px-3 py-1 rounded text-xs font-semibold flex items-center gap-1">
                      <Clock size={12} />
                      {dest.bestTimeToVisit.join(', ')}
                    </span>
                  )}
                  {dest.averageStay && (
                    <span className="bg-[#004525]/80 backdrop-blur-sm px-3 py-1 rounded text-xs font-semibold">
                      {dest.averageStay}
                    </span>
                  )}
                  <span className="bg-[#735c00]/80 backdrop-blur-sm px-3 py-1 rounded text-xs font-semibold">
                    {dest.type || 'Cultural'}
                  </span>
                </div>

                <Link href={`/destinations/${dest.slug}`}>
                  <button className="mt-4 flex items-center gap-2 text-sm font-semibold bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all px-4 py-2 rounded-full group/btn">
                    Explore
                    <ArrowUpRight size={16} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                  </button>
                </Link>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Mobile View All */}
      <div className="mt-8 text-center md:hidden">
        <Link
          href="/destinations"
          className="inline-flex items-center gap-2 text-[#004525] font-semibold hover:underline"
        >
          View All Destinations
          <ArrowUpRight size={20} />
        </Link>
      </div>
    </section>
  );
}