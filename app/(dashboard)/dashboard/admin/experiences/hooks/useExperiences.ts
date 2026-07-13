// admin/experiences/hooks/useExperiences.ts

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import { ApiExperience, Filters, Pagination } from '../components/types';

export const useExperiences = () => {
  const router = useRouter();
  const [experiences, setExperiences] = useState<ApiExperience[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>({
    search: '',
    category: 'all',
    status: 'all',
    page: 1,
    limit: 12,
  });
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 12,
    total: 0,
    pages: 1,
  });
  const [selectedExperiences, setSelectedExperiences] = useState<string[]>([]);

  const fetchExperiences = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: filters.page.toString(),
        limit: filters.limit.toString(),
        ...(filters.category !== 'all' && { category: filters.category }),
        ...(filters.status !== 'all' && { status: filters.status }),
        ...(filters.search && { search: filters.search }),
      });

      const response = await fetch(`/api/admin/experiences?${params}`);

      if (response.status === 401) {
        router.push('/login?redirect=/admin/experiences');
        return;
      }

      if (response.status === 403) {
        router.push('/');
        return;
      }

      const data = await response.json();

      if (data.success) {
        const mappedExperiences = data.data.map((exp: any) => ({
          ...exp,
          id: exp._id,
          shortDescription: exp.shortDescription || exp.description?.substring(0, 100),
          images: exp.images || [exp.image].filter(Boolean),
          included: exp.included || [],
          highlights: exp.highlights || [],
          bestTimeToVisit: exp.bestTimeToVisit || exp.seasonalAvailability || '',
          coordinates: exp.coordinates || { lat: 0, lng: 0 },
          rating: exp.rating || 0,
          reviewCount: exp.reviewCount || 0,
        }));

        setExperiences(mappedExperiences);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Error fetching experiences:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load experiences',
      });
    } finally {
      setLoading(false);
    }
  }, [filters, router]);

  useEffect(() => {
    fetchExperiences();
  }, [fetchExperiences]);

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: 'Delete Experience?',
      text: 'This action cannot be undone',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete',
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`/api/admin/experiences/${id}`, {
          method: 'DELETE',
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to delete experience');
        }

        await fetchExperiences();
        setSelectedExperiences(prev => prev.filter(selectedId => selectedId !== id));
        Swal.fire('Deleted!', 'Experience has been deleted.', 'success');
      } catch (error: any) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || 'Failed to delete experience',
        });
      }
    }
  };

  const handleBulkDelete = async () => {
    if (selectedExperiences.length === 0) return;

    const result = await Swal.fire({
      title: `Delete ${selectedExperiences.length} experiences?`,
      text: 'This action cannot be undone',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete',
    });

    if (result.isConfirmed) {
      try {
        await Promise.all(
          selectedExperiences.map((id) =>
            fetch(`/api/admin/experiences/${id}`, { method: 'DELETE' }),
          ),
        );

        await fetchExperiences();
        setSelectedExperiences([]);
        Swal.fire('Deleted!', `${selectedExperiences.length} experiences deleted.`, 'success');
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to delete some experiences',
        });
      }
    }
  };

  const handleDuplicate = async (experience: ApiExperience) => {
    const { _id, id, bookings, revenue, rating, ...experienceData } = experience;

    const duplicatedExperience = {
      ...experienceData,
      name: `${experience.name} (Copy)`,
      slug: `${experience.slug}-copy-${Date.now()}`,
      status: 'inactive',
    };

    try {
      const response = await fetch('http://localhost:3000/api/admin/experiences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(duplicatedExperience),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to duplicate experience');
      }

      await fetchExperiences();
      Swal.fire({
        title: 'Duplicated!',
        text: 'Experience has been duplicated',
        icon: 'success',
        timer: 2000,
      });
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Failed to duplicate experience',
      });
    }
  };

  const handleBulkDuplicate = async () => {
    if (selectedExperiences.length === 0) return;
    
    const result = await Swal.fire({
      title: `Duplicate ${selectedExperiences.length} experiences?`,
      text: "This will create copies of all selected experiences",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#B88A3D",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, duplicate",
    });

    if (result.isConfirmed) {
      try {
        const experiencesToDuplicate = experiences.filter(
          exp => selectedExperiences.includes(exp._id || exp.id || '')
        );
        
        await Promise.all(
          experiencesToDuplicate.map(exp => handleDuplicate(exp))
        );
        
        setSelectedExperiences([]);
        Swal.fire(
          "Duplicated!",
          `${selectedExperiences.length} experiences duplicated.`,
          "success"
        );
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to duplicate some experiences",
        });
      }
    }
  };

  const handleBulkExport = () => {
    if (selectedExperiences.length === 0) return;
    
    const experiencesToExport = experiences.filter(
      exp => selectedExperiences.includes(exp._id || exp.id || '')
    );
    
    // Create CSV data
    const csvData = experiencesToExport.map(exp => ({
      Name: exp.name,
      Category: exp.category,
      Duration: exp.duration,
      Location: exp.location,
      Rating: exp.rating || 0,
   
      Bookings: exp.bookings || 0,
      'Review Count': exp.reviewCount || 0,
      Featured: exp.featured ? 'Yes' : 'No',
    }));
    
    // Convert to CSV
    const headers = Object.keys(csvData[0]).join(',');
    const rows = csvData.map(row => Object.values(row).join(',')).join('\n');
    const csv = `${headers}\n${rows}`;
    
    // Download file
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `experiences-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    Swal.fire({
      icon: "success",
      title: "Exported!",
      text: `${selectedExperiences.length} experiences exported to CSV`,
      timer: 2000,
      showConfirmButton: false,
    });
  };

  const handleBulkArchive = async () => {
    if (selectedExperiences.length === 0) return;
    
    const result = await Swal.fire({
      title: `Archive ${selectedExperiences.length} experiences?`,
      text: "Archived experiences will be hidden from public view",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, archive",
    });

    if (result.isConfirmed) {
      try {
        await Promise.all(
          selectedExperiences.map(id =>
            fetch(`/api/admin/experiences/${id}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ status: 'inactive' }),
            })
          )
        );
        
        await fetchExperiences();
        setSelectedExperiences([]);
        Swal.fire(
          "Archived!",
          `${selectedExperiences.length} experiences archived.`,
          "success"
        );
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to archive some experiences",
        });
      }
    }
  };

  const handleBulkStatusChange = async (status: string) => {
    if (selectedExperiences.length === 0) return;
    
    const result = await Swal.fire({
      title: `Change status to ${status}?`,
      text: `This will update ${selectedExperiences.length} experiences`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#B88A3D",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, update",
    });

    if (result.isConfirmed) {
      try {
        await Promise.all(
          selectedExperiences.map(id =>
            fetch(`/api/admin/experiences/${id}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ status }),
            })
          )
        );
        
        await fetchExperiences();
        setSelectedExperiences([]);
        Swal.fire(
          "Updated!",
          `${selectedExperiences.length} experiences status changed to ${status}.`,
          "success"
        );
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to update some experiences",
        });
      }
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/experiences/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update status');
      }

      await fetchExperiences();
      Swal.fire({
        title: 'Status Updated',
        text: `Experience status changed to ${newStatus}`,
        icon: 'success',
        timer: 2000,
      });
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Failed to update status',
      });
    }
  };

  const toggleSelectExperience = (id: string) => {
    setSelectedExperiences(prev =>
      prev.includes(id) ? prev.filter(selectedId => selectedId !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedExperiences.length === experiences.length) {
      setSelectedExperiences([]);
    } else {
      setSelectedExperiences(experiences.map(exp => exp._id || exp.id || '').filter(Boolean));
    }
  };

  const clearSelection = () => {
    setSelectedExperiences([]);
  };

  const updateFilters = (newFilters: Partial<Filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: 'all',
      status: 'all',
      page: 1,
      limit: 12,
    });
  };

  return {
    experiences,
    loading,
    filters,
    pagination,
    selectedExperiences,
    setPagination,
    fetchExperiences,
    handleDelete,
    handleBulkDelete,
    handleDuplicate,
    handleBulkDuplicate,
    handleBulkExport,
    handleBulkArchive,
    handleBulkStatusChange,
    handleStatusChange,
    toggleSelectExperience,
    selectAll,
    clearSelection,
    updateFilters,
    clearFilters,
  };
};