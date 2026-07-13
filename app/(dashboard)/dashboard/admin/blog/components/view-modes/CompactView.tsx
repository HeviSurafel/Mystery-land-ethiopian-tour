import React from 'react';
import { motion } from 'framer-motion';
import { CompactArticleRow } from '../CompactArticleRow';
import { CompactViewProps } from '../../types/blog.types';

export const CompactView: React.FC<CompactViewProps> = ({
  articles,
  selectedArticles,
  onSelect,
  onToggleFeatured,
  onDuplicate,
  onDelete,
  onEdit,
  categories,
  
}) => {
  return (
    <div className="grid grid-cols-1 gap-3">
      {articles.map((article, index) => (
        <motion.div
          key={article.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.02 }}
        >
          <CompactArticleRow
            article={article}
            isSelected={selectedArticles.includes(article.id)}
            onSelect={onSelect}
            onToggleFeatured={onToggleFeatured}
            onDuplicate={onDuplicate}
            onDelete={onDelete}
            onEdit={onEdit}
            categories={categories}
         
          />
        </motion.div>
      ))}
    </div>
  );
};