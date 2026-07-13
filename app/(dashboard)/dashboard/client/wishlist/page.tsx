"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Heart,
  Trash2,
  Eye,
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Clock,
  Star,
  Loader2,
  AlertCircle,
  Search,
  Filter,
  X,
  ChevronRight,
  Mountain,
  Compass,
  Sun,
  Cloud,
  Award,
  Shield,
  Coffee,
  Camera,
  Grid3x3,
  List,
  LayoutGrid,
  ArrowUpDown,
  ShoppingBag
} from "lucide-react";

import Swal from "sweetalert2";
import { useAuth } from "@/contexts/AuthContext";

interface WishlistItem {
  id: string;
  tourId: string;
  tourName: string;
  tourImage?: string;
  tourDuration?: string;
  tourDifficulty?: string;
  tourRating?: number;
  tourReviews?: number;
  destination?: string;
  destinationId?: string;
  price?: number;
  discountPrice?: number;
  addedAt: string;
  highlights?: string[];
}

interface WishlistResponse {
  success: boolean;
  data: WishlistItem[];
  total: number;
}

export default function ClientWishlistPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<WishlistItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'compact'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'date'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    totalValue: 0,
    averagePrice: 0
  });

  // Fetch wishlist
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3000/api/client/wishlist');
        const data: WishlistResponse = await response.json();
        
        if (data.success) {
          setWishlist(data.data);
          setFilteredItems(data.data);
          
          // Calculate stats
          const totalValue = data.data.reduce((acc, item) => acc + (item.price || 0), 0);
          const averagePrice = data.data.length > 0 ? totalValue / data.data.length : 0;
          
          setStats({
            total: data.data.length,
            totalValue,
            averagePrice
          });
        }
      } catch (error) {
        console.error('Error fetching wishlist:', error);
        Swal.fire({
          title: 'Error',
          text: 'Failed to load wishlist',
          icon: 'error',
          confirmButtonColor: '#B88A3D'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  // Filter and sort items
  useEffect(() => {
    let filtered = [...wishlist];

    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(item => 
        item.tourName.toLowerCase().includes(term) ||
        item.destination?.toLowerCase().includes(term) ||
        item.highlights?.some(h => h.toLowerCase().includes(term))
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'name':
          comparison = a.tourName.localeCompare(b.tourName);
          break;
        case 'price':
          comparison = (a.price || 0) - (b.price || 0);
          break;
        case 'date':
          comparison = new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    setFilteredItems(filtered);
  }, [wishlist, searchTerm, sortBy, sortOrder]);

  const handleRemoveFromWishlist = async (itemId: string, showConfirmation = true) => {
    const removeItem = async () => {
      try {
        const response = await fetch(`/api/client/wishlist/${itemId}`, {
          method: 'DELETE'
        });
        
        if (!response.ok) throw new Error('Failed to remove from wishlist');
        
        setWishlist(prev => prev.filter(item => item.id !== itemId));
        setSelectedItems(prev => prev.filter(id => id !== itemId));
        
        // Update stats
        const removedItem = wishlist.find(item => item.id === itemId);
        if (removedItem) {
          setStats(prev => ({
            total: prev.total - 1,
            totalValue: prev.totalValue - (removedItem.price || 0),
            averagePrice: prev.total > 1 ? (prev.totalValue - (removedItem.price || 0)) / (prev.total - 1) : 0
          }));
        }
        
        if (showConfirmation) {
          Swal.fire({
            title: 'Removed',
            text: 'Item removed from wishlist',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false
          });
        }
      } catch (error) {
        Swal.fire({
          title: 'Error',
          text: 'Failed to remove item',
          icon: 'error',
          confirmButtonColor: '#B88A3D'
        });
      }
    };

    if (showConfirmation) {
      const result = await Swal.fire({
        title: 'Remove from Wishlist',
        text: 'Are you sure you want to remove this item?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, remove'
      });
      
      if (result.isConfirmed) {
        await removeItem();
      }
    } else {
      await removeItem();
    }
  };

  const handleBulkRemove = async () => {
    if (selectedItems.length === 0) return;

    const result = await Swal.fire({
      title: 'Remove Selected Items',
      text: `Are you sure you want to remove ${selectedItems.length} items from your wishlist?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, remove all'
    });

    if (result.isConfirmed) {
      for (const itemId of selectedItems) {
        await handleRemoveFromWishlist(itemId, false);
      }
      
      setSelectedItems([]);
      
      Swal.fire({
        title: 'Removed',
        text: `${selectedItems.length} items removed from wishlist`,
        icon: 'success',
        timer: 2000,
        confirmButtonColor: '#B88A3D'
      });
    }
  };

  const handleSelectAll = () => {
    if (selectedItems.length === filteredItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredItems.map(item => item.id));
    }
  };

  const handleAddToCart = (tourId: string) => {
    router.push(`/book/${tourId}`);
  };

  const getDifficultyColor = (difficulty?: string) => {
    switch(difficulty?.toLowerCase()) {
      case 'easy':
        return 'text-green-600 bg-green-50';
      case 'moderate':
        return 'text-yellow-600 bg-yellow-50';
      case 'challenging':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const formatPrice = (price?: number) => {
    if (!price) return 'Price on request';
    return `$${price.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-amber-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your wishlist...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Wishlist</h1>
        <p className="text-gray-600 mt-1">Your saved tours and destinations</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Saved Items</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
            </div>
            <div className="p-3 bg-red-50 rounded-lg">
              <Heart className="w-6 h-6 text-red-500" fill="currentColor" />
            </div>
          </div>
        </div>

       
      </div>

      {/* Actions Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search wishlist..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
              />
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center space-x-2">
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition ${
                    viewMode === 'grid' ? 'bg-white shadow-sm text-amber-600' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Grid3x3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition ${
                    viewMode === 'list' ? 'bg-white shadow-sm text-amber-600' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('compact')}
                  className={`p-2 rounded-lg transition ${
                    viewMode === 'compact' ? 'bg-white shadow-sm text-amber-600' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <Filter className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-4 bg-gray-50 border-b border-gray-100"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                  >
                    <option value="date">Date Added</option>
                    <option value="name">Name</option>
                    <option value="price">Price</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                  <button
                    onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-between"
                  >
                    <span>{sortOrder === 'asc' ? 'Ascending' : 'Descending'}</span>
                    <ArrowUpDown className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none">
                    <option>All Prices</option>
                    <option>Under $500</option>
                    <option>$500 - $1000</option>
                    <option>$1000 - $2000</option>
                    <option>Over $2000</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bulk Actions */}
        {selectedItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-amber-50 border-b border-amber-100 flex items-center justify-between"
          >
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-amber-700">
                {selectedItems.length} items selected
              </span>
              <button
                onClick={handleSelectAll}
                className="text-sm text-amber-600 hover:text-amber-700"
              >
                {selectedItems.length === filteredItems.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  selectedItems.forEach(id => {
                    const item = wishlist.find(i => i.id === id);
                    if (item) handleAddToCart(item.tourId);
                  });
                }}
                className="px-3 py-1 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 transition"
              >
                Book Selected
              </button>
              <button
                onClick={handleBulkRemove}
                className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition"
              >
                Remove Selected
              </button>
            </div>
          </motion.div>
        )}

        {/* Wishlist Items */}
        {filteredItems.length > 0 ? (
          <>
            {viewMode === 'grid' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                {filteredItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-200 overflow-hidden"
                  >
                    {/* Image */}
                    <div className="relative h-48 bg-gray-100">
                      {item.tourImage ? (
                        <Image
                          src={item.tourImage}
                          alt={item.tourName}
                          fill
                          className="object-cover group-hover:scale-105 transition duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-500 to-orange-500">
                          <Mountain className="w-12 h-12 text-white/50" />
                        </div>
                      )}
                      
                      {/* Selection Checkbox */}
                      <div className="absolute top-3 left-3">
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(item.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedItems([...selectedItems, item.id]);
                            } else {
                              setSelectedItems(selectedItems.filter(id => id !== item.id));
                            }
                          }}
                          className="w-4 h-4 text-amber-500 rounded border-gray-300 focus:ring-amber-500"
                        />
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => handleRemoveFromWishlist(item.id)}
                        className="absolute top-3 right-3 p-1.5 bg-white rounded-full shadow-md hover:bg-red-50 transition opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>

                      {/* Duration Badge */}
                      {item.tourDuration && (
                        <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded-lg text-xs flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {item.tourDuration}
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-gray-900 line-clamp-1 flex-1">
                          {item.tourName}
                        </h3>
                        {item.tourRating && (
                          <div className="flex items-center text-amber-500 ml-2">
                            <Star className="w-4 h-4 fill-current" />
                            <span className="text-sm font-medium ml-1">{item.tourRating}</span>
                          </div>
                        )}
                      </div>

                      {/* Destination */}
                      {item.destination && (
                        <p className="text-sm text-gray-600 mb-2 flex items-center">
                          <MapPin className="w-3 h-3 mr-1 text-gray-400" />
                          {item.destination}
                        </p>
                      )}

                      {/* Highlights */}
                      {item.highlights && item.highlights.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {item.highlights.slice(0, 2).map((highlight, i) => (
                            <span
                              key={i}
                              className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
                            >
                              {highlight}
                            </span>
                          ))}
                          {item.highlights.length > 2 && (
                            <span className="text-xs text-gray-400">
                              +{item.highlights.length - 2}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Price and Difficulty */}
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <span className="text-sm text-gray-500">From</span>
                          <span className="text-lg font-bold text-amber-600 ml-1">
                            {formatPrice(item.price)}
                          </span>
                        </div>
                        {item.tourDifficulty && (
                          <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(item.tourDifficulty)}`}>
                            {item.tourDifficulty}
                          </span>
                        )}
                      </div>

                      {/* Added Date */}
                      <p className="text-xs text-gray-400 mb-3">
                        Added {formatDate(item.addedAt)}
                      </p>

                      {/* Actions */}
                      <div className="flex space-x-2">
                        <Link
                          href={`/tours/${item.tourId}`}
                          className="flex-1 text-center px-3 py-2 bg-amber-500 text-white rounded-lg text-sm hover:bg-amber-600 transition flex items-center justify-center"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Link>
                        <button
                          onClick={() => handleAddToCart(item.tourId)}
                          className="flex-1 text-center px-3 py-2 border border-amber-500 text-amber-600 rounded-lg text-sm hover:bg-amber-50 transition"
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {viewMode === 'list' && (
              <div className="divide-y">
                {filteredItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.02 }}
                    className="p-6 hover:bg-gray-50 transition"
                  >
                    <div className="flex items-start space-x-4">
                      {/* Selection Checkbox */}
                      <div className="pt-2">
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(item.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedItems([...selectedItems, item.id]);
                            } else {
                              setSelectedItems(selectedItems.filter(id => id !== item.id));
                            }
                          }}
                          className="w-4 h-4 text-amber-500 rounded border-gray-300 focus:ring-amber-500"
                        />
                      </div>

                      {/* Image */}
                      <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        {item.tourImage ? (
                          <Image
                            src={item.tourImage}
                            alt={item.tourName}
                            width={96}
                            height={96}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-500 to-orange-500">
                            <Mountain className="w-8 h-8 text-white" />
                          </div>
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900">{item.tourName}</h3>
                            {item.destination && (
                              <p className="text-sm text-gray-600 mt-1 flex items-center">
                                <MapPin className="w-3 h-3 mr-1 text-gray-400" />
                                {item.destination}
                              </p>
                            )}
                            <div className="flex items-center space-x-4 mt-2">
                              {item.tourDuration && (
                                <span className="text-sm text-gray-500 flex items-center">
                                  <Clock className="w-4 h-4 mr-1" />
                                  {item.tourDuration}
                                </span>
                              )}
                              {item.tourDifficulty && (
                                <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(item.tourDifficulty)}`}>
                                  {item.tourDifficulty}
                                </span>
                              )}
                              {item.tourRating && (
                                <span className="text-sm text-gray-500 flex items-center">
                                  <Star className="w-4 h-4 mr-1 text-amber-500 fill-current" />
                                  {item.tourRating} ({item.tourReviews} reviews)
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-amber-600">{formatPrice(item.price)}</p>
                            <p className="text-xs text-gray-400 mt-1">
                              Added {formatDate(item.addedAt)}
                            </p>
                          </div>
                        </div>

                        {/* Highlights */}
                        {item.highlights && item.highlights.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {item.highlights.slice(0, 3).map((highlight, i) => (
                              <span
                                key={i}
                                className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                              >
                                {highlight}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center space-x-2 mt-4">
                          <Link
                            href={`/tours/${item.tourId}`}
                            className="px-4 py-2 bg-amber-500 text-white rounded-lg text-sm hover:bg-amber-600 transition"
                          >
                            View Tour
                          </Link>
                          <button
                            onClick={() => handleAddToCart(item.tourId)}
                            className="px-4 py-2 border border-amber-500 text-amber-600 rounded-lg text-sm hover:bg-amber-50 transition"
                          >
                            Book Now
                          </button>
                          <button
                            onClick={() => handleRemoveFromWishlist(item.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="Remove from wishlist"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {viewMode === 'compact' && (
              <div className="p-4 space-y-2">
                {filteredItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.02 }}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                  >
                    <div className="flex items-center space-x-3 flex-1">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedItems([...selectedItems, item.id]);
                          } else {
                            setSelectedItems(selectedItems.filter(id => id !== item.id));
                          }
                        }}
                        className="w-4 h-4 text-amber-500 rounded border-gray-300 focus:ring-amber-500"
                      />
                      
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                        {item.tourImage ? (
                          <Image
                            src={item.tourImage}
                            alt={item.tourName}
                            width={40}
                            height={40}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-amber-100">
                            <Heart className="w-4 h-4 text-amber-500" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{item.tourName}</h4>
                        <p className="text-xs text-gray-500">{item.destination}</p>
                      </div>

                      <div className="text-right">
                        <p className="font-medium text-amber-600">{formatPrice(item.price)}</p>
                        <p className="text-xs text-gray-400">{item.tourDuration}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1 ml-4">
                      <Link
                        href={`/tours/${item.tourId}`}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleRemoveFromWishlist(item.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="p-12 text-center">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-10 h-10 text-red-300" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'No matches found' : 'Your wishlist is empty'}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm 
                ? `No items match "${searchTerm}"`
                : "Start saving tours you're interested in for later"}
            </p>
            {searchTerm ? (
              <button
                onClick={() => setSearchTerm('')}
                className="inline-flex items-center px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition"
              >
                Clear Search
              </button>
            ) : (
              <Link
                href="/tours"
                className="inline-flex items-center px-6 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition"
              >
                <Compass className="w-4 h-4 mr-2" />
                Explore Tours
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Bottom Actions */}
      {filteredItems.length > 0 && (
        <div className="flex items-center justify-between bg-white rounded-xl shadow-sm border border-gray-100 px-6 py-4">
          <p className="text-sm text-gray-500">
            Showing {filteredItems.length} of {stats.total} items
          </p>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleSelectAll}
              className="text-sm text-amber-600 hover:text-amber-700"
            >
              {selectedItems.length === filteredItems.length ? 'Deselect All' : 'Select All'}
            </button>
            {selectedItems.length > 0 && (
              <button
                onClick={() => {
                  selectedItems.forEach(id => {
                    const item = wishlist.find(i => i.id === id);
                    if (item) handleAddToCart(item.tourId);
                  });
                }}
                className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 transition"
              >
                Book Selected ({selectedItems.length})
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}