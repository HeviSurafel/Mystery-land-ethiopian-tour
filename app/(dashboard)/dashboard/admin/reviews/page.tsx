"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  Filter,
  ChevronDown,
  MoreVertical,
  Star,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  Download,
  Eye,
  Trash2,
  Check,
  X,
  MessageCircle,
  User,
  Calendar,
  Clock,
  ThumbsUp,
  Loader2,
  AlertTriangle,
  ArrowUpDown,
  FilterX,
  CheckSquare,
  XSquare,
  Mail,
  Phone,
  Globe,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal
} from "lucide-react";
import Swal from "sweetalert2";

interface Review {
  id: string;
  _id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userAvatar?: string;
  itemId: string;
  itemType: 'tour' | 'destination';
  itemName: string;
  rating: number;
  title: string;
  content: string;
  pros: string[];
  cons: string[];
  images: string[];
  helpful: number;
  verified: boolean;
  status: 'pending' | 'published' | 'rejected';
  createdAt: string;
  updatedAt: string;
  response?: {
    content: string;
    createdAt: string;
    author: string;
  };
}

interface ReviewStats {
  total: number;
  pending: number;
  published: number;
  rejected: number;
  averageRating: number;
  totalHelpful: number;
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("pending");
  const [typeFilter, setTypeFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedReviews, setSelectedReviews] = useState<string[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1
  });

  // Fetch reviews
  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(typeFilter !== 'all' && { type: typeFilter }),
        ...(ratingFilter !== 'all' && { rating: ratingFilter }),
        ...(searchTerm && { search: searchTerm }),
        sortBy,
        sortOrder
      });

      const response = await fetch(`/api/admin/reviews?${params}`);
      
      if (!response.ok) throw new Error("Failed to fetch reviews");
      
      const data = await response.json();
      
      if (data.success) {
        setReviews(data.data);
        setPagination(data.pagination);
        if (data.stats) setStats(data.stats);
      }
    } catch (err: any) {
      setError(err.message);
      console.error("Error fetching reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [pagination.page, statusFilter, typeFilter, ratingFilter, sortBy, sortOrder]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (pagination.page === 1) {
        fetchReviews();
      } else {
        setPagination(prev => ({ ...prev, page: 1 }));
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Approve review
  const handleApproveReview = async (reviewId: string) => {
    const result = await Swal.fire({
      title: "Approve Review",
      text: "Are you sure you want to approve this review? It will be published immediately.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#10b981",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, approve"
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`/api/admin/reviews/${reviewId}rove`, {
          method: "POST"
        });

        if (!response.ok) throw new Error("Failed to approve review");

        await fetchReviews();
        
        Swal.fire({
          title: "Approved!",
          text: "Review has been approved and published.",
          icon: "success",
          timer: 2000,
          confirmButtonColor: "#B88A3D"
        });
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: "Failed to approve review",
          icon: "error",
          confirmButtonColor: "#B88A3D"
        });
      }
    }
  };

  // Reject review
  const handleRejectReview = async (reviewId: string) => {
    const { value: reason } = await Swal.fire({
      title: "Reject Review",
      html: `
        <div class="text-left">
          <p class="mb-3">Please provide a reason for rejection:</p>
          <textarea id="reject-reason" rows="3" class="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="Reason for rejection..."></textarea>
        </div>
      `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Reject",
      preConfirm: () => {
        const reason = (document.getElementById('reject-reason') as HTMLTextAreaElement)?.value;
        if (!reason) {
          Swal.showValidationMessage('Please provide a reason');
          return false;
        }
        return reason;
      }
    });

    if (reason) {
      try {
        const response = await fetch(`/api/admin/reviews/${reviewId}/reject`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reason })
        });

        if (!response.ok) throw new Error("Failed to reject review");

        await fetchReviews();
        
        Swal.fire({
          title: "Rejected",
          text: "Review has been rejected.",
          icon: "success",
          timer: 2000,
          confirmButtonColor: "#B88A3D"
        });
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: "Failed to reject review",
          icon: "error",
          confirmButtonColor: "#B88A3D"
        });
      }
    }
  };

  // Delete review
  const handleDeleteReview = async (reviewId: string) => {
    const result = await Swal.fire({
      title: "Delete Review",
      text: "Are you sure you want to delete this review? This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete"
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`/api/admin/reviews/${reviewId}`, {
          method: "DELETE"
        });

        if (!response.ok) throw new Error("Failed to delete review");

        await fetchReviews();
        
        Swal.fire({
          title: "Deleted!",
          text: "Review has been deleted.",
          icon: "success",
          timer: 2000,
          confirmButtonColor: "#B88A3D"
        });
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: "Failed to delete review",
          icon: "error",
          confirmButtonColor: "#B88A3D"
        });
      }
    }
  };

  // Bulk approve
  const handleBulkApprove = async () => {
    if (selectedReviews.length === 0) return;

    const result = await Swal.fire({
      title: "Approve Selected",
      text: `Are you sure you want to approve ${selectedReviews.length} reviews?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#10b981",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, approve all"
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch("/api/admin/reviews/bulkrove", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reviewIds: selectedReviews })
        });

        if (!response.ok) throw new Error("Failed to approve reviews");

        await fetchReviews();
        setSelectedReviews([]);
        
        Swal.fire({
          title: "Approved!",
          text: `${selectedReviews.length} reviews have been approved.`,
          icon: "success",
          timer: 2000,
          confirmButtonColor: "#B88A3D"
        });
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: "Failed to approve reviews",
          icon: "error",
          confirmButtonColor: "#B88A3D"
        });
      }
    }
  };

  // Bulk reject
  const handleBulkReject = async () => {
    if (selectedReviews.length === 0) return;

    const result = await Swal.fire({
      title: "Reject Selected",
      text: `Are you sure you want to reject ${selectedReviews.length} reviews?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, reject all"
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch("/api/admin/reviews/bulk/reject", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reviewIds: selectedReviews })
        });

        if (!response.ok) throw new Error("Failed to reject reviews");

        await fetchReviews();
        setSelectedReviews([]);
        
        Swal.fire({
          title: "Rejected",
          text: `${selectedReviews.length} reviews have been rejected.`,
          icon: "success",
          timer: 2000,
          confirmButtonColor: "#B88A3D"
        });
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: "Failed to reject reviews",
          icon: "error",
          confirmButtonColor: "#B88A3D"
        });
      }
    }
  };

  // Bulk delete
  const handleBulkDelete = async () => {
    if (selectedReviews.length === 0) return;

    const result = await Swal.fire({
      title: "Delete Selected",
      text: `Are you sure you want to delete ${selectedReviews.length} reviews? This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete all"
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch("/api/admin/reviews/bulk/delete", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reviewIds: selectedReviews })
        });

        if (!response.ok) throw new Error("Failed to delete reviews");

        await fetchReviews();
        setSelectedReviews([]);
        
        Swal.fire({
          title: "Deleted!",
          text: `${selectedReviews.length} reviews have been deleted.`,
          icon: "success",
          timer: 2000,
          confirmButtonColor: "#B88A3D"
        });
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: "Failed to delete reviews",
          icon: "error",
          confirmButtonColor: "#B88A3D"
        });
      }
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'published':
        return <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium flex items-center w-fit">
          <CheckCircle className="w-3 h-3 mr-1" />
          Published
        </span>;
      case 'pending':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium flex items-center w-fit">
          <Clock className="w-3 h-3 mr-1" />
          Pending
        </span>;
      case 'rejected':
        return <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium flex items-center w-fit">
          <XCircle className="w-3 h-3 mr-1" />
          Rejected
        </span>;
      default:
        return null;
    }
  };

  const renderStars = (rating: number) => {
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
        <span className="ml-2 text-sm text-gray-600">{rating}.0</span>
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const StatCard = ({ title, value, icon: Icon, color }: any) => (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div className={`p-3 rounded-lg bg-${color}-50`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
      </div>
    </div>
  );

  if (loading && !reviews.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-amber-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading reviews...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Review Management</h1>
          <p className="text-gray-600 mt-1">Approve, reject, and manage user reviews</p>
        </div>
        <div className="flex items-center space-x-3 mt-4 md:mt-0">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg relative"
            title="Toggle filters"
          >
            <SlidersHorizontal className="w-5 h-5" />
            {(statusFilter !== 'pending' || typeFilter !== 'all' || ratingFilter !== 'all') && (
              <span className="absolute top-0 right-0 w-2 h-2 bg-amber-500 rounded-full"></span>
            )}
          </button>

          <button
            onClick={fetchReviews}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            title="Refresh"
          >
            <RefreshCw className="w-5 h-5" />
          </button>

          <button
            onClick={() => {/* Export functionality */}}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            title="Export"
          >
            <Download className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <p className="text-red-600">{error}</p>
          </div>
          <button
            onClick={fetchReviews}
            className="px-3 py-1 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
          >
            Retry
          </button>
        </div>
      )}

      {/* Stats Grid */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total Reviews" value={stats.total} icon={MessageCircle} color="blue" />
          <StatCard title="Pending" value={stats.pending} icon={Clock} color="yellow" />
          <StatCard title="Published" value={stats.published} icon={CheckCircle} color="green" />
          <StatCard title="Rejected" value={stats.rejected} icon={XCircle} color="red" />
        </div>
      )}

      {/* Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-xl shadow-sm p-6 overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search by user, tour, or content..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none bg-white"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="published">Published</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type
                </label>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none bg-white"
                >
                  <option value="all">All Types</option>
                  <option value="tour">Tours</option>
                  <option value="destination">Destinations</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating
                </label>
                <select
                  value={ratingFilter}
                  onChange={(e) => setRatingFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none bg-white"
                >
                  <option value="all">All Ratings</option>
                  <option value="5">5 Stars</option>
                  <option value="4">4+ Stars</option>
                  <option value="3">3+ Stars</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none bg-white"
                >
                  <option value="createdAt">Date</option>
                  <option value="rating">Rating</option>
                  <option value="helpful">Helpful</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Order
                </label>
                <button
                  onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-between"
                >
                  <span>{sortOrder === 'asc' ? 'Ascending' : 'Descending'}</span>
                  <ArrowUpDown className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>

            <div className="flex justify-end mt-4 pt-4 border-t">
              <button
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("pending");
                  setTypeFilter("all");
                  setRatingFilter("all");
                  setSortBy("createdAt");
                  setSortOrder("desc");
                }}
                className="flex items-center space-x-1 text-sm text-amber-600 hover:text-amber-700"
              >
                <FilterX className="w-4 h-4" />
                <span>Clear Filters</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bulk Actions */}
      {selectedReviews.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-amber-50 rounded-xl p-4 flex items-center justify-between"
        >
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-amber-700">
              {selectedReviews.length} reviews selected
            </span>
            <button
              onClick={() => setSelectedReviews([])}
              className="text-sm text-amber-600 hover:text-amber-700"
            >
              Clear
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleBulkApprove}
              className="px-3 py-1 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 transition flex items-center"
            >
              <Check className="w-4 h-4 mr-1" />
              Approve
            </button>
            <button
              onClick={handleBulkReject}
              className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition flex items-center"
            >
              <X className="w-4 h-4 mr-1" />
              Reject
            </button>
            <button
              onClick={handleBulkDelete}
              className="px-3 py-1 bg-gray-700 text-white rounded-lg text-sm hover:bg-gray-800 transition flex items-center"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Delete
            </button>
          </div>
        </motion.div>
      )}

      {/* Reviews Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr className="text-left text-sm text-gray-500">
                <th className="px-6 py-4 font-medium w-8">
                  <input
                    type="checkbox"
                    checked={selectedReviews.length === reviews.length && reviews.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedReviews(reviews.map(r => r.id));
                      } else {
                        setSelectedReviews([]);
                      }
                    }}
                    className="w-4 h-4 text-amber-500 rounded border-gray-300 focus:ring-amber-500"
                  />
                </th>
                <th className="px-6 py-4 font-medium">Review</th>
                <th className="px-6 py-4 font-medium">User</th>
                <th className="px-6 py-4 font-medium">Item</th>
                <th className="px-6 py-4 font-medium">Rating</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {reviews.map((review) => (
                <motion.tr
                  key={review.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedReviews.includes(review.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedReviews([...selectedReviews, review.id]);
                        } else {
                          setSelectedReviews(selectedReviews.filter(id => id !== review.id));
                        }
                      }}
                      className="w-4 h-4 text-amber-500 rounded border-gray-300 focus:ring-amber-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="max-w-md">
                      <p className="font-medium text-gray-900">{review.title}</p>
                      <p className="text-sm text-gray-600 line-clamp-2 mt-1">{review.content}</p>
                      {(review.pros.length > 0 || review.cons.length > 0) && (
                        <div className="flex gap-2 mt-2">
                          {review.pros.length > 0 && (
                            <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                              {review.pros.length} pros
                            </span>
                          )}
                          {review.cons.length > 0 && (
                            <span className="text-xs text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                              {review.cons.length} cons
                            </span>
                          )}
                        </div>
                      )}
                      {review.images.length > 0 && (
                        <span className="text-xs text-blue-600 mt-1 block">
                          {review.images.length} photo{review.images.length > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{review.userName}</p>
                      <p className="text-xs text-gray-500">{review.userEmail}</p>
                      {review.verified && (
                        <span className="text-xs text-green-600 flex items-center mt-1">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Verified
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900 capitalize">{review.itemType}</p>
                      <p className="text-xs text-gray-500">{review.itemName}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {renderStars(review.rating)}
                    <div className="flex items-center text-xs text-gray-500 mt-1">
                      <ThumbsUp className="w-3 h-3 mr-1" />
                      {review.helpful} helpful
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(review.status)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {formatDate(review.createdAt)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      {review.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleApproveReview(review.id)}
                            className="p-1 text-green-600 hover:bg-green-50 rounded-lg"
                            title="Approve"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleRejectReview(review.id)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded-lg"
                            title="Reject"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleDeleteReview(review.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded-lg"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>

          {reviews.length === 0 && (
            <div className="text-center py-12">
              <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No reviews found</h3>
              <p className="text-gray-500 mt-1">Try adjusting your filters</p>
            </div>
          )}
        </div>
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-between bg-white rounded-xl shadow-sm px-6 py-4">
          <div className="text-sm text-gray-500">
            Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
            {pagination.total} reviews
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
              disabled={pagination.page === 1}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
              let pageNum = pagination.page;
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
                  key={i}
                  onClick={() => setPagination(prev => ({ ...prev, page: pageNum }))}
                  className={`px-3 py-1 rounded-lg text-sm ${
                    pagination.page === pageNum
                      ? 'bg-amber-500 text-white'
                      : 'border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
              disabled={pagination.page === pagination.pages}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}