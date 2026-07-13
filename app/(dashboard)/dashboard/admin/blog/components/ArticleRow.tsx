import React from 'react';
import Image from 'next/image';
import {
  Folder,
  User,
  Calendar,
  Eye,
  Star,
  Edit,
  Copy,
  Trash2,
  FileText
} from 'lucide-react';
import { ArticleRowProps } from '../types/blog.types';
import { getStatusBadge, getCategoryName, formatDate } from '../utils/blogHelpers';

export const ArticleRow: React.FC<ArticleRowProps> = ({
  article,
  isSelected,
  onSelect,
  onToggleFeatured,
  onDuplicate,
  onDelete,
  onEdit,
  categories
}) => {
  const status = getStatusBadge(article.status);
  const StatusIcon = status.icon;
  const categoryName = getCategoryName(article.category, categories);

  const handleEditClick = () => {
    onEdit(article);
  };

  return (
    <>
      <td className="px-6 py-4">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => onSelect(article.id, e.target.checked)}
          className="w-4 h-4 text-amber-500 rounded border-gray-300 focus:ring-amber-500"
        />
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
            {article.coverImage ? (
              <Image
                src={article.coverImage}
                alt={article.title}
                width={40}
                height={40}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-500 to-orange-500">
                <FileText className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
          <div>
            <div className="font-medium text-gray-900 flex items-center space-x-2">
              <span>{article.title}</span>
              {article.featured && (
                <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
              )}
            </div>
            <div className="text-xs text-gray-500 mt-1 line-clamp-1">
              {article.excerpt}
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center space-x-1">
          <Folder className="w-3 h-3 text-gray-400" />
          <span className="text-sm">{categoryName}</span>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center space-x-1">
          <User className="w-3 h-3 text-gray-400" />
          <span className="text-sm">{article.author}</span>
        </div>
      </td>
      <td className="px-6 py-4">
        <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs border ${status.color}`}>
          <StatusIcon className="w-3 h-3" />
          <span>{status.text}</span>
        </span>
      </td>
      <td className="px-6 py-4 text-sm text-gray-600">
        <div className="flex items-center space-x-1">
          <Calendar className="w-3 h-3 text-gray-400" />
          <span>{formatDate(article.createdAt)}</span>
        </div>
        <div className="text-xs text-gray-400 mt-1">
          {article.readTime}
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center space-x-1">
          <Eye className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-medium">{article.views}</span>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center space-x-2">
         
          <button
            onClick={handleEditClick}
            className="p-1 text-blue-600 hover:bg-blue-50 rounded-lg"
            title="Edit"
          >
            <Edit className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => onDelete(article.id)}
            className="p-1 text-red-600 hover:bg-red-50 rounded-lg"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </>
  );
};