// components/HeroCarousel.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";
import Image from "next/image";

interface Tour {
  _id: string;
  name: string;
  description: string;
  images: string[];
  featured: boolean;
}

interface HeroCarouselProps {
  tours: Tour[];
  searchQuery: string;
  setSearchQuery: (value: string) => void;
}

export const HeroCarousel = ({ tours, searchQuery, setSearchQuery }: HeroCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Get tours with images for carousel
  const carouselTours = tours.filter(tour => tour.images && tour.images.length > 0);
  
  // If no tours with images, use all tours (up to 5)
  const displayTours = carouselTours.length > 0 
    ? carouselTours 
    : tours.slice(0, 5);

  const goToSlide = (index: number) => {
    if (displayTours.length === 0) return;
    setCurrentIndex((index + displayTours.length) % displayTours.length);
  };

  const nextSlide = () => {
    if (displayTours.length === 0) return;
    goToSlide(currentIndex + 1);
  };

  const prevSlide = () => {
    if (displayTours.length === 0) return;
    goToSlide(currentIndex - 1);
  };

  // Auto-play
  useEffect(() => {
    if (isPlaying && !isHovering && displayTours.length > 1) {
      intervalRef.current = setInterval(nextSlide, 5000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, isHovering, currentIndex, displayTours.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'ArrowRight') nextSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex]);

  // If no tours available
  if (displayTours.length === 0) {
    return (
      <div className="relative my-10 h-[60vh] lg:h-[70vh] min-h-[500px] flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-2xl mx-4">
        <div className="text-center text-white px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Discover Ethiopia's Treasures</h1>
          <p className="text-xl">No tours available at the moment</p>
        </div>
      </div>
    );
  }

  const currentTour = displayTours[currentIndex] || displayTours[0];

  return (
    <div 
      className="relative my-22 lg:mx-0 h-[60vh] lg:h-[70vh] min-h-[500px] overflow-hidden  shadow-2xl"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Background Images with Parallax */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 1.1, opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="absolute inset-0"
        >
          {currentTour?.images?.[0] ? (
            <Image
              src={currentTour.images[0]}
              alt={currentTour.name}
              fill
              className="object-cover"
              priority
              sizes="100vw"
              onError={(e) => {
                // Fallback if image fails
                (e.target as HTMLImageElement).style.display = 'none';
                const parent = (e.target as HTMLImageElement).parentElement;
                if (parent) {
                  parent.className = 'w-full h-full bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600';
                }
              }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600" />
          )}
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/30" />
          
          {/* Animated Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-emerald-600/20 mix-blend-overlay animate-pulse" />
        </motion.div>
      </AnimatePresence>

      {/* Animated Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-20 right-20 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -80, 0],
            y: [0, 60, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-20 left-20 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-400/10 rounded-full blur-3xl"
        />
      </div>

      {/* Slide Indicator - Tour Name */}
      {displayTours.length > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute top-6 left-1/2 -translate-x-1/2 z-10"
        >
          <div className="bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
            <span className="text-white/70 text-sm font-medium">
              {currentIndex + 1} / {displayTours.length}
            </span>
            <span className="mx-3 text-white/30">|</span>
            <span className="text-white font-medium">{currentTour?.name}</span>
            {currentTour?.featured && (
              <span className="ml-2 px-2 py-0.5 bg-yellow-500/80 text-white text-xs rounded-full">
                Featured
              </span>
            )}
          </div>
        </motion.div>
      )}

      {/* Main Content */}
      <div className="relative h-full flex items-center">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center max-w-4xl mx-auto"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-6"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
              <span className="text-sm text-white/90">
                Explore {displayTours.length}+ Tours
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6"
            >
              <span className="text-white">
                Discover Ethiopia's
              </span>
              <span className="block mt-2 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
                Timeless Treasures
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto mb-8"
            >
              {currentTour?.description || "Explore ancient civilizations, breathtaking landscapes, and vibrant cultures with our expertly curated tours across the magnificent lands of Ethiopia"}
            </motion.p>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-wrap justify-center gap-6 md:gap-12 mb-10"
            >
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-white">{displayTours.length}+</div>
                <div className="text-sm text-white/60">Curated Tours</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-white">4.9</div>
                <div className="text-sm text-white/60">Average Rating</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-white">100%</div>
                <div className="text-sm text-white/60">Local Experts</div>
              </div>
            </motion.div>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="max-w-2xl mx-auto"
            >
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500" />
                <div className="relative flex items-center bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl focus-within:ring-2 focus-within:ring-white/50 transition-all group-hover:bg-white/20">
                  <Search className="absolute left-4 text-white/60 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search tours by name, destination, or activity..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-transparent text-white placeholder-white/50 focus:outline-none"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="mr-2 px-6 py-2 bg-white/20 hover:bg-white/30 text-white font-medium rounded-xl transition-colors hidden sm:block"
                  >
                    Search
                  </motion.button>
                </div>
              </div>

              {/* Popular Searches */}
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <span className="text-sm text-white/50">Popular:</span>
                {["Lalibela", "Simien Mountains", "Omo Valley", "Danakil"].map((term) => (
                  <button
                    key={term}
                    onClick={() => setSearchQuery(term)}
                    className="text-sm text-white/70 hover:text-white hover:bg-white/10 px-3 py-1 rounded-full transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Navigation Controls - Only show if more than 1 slide */}
      {displayTours.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-4">
          {/* Previous Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={prevSlide}
            className="p-2 rounded-full bg-black/40 backdrop-blur-sm hover:bg-black/60 text-white transition-all border border-white/10"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </motion.button>

          {/* Dots */}
          <div className="flex items-center gap-2">
            {displayTours.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-300 ${
                  index === currentIndex
                    ? 'w-8 h-2 bg-white rounded-full'
                    : 'w-2 h-2 bg-white/40 rounded-full hover:bg-white/60'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Next Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={nextSlide}
            className="p-2 rounded-full bg-black/40 backdrop-blur-sm hover:bg-black/60 text-white transition-all border border-white/10"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5" />
          </motion.button>

          {/* Play/Pause Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 rounded-full bg-black/40 backdrop-blur-sm hover:bg-black/60 text-white transition-all border border-white/10 ml-2"
            aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </motion.button>
        </div>
      )}
    </div>
  );
};