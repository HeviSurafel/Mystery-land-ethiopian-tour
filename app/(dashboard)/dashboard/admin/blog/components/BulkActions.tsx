import React from 'react';
import { motion } from 'framer-motion';
import { BulkActionsProps } from '../types/blog.types';

export const BulkActions: React.FC<BulkActionsProps> = ({
  selectedCount,
  onClear,
  onPublish,
  onDraft,
  onArchive,
  onDelete
}) => {
  if (selectedCount === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-amber-50 rounded-xl p-4 flex items-center justify-between"
    >
      <div className="flex items-center space-x-4">
        <span className="text-sm font-medium text-amber-700">
          {selectedCount} articles selected
        </span>
        <button
          onClick={onClear}
          className="text-sm text-amber-600 hover:text-amber-700"
        >
          Clear
        </button>
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={onPublish}
          className="px-3 py-1 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 transition"
        >
          Publish
        </button>
        <button
          onClick={onDraft}
          className="px-3 py-1 bg-gray-500 text-white rounded-lg text-sm hover:bg-gray-600 transition"
        >
          Draft
        </button>
        <button
          onClick={onArchive}
          className="px-3 py-1 bg-amber-500 text-white rounded-lg text-sm hover:bg-amber-600 transition"
        >
          Archive
        </button>
        <button
          onClick={onDelete}
          className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition"
        >
          Delete
        </button>
      </div>
    </motion.div>
  );
};