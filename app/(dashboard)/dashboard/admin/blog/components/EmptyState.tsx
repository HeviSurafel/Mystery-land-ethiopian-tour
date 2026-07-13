import React from 'react';
import Link from 'next/link';
import { Folder, Newspaper, Plus, Tag } from 'lucide-react';
import { EmptyStateProps } from '../types/blog.types';

export const EmptyState: React.FC<EmptyStateProps> = ({ type, onCreate, createLink }) => {
  const messages = {
    articles: {
      icon: Newspaper,
      title: "No articles found",
      description: "Try adjusting your search or filters",
      action: "Create First Article",
      link: "/dashboard/admin/blog/create"
    },
    categories: {
      icon: Folder,
      title: "No categories found",
      description: "Create your first category to organize articles",
      action: "Create Category",
      link: "/dashboard/admin/blog/categories/create"
    },
    tags: {
      icon: Tag,
      title: "No tags found",
      description: "Tags help organize and find articles",
      action: "Create Tag",
      link: "/dashboard/admin/blog/tags/create"
    }
  };

  const message = messages[type];
  const Icon = message.icon;

  return (
    <div className="text-center py-12 bg-white rounded-xl">
      <Icon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900">{message.title}</h3>
      <p className="text-gray-500 mt-1">{message.description}</p>
      {createLink ? (
        <Link
          href={createLink}
          className="inline-flex items-center space-x-2 mt-4 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition"
        >
          <Plus className="w-4 h-4" />
          <span>{message.action}</span>
        </Link>
      ) : onCreate && (
        <button
          onClick={onCreate}
          className="inline-flex items-center space-x-2 mt-4 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition"
        >
          <Plus className="w-4 h-4" />
          <span>{message.action}</span>
        </button>
      )}
    </div>
  );
};