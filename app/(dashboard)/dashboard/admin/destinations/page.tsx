"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Download, Grid3X3, List } from "lucide-react";
import Swal from "sweetalert2";
import { useAuth } from "@/contexts/AuthContext";

import { DestinationStats } from "@/components/dashboard/admin/destination/DestinationStats";
import { BulkActions } from "@/components/dashboard/admin/common/BulkActions";
import { DestinationFilters } from "@/components/dashboard/admin/destination/DestinationFilters";
import LoadingSpinner from "@/components/dashboard/LoadingSpinner";
import { DestinationsGrid } from "@/components/dashboard/admin/destination/DestinationsGrid";
import { DestinationsTable } from "@/components/dashboard/admin/destination/DestinationsTable";
import { CreateDestinationModal } from "@/components/dashboard/admin/destination/CreateDestinationModal";
import { EditDestinationModal } from "@/components/dashboard/admin/destination/EditDestinationModal";
import { DeleteDestinationModal } from "@/components/dashboard/admin/destination/DeleteDestinationModal";
import { Destination } from "@/Types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

export default function AdminDestinationsPage() {
  const router = useRouter();
  const { user } = useAuth();
  
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  
  // Filters
  const [filters, setFilters] = useState({
    search: "",
    type: "all",
    region: "all",
    status: "all"
  });
  const [showFilters, setShowFilters] = useState(false);
  
  // Selection
  const [selectedDestinations, setSelectedDestinations] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  
  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    // Check permissions
    if (user?.role.toLowerCase() !== 'admin') {
      router.push('/');
      return;
    }

    fetchDestinations();
    fetchStats();
  }, [filters, page]);

  const handleResponse = async (response: Response) => {
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'An error occurred' }));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }
    return response.json();
  };

  const fetchDestinations = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('page', page.toString());
      queryParams.append('limit', '12');
      
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.type && filters.type !== 'all') queryParams.append('type', filters.type);
      if (filters.region && filters.region !== 'all') queryParams.append('region', filters.region);
      if (filters.status && filters.status !== 'all') queryParams.append('status', filters.status);

      const response = await fetch(`${API_BASE_URL}/api/admin/destinations?${queryParams}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      const result = await handleResponse(response);
      
      // Transform API response
      setDestinations(result.data || []);
      setTotalPages(result.pagination?.pages || 1);
      setTotal(result.pagination?.total || 0);
    } catch (error) {
      console.error('Error fetching destinations:', error);
      Swal.fire({
        title: "Error",
        text: error instanceof Error ? error.message : "Failed to fetch destinations",
        icon: "error",
        confirmButtonColor: "#B88A3D"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/destinations/stats`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      const result = await handleResponse(response);
      setStats(result.data || result);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  const handleCreateDestination = async (newDestination: Partial<Destination>) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/destinations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(newDestination),
      });

      const result = await handleResponse(response);
      const created = result.data;
      
      setDestinations([created, ...destinations]);
      setShowCreateModal(false);
      fetchStats(); // Refresh stats
      
      Swal.fire({
        title: "Success!",
        text: "Destination created successfully",
        icon: "success",
        timer: 2000,
        confirmButtonColor: "#B88A3D"
      });
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error instanceof Error ? error.message : "Failed to create destination",
        icon: "error",
        confirmButtonColor: "#B88A3D"
      });
    }
  };

  const handleEditDestination = async (updatedDestination: Destination) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/destinations/${ updatedDestination._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(updatedDestination),
      });

      const result = await handleResponse(response);
      const updated = result.data;
      
      setDestinations(destinations.map(d => 
        (d.id === updated.id || d._id === updated._id) ? updated : d
      ));
      setShowEditModal(false);
      setSelectedDestination(null);
      
      Swal.fire({
        title: "Success!",
        text: "Destination updated successfully",
        icon: "success",
        timer: 2000,
        confirmButtonColor: "#B88A3D"
      });
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error instanceof Error ? error.message : "Failed to update destination",
        icon: "error",
        confirmButtonColor: "#B88A3D"
      });
    }
  };

  const handleDeleteDestination = async (destination: Destination) => {
    try {
      await fetch(`${API_BASE_URL}/api/admin/destinations/${ destination._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      setDestinations(destinations.filter(d => 
        (d.id !== destination.id && d._id !== destination._id)
      ));
      setShowDeleteModal(false);
      setSelectedDestination(null);
      fetchStats(); // Refresh stats
      
      Swal.fire({
        title: "Deleted!",
        text: "Destination has been deleted",
        icon: "success",
        timer: 2000,
        confirmButtonColor: "#B88A3D"
      });
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error instanceof Error ? error.message : "Failed to delete destination",
        icon: "error",
        confirmButtonColor: "#B88A3D"
      });
    }
  };

  const handleBulkDelete = async () => {
    if (selectedDestinations.length === 0) return;

    const result = await Swal.fire({
      title: `Delete ${selectedDestinations.length} destinations?`,
      text: "This action cannot be undone",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete"
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/admin/destinations/bulk-delete`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ ids: selectedDestinations }),
        });

        await handleResponse(response);
        
        setDestinations(destinations.filter(d => 
          !selectedDestinations.includes(d.id || d._id || '')
        ));
        setSelectedDestinations([]);
        fetchStats(); // Refresh stats
        
        Swal.fire("Deleted!", `${selectedDestinations.length} destinations deleted.`, "success");
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: error instanceof Error ? error.message : "Failed to delete destinations",
          icon: "error",
          confirmButtonColor: "#B88A3D"
        });
      }
    }
  };

  const handleBulkStatusChange = async (status: string) => {
    if (selectedDestinations.length === 0) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/destinations/bulk-status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ ids: selectedDestinations, status }),
      });

      await handleResponse(response);
      
      setDestinations(destinations.map(d => 
        selectedDestinations.includes(d.id || d._id || '') 
          ? { ...d, status: status as any } 
          : d
      ));
      setSelectedDestinations([]);
      
      Swal.fire({
        title: "Updated!",
        text: `Destination status updated to ${status}`,
        icon: "success",
        timer: 2000,
        confirmButtonColor: "#B88A3D"
      });
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error instanceof Error ? error.message : "Failed to update status",
        icon: "error",
        confirmButtonColor: "#B88A3D"
      });
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1); // Reset to first page on filter change
  };

  const handleClearFilters = () => {
    setFilters({
      search: "",
      type: "all",
      region: "all",
      status: "all"
    });
    setPage(1);
  };

  const handleSelectAll = (ids: string[]) => {
    setSelectedDestinations(ids);
  };

  const handleSelect = (id: string) => {
    setSelectedDestinations(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (user?.role.toLowerCase() !== 'admin') {
    return null;
  }
  console.log(`Destinations: ${JSON.stringify(destinations)}`);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Destination Management</h1>
          <p className="text-gray-600 mt-1">Manage travel destinations and locations</p>
        </div>
        <div className="flex items-center space-x-3 mt-4 md:mt-0">
          <button
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            {viewMode === 'grid' ? <List className="w-5 h-5" /> : <Grid3X3 className="w-5 h-5" />}
          </button>
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            <Download className="w-5 h-5" />
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Destination</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <DestinationStats stats={stats} loading={statsLoading} />

      {/* Filters */}
      <DestinationFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
      />

      {/* Bulk Actions */}
      <BulkActions
        selectedCount={selectedDestinations.length}
        onStatusChange={handleBulkStatusChange}
        onDelete={handleBulkDelete}
        onClear={() => setSelectedDestinations([])}
      />

      {/* Loading State */}
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          {/* Destinations Count */}
          <div className="text-sm text-gray-500">
            Showing {destinations.length} of {total} destinations
          </div>

          {/* Destinations Grid/Table */}
          {viewMode === 'grid' ? (
            <DestinationsGrid
              destinations={destinations}
              selectedDestinations={selectedDestinations}
              onSelect={handleSelect}
              onSelectAll={handleSelectAll}
              onEdit={(dest) => {
                setSelectedDestination(dest);
                setShowEditModal(true);
              }}
              onDelete={(dest) => {
                setSelectedDestination(dest);
                setShowDeleteModal(true);
              }}
            />
          ) : (
            <DestinationsTable
              destinations={destinations}
              selectedDestinations={selectedDestinations}
              onSelect={handleSelect}
              onSelectAll={handleSelectAll}
              onEdit={(dest) => {
                setSelectedDestination(dest);
                setShowEditModal(true);
              }}
              onDelete={(dest) => {
                setSelectedDestination(dest);
                setShowDeleteModal(true);
              }}
            />
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between bg-white rounded-xl shadow-sm px-6 py-4">
              <div className="text-sm text-gray-500">
                Page {page} of {totalPages}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => handlePageChange(i + 1)}
                    className={`px-3 py-1 rounded-lg text-sm ${
                      page === i + 1
                        ? 'bg-amber-500 text-white'
                        : 'border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
                  className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Modals */}
      <CreateDestinationModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSave={handleCreateDestination}
      />

      <EditDestinationModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedDestination(null);
        }}
        onSave={handleEditDestination}
        destination={selectedDestination}
      />

      <DeleteDestinationModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedDestination(null);
        }}
        onConfirm={handleDeleteDestination}
        destination={selectedDestination}
      />
    </div>
  );
}