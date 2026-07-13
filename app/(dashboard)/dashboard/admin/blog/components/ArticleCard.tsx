import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  Folder,
  User,
  Eye,
  ThumbsUp,
  MessageCircle,
  Star,
  Edit,
  Copy,
  Trash2,
  Image as ImageIcon
} from 'lucide-react';
import { ArticleCardProps } from '../types/blog.types';
import { getStatusBadge, getCategoryName, getTagNames, formatDate } from '../utils/blogHelpers';

export const ArticleCard: React.FC<ArticleCardProps> = ({
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

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onEdit(article);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden border border-gray-100 group">
      {/* Cover Image */}
      <div className="relative h-48 bg-gray-100">
        {article.coverImage ? (
          <Image
            src={article.coverImage}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-105 transition duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-500 to-orange-500">
            <ImageIcon className="w-12 h-12 text-white/50" />
          </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs border ${status.color} bg-white/90 backdrop-blur-sm`}>
            <StatusIcon className="w-3 h-3" />
            <span>{status.text}</span>
          </span>
        </div>

        {/* Featured Badge */}
        {article.featured && (
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs bg-amber-500 text-white">
              <Star className="w-3 h-3 fill-current" />
              <span>Featured</span>
            </span>
          </div>
        )}

        {/* Selection Checkbox */}
        <div className="absolute bottom-3 left-3">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => onSelect(article.id, e.target.checked)}
            className="w-4 h-4 text-amber-500 rounded border-gray-300 focus:ring-amber-500"
          />
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-center space-x-2 text-xs text-gray-500 mb-2">
          <Calendar className="w-3 h-3" />
          <span>{formatDate(article.createdAt)}</span>
          <Clock className="w-3 h-3 ml-2" />
          <span>{article.readTime}</span>
        </div>

        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
          {article.title}
        </h3>

        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {article.excerpt}
        </p>

        {/* Category & Author */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-1 text-xs bg-gray-100 px-2 py-1 rounded-full">
            <Folder className="w-3 h-3 text-gray-500" />
            <span className="text-gray-700">{categoryName}</span>
          </div>
          <div className="flex items-center space-x-1 text-xs text-gray-500">
            <User className="w-3 h-3" />
            <span>{article.author}</span>
          </div>
        </div>

        {/* Tags */}
   

        {/* Stats */}
        <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t">
          <div className="flex items-center space-x-3">
            <span className="flex items-center">
              <Eye className="w-3 h-3 mr-1" />
              {article.views}
            </span>
            <span className="flex items-center">
              <ThumbsUp className="w-3 h-3 mr-1" />
              {article.likes}
            </span>
            <span className="flex items-center">
              <MessageCircle className="w-3 h-3 mr-1" />
              {article.comments}
            </span>
          </div>
          <div className="flex items-center space-x-1">
           
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
        </div>
      </div>
    </div>
  );
};