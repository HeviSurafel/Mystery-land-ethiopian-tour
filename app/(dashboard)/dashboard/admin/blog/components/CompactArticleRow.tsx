import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Folder,
  Calendar,
  Eye,
  Star,
  Edit,
  Trash2,
  Copy,
  FileText
} from 'lucide-react';
import { CompactArticleRowProps } from '../types/blog.types';
import { getStatusBadge, getCategoryName, formatDate } from '../utils/blogHelpers';

export const CompactArticleRow: React.FC<CompactArticleRowProps> = ({
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
    <div className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-between hover:shadow-md transition border border-gray-100">
      <div className="flex items-center space-x-4 flex-1">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => onSelect(article.id, e.target.checked)}
          className="w-4 h-4 text-amber-500 rounded border-gray-300 focus:ring-amber-500"
        />
        
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

        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <h4 className="font-medium text-gray-900">{article.title}</h4>
            {article.featured && (
              <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
            )}
          </div>
          <div className="flex items-center space-x-3 text-xs text-gray-500 mt-1">
            <span className="flex items-center">
              <Folder className="w-3 h-3 mr-1" />
              {categoryName}
            </span>
            <span className="flex items-center">
              <Calendar className="w-3 h-3 mr-1" />
              {formatDate(article.createdAt)}
            </span>
            <span className="flex items-center">
              <Eye className="w-3 h-3 mr-1" />
              {article.views}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs border ${status.color}`}>
          <StatusIcon className="w-3 h-3" />
          <span>{status.text}</span>
        </span>

        <div className="flex items-center space-x-1">
          
          <button
            onClick={handleEditClick}
            className="p-1 text-blue-600 hover:bg-blue-50 rounded-lg"
          >
            <Edit className="w-4 h-4" />
          </button>
      
          <button
            onClick={() => onDelete(article.id)}
            className="p-1 text-red-600 hover:bg-red-50 rounded-lg"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};