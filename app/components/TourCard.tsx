// components/TourCard.tsx
"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Star, MapPin, Clock, Users, Heart } from "lucide-react";

import { useState } from "react";
import { Tour } from "@/Types";

interface TourCardProps {
  tour: Tour;
  index?: number;
}

export function TourCard({ tour, index = 0 }: TourCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Get the first image or use a fallback
  const imageUrl = tour.images?.[0] || "/Images/placeholder-tour.jpg";
  
  // Format price with proper currency
  const formattedPrice = tour.price ? `$${tour.price.toLocaleString()}` : "Price on request";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700"
    >
      {/* Image Container */}
      <div className="relative h-56 overflow-hidden">
        <Image
          src={imageUrl}
          alt={tour.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
        {/* UNESCO Badge */}
        {tour.isUnesco && (
          <div className="absolute top-3 left-3 z-10">
            <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
              🏛️ UNESCO
            </span>
          </div>
        )}

        {/* Featured Badge */}
        {tour.featured && (
          <div className="absolute top-3 right-3 z-10">
            <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
              Featured
            </span>
          </div>
        )}

        {/* Tag Badge */}
        {tour.tag && (
          <div className="absolute bottom-3 left-3 z-10">
            <span className="bg-black/60 backdrop-blur-sm text-white text-xs font-medium px-3 py-1 rounded-full">
              {tour.tag}
            </span>
          </div>
        )}

        {/* Rating */}
        {tour.rating > 0 && (
          <div className="absolute bottom-3 right-3 z-10">
            <span className="bg-black/60 backdrop-blur-sm text-white text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              {tour.rating.toFixed(1)} ({tour.reviewCount})
            </span>
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            setIsWishlisted(!isWishlisted);
          }}
          className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white transition-colors shadow-sm"
        >
          <Heart
            className={`w-5 h-5 transition-colors ${
              isWishlisted ? "fill-red-500 text-red-500" : "text-gray-600"
            }`}
          />
        </button>
      </div>

      {/* Content */}
      <div className="p-5 space-y-3">
        {/* Title */}
        <Link href={`/tours/${tour.slug}`}>
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-2">
            {tour.name}
          </h3>
        </Link>

      
        {/* Details */}
        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
          {/* Location */}
          {(tour.coordinates?.city || tour.coordinates?.region) && (
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {tour.coordinates.city || tour.coordinates.region}
            </span>
          )}

          {/* Duration */}
          {tour.duration && (
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {tour.duration}
            </span>
          )}

          {/* Group Size */}
          {tour.groupSize && (
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {tour.groupSize}
            </span>
          )}
        </div>

        {/* Difficulty */}
        {tour.difficulty && (
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                tour.difficulty === "Easy"
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  : tour.difficulty === "Moderate"
                  ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                  : tour.difficulty === "Challenging"
                  ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                  : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
              }`}
            >
              {tour.difficulty}
            </span>
          </div>
        )}

        {/* Price & Book Button */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
          <div>
            <span className="text-xs text-gray-500 dark:text-gray-400">From</span>
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              {formattedPrice}
            </p>
            <span className="text-xs text-gray-500 dark:text-gray-400">per person</span>
          </div>
          <Link href={`/tours/${tour.slug}`}>
            <button className="px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md">
              View Details
            </button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}