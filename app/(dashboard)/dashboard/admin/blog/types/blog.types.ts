import { BlogArticle, BlogCategory, BlogTag, BlogFilters, BlogStats } from "@/app/types/types";

export interface BlogContextType {
  articles: BlogArticle[];
  categories: BlogCategory[];
  loading: boolean;
  error: string | null;
  stats: BlogStats | null;
  selectedArticles: string[];
  filters: BlogFilters;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  viewMode: "list" | "grid" | "compact";
  showFilters: boolean;
  setViewMode: (mode: "list" | "grid" | "compact") => void;
  setShowFilters: (show: boolean) => void;
  setSelectedArticles: (articles: string[]) => void;
  setFilters: (filters: BlogFilters) => void;
  refreshArticles: () => Promise<void>;
  refreshCategories: () => Promise<void>;
  handleDelete: (id: string) => Promise<void>;
  handleToggleFeatured: (id: string, current: boolean) => Promise<void>;
  handleDuplicate: (id: string) => Promise<void>;
  handleBulkDelete: () => Promise<void>;
  handleBulkStatusUpdate: (status: string) => Promise<void>;
  handleExport: () => Promise<void>;
}

export interface ArticleCardProps {
  article: BlogArticle;
  isSelected: boolean;
  onSelect: (id: string, checked: boolean) => void;
  onToggleFeatured: (id: string, current: boolean) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (article: BlogArticle) => void;
  categories: BlogCategory[];
}

export interface ArticleRowProps extends ArticleCardProps {}

export interface CompactArticleRowProps extends ArticleCardProps {}

export interface GridViewProps {
  articles: BlogArticle[];
  selectedArticles: string[];
  onSelect: (id: string, checked: boolean) => void;
  onToggleFeatured: (id: string, current: boolean) => Promise<void>;
  onDuplicate: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onEdit: (article: BlogArticle) => void;
  categories: BlogCategory[];
}

export interface ListViewProps {
  articles: BlogArticle[];
  selectedArticles: string[];
  onSelect: (id: string, checked: boolean) => void;
  onToggleFeatured: (id: string, current: boolean) => Promise<void>;
  onDuplicate: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onEdit: (article: BlogArticle) => void;
  categories: BlogCategory[];
  onSelectAll: (checked: boolean) => void;
  allSelected: boolean;
}

export interface CompactViewProps {
  articles: BlogArticle[];
  selectedArticles: string[];
  onSelect: (id: string, checked: boolean) => void;
  onToggleFeatured: (id: string, current: boolean) => Promise<void>;
  onDuplicate: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onEdit: (article: BlogArticle) => void;
  categories: BlogCategory[];
}

export interface BlogHeaderProps {
  viewMode: "list" | "grid" | "compact";
  onViewModeChange: (mode: "list" | "grid" | "compact") => void;
  onToggleFilters: () => void;
  onExport: () => void;
  onRefresh: () => void;
  onCreateClick: () => void;
  showFilterBadge: boolean;
  loading?: boolean;
}

export interface BlogStatsProps {
  stats: BlogStats | null;
}

export interface BlogFiltersProps {
  filters: BlogFilters;
  categories: BlogCategory[];
  onFilterChange: (filters: BlogFilters) => void;
  onClearFilters: () => void;
}

export interface BulkActionsProps {
  selectedCount: number;
  onClear: () => void;
  onPublish: () => void;
  onDraft: () => void;
  onArchive: () => void;
  onDelete: () => void;
}

export interface PaginationProps {
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  onPageChange: (page: number) => void;
}

export interface EmptyStateProps {
  type: "articles" | "categories" ;
  onCreate?: () => void;
  createLink?: string;
}

export interface ArticleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => Promise<void>;
  formData: any;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  categories: BlogCategory[];
  loading: boolean;
  isEditing: boolean;
}

export interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export interface TagModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}