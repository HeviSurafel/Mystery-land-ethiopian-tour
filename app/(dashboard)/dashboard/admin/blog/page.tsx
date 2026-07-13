"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { AlertTriangle, Loader2 } from "lucide-react";

// Components
import { BlogHeader } from "./components/BlogHeader";
import { BlogStats } from "./components/BlogStats";
import { BlogFilters } from "./components/BlogFilters";
import { BulkActions } from "./components/BulkActions";
import { GridView } from "./components/view-modes/GridView";
import { ListView } from "./components/view-modes/ListView";
import { CompactView } from "./components/view-modes/CompactView";
import { EmptyState } from "./components/EmptyState";
import { Pagination } from "./components/Pagination";
import { ArticleModal } from "./components/modals/ArticleModal";
import { CategoryModal } from "./components/modals/CategoryModal";
import { TagModal } from "./components/modals/TagModal";

// Hooks
import { useBlogArticles } from "./hooks/useBlogArticles";
import { useCategories } from "./hooks/useCategories";

import { useBulkActions } from "./hooks/useBulkActions";
import { useArticleModal } from "./hooks/useArticleModal";

// Types
import { BlogFilters as BlogFiltersType } from "@/types/types";

export default function AdminBlogPage() {
  const [viewMode, setViewMode] = useState<"list" | "grid" | "compact">("list");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedArticles, setSelectedArticles] = useState<string[]>([]);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showTagModal, setShowTagModal] = useState(false);

  // Initial filters
  const [filters, setFilters] = useState<BlogFiltersType>({
    search: "",
    category: "all",
    tag: "all",
    status: "all",
    featured: undefined,
    fromDate: "",
    toDate: "",
    sortBy: "createdAt",
    sortOrder: "desc",
    page: 1,
    limit: 10,
  });

  // Custom hooks
  const {
    articles,
    loading,
    error,
    stats,
    pagination,
    refreshArticles,
    handleDelete,
    handleToggleFeatured,
    handleDuplicate,
    handleExport,
  } = useBlogArticles(filters);

  const { categories, refreshCategories } = useCategories();

  const { handleBulkDelete, handleBulkStatusUpdate } = useBulkActions(
    selectedArticles,
    () => {
      refreshArticles();
      refreshCategories();
    },
    () => setSelectedArticles([]),
  );

  const {
    isOpen: isArticleModalOpen,
    loading: articleModalLoading,
    editingArticle,
    formData: articleFormData,
    openCreateModal,
    openEditModal,
    closeModal: closeArticleModal,
    handleInputChange,
    handleSubmit: handleArticleSubmit,
  } = useArticleModal(() => {
    refreshArticles();
    refreshCategories();
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedArticles(articles.map((a) => a.id));
    } else {
      setSelectedArticles([]);
    }
  };

  const handleSelect = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedArticles([...selectedArticles, id]);
    } else {
      setSelectedArticles(
        selectedArticles.filter((selectedId) => selectedId !== id),
      );
    }
  };

  const handleFilterChange = (newFilters: BlogFiltersType) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      search: "",
      category: "all",
      tag: "all",
      status: "all",
      featured: undefined,
      fromDate: "",
      toDate: "",
      sortBy: "createdAt",
      sortOrder: "desc",
      page: 1,
      limit: 10,
    });
  };

  const handleRefresh = () => {
    refreshArticles();
    refreshCategories();
  };

  const showFilterBadge =
    filters.category !== "all" ||
    filters.status !== "all" ||
    filters.tag !== "all" ||
    filters.search !== "";

  if (loading && !articles.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-amber-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading blog articles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <BlogHeader
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onToggleFilters={() => setShowFilters(!showFilters)}
        onExport={handleExport}
        onRefresh={handleRefresh}
        onCreateClick={openCreateModal}
        showFilterBadge={showFilterBadge}
        loading={loading}
      />

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <p className="text-red-600">{error}</p>
          </div>
          <button
            onClick={handleRefresh}
            className="px-3 py-1 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
          >
            Retry
          </button>
        </div>
      )}

      {/* Stats */}
      <BlogStats stats={stats} />

      {/* Filters */}
      <AnimatePresence>
        {showFilters && (
          <BlogFilters
            filters={filters}
            categories={categories}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
          />
        )}
      </AnimatePresence>

      {/* Bulk Actions */}
      <BulkActions
        selectedCount={selectedArticles.length}
        onClear={() => setSelectedArticles([])}
        onPublish={() => handleBulkStatusUpdate("published")}
        onDraft={() => handleBulkStatusUpdate("draft")}
        onArchive={() => handleBulkStatusUpdate("archived")}
        onDelete={handleBulkDelete}
      />

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
        </div>
      )}

      {/* Articles View */}
      {!loading && (
        <>
          {viewMode === "grid" && (
            <GridView
              articles={articles}
              selectedArticles={selectedArticles}
              onSelect={handleSelect}
              onToggleFeatured={handleToggleFeatured}
              onDuplicate={handleDuplicate}
              onDelete={handleDelete}
              categories={categories}
              onEdit={openEditModal}
            />
          )}

          {viewMode === "list" && (
            <ListView
              articles={articles}
              selectedArticles={selectedArticles}
              onSelect={handleSelect}
              onToggleFeatured={handleToggleFeatured}
              onDuplicate={handleDuplicate}
              onDelete={handleDelete}
              categories={categories}
              onSelectAll={handleSelectAll}
              allSelected={
                articles.length > 0 &&
                selectedArticles.length === articles.length
              }
              onEdit={openEditModal}
            />
          )}

          {viewMode === "compact" && (
            <CompactView
              articles={articles}
              selectedArticles={selectedArticles}
              onSelect={handleSelect}
              onToggleFeatured={handleToggleFeatured}
              onDuplicate={handleDuplicate}
              onDelete={handleDelete}
              categories={categories}
              onEdit={openEditModal}
            />
          )}
        </>
      )}

      {/* Empty State */}
      {!loading && articles.length === 0 && (
        <EmptyState type="articles" onCreate={openCreateModal} />
      )}

      {/* Pagination */}
      <Pagination
        pagination={pagination}
        onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))}
      />

      {/* Modals */}
      <ArticleModal
        isOpen={isArticleModalOpen}
        onClose={closeArticleModal}
        onSubmit={handleArticleSubmit}
        formData={articleFormData}
        onInputChange={handleInputChange}
        categories={categories}
        loading={articleModalLoading}
        isEditing={!!editingArticle}
      />

      <CategoryModal
        isOpen={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        onSuccess={() => {
          refreshCategories();
          // You might want to show a success message or notification here
        }}
      />
    </div>
  );
}
