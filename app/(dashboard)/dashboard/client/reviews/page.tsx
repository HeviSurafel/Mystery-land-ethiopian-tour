"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Star,
  Edit,
  Trash2,
  ThumbsUp,
  MessageCircle,
  Calendar,
  MapPin,
  User,
  Loader2,
  AlertCircle,
  CheckCircle,
  Clock,
  Camera,
  Mountain,
  Compass,
  Filter,
  Search,
  ChevronRight,
  Plus,
  X,
  Send,
  Image as ImageIcon
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import Swal from "sweetalert2";

interface ReviewableItem {
  id: string;
  type: 'tour' | 'destination';
  name: string;
  image?: string;
  date?: string;
  bookingId?: string;
}

interface Review {
  id: string;
  itemId: string;
  itemType: 'tour' | 'destination';
  itemName: string;
  itemImage?: string;
  rating: number;
  title: string;
  content: string;
  pros?: string[];
  cons?: string[];
  images?: string[];
  helpful: number;
  verified: boolean;
  status: 'published' | 'pending' | 'rejected';
  createdAt: string;
  updatedAt: string;
  response?: {
    content: string;
    createdAt: string;
    author: string;
  };
}

interface ReviewStats {
  totalReviews: number;
  publishedReviews: number;
  pendingReviews: number;
  averageRating: number;
  totalHelpful: number;
  topCategories: Array<{
    type: string;
    count: number;
  }>;
}

export default function ClientReviewsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewableItems, setReviewableItems] = useState<ReviewableItem[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'published' | 'pending'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showWriteModal, setShowWriteModal] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [stats, setStats] = useState<ReviewStats>({
    totalReviews: 0,
    publishedReviews: 0,
    pendingReviews: 0,
    averageRating: 0,
    totalHelpful: 0,
    topCategories: []
  });

  // Fetch reviews and reviewable items
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch user's reviews
        const reviewsRes = await fetch('http://localhost:3000/api/client/reviews');
        const reviewsData = await reviewsRes.json();
        
        if (reviewsData.success) {
          setReviews(reviewsData.data);
          
          // Calculate stats
          const published = reviewsData.data.filter((r: Review) => r.status === 'published').length;
          const pending = reviewsData.data.filter((r: Review) => r.status === 'pending').length;
          const avgRating = reviewsData.data.reduce((acc: number, r: Review) => acc + r.rating, 0) / (reviewsData.data.length || 1);
          const helpful = reviewsData.data.reduce((acc: number, r: Review) => acc + r.helpful, 0);
          
          // Count by type
          const tourCount = reviewsData.data.filter((r: Review) => r.itemType === 'tour').length;
          const destinationCount = reviewsData.data.filter((r: Review) => r.itemType === 'destination').length;
          
          setStats({
            totalReviews: reviewsData.data.length,
            publishedReviews: published,
            pendingReviews: pending,
            averageRating: Math.round(avgRating * 10) / 10,
            totalHelpful: helpful,
            topCategories: [
              { type: 'Tours', count: tourCount },
              { type: 'Destinations', count: destinationCount }
            ].filter(c => c.count > 0)
          });
        }

        // Fetch items available for review (booked but not reviewed)
        const itemsRes = await fetch('http://localhost:3000/api/client/reviews/available');
        const itemsData = await itemsRes.json();
        
        if (itemsData.success) {
          setReviewableItems(itemsData.data);
        }

      } catch (error) {
        console.error('Error fetching reviews:', error);
        Swal.fire({
          title: 'Error',
          text: 'Failed to load reviews',
          icon: 'error',
          confirmButtonColor: '#B88A3D'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter reviews
  useEffect(() => {
    let filtered = [...reviews];

    // Apply tab filter
    if (activeTab !== 'all') {
      filtered = filtered.filter(r => r.status === activeTab);
    }

    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(r => 
        r.itemName.toLowerCase().includes(term) ||
        r.title.toLowerCase().includes(term) ||
        r.content.toLowerCase().includes(term)
      );
    }

    setFilteredReviews(filtered);
  }, [reviews, activeTab, searchTerm]);

  const handleDeleteReview = async (reviewId: string) => {
    const result = await Swal.fire({
      title: 'Delete Review',
      text: 'Are you sure you want to delete this review? This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete'
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`/api/client/reviews/${reviewId}`, {
          method: 'DELETE'
        });

        if (!response.ok) throw new Error('Failed to delete review');

        setReviews(prev => prev.filter(r => r.id !== reviewId));

        Swal.fire({
          title: 'Deleted',
          text: 'Your review has been deleted',
          icon: 'success',
          timer: 2000,
          confirmButtonColor: '#B88A3D'
        });
      } catch (error) {
        Swal.fire({
          title: 'Error',
          text: 'Failed to delete review',
          icon: 'error',
          confirmButtonColor: '#B88A3D'
        });
      }
    }
  };

  const handleEditReview = (review: Review) => {
    setEditingReview(review);
    setShowWriteModal(true);
  };

  const handleReviewSubmitted = (newReview: Review) => {
    if (editingReview) {
      setReviews(prev => prev.map(r => r.id === newReview.id ? newReview : r));
    } else {
      setReviews(prev => [newReview, ...prev]);
      setReviewableItems(prev => prev.filter(item => item.id !== newReview.itemId));
    }
    setShowWriteModal(false);
    setEditingReview(null);
  };

  const getRatingStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? 'text-amber-500 fill-current'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'published':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
            <CheckCircle className="w-3 h-3 mr-1" />
            Published
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
            <Clock className="w-3 h-3 mr-1" />
            Pending Review
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
            <AlertCircle className="w-3 h-3 mr-1" />
            Rejected
          </span>
        );
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-amber-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your reviews...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Reviews</h1>
        <p className="text-gray-600 mt-1">Share your experiences and help other travelers</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Reviews</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalReviews}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <MessageCircle className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Average Rating</p>
              <div className="flex items-center mt-1">
                <p className="text-2xl font-bold text-gray-900 mr-2">{stats.averageRating}</p>
                <div className="flex">
                  {getRatingStars(Math.round(stats.averageRating))}
                </div>
              </div>
            </div>
            <div className="p-3 bg-amber-50 rounded-lg">
              <Star className="w-6 h-6 text-amber-600 fill-current" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Helpful Votes</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalHelpful}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <ThumbsUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.pendingReviews}</p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Available to Review Section */}
      {reviewableItems.length > 0 && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Ready to Review</h2>
            <span className="text-sm text-amber-600 font-medium">{reviewableItems.length} items</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reviewableItems.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg p-4 flex items-start space-x-3 shadow-sm"
              >
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={48}
                      height={48}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-500 to-orange-500">
                      {item.type === 'tour' ? (
                        <Mountain className="w-5 h-5 text-white" />
                      ) : (
                        <MapPin className="w-5 h-5 text-white" />
                      )}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 text-sm">{item.name}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {item.type === 'tour' ? 'Tour' : 'Destination'} • {item.date && formatDate(item.date)}
                  </p>
                  <button
                    onClick={() => {
                      setEditingReview(null);
                      setShowWriteModal(true);
                      // You'll need to pass the item to the modal
                    }}
                    className="mt-2 text-xs text-amber-600 hover:text-amber-700 font-medium inline-flex items-center"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Write Review
                  </button>
                </div>
              </div>
            ))}
            {reviewableItems.length > 3 && (
              <button className="bg-white/50 rounded-lg p-4 flex items-center justify-center border-2 border-dashed border-amber-200 hover:border-amber-300 transition">
                <span className="text-sm text-amber-600 font-medium">
                  +{reviewableItems.length - 3} more
                </span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Reviews List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Tabs and Search */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center space-x-2">
              {(['all', 'published', 'pending'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition ${
                    activeTab === tab
                      ? 'bg-amber-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {tab}
                  {tab === 'pending' && stats.pendingReviews > 0 && (
                    <span className="ml-2 px-1.5 py-0.5 bg-white/20 rounded-full text-xs">
                      {stats.pendingReviews}
                    </span>
                  )}
                </button>
              ))}
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search reviews..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
              />
            </div>
          </div>
        </div>

        {/* Reviews */}
        {filteredReviews.length > 0 ? (
          <div className="divide-y">
            {filteredReviews.map((review) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-6 hover:bg-gray-50 transition"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    {/* Item Image */}
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      {review.itemImage ? (
                        <Image
                          src={review.itemImage}
                          alt={review.itemName}
                          width={64}
                          height={64}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-500 to-orange-500">
                          {review.itemType === 'tour' ? (
                            <Mountain className="w-6 h-6 text-white" />
                          ) : (
                            <MapPin className="w-6 h-6 text-white" />
                          )}
                        </div>
                      )}
                    </div>

                    {/* Review Info */}
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-semibold text-gray-900">{review.itemName}</h3>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-500 capitalize">{review.itemType}</span>
                        {review.verified && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-700">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Verified Booking
                          </span>
                        )}
                      </div>

                      <div className="flex items-center space-x-3 mb-2">
                        {getRatingStars(review.rating)}
                        <span className="text-sm font-medium text-gray-700">{review.rating}.0</span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-500">{formatDate(review.createdAt)}</span>
                      </div>

                      <h4 className="font-medium text-gray-900 mb-2">{review.title}</h4>
                      <p className="text-sm text-gray-600 mb-3">{review.content}</p>

                      {/* Pros & Cons */}
                      {(review.pros?.length || review.cons?.length) && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                          {review.pros && review.pros.length > 0 && (
                            <div>
                              <p className="text-xs font-medium text-green-600 mb-1">Pros</p>
                              <ul className="text-xs text-gray-600 space-y-1">
                                {review.pros.slice(0, 3).map((pro, i) => (
                                  <li key={i} className="flex items-start">
                                    <span className="text-green-500 mr-1">✓</span>
                                    {pro}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {review.cons && review.cons.length > 0 && (
                            <div>
                              <p className="text-xs font-medium text-red-600 mb-1">Cons</p>
                              <ul className="text-xs text-gray-600 space-y-1">
                                {review.cons.slice(0, 3).map((con, i) => (
                                  <li key={i} className="flex items-start">
                                    <span className="text-red-500 mr-1">✗</span>
                                    {con}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Review Images */}
                      {review.images && review.images.length > 0 && (
                        <div className="flex space-x-2 mb-3">
                          {review.images.slice(0, 3).map((image, i) => (
                            <div
                              key={i}
                              className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 cursor-pointer hover:opacity-90 transition"
                              onClick={() => window.open(image, '_blank')}
                            >
                              <Image
                                src={image}
                                alt={`Review image ${i + 1}`}
                                width={64}
                                height={64}
                                className="object-cover w-full h-full"
                              />
                            </div>
                          ))}
                          {review.images.length > 3 && (
                            <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center text-sm text-gray-500">
                              +{review.images.length - 3}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Helpful Count */}
                      <div className="flex items-center text-xs text-gray-400">
                        <ThumbsUp className="w-3 h-3 mr-1" />
                        {review.helpful} people found this helpful
                      </div>

                      {/* Business Response */}
                      {review.response && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-start space-x-3">
                            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                              <User className="w-4 h-4 text-amber-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                Response from {review.response.author}
                              </p>
                              <p className="text-xs text-gray-500 mb-2">
                                {formatDate(review.response.createdAt)}
                              </p>
                              <p className="text-sm text-gray-600">{review.response.content}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Status and Actions */}
                  <div className="flex flex-col items-end space-y-2">
                    {getStatusBadge(review.status)}
                    
                    {review.status !== 'rejected' && (
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => handleEditReview(review)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="Edit Review"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteReview(review.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Delete Review"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'No reviews found' : 'No reviews yet'}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm 
                ? `No reviews match "${searchTerm}"`
                : "You haven't written any reviews yet"}
            </p>
            {searchTerm ? (
              <button
                onClick={() => setSearchTerm('')}
                className="inline-flex items-center px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition"
              >
                Clear Search
              </button>
            ) : (
              reviewableItems.length > 0 && (
                <button
                  onClick={() => setShowWriteModal(true)}
                  className="inline-flex items-center px-6 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Write Your First Review
                </button>
              )
            )}
          </div>
        )}
      </div>

      {/* Write/Edit Review Modal */}
      <AnimatePresence>
        {showWriteModal && (
          <ReviewModal
            item={editingReview ? {
              id: editingReview.itemId,
              type: editingReview.itemType,
              name: editingReview.itemName,
              image: editingReview.itemImage
            } : undefined}
            existingReview={editingReview}
            onClose={() => {
              setShowWriteModal(false);
              setEditingReview(null);
            }}
            onSubmit={handleReviewSubmitted}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// Review Modal Component
interface ReviewModalProps {
  item?: {
    id: string;
    type: 'tour' | 'destination';
    name: string;
    image?: string;
  };
  existingReview?: Review | null;
  onClose: () => void;
  onSubmit: (review: Review) => void;
}

function ReviewModal({ item, existingReview, onClose, onSubmit }: ReviewModalProps) {
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState(existingReview?.title || '');
  const [content, setContent] = useState(existingReview?.content || '');
  const [pros, setPros] = useState<string[]>(existingReview?.pros || []);
  const [cons, setCons] = useState<string[]>(existingReview?.cons || []);
  const [newPro, setNewPro] = useState('');
  const [newCon, setNewCon] = useState('');
  const [images, setImages] = useState<string[]>(existingReview?.images || []);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async () => {
    if (!rating) {
      Swal.fire({
        title: 'Rating Required',
        text: 'Please select a rating',
        icon: 'warning',
        confirmButtonColor: '#B88A3D'
      });
      return;
    }

    if (!title.trim()) {
      Swal.fire({
        title: 'Title Required',
        text: 'Please enter a review title',
        icon: 'warning',
        confirmButtonColor: '#B88A3D'
      });
      return;
    }

    if (!content.trim()) {
      Swal.fire({
        title: 'Review Required',
        text: 'Please write your review',
        icon: 'warning',
        confirmButtonColor: '#B88A3D'
      });
      return;
    }

    try {
      setLoading(true);

      const reviewData = {
        itemId: item?.id || existingReview?.itemId,
        itemType: item?.type || existingReview?.itemType,
        rating,
        title,
        content,
        pros,
        cons,
        images
      };

      const url = existingReview 
        ? `/api/client/reviews/${existingReview.id}`
        : '/api/client/reviews';
      
      const method = existingReview ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit review');
      }

      onSubmit(data.data);
      
      Swal.fire({
        title: 'Success',
        text: existingReview ? 'Review updated successfully' : 'Review submitted successfully',
        icon: 'success',
        timer: 2000,
        confirmButtonColor: '#B88A3D'
      });

    } catch (error: any) {
      Swal.fire({
        title: 'Error',
        text: error.message,
        icon: 'error',
        confirmButtonColor: '#B88A3D'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      Swal.fire({
        title: 'Invalid File Type',
        text: 'Only JPEG, PNG, and WebP images are allowed',
        icon: 'error',
        confirmButtonColor: '#B88A3D'
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      Swal.fire({
        title: 'File Too Large',
        text: 'Maximum file size is 5MB',
        icon: 'error',
        confirmButtonColor: '#B88A3D'
      });
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('http://localhost:3000/api/upload', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to upload image');
      }

      setImages(prev => [...prev, data.url]);

    } catch (error: any) {
      Swal.fire({
        title: 'Upload Failed',
        text: error.message,
        icon: 'error',
        confirmButtonColor: '#B88A3D'
      });
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const addPro = () => {
    if (newPro.trim()) {
      setPros(prev => [...prev, newPro.trim()]);
      setNewPro('');
    }
  };

  const addCon = () => {
    if (newCon.trim()) {
      setCons(prev => [...prev, newCon.trim()]);
      setNewCon('');
    }
  };

  const removePro = (index: number) => {
    setPros(prev => prev.filter((_, i) => i !== index));
  };

  const removeCon = (index: number) => {
    setCons(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 overflow-y-auto"
    >
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl w-full"
        >
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {existingReview ? 'Edit Review' : 'Write a Review'}
              </h3>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {item && (
              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg mb-6">
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-200">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={48}
                      height={48}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-500 to-orange-500">
                      {item.type === 'tour' ? (
                        <Mountain className="w-5 h-5 text-white" />
                      ) : (
                        <MapPin className="w-5 h-5 text-white" />
                      )}
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{item.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{item.type}</p>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Rating <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="p-1 focus:outline-none"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= (hoverRating || rating)
                            ? 'text-amber-500 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-sm text-gray-500">
                    {rating ? `${rating}.0` : 'Select rating'}
                  </span>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Review Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                  placeholder="Summarize your experience"
                  maxLength={100}
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Review <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={5}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                  placeholder="Share your experience in detail..."
                />
              </div>

              {/* Pros */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pros (Optional)
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {pros.map((pro, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-700"
                    >
                      {pro}
                      <button
                        onClick={() => removePro(index)}
                        className="ml-2 text-green-600 hover:text-green-800"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={newPro}
                    onChange={(e) => setNewPro(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addPro()}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none text-sm"
                    placeholder="Add a pro (e.g., Great guide)"
                  />
                  <button
                    onClick={addPro}
                    className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Cons */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cons (Optional)
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {cons.map((con, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-red-100 text-red-700"
                    >
                      {con}
                      <button
                        onClick={() => removeCon(index)}
                        className="ml-2 text-red-600 hover:text-red-800"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={newCon}
                    onChange={(e) => setNewCon(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addCon()}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none text-sm"
                    placeholder="Add a con (e.g., Long drive)"
                  />
                  <button
                    onClick={addCon}
                    className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Images */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Photos (Optional)
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {images.map((image, index) => (
                    <div key={index} className="relative w-20 h-20 rounded-lg overflow-hidden group">
                      <Image
                        src={image}
                        alt={`Review photo ${index + 1}`}
                        width={80}
                        height={80}
                        className="object-cover w-full h-full"
                      />
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  <label className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-amber-500 transition">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={uploading}
                    />
                    {uploading ? (
                      <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
                    ) : (
                      <Camera className="w-6 h-6 text-gray-400" />
                    )}
                  </label>
                </div>
                <p className="text-xs text-gray-500">
                  Upload up to 5 photos (JPEG, PNG, WebP, max 5MB each)
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="w-full inline-flex justify-center items-center px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition sm:ml-3 sm:w-auto disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  {existingReview ? 'Update Review' : 'Submit Review'}
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="mt-3 w-full inline-flex justify-center px-4 py-2 bg-white text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50 transition sm:mt-0 sm:w-auto"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}