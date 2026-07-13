import React from 'react';
import { motion } from 'framer-motion';
import { ArticleCard } from '../ArticleCard';
import { GridViewProps } from '../../types/blog.types';

export const GridView: React.FC<GridViewProps> = ({
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {articles.map((article, index) => (
        <motion.div
          key={article.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <ArticleCard
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