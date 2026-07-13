// components/JournalPage.tsx
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import {
  FiMapPin,
  FiStar,
  FiClock,
  FiHeart,
  FiChevronLeft,
  FiChevronRight,
  FiCalendar,
  FiUser,
  FiBookOpen,
  FiTag,
  FiArrowRight,
  FiShare2,
  FiBookmark,
  FiSearch,
  FiFilter,
  FiEye,
} from 'react-icons/fi';
import {
  IoPersonOutline,
  IoTimeOutline,
  IoLocationOutline,
} from 'react-icons/io5';
import {
  GiChurch,
  GiLion,
  GiCoffeeBeans,
  GiMountains,
  GiMeditation,
  GiCookingPot,
  GiTeacher,
  GiDrum,
  GiCamel,
  GiElephant,
} from 'react-icons/gi';
import { FaHeart, FaStar, FaUtensils, FaPaintBrush, FaDrum, FaFeather, FaTag } from 'react-icons/fa';
import { MdOutlineTerrain, MdHistory, MdSelfImprovement, MdTravelExplore } from 'react-icons/md';
import { RiAncientPavilionLine, RiBuilding4Line } from 'react-icons/ri';

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

interface Article {
  id: string;
  _id: string;
  name: string;
  title: string;
  description: string;
  slug: string;
  images: string[];
  category: {
    id: string;
    name: string;
    slug: string;
  };
  readTime: string;
  excerpt: string;
  featured: boolean;
  author: string;
  publishedAt: string;
  tags: string[];
  views: number;
  likes: number;
  comments: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  coverImage: string;
  content: string;
}

interface Category {
  name: string;
  count: number;
  icon: any;
}

const categoryIcons: { [key: string]: any } = {
  'Cultural Heritage': GiChurch,
  'Wildlife & Nature': GiLion,
  'Culinary Arts': GiCoffeeBeans,
  'Adventure Travel': GiMountains,
  'Spiritual Journeys': MdSelfImprovement,
  'Historical Sites': RiAncientPavilionLine,
  'Culture': IoPersonOutline,
  'Culinary': GiCookingPot,
  'Religious Heritage': RiBuilding4Line,
  'Extreme Adventure': GiMountains,
  'Adventure': MdTravelExplore,
  'History': MdHistory,
};

export default function JournalPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [featuredArticles, setFeaturedArticles] = useState<Article[]>([]);
  const [recentArticles, setRecentArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState({
    totalArticles: 0,
    totalViews: 0,
    totalLikes: 0,
    totalComments: 0,
    categoriesCount: 0,
    tagsCount: 0,
    topCategories: [] as any[],
    topTags: [] as any[],
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const itemsPerPage = 9;
  const hasFetched = useRef(false);

  // Fetch articles
  const fetchArticles = useCallback(async (page = 1, category = 'all', search = '') => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', itemsPerPage.toString());
      if (category !== 'all') params.append('category', category);
      if (search) params.append('search', search);
      params.append('sortBy', 'publishedAt');
      params.append('sortOrder', 'desc');

      const response = await fetch(`/api/blog?${params.toString()}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch articles');
      }

      setArticles(data.data || []);
      setTotalPages(data.pagination?.pages || 1);
      setStats(data.stats || {});
      setCurrentPage(page);

      // Set featured articles (first 3)
      const featured = data.data?.filter((a: Article) => a.featured) || [];
      setFeaturedArticles(featured.slice(0, 3));

      // Set recent articles (rest)
      const recent = data.data?.filter((a: Article) => !a.featured) || [];
      setRecentArticles(recent);

      // Build categories from stats
      if (data.stats?.topCategories) {
        const cats = data.stats.topCategories.map((cat: any) => ({
          name: cat.name,
          count: cat.count,
          icon: categoryIcons[cat.name] || FiBookOpen,
        }));
        setCategories(cats);
      }

    } catch (err: any) {
      console.error('Error fetching articles:', err);
      setError(err.message || 'Failed to load articles');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchArticles(1, selectedCategory, searchQuery);
    }
  }, [fetchArticles, selectedCategory, searchQuery]);

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (hasFetched.current) {
        fetchArticles(1, selectedCategory, searchQuery);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory, fetchArticles]);

  const handlePageChange = (page: number) => {
    fetchArticles(page, selectedCategory, searchQuery);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getIconForCategory = (categoryName: string) => {
    return categoryIcons[categoryName] || FiBookOpen;
  };

  // Loading State
  if (loading && !articles.length) {
    return (
      <div className="pt-32 pb-20 overflow-x-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-xl overflow-hidden shadow-lg animate-pulse">
                <div className="h-56 bg-gray-200"></div>
                <div className="p-5">
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
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
  if (error && !loading) {
    return (
      <div className="pt-32 pb-20 overflow-x-hidden">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 max-w-md mx-auto">
            <p className="text-red-700 font-semibold mb-2">Unable to load articles</p>
            <p className="text-red-600 text-sm">{error}</p>
            <button
              onClick={() => fetchArticles(1, selectedCategory, searchQuery)}
              className="mt-4 px-6 py-2 bg-[#004525] text-white rounded-lg hover:bg-[#1f5d3a] transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 overflow-x-hidden">
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
            <FiBookOpen size={16} />
            <span className="text-xs font-semibold uppercase tracking-widest">
              Stories from Ethiopia
            </span>
          </motion.div>
          <motion.h1
            variants={fadeInUp}
            className="font-['Playfair_Display'] text-4xl md:text-6xl text-[#004525] mb-4"
          >
            The Traveler's <span className="italic text-[#735c00]">Journal</span>
          </motion.h1>
          <motion.p
            variants={fadeInUp}
            className="max-w-2xl mx-auto text-lg text-[#404942]"
          >
            Stories, insights, and dispatches from across Ethiopia — written by explorers who have ventured into its heart.
          </motion.p>
        </motion.div>
      </section>

      {/* Search & Filter Bar */}
      <section className="max-w-7xl mx-auto px-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#707971]" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full pl-12 pr-4 py-3 bg-white rounded-full border border-gray-200 focus:border-[#004525] focus:ring-2 focus:ring-[#004525]/20 outline-none transition-all"
            />
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
            <button
              onClick={() => handleCategoryChange('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                selectedCategory === 'all'
                  ? 'bg-[#004525] text-white'
                  : 'bg-white text-[#404942] hover:bg-gray-100 border border-gray-200'
              }`}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category.name}
                onClick={() => handleCategoryChange(category.name)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  selectedCategory === category.name
                    ? 'bg-[#004525] text-white'
                    : 'bg-white text-[#404942] hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      {stats.totalArticles > 0 && (
        <section className="max-w-7xl mx-auto px-6 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <p className="text-2xl font-bold text-[#004525]">{stats.totalArticles}</p>
              <p className="text-xs text-[#707971]">Articles</p>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <p className="text-2xl font-bold text-[#004525]">{stats.totalViews.toLocaleString()}</p>
              <p className="text-xs text-[#707971]">Total Views</p>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <p className="text-2xl font-bold text-[#004525]">{stats.totalLikes}</p>
              <p className="text-xs text-[#707971]">Likes</p>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <p className="text-2xl font-bold text-[#004525]">{stats.totalComments}</p>
              <p className="text-xs text-[#707971]">Comments</p>
            </div>
          </div>
        </section>
      )}

      {/* Featured Articles */}
      {featuredArticles.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="font-['Playfair_Display'] text-2xl font-semibold text-[#004525] mb-6">
              Featured Stories
            </h2>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
          >
            {featuredArticles.map((article, index) => {
              const Icon = getIconForCategory(article.category?.name || '');
              return (
                <motion.article
                  key={article.id}
                  variants={fadeInUp}
                  className="group bg-white rounded-xl overflow-hidden shadow-[0px_10px_30px_rgba(31,93,58,0.08)] hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                >
                  <Link href={`/blog/${article.slug}`}>
                    <div className="relative h-56 overflow-hidden">
                      {article.coverImage || article.images?.[0] ? (
                        <Image
                          src={article.coverImage || article.images[0]}
                          alt={article.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#004525] to-[#2d6a4f] flex items-center justify-center text-white text-4xl font-bold">
                          {article.title.charAt(0)}
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <div className="absolute top-3 left-3">
                        <span className="bg-[#ffe088] text-[#241a00] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                          Featured
                        </span>
                      </div>
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                        <span className="text-xs bg-black/30 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
                          <FiUser size={12} /> {article.author}
                        </span>
                        <span className="text-xs bg-black/30 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
                          <FiClock size={12} /> {article.readTime || '5 min read'}
                        </span>
                      </div>
                    </div>
                  </Link>

                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      {Icon && <Icon size={14} className="text-[#735c00]" />}
                      <span className="text-xs font-semibold text-[#735c00] uppercase tracking-wider">
                        {article.category?.name || 'Travel'}
                      </span>
                    </div>

                    <Link href={`/blog/${article.slug}`}>
                      <h3 className="font-['Playfair_Display'] text-xl font-semibold text-[#004525] mb-2 group-hover:text-[#1f5d3a] transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                    </Link>

                    <p className="text-sm text-[#404942] line-clamp-2 mb-3">
                      {article.excerpt || article.description}
                    </p>

                    <div className="flex items-center justify-between text-xs text-[#707971]">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <FiCalendar size={12} /> {formatDate(article.publishedAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          <FiEye size={12} /> {article.views || 0}
                        </span>
                      </div>
                      <Link href={`/blog/${article.slug}`}>
                        <button className="text-[#004525] font-semibold hover:text-[#735c00] transition-colors flex items-center gap-1">
                          Read More <FiArrowRight size={14} />
                        </button>
                      </Link>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </motion.div>
        </section>
      )}

      {/* Categories Section */}
      {categories.length > 0 && (
        <section className="bg-[#f8f9ff] py-16 mb-16">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="font-['Playfair_Display'] text-2xl font-semibold text-[#004525] mb-6 text-center">
                Explore by Category
              </h2>
            </motion.div>

            <motion.div
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={stagger}
            >
              {categories.map((category, index) => {
                const Icon = category.icon || FiBookOpen;
                return (
                  <motion.button
                    key={index}
                    variants={fadeInUp}
                    onClick={() => handleCategoryChange(category.name)}
                    className={`glass-card rounded-xl p-4 text-center hover-lift cursor-pointer transition-all ${
                      selectedCategory === category.name
                        ? 'bg-[#004525] text-white shadow-lg'
                        : 'bg-white hover:bg-gray-50'
                    }`}
                  >
                    <Icon
                      size={28}
                      className={`mx-auto mb-2 ${
                        selectedCategory === category.name
                          ? 'text-white'
                          : 'text-[#004525]'
                      }`}
                    />
                    <h4 className={`font-semibold text-sm ${
                      selectedCategory === category.name
                        ? 'text-white'
                        : 'text-[#004525]'
                    }`}>
                      {category.name}
                    </h4>
                    <span className={`text-xs ${
                      selectedCategory === category.name
                        ? 'text-white/70'
                        : 'text-[#707971]'
                    }`}>
                      {category.count} articles
                    </span>
                  </motion.button>
                );
              })}
            </motion.div>
          </div>
        </section>
      )}

      {/* Recent Articles */}
      {recentArticles.length > 0 && (
        <section className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex justify-between items-end mb-6"
          >
            <div>
              <h2 className="font-['Playfair_Display'] text-2xl font-semibold text-[#004525]">
                Recent Dispatches
              </h2>
              <p className="text-[#404942]">The latest stories from our explorers</p>
            </div>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
          >
            {recentArticles.map((article, index) => {
              const Icon = getIconForCategory(article.category?.name || '');
              return (
                <motion.article
                  key={article.id}
                  variants={fadeInUp}
                  className="group flex flex-col bg-white rounded-xl overflow-hidden shadow-[0px_10px_30px_rgba(31,93,58,0.08)] hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                >
                  <Link href={`/blog/${article.slug}`}>
                    <div className="relative h-48 overflow-hidden">
                      {article.coverImage || article.images?.[0] ? (
                        <Image
                          src={article.coverImage || article.images[0]}
                          alt={article.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#735c00] to-[#004525] flex items-center justify-center text-white text-3xl font-bold">
                          {article.title.charAt(0)}
                        </div>
                      )}
                      <div className="absolute top-3 left-3">
                        <span className="bg-[#004525]/80 text-white px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider backdrop-blur-sm">
                          {article.category?.name || 'Travel'}
                        </span>
                      </div>
                      {article.tags && article.tags.length > 0 && (
                        <div className="absolute bottom-3 left-3">
                          <span className="bg-black/50 text-white px-2 py-1 rounded-full text-[10px] backdrop-blur-sm">
                            #{article.tags[0]}
                          </span>
                        </div>
                      )}
                    </div>
                  </Link>

                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 mb-2">
                      {Icon && <Icon size={14} className="text-[#735c00]" />}
                      <span className="text-xs font-semibold text-[#735c00] uppercase tracking-wider">
                        {article.category?.name || 'Travel'}
                      </span>
                    </div>

                    <Link href={`/blog/${article.slug}`}>
                      <h3 className="font-['Playfair_Display'] text-lg font-semibold text-[#004525] mb-2 group-hover:text-[#1f5d3a] transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                    </Link>

                    <p className="text-sm text-[#404942] line-clamp-2 mb-3 flex-1">
                      {article.excerpt || article.description}
                    </p>

                    <div className="flex items-center justify-between text-xs text-[#707971] pt-3 border-t border-[#c0c9bf]/30">
                      <div className="flex items-center gap-1">
                        <FiUser size={12} />
                        <span>{article.author}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <FiCalendar size={12} /> {formatDate(article.publishedAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          <FiClock size={12} /> {article.readTime || '5 min read'}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </motion.div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg border transition-all ${
                  currentPage === 1
                    ? 'opacity-50 cursor-not-allowed border-gray-200'
                    : 'border-gray-200 hover:border-[#004525] hover:text-[#004525]'
                }`}
              >
                <FiChevronLeft />
              </button>
              
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
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-10 h-10 rounded-lg transition-all ${
                      currentPage === pageNum
                        ? 'bg-[#004525] text-white'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-lg border transition-all ${
                  currentPage === totalPages
                    ? 'opacity-50 cursor-not-allowed border-gray-200'
                    : 'border-gray-200 hover:border-[#004525] hover:text-[#004525]'
                }`}
              >
                <FiChevronRight />
              </button>
            </div>
          )}
        </section>
      )}

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
            <FiBookOpen size={160} className="text-white" />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left max-w-xl">
              <h2 className="font-['Playfair_Display'] text-3xl md:text-4xl font-semibold text-white mb-3">
                Never Miss a Story
              </h2>
              <p className="text-white/80 text-lg">
                Subscribe to our journal for weekly dispatches from Ethiopia's hidden corners and exclusive travel insights.
              </p>
            </div>
            <div className="w-full md:w-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  className="bg-white/10 border border-white/20 rounded-full px-6 py-3 text-white placeholder:text-white/40 focus:ring-2 focus:ring-[#95d5a8] w-full sm:w-64 outline-none"
                  placeholder="Your email address"
                  type="email"
                />
                <button className="bg-[#ffe088] text-[#004525] px-6 py-3 rounded-full text-sm font-semibold hover:scale-105 transition-transform whitespace-nowrap">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}