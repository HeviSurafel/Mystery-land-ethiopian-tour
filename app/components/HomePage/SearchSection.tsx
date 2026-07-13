// components/HomePage/SearchSection.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Compass, Calendar, Search, Loader2 } from 'lucide-react';
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
        const types: string[] = tourData.data
          .map((tour: any) => tour.type || tour.category)
          .filter((type: string) => type && typeof type === 'string');
        
        const uniqueTypes = [...new Set(types)].map((type: string) => ({
          id: type.toLowerCase().replace(/\s+/g, '-'),
          name: type,
          slug: type.toLowerCase().replace(/\s+/g, '-')
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Build search params
    const params = new URLSearchParams();
    if (formData.destination) params.append('destination', formData.destination);
    if (formData.tourType) params.append('category', formData.tourType);
    if (formData.duration) params.append('duration', formData.duration);
    
    // Navigate to tours page with filters
    router.push(`/tours?${params.toString()}`);
  };

  // Get unique regions from destinations
  const regions = [...new Set(destinations.map(d => d.coordinates?.region || d.region))].filter(Boolean);

  return (
    <section className="relative z-20 -mt-16 px-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="bg-white rounded-xl shadow-xl p-6 border border-[#c0c9bf]"
      >
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Destinations */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#707971] uppercase flex items-center gap-1">
              <MapPin size={18} />
              Destinations
            </label>
            <select
              name="destination"
              value={formData.destination}
              onChange={handleInputChange}
              className="w-full bg-[#ffffff] border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#004525] focus:border-transparent text-base py-3 px-3 transition-all"
              disabled={loading}
            >
              <option value="">Where to go?</option>
              {loading ? (
                <option disabled>Loading destinations...</option>
              ) : (
                <>
                  {regions.map((region) => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  ))}
                  {destinations.slice(0, 10).map((dest) => (
                    <option key={dest.id} value={dest.slug}>
                      {dest.name}
                    </option>
                  ))}
                </>
              )}
            </select>
          </div>

          {/* Tour Type */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#707971] uppercase flex items-center gap-1">
              <Compass size={18} />
              Tour Type
            </label>
            <select
              name="tourType"
              value={formData.tourType}
              onChange={handleInputChange}
              className="w-full bg-[#ffffff] border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#004525] focus:border-transparent text-base py-3 px-3 transition-all"
              disabled={loading}
            >
              <option value="">All Types</option>
              {loading ? (
                <option disabled>Loading types...</option>
              ) : (
                tourTypes.map((type) => (
                  <option key={type.id} value={type.slug}>
                    {type.name}
                  </option>
                ))
              )}
              {/* Fallback static types if API fails */}
              <option value="cultural">Cultural</option>
              <option value="historical">Historical</option>
              <option value="nature">Nature</option>
              <option value="adventure">Adventure</option>
            </select>
          </div>

          {/* Duration */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#707971] uppercase flex items-center gap-1">
              <Calendar size={18} />
              Duration
            </label>
            <select
              name="duration"
              value={formData.duration}
              onChange={handleInputChange}
              className="w-full bg-[#ffffff] border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#004525] focus:border-transparent text-base py-3 px-3 transition-all"
            >
              {durationOptions.map((option) => (
                <option key={option.id} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Search Button */}
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full bg-[#004525] text-white py-3 rounded-lg text-sm font-semibold hover:bg-[#1f5d3a] transition-colors flex justify-center items-center gap-2 h-[44px]"
            >
              <Search size={18} />
              Find Tours
            </button>
          </div>
        </form>

        {/* Popular Searches */}
        {!loading && destinations.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap items-center gap-2">
            <span className="text-xs text-[#707971] font-medium">Popular:</span>
            {destinations.slice(0, 4).map((dest) => (
              <button
                key={dest.id}
                onClick={() => {
                  setFormData(prev => ({ ...prev, destination: dest.slug }));
                  router.push(`/tours?destination=${dest.slug}`);
                }}
                className="text-xs px-3 py-1 bg-gray-100 hover:bg-[#004525] hover:text-white transition-colors rounded-full text-[#404942]"
              >
                {dest.name}
              </button>
            ))}
            <button
              onClick={() => router.push('/destinations')}
              className="text-xs px-3 py-1 text-[#004525] hover:underline"
            >
              View All →
            </button>
          </div>
        )}
      </motion.div>
    </section>
  );
}