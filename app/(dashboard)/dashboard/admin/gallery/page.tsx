"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Swal from "sweetalert2";
import { useAuth } from "@/contexts/AuthContext";
import { GalleryPhoto, GalleryCollection, GalleryCategory, GalleryFilters, GalleryStats } from "@/types/types";
import { formatDistanceToNow, format } from "date-fns";
import { AlertTriangle, ArrowUpDown, Camera, Download, Edit, Eye, FilterX, Folder, FolderOpen, Grid3x3, Heart, Images, LayoutGrid, List, Loader2, Plus, RefreshCw, Search, SlidersHorizontal, Star, StarOff, Trash2, Upload, ZoomIn } from "lucide-react";

const sortOptions = [
  { value: "createdAt", label: "Upload Date" },
  { value: "title", label: "Title" },
  { value: "views", label: "Views" },
  { value: "likes", label: "Likes" },
  { value: "dateTaken", label: "Date Taken" }
];

const viewModes = [
  { value: "grid", icon: Grid3x3, label: "Grid View" },
  { value: "list", icon: List, label: "List View" },
  { value: "masonry", icon: LayoutGrid, label: "Masonry View" }
];

export default function AdminGalleryPage() {
  const { user } = useAuth();
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [collections, setCollections] = useState<GalleryCollection[]>([]);
  const [categories, setCategories] = useState<GalleryCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<GalleryStats | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list" | "masonry">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"photos" | "collections" | "categories">("photos");
  
  // Filters
  const [filters, setFilters] = useState<GalleryFilters>({
    search: "",
    category: "all",
    tag: "all",
    featured: undefined,
    fromDate: "",
    toDate: "",
    sortBy: "createdAt",
    sortOrder: "desc",
    page: 1,
    limit: 24
  });

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 24,
    total: 0,
    pages: 1,
    hasNextPage: false,
    hasPrevPage: false
  });

  // Fetch photos
  const fetchPhotos = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: filters.page?.toString() || "1",
        limit: filters.limit?.toString() || "24",
        ...(filters.search && { search: filters.search }),
        ...(filters.category && filters.category !== "all" && { category: filters.category }),
        ...(filters.tag && filters.tag !== "all" && { tag: filters.tag }),
        ...(filters.featured !== undefined && { featured: filters.featured.toString() }),
        ...(filters.fromDate && { fromDate: filters.fromDate }),
        ...(filters.toDate && { toDate: filters.toDate }),
        sortBy: filters.sortBy || "createdAt",
        sortOrder: filters.sortOrder || "desc"
      });

      const response = await fetch(`/api/admin/gallery?${params}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch photos");
      }

      const data = await response.json();
      
      if (data.success) {
        setPhotos(data.data);
        setPagination(data.pagination);
        if (data.stats) {
          setStats(data.stats);
        }
      }
    } catch (err: any) {
      setError(err.message);
      console.error("Error fetching photos:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch collections
  const fetchCollections = async () => {
    try {
      const response = await fetch("/api/admin/gallery/collections");
      const data = await response.json();
      if (data.success) {
        setCollections(data.data);
      }
    } catch (error) {
      console.error("Error fetching collections:", error);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/admin/gallery/categories");
      const data = await response.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchPhotos();
    fetchCollections();
    fetchCategories();
  }, [filters.page, filters.sortBy, filters.sortOrder, filters.category, filters.tag, filters.featured, filters.fromDate, filters.toDate]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (filters.page === 1) {
        fetchPhotos();
      } else {
        setFilters(prev => ({ ...prev, page: 1 }));
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [filters.search]);

  // Delete photo
  const handleDeletePhoto = async (photoId: string) => {
    const result = await Swal.fire({
      title: "Delete Photo",
      text: "Are you sure you want to delete this photo? This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete photo"
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`/api/admin/gallery/${photoId}`, {
          method: "DELETE"
        });

        if (!response.ok) {
          throw new Error("Failed to delete photo");
        }

        await fetchPhotos();
        
        Swal.fire({
          title: "Deleted!",
          text: "Photo has been deleted successfully.",
          icon: "success",
          timer: 2000,
          confirmButtonColor: "#B88A3D"
        });
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: "Failed to delete photo",
          icon: "error",
          confirmButtonColor: "#B88A3D"
        });
      }
    }
  };

  // Bulk delete
  const handleBulkDelete = async () => {
    if (selectedPhotos.length === 0) return;

    const result = await Swal.fire({
      title: "Delete Selected Photos",
      text: `Are you sure you want to delete ${selectedPhotos.length} photos? This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete all"
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch("/api/admin/gallery/bulk", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ photoIds: selectedPhotos })
        });

        if (!response.ok) {
          throw new Error("Failed to delete photos");
        }

        await fetchPhotos();
        setSelectedPhotos([]);
        
        Swal.fire({
          title: "Deleted!",
          text: `${selectedPhotos.length} photos have been deleted.`,
          icon: "success",
          timer: 2000,
          confirmButtonColor: "#B88A3D"
        });
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: "Failed to delete photos",
          icon: "error",
          confirmButtonColor: "#B88A3D"
        });
      }
    }
  };

  // Toggle featured
  const handleToggleFeatured = async (photoId: string, currentFeatured: boolean) => {
    try {
      const response = await fetch(`/api/admin/gallery/${photoId}/featured`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: !currentFeatured })
      });

      if (!response.ok) {
        throw new Error("Failed to update featured status");
      }

      await fetchPhotos();
      
      Swal.fire({
        title: "Success",
        text: `Photo ${!currentFeatured ? "featured" : "unfeatured"} successfully`,
        icon: "success",
        timer: 1500,
        confirmButtonColor: "#B88A3D"
      });
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Failed to update featured status",
        icon: "error",
        confirmButtonColor: "#B88A3D"
      });
    }
  };

  // Bulk featured update
  const handleBulkFeatured = async (featured: boolean) => {
    if (selectedPhotos.length === 0) return;

    const result = await Swal.fire({
      title: featured ? "Feature Photos" : "Unfeature Photos",
      text: `Are you sure you want to ${featured ? "feature" : "unfeature"} ${selectedPhotos.length} photos?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#B88A3D",
      cancelButtonColor: "#d33",
      confirmButtonText: `Yes, ${featured ? "feature" : "unfeature"}`
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch("/api/admin/gallery/bulk/featured", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            photoIds: selectedPhotos,
            featured 
          })
        });

        if (!response.ok) {
          throw new Error("Failed to update photos");
        }

        await fetchPhotos();
        setSelectedPhotos([]);
        
        Swal.fire({
          title: "Updated!",
          text: `${selectedPhotos.length} photos have been updated.`,
          icon: "success",
          timer: 2000,
          confirmButtonColor: "#B88A3D"
        });
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: "Failed to update photos",
          icon: "error",
          confirmButtonColor: "#B88A3D"
        });
      }
    }
  };

  // Export photos
  const handleExportPhotos = async () => {
    try {
      const response = await fetch("/api/admin/gallery/export", {
        method: "GET"
      });

      if (!response.ok) {
        throw new Error("Failed to export photos");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `gallery_photos_${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      Swal.fire({
        title: "Export Started",
        text: "Photos export has been initiated",
        icon: "success",
        timer: 2000,
        confirmButtonColor: "#B88A3D"
      });
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Failed to export photos",
        icon: "error",
        confirmButtonColor: "#B88A3D"
      });
    }
  };

  // Upload photos
  const handleUploadPhotos = () => {
    // Implement upload modal or redirect to upload page
    window.location.href = "/dashboard/admin/gallery/upload";
  };

  const StatCard = ({ title, value, icon: Icon, color, trend }: any) => (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
          {trend && (
            <p className={`text-xs mt-2 ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% from last month
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg bg-${color}-50`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
      </div>
    </div>
  );

  if (loading && !photos.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-amber-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading gallery...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gallery Management</h1>
          <p className="text-gray-600 mt-1">Manage photos, collections, and categories</p>
        </div>
        <div className="flex items-center space-x-3 mt-4 md:mt-0">
          {/* Tab Navigation */}
          <div className="flex items-center bg-white rounded-lg border border-gray-200 p-1 mr-2">
            <button
              onClick={() => setActiveTab("photos")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                activeTab === "photos" 
                  ? 'bg-amber-50 text-amber-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Photos
            </button>
            <button
              onClick={() => setActiveTab("collections")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                activeTab === "collections" 
                  ? 'bg-amber-50 text-amber-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Collections
            </button>
            <button
              onClick={() => setActiveTab("categories")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                activeTab === "categories" 
                  ? 'bg-amber-50 text-amber-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Categories
            </button>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-white rounded-lg border border-gray-200 p-1">
            {viewModes.map(mode => (
              <button
                key={mode.value}
                onClick={() => setViewMode(mode.value as any)}
                className={`p-2 rounded-lg transition ${
                  viewMode === mode.value 
                    ? 'bg-amber-50 text-amber-600' 
                    : 'text-gray-400 hover:text-gray-600'
                }`}
                title={mode.label}
              >
                <mode.icon className="w-4 h-4" />
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg relative"
            title="Toggle filters"
          >
            <SlidersHorizontal className="w-5 h-5" />
            {(filters.category !== 'all' || filters.tag !== 'all' || filters.search) && (
              <span className="absolute top-0 right-0 w-2 h-2 bg-amber-500 rounded-full"></span>
            )}
          </button>

          <button
            onClick={handleExportPhotos}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            title="Export photos"
          >
            <Download className="w-5 h-5" />
          </button>

          <button
            onClick={fetchPhotos}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            title="Refresh"
          >
            <RefreshCw className="w-5 h-5" />
          </button>

          <button
            onClick={handleUploadPhotos}
            className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition flex items-center space-x-2"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Photos</span>
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
            onClick={fetchPhotos}
            className="px-3 py-1 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
          >
            Retry
          </button>
        </div>
      )}

      {/* Stats Grid */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="Total Photos" 
            value={stats.totalPhotos} 
            icon={Camera} 
            color="blue" 
          />
          <StatCard 
            title="Total Views" 
            value={stats.totalViews.toLocaleString()} 
            icon={Eye} 
            color="green" 
          />
          <StatCard 
            title="Total Likes" 
            value={stats.totalLikes.toLocaleString()} 
            icon={Heart} 
            color="red" 
          />
          <StatCard 
            title="Collections" 
            value={stats.totalCollections} 
            icon={FolderOpen} 
            color="purple" 
          />
        </div>
      )}

      {/* Quick Stats Row */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-amber-50 rounded-lg p-3 text-center">
            <p className="text-xs text-amber-600">Featured Photos</p>
            <p className="text-lg font-bold text-amber-700">{stats.featuredPhotos}</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-3 text-center">
            <p className="text-xs text-blue-600">Categories</p>
            <p className="text-lg font-bold text-blue-700">{stats.totalCategories}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-3 text-center">
            <p className="text-xs text-green-600">Featured Collections</p>
            <p className="text-lg font-bold text-green-700">{stats.featuredCollections}</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-3 text-center">
            <p className="text-xs text-purple-600">Avg. Likes/Photo</p>
            <p className="text-lg font-bold text-purple-700">
              {stats.totalPhotos > 0 
                ? (stats.totalLikes / stats.totalPhotos).toFixed(1) 
                : 0}
            </p>
          </div>
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
                    placeholder="Search by title, description, tags..."
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value, page: 1 }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none bg-white"
                >
                  <option value="all">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name} ({cat.photoCount || 0})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tag
                </label>
                <select
                  value={filters.tag}
                  onChange={(e) => setFilters(prev => ({ ...prev, tag: e.target.value, page: 1 }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none bg-white"
                >
                  <option value="all">All Tags</option>
                  {/* Tags would be populated from API */}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Featured
                </label>
                <select
                  value={filters.featured === undefined ? "all" : filters.featured.toString()}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFilters(prev => ({
                      ...prev,
                      featured: value === "all" ? undefined : value === "true",
                      page: 1
                    }));
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none bg-white"
                >
                  <option value="all">All Photos</option>
                  <option value="true">Featured Only</option>
                  <option value="false">Non-Featured</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  From Date
                </label>
                <input
                  type="date"
                  value={filters.fromDate}
                  onChange={(e) => setFilters(prev => ({ ...prev, fromDate: e.target.value, page: 1 }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  To Date
                </label>
                <input
                  type="date"
                  value={filters.toDate}
                  onChange={(e) => setFilters(prev => ({ ...prev, toDate: e.target.value, page: 1 }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort By
                </label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none bg-white"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-between items-center mt-6 pt-4 border-t">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setFilters(prev => ({ 
                    ...prev, 
                    sortOrder: prev.sortOrder === 'asc' ? 'desc' : 'asc' 
                  }))}
                  className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-900"
                >
                  <ArrowUpDown className="w-4 h-4" />
                  <span>{filters.sortOrder === 'asc' ? 'Ascending' : 'Descending'}</span>
                </button>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => {
                    setFilters({
                      search: "",
                      category: "all",
                      tag: "all",
                      featured: undefined,
                      fromDate: "",
                      toDate: "",
                      sortBy: "createdAt",
                      sortOrder: "desc",
                      page: 1,
                      limit: 24
                    });
                  }}
                  className="flex items-center space-x-1 text-sm text-amber-600 hover:text-amber-700"
                >
                  <FilterX className="w-4 h-4" />
                  <span>Clear Filters</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bulk Actions */}
      {selectedPhotos.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-amber-50 rounded-xl p-4 flex items-center justify-between"
        >
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-amber-700">
              {selectedPhotos.length} photos selected
            </span>
            <button
              onClick={() => setSelectedPhotos([])}
              className="text-sm text-amber-600 hover:text-amber-700"
            >
              Clear
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleBulkFeatured(true)}
              className="px-3 py-1 bg-amber-500 text-white rounded-lg text-sm hover:bg-amber-600 transition"
            >
              <Star className="w-4 h-4 inline mr-1" />
              Feature
            </button>
            <button
              onClick={() => handleBulkFeatured(false)}
              className="px-3 py-1 bg-gray-500 text-white rounded-lg text-sm hover:bg-gray-600 transition"
            >
              <StarOff className="w-4 h-4 inline mr-1" />
              Unfeature
            </button>
            <button
              onClick={() => {
                // Add to collection modal
              }}
              className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition"
            >
              <FolderOpen className="w-4 h-4 inline mr-1" />
              Add to Collection
            </button>
            <button
              onClick={handleBulkDelete}
              className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition"
            >
              <Trash2 className="w-4 h-4 inline mr-1" />
              Delete
            </button>
          </div>
        </motion.div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
        </div>
      )}

      {/* Photos Grid/List */}
      {!loading && activeTab === "photos" && (
        <>
          {viewMode === "grid" && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {photos.map((photo, index) => (
                <motion.div
                  key={photo.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.02 }}
                  className="group relative bg-white rounded-lg shadow-sm hover:shadow-md transition overflow-hidden border border-gray-100"
                >
                  {/* Image Container */}
                  <div className="relative aspect-square bg-gray-100">
                    <Image
                      src={photo.imageUrl}
                      alt={photo.title}
                      fill
                      className="object-cover group-hover:scale-105 transition duration-300"
                    />
                    
                    {/* Selection Checkbox */}
                    <div className="absolute top-2 left-2 z-10">
                      <input
                        type="checkbox"
                        checked={selectedPhotos.includes(photo.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedPhotos([...selectedPhotos, photo.id]);
                          } else {
                            setSelectedPhotos(selectedPhotos.filter(id => id !== photo.id));
                          }
                        }}
                        className="w-4 h-4 text-amber-500 rounded border-gray-300 focus:ring-amber-500"
                      />
                    </div>

                    {/* Featured Badge */}
                    {photo.featured && (
                      <div className="absolute top-2 right-2 z-10">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-amber-500 text-white">
                          <Star className="w-3 h-3 fill-current mr-1" />
                          Featured
                        </span>
                      </div>
                    )}

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center space-x-2">
                      <button
                        onClick={() => window.open(photo.imageUrl, '_blank')}
                        className="p-2 bg-white rounded-lg hover:bg-gray-100 transition"
                        title="View"
                      >
                        <ZoomIn className="w-4 h-4" />
                      </button>
                      <Link
                        href={`/dashboard/admin/gallery/${photo.id}/edit`}
                        className="p-2 bg-white rounded-lg hover:bg-gray-100 transition"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleToggleFeatured(photo.id, photo.featured)}
                        className={`p-2 bg-white rounded-lg hover:bg-gray-100 transition ${
                          photo.featured ? 'text-amber-500' : ''
                        }`}
                        title={photo.featured ? "Remove featured" : "Mark featured"}
                      >
                        <Star className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Photo Info */}
                  <div className="p-3">
                    <h3 className="font-medium text-gray-900 text-sm truncate">
                      {photo.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1 truncate">
                      {photo.description}
                    </p>
                    
                    {/* Meta Info */}
                    <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
                      <div className="flex items-center space-x-2">
                        <span className="flex items-center">
                          <Eye className="w-3 h-3 mr-1" />
                          {photo.views}
                        </span>
                        <span className="flex items-center">
                          <Heart className="w-3 h-3 mr-1" />
                          {photo.likes}
                        </span>
                      </div>
                      <span>{format(new Date(photo.createdAt || ''), 'MMM d')}</span>
                    </div>

                    {/* Category Tag */}
                    <div className="mt-2">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-600">
                        <Folder className="w-3 h-3 mr-1" />
                        {photo.category}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {viewMode === "list" && (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr className="text-left text-sm text-gray-500">
                      <th className="px-6 py-4 font-medium w-8">
                        <input
                          type="checkbox"
                          checked={selectedPhotos.length === photos.length && photos.length > 0}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedPhotos(photos.map(p => p.id));
                            } else {
                              setSelectedPhotos([]);
                            }
                          }}
                          className="w-4 h-4 text-amber-500 rounded border-gray-300 focus:ring-amber-500"
                        />
                      </th>
                      <th className="px-6 py-4 font-medium">Photo</th>
                      <th className="px-6 py-4 font-medium">Category</th>
                      <th className="px-6 py-4 font-medium">Tags</th>
                      <th className="px-6 py-4 font-medium">Views</th>
                      <th className="px-6 py-4 font-medium">Likes</th>
                      <th className="px-6 py-4 font-medium">Date</th>
                      <th className="px-6 py-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {photos.map((photo, index) => (
                      <motion.tr
                        key={photo.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.02 }}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={selectedPhotos.includes(photo.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedPhotos([...selectedPhotos, photo.id]);
                              } else {
                                setSelectedPhotos(selectedPhotos.filter(id => id !== photo.id));
                              }
                            }}
                            className="w-4 h-4 text-amber-500 rounded border-gray-300 focus:ring-amber-500"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                              <Image
                                src={photo.imageUrl}
                                alt={photo.title}
                                width={48}
                                height={48}
                                className="object-cover w-full h-full"
                              />
                            </div>
                            <div>
                              <div className="font-medium text-gray-900 flex items-center space-x-2">
                                <span>{photo.title}</span>
                                {photo.featured && (
                                  <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                                )}
                              </div>
                              <div className="text-xs text-gray-500 mt-1 line-clamp-1">
                                {photo.description}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100">
                            <Folder className="w-3 h-3 mr-1" />
                            {photo.category}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {photo.tags.slice(0, 3).map((tag, i) => (
                              <span key={i} className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                                #{tag}
                              </span>
                            ))}
                            {photo.tags.length > 3 && (
                              <span className="text-xs text-gray-400">
                                +{photo.tags.length - 3}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <Eye className="w-4 h-4 text-gray-400 mr-1" />
                            <span>{photo.views}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <Heart className="w-4 h-4 text-gray-400 mr-1" />
                            <span>{photo.likes}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {format(new Date(photo.createdAt || ''), 'MMM d, yyyy')}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <Link
                              href={`/dashboard/admin/gallery/${photo.id}/edit`}
                              className="p-1 text-blue-600 hover:bg-blue-50 rounded-lg"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => handleToggleFeatured(photo.id, photo.featured)}
                              className={`p-1 rounded-lg ${
                                photo.featured 
                                  ? 'text-amber-600 hover:bg-amber-50' 
                                  : 'text-gray-400 hover:bg-gray-100'
                              }`}
                              title={photo.featured ? "Remove featured" : "Mark featured"}
                            >
                              <Star className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeletePhoto(photo.id)}
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
              </div>
            </div>
          )}

          {viewMode === "masonry" && (
            <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 space-y-4">
              {photos.map((photo, index) => (
                <motion.div
                  key={photo.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.02 }}
                  className="break-inside-avoid group relative bg-white rounded-lg shadow-sm hover:shadow-md transition overflow-hidden border border-gray-100"
                >
                  <div className="relative">
                    <Image
                      src={photo.imageUrl}
                      alt={photo.title}
                      width={400}
                      height={300}
                      className="w-full h-auto object-cover"
                    />
                    
                    {/* Overlay on Hover */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center space-x-2">
                      <button
                        onClick={() => window.open(photo.imageUrl, '_blank')}
                        className="p-2 bg-white rounded-lg hover:bg-gray-100 transition"
                      >
                        <ZoomIn className="w-4 h-4" />
                      </button>
                      <Link
                        href={`/dashboard/admin/gallery/${photo.id}/edit`}
                        className="p-2 bg-white rounded-lg hover:bg-gray-100 transition"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                    </div>

                    {/* Featured Badge */}
                    {photo.featured && (
                      <div className="absolute top-2 right-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-amber-500 text-white">
                          <Star className="w-3 h-3 fill-current mr-1" />
                          Featured
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-3">
                    <h3 className="font-medium text-gray-900 text-sm">{photo.title}</h3>
                    <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
                      <span className="flex items-center">
                        <Eye className="w-3 h-3 mr-1" />
                        {photo.views}
                      </span>
                      <span className="flex items-center">
                        <Heart className="w-3 h-3 mr-1" />
                        {photo.likes}
                      </span>
                      <span>{photo.category}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Collections Tab */}
      {!loading && activeTab === "collections" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((collection, index) => (
            <motion.div
              key={collection.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden border border-gray-100 group"
            >
              {/* Cover Image */}
              <div className="relative h-48 bg-gray-100">
                {collection.coverImage ? (
                  <Image
                    src={collection.coverImage}
                    alt={collection.name}
                    fill
                    className="object-cover group-hover:scale-105 transition duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-500 to-orange-500">
                    <Images className="w-12 h-12 text-white/50" />
                  </div>
                )}
                
                {/* Photo Count */}
                <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded-lg text-xs">
                  {collection.photoCount} photos
                </div>

                {/* Featured Badge */}
                {collection.featured && (
                  <div className="absolute top-3 right-3">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-amber-500 text-white">
                      <Star className="w-3 h-3 fill-current mr-1" />
                      Featured
                    </span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="font-semibold text-gray-900 mb-1">{collection.name}</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {collection.description}
                </p>

                {/* Preview Photos */}
                {collection.photos && collection.photos.length > 0 && (
                  <div className="flex -space-x-2 mb-3">
                    {collection.photos.slice(0, 4).map((photo, i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded-full border-2 border-white overflow-hidden"
                      >
                        <Image
                          src={photo.imageUrl}
                          alt=""
                          width={32}
                          height={32}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    ))}
                    {collection.photos.length > 4 && (
                      <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs text-gray-600">
                        +{collection.photos.length - 4}
                      </div>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-3 border-t">
                  <Link
                    href={`/dashboard/admin/gallery/collections/${collection.id}`}
                    className="text-sm text-amber-600 hover:text-amber-700 font-medium"
                  >
                    View Collection →
                  </Link>
                  <div className="flex items-center space-x-1">
                    <Link
                      href={`/dashboard/admin/gallery/collections/${collection.id}/edit`}
                      className="p-1 text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button
                      className="p-1 text-red-600 hover:bg-red-50 rounded-lg"
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

      {/* Categories Tab */}
      {!loading && activeTab === "categories" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden border border-gray-100"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg bg-${category.color || 'amber'}-50 flex items-center justify-center`}>
                    {category.icon ? (
                      <span className="text-2xl">{category.icon}</span>
                    ) : (
                      <Folder className={`w-6 h-6 text-${category.color || 'amber'}-600`} />
                    )}
                  </div>
                  {/* {category.featured && (
                                       <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-amber-500 text-white">
                      <Star className="w-3 h-3 fill-current mr-1" />
                      Featured
                    </span>
                  )} */}
                </div>

                <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {category.description}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-gray-50 rounded-lg p-2 text-center">
                    <p className="text-xs text-gray-500">Collections</p>
                    <p className="text-lg font-bold text-gray-900">{category.collectionCount || 0}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2 text-center">
                    <p className="text-xs text-gray-500">Photos</p>
                    <p className="text-lg font-bold text-gray-900">{category.photoCount || 0}</p>
                  </div>
                </div>

                {/* Collection Previews */}
                {category.collections && category.collections.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-2">Top Collections</p>
                    <div className="space-y-2">
                      {category.collections.slice(0, 2).map((collection) => (
                        <div key={collection.id} className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">{collection.name}</span>
                          <span className="text-xs text-gray-400">{collection.photoCount} photos</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Featured Photos Preview */}
                {category.featuredPhotos && category.featuredPhotos.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-2">Featured Photos</p>
                    <div className="flex -space-x-2">
                      {category.featuredPhotos.slice(0, 4).map((photo, i) => (
                        <div
                          key={i}
                          className="w-8 h-8 rounded-full border-2 border-white overflow-hidden"
                        >
                          <Image
                            src={photo.imageUrl}
                            alt=""
                            width={32}
                            height={32}
                            className="object-cover w-full h-full"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <Link
                    href={`/dashboard/admin/gallery/categories/${category.id}`}
                    className="text-sm text-amber-600 hover:text-amber-700 font-medium"
                  >
                    Manage Category →
                  </Link>
                  <div className="flex items-center space-x-1">
                    <Link
                      href={`/dashboard/admin/gallery/categories/${category.id}/edit`}
                      className="p-1 text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button
                      className="p-1 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Add New Category Card */}
          <Link
            href="/dashboard/admin/gallery/categories/create"
            className="bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 hover:border-amber-300 transition flex flex-col items-center justify-center p-8 min-h-[300px] group"
          >
            <div className="w-16 h-16 rounded-full bg-gray-200 group-hover:bg-amber-100 flex items-center justify-center mb-4 transition">
              <Plus className="w-8 h-8 text-gray-400 group-hover:text-amber-500 transition" />
            </div>
            <h3 className="font-semibold text-gray-700 group-hover:text-amber-600 transition">
              Create New Category
            </h3>
            <p className="text-sm text-gray-500 text-center mt-2">
              Add a new category to organize your gallery photos
            </p>
          </Link>
        </div>
      )}

      {/* Empty State */}
      {!loading && photos.length === 0 && activeTab === "photos" && (
        <div className="text-center py-12 bg-white rounded-xl">
          <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No photos found</h3>
          <p className="text-gray-500 mt-1">Try adjusting your search or filters</p>
          <button
            onClick={handleUploadPhotos}
            className="inline-flex items-center space-x-2 mt-4 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Photos</span>
          </button>
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && activeTab === "photos" && (
        <div className="flex items-center justify-between bg-white rounded-xl shadow-sm px-6 py-4">
          <div className="text-sm text-gray-500">
            Showing <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span> to{" "}
            <span className="font-medium">
              {Math.min(pagination.page * pagination.limit, pagination.total)}
            </span> of{" "}
            <span className="font-medium">{pagination.total}</span> photos
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setFilters(prev => ({ ...prev, page: prev.page! - 1 }))}
              disabled={!pagination.hasPrevPage}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
                  onClick={() => setFilters(prev => ({ ...prev, page: pageNum }))}
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
              onClick={() => setFilters(prev => ({ ...prev, page: prev.page! + 1 }))}
              disabled={!pagination.hasNextPage}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
                    