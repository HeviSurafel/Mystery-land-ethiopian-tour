"use client";

import { motion } from "framer-motion";
import { CheckCircle, XCircle, Trash2, AlertCircle } from "lucide-react";

interface BulkActionsProps {
  selectedCount: number;
  onStatusChange: (status: string) => void;
  onDelete: () => void;
  onClear: () => void;
}

export const BulkActions = ({
  selectedCount,
  onStatusChange,
  onDelete,
  onClear
}: BulkActionsProps) => {
  if (selectedCount === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-amber-50 rounded-xl p-4 flex items-center justify-between"
    >
      <div className="flex items-center space-x-4">
        <AlertCircle className="w-5 h-5 text-amber-600" />
        <span className="text-sm font-medium text-amber-700">
          {selectedCount} {selectedCount === 1 ? 'destination' : 'destinations'} selected
        </span>
        <button
          onClick={onClear}
          className="text-sm text-amber-600 hover:text-amber-700 underline"
        >
          Clear
        </button>
      </div>
      
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onStatusChange('active')}
          className="px-3 py-1 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 transition flex items-center space-x-1"
        >
          <CheckCircle className="w-4 h-4" />
          <span>Set Active</span>
        </button>
        <button
          onClick={() => onStatusChange('inactive')}
          className="px-3 py-1 bg-gray-500 text-white rounded-lg text-sm hover:bg-gray-600 transition flex items-center space-x-1"
        >
          <XCircle className="w-4 h-4" />
          <span>Set Inactive</span>
        </button>
        <button
          onClick={onDelete}
          className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition flex items-center space-x-1"
        >
          <Trash2 className="w-4 h-4" />
          <span>Delete</span>
        </button>
      </div>
    </motion.div>
  );
};