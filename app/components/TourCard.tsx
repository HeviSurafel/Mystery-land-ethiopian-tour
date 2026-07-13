// components/tours/TourCard.tsx
"use client";

import { motion } from "framer-motion";
import { Users, MapPin, Star, Clock, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

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
    _id: string;
  };
  groupSize: string;
  difficulty: string;
  rating: number;
  reviewCount: number;
  featured: boolean;
  highlights: string[];
  bestTime: string[];
  tag?: string;
}

interface TourCardProps {
  tour: Tour;
  index: number;
}

export const TourCard = ({ tour, index }: TourCardProps) => {
  const getDifficultyColor = (difficulty: string) => {
    const lower = difficulty.toLowerCase();
    if (lower.includes("easy")) return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
    if (lower.includes("moderate")) return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
    return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
  };

  const getTagColor = (tag?: string) => {
    if (tag === "Premium") return "bg-amber-500 text-white";
    if (tag === "UNESCO") return "bg-blue-600 text-white";
    return "bg-emerald-500 text-white";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.08,
        ease: "easeOut"
      }}
      whileHover={{ y: -8 }}
      className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
    >
      <div className="relative h-64 overflow-hidden bg-gray-200 dark:bg-gray-700">
        {tour.images && tour.images.length > 0 ? (
          <Image
            src={tour.images[0]}
            alt={tour.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 text-white text-4xl font-bold">
            {tour.name.charAt(0)}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {tour.featured && (
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 bg-yellow-500 text-white text-xs font-semibold rounded-full shadow-lg">
              Featured
            </span>
          </div>
        )}
        
        {tour.tag && (
          <div className="absolute top-4 right-4">
            <span className={`px-3 py-1 text-xs font-semibold rounded-full shadow-lg ${getTagColor(tour.tag)}`}>
              {tour.tag}
            </span>
          </div>
        )}

        <div className="absolute bottom-4 left-4 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          <span className="text-white text-sm font-semibold">{tour.rating}</span>
          <span className="text-white/60 text-xs">({tour.reviewCount})</span>
        </div>

        <div className="absolute bottom-4 right-4 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
          <Clock className="w-4 h-4 text-blue-400" />
          <span className="text-white text-sm font-medium">{tour.duration}</span>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center gap-2 mb-2">
          <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <span className="text-sm text-gray-500 dark:text-gray-400 truncate">
            {tour.coordinates?.city || "Ethiopia"}
          </span>
          {tour.coordinates?.region && (
            <>
              <span className="text-gray-300 dark:text-gray-600">•</span>
              <span className="text-sm text-gray-500 dark:text-gray-400 truncate">
                {tour.coordinates.region}
              </span>
            </>
          )}
        </div>

        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {tour.name}
        </h3>

        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
          {tour.description}
        </p>

        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-300">
            <Users className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span className="truncate">{tour.groupSize}</span>
          </div>
          <span className="w-px h-4 bg-gray-300 dark:bg-gray-600" />
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${getDifficultyColor(tour.difficulty)}`}>
            {tour.difficulty}
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {tour.highlights?.slice(0, 3).map((highlight, idx) => (
            <span
              key={idx}
              className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full truncate max-w-[120px]"
            >
              {highlight}
            </span>
          ))}
          {tour.highlights && tour.highlights.length > 3 && (
            <span className="text-xs px-2 py-1 text-gray-500 dark:text-gray-400">
              +{tour.highlights.length - 3}
            </span>
          )}
        </div>

        <Link href={`/tours/${tour.slug}`}>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-black font-medium rounded-xl transition-colors"
          >
            View Tour
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </Link>
      </div>
    </motion.div>
  );
};