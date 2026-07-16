// components/ExperiencesPage.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
  FiMapPin,
  FiStar,
  FiClock,
  FiUsers,
  FiHeart,
  FiChevronLeft,
  FiChevronRight,
  FiCalendar,
  FiDollarSign,
  FiAward,
  FiCoffee,
  FiLoader,
  FiFilter,
} from 'react-icons/fi';
import {
  IoPeopleOutline,
  IoRestaurantOutline,
  IoCameraOutline,
} from 'react-icons/io5';
import {
  GiChurch,
  GiLion,
  GiCoffeeBeans,
  GiMountains,
  GiMeditation,
  GiCookingPot,
  GiTeacher,
  GiMusicalNotes,
  GiDrum,
} from 'react-icons/gi';
import {
  FaHeart,
  FaStar,
  FaUtensils,
  FaPaintBrush,
  FaDrum,
  FaFeather,
} from 'react-icons/fa';
import { MdOutlineTerrain, MdHistory, MdSelfImprovement } from 'react-icons/md';
import { RiAncientPavilionLine, RiBuilding4Line } from 'react-icons/ri';

interface Experience {
  _id: string;
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  images: string[];
  duration: string;
  location: string;
  highlights: string[];
  included: string[];
  notIncluded: string[];
  bestTimeToVisit: string;
  difficulty: string;
  category: string;
  tag: string;
  featured: boolean;
  rating: number;
  reviewCount: number;
  coordinates: {
    lat: number;
    lng: number;
    city: string;
    region: string;
  };
  languages: string[];
  groupSize: string;
  ageRange: string;
  whatToBring: string[];
  meetingPoint: string;
  startTimes: string[];
  culturalSignificance: string;
  seasonalAvailability: string;
  price: number;
  status: string;
  isUnesco: boolean;
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

// Category icons mapping
const categoryIcons: { [key: string]: any } = {
  'cultural': IoPeopleOutline,
  'spiritual': GiChurch,
  'adventure': GiMountains,
  'nature': GiLion,
  'culinary': GiCookingPot,
  'coffee': GiCoffeeBeans,
  'festivals': GiDrum,
  'food': GiCookingPot,
  'hiking': GiMountains,
  'birding': IoCameraOutline,
  'tribal': IoPeopleOutline,
  'photography': IoCameraOutline,
  'wellness': GiMeditation,
  'historical': MdHistory,
};

// Category colors
const categoryColors: { [key: string]: string } = {
  'cultural': '#004525',
  'spiritual': '#735c00',
  'adventure': '#cca830',
  'nature': '#1f5d3a',
  'culinary': '#c0392b',
  'coffee': '#6f4e37',
  'festivals': '#e74c3c',
  'food': '#e67e22',
  'hiking': '#27ae60',
  'birding': '#2980b9',
  'tribal': '#8e44ad',
  'photography': '#2c3e50',
  'wellness': '#1abc9c',
  'historical': '#d35400',
};

export default function ExperiencesPage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch experiences from API
  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/experiences?limit=12&featured=true');
      
      if (!response.ok) {
        throw new Error('Failed to fetch experiences');
      }
      
      const data = await response.json();
      
      if (data.success) {
        setExperiences(data.data);
      } else {
        throw new Error(data.error || 'Failed to fetch experiences');
      }
    } catch (err) {
      console.error('Error fetching experiences:', err);
      setError('Failed to load experiences. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const toggleWishlist = (id: string) => {
    setWishlist(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  // Get unique categories from experiences
  const categories = ['all', ...new Set(experiences.map(exp => exp.category).filter(Boolean))];

  // Filter experiences by category and search
  const filteredExperiences = experiences.filter(exp => {
    const matchesCategory = selectedCategory === 'all' || exp.category === selectedCategory;
    const matchesSearch = exp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         exp.shortDescription?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         exp.location?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Featured categories for the quick filter
  const featuredCategories = [
    { name: 'Cultural', icon: IoPeopleOutline, color: '#004525', key: 'cultural' },
    { name: 'Wildlife', icon: GiLion, color: '#735c00', key: 'nature' },
    { name: 'Culinary', icon: GiCookingPot, color: '#cca830', key: 'culinary' },
    { name: 'Spiritual', icon: MdSelfImprovement, color: '#1f5d3a', key: 'spiritual' },
  ];

  // Get icon for experience
  const getIcon = (category: string) => {
    return categoryIcons[category] || IoPeopleOutline;
  };

  // Get color for experience
  const getColor = (category: string) => {
    return categoryColors[category] || '#004525';
  };

  // Format price
  const formatPrice = (price: number) => {
    if (!price || price === 0) return 'Contact for Price';
    return `$${price.toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className="pt-32 pb-20 px-4 md:px-6 max-w-7xl mx-auto">
        <div className="flex flex-col items-center justify-center py-20">
          <FiLoader className="w-12 h-12 text-[#004525] animate-spin" />
          <p className="mt-4 text-[#404942]">Loading experiences...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-32 pb-20 px-4 md:px-6 max-w-7xl mx-auto text-center">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md mx-auto">
          <p className="text-red-600">{error}</p>
          <button
            onClick={fetchExperiences}
            className="mt-4 px-6 py-2 bg-[#004525] text-white rounded-lg hover:bg-[#1f5d3a] transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="pt-32 pb-20 overflow-x-hidden">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 mb-12">
        <motion.div
          initial="initial"
          animate="animate"
          variants={stagger}
          className="text-center"
        >
          <motion.div
            variants={fadeInUp}
            className="inline-flex items-center gap-3 px-4 py-2 bg-[#97f3b5]/30 text-[#047240] rounded-full mb-4"
          >
            <FiAward size={16} />
            <span className="text-xs font-semibold uppercase tracking-widest">
              Transform Your Journey
            </span>
          </motion.div>
          <motion.h1
            variants={fadeInUp}
            className="font-['Playfair_Display'] text-4xl md:text-6xl text-[#004525] mb-4"
          >
            Beyond the <span className="italic text-[#735c00]">Ordinary</span>
          </motion.h1>
          <motion.p
            variants={fadeInUp}
            className="max-w-2xl mx-auto text-lg text-[#404942]"
          >
            Immerse yourself in Ethiopia's rich tapestry of ancient traditions, breathtaking landscapes, and warm hospitality.
          </motion.p>
        </motion.div>
      </section>

      {/* Search and Filter Bar */}
      <section className="max-w-7xl mx-auto px-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="Search experiences..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-12 rounded-xl border border-[#c0c9bf]/50 focus:border-[#004525] focus:ring-2 focus:ring-[#004525]/20 transition-all"
            />
            <FiCoffee className="absolute left-4 top-1/2 -translate-y-1/2 text-[#707971]" />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-[#004525] text-white'
                    : 'bg-gray-100 text-[#404942] hover:bg-gray-200'
                }`}
              >
                {category === 'all' ? 'All' : category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Categories Quick Filter */}
      <section className="max-w-7xl mx-auto px-6 mb-12">
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={stagger}
        >
          {featuredCategories.map((category, index) => (
            <motion.button
              key={index}
              variants={fadeInUp}
              onClick={() => setSelectedCategory(category.key)}
              className={`glass-card rounded-xl p-6 text-center hover-lift cursor-pointer transition-all ${
                selectedCategory === category.key ? 'ring-2 ring-[#004525] shadow-lg' : ''
              }`}
              style={{ borderColor: `${category.color}20` }}
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3"
                style={{ backgroundColor: `${category.color}10` }}
              >
                <category.icon size={28} style={{ color: category.color }} />
              </div>
              <h4 className="font-semibold text-sm text-[#004525]">
                {category.name}
              </h4>
            </motion.button>
          ))}
        </motion.div>
      </section>

      {/* Experiences Grid */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end gap-4 mb-6">
          <div>
            <h2 className="font-['Playfair_Display'] text-3xl font-semibold text-[#004525]">
              Curated Experiences
            </h2>
            <p className="text-[#404942]">
              {filteredExperiences.length} {filteredExperiences.length === 1 ? 'experience' : 'experiences'} found
            </p>
          </div>
        </div>

        {filteredExperiences.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[#404942]">No experiences found matching your criteria.</p>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
          >
            {filteredExperiences.map((exp, index) => {
              const Icon = getIcon(exp.category);
              const color = getColor(exp.category);
              const isWishlisted = wishlist.has(exp._id);
              const imageUrl = exp.images?.[0] || '/Images/placeholder-experience.jpg';

              return (
                <motion.div
                  key={exp._id}
                  variants={fadeInUp}
                  className="group relative overflow-hidden rounded-xl h-[460px] shadow-[0px_10px_30px_rgba(31,93,58,0.08)] transition-all duration-500 hover:-translate-y-2"
                >
                  <div className="relative w-full h-full">
                    <Image
                      src={imageUrl}
                      alt={exp.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#004525]/90 via-[#004525]/20 to-transparent" />
                  </div>

                  {/* Wishlist Button */}
                  <div className="absolute top-4 right-4 z-10">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleWishlist(exp._id);
                      }}
                      className="bg-white/30 backdrop-blur-md p-2 rounded-full hover:bg-white transition-all"
                    >
                      <FiHeart
                        size={20}
                        className={`transition-colors ${
                          isWishlisted ? 'fill-red-500 text-red-500' : 'text-white'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Tag Badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="bg-[#ffe088] text-[#241a00] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                      {exp.tag || exp.category}
                    </span>
                  </div>

                  {/* UNESCO Badge */}
                  {exp.isUnesco && (
                    <div className="absolute top-4 left-20 z-10">
                      <span className="bg-[#cca830] text-[#4f3e00] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                        <FiAward size={12} /> UNESCO
                      </span>
                    </div>
                  )}

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon size={16} className="text-[#ffe088]" />
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#ffe088]/80">
                        {exp.category}
                      </span>
                    </div>
                    <h3 className="font-['Playfair_Display'] text-xl font-semibold mb-1 leading-tight">
                      {exp.name}
                    </h3>
                    <p className="text-sm text-white/80 line-clamp-2 mb-3">
                      {exp.shortDescription || exp.description?.substring(0, 120) || ''}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-white/70">
                      <div className="flex items-center gap-1">
                        <FiMapPin size={14} /> {exp.location || exp.coordinates?.city || 'Ethiopia'}
                      </div>
                      <div className="flex items-center gap-1">
                        <FiClock size={14} /> {exp.duration}
                      </div>
                      <div className="flex items-center gap-1">
                        <FiUsers size={14} /> {exp.groupSize || '2-8'}
                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/20">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <FaStar size={14} className="text-[#ffe088]" />
                          <span className="font-bold text-sm">{exp.rating || 4.8}</span>
                        </div>
                        <span className="text-xs text-white/60">•</span>
                        <span className="font-['Playfair_Display'] text-2xl font-bold">
                          {formatPrice(exp.price)}
                        </span>
                      </div>
                      <Link href={`/experiences/${exp.slug}`}>
                        <button className="bg-white text-[#004525] px-4 py-2 rounded-lg text-xs font-semibold hover:bg-[#ffe088] transition-all">
                          View Details
                        </button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </section>

      {/* Newsletter / CTA */}
      <section className="max-w-7xl mx-auto px-6 mt-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="bg-[#004525] p-8 md:p-12 rounded-[48px] relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-6 opacity-5">
            <GiCoffeeBeans size={160} className="text-white" />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left max-w-xl">
              <h2 className="font-['Playfair_Display'] text-3xl md:text-4xl font-semibold text-white mb-3">
                Craft Your Own Adventure
              </h2>
              <p className="text-white/80 text-lg">
                Work with our expert concierge to design a bespoke Ethiopian experience tailored to your passions.
              </p>
            </div>
            <Link href="/contact">
              <button className="bg-[#ffe088] text-[#004525] px-8 py-3 rounded-full text-sm font-semibold hover:scale-105 transition-transform whitespace-nowrap">
                Start Planning
              </button>
            </Link>
          </div>
        </motion.div>
      </section>
    </main>
  );
}