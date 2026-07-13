import { Trash2, Copy, Eye, Edit, Download, Archive, X } from "lucide-react";
import { useState } from "react";

interface BulkActionsProps {
  selectedCount: number;
  onDelete: () => void;
  onDuplicate?: () => void;
  onExport?: () => void;
  onArchive?: () => void;
  onStatusChange?: (status: string) => void;
  onClearSelection?: () => void;
}

export const BulkActions = ({
  selectedCount,
  onDelete,
  onDuplicate,
  onExport,
  onArchive,
  onStatusChange,
  onClearSelection,
}: BulkActionsProps) => {
  const [showStatusMenu, setShowStatusMenu] = useState(false);

  if (selectedCount === 0) return null;

  const statusOptions = [
    { value: 'active', label: 'Active', color: 'text-green-600' },
    { value: 'inactive', label: 'Inactive', color: 'text-gray-600' },
    { value: 'upcoming', label: 'Upcoming', color: 'text-blue-600' },
  ];

  return (
    <div className="flex items-center space-x-2 bg-amber-50 border border-amber-200 rounded-lg p-1 animate-fadeIn">
      <div className="px-3 py-1.5 bg-amber-100 text-amber-800 rounded-md text-sm font-medium">
        {selectedCount} {selectedCount === 1 ? 'item' : 'items'} selected
      </div>
      
      <div className="h-6 w-px bg-amber-200 mx-1" />
      
      {onStatusChange && (
        <div className="relative">
          <button
            onClick={() => setShowStatusMenu(!showStatusMenu)}
            className="p-2 text-amber-700 hover:bg-amber-100 rounded-lg transition flex items-center space-x-1"
            title="Change status"
          >
            <Eye className="w-4 h-4" />
            <span className="text-sm hidden sm:inline">Status</span>
          </button>
          
          {showStatusMenu && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setShowStatusMenu(false)}
              />
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                <div className="py-1">
                  {statusOptions.map((status) => (
                    <button
                      key={status.value}
                      onClick={() => {
                        onStatusChange(status.value);
                        setShowStatusMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center space-x-2"
                    >
                      <span className={`w-2 h-2 rounded-full ${status.color.replace('text', 'bg')}`} />
                      <span>Set as {status.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}
      
      {onDuplicate && (
        <button
          onClick={onDuplicate}
          className="p-2 text-purple-700 hover:bg-purple-100 rounded-lg transition"
          title="Duplicate selected"
        >
          <Copy className="w-4 h-4" />
          <span className="sr-only">Duplicate</span>
        </button>
      )}
      
      {onExport && (
        <button
          onClick={onExport}
          className="p-2 text-blue-700 hover:bg-blue-100 rounded-lg transition"
          title="Export selected"
        >
          <Download className="w-4 h-4" />
          <span className="sr-only">Export</span>
        </button>
      )}
      
      {onArchive && (
        <button
          onClick={onArchive}
          className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
          title="Archive selected"
        >
          <Archive className="w-4 h-4" />
          <span className="sr-only">Archive</span>
        </button>
      )}
      
      <button
        onClick={onDelete}
        className="p-2 text-red-700 hover:bg-red-100 rounded-lg transition"
        title="Delete selected"
      >
        <Trash2 className="w-4 h-4" />
        <span className="sr-only">Delete</span>
      </button>
      
      {onClearSelection && (
        <>
          <div className="h-6 w-px bg-amber-200 mx-1" />
          <button
            onClick={onClearSelection}
            className="p-2 text-gray-500 hover:bg-amber-100 rounded-lg transition"
            title="Clear selection"
          >
            <X className="w-4 h-4" />
            <span className="sr-only">Clear</span>
          </button>
        </>
      )}
    </div>
  );
};