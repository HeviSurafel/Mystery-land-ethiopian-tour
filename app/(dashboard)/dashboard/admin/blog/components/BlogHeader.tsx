import React from 'react';
import {
  List,
  Grid3x3,
  LayoutGrid,
  SlidersHorizontal,
  Download,
  RefreshCw,
  Plus
} from 'lucide-react';
import { BlogHeaderProps } from '../types/blog.types';

const viewModeIcons = {
  list: List,
  grid: Grid3x3,
  compact: LayoutGrid
};

interface ExtendedBlogHeaderProps extends BlogHeaderProps {
  onCreateClick: () => void;
}

export const BlogHeader: React.FC<ExtendedBlogHeaderProps> = ({
  viewMode,
  onViewModeChange,
  onToggleFilters,
  onExport,
  onRefresh,
  onCreateClick,
  showFilterBadge,
  loading
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Blog Management</h1>
        <p className="text-gray-600 mt-1">Create, edit, and manage blog articles</p>
      </div>
      <div className="flex items-center space-x-3 mt-4 md:mt-0">
        {/* View Mode Toggle */}
        <div className="flex items-center bg-white rounded-lg border border-gray-200 p-1">
          {(['list', 'grid', 'compact'] as const).map((mode) => {
            const Icon = viewModeIcons[mode];
            return (
              <button
                key={mode}
                onClick={() => onViewModeChange(mode)}
                className={`p-2 rounded-lg transition ${
                  viewMode === mode 
                    ? 'bg-amber-50 text-amber-600' 
                    : 'text-gray-400 hover:text-gray-600'
                }`}
                title={`${mode.charAt(0).toUpperCase() + mode.slice(1)} View`}
              >
                <Icon className="w-4 h-4" />
              </button>
            );
          })}
        </div>

        <button
          onClick={onToggleFilters}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg relative"
          title="Toggle filters"
        >
          <SlidersHorizontal className="w-5 h-5" />
          {showFilterBadge && (
            <span className="absolute top-0 right-0 w-2 h-2 bg-amber-500 rounded-full"></span>
          )}
        </button>

        <button
          onClick={onExport}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          title="Export articles"
          disabled={loading}
        >
          <Download className="w-5 h-5" />
        </button>

        <button
          onClick={onRefresh}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          title="Refresh"
          disabled={loading}
        >
          <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
        </button>

        <button
          onClick={onCreateClick}
          className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>New Article</span>
        </button>
      </div>
    </div>
  );
};