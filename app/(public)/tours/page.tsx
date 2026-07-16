// app/tours/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  X,
  Mountain,
  Church,
  Compass,
  Flame,
  Crown,
  SlidersHorizontal,
  Loader2,
} from "lucide-react";

import { HeroCarousel } from "@/components/HeroCarousel";
import { TourCard } from "@/components/TourCard";
import { SkeletonCard } from "@/components/SkeletonCard";
import { Tour, ToursResponse } from "@/Types";

// Category filters
const categories = [
  { id: "all", label: "All Tours", icon: Compass },
  { id: "cult", label: "Cultural", icon: Church },
  { id: "nat", label: "Nature", icon: Mountain },
  { id: "hist", label: "Historical", icon: Crown },
  { id: "premium", label: "Premium", icon: Flame },
];

const difficultyLevels = ["All", "Easy", "Moderate", "Challenging"];
const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "rating", label: "Highest Rated" },
  { value: "duration-asc", label: "Duration: Short to Long" },
  { value: "duration-desc", label: "Duration: Long to Short" },
  { value: "name-asc", label: "Name: A to Z" },
  { value: "name-desc", label: "Name: Z to A" },
];

export default function ToursPage() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, total: 0, pages: 0, hasMore: false });
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [selectedSort, setSelectedSort] = useState("featured");
  const [selectedRating, setSelectedRating] = useState("all");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Fetch tours with filters
  const fetchTours = useCallback(async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', '9');
      params.append('sort', selectedSort);
      
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      if (selectedDifficulty !== 'All') params.append('difficulty', selectedDifficulty);
      if (selectedRating !== 'all') params.append('minRating', selectedRating);
      if (searchQuery) params.append('search', searchQuery);

      const response = await fetch(`/api/tours?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: ToursResponse = await response.json();
      
      if (data.success) {
        setTours(data.data);
        setPagination(data.pagination);
      } else {
        throw new Error('Failed to fetch tours');
      }
    } catch (err) {
      console.error('Error fetching tours:', err);
      setError('Failed to load tours. Please try again later.');
      setTours([]);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, selectedDifficulty, selectedSort, selectedRating, searchQuery]);

  useEffect(() => {
    fetchTours(1);
  }, [fetchTours]);

  const handlePageChange = (newPage: number) => {
    fetchTours(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setSelectedCategory('all');
    setSelectedDifficulty('All');
    setSelectedSort('featured');
    setSelectedRating('all');
    setSearchQuery('');
  };

  const hasActiveFilters = selectedCategory !== 'all' || 
    selectedDifficulty !== 'All' || 
    selectedSort !== 'featured' || 
    selectedRating !== 'all' ||
    searchQuery !== '';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Carousel - Full width */}
      <HeroCarousel 
        tours={tours}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Filter Bar - Sticky with proper z-index */}
      <div className="sticky top-0 z-40 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4 flex flex-col lg:flex-row lg:items-center gap-4">
            {/* Category Filters - Desktop */}
            <div className="hidden lg:flex items-center gap-2 flex-wrap">
              {categories.map((category) => {
                const Icon = category.icon;
                const isActive = selectedCategory === category.id;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {category.label}
                  </button>
                );
              })}
            </div>

            {/* Mobile Filter Toggle */}
            <div className="flex lg:hidden items-center gap-2">
              <button
                onClick={() => setIsMobileFilterOpen(true)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
                {hasActiveFilters && (
                  <span className="ml-1 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                    {Object.values({ selectedCategory, selectedDifficulty, selectedRating, searchQuery }).filter(v => v && v !== 'all' && v !== 'All').length}
                  </span>
                )}
              </button>
              
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-2.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Sort & Filters - Desktop */}
            <div className="hidden lg:flex items-center gap-4 ml-auto">
              <select
                value={selectedSort}
                onChange={(e) => setSelectedSort(e.target.value)}
                className="px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {difficultyLevels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>

              <select
                value={selectedRating}
                onChange={(e) => setSelectedRating(e.target.value)}
                className="px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Ratings</option>
                <option value="4.5">4.5+ Stars</option>
                <option value="4.0">4.0+ Stars</option>
                <option value="3.5">3.5+ Stars</option>
              </select>

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white whitespace-nowrap"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {isMobileFilterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileFilterOpen(false)}
              className="fixed inset-0 bg-black/50 z-50"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed right-0 top-0 h-full w-full max-w-sm bg-white dark:bg-gray-800 z-50 shadow-2xl overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Filters</h2>
                  <button
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Categories */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Category</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {categories.map((category) => {
                        const Icon = category.icon;
                        const isActive = selectedCategory === category.id;
                        return (
                          <button
                            key={category.id}
                            onClick={() => setSelectedCategory(category.id)}
                            className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                              isActive
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                            {category.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Difficulty */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Difficulty</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {difficultyLevels.map((level) => (
                        <button
                          key={level}
                          onClick={() => setSelectedDifficulty(level)}
                          className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                            selectedDifficulty === level
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Rating */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Rating</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {['all', '4.5', '4.0', '3.5'].map((rating) => (
                        <button
                          key={rating}
                          onClick={() => setSelectedRating(rating)}
                          className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                            selectedRating === rating
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          {rating === 'all' ? 'All Ratings' : `${rating}+ Stars`}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sort */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Sort By</h3>
                    <div className="space-y-2">
                      {sortOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => setSelectedSort(option.value)}
                          className={`w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${
                            selectedSort === option.value
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={clearFilters}
                      className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium"
                    >
                      Clear All
                    </button>
                    <button
                      onClick={() => setIsMobileFilterOpen(false)}
                      className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl font-medium"
                    >
                      Apply Filters
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Tours Grid - With proper spacing */}
      <section className="py-8 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Results count - With margin bottom */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Showing <span className="font-semibold text-gray-900 dark:text-white">{tours.length}</span> of{" "}
              <span className="font-semibold text-gray-900 dark:text-white">{pagination.total || tours.length}</span> tours
            </p>
            {loading && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading...
              </div>
            )}
          </div>

          {/* Error message - With margin bottom */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-800 dark:text-red-200">
              {error}
            </div>
          )}

          {/* Loading State */}
          {loading && tours.length === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : tours.length > 0 ? (
            <>
              {/* Tours Grid - With gap */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {tours.map((tour, index) => (
                  <TourCard key={tour._id} tour={tour} index={index} />
                ))}
              </div>

              {/* Pagination - With top margin */}
              {pagination.pages > 1 && (
                <div className="mt-12 flex justify-center">
                  <div className="flex items-center gap-2 flex-wrap justify-center">
                    <button
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                      className="px-4 py-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      Previous
                    </button>
                    
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(pagination.pages, 5) }, (_, i) => {
                        let pageNum;
                        if (pagination.pages <= 5) {
                          pageNum = i + 1;
                        } else if (pagination.page <= 3) {
                          pageNum = i + 1;
                        } else if (pagination.page >= pagination.pages - 2) {
                          pageNum = pagination.pages - 4 + i;
                        } else {
                          pageNum = pagination.page - 2 + i;
                        }
                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`w-10 h-10 rounded-xl text-sm font-medium transition-colors ${
                              pagination.page === pageNum
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                                : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={!pagination.hasMore}
                      className="px-4 py-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Empty State - With padding and margin */
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 my-8"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
                <Search className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No tours found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Try adjusting your filters or search terms
              </p>
              <button
                onClick={clearFilters}
                className="mt-4 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
              >
                Clear all filters
              </button>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}