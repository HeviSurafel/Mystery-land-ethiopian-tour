"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Star,
  MapPin,
  Eye,
  Edit,
  Trash2,
  Award,
  Landmark,
  Camera,
  CheckCircle,
  XCircle,
  Clock
} from "lucide-react";
import { Destination } from "@/types/types";
import { destinationTypes } from "@/constants/destination";

interface DestinationsGridProps {
  destinations: Destination[];
  selectedDestinations: string[];
  onSelect: (id: string) => void;
  onSelectAll: (ids: string[]) => void;
  onEdit: (destination: Destination) => void;
  onDelete: (destination: Destination) => void;
}

export const DestinationsGrid = ({
  destinations,
  selectedDestinations,
  onSelect,
  onSelectAll,
  onEdit,
  onDelete
}: DestinationsGridProps) => {
  const getTypeIcon = (type: string) => {
    const found = destinationTypes.find(t => t.value === type);
    const Icon = found?.icon || MapPin;
    return <Icon className="w-3 h-3 mr-1" />;
  };

  const getStatusColor = (status: string = 'active') => {
    switch(status) {
      case 'active': 
        return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'inactive': 
        return 'text-gray-700 bg-gray-50 border-gray-200';
      case 'upcoming': 
        return 'text-blue-700 bg-blue-50 border-blue-200';
      default: 
        return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string = 'active') => {
    switch(status) {
      case 'active': return <CheckCircle className="w-3 h-3 mr-1" />;
      case 'inactive': return <XCircle className="w-3 h-3 mr-1" />;
      case 'upcoming': return <Clock className="w-3 h-3 mr-1" />;
      default: return null;
    }
  };

  const getTagColor = (tag: string) => {
    switch(tag?.toLowerCase()) {
      case 'unesco': return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'cultural': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'historical': return 'bg-indigo-100 text-indigo-800 border-indigo-300';
      case 'nature': return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'wildlife': return 'bg-lime-100 text-lime-800 border-lime-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const handleSelectAll = () => {
    if (selectedDestinations.length === destinations.length) {
      onSelectAll([]);
    } else {
      onSelectAll(destinations.map(d => d.id || d._id || '').filter(Boolean));
    }
  };

  return (
    <>
      {/* Select All Header */}
      {destinations.length > 0 && (
        <div className="flex items-center justify-between mb-4 px-2">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={selectedDestinations.length === destinations.length && destinations.length > 0}
              onChange={handleSelectAll}
              className="w-4 h-4 text-amber-500 rounded border-gray-300 focus:ring-amber-500"
            />
            <span className="text-sm text-gray-600">
              {selectedDestinations.length > 0 
                ? `${selectedDestinations.length} of ${destinations.length} selected` 
                : 'Select all'}
            </span>
          </div>
          
          {selectedDestinations.length > 0 && (
            <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
              {selectedDestinations.length} selected
            </span>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {destinations.map((dest, index) => {
          const destinationId = dest.id || dest._id || '';
          const imageUrl = dest.images && dest.images.length > 0 
            ? dest.images[0] 
            : "/Images/placeholder.jpg";
          const isSelected = selectedDestinations.includes(destinationId);
          
          return (
            <motion.div
              key={destinationId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden border ${
                isSelected ? 'ring-2 ring-amber-500 border-amber-500' : 'border-gray-200'
              }`}
            >
              <div className="relative h-48 group">
                <Image
                  src={imageUrl}
                  alt={dest.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {/* Featured badge */}
                {dest.featured && (
                  <div className="absolute top-3 left-3 bg-amber-500 text-white text-xs px-2 py-1 rounded-full flex items-center shadow-lg z-10">
                    <Award className="w-3 h-3 mr-1" />
                    Featured
                  </div>
                )}
                
                {/* UNESCO badge - adjust position based on featured */}
                {dest.tag?.toLowerCase() === 'unesco' && (
                  <div className={`absolute top-3 ${dest.featured ? 'left-24' : 'left-3'} bg-indigo-600 text-white text-xs px-2 py-1 rounded-full flex items-center shadow-lg z-10`}>
                    <Landmark className="w-3 h-3 mr-1" />
                    UNESCO
                  </div>
                )}
                
                {/* Rating */}
                <div className="absolute bottom-3 left-3 flex items-center bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs z-10">
                  <Star className="w-3 h-3 fill-amber-500 text-amber-500 mr-1" />
                  <span className="font-medium">{dest.rating?.toFixed(1) || '0.0'}</span>
                </div>
                
                {/* Checkbox */}
                <div className="absolute top-3 right-3 bg-white rounded-lg shadow-md p-1 z-10">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onSelect(destinationId)}
                    className="w-4 h-4 text-amber-500 rounded border-gray-300 focus:ring-amber-500 cursor-pointer"
                  />
                </div>

                {/* Photo count badge */}
                <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs flex items-center z-10">
                  <Camera className="w-3 h-3 mr-1" />
                  {dest.images?.length || 0}
                </div>
              </div>

              <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-lg line-clamp-1">{dest.name}</h3>
                    <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                      {dest.description || 'No description available'}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-3">
                  {/* Type badge */}
                  <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full flex items-center border border-gray-200">
                    {getTypeIcon(dest.type)}
                    <span className="capitalize">{dest.type}</span>
                  </span>
                  
                  {/* Tag badge (if not UNESCO since we show it separately) */}
                  {dest.tag && dest.tag !== 'all' && dest.tag.toLowerCase() !== 'unesco' && (
                    <span className={`text-xs px-2 py-1 rounded-full flex items-center border ${getTagColor(dest.tag)}`}>
                      <Award className="w-3 h-3 mr-1" />
                      {dest.tag}
                    </span>
                  )}
                  
                  {/* Status badge */}
                  <span className={`text-xs px-2 py-1 rounded-full flex items-center border ${getStatusColor(dest.status)}`}>
                    {getStatusIcon(dest.status)}
                    <span className="capitalize">{dest.status || 'active'}</span>
                  </span>
                </div>

                
                {/* Action Buttons */}
                <div className="mt-4 flex justify-end space-x-2 border-t border-gray-100 pt-4">
                  <Link href={`/destinations/${dest.slug}`} target="_blank">
                    <button 
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View destination"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </Link>
                  <button
                    onClick={() => onEdit(dest)}
                    className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                    title="Edit destination"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(dest)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete destination"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Empty State */}
      {destinations.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-10 h-10 text-amber-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">No destinations found</h3>
          <p className="text-gray-500 mt-2 max-w-md mx-auto">
            Try adjusting your search or filters to find what you're looking for.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition inline-flex items-center"
          >
            <Eye className="w-4 h-4 mr-2" />
            Refresh
          </button>
        </div>
      )}
    </>
  );
};