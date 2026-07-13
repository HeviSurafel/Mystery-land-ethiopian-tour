import { CheckCircle, DraftingCompass, Archive, Clock, FileText } from "lucide-react";
import { BlogArticle } from "@/app/types/types";

export const statusColors = {
  published: "bg-green-100 text-green-700 border-green-200",
  draft: "bg-gray-100 text-gray-700 border-gray-200",
  archived: "bg-amber-100 text-amber-700 border-amber-200",
  scheduled: "bg-blue-100 text-blue-700 border-blue-200"
};

export const statusIcons = {
  published: CheckCircle,
  draft: DraftingCompass,
  archived: Archive,
  scheduled: Clock
};

export const sortOptions = [
  { value: "createdAt", label: "Created Date" },
  { value: "publishedAt", label: "Published Date" },
  { value: "title", label: "Title" },
  { value: "views", label: "Views" },
  { value: "likes", label: "Likes" },
  { value: "updatedAt", label: "Last Updated" }
];

export const viewModes = [
  { value: "list", label: "List View" },
  { value: "grid", label: "Grid View" },
  { value: "compact", label: "Compact View" }
];

export const getStatusBadge = (status: string) => {
  const StatusIcon = statusIcons[status as keyof typeof statusIcons] || FileText;
  return {
    color: statusColors[status as keyof typeof statusColors] || "bg-gray-100 text-gray-700",
    icon: StatusIcon,
    text: status.charAt(0).toUpperCase() + status.slice(1)
  };
};

export const getCategoryName = (category: string | any, categories: any[]): string => {
  if (typeof category === 'string') {
    const found = categories.find(c => c.id === category);
    return found?.name || category;
  }
  return category?.name || 'Uncategorized';
};

export const getTagNames = (tags: string[] | any[], allTags: any[]): string[] => {
  if (!tags || tags.length === 0) return [];
  
  if (typeof tags[0] === 'string') {
    return tags.map(tag => {
      const found = allTags.find(t => t.id === tag);
      return found?.name || tag;
    });
  }
  return (tags as any[]).map(t => t.name);
};

export const formatDate = (date: string | Date) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};