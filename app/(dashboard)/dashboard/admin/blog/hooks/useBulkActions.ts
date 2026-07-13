import { useState } from 'react';
import Swal from 'sweetalert2';

export const useBulkActions = (
  selectedArticles: string[],
  onSuccess: () => void,
  onClear: () => void
) => {
  const [loading, setLoading] = useState(false);

  const handleBulkDelete = async () => {
    if (selectedArticles.length === 0) return;

    const result = await Swal.fire({
      title: "Delete Selected Articles",
      text: `Are you sure you want to delete ${selectedArticles.length} articles? This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete all"
    });

    if (result.isConfirmed) {
      setLoading(true);
      try {
        const response = await fetch("/api/admin/blog/bulk", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ articleIds: selectedArticles })
        });

        if (!response.ok) throw new Error("Failed to delete articles");

        await onSuccess();
        onClear();
        
        Swal.fire({
          title: "Deleted!",
          text: `${selectedArticles.length} articles have been deleted.`,
          icon: "success",
          timer: 2000,
          confirmButtonColor: "#B88A3D"
        });
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: "Failed to delete articles",
          icon: "error",
          confirmButtonColor: "#B88A3D"
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleBulkStatusUpdate = async (newStatus: string) => {
    if (selectedArticles.length === 0) return;

    const result = await Swal.fire({
      title: "Update Status",
      text: `Are you sure you want to mark ${selectedArticles.length} articles as ${newStatus}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#B88A3D",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, update"
    });

    if (result.isConfirmed) {
      setLoading(true);
      try {
        const response = await fetch("/api/admin/blog/bulk/status", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            articleIds: selectedArticles,
            status: newStatus 
          })
        });

        if (!response.ok) throw new Error("Failed to update articles");

        await onSuccess();
        onClear();
        
        Swal.fire({
          title: "Updated!",
          text: `${selectedArticles.length} articles have been updated.`,
          icon: "success",
          timer: 2000,
          confirmButtonColor: "#B88A3D"
        });
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: "Failed to update articles",
          icon: "error",
          confirmButtonColor: "#B88A3D"
        });
      } finally {
        setLoading(false);
      }
    }
  };

  return {
    loading,
    handleBulkDelete,
    handleBulkStatusUpdate
  };
};