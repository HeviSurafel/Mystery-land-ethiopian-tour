import React from 'react';
import { motion } from 'framer-motion';
import { ArticleRow } from '../ArticleRow';
import { ListViewProps } from '../../types/blog.types';

export const ListView: React.FC<ListViewProps> = ({
  articles,
  selectedArticles,
  onSelect,
  onToggleFeatured,
  onDuplicate,
  onDelete,
  onEdit,
  categories,
  onSelectAll,
  allSelected
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr className="text-left text-sm text-gray-500">
              <th className="px-6 py-4 font-medium w-8">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={(e) => onSelectAll(e.target.checked)}
                  className="w-4 h-4 text-amber-500 rounded border-gray-300 focus:ring-amber-500"
                />
              </th>
              <th className="px-6 py-4 font-medium">Article</th>
              <th className="px-6 py-4 font-medium">Category</th>
              <th className="px-6 py-4 font-medium">Author</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">Date</th>
              <th className="px-6 py-4 font-medium">Views</th>
              <th className="px-6 py-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {articles.map((article, index) => (
              <motion.tr
                key={article.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.02 }}
                className="hover:bg-gray-50"
              >
                <ArticleRow
                  article={article}
                  isSelected={selectedArticles.includes(article.id)}
                  onSelect={onSelect}
                  onToggleFeatured={onToggleFeatured}
                  onDuplicate={onDuplicate}
                  onDelete={onDelete}
                  onEdit={onEdit}
                  categories={categories}
             
                />
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};