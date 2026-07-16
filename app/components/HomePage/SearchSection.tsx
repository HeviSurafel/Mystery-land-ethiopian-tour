// components/HomePage/SearchSection.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Compass, Calendar, Search, Loader2, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Destination {
  id: string;
  _id: string;
  name: string;
  slug: string;
  region: string;
  type: string;
  coordinates?: {
    city: string;
    region: string;
  };
}

interface TourType {
  id: string;
  name: string;
  slug: string;
  count?: number;
}

interface DurationOption {
  id: string;
  label: string;
  value: string;
}

export default function SearchSection() {
  const router = useRouter();
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [tourTypes, setTourTypes] = useState<TourType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [formData, setFormData] = useState({
    destination: '',
    tourType: '',
    duration: ''
  });

  const durationOptions: DurationOption[] = [
    { id: 'any', label: 'Any Duration', value: '' },
    { id: '1-3', label: '1-3 Days', value: '1-3' },
    { id: '4-7', label: '4-7 Days', value: '4-7' },
    { id: '8-14', label: '8-14 Days', value: '8-14' },
    { id: '15+', label: '15+ Days', value: '15+' },
  ];

  useEffect(() => {
    fetchSearchData();
  }, []);

  const fetchSearchData = async () => {
    try {
      setLoading(true);
      
      // Fetch destinations
      const destResponse = await fetch('/api/destinations/featured?limit=20');
      const destData = await destResponse.json();
      
      if (destData.success) {
        setDestinations(destData.data || []);
      }

      // Fetch tour types from your tours API
      const tourResponse = await fetch('/api/tours?limit=100');
      const tourData = await tourResponse.json();
      
      if (tourData.success) {
        // Extract unique tour types/categories from tours
        const typesMap = new Map<string, number>();
        tourData.data.forEach((tour: any) => {
          const type = tour.type || tour.category || 'Other';
          if (type && typeof type === 'string') {
            typesMap.set(type, (typesMap.get(type) || 0) + 1);
          }
        });
        
        const uniqueTypes = Array.from(typesMap.entries()).map(([name, count]) => ({
          id: name.toLowerCase().replace(/\s+/g, '-'),
          name: name,
          slug: name.toLowerCase().replace(/\s+/g, '-'),
          count
        }));
        setTourTypes(uniqueTypes);
      }
    } catch (error) {
      console.error('Error fetching search data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    
    // Build search params
    const params = new URLSearchParams();
    
    // Map destination to location param
    if (formData.destination) {
      // Check if it's a region or specific destination
      const selectedDest = destinations.find(d => d.slug === formData.destination || d.name === formData.destination);
      if (selectedDest) {
        params.append('location', selectedDest.coordinates?.region || selectedDest.region || formData.destination);
      } else {
        params.append('location', formData.destination);
      }
    }
    
    if (formData.tourType) {
      params.append('category', formData.tourType);
    }
    
    if (formData.duration) {
      params.append('duration', formData.duration);
    }
    
    // Navigate to tours page with filters
    await router.push(`/tours?${params.toString()}`);
    setIsSearching(false);
  };

  const handlePopularSearch = (query: string) => {
    router.push(`/tours?location=${encodeURIComponent(query)}`);
  };

  const clearSearch = () => {
    setFormData({
      destination: '',
      tourType: '',
      duration: ''
    });
  };

  // Get unique regions from destinations
  const regions = [...new Set(destinations.map(d => d.coordinates?.region || d.region))].filter(Boolean);

  // Check if any filter is active
  const hasActiveFilters = formData.destination || formData.tourType || formData.duration;

  return (
    <section className="relative z-20 -mt-16 px-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 border border-[#c0c9bf]/20"
      >
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
          {/* Destinations */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#707971] uppercase tracking-wider flex items-center gap-1">
              <MapPin size={16} className="text-[#004525]" />
              Destinations
            </label>
            <select
              name="destination"
              value={formData.destination}
              onChange={handleInputChange}
              className="w-full bg-[#f8f9ff] border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#004525] focus:border-transparent text-base py-3 px-4 transition-all hover:border-[#004525]/30"
              disabled={loading}
            >
              <option value="">Where to go?</option>
              {loading ? (
                <option disabled>Loading destinations...</option>
              ) : (
                <>
                  {regions.length > 0 && (
                    <optgroup label="Regions">
                      {regions.map((region) => (
                        <option key={region} value={region}>
                          {region}
                        </option>
                      ))}
                    </optgroup>
                  )}
                  <optgroup label="Popular Destinations">
                    {destinations.slice(0, 10).map((dest) => (
                      <option key={dest.id} value={dest.slug}>
                        {dest.name}
                      </option>
                    ))}
                  </optgroup>
                </>
              )}
            </select>
          </div>

          {/* Tour Type */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#707971] uppercase tracking-wider flex items-center gap-1">
              <Compass size={16} className="text-[#004525]" />
              Tour Type
            </label>
            <select
              name="tourType"
              value={formData.tourType}
              onChange={handleInputChange}
              className="w-full bg-[#f8f9ff] border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#004525] focus:border-transparent text-base py-3 px-4 transition-all hover:border-[#004525]/30"
              disabled={loading}
            >
              <option value="">All Types</option>
              {loading ? (
                <option disabled>Loading types...</option>
              ) : (
                tourTypes.map((type) => (
                  <option key={type.id} value={type.slug}>
                    {type.name} {type.count ? `(${type.count})` : ''}
                  </option>
                ))
              )}
              {/* Fallback static types if API fails */}
              <optgroup label="Categories">
                <option value="cultural">Cultural</option>
                <option value="historical">Historical</option>
                <option value="nature">Nature & Wildlife</option>
                <option value="adventure">Adventure</option>
                <option value="religious">Religious Heritage</option>
                <option value="community">Community & Village</option>
              </optgroup>
            </select>
          </div>

          {/* Duration */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#707971] uppercase tracking-wider flex items-center gap-1">
              <Calendar size={16} className="text-[#004525]" />
              Duration
            </label>
            <select
              name="duration"
              value={formData.duration}
              onChange={handleInputChange}
              className="w-full bg-[#f8f9ff] border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#004525] focus:border-transparent text-base py-3 px-4 transition-all hover:border-[#004525]/30"
            >
              {durationOptions.map((option) => (
                <option key={option.id} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Search Button */}
          <div className="flex items-end gap-2">
            <button
              type="submit"
              disabled={isSearching}
              className="w-full bg-[#004525] text-white py-3 rounded-xl text-sm font-semibold hover:bg-[#1f5d3a] transition-all flex justify-center items-center gap-2 h-[48px] shadow-lg shadow-[#004525]/20 hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSearching ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search size={18} />
                  Find Tours
                </>
              )}
            </button>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearSearch}
                className="h-[48px] px-3 bg-gray-100 hover:bg-gray-200 rounded-xl text-[#707971] hover:text-[#004525] transition-all flex items-center justify-center"
                title="Clear filters"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </form>

        {/* Popular Searches */}
        {!loading && destinations.length > 0 && (
          <div className="mt-5 pt-4 border-t border-gray-100 flex flex-wrap items-center gap-2">
            <span className="text-xs text-[#707971] font-medium uppercase tracking-wider">Popular:</span>
            {destinations.slice(0, 5).map((dest) => (
              <button
                key={dest.id}
                onClick={() => handlePopularSearch(dest.name)}
                className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-[#004525] hover:text-white transition-all rounded-full text-[#404942] hover:shadow-md"
              >
                {dest.name}
              </button>
            ))}
            <button
              onClick={() => router.push('/destinations')}
              className="text-xs px-3 py-1.5 text-[#004525] hover:text-[#735c00] transition-colors font-medium hover:underline"
            >
              View All →
            </button>
          </div>
        )}

        {/* Quick Stats */}
        {!loading && destinations.length > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-[#707971]">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#004525]"></span>
              {destinations.length} Destinations
            </span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#735c00]"></span>
              {tourTypes.length} Tour Types
            </span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#97f3b5]"></span>
              10+ Years Experience
            </span>
          </div>
        )}
      </motion.div>
    </section>
  );
}