// components/DestinationsPage.tsx
'use client';

import { useState, useEffect, JSX, useMemo, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import {
  FiChevronLeft,
  FiChevronRight,
  FiArrowRight,
  FiMapPin,
  FiUsers,
  FiSearch,
} from 'react-icons/fi';
import { MdOutlineExplore } from 'react-icons/md';
import { GiLion } from 'react-icons/gi';
import { FaTree, FaMountain, FaWater } from 'react-icons/fa';
import { RiAncientPavilionLine } from 'react-icons/ri';
import { MdHistoryEdu, MdSelfImprovement } from 'react-icons/md';

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

interface DestinationsPageProps {
  initialDestinations?: Destination[];
}

// Cache for fetched data
let cachedDestinations: Destination[] | null = null;
let fetchPromise: Promise<Destination[]> | null = null;

export default function DestinationsPage({ initialDestinations = [] }: DestinationsPageProps) {
  const [destinations, setDestinations] = useState<Destination[]>(() => {
    return cachedDestinations || initialDestinations;
  });
  const [loading, setLoading] = useState(!destinations.length);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [imagesLoaded, setImagesLoaded] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const itemsPerPage = 9;
  const hasFetched = useRef(false);

  // Types for filtering
  const types = [
    { value: 'all', label: 'All' },
    { value: 'cultural', label: 'Cultural' },
    { value: 'nature', label: 'Nature' },
    { value: 'wildlife', label: 'Wildlife' },
    { value: 'historical', label: 'Historical' },
    { value: 'mountain', label: 'Mountain' },
    { value: 'lake', label: 'Lake' },
  ];

  const fetchDestinations = useCallback(async (forceRefresh = false) => {
    if (!forceRefresh && cachedDestinations) {
      setDestinations(cachedDestinations);
      setLoading(false);
      return cachedDestinations;
    }

    if (fetchPromise) {
      try {
        const data = await fetchPromise;
        setDestinations(data);
        setLoading(false);
        return data;
      } catch (err) {
        throw err;
      }
    }

    fetchPromise = (async () => {
      try {
        const response = await fetch('/api/destinations?limit=100');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.success) {
          throw new Error(data.error || 'Failed to fetch destinations');
        }
        
        const destinationsData = (data.data || []).map((item: any) => ({
          ...item,
          id: item.id || item._id,
          _id: item._id || item.id,
        }));
        
        cachedDestinations = destinationsData;
        return destinationsData;
      } catch (err: any) {
        console.error('Error fetching destinations:', err);
        throw err;
      } finally {
        fetchPromise = null;
      }
    })();

    try {
      const data = await fetchPromise;
      setDestinations(data);
      setLoading(false);
      return data;
    } catch (err: any) {
      setError(err.message || 'Failed to load destinations');
      setLoading(false);
      throw err;
    }
  }, []);

  useEffect(() => {
    if (!hasFetched.current && !destinations.length) {
      hasFetched.current = true;
      fetchDestinations();
    }
  }, [fetchDestinations, destinations.length]);

  // Filter destinations based on search and type
  const filteredDestinations = useMemo(() => {
    let result = destinations;
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(dest => 
        dest.name.toLowerCase().includes(query) ||
        dest.description.toLowerCase().includes(query) ||
        dest.region?.toLowerCase().includes(query) ||
        dest.coordinates?.city?.toLowerCase().includes(query)
      );
    }
    
    // Filter by type
    if (selectedType !== 'all') {
      result = result.filter(dest => 
        dest.type?.toLowerCase() === selectedType.toLowerCase()
      );
    }
    
    return result;
  }, [destinations, searchQuery, selectedType]);

  // Pagination
  const paginatedData = useMemo(() => {
    const totalPages = Math.ceil(filteredDestinations.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const displayed = filteredDestinations.slice(startIndex, startIndex + itemsPerPage);
    return { totalPages, displayed };
  }, [filteredDestinations, currentPage]);

  const { totalPages, displayed: displayedDestinations } = paginatedData;

  const nextPage = useCallback(() => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentPage, totalPages]);

  const prevPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentPage]);

  const goToPage = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const getDestinationIcon = useCallback((type: string) => {
    const icons: { [key: string]: JSX.Element } = {
      'cultural': <RiAncientPavilionLine size={20} />,
      'nature': <FaTree size={20} />,
      'wildlife': <GiLion size={20} />,
      'mountain': <FaMountain size={20} />,
      'lake': <FaWater size={20} />,
      'historical': <MdHistoryEdu size={20} />,
      'spiritual': <MdSelfImprovement size={20} />,
    };
    return icons[type?.toLowerCase()] || <FiMapPin size={20} />;
  }, []);

  const getGradient = useCallback((type: string) => {
    const gradients: { [key: string]: string } = {
      'cultural': 'from-[#004525]/80 via-[#004525]/40 to-transparent',
      'nature': 'from-[#2d6a4f]/80 via-[#2d6a4f]/40 to-transparent',
      'wildlife': 'from-[#735c00]/80 via-[#735c00]/40 to-transparent',
      'mountain': 'from-[#4a4a4a]/80 via-[#4a4a4a]/40 to-transparent',
      'lake': 'from-[#0077b6]/80 via-[#0077b6]/40 to-transparent',
      'historical': 'from-[#6c4a3d]/80 via-[#6c4a3d]/40 to-transparent',
      'spiritual': 'from-[#4a2c6e]/80 via-[#4a2c6e]/40 to-transparent',
    };
    return gradients[type?.toLowerCase()] || 'from-[#004525]/80 via-[#004525]/40 to-transparent';
  }, []);

  const getTagColor = useCallback((tag: string) => {
    const colors: { [key: string]: string } = {
      'unesco': 'bg-[#735c00]',
      'featured': 'bg-[#004525]',
      'popular': 'bg-[#1f5d3a]',
      'hidden-gem': 'bg-[#6c4a3d]',
      'adventure': 'bg-[#c0392b]',
      'cultural': 'bg-[#8e44ad]',
      'wildlife': 'bg-[#2e7d32]',
      'nature': 'bg-[#2d6a4f]',
    };
    return colors[tag?.toLowerCase()] || 'bg-[#004525]';
  }, []);

  const handleImageLoad = useCallback((id: string) => {
    setImagesLoaded(prev => new Set(prev).add(id));
  }, []);

  // Loading State
  if (loading && !destinations.length) {
    return (
      <div className="pt-32 pb-20 overflow-x-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
              <div key={i} className="bg-white rounded-[32px] shadow-lg overflow-hidden animate-pulse">
                <div className="h-64 bg-gray-200"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-20 bg-gray-200 rounded w-full mb-4"></div>
                  <div className="flex gap-2">
                    <div className="h-8 bg-gray-200 rounded w-16"></div>
                    <div className="h-8 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error && !loading && !destinations.length) {
    return (
      <div className="pt-32 pb-20 overflow-x-hidden">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 max-w-md mx-auto">
            <p className="text-red-700 font-semibold mb-2">Unable to load destinations</p>
            <p className="text-red-600 text-sm">{error}</p>
            <button
              onClick={() => {
                cachedDestinations = null;
                fetchDestinations(true);
              }}
              className="mt-4 px-6 py-2 bg-[#004525] text-white rounded-lg hover:bg-[#1f5d3a] transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // No destinations
  if (!destinations.length) {
    return (
      <div className="pt-32 pb-20 overflow-x-hidden">
        <div className="max-w-7xl mx-auto px-6 text-center py-20">
          <p className="text-[#404942]">No destinations available at the moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 overflow-x-hidden">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 mb-12 text-center">
        <motion.div
          initial="initial"
          animate="animate"
          variants={stagger}
        >
          <motion.div
            variants={fadeInUp}
            className="inline-flex items-center gap-3 px-4 py-2 bg-[#97f3b5]/30 text-[#047240] rounded-full mb-4"
          >
            <MdOutlineExplore size={16} />
            <span className="text-xs font-semibold uppercase tracking-widest">
              Discover East Africa's Hidden Gems
            </span>
          </motion.div>
          <motion.h1
            variants={fadeInUp}
            className="font-['Playfair_Display'] text-4xl md:text-6xl text-[#004525] mb-4"
          >
            Explore the <span className="italic text-[#735c00]">Heart</span> of East Africa
          </motion.h1>
          <motion.p
            variants={fadeInUp}
            className="max-w-2xl mx-auto text-lg text-[#404942]"
          >
            From the ancient rock-hewn churches of Lalibela to the wildlife-rich savannas of the Rift Valley, discover Ethiopia's extraordinary landscapes and cultural treasures.
          </motion.p>
        </motion.div>
      </section>

      {/* Search and Filter Bar */}
      <section className="max-w-7xl mx-auto px-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#707971]" />
            <input
              type="text"
              placeholder="Search destinations by name, region, or description..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-12 pr-4 py-3 bg-white rounded-full border border-gray-200 focus:border-[#004525] focus:ring-2 focus:ring-[#004525]/20 outline-none transition-all"
            />
          </div>

          {/* Type Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
            {types.map((type) => (
              <button
                key={type.value}
                onClick={() => {
                  setSelectedType(type.value);
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  selectedType === type.value
                    ? 'bg-[#004525] text-white'
                    : 'bg-white text-[#404942] hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Destination Grid */}
      <section className="max-w-7xl mx-auto px-6" id="explore-destinations">
        {/* Results count */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-[#404942]">
            Showing <span className="font-semibold text-[#004525]">{filteredDestinations.length}</span> destinations
          </p>
          {filteredDestinations.length > 0 && (
            <p className="text-sm text-[#707971]">
              Page {currentPage} of {totalPages}
            </p>
          )}
        </div>

        {/* Bento Grid */}
        <AnimatePresence mode="wait">
          {filteredDestinations.length > 0 ? (
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-12 gap-6"
            >
              {displayedDestinations.map((destination, index) => {
                const isLarge = index === 0;
                const isMedium = index === 1 || index === 2;
                const colSpan = isLarge ? 'md:col-span-8' : isMedium ? 'md:col-span-4' : 'md:col-span-4';
                const height = isLarge ? 'h-[500px]' : 'h-[400px]';
                const imageId = destination._id || destination.id;
                const isImageLoaded = imagesLoaded.has(imageId);

                return (
                  <motion.div
                    key={destination._id || destination.id || index}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className={`${colSpan} group relative overflow-hidden rounded-[32px] ${height} shadow-lg bg-gray-200`}
                  >
                    {/* Image */}
                    <div className="absolute inset-0">
                      {destination.images && destination.images.length > 0 ? (
                        <>
                          <div className={`absolute inset-0 bg-gradient-to-br from-[#004525] to-[#2d6a4f] transition-opacity duration-300 ${isImageLoaded ? 'opacity-0' : 'opacity-100'}`} />
                          <Image
                            src={destination.images[0]}
                            alt={destination.name}
                            fill
                            className={`object-cover transition-opacity duration-500 ${
                              isImageLoaded ? 'opacity-100' : 'opacity-0'
                            }`}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            onLoad={() => handleImageLoad(imageId)}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const parent = target.parentElement;
                              if (parent) {
                                parent.className = 'absolute inset-0 bg-gradient-to-br from-[#004525] to-[#2d6a4f]';
                              }
                            }}
                            priority={index < 3}
                            quality={90}
                          />
                        </>
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#004525] to-[#2d6a4f] flex items-center justify-center text-white text-4xl font-bold">
                          {destination.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    
                    <div className={`absolute inset-0 bg-gradient-to-t ${getGradient(destination.type)}`} />

                    {/* Tags */}
                    <div className="absolute top-4 left-4 z-10 flex gap-2 flex-wrap">
                      {destination.tag && (
                        <span className={`${getTagColor(destination.tag)} text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest`}>
                          {destination.tag.replace('-', ' ')}
                        </span>
                      )}
                      {destination.featured && (
                        <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                          Featured
                        </span>
                      )}
                    </div>

                    {/* Tour Count */}
                    {destination.tourCount > 0 && (
                      <div className="absolute top-4 right-4 z-10 flex items-center gap-1 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
                        <FiUsers size={14} />
                        <span className="font-semibold">{destination.tourCount}</span>
                        <span className="text-white/60 text-xs">tours</span>
                      </div>
                    )}

                    {/* Content */}
                    <div className="absolute bottom-0 left-0 w-full p-6 text-white">
                      <div className="flex flex-wrap items-center gap-3 mb-3">
                        <span className="flex items-center gap-1 text-xs font-semibold bg-white/10 backdrop-blur-md px-2 py-0.5 rounded-full">
                          {getDestinationIcon(destination.type)}
                          {destination.type || 'Destination'}
                        </span>
                        <span className="flex items-center gap-1 text-xs font-semibold bg-white/10 backdrop-blur-md px-2 py-0.5 rounded-full">
                          <FiMapPin size={12} />
                          {destination.coordinates?.region || destination.region || 'Ethiopia'}
                        </span>
                      </div>

                      <h3 className="font-['Playfair_Display'] text-2xl font-semibold mb-1">
                        {destination.name}
                      </h3>
                      <p className="text-sm opacity-90 line-clamp-2 max-w-lg">
                        {destination.description}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-6">
                        {destination.bestTimeToVisit && destination.bestTimeToVisit.length > 0 && (
                          <div>
                            <span className="text-[10px] uppercase opacity-70 block mb-1">Best Time</span>
                            <span className="text-sm font-semibold">
                              {destination.bestTimeToVisit.join(' — ')}
                            </span>
                          </div>
                        )}
                        {destination.averageStay && (
                          <div>
                            <span className="text-[10px] uppercase opacity-70 block mb-1">Stay</span>
                            <span className="text-sm font-semibold">{destination.averageStay}</span>
                          </div>
                        )}
                        {destination.tourCount > 0 && (
                          <div>
                            <span className="text-[10px] uppercase opacity-70 block mb-1">Tours</span>
                            <span className="text-sm font-semibold">{destination.tourCount}+</span>
                          </div>
                        )}
                      </div>

                      <Link href={`/destinations/${destination.slug}`}>
                        <button className="mt-6 flex items-center gap-2 text-sm font-bold group/btn bg-white/10 backdrop-blur-md px-4 py-2 rounded-full hover:bg-white/20 transition-all">
                          Explore Destination
                          <FiArrowRight size={16} className="group-hover/btn:translate-x-2 transition-transform" />
                        </button>
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-[#004525] mb-2">No destinations found</h3>
              <p className="text-[#404942]">
                Try adjusting your search or filter criteria
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedType('all');
                  setCurrentPage(1);
                }}
                className="mt-4 px-6 py-2 bg-[#004525] text-white rounded-full hover:bg-[#1f5d3a] transition-colors"
              >
                Clear filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-wrap justify-center items-center gap-2 mt-8">
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-xl border transition-all ${
                currentPage === 1
                  ? 'opacity-50 cursor-not-allowed border-gray-200 text-gray-400'
                  : 'border-gray-200 hover:border-[#004525] hover:text-[#004525] text-[#404942]'
              }`}
            >
              <FiChevronLeft className="inline" /> Previous
            </button>

            <div className="flex gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => goToPage(pageNum)}
                    className={`w-10 h-10 rounded-xl transition-all ${
                      currentPage === pageNum
                        ? 'bg-[#004525] text-white shadow-lg shadow-[#004525]/30'
                        : 'hover:bg-gray-100 text-[#404942]'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-xl border transition-all ${
                currentPage === totalPages
                  ? 'opacity-50 cursor-not-allowed border-gray-200 text-gray-400'
                  : 'border-gray-200 hover:border-[#004525] hover:text-[#004525] text-[#404942]'
              }`}
            >
              Next <FiChevronRight className="inline" />
            </button>
          </div>
        )}
      </section>

      {/* Newsletter / CTA */}
      <section className="max-w-7xl mx-auto px-6 mt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="bg-[#004525] p-6 md:p-12 rounded-[48px] relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#735c00]/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#2d6a4f]/20 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left max-w-xl">
              <h2 className="font-['Playfair_Display'] text-3xl md:text-4xl font-semibold text-white mb-3">
                Discover Ethiopia's Secrets
              </h2>
              <p className="text-white/80 text-lg">
                Subscribe for exclusive access to hidden gems, cultural experiences, and luxury adventures across East Africa.
              </p>
            </div>
            <div className="w-full md:w-auto">
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  className="bg-white/10 border border-white/20 rounded-full px-6 py-3 text-white placeholder:text-white/40 focus:ring-2 focus:ring-[#95d5a8] w-full sm:w-80 outline-none"
                  placeholder="Your email address"
                  type="email"
                />
                <button className="bg-[#735c00] text-white px-8 py-3 rounded-full text-sm font-semibold hover:scale-105 transition-transform whitespace-nowrap">
                  Join the Journey
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}