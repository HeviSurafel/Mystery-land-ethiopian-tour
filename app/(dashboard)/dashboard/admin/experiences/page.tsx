"use client";

import { useState, useEffect } from "react";
import { ExperiencesHeader } from "./components/ExperiencesHeader";
import { ExperiencesFilters } from "./components/ExperiencesFilters";
import { ExperiencesGrid } from "./components/ExperiencesGrid";
import { Pagination } from "./components/Pagination";
import { CreateEditModal } from "./components/CreateEditModal";
import { useExperiences } from "./hooks/useExperiences";
import { useExperienceForm } from "./hooks/useExperienceForm";
import { ApiExperience, ModalState, ExperienceFormData } from "./components/types";

export default function ExperiencesPage() {
  const {
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
    toggleSelectExperience,
    selectAll,
    updateFilters,
    clearSelection,
    handleBulkDuplicate,
    handleBulkExport,
    handleBulkArchive,
    handleBulkStatusChange,
  } = useExperiences();

  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    mode: 'create',
    experience: null,
  });

  const { handleSubmit: submitForm, loading: formLoading } = useExperienceForm();

  const handleSearchChange = (value: string) => {
    updateFilters({ search: value });
  };

  const handleCategoryChange = (value: string) => {
    updateFilters({ category: value });
  };

  const handleStatusChange = (value: string) => {
    updateFilters({ status: value });
  };

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
  };

  const handleEdit = (experience: ApiExperience) => {
    setModalState({
      isOpen: true,
      mode: 'edit',
      experience,
    });
  };

  const handleAddClick = () => {
    setModalState({
      isOpen: true,
      mode: 'create',
      experience: null,
    });
  };

  const handleModalSubmit = async (data: ExperienceFormData) => {
    // For edit mode, pass the experience ID
    if (modalState.mode === 'edit' && modalState.experience) {
      await submitForm(data, modalState.experience._id || modalState.experience.id);
    } else {
      // For create mode, just pass the data
      await submitForm(data);
    }
    await fetchExperiences();
    setModalState(prev => ({ ...prev, isOpen: false }));
  };

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (filters.page === 1) {
        fetchExperiences();
      } else {
        setPagination(prev => ({ ...prev, page: 1 }));
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [filters.search]);

  return (
    <div className="space-y-6 p-6">
      <ExperiencesHeader
        totalExperiences={pagination.total}
        selectedCount={selectedExperiences.length}
        onRefresh={fetchExperiences}
        onBulkDelete={handleBulkDelete}
        onBulkDuplicate={handleBulkDuplicate}
        onBulkExport={handleBulkExport}
        onBulkArchive={handleBulkArchive}
        onBulkStatusChange={handleBulkStatusChange}
        onClearSelection={clearSelection}
        onAddClick={handleAddClick} // Pass the handler
      />

      <ExperiencesFilters
        search={filters.search}
        category={filters.category}
        status={filters.status}
        onSearchChange={handleSearchChange}
        onCategoryChange={handleCategoryChange}
        onStatusChange={handleStatusChange}
      />

      {selectedExperiences.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center justify-between">
          <p className="text-sm text-blue-800">
            <span className="font-medium">{selectedExperiences.length}</span> experiences selected
          </p>
          <button
            onClick={clearSelection}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Clear selection
          </button>
        </div>
      )}

      <ExperiencesGrid
        experiences={experiences}
        selectedExperiences={selectedExperiences}
        onSelect={toggleSelectExperience}
        onDelete={handleDelete}
        onDuplicate={handleDuplicate}
        onEdit={handleEdit}
        loading={loading}
      />

      <Pagination
        currentPage={pagination.page}
        totalPages={pagination.pages}
        onPageChange={handlePageChange}
      />

      <CreateEditModal
        isOpen={modalState.isOpen}
        mode={modalState.mode}
        experience={modalState.experience}
        onClose={() => setModalState(prev => ({ ...prev, isOpen: false }))}
        onSubmit={handleModalSubmit}
        loading={formLoading}
      />
    </div>
  );
}