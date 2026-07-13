// admin/experiences/components/ExperiencesHeader.tsx

import { RefreshCw, Plus } from "lucide-react";
import { BulkActions } from "./BulkActions";

interface ExperiencesHeaderProps {
  totalExperiences: number;
  selectedCount: number;
  onRefresh: () => void;
  onBulkDelete: () => void;
  onBulkDuplicate?: () => void;
  onBulkExport?: () => void;
  onBulkArchive?: () => void;
  onBulkStatusChange?: (status: string) => void;
  onClearSelection?: () => void;
  onAddClick: () => void; // New prop for opening create modal
}

export const ExperiencesHeader = ({
  totalExperiences,
  selectedCount,
  onRefresh,
  onBulkDelete,
  onBulkDuplicate,
  onBulkExport,
  onBulkArchive,
  onBulkStatusChange,
  onClearSelection,
  onAddClick, // Add this prop
}: ExperiencesHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Experiences</h1>
        <p className="text-gray-600 mt-1">
          Manage your cultural experiences and activities ({totalExperiences} total)
        </p>
      </div>
      
      <div className="flex items-center space-x-3 mt-4 md:mt-0">
        <button
          onClick={onRefresh}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
          title="Refresh"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
        
        <BulkActions
          selectedCount={selectedCount}
          onDelete={onBulkDelete}
          onDuplicate={onBulkDuplicate}
          onExport={onBulkExport}
          onArchive={onBulkArchive}
          onStatusChange={onBulkStatusChange}
          onClearSelection={onClearSelection}
        />
        
        {/* Replace Link with button that opens modal */}
        <button
          onClick={onAddClick}
          className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Experience</span>
        </button>
      </div>
    </div>
  );
};