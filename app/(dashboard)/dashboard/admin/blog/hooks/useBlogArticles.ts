import { useState, useEffect, useCallback } from 'react';
import { BlogArticle, BlogFilters, BlogStats, BlogResponse } from '@/app/types/types';
import Swal from 'sweetalert2';

export const useBlogArticles = (initialFilters: BlogFilters) => {
  const [articles, setArticles] = useState<BlogArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<BlogStats | null>(null);
  const [filters, setFilters] = useState<BlogFilters>(initialFilters);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1,
    hasNextPage: false,
    hasPrevPage: false
  });

  const fetchArticles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: filters.page?.toString() || "1",
        limit: filters.limit?.toString() || "10",
        ...(filters.search && { search: filters.search }),
        ...(filters.category && filters.category !== "all" && { category: filters.category }),
        ...(filters.tag && filters.tag !== "all" && { tag: filters.tag }),
        ...(filters.status && filters.status !== "all" && { status: filters.status }),
        ...(filters.featured !== undefined && { featured: filters.featured.toString() }),
        ...(filters.fromDate && { fromDate: filters.fromDate }),
        ...(filters.toDate && { toDate: filters.toDate }),
        sortBy: filters.sortBy || "createdAt",
        sortOrder: filters.sortOrder || "desc"
      });

      const response = await fetch(`/api/admin/blog?${params}`);
      
      if (!response.ok) throw new Error("Failed to fetch articles");

      const data: BlogResponse = await response.json();
      
      if (data.success) {
        setArticles(data.data);
        setPagination(data.pagination);
        if (data.stats) setStats(data.stats);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (filters.page === 1) {
        fetchArticles();
      } else {
        setFilters(prev => ({ ...prev, page: 1 }));
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [filters.search, fetchArticles]);

  const handleDelete = async (articleId: string) => {
    const result = await Swal.fire({
      title: "Delete Article",
      text: "Are you sure you want to delete this article? This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete article"
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`/api/admin/blog/${articleId}`, {
          method: "DELETE"
        });

        if (!response.ok) throw new Error("Failed to delete article");

        await fetchArticles();
        
        Swal.fire({
          title: "Deleted!",
          text: "Article has been deleted successfully.",
          icon: "success",
          timer: 2000,
          confirmButtonColor: "#B88A3D"
        });
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: "Failed to delete article",
          icon: "error",
          confirmButtonColor: "#B88A3D"
        });
      }
    }
  };

  const handleToggleFeatured = async (articleId: string, currentFeatured: boolean) => {
    try {
      const response = await fetch(`/api/admin/blog/${articleId}/featured`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: !currentFeatured })
      });

      if (!response.ok) throw new Error("Failed to update featured status");

      await fetchArticles();
      
      Swal.fire({
        title: "Success",
        text: `Article ${!currentFeatured ? "featured" : "unfeatured"} successfully`,
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

  const handleDuplicate = async (articleId: string) => {
    try {
      const response = await fetch(`/api/admin/blog/${articleId}/duplicate`, {
        method: "POST"
      });

      if (!response.ok) throw new Error("Failed to duplicate article");

      await fetchArticles();
      
      Swal.fire({
        title: "Duplicated!",
        text: "Article has been duplicated successfully.",
        icon: "success",
        timer: 2000,
        confirmButtonColor: "#B88A3D"
      });
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Failed to duplicate article",
        icon: "error",
        confirmButtonColor: "#B88A3D"
      });
    }
  };

  const handleExport = async () => {
    try {
      const response = await fetch("/api/admin/blog/export", {
        method: "GET"
      });

      if (!response.ok) throw new Error("Failed to export articles");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `blog_articles_${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      Swal.fire({
        title: "Export Started",
        text: "Articles export has been initiated",
        icon: "success",
        timer: 2000,
        confirmButtonColor: "#B88A3D"
      });
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Failed to export articles",
        icon: "error",
        confirmButtonColor: "#B88A3D"
      });
    }
  };

  return {
    articles,
    loading,
    error,
    stats,
    filters,
    pagination,
    setFilters,
    refreshArticles: fetchArticles,
    handleDelete,
    handleToggleFeatured,
    handleDuplicate,
    handleExport
  };
};