// app/dashboard/admin/tours/page.tsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  Copy,
  Star,
  Clock,
  MapPin,
  Users,
  DollarSign,
  Mountain,
  Landmark,
  TreePine,
  Camera,
  Compass,
  Grid3X3,
  List,
  Award,
  RefreshCw
} from "lucide-react";
import Swal from "sweetalert2";
import CreateTourModal from "@/components/dashboard/admin/CreateTourModal";
import EditTourModal from "@/components/dashboard/admin/EditTourModal";

const categories = [
  { value: "cultural", label: "Cultural", icon: Users },
  { value: "historical", label: "Historical", icon: Landmark },
  { value: "nature", label: "Nature", icon: TreePine },
  { value: "adventure", label: "Adventure", icon: Mountain },
  { value: "photography", label: "Photography", icon: Camera },
  { value: "trekking", label: "Trekking", icon: Compass }
];

interface Tour {
  _id: string;
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  duration: string;
  location: string;

  groupSize: string;
  difficulty: string;
  rating: number;
  reviewCount: number;
  images: string[];
  status: 'active' | 'inactive' | 'upcoming';
  featured: boolean;
  bookingsCount: number;
  revenue: number;
  createdAt: string;
  updatedAt: string;
  highlights?: string[];
  itinerary?: any[];
  inclusions?: string[];
  exclusions?: string[];
  bestTime?: string[];
  departurePoint?: string;
  languages?: string[];
  coordinates?: {
    lat: number;
    lng: number;
    city?: string;
    region?: string;
  };
}

export default function AdminToursPage() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedTours, setSelectedTours] = useState<string[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 1
  });

  // Fetch tours on load and when filters change
  useEffect(() => {
    fetchTours();
  }, [pagination.page, categoryFilter, statusFilter]);

  const fetchTours = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(categoryFilter !== 'all' && { category: categoryFilter }),
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(searchTerm && { search: searchTerm })
      });

      const response = await fetch(`/api/admin/tours?${params}`);
      const data = await response.json();

      if (data.success) {
        setTours(data.data);
        setPagination(data.pagination);
      } else {
        throw new Error(data.error || 'Failed to fetch tours');
      }
    } catch (error) {
      console.error('Error fetching tours:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load tours. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTour = async (newTour: any) => {
    try {
      const response = await fetch('http://localhost:3000/api/admin/tours', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTour)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create tour');
      }

      await fetchTours();
      setShowCreateModal(false);
      
      Swal.fire({
        title: "Success!",
        text: "Tour created successfully",
        icon: "success",
        timer: 2000,
        confirmButtonColor: "#B88A3D"
      });
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Failed to create tour'
      });
    }
  };

  const handleEditTour = async (updatedTour: any) => {
    try {
      const response = await fetch(`/api/admin/tours/${updatedTour.id || updatedTour._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTour)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update tour');
      }

      await fetchTours();
      setShowEditModal(false);
      setSelectedTour(null);
      
      Swal.fire({
        title: "Success!",
        text: "Tour updated successfully",
        icon: "success",
        timer: 2000,
        confirmButtonColor: "#B88A3D"
      });
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Failed to update tour'
      });
    }
  };

  const handleDeleteTour = async (tourId: string) => {
    const result = await Swal.fire({
      title: "Delete Tour?",
      text: "This action cannot be undone",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete"
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`/api/admin/tours/${tourId}`, {
          method: 'DELETE'
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to delete tour');
        }

        await fetchTours();
        Swal.fire("Deleted!", "Tour has been deleted.", "success");
      } catch (error: any) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || 'Failed to delete tour'
        });
      }
    }
  };

  const handleDuplicateTour = async (tour: Tour) => {
    const { _id, id, createdAt, updatedAt, bookingsCount, revenue, ...tourData } = tour;
    const duplicatedTour = {
      ...tourData,
      name: `${tour.name} (Copy)`,
      slug: `${tour.slug}-copy-${Date.now()}`,
      status: 'inactive' as const,
      featured: false
    };

    await handleCreateTour(duplicatedTour);
  };

  const handleBulkDelete = async () => {
    if (selectedTours.length === 0) return;

    const result = await Swal.fire({
      title: `Delete ${selectedTours.length} tours?`,
      text: "This action cannot be undone",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete"
    });

    if (result.isConfirmed) {
      try {
        await Promise.all(selectedTours.map(id => 
          fetch(`/api/admin/tours/${id}`, { method: 'DELETE' })
        ));
        
        await fetchTours();
        setSelectedTours([]);
        Swal.fire("Deleted!", `${selectedTours.length} tours deleted.`, "success");
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to delete some tours'
        });
      }
    }
  };

  const handleBulkStatusChange = async (status: string) => {
    if (selectedTours.length === 0) return;

    try {
      await Promise.all(selectedTours.map(id => 
        fetch(`/api/admin/tours/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status })
        })
      ));
      
      await fetchTours();
      setSelectedTours([]);
      
      Swal.fire({
        title: "Updated!",
        text: `Tour status updated to ${status}`,
        icon: "success",
        timer: 2000,
        confirmButtonColor: "#B88A3D"
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to update tour status'
      });
    }
  };

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (pagination.page === 1) {
        fetchTours();
      } else {
        setPagination(prev => ({ ...prev, page: 1 }));
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const filteredTours = tours; // Filtering is now done on the server

  const getCategoryIcon = (category: string) => {
    const cat = categories.find(c => c.value === category);
    return cat?.icon || Compass;
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active': return 'text-green-600 bg-green-50 border-green-200';
      case 'inactive': return 'text-gray-600 bg-gray-50 border-gray-200';
      case 'upcoming': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tour Management</h1>
          <p className="text-gray-600 mt-1">Manage your tour packages and itineraries</p>
        </div>
        <div className="flex items-center space-x-3 mt-4 md:mt-0">
          <button
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            {viewMode === 'grid' ? <List className="w-5 h-5" /> : <Grid3X3 className="w-5 h-5" />}
          </button>
          <button
            onClick={fetchTours}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Tour</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex flex-col md:flex-row md:items-center space-y-3 md:space-y-0 md:space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search tours..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
            />
          </div>
          
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setPagination(prev => ({ ...prev, page: 1 }));
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none bg-white"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPagination(prev => ({ ...prev, page: 1 }));
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none bg-white"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="upcoming">Upcoming</option>
          </select>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedTours.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-amber-50 rounded-xl p-4 flex items-center justify-between"
        >
          <span className="text-sm font-medium text-amber-700">
            {selectedTours.length} tours selected
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleBulkStatusChange('active')}
              className="px-3 py-1 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600"
            >
              Set Active
            </button>
            <button
              onClick={() => handleBulkStatusChange('inactive')}
              className="px-3 py-1 bg-gray-500 text-white rounded-lg text-sm hover:bg-gray-600"
            >
              Set Inactive
            </button>
            <button
              onClick={handleBulkDelete}
              className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </motion.div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
        </div>
      )}

      {/* Tours Grid/List */}
      {!loading && (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTours.map((tour, index) => {
              const CategoryIcon = getCategoryIcon(tour.category);
              
              return (
                <motion.div
                  key={tour._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden border border-gray-100"
                >
                  <div className="relative h-48">
                    <Image
                      src={tour.images?.[0] || "/Images/placeholder.jpg"}
                      alt={tour.name}
                      fill
                      className="object-cover"
                    />
                    {tour.featured && (
                      <div className="absolute top-3 left-3 bg-amber-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
                        <Award className="w-3 h-3 mr-1" />
                        Featured
                      </div>
                    )}
                    <div className="absolute top-3 right-3">
                      <input
                        type="checkbox"
                        checked={selectedTours.includes(tour._id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedTours([...selectedTours, tour._id]);
                          } else {
                            setSelectedTours(selectedTours.filter(id => id !== tour._id));
                          }
                        }}
                        className="w-4 h-4 text-amber-500 rounded border-gray-300 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">{tour.name}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full flex items-center">
                            <CategoryIcon className="w-3 h-3 mr-1" />
                            {tour.category}
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded-full border ${getStatusColor(tour.status)}`}>
                            {tour.status}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                        <span className="text-sm font-medium">{tour.rating?.toFixed(1) || '0.0'}</span>
                        <span className="text-xs text-gray-500">({tour.reviewCount || 0})</span>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                      {tour.description}
                    </p>

                    <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center text-gray-500">
                        <MapPin className="w-4 h-4 mr-1" />
                        {tour.location}
                      </div>
                      <div className="flex items-center text-gray-500">
                        <Clock className="w-4 h-4 mr-1" />
                        {tour.duration}
                      </div>
                      <div className="flex items-center text-gray-500">
                        <Users className="w-4 h-4 mr-1" />
                        {tour.groupSize}
                      </div>
                      
                    </div>

                    <div className="mt-4 pt-4 border-t flex justify-between items-center">
                      <div>
                        <p className="text-xs text-gray-500">Bookings</p>
                        <p className="font-semibold text-gray-900">{tour.bookingsCount || 0}</p>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Link href={`/tours/${tour.slug}`} target="_blank">
                          <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                            <Eye className="w-4 h-4" />
                          </button>
                        </Link>
                        <button
                          onClick={() => {
                            setSelectedTour(tour);
                            setShowEditModal(true);
                          }}
                          className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDuplicateTour(tour)}
                          className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteTour(tour._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr className="text-left text-sm text-gray-500">
                  <th className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedTours.length === filteredTours.length && filteredTours.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedTours(filteredTours.map(t => t._id));
                        } else {
                          setSelectedTours([]);
                        }
                      }}
                      className="w-4 h-4 text-amber-500 rounded border-gray-300 focus:ring-amber-500"
                    />
                  </th>
                  <th className="px-6 py-4">Tour</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Duration</th>
               
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Bookings</th>
                  <th className="px-6 py-4">Rating</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredTours.map((tour) => (
                  <tr key={tour._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedTours.includes(tour._id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedTours([...selectedTours, tour._id]);
                          } else {
                            setSelectedTours(selectedTours.filter(id => id !== tour._id));
                          }
                        }}
                        className="w-4 h-4 text-amber-500 rounded border-gray-300 focus:ring-amber-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden">
                          <Image
                            src={tour.images?.[0] || "/Images/placeholder.jpg"}
                            alt={tour.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{tour.name}</p>
                          <p className="text-xs text-gray-500">{tour.location}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 capitalize">{tour.category}</td>
                    <td className="px-6 py-4">{tour.duration}</td>
                 
                    <td className="px-6 py-4">
                      <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(tour.status)}`}>
                        {tour.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">{tour.bookingsCount || 0}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 fill-amber-500 text-amber-500 mr-1" />
                        {tour.rating?.toFixed(1) || '0.0'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <Link href={`/tours/${tour.slug}`} target="_blank">
                          <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                            <Eye className="w-4 h-4" />
                          </button>
                        </Link>
                        <button
                          onClick={() => {
                            setSelectedTour(tour);
                            setShowEditModal(true);
                          }}
                          className="p-1 text-amber-600 hover:bg-amber-50 rounded"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDuplicateTour(tour)}
                          className="p-1 text-purple-600 hover:bg-purple-50 rounded"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteTour(tour._id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}

      {/* Pagination */}
      {!loading && pagination.pages > 1 && (
        <div className="flex justify-center space-x-2 mt-8">
          <button
            onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
            disabled={pagination.page === 1}
            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Previous
          </button>
          <span className="px-4 py-2">
            Page {pagination.page} of {pagination.pages}
          </span>
          <button
            onClick={() => setPagination(prev => ({ ...prev, page: Math.min(pagination.pages, prev.page + 1) }))}
            disabled={pagination.page === pagination.pages}
            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Modals */}
      <CreateTourModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSave={handleCreateTour}
      />

      <EditTourModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedTour(null);
        }}
        onSave={handleEditTour}
        tour={selectedTour}
      />
    </div>
  );
}